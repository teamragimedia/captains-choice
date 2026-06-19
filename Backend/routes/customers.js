const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [customers] = await db.query(`
      SELECT
        id,
        name,
        email,
        phone,
        business_name,
        business_type,
        monthly_volume,
        is_profile_approved,
        created_at

      FROM customers

      ORDER BY created_at DESC
    `);

    res.json(customers);
  } catch (error) {
    console.log(error);

    res.status(500).json([]);
  }
});

module.exports = router;
