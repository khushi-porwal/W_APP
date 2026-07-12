const express = require("express");
const router = express.Router();

const authMiddleware = require("../../middleware/authMiddleware")

const {createPaymentOrder, verifiedPayment} = require("../../controller/payment/paymentController")

router.post("/create-payment-order", authMiddleware, createPaymentOrder)
router.post("/verify-payment",authMiddleware, verifiedPayment)

module.exports = router;