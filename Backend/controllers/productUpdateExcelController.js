const ExcelJS = require("exceljs");
const fs = require("fs");
const db = require("../config/db");

exports.updateProductsFromExcel = async (req, res) => {
  console.log("UPDATE EXCEL ROUTE HIT");

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Excel file required",
      });
    }

    const workbook = new ExcelJS.Workbook();

    await workbook.xlsx.readFile(req.file.path);

    const worksheet = workbook.getWorksheet(1);

    let updated = 0;

    console.log("Total Rows:", worksheet.rowCount);

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      const row = worksheet.getRow(rowNumber);

      const id = row.getCell(1).value;
      const name = row.getCell(2).value;
      const category = row.getCell(3).value;
      const weight = row.getCell(4).value;
      const price = row.getCell(5).value;
      const stock = row.getCell(6).value;
      const sku = row.getCell(7).value;
      const barcode = row.getCell(8).value;
      const hsn_code = row.getCell(9).value;
      const gst_rate = row.getCell(10).value;

      if (!id) continue;

      const [result] = await db.query(
        `
    UPDATE products
SET
  name = ?,
  category = ?,
  weight = ?,
  price = ?,
  stock = ?,
  sku = ?,
  barcode = ?,
  hsn_code = ?,
  gst_rate = ?
WHERE id = ?
    `,
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
          id,
        ],
      );

      updated += result.affectedRows;
    }

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.json({
      success: true,
      updated,
    });
  } catch (error) {
    console.error("EXCEL UPDATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
