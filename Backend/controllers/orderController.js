const db = require("../config/db");
const generateOrderNumber = require("../utils/generateOrderNumber");

const { calculateOrderTotals } = require("../services/orderService");

exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const customerId = req.customerId;

    const { delivery_date, time_slot, notes, address_id } = req.body;

    // =============================
    // ADDRESS VALIDATION
    // =============================

    const [addressRows] = await connection.query(
      `
      SELECT *
      FROM addresses
      WHERE id = ?
      AND customer_id = ?
      `,
      [address_id, customerId],
    );

    if (addressRows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid address selected",
      });
    }

    // =============================
    // CART ITEMS
    // =============================

    const [cartItems] = await connection.query(
      `
      SELECT
  c.product_id,
  c.quantity,

  p.name,
  p.price,
  p.stock,
  p.sku,
  p.gst_rate,
  p.hsn_code

FROM cart c
INNER JOIN products p
ON p.id = c.product_id

WHERE c.user_id = ?
      `,

      [customerId],
    );
    console.log(cartItems);

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // =============================
    // STOCK VALIDATION
    // =============================

    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${item.name} is out of stock`,
        });
      }
    }

    // =============================
    // TOTALS
    // =============================

    const { subtotal, discount, gst, shipping, total } = calculateOrderTotals(
      cartItems,
      0,
    );
    // =============================
    // START TRANSACTION
    // =============================

    await connection.beginTransaction();

    // =============================
    // CREATE ORDER
    // =============================

    const [orderResult] = await connection.query(
      `
      INSERT INTO orders
      (
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
      )
      VALUES
      (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,

        'pending',
        'pending',
        'PHONEPE',

        ?,
        ?,
        ?,
        ?,

        'website'
      )
      `,
      [
        customerId,
        subtotal,
        discount,
        gst,
        shipping,
        total,

        address_id,
        delivery_date,
        time_slot,
        notes,
      ],
    );

    const orderId = orderResult.insertId;

    const orderNumber = generateOrderNumber(orderId);

    // =============================
    // UPDATE ORDER NUMBER
    // =============================

    await connection.query(
      `
      UPDATE orders
      SET order_number = ?
      WHERE id = ?
      `,
      [orderNumber, orderId],
    );

    // =============================
    // ORDER ITEMS
    // =============================

    for (const item of cartItems) {
      const taxableValue = Number(item.price) * Number(item.quantity);

      const gstRate = Number(item.gst_rate || 0);

      const gstAmount = (taxableValue * gstRate) / 100;

      const cgstAmount = gstAmount / 2;

      const sgstAmount = gstAmount / 2;

      const igstAmount = 0;

      const lineTotal = Number(item.price) * Number(item.quantity);

      await connection.query(
        `
        INSERT INTO order_items
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
sku,
quantity,
price,
total
        )
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          orderId,
          item.product_id,
          item.name,
          item.hsn_code,
          gstRate,
          taxableValue,
          cgstAmount,
          sgstAmount,
          igstAmount,
          item.sku,
          item.quantity,
          item.price,
          lineTotal,
        ],
      );
    }

    // =============================
    // PHONEPE TRANSACTION
    // =============================

    const merchantTransactionId = `TXN_${Date.now()}_${orderId}`;

    await connection.query(
      `
      INSERT INTO phonepe_transactions
      (
        order_id,
        customer_id,
        order_number,
        merchant_transaction_id,
        amount,
        status
      )
      VALUES
      (
        ?,
        ?,
        ?,
        ?,
        ?,
        'PENDING'
      )
      `,
      [orderId, customerId, orderNumber, merchantTransactionId, total],
    );

    // =============================
    // COMMIT
    // =============================

    await connection.commit();

    return res.json({
      success: true,
      orderId,
      orderNumber,
      merchantTransactionId,
      amount: total,
      paymentStatus: "PENDING",
      message: "Order created successfully",
    });
  } catch (error) {
    await connection.rollback();

    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  } finally {
    connection.release();
  }
};
