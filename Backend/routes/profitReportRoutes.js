const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        o.order_number AS invoiceNo,
        p.name AS productName,
        p.category,

        oi.quantity,

        oi.total AS sellingPrice,

        (
          SELECT pi.purchase_price
          FROM purchase_items pi
          WHERE pi.product_id = oi.product_id
          ORDER BY pi.id DESC
          LIMIT 1
        ) * oi.quantity AS purchaseCost

      FROM order_items oi

      JOIN orders o
      ON o.id = oi.order_id

      JOIN products p
      ON p.id = oi.product_id

      ORDER BY o.created_at DESC
    `);

    const report = rows.map((item) => {
      const sellingPrice = Number(item.sellingPrice || 0);

      const purchaseCost = Number(item.purchaseCost || 0);

      const grossProfit = sellingPrice - purchaseCost;

      const profitPercentage =
        sellingPrice > 0 ? ((grossProfit / sellingPrice) * 100).toFixed(2) : 0;

      return {
        ...item,
        grossProfit,
        profitPercentage,
      };
    });

    res.json(report);
  } catch (err) {
    console.log(err);
    res.status(500).json([]);
  }
});

module.exports = router;
