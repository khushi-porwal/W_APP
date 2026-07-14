import api from "./api";

export const getAllProducts = async (params = {}) => {
    const response = await api.get(
        "/get-product",
        {
            params,
        }
    );

    return response.data;
};

export const getSingleProduct = async (productId) => {
    const response = await api.get(
        `/single-product/${productId}`
    );

    return response.data;
};

//Interview answer

// “I use Axios query params to send search, 
// pagination, category and sorting filters to the backend.”