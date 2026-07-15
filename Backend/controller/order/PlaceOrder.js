const mongoose = require("mongoose");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const cartModel = require("../../models/carts/cart");
const orderModel = require("../../models/order/Order");
const AddressModel = require("../../models/address/Address");
const couponModel = require("../../models/coupon/coupon");
const productModel = require("../../models/products/product");
const placeOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const {
    address: addressId,
    couponCode,
    paymentMethod = "Razorpay",
  } = req.body;


  const allowedPaymentMethods = [
    "Razorpay",
    "CashOnDelivery",
];

if (
    !allowedPaymentMethods.includes(
        paymentMethod
    )
) {
    throw new ApiError(
        400,
        "Invalid payment method"
    );
}

  // ==========================
  // Validate Address ID
  // ==========================

  if (!mongoose.Types.ObjectId.isValid(addressId)) {
    throw new ApiError(
      400,
      "Invalid Address ID"
    );
  }

  // ==========================
  // Validate Address
  // ==========================

  const address = await AddressModel.findById(addressId);

  if (!address) {
    throw new ApiError(
      404,
      "Address not found"
    );
  }

  if (address.user.toString() !== userId) {
    throw new ApiError(
      403,
      "You are not allowed to use this address"
    );
  }

  // ==========================
  // Get Cart Items
  // ==========================

  const cartItems = await cartModel
    .find({ user: userId })
    .populate("product");

  if (cartItems.length === 0) {
    throw new ApiError(
      400,
      "Cart is empty"
    );
  }

  let originalAmount = 0;

  // ==========================
  // Validate Products & Stock
  // ==========================

  for (const item of cartItems) {
    if (!item.product) {
      throw new ApiError(
        404,
        "Product not found"
      );
    }

    if (item.quantity > item.product.stock) {
      throw new ApiError(
        400,
        `${item.product.name} has only ${item.product.stock} items left`
      );
    }

    originalAmount += item.product.price * item.quantity;
  }

  // ==========================
  // Coupon Validation
  // ==========================

  let coupon = null;
  let discountAmount = 0;
  let totalAmount = originalAmount;

  if (couponCode) {
    coupon = await couponModel.findOne({
      code: couponCode.trim().toUpperCase(),
    });

    if (!coupon) {
      throw new ApiError(
        404,
        "Invalid coupon code"
      );
    }

    if (!coupon.isActive) {
      throw new ApiError(
        400,
        "Coupon is inactive"
      );
    }

    if (new Date() > coupon.expiryDate) {
      throw new ApiError(
        400,
        "Coupon has expired"
      );
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      throw new ApiError(
        400,
        "Coupon usage limit exceeded"
      );
    }

    if (originalAmount < coupon.minimumAmount) {
      throw new ApiError(
        400,
        `Minimum order amount should be ₹${coupon.minimumAmount}`
      );
    }

    discountAmount =
      (originalAmount * coupon.discountPercentage) / 100;

    discountAmount = Math.min(
      discountAmount,
      coupon.maxDiscount
    );

    totalAmount = originalAmount - discountAmount;
  }

  // ==========================
  // Create Order
  // ==========================

  const order = await orderModel.create({
    user: userId,

    items: cartItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    })),

    originalAmount,

    discountAmount,

    totalAmount,

    coupon: coupon ? coupon.code : null,

    paymentMethod,

    paymentStatus: "Pending",

    address: addressId,
  });

  // ==========================
  // Reduce Product Stock
  // ==========================

  for (const item of cartItems) {
    item.product.stock -= item.quantity;

    await item.product.save();
  }

  // ==========================
  // Increase Coupon Usage
  // ==========================

  if (coupon) {
    coupon.usedCount += 1;

    await coupon.save();
  }

  // ==========================
  // Clear Cart
  // ==========================

  await cartModel.deleteMany({
    user: userId,
  });

  // ==========================
  // Send Response
  // ==========================

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        order,
        "Order placed successfully"
      )
    );
});



