import api from "./api";

export const getWishlist = async () => {
    const response = await api.get("/get-wishlist");
    return response.data;
};

export const addToWishlist = async (productId) => {
    const response = await api.post(`/add-to-wishlist/${productId}`);
    return response.data;
};

export const removeFromWishlist = async (productId) => {
    const response = await api.delete(`/remove-from-wishlist/${productId}`);
    return response.data;
};
