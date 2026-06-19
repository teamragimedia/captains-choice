const express = require("express");

const auth = require("../middleware/auth");

const router = express.Router();

const db = require("../config/db");

/* ================= GET PROFILE ================= */

router.get("/me", async (req, res) => {
  try {
    const customerId = req.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "No customerId",
      });
    }

    const [result] = await db.query(
      `
      SELECT *
      FROM customers
      WHERE id = ?
      `,
      [customerId],
    );

    if (result.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(result[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ================= SUBMIT PROFILE ================= */

router.post("/submit-profile", async (req, res) => {
  try {
    const customerId = req.customerId;

    if (!customerId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const {
      business_name = "",
      name = "",
      email = "",
      phone = "",
      gst = "",
      fssai = "",
      business_type = "",
      monthly_volume = "",
    } = req.body;

    // ================= CHECK =================

    const [checkResult] = await db.query(
      `
          SELECT is_profile_submitted
          FROM customers
          WHERE id = ?
          `,
      [customerId],
    );

    if (checkResult[0]?.is_profile_submitted) {
      return res.status(400).json({
        message: "Already submitted",
      });
    }

    // ================= UPDATE =================

    await db.query(
      `
        UPDATE customers
        SET
          business_name = ?,
          name = ?,
          email = ?,
          phone = ?,
          gst = ?,
          fssai = ?,
          business_type = ?,
          monthly_volume = ?,
          is_profile_submitted = 1,
          is_profile_approved = 0
        WHERE id = ?
        `,
      [
        business_name,
        name,
        email,
        phone,
        gst,
        fssai,
        business_type,
        monthly_volume,
        customerId,
      ],
    );

    res.json({
      success: true,
      message: "Profile submitted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ================= ADMIN APPROVE ================= */

router.put("/approve/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await db.query(
      `
        UPDATE customers
        SET is_profile_approved = 1
        WHERE id = ?
        `,
      [id],
    );

    res.json({
      success: true,
      message: "Approved successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ================= USER STATS ================= */

router.get("/stats", async (req, res) => {
  try {
    res.json({
      totalOrders: 0,
      totalProducts: 0,
      totalUsers: 0,
    });
  } catch (err) {
    res.status(500).json({
      error: "Server error",
    });
  }
});

/* ================= PROFILE (AUTH) ================= */

const { getProfile } = require("../controllers/userController");

router.get("/profile", auth, getProfile);

module.exports = router;
