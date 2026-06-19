const ExcelJS = require("exceljs");
const db = require("../config/db");

exports.exportProducts = async (req, res) => {
  try {
    console.log("EXPORT STARTED");

    const [products] = await db.query(`
    SELECT
id,
name,
category,
weight,
price,
stock,
sku,
barcode,
hsn_code,
gst_rate
FROM products
      ORDER BY id ASC
    `);

    console.log("PRODUCT COUNT:", products.length);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Products");

    worksheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 40 },
      { header: "Category", key: "category", width: 25 },
      { header: "Weight", key: "weight", width: 15 },
      { header: "Price", key: "price", width: 15 },
      { header: "Stock", key: "stock", width: 15 },
      { header: "SKU", key: "sku", width: 25 },
      { header: "Barcode", key: "barcode", width: 25 },
      { header: "HSN Code", key: "hsn_code", width: 20 },
      { header: "GST Rate", key: "gst_rate", width: 15 },
    ];

    products.forEach((product) => {
      worksheet.addRow(product);
    });

    console.log("ROWS ADDED");

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader("Content-Disposition", "attachment; filename=products.xlsx");

    console.log("WRITING FILE");

    await workbook.xlsx.write(res);

    console.log("FILE SENT");

    res.end();
  } catch (error) {
    console.error("EXPORT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
