const { getIO } = require("./socket");

/**
 * Emit real-time notification to a specific user
 * @param {string} userId 
 * @param {Object} notificationPayload 
 * @param {string} notificationPayload.type 
 * @param {string} [notificationPayload.orderId] 
 * @param {string} notificationPayload.message 
 * @param {Date} [notificationPayload.createdAt]
 */
function emitUserNotification(userId, notificationPayload) {
    try {
        const io = getIO();
        if (!io) return;

        const room = `user_${userId}`;
        io.to(room).emit("notification", {
            type: notificationPayload.type || "GENERAL",
            orderId: notificationPayload.orderId || null,
            message: notificationPayload.message,
            createdAt: notificationPayload.createdAt || new Date()
        });
        console.log(`[Socket.IO] Emitted notification to user ${userId}: ${notificationPayload.message}`);
    } catch (error) {
        console.error("[Socket.IO] Error emitting notification:", error.message);
    }
}

module.exports = {
    emitUserNotification
};
