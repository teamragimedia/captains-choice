// routes/purchaseReportRoutes.js

const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/summary", async (req, res) => {
  try {
    const [sales] = await db.query(`
  SELECT IFNULL(SUM(total_price),0) totalSales
  FROM orders
  WHERE payment_status = 'paid'
`);

    const [orders] = await db.query(`
  SELECT COUNT(*) totalOrders
  FROM orders
  WHERE payment_status = 'paid'
`);
    const [avg] = await db.query(`
  SELECT IFNULL(AVG(total_price),0) avgOrderValue
  FROM orders
  WHERE payment_status = 'paid'
`);

    res.json({
      totalSales: sales[0].totalSales,
      totalOrders: orders[0].totalOrders,
      avgOrderValue: avg[0].avgOrderValue,
    });
  } catch (err) {
    res.status(500).json({});
  }
});

router.get("/trend", async (req, res) => {
  try {
    const [data] = await db.query(`
     SELECT
DATE_FORMAT(created_at,'%b %Y') label,
SUM(total_price) amount
FROM orders
WHERE payment_status = 'paid'
      GROUP BY YEAR(created_at), MONTH(created_at)
      ORDER BY MIN(created_at)
    `);

    res.json(data);
  } catch (err) {
    res.status(500).json([]);
  }
});

router.get("/top-products", async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT
        p.name,
        SUM(oi.quantity) AS qty,
        SUM(oi.total) AS sales
      FROM order_items oi
JOIN orders o ON o.id = oi.order_id
JOIN products p ON p.id = oi.product_id
WHERE o.payment_status = 'paid'
      GROUP BY p.id, p.name
      ORDER BY qty DESC
      LIMIT 10
    `);

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

router.get("/customer-sales", async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT
        c.name,
        COUNT(o.id) AS orders,
        SUM(o.total_price) AS sales
    FROM orders o
JOIN customers c ON c.id = o.customer_id
WHERE o.payment_status = 'paid'
      GROUP BY c.id, c.name
      ORDER BY sales DESC
    `);

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

router.get("/distribution", async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT
        p.name,
        SUM(oi.quantity) AS qty
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      GROUP BY p.id, p.name
      ORDER BY qty DESC
      LIMIT 6
    `);

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

module.exports = router;
