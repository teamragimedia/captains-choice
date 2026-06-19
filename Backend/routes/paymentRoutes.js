const express = require("express");
const router = express.Router();

const {
  createPayment,
  verifyPayment,
  phonepeWebhook
} = require("../controllers/paymentController");

router.post("/create", createPayment);

router.get("/status/:transactionId", verifyPayment);

router.post("/webhook", phonepeWebhook);

module.exports = router;