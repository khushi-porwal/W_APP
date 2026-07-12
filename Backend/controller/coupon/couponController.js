const couponModel = require("../../models/coupon/coupon");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");


const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    discountPercentage,
    expiryDate,
    minimumAmount,
    maxDiscount,
    usageLimit,
  } = req.body;

  // =========================
  // Required Fields Validation
  // =========================

  if (
    !code?.trim() ||
    discountPercentage === undefined ||
    !expiryDate
  ) {
    throw new ApiError(
      400,
      "All required fields are mandatory"
    );
  }

  // =========================
  // Discount Validation
  // =========================

  if (
    isNaN(discountPercentage) ||
    discountPercentage < 1 ||
    discountPercentage > 100
  ) {
    throw new ApiError(
      400,
      "Discount percentage must be between 1 and 100"
    );
  }

  // =========================
  // Expiry Date Validation
  // =========================

  if (new Date(expiryDate) <= new Date()) {
    throw new ApiError(
      400,
      "Expiry date must be in the future"
    );
  }

  // =========================
  // Check Existing Coupon
  // =========================

  const existingCoupon = await couponModel.findOne({
    code: code.trim().toUpperCase(),
  });

  if (existingCoupon) {
    throw new ApiError(
      409,
      "Coupon already exists"
    );
  }

  // =========================
  // Create Coupon
  // =========================

  const coupon = await couponModel.create({
    code: code.trim().toUpperCase(),
    discountPercentage,
    expiryDate,
    minimumAmount,
    maxDiscount,
    usageLimit,
    isActive: true,
  });

  // =========================
  // Send Response
  // =========================

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        coupon,
        "Coupon created successfully"
      )
    );
});


const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const amount = Number(req.body.amount);

  // =========================
  // Coupon Code Validation
  // =========================

  if (!code?.trim()) {
    throw new ApiError(
      400,
      "Coupon code is required"
    );
  }

  // =========================
  // Amount Validation
  // =========================

  if (isNaN(amount) || amount <= 0) {
    throw new ApiError(
      400,
      "Invalid order amount"
    );
  }

  // =========================
  // Find Coupon
  // =========================

  const coupon = await couponModel.findOne({
    code: code.trim().toUpperCase(),
  });

  if (!coupon) {
    throw new ApiError(
      404,
      "Invalid coupon code"
    );
  }

  // =========================
  // Active Check
  // =========================

  if (!coupon.isActive) {
    throw new ApiError(
      400,
      "Coupon is inactive"
    );
  }

  // =========================
  // Expiry Check
  // =========================

  if (new Date() > coupon.expiryDate) {
    throw new ApiError(
      400,
      "Coupon has expired"
    );
  }

  // =========================
  // Usage Limit Check
  // =========================

  if (coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(
      400,
      "Coupon usage limit exceeded"
    );
  }

  // =========================
  // Minimum Order Amount
  // =========================

  if (amount < coupon.minimumAmount) {
    throw new ApiError(
      400,
      `Minimum order amount should be ₹${coupon.minimumAmount}`
    );
  }

  // =========================
  // Discount Calculation
  // =========================

  let discountAmount =
    (amount * coupon.discountPercentage) / 100;

  discountAmount = Math.min(
    discountAmount,
    coupon.maxDiscount
  );

  const finalAmount = amount - discountAmount;

  // =========================
  // Prepare Response Data
  // =========================

  const couponData = {
    couponCode: coupon.code,
    originalAmount: amount,
    discountAmount,
    finalAmount,
    discountPercentage: coupon.discountPercentage,
  };

  // =========================
  // Send Response
  // =========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        couponData,
        "Coupon applied successfully"
      )
    );
});


const getAllCoupon = asyncHandler(async (req, res) => {
  // =========================
  // Get All Coupons
  // =========================

  const coupons = await couponModel
    .find()
    .sort({ createdAt: -1 });

  // =========================
  // No Coupons Found
  // =========================

  if (coupons.length === 0) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            totalCoupons: 0,
            coupons: [],
          },
          "No coupons found"
        )
      );
  }

  // =========================
  // Send Response
  // =========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          totalCoupons: coupons.length,
          coupons,
        },
        "Coupons fetched successfully"
      )
    );
});



const deleteCoupon = asyncHandler(async (req, res) => {
  const couponId = req.params.couponId;

  // =========================
  // Validate Coupon ID
  // =========================

  if (!mongoose.Types.ObjectId.isValid(couponId)) {
    throw new ApiError(
      400,
      "Invalid Coupon ID"
    );
  }

  // =========================
  // Find And Delete Coupon
  // =========================

  const coupon = await couponModel.findByIdAndDelete(
    couponId
  );

  // =========================
  // Coupon Not Found
  // =========================

  if (!coupon) {
    throw new ApiError(
      404,
      "Coupon not found"
    );
  }

  // =========================
  // Send Response
  // =========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        coupon,
        "Coupon deleted successfully"
      )
    );
});



const couponUpdate = asyncHandler(async (req, res) => {
  const couponId = req.params.couponId;

  // =========================
  // Validate Coupon ID
  // =========================

  if (!mongoose.Types.ObjectId.isValid(couponId)) {
    throw new ApiError(
      400,
      "Invalid Coupon ID"
    );
  }

  // =========================
  // Find Coupon
  // =========================

  const coupon = await couponModel.findById(couponId);

  // =========================
  // Coupon Not Found
  // =========================

  if (!coupon) {
    throw new ApiError(
      404,
      "Coupon not found"
    );
  }

  // =========================
  // Toggle Active Status
  // =========================

  coupon.isActive = !coupon.isActive;

  // =========================
  // Save Coupon
  // =========================

  await coupon.save();

  // =========================
  // Send Response
  // =========================

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        coupon,
        "Coupon status updated successfully"
      )
    );
});


module.exports = {
    couponUpdate,deleteCoupon,getAllCoupon,applyCoupon,createCoupon
}
