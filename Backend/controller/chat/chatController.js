const SupportTicket = require("../../models/support/supportTicket");
const { processBotQuery } = require("../../utils/chatbotEngine");
const { getIO } = require("../../sockets/socket");

/**
 * Handle user chat message
 */
exports.handleChatMessage = async (req, res, next) => {
    try {
        const { message, chatHistory } = req.body;

        if (!message || typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }

        const userId = req.user ? req.user.id || req.user._id : null;
        const result = await processBotQuery(message, userId, chatHistory);

        return res.status(200).json({
            success: true,
            data: {
                message: result.reply,
                suggestions: result.suggestions || [],
                orderData: result.orderData || null,
                isTicketPrompt: !!result.isTicketPrompt,
                isFallback: !!result.isFallback,
                category: result.category || null,
            },
        });
    } catch (error) {
        console.error("Chat message error:", error);
        return next(error);
    }
};

/**
 * Create a support ticket from chat or support form
 */
exports.createSupportTicket = async (req, res, next) => {
    try {
        const { name, email, subject, category, message, priority, chatHistory } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email, subject, and message are required.",
            });
        }

        const userId = req.user ? req.user.id || req.user._id : null;
        const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;

        const ticket = await SupportTicket.create({
            ticketId,
            user: userId,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject.trim(),
            category: category || "General Issue",
            priority: priority || "medium",
            message: message.trim(),
            chatHistory: Array.isArray(chatHistory) ? chatHistory : [],
            status: "open",
        });

        // Notify Admins via Socket.IO if connected
        try {
            const io = getIO();
            if (io) {
                io.to("admins").emit("new_support_ticket", {
                    ticketId: ticket.ticketId,
                    name: ticket.name,
                    email: ticket.email,
                    subject: ticket.subject,
                    category: ticket.category,
                    priority: ticket.priority,
                    createdAt: ticket.createdAt,
                });
            }
        } catch (socketErr) {
            console.warn("Socket notification warning:", socketErr.message);
        }

        return res.status(201).json({
            success: true,
            message: "Support ticket created successfully. Our team will contact you shortly!",
            ticket: {
                ticketId: ticket.ticketId,
                status: ticket.status,
                subject: ticket.subject,
                createdAt: ticket.createdAt,
            },
        });
    } catch (error) {
        console.error("Create ticket error:", error);
        return next(error);
    }
};

/**
 * Get tickets submitted by logged-in user
 */
exports.getUserTickets = async (req, res, next) => {
    try {
        const userId = req.user.id || req.user._id;
        const tickets = await SupportTicket.find({
            $or: [{ user: userId }, { email: req.user.email }],
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            tickets,
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Admin: Get all tickets with pagination & filters
 */
exports.getAdminTickets = async (req, res, next) => {
    try {
        const { status, category, priority, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (category) filter.category = category;
        if (priority) filter.priority = priority;

        const skip = (Number(page) - 1) * Number(limit);

        const [tickets, total] = await Promise.all([
            SupportTicket.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .populate("user", "name email role"),
            SupportTicket.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            tickets,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Admin: Update ticket status or notes
 */
exports.updateTicketStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, priority, adminNote } = req.body;

        const updateData = {};
        if (status) {
            updateData.status = status;
            if (status === "resolved" || status === "closed") {
                updateData.resolvedAt = new Date();
            }
        }
        if (priority) updateData.priority = priority;
        if (adminNote !== undefined) updateData.adminNote = adminNote;

        const updatedTicket = await SupportTicket.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({
                success: false,
                message: "Support ticket not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ticket updated successfully",
            ticket: updatedTicket,
        });
    } catch (error) {
        return next(error);
    }
};
