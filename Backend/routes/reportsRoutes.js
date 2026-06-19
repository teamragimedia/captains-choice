const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/business-summary", async (req, res) => {
  try {
    const [sales] = await db.query(`
      SELECT COALESCE(SUM(total_price),0) totalSales
      FROM orders
      WHERE payment_status = 'paid'
    `);

    const [purchase] = await db.query(`
      SELECT COALESCE(SUM(total_amount),0) totalPurchases
      FROM purchases
    `);

    const totalSales = Number(sales[0].totalSales);
    const totalPurchases = Number(purchase[0].totalPurchases);

    res.json({
      totalSales,
      totalPurchases,
      totalProfit: totalSales - totalPurchases,
      totalPaymentIn: totalSales,
      totalPaymentOut: totalPurchases,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({});
  }
});

module.exports = router;
