const db = require("../config/db");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [user] = await db.query(
      `
      SELECT *
      FROM customers
      WHERE id = ?
      `,
      [userId],
    );

    const [addresses] = await db.query(
      `
      SELECT *
      FROM addresses
      WHERE customer_id = ?
      `,
      [userId],
    );

    res.json({
      user: user[0],
      addresses,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
