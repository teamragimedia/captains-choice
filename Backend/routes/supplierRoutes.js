const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* =========================================================
   GET ALL SUPPLIERS
========================================================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        supplier_name,
        contact_person,
        phone,
        email,
        address,
        gst_number,
        status
      FROM suppliers
      WHERE status = 'active'
      ORDER BY supplier_name ASC
    `);

    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch suppliers",
    });
  }
});

/* =========================================================
   GET SINGLE SUPPLIER
========================================================= */
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      `
      SELECT *
      FROM suppliers
      WHERE id = ?
      `,
      [req.params.id],
    );

    if (!rows.length) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
});

/* =========================================================
   ADD SUPPLIER
========================================================= */
router.post("/", async (req, res) => {
  try {
    const { supplier_name, contact_person, phone, email, address, gst_number } =
      req.body;

    const [result] = await db.query(
      `
      INSERT INTO suppliers
      (
        supplier_name,
        contact_person,
        phone,
        email,
        address,
        gst_number,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, 'active')
      `,
      [supplier_name, contact_person, phone, email, address, gst_number],
    );

    res.json({
      success: true,
      supplierId: result.insertId,
      message: "Supplier created successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to create supplier",
    });
  }
});

module.exports = router;
