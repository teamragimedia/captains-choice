const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/sales", async (req, res) => {
  try {
    const [data] = await db.query(`
    SELECT
o.order_number,
c.name customer,
o.total_price amount,
o.payment_status,
o.created_at date
FROM orders o
LEFT JOIN customers c
ON c.id = o.customer_id
WHERE o.payment_status = 'paid'
ORDER BY o.created_at DESC
    `);

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json([]);
  }
});

router.get("/purchases", async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT
      p.purchase_number,
      s.supplier_name vendor,
      p.total_amount amount,
      p.purchase_date date
      FROM purchases p
      LEFT JOIN suppliers s
      ON s.id = p.supplier_id
      ORDER BY p.purchase_date DESC
    `);

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json([]);
  }
});

router.get("/", async (req, res) => {
  try {
    const [sales] = await db.query(`
      SELECT
      'Sales' type,
      o.order_number reference_no,
      c.name party,
      o.total_price amount,
      o.created_at date
      FROM orders o
LEFT JOIN customers c
ON c.id=o.customer_id
WHERE o.payment_status = 'paid'
    `);

    const [purchases] = await db.query(`
      SELECT
      'Purchase' type,
      p.purchase_number reference_no,
      s.supplier_name party,
      p.total_amount amount,
      p.purchase_date date
      FROM purchases p
      LEFT JOIN suppliers s
      ON s.id=p.supplier_id
    `);

    const transactions = [...sales, ...purchases];

    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(transactions);
  } catch (err) {
    console.log(err);
    res.status(500).json([]);
  }
});

router.get("/summary", async (req, res) => {
  try {
    const [sales] = await db.query(`
      SELECT COALESCE(SUM(total_price),0) totalIn
      FROM orders
      WHERE payment_status = 'paid'
    `);

    const [purchase] = await db.query(`
      SELECT COALESCE(SUM(total_amount),0) totalOut
      FROM purchases
    `);

    const totalIn = Number(sales[0].totalIn);
    const totalOut = Number(purchase[0].totalOut);

    res.json({
      totalIn,
      totalOut,
      netCashFlow: totalIn - totalOut,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({});
  }
});

router.get("/customers", async (req, res) => {
  const [data] = await db.query(`
    SELECT id,name
    FROM customers
    ORDER BY name
  `);

  res.json(data);
});

router.get("/vendors", async (req, res) => {
  const [data] = await db.query(`
    SELECT id,supplier_name
    FROM suppliers
    ORDER BY supplier_name
  `);

  res.json(data);
});

module.exports = router;
