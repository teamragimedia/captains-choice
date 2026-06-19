const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/gstr1", async (req, res) => {
  try {
    const { from, to } = req.query;

    const [rows] = await db.query(
      `
  SELECT
    o.order_number AS invoiceNumber,
    DATE(o.created_at) AS invoiceDate,

    c.gst AS customerGSTIN,
    c.name AS customerName,

    COALESCE(a.state, 'N/A') AS placeOfSupply,

    oi.hsn_code AS hsnCode,
    oi.taxable_value AS taxableValue,
    oi.gst_rate AS gstRate,

    oi.cgst_amount AS cgstAmount,
    oi.sgst_amount AS sgstAmount,
    oi.igst_amount AS igstAmount

  FROM orders o

  INNER JOIN customers c
    ON c.id = o.customer_id

  LEFT JOIN addresses a
    ON a.customer_id = c.id
    AND a.is_primary = 1

  INNER JOIN order_items oi
    ON oi.order_id = o.id

  WHERE DATE(o.created_at)
  BETWEEN ? AND ?

  ORDER BY o.created_at DESC
  `,
      [from, to],
    );

    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

router.get("/gstr3b", async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({
        message: "Month and Year are required",
      });
    }

    // Step 1: Auto Calculated GST
    const [salesData] = await db.query(
      `
      SELECT
        IFNULL(SUM(taxable_value),0) AS totalTaxableSales,

        IFNULL(
          SUM(cgst_amount + sgst_amount + igst_amount),
          0
        ) AS gstCollected

      FROM order_items oi

      INNER JOIN orders o
      ON o.id = oi.order_id

      WHERE MONTH(o.created_at) = ?
      AND YEAR(o.created_at) = ?
      `,
      [month, year],
    );

    // Step 2: Manual Ledger Data
    const [ledgerData] = await db.query(
      `
      SELECT
        gst_paid,
        input_tax_credit,
        notes
      FROM gst_monthly_ledger
      WHERE month = ?
      AND year = ?
      `,
      [month, year],
    );

    const gstPaid = ledgerData[0]?.gst_paid || 0;

    const inputTaxCredit = ledgerData[0]?.input_tax_credit || 0;

    const netGstLiability =
      Number(salesData[0].gstCollected) -
      Number(gstPaid) -
      Number(inputTaxCredit);

    res.json({
      month,
      year,

      totalTaxableSales: salesData[0].totalTaxableSales,

      gstCollected: salesData[0].gstCollected,

      gstPaid,

      inputTaxCredit,

      netGstLiability,

      notes: ledgerData[0]?.notes || "",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.post("/gstr3b/ledger", async (req, res) => {
  try {
    const { month, year, gstPaid, inputTaxCredit, notes } = req.body;

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and Year are required",
      });
    }

    await db.query(
      `
      INSERT INTO gst_monthly_ledger
      (
        month,
        year,
        gst_paid,
        input_tax_credit,
        notes
      )
      VALUES
      (
        ?, ?, ?, ?, ?
      )

      ON DUPLICATE KEY UPDATE

      gst_paid = VALUES(gst_paid),
      input_tax_credit = VALUES(input_tax_credit),
      notes = VALUES(notes)
      `,
      [month, year, gstPaid || 0, inputTaxCredit || 0, notes || ""],
    );

    res.json({
      success: true,
      message: "GST Ledger saved successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});
module.exports = router;
