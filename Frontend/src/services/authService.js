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