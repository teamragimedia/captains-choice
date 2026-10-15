const express = require("express");
const router = express.Router();

const Auth = require("../middleware/Auth");
const { verifyPayment } = require("../controllers/paymentController");

router.post("/verify", Auth, verifyPayment);

// Register the webhook only after its handler is implemented.
// Razorpay webhooks do not use customer JWT authentication.

module.exports = router;
