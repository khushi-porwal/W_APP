import api from "./api";

export const addToCart = async (
    productId,
    quantity = 1
) => {
    const response = await api.post(
        `/cart/${productId}`,
        {
            quantity,
        }
    );

    return response.data;
};

export const getCart = async () => {
    const response = await api.get("/cart");

    return response.data;
};

export const updateCart = async (
    cartId,
    quantity
) => {
    const response = await api.put(
        `/cart/${cartId}`,
        {
            quantity,
        }
    );

    return response.data;
};

export const deleteCart = async (cartId) => {
    const response = await api.delete(
        `/cart/${cartId}`
    );

    return response.data;
};