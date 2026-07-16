import api from "./api";


// ==========================================
// PLACE ORDER
// ==========================================

export const placeOrder = async (
    orderData
) => {
    const response = await api.post(
        "/place-order",
        orderData
    );

    return response.data;
};


// ==========================================
// GET MY ORDERS
// ==========================================

export const getMyOrders = async () => {
    const response = await api.get(
        "/get-my-order"
    );

    return response.data;
};


// ==========================================
// GET SINGLE ORDER
// ==========================================

export const getSingleOrder = async (
    orderId
) => {
    console.log(
        "SERVICE ORDER ID:",
        orderId
    );

    const response = await api.get(
        `/get-single-order/${orderId}`
    );

    return response.data;
};


// ==========================================
// CANCEL ORDER
// ==========================================

export const cancelOrder = async (
    orderId
) => {
    const response = await api.delete(
        `/cancel-order/${orderId}`
    );

    return response.data;
};


// ==========================================
// UPDATE ORDER STATUS
// ==========================================

export const updateOrderStatus = async (
    orderId,
    status
) => {
    const response = await api.put(
        `/update-order/${orderId}/status`,
        {
            status,
        }
    );

    return response.data;
};