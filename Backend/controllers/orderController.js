const db = require("../config/db");
const generateOrderNumber = require("../utils/generateOrderNumber");
const { calculateOrderTotals } = require("../services/orderService");
const { razorpay, keyId } = require("../services/razorpayService");

const OFFER_CODE = "FIRSTORDERCC";

/**
 * Helpers
 */
const roundMoney = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const normalizeOfferCode = (value) =>
  String(value || "")
    .trim()
    .toUpperCase();

const sendError = (res, status, message) => {
  return res.status(status).json({
    success: false,
    message,
  });
};

/**
 * Check whether the customer has already completed a paid order.
 *
 * Only paid orders count as completed orders. Pending or failed orders
 * do not prevent the customer from using the first-order offer.
 */
async function hasPreviousPaidOrder(connection, customerId) {
  const [rows] = await connection.query(
    `SELECT id
     FROM orders
     WHERE customer_id = ?
       AND payment_status = 'paid'
     LIMIT 1`,
    [customerId],
  );

  return rows.length > 0;
}

/**
 * Validate FIRSTORDERCC on the server.
 * Never trust a discount amount supplied by the frontend.
 */
async function validateOffer(connection, customerId, offerCode) {
  const normalizedCode = normalizeOfferCode(offerCode);

  if (!normalizedCode) {
    return "";
  }

  if (normalizedCode !== OFFER_CODE) {
    throw new Error("Invalid offer code.");
  }

  const alreadyOrdered = await hasPreviousPaidOrder(connection, customerId);

  if (alreadyOrdered) {
    throw new Error("FIRSTORDERCC is valid only for your first paid order.");
  }

  return normalizedCode;
}

/**
 * Fetch the customer's cart and current product information.
 */
async function getCartItems(connection, customerId, lockRows = false) {
  const lockClause = lockRows ? " FOR UPDATE" : "";

  const [items] = await connection.query(
    `SELECT
       c.product_id,
       c.quantity,
       p.name,
       p.price,
       p.stock,
       p.sku,
       p.gst_rate,
       p.hsn_code
     FROM cart c
     INNER JOIN products p ON p.id = c.product_id
     WHERE c.user_id = ?
     ORDER BY c.product_id${lockClause}`,
    [customerId],
  );

  return items;
}

/**
 * Validate the cart before calculating totals.
 */
function validateCartItems(cartItems) {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error("Your cart is empty.");
  }

  for (const item of cartItems) {
    const quantity = Number(item.quantity);
    const price = Number(item.price);
    const stock = Number(item.stock);
    const gstRate = Number(item.gst_rate);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("The cart contains an invalid product quantity.");
    }

    if (!Number.isFinite(price) || price < 0) {
      throw new Error(
        `Invalid price for product: ${item.name || item.product_id}`,
      );
    }

    if (!Number.isFinite(stock) || stock < quantity) {
      throw new Error(
        `Insufficient stock for ${item.name || "a product"}. Please update your cart.`,
      );
    }

    // Do not silently treat a missing GST rate as 0%.
    if (
      item.gst_rate === null ||
      item.gst_rate === undefined ||
      item.gst_rate === "" ||
      !Number.isFinite(gstRate) ||
      gstRate < 0 ||
      gstRate > 100
    ) {
      throw new Error(
        `A valid GST rate is missing for ${item.name || item.product_id}.`,
      );
    }
  }
}

/**
 * POST /api/orders/create
 *
 * Creates a pending database order and a corresponding Razorpay order.
 * Payment is NOT marked as paid here. The payment controller must verify
 * the Razorpay signature and payment status.
 */
