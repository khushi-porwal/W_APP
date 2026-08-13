const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io = null;

/**
 * Initialize Socket.IO server with HTTP server instance
 * @param {import("http").Server} httpServer 
 */
function initSocket(httpServer) {
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    io = new Server(httpServer, {
        cors: {
            origin: [clientUrl, "http://localhost:5173", "http://localhost:3000"],
            credentials: true,
            methods: ["GET", "POST"]
        }
    });

    // JWT Authentication Middleware for Socket.IO
    io.use((socket, next) => {
        try {
            // Extract token from handshake auth or headers
            let token = socket.handshake.auth?.token || socket.handshake.headers?.authorization;

            if (!token) {
                return next(new Error("Authentication error: Token not provided"));
            }

            if (token.startsWith("Bearer ")) {
                token = token.slice(7).trim();
            }

            // Verify JWT Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            if (!decoded || !decoded.id) {
                return next(new Error("Authentication error: Invalid token payload"));
            }

            // Attach user data to socket object
            socket.user = decoded;
            next();
        } catch (error) {
            console.error("Socket authentication error:", error.message);
            return next(new Error("Authentication error: Invalid or expired token"));
        }
    });

    // Connection Handler
    io.on("connection", (socket) => {
        const userId = socket.user.id;
        const userRole = socket.user.role;

        console.log(`[Socket.IO] User connected: ${userId} (${userRole})`);

        // Automatically join user room
        const userRoom = `user_${userId}`;
        socket.join(userRoom);
        console.log(`[Socket.IO] Socket ${socket.id} joined room: ${userRoom}`);

        // Automatically join admin room if role is admin
        if (userRole === "admin") {
            const adminRoom = "admins";
            socket.join(adminRoom);
            console.log(`[Socket.IO] Admin socket ${socket.id} joined room: ${adminRoom}`);
        }

        // Handle disconnect
        socket.on("disconnect", (reason) => {
            console.log(`[Socket.IO] User disconnected: ${userId} Reason: ${reason}`);
        });

        // Error handling on individual sockets
        socket.on("error", (err) => {
            console.error(`[Socket.IO] Socket error for user ${userId}:`, err);
        });
    });

    return io;
}

/**
 * Get initialized Socket.IO instance
 * @returns {import("socket.io").Server | null}
 */
function getIO() {
    if (!io) {
        console.warn("[Socket.IO] Warning: getIO called before initSocket");
    }
    return io;
}

module.exports = {
    initSocket,
    getIO
};
