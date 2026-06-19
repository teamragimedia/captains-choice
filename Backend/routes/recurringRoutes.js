const express = require("express");

const db = require("../config/db");

const router = express.Router();

/* ================= GET RECURRING ORDERS ================= */

router.get("/my", async (req, res) => {
  try {
    // ✅ Dynamic logged user
    const customerId = req.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer ID missing",
      });
    }

    const [rows] = await db.query(
      `
      SELECT *
      FROM recurring_orders
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

/* ================= CREATE RECURRING ORDER ================= */

router.post("/create", async (req, res) => {
  try {
    const customerId = req.customerId;

    const { productName, frequency, quantity } = req.body;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer ID missing",
      });
    }

    await db.query(
      `
      INSERT INTO recurring_orders
      (
        customer_id,
        product_name,
        frequency,
        quantity,
        status
      )
      VALUES (?, ?, ?, ?, 'active')
      `,
      [customerId, productName, frequency, quantity],
    );

    res.json({
      success: true,
      message: "Recurring order created",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ================= DELETE RECURRING ORDER ================= */

router.delete("/:id", async (req, res) => {
  try {
    await db.query(
      `
      DELETE FROM recurring_orders
      WHERE id = ?
      `,
      [req.params.id],
    );

    res.json({
      success: true,
      message: "Recurring order deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
