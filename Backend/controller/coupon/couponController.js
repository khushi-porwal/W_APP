const mongoose = require("mongoose");
const couponModel = require("../../models/coupon/coupon");
const orderModel = require("../../models/order/Order");
const ApiError = require("../../utils/ApiError");
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const createCoupon = asyncHandler(async (req, res) => {
  // =========================
  // Get Request Data
  // =========================

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

  if (!code?.trim() || discountPercentage === undefined || !expiryDate) {
    throw new ApiError(400, "All required fields are mandatory");
  }

  // =========================
  // Discount Validation
  // =========================

  if (
    isNaN(discountPercentage) ||
    discountPercentage < 1 ||
    discountPercentage > 100
  ) {
    throw new ApiError(400, "Discount percentage must be between 1 and 100");
  }

  // =========================
  // Expiry Date Validation
  // =========================

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);

  if (expiry <= today) {
    throw new ApiError(400, "Expiry date must be in the future");
  }

  // =========================
  // Check Existing Coupon
  // =========================

  const existingCoupon = await couponModel.findOne({
    code: code.trim().toUpperCase(),
  });

  if (existingCoupon) {
    throw new ApiError(409, "Coupon already exists");
  }

  // =========================
  // Create Coupon
  // =========================

  const coupon = await couponModel.create({
    code: code.trim().toUpperCase(),

    discountPercentage,

    expiryDate: expiry,

    minimumAmount,

    maxDiscount,

    usageLimit,

    isActive: true,
  });

  // =========================
  // Send Response
  // =========================

  return res.status(201).json(
    new ApiResponse(
      201,

      coupon,

      "Coupon created successfully",
    ),
  );
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;

  const amount = Number(req.body.amount);

  // =========================
  // Coupon Code Validation
  // =========================

  if (!code?.trim()) {
    throw new ApiError(400, "Coupon code is required");
  }

  // =========================
  // Amount Validation
  // =========================

  if (isNaN(amount) || amount <= 0) {
    throw new ApiError(400, "Invalid order amount");
  }

  // =========================
  // Find Coupon
  // =========================

  const coupon = await couponModel.findOne({
    code: code.trim().toUpperCase(),
  });

  if (!coupon) {
    throw new ApiError(404, "Invalid coupon code");
  }

  // =========================
  // Active Check
  // =========================

  if (!coupon.isActive) {
    throw new ApiError(400, "Coupon is inactive");
  }

  // =========================
  // Expiry Check
  // =========================

  if (new Date() > coupon.expiryDate) {
    throw new ApiError(400, "Coupon has expired");
  }

  // =========================
  // Usage Limit Check
  // =========================

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new ApiError(400, "Coupon usage limit exceeded");
  }

  // =========================
  // Per-User & First-Order Checks
  // =========================

  const userId = req.user?.id;
  if (userId) {
    if (coupon.isFirstOrderOnly) {
      const totalUserOrders = await orderModel.countDocuments({
        user: userId,
        status: { $ne: "Cancelled" },
      });
      if (totalUserOrders > 0) {
        throw new ApiError(
          400,
          "This coupon is valid for your first order only"
        );
      }
    }

    const userCouponUsage = await orderModel.countDocuments({
      user: userId,
      coupon: coupon.code,
      status: { $ne: "Cancelled" },
    });

    const maxAllowedForUser = coupon.userUsageLimit || 1;
    if (userCouponUsage >= maxAllowedForUser) {
      throw new ApiError(
        400,
        "You have already used this coupon code"
      );
    }
  }

  // =========================
  // Minimum Order Amount
  // =========================

  if (amount < coupon.minimumAmount) {
    throw new ApiError(
      400,
      `Minimum order amount should be ₹${coupon.minimumAmount}`,
    );
  }

  // =========================
  // Discount Calculation
  // =========================

  let discountAmount = (amount * coupon.discountPercentage) / 100;

  discountAmount = Math.min(discountAmount, coupon.maxDiscount);

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
    .json(new ApiResponse(200, couponData, "Coupon applied successfully"));
});

const getAllCoupon = asyncHandler(async (req, res) => {
  // =========================
  // Get Query Parameters
  // =========================

  const { search = "", page = 1, limit = 5 } = req.query;

  // =========================
  // Build Search Filter
  // =========================

  const filter = {
    code: {
      $regex: search,
      $options: "i",
    },
  };

  // =========================
  // Count Total Coupons
  // =========================

  const totalCoupons = await couponModel.countDocuments(filter);

  // =========================
  // Get Coupons
  // =========================

  const coupons = await couponModel
    .find(filter)
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  // =========================
  // No Coupons Found
  // =========================

  if (coupons.length === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,

        {
          totalCoupons: 0,
          totalPages: 0,
          currentPage: Number(page),
          coupons: [],
        },

        "No coupons found",
      ),
    );
  }

  // =========================
  // Prepare Response
  // =========================

  const couponData = {
    totalCoupons,

    totalPages: Math.ceil(totalCoupons / Number(limit)),

    currentPage: Number(page),

    coupons,
  };

  // =========================
  // Send Response
  // =========================

  return res.status(200).json(
    new ApiResponse(
      200,

      couponData,

      "Coupons fetched successfully",
    ),
  );
});

