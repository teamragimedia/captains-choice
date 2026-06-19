const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [sales] = await db.query(`
      SELECT IFNULL(SUM(total_price),0) AS totalSales
      FROM orders
    `);

    const [orders] = await db.query(`
      SELECT COUNT(*) AS totalOrders
      FROM orders
    `);

    const [customers] = await db.query(`
      SELECT COUNT(*) AS totalCustomers
      FROM customers
    `);

    const [avg] = await db.query(`
      SELECT IFNULL(AVG(total_price),0) AS avgOrderValue
      FROM orders
    `);

    const [waste] = await db.query(`
      SELECT IFNULL(SUM(quantity),0) AS totalWaste
      FROM inventory
      WHERE type='OUT'
    `);

    res.json({
      totalSales: sales[0].totalSales,
      totalOrders: orders[0].totalOrders,
      totalCustomers: customers[0].totalCustomers,
      avgOrderValue: avg[0].avgOrderValue,
      totalWaste: waste[0].totalWaste,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      totalSales: 0,
      totalOrders: 0,
      totalCustomers: 0,
      avgOrderValue: 0,
      totalWaste: 0,
    });
  }
});

router.get("/sales-trend", async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT
      DATE(created_at) as day,
      SUM(total_price) as sales
      FROM orders
      GROUP BY DATE(created_at)
      ORDER BY day
    `);

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

router.get("/top-products", async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT
      p.id,
      p.name,
      SUM(oi.quantity) AS sold_qty
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      GROUP BY p.id, p.name
      ORDER BY sold_qty DESC
      LIMIT 10
    `);

    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

module.exports = router;
