const XLSX = require("xlsx");
const fs = require("fs");
const db = require("../config/db");

exports.importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an Excel file",
      });
    }

    const workbook = XLSX.readFile(req.file.path);

    const sheetName = workbook.SheetNames[0];

    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let imported = 0;
    let skipped = 0;

    for (const row of rows) {
      const name = row.name?.toString().trim();
      const category = row.category?.toString().trim();
      const weight = row.weight?.toString().trim();
      const price = Number(row.price);
      const stock = Number(row.stock);
      const image = row.image?.toString().trim();
      const sku = row.sku?.toString().trim();
      const barcode = row.barcode?.toString().trim();
      const hsn_code = row.hsn_code?.toString().trim();
      const gst_rate = Number(row.gst_rate || 0);

      if (!name) {
        skipped++;
        continue;
      }

      const [existing] = await db.query(
        "SELECT id FROM products WHERE name = ?",
        [name],
      );

      if (existing.length > 0) {
        skipped++;
        continue;
      }

      await db.query(
        `INSERT INTO products
(
  name,
  category,
  weight,
  price,
  stock,
  sku,
  barcode,
  hsn_code,
  gst_rate,
  image,
  purchaseCount,
  stockSold
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)`,
        [
          name,
          category,
          weight,
          price,
          stock,
          sku,
          barcode,
          hsn_code,
          gst_rate,
          image,
        ],
      );

      imported++;
    }

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.json({
      success: true,
      imported,
      skipped,
      total: rows.length,
    });
  } catch (error) {
    console.error("IMPORT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
