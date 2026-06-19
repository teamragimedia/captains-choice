const express = require("express");

const router = express.Router();

const db = require("../config/db");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const SECRET = "captain-secret";

/* ================= ADMIN LOGIN ================= */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      });
    }

    console.log("📥 LOGIN INPUT:", email);

    // ================= GET USER =================

    const [rows] = await db.query(
      `
      SELECT *
      FROM users
      WHERE email = ?
      `,
      [email],
    );

    // USER NOT FOUND
    if (rows.length === 0) {
      console.log("❌ USER NOT FOUND");

      return res.status(400).json({
        message: "User not found",
      });
    }

    const user = rows[0];

    // ================= BLOCK INACTIVE USERS =================

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Your account is inactive. Contact Super Admin.",
      });
    }

    // ================= ROLE CHECK =================

    const role = user.role?.toLowerCase().trim();

    const allowedRoles = ["admin", "manager", "superadmin"];

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    // ================= PASSWORD CHECK =================

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ INVALID PASSWORD");

      return res.status(400).json({
        message: "Invalid password",
      });
    }

    // ================= TOKEN =================

    const token = jwt.sign(
      {
        id: user.id,
        role,
      },
      SECRET,
      {
        expiresIn: "1d",
      },
    );

    // ================= RESPONSE =================

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role,
      },
    });
  } catch (error) {
    console.log("❌ LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
