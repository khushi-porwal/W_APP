const express = require("express");
const router = express.Router();
const chatController = require("../../controller/chat/chatController");
const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");
const optionalAuthMiddleware = require("../../middleware/optionalAuthMiddleware");

// Public / Authenticated Chatbot routes
router.post("/api/chat/message", optionalAuthMiddleware, chatController.handleChatMessage);
router.post("/api/chat/ticket", optionalAuthMiddleware, chatController.createSupportTicket);
router.get("/api/chat/my-tickets", authMiddleware, chatController.getUserTickets);

// Admin Support Ticket Management routes
router.get("/api/admin/tickets", authMiddleware, adminMiddleware, chatController.getAdminTickets);
router.patch("/api/admin/tickets/:id", authMiddleware, adminMiddleware, chatController.updateTicketStatus);

module.exports = router;
