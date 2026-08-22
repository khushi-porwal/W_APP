import api from "./api";

/**
 * Send a chat message to the assistant
 * @param {string} message
 * @param {Array} chatHistory
 */
export const sendChatMessage = async (message, chatHistory = []) => {
    const response = await api.post("/api/chat/message", {
        message,
        chatHistory,
    });
    return response.data;
};

/**
 * Submit a customer support ticket / issue
 * @param {Object} ticketData
 */
export const submitSupportTicket = async (ticketData) => {
    const response = await api.post("/api/chat/ticket", ticketData);
    return response.data;
};

/**
 * Fetch logged-in user's support tickets
 */
export const getMyTickets = async () => {
    const response = await api.get("/api/chat/my-tickets");
    return response.data;
};

/**
 * Admin: Get all tickets
 */
export const getAdminTickets = async (params = {}) => {
    const response = await api.get("/api/admin/tickets", { params });
    return response.data;
};

/**
 * Admin: Update ticket status
 */
export const updateTicketStatus = async (ticketId, updateData) => {
    const response = await api.patch(`/api/admin/tickets/${ticketId}`, updateData);
    return response.data;
};
