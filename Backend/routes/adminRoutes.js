const express = require("express");

const router = express.Router();

const db = require("../config/db");

const bcrypt = require("bcrypt");

/* =========================================================
   ALL USERS
========================================================= */

router.get("/all-users", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *,
      CASE 
        WHEN is_profile_submitted = 1 
             AND is_profile_approved = 0 
        THEN 'pending'

        WHEN is_profile_approved = 1 
        THEN 'approved'

        WHEN is_profile_approved = -1 
        THEN 'rejected'

        ELSE 'not_submitted'
      END AS status

      FROM customers

      ORDER BY created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================================================
   APPROVE USER
========================================================= */

router.put("/approve/:id", async (req, res) => {
  try {
    const { id } = req.params;

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
      message: "User approved",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================================================
   REJECT USER
========================================================= */

router.put("/reject/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { reason } = req.body;

    await db.query(
      `
      UPDATE customers
      SET
        is_profile_approved = -1,
        rejection_reason = ?
      WHERE id = ?
      `,
      [reason, id],
    );

    res.json({
      success: true,
      message: "Rejected",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================================================
   SINGLE USER
========================================================= */

router.get("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT *
      FROM customers
      WHERE id = ?
      `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================================================
   GET ADMINS
========================================================= */

router.get("/admins", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        name,
        email,
        phone,
        role,
        status
      FROM users
      WHERE role IN
      (
        'admin',
        'manager',
        'superadmin'
      )
    `);

    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================================================
   CREATE ADMIN
========================================================= */

router.post("/admins", async (req, res) => {
  try {
    const { name, email, phone, role, password, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    // ================= HASH PASSWORD =================

    const hashed = await bcrypt.hash(password, 10);

    // ================= INSERT =================

    await db.query(
      `
      INSERT INTO users
      (
        name,
        email,
        phone,
        role,
        password,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [name, email, phone, role, hashed, status || "active"],
    );

    res.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================================================
   UPDATE ADMIN
========================================================= */

router.put("/admins/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { role, status } = req.body;

    await db.query(
      `
      UPDATE users
      SET
        role = COALESCE(?, role),
        status = COALESCE(?, status)
      WHERE id = ?
      `,
      [
        role !== undefined ? role : null,

        status !== undefined ? status : null,

        id,
      ],
    );

    res.json({
      success: true,
      message: "Updated successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* =========================================================
   DELETE ADMIN
========================================================= */

router.delete("/admins/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      `
      DELETE FROM users
      WHERE id = ?
      `,
      [id],
    );

    res.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
