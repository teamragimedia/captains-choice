const db = require("../config/db");

exports.getInventory = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        i.id,
        p.name AS product,
        i.quantity,
        i.type,
        i.reason,
        i.notes,
        i.created_at
      FROM inventory i
      LEFT JOIN products p
        ON p.id = i.product_id
      ORDER BY i.created_at DESC
    `);

    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json([]);
  }
};

exports.addInventoryMovement = async (req, res) => {
  try {
    const { product_id, quantity, type, reason, notes, created_by } = req.body;

    // CHECK CURRENT STOCK
    const [[product]] = await db.query(
      `
      SELECT stock
      FROM products
      WHERE id = ?
      `,
      [product_id],
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // PREVENT NEGATIVE STOCK
    if (type === "OUT" && Number(product.stock) < Number(quantity)) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items available in stock`,
      });
    }

    // INSERT INVENTORY RECORD
    await db.query(
      `
      INSERT INTO inventory
      (
        product_id,
        quantity,
        type,
        reason,
        notes,
        created_by
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [product_id, quantity, type, reason, notes, created_by || null],
    );

    // UPDATE PRODUCT STOCK
    if (type === "IN") {
      await db.query(
        `
        UPDATE products
        SET stock = stock + ?
        WHERE id = ?
        `,
        [quantity, product_id],
      );
    } else {
      await db.query(
        `
        UPDATE products
        SET stock = stock - ?
        WHERE id = ?
        `,
        [quantity, product_id],
      );
    }

    res.json({
      success: true,
      message: "Inventory updated",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed",
    });
  }
};