const deleteCoupon = asyncHandler(async (req, res) => {
  // =========================
  // Get Coupon ID
  // =========================

  const { couponId } = req.params;

  // =========================
  // Validate Coupon ID
  // =========================

  if (!mongoose.Types.ObjectId.isValid(couponId)) {
    throw new ApiError(400, "Invalid Coupon ID");
  }

  // =========================
  // Find Coupon
  // =========================

  const coupon = await couponModel.findById(couponId);

  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  // =========================
  // Delete Coupon
  // =========================

  await coupon.deleteOne();

  // =========================
  // Send Response
  // =========================

  return res.status(200).json(
    new ApiResponse(
      200,

      {},

      "Coupon deleted successfully",
    ),
  );
});

const updateCoupon = asyncHandler(async (req, res) => {

    // =========================
    // Get Coupon ID
    // =========================

    const { couponId } = req.params;

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

    if (!coupon) {

        throw new ApiError(
            404,
            "Coupon not found"
        );

    }

    // =========================
    // Get Request Data
    // =========================

    const {

        code,

        discountPercentage,

        expiryDate,

        minimumAmount,

        maxDiscount,

        usageLimit,

        isActive,

    } = req.body;

    // =========================
    // Update Coupon Code
    // =========================

    if (code) {

        const existingCoupon = await couponModel.findOne({

            code: code.trim().toUpperCase(),

            _id: { $ne: couponId },

        });

        if (existingCoupon) {

            throw new ApiError(
                409,
                "Coupon already exists"
            );

        }

        coupon.code = code.trim().toUpperCase();

    }

    // =========================
    // Update Discount Percentage
    // =========================

    if (discountPercentage !== undefined) {

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

        coupon.discountPercentage = discountPercentage;

    }

    // =========================
    // Update Expiry Date
    // =========================

    if (expiryDate) {

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const expiry = new Date(expiryDate);

        if (expiry <= today) {

            throw new ApiError(
                400,
                "Expiry date must be in the future"
            );

        }

        coupon.expiryDate = expiry;

    }

    // =========================
    // Update Minimum Amount
    // =========================

    if (minimumAmount !== undefined) {

        if (minimumAmount < 0) {

            throw new ApiError(
                400,
                "Minimum amount cannot be negative"
            );

        }

        coupon.minimumAmount = minimumAmount;

    }

    // =========================
    // Update Maximum Discount
    // =========================

    if (maxDiscount !== undefined) {

        if (maxDiscount < 0) {

            throw new ApiError(
                400,
                "Maximum discount cannot be negative"
            );

        }

        coupon.maxDiscount = maxDiscount;

    }

    // =========================
    // Update Usage Limit
    // =========================

    if (usageLimit !== undefined) {

        if (usageLimit < 1) {

            throw new ApiError(
                400,
                "Usage limit must be at least 1"
            );

        }

        coupon.usageLimit = usageLimit;

    }

    // =========================
    // Update Active Status
    // =========================

    if (isActive !== undefined) {

        coupon.isActive = isActive;

    }

    // =========================
    // Save Coupon
    // =========================

    await coupon.save();

    // =========================
    // Send Response
    // =========================

    return res.status(200).json(

        new ApiResponse(

            200,

            coupon,

            "Coupon updated successfully"

        )

    );

});

const toggleCouponStatus = asyncHandler(async (req, res) => {

    const { couponId } = req.params;

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

    if (!coupon) {

        throw new ApiError(
            404,
            "Coupon not found"
        );

    }

    // =========================
    // Toggle Status
    // =========================

    coupon.isActive = !coupon.isActive;

    await coupon.save();

    // =========================
    // Response
    // =========================

    return res.status(200).json(

        new ApiResponse(

            200,

            coupon,

            `Coupon ${
                coupon.isActive ? "activated" : "deactivated"
            } successfully`

        )

    );

});

const getActiveCoupons = asyncHandler(async (req, res) => {
  const userId = req.user?.id;

  const activeCoupons = await couponModel
    .find({
      isActive: true,
      expiryDate: { $gt: new Date() },
    })
    .select("code discountPercentage minimumAmount maxDiscount expiryDate usageLimit usedCount userUsageLimit isFirstOrderOnly")
    .sort({ createdAt: -1 });

  let totalUserOrders = 0;
  if (userId) {
    totalUserOrders = await orderModel.countDocuments({
      user: userId,
      status: { $ne: "Cancelled" },
    });
  }

  const validCoupons = [];

  for (const c of activeCoupons) {
    if (c.usageLimit && c.usedCount >= c.usageLimit) {
      continue;
    }

    if (userId) {
      if (c.isFirstOrderOnly && totalUserOrders > 0) {
        continue;
      }

      const userCouponUsage = await orderModel.countDocuments({
        user: userId,
        coupon: c.code,
        status: { $ne: "Cancelled" },
      });

      const maxAllowed = c.userUsageLimit || 1;
      if (userCouponUsage >= maxAllowed) {
        continue;
      }
    }

    validCoupons.push(c);
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        validCoupons,
        "Active coupons fetched successfully"
      )
    );
});

module.exports = {
  updateCoupon,
  deleteCoupon,
  getAllCoupon,
  applyCoupon,
  createCoupon,
  toggleCouponStatus,
  getActiveCoupons,
};

