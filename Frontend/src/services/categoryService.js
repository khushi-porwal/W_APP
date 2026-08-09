import api from "./api"; // Your axios instance

// ✅ PUBLIC — used by storefront (Home, Products pages) — no auth needed
export const getPublicCategories = async (
    search = "",
    page = 1,
    limit = 100
) => {
    const response = await api.get(
        `/categories?search=${search}&page=${page}&limit=${limit}`
    );
    return response.data;
};

// 🔐 ADMIN — used by admin dashboard (requires admin token)
export const addCategory = async (formData) => {
    const response = await api.post(
        "/add-category",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export const getAllCategories = async (
    search = "",
    page = 1,
    limit = 5
) => {

    const response = await api.get(
        `/get-all-categories?search=${search}&page=${page}&limit=${limit}`
    );

    return response.data;

};

export const getCategories = getAllCategories;

export const updateCategory = async (id, formData) => {

    const response = await api.put(
        `/update-category/${id}`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;

};

export const deleteCategory = async (id) => {

    const response = await api.delete(
        `/delete-category/${id}`
    );

    return response.data;

};

