import api from "./api";

export const signupUser = async (userData) => {
    const response = await api.post(
        "/signup",
        userData
    );

    return response.data;
};

export const loginUser = async (userData) => {
    const response = await api.post(
        "/login",
        userData
    )
    return response.data;
}

export const forgotPassword = async (email) => {
    const response = await api.post("/forgot-password", { email });
    return response.data;
};

export const resetPassword = async (token, password, confirmPassword) => {
    const response = await api.post(`/reset-password/${token}`, {
        password,
        confirmPassword,
    });
    return response.data;
};