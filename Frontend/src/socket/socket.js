import io from "socket.io-client";

let socket = null;

/**
 * Connect to Socket.IO backend with JWT token
 * @param {string} token - JWT authentication token
 */
export const connectSocket = (token) => {
    if (!token) return null;

    const BACKEND_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    if (socket) {
        // If socket already connected with same token, reuse
        if (socket.connected) {
            return socket;
        }
        socket.disconnect();
    }

    socket = io(BACKEND_URL, {
        auth: {
            token: token
        },
        transports: ["websocket", "polling"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });

    socket.on("connect", () => {
        console.log("[Socket.IO Client] Connected to server. Socket ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
        console.error("[Socket.IO Client] Connection Error:", err.message);
    });

    socket.on("disconnect", (reason) => {
        console.log("[Socket.IO Client] Disconnected:", reason);
    });

    return socket;
};

/**
 * Disconnect current socket session
 */
export const disconnectSocket = () => {
    if (socket) {
        console.log("[Socket.IO Client] Disconnecting socket...");
        socket.disconnect();
        socket = null;
    }
};

/**
 * Get active socket instance
 */
export const getSocket = () => {
    return socket;
};
