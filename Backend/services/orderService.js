// services/orderService.js

const generateOrderNumber = require("../utils/generateOrderNumber");

const calculateOrderTotals = (cartItems, discount = 0) => {
  let subtotal = 0;

  cartItems.forEach((item) => {
    subtotal += Number(item.price) * Number(item.quantity);
  });

  if (subtotal < 2000) {
    throw new Error("Minimum order value is ₹2000");
  }

  const taxableAmount = subtotal - discount;

  const gst = taxableAmount * 0.18;

  const shipping = subtotal > 5000 ? 0 : 150;

  const total = taxableAmount + gst + shipping;

  return {
    subtotal,
    discount,
    gst,
    shipping,
    total,
  };
};

module.exports = {
  calculateOrderTotals,
};

module.exports = {
  calculateOrderTotals,
};
