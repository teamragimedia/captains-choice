const db = require("../config/db");

// ================= GET CART =================

exports.getCart = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    const [rows] = await db.query(
      `
      SELECT 
        c.product_id,
        c.quantity,
        p.name,
        p.price,
        p.image,
        p.weight
      FROM cart c
      JOIN products p 
      ON p.id = c.product_id
      WHERE c.user_id = ?
      `,
      [customerId],
    );

    res.json({
      cart: rows,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= ADD TO CART =================

exports.addToCart = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    const { product_id, quantity } = req.body;

    const [existing] = await db.query(
      `
      SELECT * FROM cart
      WHERE user_id = ? AND product_id = ?
      `,
      [customerId, product_id],
    );

    if (existing.length > 0) {
      await db.query(
        `
        UPDATE cart
        SET quantity = quantity + ?
        WHERE user_id = ? AND product_id = ?
        `,
        [quantity, customerId, product_id],
      );
    } else {
      await db.query(
        `
        INSERT INTO cart
        (user_id, product_id, quantity)
        VALUES (?, ?, ?)
        `,
        [customerId, product_id, quantity],
      );
    }

    res.json({
      success: true,
      message: "Added To Cart",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= UPDATE CART =================

exports.updateCart = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    const { product_id, quantity } = req.body;

    await db.query(
      `
      UPDATE cart
      SET quantity = ?
      WHERE user_id = ? AND product_id = ?
      `,
      [quantity, customerId, product_id],
    );

    res.json({
      success: true,
      message: "Cart Updated",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

// ================= REMOVE ITEM =================

exports.removeCartItem = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    const productId = req.params.productId;

    await db.query(
      `
      DELETE FROM cart
      WHERE user_id = ? AND product_id = ?
      `,
      [customerId, productId],
    );

    res.json({
      success: true,
      message: "Item Removed",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
