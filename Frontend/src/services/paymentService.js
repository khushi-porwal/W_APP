import api from "./api";

// Create Razorpay payment order
export const createPaymentOrder = async (orderId) => {
    const response = await api.post("/create-payment-order", { orderId });
    return response.data;
};

// Verify payment signature
export const verifyPayment = async (paymentData) => {
    const response = await api.post("/verify-payment", paymentData);
    return response.data;
};

// Handle payment failure / cancellation
export const markPaymentFailed = async (orderId) => {
    const response = await api.post("/payment-failed", { orderId });
    return response.data;
};