exports.createOrder = async (req, res) => {
  let connection;
  let transactionStarted = false;

  try {
    const customerId = req.customerId;

    if (!customerId) {
      return sendError(res, 401, "Please log in to place an order.");
    }

    const { delivery_date, time_slot, notes, address_id, offerCode } =
      req.body || {};

    if (!address_id) {
      return sendError(res, 400, "Please select a delivery address.");
    }

    connection = await db.getConnection();

    await connection.beginTransaction();
    transactionStarted = true;

    // 1. Ensure the selected address belongs to the logged-in customer.
    const [addressRows] = await connection.query(
      `SELECT id
       FROM addresses
       WHERE id = ?
         AND customer_id = ?
       LIMIT 1
       FOR UPDATE`,
      [address_id, customerId],
    );

    if (addressRows.length === 0) {
      await connection.rollback();
      transactionStarted = false;

      return sendError(res, 400, "The selected delivery address is invalid.");
    }

    // 2. Read and lock cart/product rows before validating stock.
    const cartItems = await getCartItems(connection, customerId, true);

    validateCartItems(cartItems);

    // 3. Validate the offer code on the server.
    const validOfferCode = await validateOffer(
      connection,
      customerId,
      offerCode,
    );

    // 4. Calculate totals using the GST-inclusive product prices.
    // The order service must extract GST from prices rather than adding
    // GST on top of those prices.
    const totals = calculateOrderTotals(cartItems, validOfferCode);

    if (!totals || !Array.isArray(totals.items)) {
      throw new Error("Unable to calculate the order totals.");
    }

    const subtotal = roundMoney(totals.subtotal);
    const discount = roundMoney(totals.discount);
    const gst = roundMoney(totals.gst);
    const shipping = roundMoney(totals.shipping);
    const total = roundMoney(totals.total);

    if (total <= 0) {
      throw new Error("The order total must be greater than zero.");
    }

    // 5. Create a pending order. Do not create a PhonePe transaction.
    const [orderResult] = await connection.query(
      `INSERT INTO orders (
         customer_id,
         subtotal,
         discount,
         gst,
         shipping,
         total_price,
         status,
         payment_status,
         payment_method,
         address_id,
         delivery_date,
         time_slot,
         notes,
         order_source
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        subtotal,
        discount,
        gst,
        shipping,
        total,
        "pending",
        "pending",
        "RAZORPAY",
        address_id,
        delivery_date || null,
        time_slot || null,
        notes || null,
        "website",
      ],
    );

    const orderId = orderResult.insertId;

    // 6. Generate and save the human-readable order number.
    const orderNumber = await generateOrderNumber(orderId);

    await connection.query(
      `UPDATE orders
       SET order_number = ?
       WHERE id = ?`,
      [orderNumber, orderId],
    );

    // 7. Save the line items and their GST breakdown.
    // `totals.items` is expected to contain:
    // product_id, quantity, name, sku, hsn_code, gst_rate,
    // grossAfterDiscount, taxableValue, gstAmount, cgstAmount,
    // sgstAmount, igstAmount.
    for (const item of totals.items) {
      const quantity = Number(item.quantity);
      const lineTotal = roundMoney(item.grossAfterDiscount);

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0 ||
        !Number.isFinite(lineTotal) ||
        lineTotal < 0
      ) {
        throw new Error(
          `Invalid calculated line item for ${item.name || item.product_id}.`,
        );
      }

      // The order-item price is the GST-inclusive unit price after
      // proportional discount allocation. The total matches the
      // discounted line amount.
      const unitPrice = roundMoney(lineTotal / quantity);

      await connection.query(
        `INSERT INTO order_items (
           order_id,
           product_id,
           product_name,
           quantity,
           price,
           total,
           sku,
           hsn_code,
           gst_rate,
           taxable_value,
           cgst_amount,
           sgst_amount,
           igst_amount
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.name,
          quantity,
          unitPrice,
          lineTotal,
          item.sku || null,
          item.hsn_code || null,
          Number(item.gst_rate),
          roundMoney(item.taxableValue),
          roundMoney(item.cgstAmount),
          roundMoney(item.sgstAmount),
          roundMoney(item.igstAmount),
        ],
      );
    }

    // 8. Create the Razorpay order in paise.
    // Keep the MySQL transaction open until Razorpay creation succeeds,
    // so a failure does not leave a committed order without a payment
    // order. Network failures can still be ambiguous and should be
    // reconciled before retrying payment creation.
    const amountPaise = Math.round(total * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: String(orderNumber).slice(0, 40),
      notes: {
        database_order_id: String(orderId),
        order_number: String(orderNumber),
        customer_id: String(customerId),
      },
    });

    if (!razorpayOrder || !razorpayOrder.id) {
      throw new Error("Razorpay did not return a valid order ID.");
    }

    // 9. Save Razorpay's order ID for payment verification.
    await connection.query(
      `UPDATE orders
       SET transaction_id = ?
       WHERE id = ?
         AND payment_status = 'pending'`,
      [razorpayOrder.id, orderId],
    );

    await connection.commit();
    transactionStarted = false;

    // 10. Return the details required by Razorpay Checkout.
    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      orderId,
      orderNumber,
      keyId,
      razorpayOrderId: razorpayOrder.id,
      amount: amountPaise,
      currency: "INR",
      paymentStatus: "pending",
      totals: {
        subtotal,
        discount,
        discountPercent: Number(totals.discountPercent || 0),
        taxableTotal: roundMoney(totals.taxableTotal),
        gst,
        shipping,
        total,
      },
    });
  } catch (error) {
    if (connection && transactionStarted) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Order transaction rollback failed:",
          rollbackError.message,
        );
      }
    }

    console.error("Create order error:", error);

    const clientErrors = [
      "Your cart is empty.",
      "Please log in to place an order.",
      "Please select a delivery address.",
      "The selected delivery address is invalid.",
      "Invalid offer code.",
      "FIRSTORDERCC is valid only for your first paid order.",
      "The order total must be greater than zero.",
      "Unable to calculate the order totals.",
    ];

    const isClientError =
      clientErrors.includes(error.message) ||
      /insufficient stock|invalid price|invalid.*quantity|valid GST rate|minimum order value|cart contains|calculated line item/i.test(
        error.message || "",
      );

    return sendError(
      res,
      isClientError ? 400 : 500,
      isClientError
        ? error.message
        : "Unable to create the order. Please try again.",
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * GET /api/orders/preview
 *
 * Returns the current server-calculated cart totals for the cart page.
 * This endpoint is for display only. createOrder recalculates everything
 * before creating the actual order.
 *
 * Example:
 * GET /api/orders/preview?offerCode=FIRSTORDERCC
 */
exports.previewOrder = async (req, res) => {
  let connection;

  try {
    const customerId = req.customerId;

    if (!customerId) {
      return sendError(res, 401, "Please log in to view your cart.");
    }

    const requestedOfferCode = normalizeOfferCode(req.query.offerCode);

    connection = await db.getConnection();

    const cartItems = await getCartItems(connection, customerId, false);

    if (!cartItems.length) {
      return res.status(200).json({
        success: true,
        message: "Your cart is empty.",
        items: [],
        totals: {
          subtotal: 0,
          discount: 0,
          discountPercent: 0,
          taxableTotal: 0,
          gst: 0,
          shipping: 0,
          total: 0,
        },
      });
    }

    // Stock is also checked when the final order is created.
    validateCartItems(cartItems);

    const validOfferCode = await validateOffer(
      connection,
      customerId,
      requestedOfferCode,
    );

    const totals = calculateOrderTotals(cartItems, validOfferCode);

    return res.status(200).json({
      success: true,
      items: totals.items,
      totals: {
        subtotal: roundMoney(totals.subtotal),
        discount: roundMoney(totals.discount),
        discountPercent: Number(totals.discountPercent || 0),
        taxableTotal: roundMoney(totals.taxableTotal),
        gst: roundMoney(totals.gst),
        shipping: roundMoney(totals.shipping),
        total: roundMoney(totals.total),
      },
    });
  } catch (error) {
    console.error("Order preview error:", error);

    const isClientError =
      /invalid offer code|valid only for your first paid order|insufficient stock|invalid price|invalid.*quantity|valid GST rate|minimum order value|cart contains/i.test(
        error.message || "",
      );

    return sendError(
      res,
      isClientError ? 400 : 500,
      isClientError ? error.message : "Unable to calculate your cart totals.",
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

/**
 * GET /api/orders/:id
 *
 * Returns one order belonging to the authenticated customer,
 * including its purchased items and delivery details.
 */
exports.getOrderById = async (req, res) => {
  let connection;

  try {
    const customerId = Number(req.customerId);
    const orderId = Number(req.params.id);

    if (!Number.isSafeInteger(customerId) || customerId <= 0) {
      return sendError(res, 401, "Please log in to view this order.");
    }

    if (!Number.isSafeInteger(orderId) || orderId <= 0) {
      return sendError(res, 400, "Invalid order ID.");
    }

    connection = await db.getConnection();

    // Only return an order belonging to the logged-in customer.
    const [orders] = await connection.query(
      `SELECT
         o.id,
         o.order_number,
         o.customer_id,
         o.subtotal,
         o.discount,
         o.gst,
         o.shipping,
         o.total_price,
         o.status,
         o.payment_status,
         o.payment_method,
         o.transaction_id,
         o.address_id,
         o.delivery_date,
         o.time_slot,
         o.notes,
         o.created_at,
         o.updated_at
       FROM orders o
       WHERE o.id = ?
         AND o.customer_id = ?
       LIMIT 1`,
      [orderId, customerId],
    );

    if (orders.length === 0) {
      return sendError(res, 404, "Order not found.");
    }

    const order = orders[0];

    // Load the saved items for this order.
    const [items] = await connection.query(
      `SELECT
         oi.product_id,
         oi.product_name AS name,
         oi.quantity,
         oi.price,
         oi.total,
         oi.sku,
         oi.hsn_code,
         oi.gst_rate,
         oi.taxable_value,
         oi.cgst_amount,
         oi.sgst_amount,
         oi.igst_amount,
         p.image
       FROM order_items oi
       LEFT JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?
       ORDER BY oi.product_id`,
      [orderId],
    );

    // Return delivery address only if it belongs to this order's customer.
    const [addresses] = await connection.query(
      `SELECT
         id,
         name,
         address_line,
         city,
         pincode,
         phone
       FROM addresses
       WHERE id = ?
         AND customer_id = ?
       LIMIT 1`,
      [order.address_id, customerId],
    );

    return res.status(200).json({
      success: true,
      order: {
        ...order,
        items,
        address: addresses[0] || null,
      },
    });
  } catch (error) {
    console.error("Get order details error:", error);

    return sendError(
      res,
      500,
      "Unable to load order details. Please try again.",
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
