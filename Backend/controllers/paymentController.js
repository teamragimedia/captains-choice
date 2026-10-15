const crypto = require("crypto");
const db = require("../config/db");
const { razorpay } = require("../services/razorpayService");

/* =========================================================
   HELPERS
========================================================= */

function isValidId(value) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0;
}

function verifyHmacSha256(body, signature, secret) {
  if (
    !Buffer.isBuffer(body) ||
    typeof signature !== "string" ||
    !/^[a-f0-9]{64}$/i.test(signature) ||
    typeof secret !== "string" ||
    !secret
  ) {
    return false;
  }

  const expected = crypto.createHmac("sha256", secret).update(body).digest();

  const received = Buffer.from(signature, "hex");

  return (
    received.length === expected.length &&
    crypto.timingSafeEqual(received, expected)
  );
}

function getExpectedAmountPaise(totalPrice) {
  const amount = Number(totalPrice);

  if (!Number.isFinite(amount) || amount < 0) {
    return null;
  }

  const paise = Math.round(amount * 100);

  return Number.isSafeInteger(paise) ? paise : null;
}

/* =========================================================
   CUSTOMER PAYMENT VERIFICATION
   POST /api/payments/verify
========================================================= */

exports.verifyPayment = async (req, res) => {
  const customerId = Number(req.customerId);

  const {
    orderId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body || {};

  if (
    !isValidId(customerId) ||
    !isValidId(orderId) ||
    typeof razorpay_order_id !== "string" ||
    typeof razorpay_payment_id !== "string" ||
    typeof razorpay_signature !== "string" ||
    !razorpay_order_id ||
    !razorpay_payment_id
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment verification details",
    });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keySecret) {
    console.error("Razorpay API secret is not configured");

    return res.status(500).json({
      success: false,
      message: "Payment configuration error",
    });
  }

  // First verify the checkout signature.
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest();

  if (!/^[a-f0-9]{64}$/i.test(razorpay_signature)) {
    return res.status(400).json({
      success: false,
      message: "Invalid payment signature",
    });
  }

  const receivedSignature = Buffer.from(razorpay_signature, "hex");

  if (
    receivedSignature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(receivedSignature, expectedSignature)
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment signature verification failed",
    });
  }

  // Independently confirm payment status with Razorpay.
  let payment;

  try {
    payment = await razorpay.payments.fetch(razorpay_payment_id);
  } catch (error) {
    console.error(
      "Razorpay payment lookup failed:",
      error.statusCode || "unknown",
    );

    return res.status(502).json({
      success: false,
      message: "Unable to confirm payment. Please retry.",
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

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const [orders] = await connection.query(
      `SELECT
         id,
         customer_id,
         total_price,
         payment_status,
         payment_method,
         transaction_id
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

    const expectedAmount = getExpectedAmountPaise(order.total_price);

    if (expectedAmount === null || payment.amount !== expectedAmount) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "Payment amount does not match the order",
      });
    }

    // Idempotent retry: only accept an already-paid order when
    // the matching payment record also exists.
    if (order.payment_status === "paid") {
      const [existingPayments] = await connection.query(
        `SELECT id
         FROM payments
         WHERE order_id = ? AND payment_id = ?
         LIMIT 1`,
        [order.id, razorpay_payment_id],
      );

      await connection.commit();

      if (existingPayments.length) {
        return res.json({
          success: true,
          alreadyVerified: true,
          message: "Payment was already verified",
          orderId: order.id,
          paymentId: razorpay_payment_id,
          paymentStatus: "paid",
        });
      }

      console.error(
        "Paid order is missing its matching payment record:",
        order.id,
      );

      return res.status(409).json({
        success: false,
        message: "Payment records require manual review",
      });
    }

    if (order.payment_status !== "pending") {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "Order is not awaiting payment",
      });
    }

    // The payment ID has a unique database index.
    const [existingPayments] = await connection.query(
      `SELECT id
       FROM payments
       WHERE payment_id = ?
       LIMIT 1`,
      [razorpay_payment_id],
    );

    if (existingPayments.length) {
      await connection.rollback();

      return res.status(409).json({
        success: false,
        message: "This payment is already associated with a record",
      });
    }

    await connection.query(
      `INSERT INTO payments
        (order_id, payment_method, payment_id, amount, status)
       VALUES (?, 'RAZORPAY', ?, ?, 'captured')`,
      [order.id, razorpay_payment_id, (payment.amount / 100).toFixed(2)],
    );

    const [updateResult] = await connection.query(
      `UPDATE orders
       SET payment_status = 'paid',
           status = 'processing',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?
         AND customer_id = ?
         AND payment_status = 'pending'`,
      [order.id, customerId],
    );

    if (updateResult.affectedRows !== 1) {
      throw new Error("Order payment status could not be updated");
    }

    await connection.commit();

    return res.json({
      success: true,
      message: "Payment verified successfully",
      orderId: order.id,
      paymentId: razorpay_payment_id,
      paymentStatus: "paid",
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (_) {}
    }

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
    if (connection) {
      connection.release();
    }
  }
};

/* =========================================================
   RAZORPAY WEBHOOK
   POST /api/payments/webhook

   Requires express.raw() before express.json().
========================================================= */

exports.razorpayWebhook = async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers["x-razorpay-signature"];

  if (!webhookSecret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not configured");

    return res.status(500).send("Webhook configuration error");
  }

  // A parsed JSON object cannot replace the original raw bytes.
  if (!Buffer.isBuffer(req.body)) {
    return res.status(400).send("Raw webhook body is required");
  }

  if (!verifyHmacSha256(req.body, signature, webhookSecret)) {
    return res.status(400).send("Webhook signature verification failed");
  }

  let event;

  try {
    event = JSON.parse(req.body.toString("utf8"));
  } catch {
    return res.status(400).send("Invalid webhook JSON");
  }

  const eventType = event.event;

  const supportedEvents = new Set([
    "payment.captured",
    "payment.failed",
    "order.paid",
  ]);

  // Acknowledge other validly signed events without processing them.
  if (!supportedEvents.has(eventType)) {
    return res.status(200).json({
      success: true,
      ignored: true,
    });
  }

  const eventId =
    req.headers["x-razorpay-event-id"] ||
    crypto.createHash("sha256").update(req.body).digest("hex");

  if (typeof eventId !== "string" || !eventId) {
    return res.status(400).send("Invalid webhook event ID");
  }

  const paymentEntity = event.payload?.payment?.entity;

  // Record failed attempts, but do not mark an order failed:
  // a customer may make another payment attempt.
  if (eventType === "payment.failed") {
    let connection;

    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      await connection.query(
        `INSERT INTO razorpay_webhook_events
          (event_id, event_type, processing_status, processed_at)
         VALUES (?, ?, 'processed', CURRENT_TIMESTAMP)`,
        [eventId, eventType],
      );

      await connection.commit();

      return res.status(200).json({ success: true });
    } catch (error) {
      if (connection) {
        try {
          await connection.rollback();
        } catch (_) {}
      }

      if (error.code === "ER_DUP_ENTRY") {
        return res.status(200).json({
          success: true,
          duplicate: true,
        });
      }

      console.error("Failed-payment webhook error:", error.message);

      return res.status(500).send("Webhook processing failed");
    } finally {
      if (connection) connection.release();
    }
  }

  if (
    !paymentEntity ||
    typeof paymentEntity.id !== "string" ||
    typeof paymentEntity.order_id !== "string"
  ) {
    return res.status(400).send("Payment entity is missing");
  }

  // Confirm the captured payment independently using Razorpay's API.
  let payment;

  try {
    payment = await razorpay.payments.fetch(paymentEntity.id);
  } catch (error) {
    console.error(
      "Webhook payment lookup failed:",
      error.statusCode || "unknown",
    );

    return res.status(502).send("Unable to confirm payment");
  }

  if (
    payment.id !== paymentEntity.id ||
    payment.order_id !== paymentEntity.order_id ||
    payment.status !== "captured" ||
    payment.currency !== "INR"
  ) {
    return res.status(409).send("Payment is not confirmed as captured");
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // This insert and the payment update are in the same transaction.
    // A failed transaction can be retried by Razorpay.
    await connection.query(
      `INSERT INTO razorpay_webhook_events
        (event_id, event_type, processing_status)
       VALUES (?, ?, 'processing')`,
      [eventId, eventType],
    );

    const [orders] = await connection.query(
      `SELECT
         id,
         total_price,
         payment_status,
         payment_method,
         transaction_id
       FROM orders
       WHERE transaction_id = ?
       FOR UPDATE`,
      [payment.order_id],
    );

    if (!orders.length) {
      await connection.rollback();
      return res.status(404).send("Matching order not found");
    }

    const order = orders[0];

    if (order.payment_method !== "RAZORPAY") {
      await connection.rollback();
      return res.status(409).send("Order is not a Razorpay order");
    }

    const expectedAmount = getExpectedAmountPaise(order.total_price);

    if (expectedAmount === null || payment.amount !== expectedAmount) {
      await connection.rollback();
      return res.status(409).send("Payment amount mismatch");
    }

    if (order.payment_status === "paid") {
      const [existingPayments] = await connection.query(
        `SELECT id
         FROM payments
         WHERE order_id = ? AND payment_id = ?
         LIMIT 1`,
        [order.id, payment.id],
      );

      if (!existingPayments.length) {
        await connection.rollback();

        console.error("Paid order missing matching payment record:", order.id);

        return res.status(409).send("Payment records require review");
      }
    } else {
      if (order.payment_status !== "pending") {
        await connection.rollback();
        return res.status(409).send("Order is not awaiting payment");
      }

      const [existingPayments] = await connection.query(
        `SELECT id
         FROM payments
         WHERE payment_id = ?
         LIMIT 1`,
        [payment.id],
      );

      if (existingPayments.length) {
        await connection.rollback();
        return res.status(409).send("Payment is already recorded");
      }

      await connection.query(
        `INSERT INTO payments
          (order_id, payment_method, payment_id, amount, status)
         VALUES (?, 'RAZORPAY', ?, ?, 'captured')`,
        [order.id, payment.id, (payment.amount / 100).toFixed(2)],
      );

      const [updateResult] = await connection.query(
        `UPDATE orders
         SET payment_status = 'paid',
             status = 'processing',
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ? AND payment_status = 'pending'`,
        [order.id],
      );

      if (updateResult.affectedRows !== 1) {
        throw new Error("Order payment status could not be updated");
      }
    }

    await connection.query(
      `UPDATE razorpay_webhook_events
       SET processing_status = 'processed',
           processed_at = CURRENT_TIMESTAMP
       WHERE event_id = ?`,
      [eventId],
    );

    await connection.commit();

    return res.status(200).json({ success: true });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (_) {}
    }

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(200).json({
        success: true,
        duplicate: true,
      });
    }

    console.error("Razorpay webhook failed:", error.message);

    return res.status(500).send("Webhook processing failed");
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
