const mongoose = require("mongoose");

const supportTicketSchema = new mongoose.Schema(
    {
        ticketId: {
            type: String,
            unique: true,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        subject: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: [
                "Order & Tracking",
                "Payment & Refund",
                "Shipping & Delivery",
                "Returns & Exchange",
                "Product Inquiry",
                "Account & Security",
                "General Issue",
            ],
            default: "General Issue",
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium",
        },
        status: {
            type: String,
            enum: ["open", "in_progress", "resolved", "closed"],
            default: "open",
        },
        message: {
            type: String,
            required: true,
        },
        chatHistory: [
            {
                sender: {
                    type: String,
                    enum: ["user", "bot", "agent"],
                },
                text: String,
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        adminNote: {
            type: String,
            default: "",
        },
        resolvedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

supportTicketSchema.index({ user: 1, createdAt: -1 });
supportTicketSchema.index({ status: 1 });

const SupportTicket = mongoose.model("SupportTicket", supportTicketSchema);
module.exports = SupportTicket;
