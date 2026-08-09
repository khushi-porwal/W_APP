const express = require("express");
const router = express.Router();

const {
    createCoupon,
    getAllCoupon,
    updateCoupon,
    toggleCouponStatus,
    deleteCoupon,
    applyCoupon,
} = require("../../controller/coupon/couponController");

const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

router.post("/create-coupon", authMiddleware, adminMiddleware, createCoupon);

router.get(
    "/get-all-coupons",
    authMiddleware,
    adminMiddleware,
    getAllCoupon
);

router.put(
    "/update-coupon/:couponId",
    authMiddleware,
    adminMiddleware,
    updateCoupon
);

router.delete(
    "/delete-coupon/:couponId",
    authMiddleware,
    adminMiddleware,
    deleteCoupon
);

router.post(
    "/apply-coupon",
    authMiddleware,
    applyCoupon
);
router.patch(
    "/toggle-coupon-status/:couponId",
    authMiddleware,
    adminMiddleware,
    toggleCouponStatus
);

module.exports = router;