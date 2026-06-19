const express = require("express");

const db = require("../config/db");

const router = express.Router();

/* ================= CUSTOMER INVOICES ================= */

router.get("/my", async (req, res) => {
  try {
    // ✅ Dynamic logged customer
    const customerId = req.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer ID missing",
      });
    }

    const [rows] = await db.query(
      `
      SELECT *
      FROM invoices
      WHERE customer_id = ?
      ORDER BY id DESC
      `,
      [customerId],
    );

    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ================= CREATE INVOICE ================= */

router.post("/create", async (req, res) => {
  try {
    const { customer_id, order_id, amount } = req.body;

    // TEMP ADMIN ID
    const adminId = 1;

    await db.query(
      `
      INSERT INTO invoices
      (
        customer_id,
        order_id,
        amount,
        status,
        created_by
      )
      VALUES (?, ?, ?, 'Paid', ?)
      `,
      [customer_id, order_id, amount, adminId],
    );

    res.json({
      success: true,
      message: "Invoice created successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
