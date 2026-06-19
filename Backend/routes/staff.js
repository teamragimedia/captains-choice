const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [staff] = await db.query(`
      SELECT
        id,
        name,
        email,
        phone,
        role,
        status,
        created_at

      FROM users

      WHERE role NOT IN ('admin', 'superadmin')

      ORDER BY created_at DESC
    `);

    res.json(staff);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
});

module.exports = router;
