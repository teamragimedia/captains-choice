const MINIMUM_ORDER_VALUE = 2000;
const FREE_SHIPPING_THRESHOLD = 5000;
const SHIPPING_CHARGE = 150;
const FIRST_ORDER_DISCOUNT_PERCENT = 15;

const roundMoney = (value) =>
  Math.round((Number(value) + Number.EPSILON) * 100) / 100;

const calculateOrderTotals = (cartItems, offerCode = "") => {
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const items = cartItems.map((item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);

    // Reject missing or blank GST rates instead of silently treating
    // them as zero-rated products.
    if (
      item.gst_rate === null ||
      item.gst_rate === undefined ||
      String(item.gst_rate).trim() === ""
    ) {
      throw new Error(`Missing GST rate for ${item.name || "product"}`);
    }

    const gstRate = Number(item.gst_rate);

    if (
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1 ||
      !Number.isFinite(gstRate) ||
      gstRate < 0 ||
      gstRate > 100
    ) {
      throw new Error(
        `Invalid price, quantity, or GST rate for ${item.name || "product"}`,
      );
    }

    const grossAmount = roundMoney(price * quantity);

    return {
      ...item,
      product_id: item.product_id,
      price,
      quantity,
      gstRate,
      grossAmount,
    };
  });

  // Prices already include GST.
  const subtotal = roundMoney(
    items.reduce((sum, item) => sum + item.grossAmount, 0),
  );

  // Enforce the minimum order value before applying discounts.
  if (subtotal < MINIMUM_ORDER_VALUE) {
    throw new Error("Minimum order value is ₹2000");
  }

  const normalizedOfferCode = String(offerCode || "")
    .trim()
    .toUpperCase();

  if (normalizedOfferCode && normalizedOfferCode !== "FIRSTORDERCC") {
    throw new Error("Invalid offer code");
  }

  const discountPercent = normalizedOfferCode
    ? FIRST_ORDER_DISCOUNT_PERCENT
    : 0;

  const discount = roundMoney((subtotal * discountPercent) / 100);

  let allocatedDiscount = 0;

  const discountedItems = items.map((item, index) => {
    let itemDiscount;

    if (index === items.length - 1) {
      // Assign any rounding remainder to the final item.
      itemDiscount = roundMoney(discount - allocatedDiscount);
    } else {
      itemDiscount = roundMoney((discount * item.grossAmount) / subtotal);

      allocatedDiscount = roundMoney(allocatedDiscount + itemDiscount);
    }

    const grossAfterDiscount = roundMoney(item.grossAmount - itemDiscount);

    // Extract GST from the inclusive price after discount.
    const taxableValue = roundMoney(
      (grossAfterDiscount * 100) / (100 + item.gstRate),
    );

    const gstAmount = roundMoney(grossAfterDiscount - taxableValue);

    // Assumes an intra-state supply. Interstate orders require IGST.
    const cgstAmount = roundMoney(gstAmount / 2);
    const sgstAmount = roundMoney(gstAmount - cgstAmount);

    return {
      ...item,
      discountAmount: itemDiscount,
      grossAfterDiscount,
      taxableValue,
      gstAmount,
      cgstAmount,
      sgstAmount,
      igstAmount: 0,
      lineTotal: grossAfterDiscount,
    };
  });

  const discountedSubtotal = roundMoney(subtotal - discount);

  const taxableTotal = roundMoney(
    discountedItems.reduce((sum, item) => sum + item.taxableValue, 0),
  );

  const gst = roundMoney(
    discountedItems.reduce((sum, item) => sum + item.gstAmount, 0),
  );

  // Free shipping applies when the discounted merchandise value
  // is strictly greater than ₹5,000.
  const shipping =
    discountedSubtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;

  // GST is already included in product prices.
  const total = roundMoney(discountedSubtotal + shipping);

  return {
    items: discountedItems,
    subtotal,
    discount,
    discountPercent,
    taxableTotal,
    gst,
    shipping,
    total,
  };
};

module.exports = {
  calculateOrderTotals,
};
