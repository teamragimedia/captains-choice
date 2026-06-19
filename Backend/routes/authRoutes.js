// routes/auth.js

const express = require("express");

const router = express.Router();

const db = require("../config/db");

/* ================= VERIFY OTP ================= */

router.post("/verify-otp", async (req, res) => {
  try {
    console.log("✅ VERIFY OTP API HIT");

    const { phone } = req.body;

    // ================= CHECK USER =================

    const [result] = await db.query(
      `
        SELECT *
        FROM customers
        WHERE phone = ?
        `,
      [phone],
    );

    // ================= NEW USER =================

    if (result.length === 0) {
      const [insertRes] = await db.query(
        `
            INSERT INTO customers (phone)
            VALUES (?)
            `,
        [phone],
      );

      return res.json({
        customerId: insertRes.insertId,

        isNewUser: true,
      });
    }

    // ================= EXISTING USER =================

    const user = result[0];

    return res.json({
      customerId: user.id,

      isNewUser: !user.is_profile_submitted,
    });
  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
