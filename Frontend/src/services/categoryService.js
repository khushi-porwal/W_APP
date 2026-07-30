import api from "./api"; // Your axios instance

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