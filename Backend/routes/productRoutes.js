const express = require("express");
const upload = require("../middleware/upload");
const importUpload = require("../middleware/importUpload");
const { importProducts } = require("../controllers/productImportController");
const { exportProducts } = require("../controllers/productExportController");
const {
  updateProductsFromExcel,
} = require("../controllers/productUpdateExcelController");

const router = express.Router();

const db = require("../config/db");

const verifyAdmin = require("../middleware/verifyAdmin");

/* =========================================================
   GET ALL PRODUCTS
========================================================= */

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let sql = "SELECT * FROM products";

    let values = [];

    // FILTER BY CATEGORY
    if (category) {
      sql += " WHERE LOWER(category) = LOWER(?)";

      values.push(category);
    }

    const [rows] = await db.query(sql, values);

    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
});

/* =========================================================
   EXPORT PRODUCTS TO EXCEL
========================================================= */

router.get("/export", verifyAdmin, exportProducts);

/* =========================================================
   UPDATE PRODUCTS FROM EXCEL
========================================================= */

router.post(
  "/update-excel",
  verifyAdmin,
  importUpload.single("excel"),
  updateProductsFromExcel,
);
/* =========================================================
   GET SINGLE PRODUCT
========================================================= */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM products
      WHERE id = ?
      `,
      [id],
    );

    // PRODUCT NOT FOUND
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Database error",
    });
  }
});

/* =========================================================
   ADD PRODUCT
========================================================= */

router.post("/", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      weight,
      price,
      category,
      stock,
      sku,
      barcode,
      gst_rate,
      hsn_code,
    } = req.body;

    // IMAGE
    const image = req.file ? req.file.filename : null;

    const [result] = await db.query(
      `
  INSERT INTO products
  (
    name,
    weight,
    price,
    category,
    stock,
    sku,
    barcode,
    gst_rate,
    hsn_code,
    image,
    purchaseCount,
    stockSold
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
      [
        name,
        weight,
        Number(price),
        category,
        Number(stock),
        sku,
        barcode,
        Number(gst_rate),
        hsn_code,
        image,
        0,
        0,
      ],
    );

    res.json({
      success: true,
      message: "Product added successfully",
      productId: result.insertId,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Product add failed",
    });
  }
});

/* =========================================================
   UPDATE PRODUCT
========================================================= */

router.put("/:id", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      weight,
      price,
      category,
      stock,
      sku,
      barcode,
      gst_rate,
      hsn_code,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    let query = `
      UPDATE products
      SET
        name=?,
        weight=?,
        price=?,
        category=?,
        stock=?,
        sku=?,
        barcode=?,
        gst_rate=?,
        hsn_code=?
    `;

    const values = [
      name,
      weight,
      Number(price),
      category,
      Number(stock),
      sku,
      barcode,
      Number(gst_rate),
      hsn_code,
    ];

    if (image) {
      query += `, image=?`;
      values.push(image);
    }

    query += ` WHERE id=?`;
    values.push(id);

    await db.query(query, values);

    res.json({
      success: true,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
});

/* =========================================================
   DELETE PRODUCT
========================================================= */

router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      DELETE FROM products
      WHERE id=?
      `,
      [id],
    );

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Delete failed",
    });
  }
});

module.exports = router;
