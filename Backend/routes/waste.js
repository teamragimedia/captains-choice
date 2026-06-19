const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* ===================================
   ADD WASTE OUT
=================================== */

router.post("/add", async (req, res) => {
  try {
    const { product_id, quantity, reason, notes, created_by } = req.body;

    // CHECK PRODUCT
    const [product] = await db.query(
      `
      SELECT stock
      FROM products
      WHERE id=?
    `,
      [product_id],
    );

    if (product.length === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const currentStock = product[0].stock;

    // VALIDATION
    if (quantity > currentStock) {
      return res.status(400).json({
        error: "Not enough stock",
      });
    }

    // INSERT INVENTORY OUT
    await db.query(
      `
      INSERT INTO inventory
      (
        product_id,
        quantity,
        type,
        reason,
        notes,
        created_by
      )
      VALUES (?, ?, 'OUT', ?, ?, ?)
    `,
      [product_id, quantity, reason, notes, created_by],
    );

    // REDUCE PRODUCT STOCK
    await db.query(
      `
      UPDATE products
      SET stock = stock - ?
      WHERE id=?
    `,
      [quantity, product_id],
    );

    res.json({
      success: true,
      message: "Waste recorded successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Waste tracking failed",
    });
  }
});

/* ===================================
   TODAY WASTE
=================================== */

router.get("/today", async (req, res) => {
  try {
    const [todayWaste] = await db.query(`
      SELECT
        IFNULL(SUM(quantity),0) AS totalWaste
      FROM inventory
      WHERE type='OUT'
      AND DATE(created_at)=CURDATE()
    `);

    res.json({
      totalWaste: todayWaste[0]?.totalWaste || 0,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      totalWaste: 0,
    });
  }
});

/* ===================================
   WASTE HISTORY
=================================== */

router.get("/history", async (req, res) => {
  try {
    const [history] = await db.query(`
      SELECT
        inventory.id,
        products.name AS product_name,
        inventory.quantity,

        products.price AS cost_price,

        (inventory.quantity * products.price) AS waste_amount,

        inventory.reason,
        inventory.notes,
        inventory.created_at

      FROM inventory

      JOIN products
      ON products.id = inventory.product_id

      WHERE inventory.type='OUT'

      ORDER BY inventory.created_at DESC
    `);

    res.json(history);
  } catch (error) {
    console.log(error);

    res.status(500).json([]);
  }
});

module.exports = router;
