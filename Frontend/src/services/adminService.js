import api from "./api";

// Users API
export const getAllUsers = async () => {
    const response = await api.get("/admin/get-all-users");
    return response.data;
};

export const createAdminUser = async (userData) => {
    const response = await api.post("/admin/create-user", userData);
    return response.data;
};

export const updateUserRole = async (userId, role) => {
    const response = await api.put(`/admin/user/${userId}/role`, { role });
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await api.delete(`/admin/user/${userId}`);
    return response.data;
};

// Dashboard Stats & Analytics API
export const getDashboardStats = async () => {
    const response = await api.get("/admin/dashboard-stats");
    return response.data;
};

export const getMonthlyRevenue = async () => {
    const response = await api.get("/admin/monthly-revenue");
    return response.data;
};

export const getTopCategories = async () => {
    const response = await api.get("/admin/top-category");
    return response.data;
};

export const getTopSellingProducts = async () => {
    const response = await api.get("/admin/top-selling-products");
    return response.data;
};

export const getLowStockProducts = async () => {
    const response = await api.get("/admin/low-stock-products");
    return response.data;
};

export const getRecentOrders = async () => {
    const response = await api.get("/admin/get-Recent-Order");
    return response.data;
};

export const getOrderStatusStats = async () => {
    const response = await api.get("/admin/get-order-status");
    return response.data;
};

export const getOrderStatus = async () => {
    const response = await api.get("/admin/get-order-status");
    return response.data;
};

export const getBestCustomers = async () => {
    const response = await api.get("/admin/get-customers");
    return response.data;
};