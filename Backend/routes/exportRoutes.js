const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const db = require("../config/db");

/* ===============================
   SALES EXCEL
================================= */

router.get("/sales/excel", async (req, res) => {
  try {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Sales Report");

    worksheet.columns = [
      {
        header: "Customer",
        key: "customer",
        width: 30,
      },
      {
        header: "Orders",
        key: "orders",
        width: 15,
      },
      {
        header: "Sales",
        key: "sales",
        width: 20,
      },
    ];

    const [rows] = await db.query(`
      SELECT
      c.name,
      COUNT(o.id) AS orders,
      SUM(o.total_price) AS sales
      FROM orders o
      LEFT JOIN customers c
      ON c.id=o.customer_id
      GROUP BY c.id
    `);

    rows.forEach((row) => {
      worksheet.addRow({
        customer: row.name,
        orders: row.orders,
        sales: row.sales,
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales-report.xlsx",
    );

    await workbook.xlsx.write(res);

    res.end();
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Export Failed",
    });
  }
});

/* ===============================
   SALES PDF
================================= */

router.get("/sales/pdf", async (req, res) => {
  try {
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales-report.pdf",
    );

    doc.pipe(res);

    doc.fontSize(20).text("Captain's Choice Sales Report");

    doc.moveDown();

    const [rows] = await db.query(`
      SELECT
      c.name,
      COUNT(o.id) AS orders,
      SUM(o.total_price) AS sales
      FROM orders o
      LEFT JOIN customers c
      ON c.id=o.customer_id
      GROUP BY c.id
    `);

    rows.forEach((row) => {
      doc.text(`${row.name} | Orders: ${row.orders} | ₹${row.sales}`);
    });

    doc.end();
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Export Failed",
    });
  }
});

module.exports = router;
