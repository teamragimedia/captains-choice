const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/summary", async (req, res) => {
  try {
    const [currentMonth] = await db.query(`
  SELECT
    COALESCE(SUM(total_price),0) sales,
    COUNT(*) orders
  FROM orders
  WHERE payment_status='paid'
  AND MONTH(created_at)=MONTH(CURRENT_DATE())
  AND YEAR(created_at)=YEAR(CURRENT_DATE())
`);

    const [lastMonth] = await db.query(`
      SELECT
      COALESCE(SUM(total_price),0) sales,
      COUNT(*) orders
      FROM orders
      WHERE payment_status='paid'
      AND MONTH(created_at)=MONTH(DATE_SUB(CURRENT_DATE(),INTERVAL 1 MONTH))
      AND YEAR(created_at)=YEAR(DATE_SUB(CURRENT_DATE(),INTERVAL 1 MONTH))
    `);

    const [currentYear] = await db.query(`
      SELECT
      COALESCE(SUM(total_price),0) sales,
      COUNT(*) orders
      FROM orders
      WHERE payment_status='paid'
      AND YEAR(created_at)=YEAR(CURRENT_DATE())
    `);

    const [lastYear] = await db.query(`
      SELECT
      COALESCE(SUM(total_price),0) sales,
      COUNT(*) orders
      FROM orders
      WHERE payment_status='paid'
      AND YEAR(created_at)=YEAR(CURRENT_DATE())-1
    `);

    res.json({
      currentMonth: currentMonth[0],
      lastMonth: lastMonth[0],
      currentYear: currentYear[0],
      lastYear: lastYear[0],
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({});
  }
});

module.exports = router;
