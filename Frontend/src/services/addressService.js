import api from "./api";


// ==========================================
// ADD ADDRESS
// ==========================================

export const addAddress = async (
    addressData
) => {
    const response = await api.post(
        "/add-address",
        addressData
    );

    return response.data;
};


// ==========================================
// GET MY ADDRESSES
// ==========================================

export const getMyAddresses = async () => {
    const response = await api.get(
        "/get-my-address"
    );

    return response.data;
};


// ==========================================
// UPDATE ADDRESS
// ==========================================

export const updateAddress = async (
    addressId,
    addressData
) => {
    const response = await api.put(
        `/update-address/${addressId}`,
        addressData
    );

    return response.data;
};


// ==========================================
// DELETE ADDRESS
// ==========================================

export const deleteAddress = async (
    addressId
) => {
    const response = await api.delete(
        `/delete-address/${addressId}`
    );

    return response.data;
};