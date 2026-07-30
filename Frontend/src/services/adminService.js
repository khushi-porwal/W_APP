import api from "./api";

export const getDashboardStats = async () => {
    const response = await api.get("/dashboard-stats");
    return response.data;
};

export const getRecentOrders = async () => {
    const response = await api.get("/get-Recent-Order");
    return response.data;
};
export const getMonthlyRevenue = async () => {

    const response = await api.get("/monthly-revenue");

    return response.data;

};