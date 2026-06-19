const db = require("../config/db");
const generateOrderNumber = require("../utils/generateOrderNumber");

const { calculateOrderTotals } = require("../services/orderService");

exports.createOrder = async (req, res) => {
  try {
    // ✅ YOUR PROJECT AUTH SYSTEM
    const userId = req.customerId;

    const { delivery_date, time_slot, notes, address_id } = req.body;

    // ================= GET CART =================

    const [cartItems] = await db.query(
      `
      SELECT 
        c.*,
        p.price
      FROM cart c
      JOIN products p 
      ON p.id = c.product_id
      WHERE c.user_id = ?
      `,
      [userId],
    );

    // ================= EMPTY CART =================

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // ================= CALCULATIONS =================

    let subtotal = 0;

    cartItems.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    // ================= MINIMUM ORDER =================

    if (subtotal < 2000) {
      return res.status(400).json({
        message: "Minimum cart value should be above ₹2,000",
      });
    }

    // ================= DISCOUNT =================

    const discount = subtotal * 0.15;

    // ================= GST =================

    const gst = (subtotal - discount) * 0.18;

    // ================= SHIPPING =================

    const shipping = subtotal > 5000 ? 0 : 150;

    // ================= FINAL TOTAL =================

    const total = subtotal - discount + gst + shipping;

    // ================= CREATE ORDER =================

    const [orderResult] = await db.query(
      `
      INSERT INTO orders
      (
        user_id,
        total_price,
        status,
        payment_status
      )
      VALUES (?, ?, 'pending', 'pending')
      `,
      [userId, total],
    );

    const orderId = orderResult.insertId;
    const orderNumber = generateOrderNumber(orderId);

    // ================= ORDER ITEMS =================

    for (const item of cartItems) {
      await db.query(
        `
        INSERT INTO order_items
        (
          order_id,
          product_id,
          quantity,
          price
        )
        VALUES (?, ?, ?, ?)
        `,
        [orderId, item.product_id, item.quantity, item.price],
      );
    }

    // ================= CLEAR CART =================

    await db.query(
      `
      DELETE FROM cart
      WHERE user_id = ?
      `,
      [userId],
    );

    // ================= RESPONSE =================

    res.json({
      success: true,
      message: "Order Created",
      orderId,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
