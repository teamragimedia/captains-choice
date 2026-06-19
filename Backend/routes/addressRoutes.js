const express = require("express");

const db = require("../config/db");

const router = express.Router();

/* =========================================================
   GET ADDRESSES
========================================================= */

router.get("/my", async (req, res) => {
  try {
    const customerId = req.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer ID missing",
      });
    }

    const [rows] = await db.query(
      `
      SELECT *
      FROM addresses
      WHERE customer_id = ?
      ORDER BY is_primary DESC
      `,
      [customerId],
    );

    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================================================
   ADD ADDRESS
========================================================= */

router.post("/create", async (req, res) => {
  try {
    const customerId = req.customerId;

    const { name, address_line, city, pincode, phone, type } = req.body;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer ID missing",
      });
    }

    await db.query(
      `
      INSERT INTO addresses
      (
        customer_id,
        name,
        address_line,
        city,
        pincode,
        phone,
        type,
        is_primary
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
      `,
      [customerId, name, address_line, city, pincode, phone, type],
    );

    res.json({
      success: true,
      message: "Address added successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================================================
   SET PRIMARY ADDRESS
========================================================= */
router.put("/set-primary/:id", async (req, res) => {
  try {
    const customerId =
      req.customerId || req.user?.customerId || req.body.customer_id;

    const addressId = req.params.id;

    await db.query(
      `
      UPDATE addresses
      SET is_primary = 0
      WHERE customer_id = ?
      `,
      [customerId],
    );

    await db.query(
      `
      UPDATE addresses
      SET is_primary = 1
      WHERE id = ?
      AND customer_id = ?
      `,
      [addressId, customerId],
    );

    res.json({
      success: true,
      message: "Primary address updated",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================================================
   UPDATE ADDRESS
========================================================= */

router.put("/:id", async (req, res) => {
  try {
    const customerId =
      req.customerId || req.user?.customerId || req.body.customer_id;
    console.log("FINAL CUSTOMER ID:", customerId);
    const addressId = req.params.id;

    const { name, address_line, city, pincode, phone, type } = req.body;

    console.log("BODY:", req.body);
    console.log("ADDRESS ID:", addressId);
    console.log("CUSTOMER ID:", customerId);

    const [result] = await db.query(
      `
      UPDATE addresses
      SET
        name = ?,
        address_line = ?,
        city = ?,
        pincode = ?,
        phone = ?,
        type = ?
      WHERE id = ?
      AND customer_id = ?
      `,
      [name, address_line, city, pincode, phone, type, addressId, customerId],
    );

    console.log("UPDATE RESULT:", result);

    res.json({
      success: true,
      affectedRows: result.affectedRows,
      message: "Address updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
});

/* =========================================================
   DELETE ADDRESS
========================================================= */

router.delete("/:id", async (req, res) => {
  try {
    await db.query(
      `
      DELETE FROM addresses
      WHERE id = ?
      `,
      [req.params.id],
    );

    res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
