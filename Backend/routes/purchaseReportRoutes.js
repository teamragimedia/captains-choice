// routes/purchaseReportRoutes.js

const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/summary", async (req, res) => {
  try {
    const [amount] = await db.query(`
      SELECT IFNULL(SUM(total_amount),0) totalPurchaseAmount
      FROM purchases
    `);

    const [orders] = await db.query(`
      SELECT COUNT(*) totalPurchaseOrders
      FROM purchases
    `);

    const [suppliers] = await db.query(`
  SELECT COUNT(*) totalSuppliers
  FROM suppliers
`);

    const [products] = await db.query(`
      SELECT IFNULL(SUM(quantity),0) totalProducts
      FROM purchase_items
    `);

    res.json({
      totalPurchaseAmount: amount[0].totalPurchaseAmount,
      totalPurchaseOrders: orders[0].totalPurchaseOrders,
      totalSuppliers: suppliers[0].totalSuppliers,
      totalProducts: products[0].totalProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({});
  }
});

router.get("/supplier-wise", async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT
        s.id,
        s.supplier_name,
        COALESCE(SUM(p.total_amount),0) AS amount,
        COUNT(p.id) AS totalPurchases
      FROM suppliers s
      LEFT JOIN purchases p
        ON p.supplier_id = s.id
      GROUP BY s.id, s.supplier_name
      ORDER BY amount DESC
    `);

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

router.get("/product-wise", async (req, res) => {
  try {
    const [data] = await db.query(`
      SELECT
      pr.name,
      SUM(pi.quantity) qty,
      SUM(pi.total_price) amount
      FROM purchase_items pi
      JOIN products pr ON pr.id = pi.product_id
      GROUP BY pr.id
      ORDER BY qty DESC
    `);

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

router.get("/trend", async (req, res) => {
  try {
    const { filter, from, to } = req.query;

    let query = "";
    let params = [];

    if (filter === "daily") {
      query = `
        SELECT
        DATE(purchase_date) label,
        SUM(total_amount) amount
        FROM purchases
        GROUP BY DATE(purchase_date)
        ORDER BY DATE(purchase_date)
      `;
    } else if (filter === "monthly") {
      query = `
        SELECT
        DATE_FORMAT(purchase_date,'%b %Y') label,
        SUM(total_amount) amount
        FROM purchases
        GROUP BY YEAR(purchase_date), MONTH(purchase_date)
        ORDER BY MIN(purchase_date)
      `;
    } else if (filter === "yearly") {
      query = `
        SELECT
        YEAR(purchase_date) label,
        SUM(total_amount) amount
        FROM purchases
        GROUP BY YEAR(purchase_date)
        ORDER BY YEAR(purchase_date)
      `;
    } else if (from && to) {
      query = `
        SELECT
        DATE(purchase_date) label,
        SUM(total_amount) amount
        FROM purchases
        WHERE purchase_date BETWEEN ? AND ?
        GROUP BY DATE(purchase_date)
        ORDER BY DATE(purchase_date)
      `;

      params = [from, to];
    } else {
      query = `
        SELECT
        DATE_FORMAT(purchase_date,'%b %Y') label,
        SUM(total_amount) amount
        FROM purchases
        GROUP BY YEAR(purchase_date), MONTH(purchase_date)
      `;
    }

    const [data] = await db.query(query, params);

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json([]);
  }
});

module.exports = router;
