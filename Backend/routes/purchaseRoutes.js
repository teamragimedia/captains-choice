const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* =========================================================
   GET ALL PURCHASES
========================================================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        p.id,
        p.purchase_number,
        p.invoice_number,
        p.purchase_date,
        p.total_amount,
        p.notes,
        s.supplier_name
      FROM purchases p
      LEFT JOIN suppliers s
        ON s.id = p.supplier_id
      ORDER BY p.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch purchases",
    });
  }
});

/* =========================================================
   GET SINGLE PURCHASE
========================================================= */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [purchase] = await db.query(
      `
      SELECT *
      FROM purchases
      WHERE id = ?
      `,
      [id],
    );

    if (!purchase.length) {
      return res.status(404).json({
        success: false,
        message: "Purchase not found",
      });
    }

    const [items] = await db.query(
      `
      SELECT
        pi.*,
        pr.name AS product_name
      FROM purchase_items pi
      LEFT JOIN products pr
        ON pr.id = pi.product_id
      WHERE pi.purchase_id = ?
      `,
      [id],
    );

    res.json({
      purchase: purchase[0],
      items,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch purchase",
    });
  }
});

/* =========================================================
   CREATE PURCHASE
========================================================= */
router.post("/", async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      supplier_id,
      invoice_number,
      purchase_date,
      notes,
      created_by,
      items,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Purchase items required",
      });
    }

    const purchaseNumber = "PUR" + Date.now().toString().slice(-8);

    let totalAmount = 0;

    for (const item of items) {
      totalAmount += Number(item.total_price || 0);
    }

    const [purchaseResult] = await connection.query(
      `
      INSERT INTO purchases
      (
        purchase_number,
        supplier_id,
        invoice_number,
        total_amount,
        notes,
        purchase_date,
        created_by
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        purchaseNumber,
        supplier_id,
        invoice_number,
        totalAmount,
        notes,
        purchase_date,
        created_by || null,
      ],
    );

    const purchaseId = purchaseResult.insertId;

    for (const item of items) {
      await connection.query(
        `
        INSERT INTO purchase_items
        (
          purchase_id,
          product_id,
          quantity,
          purchase_price,
          hsn_code,
          gst_rate,
          taxable_value,
          cgst_amount,
          sgst_amount,
          igst_amount,
          total_price
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          purchaseId,
          item.product_id,
          item.quantity,
          item.purchase_price,
          item.hsn_code,
          item.gst_rate,
          item.taxable_value,
          item.cgst_amount,
          item.sgst_amount,
          item.igst_amount,
          item.total_price,
        ],
      );

      /* STOCK INCREASE */
      await connection.query(
        `
        UPDATE products
        SET stock = stock + ?
        WHERE id = ?
        `,
        [item.quantity, item.product_id],
      );

      /* INVENTORY ENTRY */
      await connection.query(
        `
        INSERT INTO inventory
        (
          product_id,
          quantity,
          type,
          reason,
          notes
        )
        VALUES (?, ?, 'IN', 'Purchase', ?)
        `,
        [item.product_id, item.quantity, invoice_number || "Purchase Entry"],
      );
    }

    await connection.commit();

    res.json({
      success: true,
      purchaseId,
      purchaseNumber,
      message: "Purchase saved successfully",
    });
  } catch (error) {
    await connection.rollback();

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Purchase save failed",
    });
  } finally {
    connection.release();
  }
});

module.exports = router;