const getMyOrder = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const orders = await orderModel
    .find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("items.product")
    .populate("address");

  if (orders.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            totalOrders: 0,
            orders: [],
          },
          "No orders found"
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          totalOrders: orders.length,
          orders,
        },
        "Orders fetched successfully"
      )
    );
});



const getSingleOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  // ==========================
  // Validate Order ID
  // ==========================

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(
      400,
      "Invalid Order ID"
    );
  }

  // ==========================
  // Find Order
  // ==========================

  const order = await orderModel
    .findOne({
      _id: orderId,
      user: req.user.id,
    })
    .populate("user", "name email")
    .populate("items.product")
    .populate("address");

  // ==========================
  // Validate Order
  // ==========================

  if (!order) {
    throw new ApiError(
      404,
      "Order not found"
    );
  }

  // ==========================
  // Send Response
  // ==========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        order,
        "Order fetched successfully"
      )
    );
});


const updateOrderStatus = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  // ==========================
  // Validate Order ID
  // ==========================

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(
      400,
      "Invalid Order ID"
    );
  }

  // ==========================
  // Find Order
  // ==========================

  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new ApiError(
      404,
      "Order not found"
    );
  }

  // ==========================
  // Get Status
  // ==========================

  const { status } = req.body;

  const allowedStatus = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  // ==========================
  // Validate Status
  // ==========================

  if (!allowedStatus.includes(status)) {
    throw new ApiError(
      400,
      "Invalid status"
    );
  }

  // ==========================
  // Validate Current Status
  // ==========================

  if (order.status === "Delivered") {
    throw new ApiError(
      400,
      "Delivered order cannot be updated"
    );
  }

  if (order.status === "Cancelled") {
    throw new ApiError(
      400,
      "Cancelled order cannot be updated"
    );
  }

  // ==========================
  // Update Order Status
  // ==========================

  order.status = status;

  // ==========================
  // Handle Delivered Order
  // ==========================

  if (status === "Delivered") {
    order.deliveredAt = new Date();

    if (
        order.paymentMethod ===
        "CashOnDelivery"
    ) {
        order.paymentStatus = "Paid";
        order.paidAt = new Date();
    }
}

  // ==========================
  // Save Order
  // ==========================

  await order.save();

  // ==========================
  // Send Response
  // ==========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        order,
        "Order status updated successfully"
      )
    );
});



const cancelOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.user.id;

  // ==========================
  // Validate Order ID
  // ==========================

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new ApiError(
      400,
      "Invalid Order ID"
    );
  }

  // ==========================
  // Find Order
  // ==========================

  const order = await orderModel.findById(orderId);

  if (!order) {
    throw new ApiError(
      404,
      "Order not found"
    );
  }

  // ==========================
  // Ownership Check
  // ==========================

  if (order.user.toString() !== userId) {
    throw new ApiError(
      403,
      "Unauthorized"
    );
  }

  // ==========================
  // Business Rules
  // ==========================

  if (order.status === "Cancelled") {
    throw new ApiError(
      400,
      "Order is already cancelled"
    );
  }

  if (
    order.status === "Shipped" ||
    order.status === "Delivered"
  ) {
    throw new ApiError(
      400,
      `Order cannot be cancelled because it is ${order.status}`
    );
  }

  // ==========================
  // Restore Product Stock
  // ==========================

  for (const item of order.items) {
    const product = await productModel.findById(
      item.product
    );

    if (!product) {
      continue;
    }

    product.stock += item.quantity;

    await product.save();
  }

  // ==========================
  // Update Refund Status
  // ==========================

  if (order.paymentStatus === "Paid") {
    order.paymentStatus = "REFUND_PENDING";
    order.refundedAt = new Date();
    order.refundReason =
        "Cancelled by Customer";
}

  // ==========================
  // Cancel Order
  // ==========================

  order.status = "Cancelled";

  await order.save();

  // ==========================
  // Send Response
  // ==========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        order,
        "Order cancelled successfully"
      )
    );
});


module.exports = {
  placeOrder,
  getMyOrder,
  getSingleOrder,
  updateOrderStatus,
  cancelOrder,
};
