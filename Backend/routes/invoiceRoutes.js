const express = require("express");
const router = express.Router();

const db = require("../config/db");
const Auth = require("../middleware/Auth");
const AdminAuth = require("../middleware/AdminAuth");

/* =========================================
   CUSTOMER: GET MY INVOICES
   GET /api/invoices/my
========================================= */
router.get("/my", Auth, async (req, res) => {
  try {
    const customerId = Number(req.customerId);

    if (!Number.isSafeInteger(customerId) || customerId <= 0) {
      return res.status(401).json({
        success: false,
        message: "Please log in to view invoices.",
      });
    }

    const [invoices] = await db.query(
      `SELECT *
       FROM invoices
       WHERE customer_id = ?
       ORDER BY id DESC`,
      [customerId],
    );

    return res.json({ success: true, invoices });
  } catch (error) {
    console.error("Fetch customer invoices error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch invoices.",
    });
  }
});

/* =========================================
   ADMIN: GET ALL INVOICES
   GET /api/invoices
========================================= */
router.get("/", AdminAuth, async (req, res) => {
  try {
    const [invoices] = await db.query(
      `SELECT
         i.*,
         c.name AS customer_name,
         c.email AS customer_email,
         c.phone AS customer_phone
       FROM invoices i
       LEFT JOIN customers c ON c.id = i.customer_id
       ORDER BY i.id DESC`,
    );

    return res.json({ success: true, invoices });
  } catch (error) {
    console.error("Fetch all invoices error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch invoices.",
    });
  }
});

/* =========================================
   ADMIN: CREATE INVOICE
   POST /api/invoices/create
========================================= */
router.post("/create", AdminAuth, async (req, res) => {
  try {
    const customerId = Number(req.body.customer_id);
    const orderId = Number(req.body.order_id);
    const amount = Number(req.body.amount);

    if (
      !Number.isSafeInteger(customerId) ||
      customerId <= 0 ||
      !Number.isSafeInteger(orderId) ||
      orderId <= 0 ||
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid customer ID, order ID and amount are required.",
      });
    }

    const [orders] = await db.query(
      `SELECT id, customer_id, total_price, payment_status
       FROM orders
       WHERE id = ?
       LIMIT 1`,
      [orderId],
    );

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const order = orders[0];

    if (Number(order.customer_id) !== customerId) {
      return res.status(400).json({
        success: false,
        message: "The order does not belong to this customer.",
      });
    }

    const orderAmount = Number(order.total_price);

    if (!Number.isFinite(orderAmount) || orderAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "The order has an invalid total.",
      });
    }

    const paymentStatus = String(order.payment_status || "").toLowerCase();

    if (!["paid", "captured"].includes(paymentStatus)) {
      return res.status(409).json({
        success: false,
        message: "An invoice can only be created for a paid order.",
      });
    }

    const adminId =
      req.admin?.id ?? req.admin?.adminId ?? req.admin?.userId ?? null;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Admin identity is missing from the login token.",
      });
    }

    const [result] = await db.query(
      `INSERT INTO invoices
         (customer_id, order_id, amount, status, created_by)
       VALUES (?, ?, ?, 'Paid', ?)`,
      [customerId, orderId, orderAmount, adminId],
    );

    const [createdInvoices] = await db.query(
      `SELECT *
       FROM invoices
       WHERE id = ?
       LIMIT 1`,
      [result.insertId],
    );

    return res.status(201).json({
      success: true,
      message: "Invoice created successfully.",
      invoice: createdInvoices[0],
    });
  } catch (error) {
    console.error("Create invoice error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create invoice.",
    });
  }
});

/* =========================================
   ADMIN: GET SINGLE INVOICE DETAILS
   GET /api/invoices/:id
========================================= */
router.get("/:id", AdminAuth, async (req, res) => {
  try {
    const invoiceId = Number(req.params.id);

    if (!Number.isSafeInteger(invoiceId) || invoiceId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice ID.",
      });
    }

    const [invoices] = await db.query(
      `SELECT
         i.*,
         c.name AS customer_name,
         c.email AS customer_email,
         c.phone AS customer_phone,
         o.order_number,
         o.created_at AS order_created_at,
         o.payment_status AS order_payment_status,
         o.payment_method AS order_payment_method
       FROM invoices i
       LEFT JOIN customers c
         ON c.id = i.customer_id
       LEFT JOIN orders o
         ON o.id = i.order_id
       WHERE i.id = ?
       LIMIT 1`,
      [invoiceId],
    );

    if (!invoices.length) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found.",
      });
    }

    const invoice = invoices[0];

    // Keep the original invoice status, but expose the order's
    // actual payment details under the field names the UI can use.
    invoice.payment_status =
      invoice.order_payment_status ||
      invoice.payment_status ||
      invoice.status ||
      null;

    invoice.payment_method =
      invoice.order_payment_method || invoice.payment_method || null;

    return res.json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error("Fetch invoice details error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load invoice details.",
      error: error.message,
    });
  }
});

module.exports = router;
