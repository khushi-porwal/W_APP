const { getIO } = require("./socket");

/**
 * Broadcast stock update to all connected customers
 * @param {string} productId 
 * @param {number} stock 
 */
function emitStockUpdate(productId, stock) {
    try {
        const io = getIO();
        if (!io) return;

        io.emit("stockUpdated", {
            productId,
            stock
        });
        console.log(`[Socket.IO] Broadcasted stockUpdated: Product ${productId} -> Stock ${stock}`);
    } catch (error) {
        console.error("[Socket.IO] Error emitting stockUpdated:", error.message);
    }
}

module.exports = {
    emitStockUpdate
};
