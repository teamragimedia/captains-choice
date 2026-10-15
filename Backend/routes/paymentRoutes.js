const express = require("express");
const router = express.Router();

const Auth = require("../middleware/Auth");

const {
  verifyPayment,
  razorpayWebhook,
} = require("../controllers/paymentController");

// Customer-authenticated payment verification
router.post("/verify", Auth, verifyPayment);

// Razorpay server-to-server webhook
// Do NOT apply customer JWT authentication here.
router.post("/webhook", razorpayWebhook);

module.exports = router;
