const { getIO } = require("./socket");

/**
 * Emit orderStatusUpdated event to specific customer room
 * @param {string} orderId 
 * @param {string} userId 
 * @param {string} status 
 * @param {Date} [updatedAt]
 */
function emitOrderStatusUpdate(orderId, userId, status, updatedAt = new Date()) {
    try {
        const io = getIO();
        if (!io) return;

        const room = `user_${userId}`;
        io.to(room).emit("orderStatusUpdated", {
            orderId,
            status,
            updatedAt
        });
        console.log(`[Socket.IO] Emitted orderStatusUpdated for order ${orderId} to room ${room}`);
    } catch (error) {
        console.error("[Socket.IO] Error emitting orderStatusUpdated:", error.message);
    }
}

/**
 * Emit newOrder event to admins room
 * @param {Object} orderData 
 */
function emitNewOrder(orderData) {
    try {
        const io = getIO();
        if (!io) return;

        io.to("admins").emit("newOrder", {
            orderId: orderData.orderId,
            customerName: orderData.customerName || "Customer",
            totalAmount: orderData.totalAmount,
            createdAt: orderData.createdAt || new Date()
        });
        console.log(`[Socket.IO] Emitted newOrder alert for order ${orderData.orderId} to admins room`);
    } catch (error) {
        console.error("[Socket.IO] Error emitting newOrder:", error.message);
    }
}

module.exports = {
    emitOrderStatusUpdate,
    emitNewOrder
};
