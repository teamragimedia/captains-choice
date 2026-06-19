const express = require("express");

const db = require("../config/db");

const router = express.Router();

/* ================= GET WISHLIST ================= */

router.get("/my", async (req, res) => {
  try {
    // ✅ Dynamic logged user
    const customerId = req.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer ID missing",
      });
    }

    const [rows] = await db.query(
      `
      SELECT *
      FROM wishlist
      WHERE customer_id = ?
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

/* ================= DELETE WISHLIST ITEM ================= */

router.delete("/:id", async (req, res) => {
  try {
    await db.query(
      `
      DELETE FROM wishlist
      WHERE id = ?
      `,
      [req.params.id],
    );

    res.json({
      success: true,
      message: "Wishlist item removed",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
