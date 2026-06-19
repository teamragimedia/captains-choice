const express = require("express");

const router = express.Router();

const db = require("../config/db");

const { createOrder } = require("../controllers/orderController");

// GET ORDERS

router.get("/", async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT
        id,
        total_price,
        status,
        payment_status,
        created_at
      FROM orders
      ORDER BY created_at DESC
    `);

    res.json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).json([]);
  }
});

// CREATE ORDER

router.post("/create", createOrder);

module.exports = router;
