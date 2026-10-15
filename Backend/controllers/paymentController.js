const crypto = require("crypto");
const db = require("../config/db");
const { razorpay } = require("../services/razorpayService");

exports.verifyPayment = async (req, res) => {
  const customerId = Number(req.customerId);
  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body || {};

  if (
    !Number.isSafeInteger(customerId) ||
    customerId <= 0 ||
    !Number.isSafeInteger(Number(orderId)) ||
    Number(orderId) <= 0 ||
    typeof razorpay_order_id !== "string" ||
    typeof razorpay_payment_id !== "string" ||
    typeof razorpay_signature !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment verification details",
    });
  }

  const secret = process.env.RAZORPAY_KEY_SECRET;

  if (!secret) {
    return res.status(500).json({
      success: false,
      message: "Payment configuration error",
    });
  }

  // Verify the signature using the Razorpay order ID stored by our server.
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest();

  let receivedSignature;

  try {
    if (!/^[a-f0-9]{64}$/i.test(razorpay_signature)) {
      throw new Error("Invalid signature format");
    }

    receivedSignature = Buffer.from(razorpay_signature, "hex");
  } catch {
    return res.status(400).json({
      success: false,
      message: "Invalid payment signature",
    });
  }

  if (
    receivedSignature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(receivedSignature, expectedSignature)
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment signature verification failed",
    });
  }

  let payment;

  try {
    // Independently fetch the payment from Razorpay.
    payment = await razorpay.payments.fetch(razorpay_payment_id);
  } catch (error) {
    console.error(
      "Razorpay payment lookup failed:",
      error.statusCode || "unknown",
    );

    return res.status(502).json({
      success: false,
      message: "Unable to confirm payment with Razorpay. Please retry.",
    });
  }

  if (
    payment.id !== razorpay_payment_id ||
    payment.order_id !== razorpay_order_id ||
    payment.currency !== "INR" ||
    payment.status !== "captured"
  ) {
    return res.status(409).json({
      success: false,
      message: "Payment is not captured or does not match the order",
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [orders] = await connection.query(
      `SELECT id, customer_id, total_price, payment_status,
              payment_method, transaction_id
       FROM orders
       WHERE id = ? AND customer_id = ?
       FOR UPDATE`,
      [Number(orderId), customerId],
    );

    if (!orders.length) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const order = orders[0];

    if (
      order.payment_method !== "RAZORPAY" ||
      order.transaction_id !== razorpay_order_id
    ) {
      await connection.rollback();

      return res.status(400).json({
        success: false,
        message: "Razorpay order does not match this order",
      });
    }

    // Compare Razorpay's amount with the exact server-stored total.
    const expectedAmountPaise = Math.round(Number(order.total_price) * 100);

    if (
      !Number.isSafeInteger(expectedAmountPaise) ||
      payment.amount !== expectedAmountPaise
    ) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "Payment amount does not match the order",
      });
    }

    if (order.payment_status === "paid") {
      const [existing] = await connection.query(
        `SELECT id FROM payments WHERE payment_id = ? LIMIT 1`,
        [razorpay_payment_id],
      );

      await connection.commit();

      if (existing.length) {
        return res.json({
          success: true,
          alreadyVerified: true,
          message: "Payment was already verified",
        });
      }

      // Don't silently accept an inconsistent paid order.
      return res.status(409).json({
        success: false,
        message: "Order is paid but payment records require review",
      });
    }

    if (order.payment_status !== "pending") {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "Order is not awaiting payment",
      });
    }

    const [existingPayment] = await connection.query(
      `SELECT id FROM payments WHERE payment_id = ? LIMIT 1`,
      [razorpay_payment_id],
    );

    if (existingPayment.length) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "Payment is already associated with a record",
      });
    }

    await connection.query(
      `INSERT INTO payments
         (order_id, payment_method, payment_id, amount, status)
       VALUES (?, 'RAZORPAY', ?, ?, 'captured')`,
      [order.id, razorpay_payment_id, (payment.amount / 100).toFixed(2)],
    );

    await connection.query(
      `UPDATE orders
       SET payment_status = 'paid',
           status = 'processing',
           payment_method = 'RAZORPAY',
           transaction_id = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND customer_id = ?
         AND payment_status = 'pending'`,
      [razorpay_order_id, order.id, customerId],
    );

    await connection.commit();

    return res.json({
      success: true,
      message: "Payment verified successfully",
      orderId: order.id,
      paymentId: razorpay_payment_id,
      paymentStatus: "paid",
    });
  } catch (error) {
    try {
      await connection.rollback();
    } catch (_) {}

    // A concurrent request might have inserted the same unique payment ID.
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "This payment has already been processed",
      });
    }

    console.error("Payment verification failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to finalize payment",
    });
  } finally {
    connection.release();
  }
};
