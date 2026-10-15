const crypto = require("crypto");
const db = require("../config/db");
const generateOrderNumber = require("../utils/generateOrderNumber");
const { razorpay, keyId } = require("../services/razorpayService");

exports.createOrder = async (req, res) => {
  let connection;
  let orderId;

  try {
    const customerId = Number(req.customerId);

    if (!Number.isInteger(customerId) || customerId <= 0) {
      return res.status(401).json({ message: "Login required" });
    }

    const { address_id, delivery_date, time_slot, notes, offerCode } = req.body;

    if (!address_id || !delivery_date || !time_slot) {
      return res.status(400).json({
        message: "Address, delivery date and time slot are required",
      });
    }

    connection = await db.getConnection();

    await connection.beginTransaction();

    // Verify the address belongs to this authenticated customer.
    const [addresses] = await connection.query(
      `SELECT id FROM addresses WHERE id = ? AND customer_id = ?`,
      [address_id, customerId],
    );

    if (!addresses.length) {
      await connection.rollback();
      return res.status(400).json({
        message: "Invalid delivery address",
      });
    }

    // Lock the cart rows while building the order.
    const [cartItems] = await connection.query(
      `SELECT
         c.product_id,
         c.quantity,
         p.name,
         p.price,
         p.sku,
         p.gst_rate,
         p.hsn_code,
         p.stock
       FROM cart c
       JOIN products p ON p.id = c.product_id
       WHERE c.user_id = ?
       FOR UPDATE`,
      [customerId],
    );

    if (!cartItems.length) {
      await connection.rollback();
      return res.status(400).json({ message: "Cart is empty" });
    }

    let subtotal = 0;

    for (const item of cartItems) {
      const quantity = Number(item.quantity);
      const price = Number(item.price);
      const stock = Number(item.stock);

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0 ||
        !Number.isFinite(price) ||
        price < 0
      ) {
        await connection.rollback();
        return res.status(400).json({
          message: "Invalid product quantity or price",
        });
      }

      if (stock < quantity) {
        await connection.rollback();
        return res.status(400).json({
          message: `Insufficient stock for ${item.name}`,
        });
      }

      subtotal += price * quantity;
    }

    subtotal = Number(subtotal.toFixed(2));

    if (subtotal < 2000) {
      await connection.rollback();
      return res.status(400).json({
        message: "Minimum cart value should be ₹2,000",
      });
    }

    // Only apply the currently defined offer when explicitly supplied.
    // The server, not the browser, decides the discount.
    const discount =
      offerCode === "FIRSTORDERCC" ? Number((subtotal * 0.15).toFixed(2)) : 0;

    const taxableAmount = Number((subtotal - discount).toFixed(2));
    const gst = Number((taxableAmount * 0.18).toFixed(2));
    const shipping = subtotal > 5000 ? 0 : 150;
    const total = Number((taxableAmount + gst + shipping).toFixed(2));

    // The schema requires a unique order_number before insertion.
    const temporaryOrderNumber = `TMP${Date.now()}${crypto.randomBytes(3).toString("hex")}`;

    const [insertResult] = await connection.query(
      `INSERT INTO orders
       (
         customer_id,
         total_price,
         status,
         payment_status,
         payment_method,
         address_id,
         delivery_date,
         time_slot,
         notes,
         order_number,
         subtotal,
         discount,
         gst,
         shipping,
         order_source
       )
       VALUES (?, ?, 'pending', 'pending', 'RAZORPAY',
               ?, ?, ?, ?, ?, ?, ?, ?, ?, 'website')`,
      [
        customerId,
        total,
        address_id,
        delivery_date,
        time_slot,
        notes || null,
        temporaryOrderNumber,
        subtotal,
        discount,
        gst,
        shipping,
      ],
    );

    orderId = insertResult.insertId;
    const orderNumber = generateOrderNumber(orderId);

    await connection.query(`UPDATE orders SET order_number = ? WHERE id = ?`, [
      orderNumber,
      orderId,
    ]);

    for (const item of cartItems) {
      const quantity = Number(item.quantity);
      const price = Number(item.price);
      const lineTotal = Number((price * quantity).toFixed(2));
      const gstRate = Number(item.gst_rate) || 0;
      const lineGst = Number(((lineTotal * gstRate) / 100).toFixed(2));

      await connection.query(
        `INSERT INTO order_items
         (
           order_id,
           product_id,
           product_name,
           hsn_code,
           gst_rate,
           taxable_value,
           cgst_amount,
           sgst_amount,
           igst_amount,
           quantity,
           price,
           total,
           sku
         )
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.name,
          item.hsn_code || null,
          gstRate,
          lineTotal,
          Number((lineGst / 2).toFixed(2)),
          Number((lineGst - Number((lineGst / 2).toFixed(2))).toFixed(2)),
          quantity,
          price,
          lineTotal,
          item.sku || null,
        ],
      );
    }

    await connection.commit();

    // Razorpay amounts are specified in paise.
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: orderNumber,
      notes: {
        database_order_id: String(orderId),
        order_number: orderNumber,
      },
    });

    // Keep the Razorpay order ID for later signature verification.
    await db.query(
      `UPDATE orders
       SET transaction_id = ?, payment_method = 'RAZORPAY'
       WHERE id = ? AND customer_id = ? AND payment_status = 'pending'`,
      [razorpayOrder.id, orderId, customerId],
    );

    return res.status(201).json({
      success: true,
      orderId,
      orderNumber,
      keyId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      customerId,
      message: "Order created. Complete payment to confirm it.",
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (_) {}
    }

    console.error("Create order failed:", error.message);

    return res.status(500).json({
      message: "Unable to create order. Please try again.",
    });
  } finally {
    if (connection) connection.release();
  }
};
