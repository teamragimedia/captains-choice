const express = require("express");
const router = express.Router();

const db = require("../config/db");
const Auth = require("../middleware/Auth");
const AdminAuth = require("../middleware/AdminAuth");

const {
  createOrder,
  previewOrder,
  getOrderById,
} = require("../controllers/orderController");

/*
|--------------------------------------------------------------------------
| CUSTOMER: GET MY ORDERS
| GET /api/orders/my-orders
|--------------------------------------------------------------------------
*/
router.get("/my-orders", Auth, async (req, res) => {
  try {
    const customerId = Number(req.customerId);

    if (!Number.isSafeInteger(customerId) || customerId <= 0) {
      return res.status(401).json({
        success: false,
        message: "Please log in to view your orders.",
      });
    }

    const [orders] = await db.query(
      `SELECT
        id,
        order_number,
        total_price,
        status,
        payment_status,
        payment_method,
        created_at
      FROM orders
      WHERE customer_id = ?
      ORDER BY created_at DESC`,
      [customerId],
    );

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch customer orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your orders.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| CUSTOMER: PREVIEW CART TOTALS
| GET /api/orders/preview
|--------------------------------------------------------------------------
*/
router.get("/preview", Auth, previewOrder);

/*
|--------------------------------------------------------------------------
| CUSTOMER: CREATE ORDER
| POST /api/orders/create
|--------------------------------------------------------------------------
*/
router.post("/create", Auth, createOrder);

/*
|--------------------------------------------------------------------------
| ADMIN: GET ORDER DETAILS
| GET /api/orders/admin/:id
|--------------------------------------------------------------------------
| Returns order data, customer data and ordered products.
*/

router.get("/admin/:id", AdminAuth, async (req, res) => {
  const orderId = Number(req.params.id);

  if (!Number.isSafeInteger(orderId) || orderId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID.",
    });
  }

  try {
    // Fetch order
    const [orderRows] = await db.query(
      `SELECT *
       FROM orders
       WHERE id = ?
       LIMIT 1`,
      [orderId],
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const order = orderRows[0];

    // Fetch customer
    const [customerRows] = await db.query(
      `SELECT *
       FROM customers
       WHERE id = ?
       LIMIT 1`,
      [order.customer_id],
    );

    const customer = customerRows[0] || null;

    // Fetch customer's saved addresses
    const [addressRows] = await db.query(
      `SELECT
         id,
         user_id,
         customer_id,
         name,
         address_line,
         city,
         state,
         country,
         pincode,
         phone,
         is_primary,
         type
       FROM addresses
       WHERE customer_id = ?
          OR user_id = ?
       ORDER BY is_primary DESC, id DESC`,
      [order.customer_id, order.customer_id],
    );

    // Prefer the customer's primary address, then the most recent.
    const address = addressRows[0] || null;

    // Fetch order items
    const [items] = await db.query(
      `SELECT *
       FROM order_items
       WHERE order_id = ?
       ORDER BY id ASC`,
      [orderId],
    );

    return res.status(200).json({
      success: true,
      order: {
        ...order,
        customer,
        address,
        addresses: addressRows,
        items,
      },
    });
  } catch (error) {
    console.error("Admin fetch order details error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch order details.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| CUSTOMER: GET ONE OF THEIR OWN ORDERS
| GET /api/orders/:id
|--------------------------------------------------------------------------
| Existing customer controller and authentication are preserved.
*/
router.get("/:id", Auth, getOrderById);

/*
|--------------------------------------------------------------------------
| ADMIN: GET ALL ORDERS
| GET /api/orders
|--------------------------------------------------------------------------
*/
router.get("/", AdminAuth, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT
        o.id,
        o.order_number,
        o.customer_id,
        o.subtotal,
        o.discount,
        o.gst,
        o.shipping,
        o.total_price,
        o.status,
        o.payment_status,
        o.payment_method,
        o.created_at,
        c.name AS customer_name,
        c.email AS customer_email,
        c.phone AS customer_phone
      FROM orders o
      LEFT JOIN customers c
        ON c.id = o.customer_id
      ORDER BY o.created_at DESC`,
    );

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch admin orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders.",
    });
  }
});

/*
|--------------------------------------------------------------------------
| ADMIN: UPDATE ORDER STATUS
| PATCH /api/orders/:id/status
|--------------------------------------------------------------------------
*/
router.patch("/:id/status", AdminAuth, async (req, res) => {
  const orderId = Number(req.params.id);
  const requestedStatus = String(req.body.status || "")
    .trim()
    .toLowerCase();

  const allowedStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (!Number.isSafeInteger(orderId) || orderId <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID.",
    });
  }

  if (!allowedStatuses.includes(requestedStatus)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status.",
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.query(
      `SELECT id, status, payment_status
       FROM orders
       WHERE id = ?
       FOR UPDATE`,
      [orderId],
    );

    if (rows.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    const order = rows[0];
    const paymentStatus = String(order.payment_status || "")
      .trim()
      .toLowerCase();

    // Prevent shipment before confirmed payment.
    if (
      ["shipped", "delivered"].includes(requestedStatus) &&
      paymentStatus !== "paid"
    ) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message:
          "Payment must be confirmed before the order can be shipped or delivered.",
      });
    }

    // Prevent reopening a cancelled order through this endpoint.
    if (
      String(order.status || "").toLowerCase() === "cancelled" &&
      requestedStatus !== "cancelled"
    ) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "A cancelled order cannot be reopened through this endpoint.",
      });
    }

    await connection.query(
      `UPDATE orders
       SET status = ?
       WHERE id = ?`,
      [requestedStatus, orderId],
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order: {
        id: orderId,
        status: requestedStatus,
        payment_status: order.payment_status,
      },
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error("Order rollback error:", rollbackError);
      }
    }

    console.error("Admin update order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update order status.",
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

module.exports = router;
