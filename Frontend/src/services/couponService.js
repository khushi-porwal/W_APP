import api from "./api";

// =========================
// Create Coupon
// =========================

export const createCoupon = async (couponData) => {

    const response = await api.post(
        "/create-coupon",
        couponData
    );

    return response.data;

};

// =========================
// Get All Coupons
// =========================

export const getAllCoupons = async (
    search = "",
    page = 1,
    limit = 5
) => {

    const response = await api.get(
        `/get-all-coupons?search=${search}&page=${page}&limit=${limit}`
    );

    return response.data;

};

// =========================
// Update Coupon
// =========================

export const updateCoupon = async (
    couponId,
    couponData
) => {

    const response = await api.put(
        `/update-coupon/${couponId}`,
        couponData
    );

    return response.data;

};

// =========================
// Delete Coupon
// =========================

export const deleteCoupon = async (couponId) => {

    const response = await api.delete(
        `/delete-coupon/${couponId}`
    );

    return response.data;

};

// =========================
// Apply Coupon
// =========================

export const applyCoupon = async (couponData) => {

    const response = await api.post(
        "/apply-coupon",
        couponData
    );

    return response.data;

};


export const toggleCouponStatus = async (couponId) => {

    const response = await api.patch(
        `/toggle-coupon-status/${couponId}`
    );

    return response.data;

};