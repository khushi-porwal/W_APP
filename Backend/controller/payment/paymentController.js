const Razorpay = require("razorpay");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const crypto = require("crypto");
const couponModel = require("../../models/coupon/coupon");
const orderModel = require("../../models/order/Order");
const productModel = require("../../models/products/product");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const createPaymentOrder = asyncHandler(async (req, res) => {

    const { orderId } = req.body;
    const userId = req.user.id;

    // Validate Order ID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(
            400,
            "Invalid Order ID"
        );
    }

    // Find Order
    const order = await orderModel.findById(orderId);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    // Check Ownership
    if (order.user.toString() !== userId.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to pay for this order"
        );
    }

    // Check Cancelled Order
    if (order.status === "Cancelled") {
        throw new ApiError(
            400,
            "Cancelled orders cannot be paid"
        );
    }

    // Check Payment Status
    if (order.paymentStatus === "Paid") {
        throw new ApiError(
            409,
            "Order is already paid"
        );
    }

    // Create Razorpay Order Options
    const options = {
        amount: Math.round(order.totalAmount * 100),
        currency: "INR",
        receipt: order._id.toString(),
        notes: {
            userId: userId.toString(),
            orderId: order._id.toString()
        }
    };

    // Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create(
        options
    );

    // Save Razorpay Order ID
    order.razorpayOrderId = razorpayOrder.id;

    await order.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                razorpayOrder,
                "Payment order created successfully"
            )
        );
});


const verifiedPayment = asyncHandler(async (req, res) => {

    const {
        orderId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    // Validate Required Fields
    if (
        !orderId ||
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
    ) {
        throw new ApiError(
            400,
            "All payment fields are required"
        );
    }

    // Validate Order ID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(
            400,
            "Invalid Order ID"
        );
    }

    // Find Order
    const order = await orderModel.findById(orderId);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    // Check Payment Status
    if (order.paymentStatus === "Paid") {
        throw new ApiError(
            409,
            "Order already paid"
        );
    }

    // Check Ownership
    const userId = req.user.id;

    if (order.user.toString() !== userId.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to verify this payment"
        );
    }

    // Validate Razorpay Order ID
    if (order.razorpayOrderId !== razorpay_order_id) {
        throw new ApiError(
            400,
            "Invalid Razorpay Order ID"
        );
    }

    // Create Signature Body
    const body =
        razorpay_order_id +
        "|" +
        razorpay_payment_id;

    // Generate Expected Signature
    const expectedSignature = crypto
        .createHmac(
            "sha256",
            process.env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");

    // Verify Signature
    const isAuthentic =
        expectedSignature === razorpay_signature;

    if (!isAuthentic) {
        throw new ApiError(
            400,
            "Payment verification failed"
        );
    }

    // Update Product Stock
    for (const item of order.items) {

        const product = await productModel.findById(
            item.product
        );

        if (!product) {
            throw new ApiError(
                404,
                "Product not found"
            );
        }

        if (product.stock < item.quantity) {
            throw new ApiError(
                400,
                `${product.name} has only ${product.stock} items left`
            );
        }

        product.stock -= item.quantity;

        await product.save();
    }

    // Update Coupon Usage
    if (order.coupon) {

        const updatedCoupon =
            await couponModel.findOneAndUpdate(
                {
                    code: order.coupon
                },
                {
                    $inc: {
                        usedCount: 1
                    }
                },
                {
                    new: true
                }
            );

        if (!updatedCoupon) {
            throw new ApiError(
                404,
                "Coupon not found"
            );
        }
    }

    // Update Order Payment Details
    order.paymentStatus = "Paid";
    order.paymentId = razorpay_payment_id;
    order.razorpayOrderId = razorpay_order_id;
    order.razorpaySignature = razorpay_signature;
    order.paidAt = new Date();
    order.status = "Processing";

    await order.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                order,
                "Payment verified successfully"
            )
        );
});


const paymentFailed = asyncHandler(async (req, res) => {

    const { orderId } = req.body;

    // Validate Order ID
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new ApiError(
            400,
            "Invalid Order ID"
        );
    }

    // Find Order
    const order = await orderModel.findById(orderId);

    if (!order) {
        throw new ApiError(
            404,
            "Order not found"
        );
    }

    // Check Ownership
    if (
        order.user.toString() !== req.user.id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not authorized to update this order"
        );
    }

    // Check Payment Status
    if (order.paymentStatus === "Paid") {
        throw new ApiError(
            409,
            "Order is already paid"
        );
    }

    // Update Payment Status
    order.paymentStatus = "Failed";
    order.status = "Pending";
    order.failedAt = new Date();

    await order.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                order,
                "Payment failed. You can retry the payment."
            )
        );
});


module.exports = {
  createPaymentOrder,
  verifiedPayment,
  paymentFailed,
};
