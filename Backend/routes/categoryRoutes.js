const express = require("express");

const router = express.Router();

const db = require("../config/db");

/* ================= GET ALL CATEGORIES ================= */

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM categories
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ================= GET ACTIVE CATEGORIES ================= */

router.get("/active", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM categories
      WHERE status = 'active'
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ================= ADD CATEGORY ================= */

router.post("/", async (req, res) => {
  try {
    const { name, icon, color } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO categories
      (
        name,
        icon,
        color,
        status
      )
      VALUES (?, ?, ?, ?)
      `,
      [name, icon, color, "active"],
    );

    res.json({
      success: true,
      id: result.insertId,
      message: "Category added",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ================= TOGGLE STATUS ================= */

router.put("/toggle/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT status
      FROM categories
      WHERE id = ?
      `,
      [id],
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    const currentStatus = rows[0].status;

    const newStatus = currentStatus === "active" ? "inactive" : "active";

    await db.query(
      `
      UPDATE categories
      SET status = ?
      WHERE id = ?
      `,
      [newStatus, id],
    );

    res.json({
      success: true,
      status: newStatus,
      message: "Status updated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

/* ================= DELETE CATEGORY ================= */

router.delete("/:id", async (req, res) => {
  try {
    await db.query(
      `
      DELETE FROM categories
      WHERE id = ?
      `,
      [req.params.id],
    );

    res.json({
      success: true,
      message: "Category deleted",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

module.exports = router;
