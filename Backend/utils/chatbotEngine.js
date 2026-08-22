const { GoogleGenerativeAI } = require("@google/generative-ai");
const Order = require("../models/order/Order");
const Product = require("../models/products/product");
const User = require("../models/user");

/**
 * Intelligent AI Chatbot Engine powered by Google Gemini API
 */

// Initialize Gemini client with API key from environment
function getGeminiModel() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "" || apiKey === "YOUR_GEMINI_API_KEY") {
        return null;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash for fast and cost-effective customer support conversations
    return genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 600,
        },
    });
}

/**
 * Gather live database context for the user and store
 */
async function fetchUserContext(userId) {
    let contextStr = "Store Policies & Information:\n";
    contextStr += "- Return/Exchange: 7-day hassle-free returns from delivery date. Items must be in original condition.\n";
    contextStr += "- Refunds: Razorpay/UPI/Card refunds take 3-5 business days after return approval. COD refunds are sent via UPI or bank transfer.\n";
    contextStr += "- Shipping: Orders are dispatched within 24 hours. Delivery takes 2-5 business days.\n";
    contextStr += "- Payments: Supports Razorpay (Credit/Debit Cards, UPI, Netbanking) and Cash on Delivery (COD).\n";
    contextStr += "- Support Tickets: Users can raise a formal support ticket directly in this chat widget for human desk escalation.\n\n";

    if (userId) {
        try {
            const [userDoc, recentOrders] = await Promise.all([
                User.findById(userId).select("name email"),
                Order.find({ user: userId })
                    .sort({ createdAt: -1 })
                    .limit(3)
                    .populate("items.product", "name price image"),
            ]);

            if (userDoc) {
                contextStr += `Authenticated Customer Details:\n- Name: ${userDoc.name}\n- Email: ${userDoc.email}\n\n`;
            }

            if (recentOrders && recentOrders.length > 0) {
                contextStr += "Customer Recent Orders:\n";
                recentOrders.forEach((ord, index) => {
                    const items = (ord.items || [])
                        .map((i) => `${i.product?.name || "Product"} (Qty: ${i.quantity}, Price: ₹${i.price})`)
                        .join(", ");
                    contextStr += `${index + 1}. Order ID: ${ord._id} | Status: ${ord.status} | Total: ₹${ord.totalAmount} | Payment: ${ord.paymentStatus} (${ord.paymentMethod}) | Placed: ${new Date(ord.createdAt).toLocaleDateString()} | Items: [${items}]\n`;
                });
                contextStr += "\n";
            } else {
                contextStr += "Customer has no previous orders.\n\n";
            }
        } catch (dbErr) {
            console.warn("Could not fetch user context for chatbot:", dbErr.message);
        }
    }

    return contextStr;
}

/**
 * Generate AI-driven Customer Support response using Gemini API
 */
async function processBotQuery(userMessage, userId = null, chatHistory = []) {
    const rawMessage = userMessage || "";
    const apiKey = process.env.GEMINI_API_KEY;

    // Check if user explicitly asked for ticket creation or human help
    const isEscalationRequest = /(raise ticket|open ticket|support ticket|talk to agent|human help|complaint|executive)/i.test(
        rawMessage
    );

    // If Gemini API Key is provided, execute via Gemini Generative AI
    if (apiKey && apiKey.trim() !== "" && apiKey !== "YOUR_GEMINI_API_KEY") {
        try {
            const model = getGeminiModel();
            if (model) {
                const liveContext = await fetchUserContext(userId);

                // Build conversation history for multi-turn chat
                const formattedHistory = [];
                if (Array.isArray(chatHistory)) {
                    chatHistory.slice(-6).forEach((msg) => {
                        if (msg.sender === "user" && msg.text) {
                            formattedHistory.push({
                                role: "user",
                                parts: [{ text: msg.text }],
                            });
                        } else if (msg.sender === "bot" && msg.text) {
                            formattedHistory.push({
                                role: "model",
                                parts: [{ text: msg.text }],
                            });
                        }
                    });
                }

                const systemPrompt = `You are "W_APP Assistant", an intelligent and empathetic customer support chatbot for an e-commerce platform called W_APP.
Your goal is to help users resolve issues, answer questions about orders, payments, refunds, returns, shipping, and product recommendations accurately and concisely.

Here is the current live store and customer context:
=== CONTEXT START ===
${liveContext}
=== CONTEXT END ===

Guidelines:
1. Be polite, clear, and helpful. Use markdown bullet points and emojis to make responses easy to read.
2. If the user asks about their order or tracking and an order exists in context, reference the Order ID and its live status.
3. If an issue requires manual intervention (e.g., damaged product received, refund delay over 7 days, unauthorized charge, account issue), advise them to click the "Raise a Support Ticket" option.
4. Keep replies crisp and under 150 words unless detailed troubleshooting is requested.
5. End with a helpful follow-up question or suggestion.`;

                const chatSession = model.startChat({
                    history: [
                        {
                            role: "user",
                            parts: [{ text: `[System Instruction: ${systemPrompt}]` }],
                        },
                        {
                            role: "model",
                            parts: [{ text: "Understood. I am W_APP Assistant, ready to help customers with their orders and queries." }],
                        },
                        ...formattedHistory,
                    ],
                });

                const result = await chatSession.sendMessage(rawMessage);
                const replyText = result.response.text();

                // Dynamic suggestions based on context
                let suggestions = ["📦 Track My Order", "💳 Payment & Refunds", "🔄 Return Policy", "🎫 Raise a Ticket"];
                if (/return|refund/i.test(rawMessage)) {
                    suggestions = ["Refund Timeline", "Return Eligibility", "Raise a Ticket", "Track Order"];
                } else if (/order|track|ship/i.test(rawMessage)) {
                    suggestions = ["Cancel Order", "Delivery Timelines", "Raise a Ticket", "Shop More"];
                } else if (/ticket|help|agent|issue/i.test(rawMessage)) {
                    suggestions = ["🎫 Open Ticket Form", "Check Ticket Status", "Return Policy"];
                }

                return {
                    reply: replyText,
                    suggestions,
                    isTicketPrompt: isEscalationRequest || /ticket|complaint|escalat/i.test(replyText),
                };
            }
        } catch (apiError) {
            console.error("Gemini API Error:", apiError.message || apiError);
            // Fall through to fallback engine if API fails (e.g. rate limit, invalid key)
        }
    }

    // High Quality Dynamic Engine (Fallback when GEMINI_API_KEY is not set or during offline/network fallback)
    return await handleSmartFallback(rawMessage, userId);
}

/**
 * Smart Fallback Engine
 */
async function handleSmartFallback(rawMessage, userId) {
    const clean = rawMessage.toLowerCase().trim();

    // 1. Greetings
    if (/^(hi|hello|hey|greetings|good morning|good evening|good afternoon|namaste)/i.test(clean)) {
        return {
            reply: `👋 Hello! I am your **W_APP AI Support Assistant**.\n\nI can help you with:\n• 📦 **Live order tracking & status updates**\n• 💳 **Payment, refund & cancellation inquiries**\n• 🔄 **Return & replacement policies**\n• 🎫 **Instant Support Ticket submission for our human team**\n\nHow can I help you today?`,
            suggestions: ["📦 Track My Order", "💳 Payment & Refunds", "🚚 Shipping Time", "🔄 Return Policy", "🎫 Raise a Ticket"],
        };
    }

    // 2. Ticket / Human Help
    if (/(human|agent|talk to someone|representative|ticket|complaint|escalat)/i.test(clean)) {
        return {
            reply: `👩‍💼 **Need human assistance or want to report an issue?**\n\nYou can raise a **Support Ticket** right here in seconds! Our support team will review your conversation history and reach out promptly.`,
            isTicketPrompt: true,
            suggestions: ["🎫 Open Ticket Form", "📦 Track Order", "FAQ Help"],
        };
    }

    // 3. Order Tracking Intent
    if (/(track|order status|where is my order|shipment|delivery status|my order)/i.test(clean) || /[0-9a-fA-F]{24}/.test(rawMessage)) {
        try {
            const objectIdMatch = rawMessage.match(/[0-9a-fA-F]{24}/);
            let order = null;

            if (objectIdMatch) {
                order = await Order.findById(objectIdMatch[0]).populate("items.product", "name price image");
            } else if (userId) {
                order = await Order.findOne({ user: userId }).sort({ createdAt: -1 }).populate("items.product", "name price image");
            }

            if (order) {
                const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                return {
                    reply: `📦 **Order Tracking Found:**\n\n` +
                        `• **Order ID:** \`${order._id}\`\n` +
                        `• **Placed On:** ${dateStr}\n` +
                        `• **Status:** **${order.status}**\n` +
                        `• **Payment:** ${order.paymentStatus} (${order.paymentMethod})\n` +
                        `• **Total:** ₹${order.totalAmount}\n\n` +
                        `Need to cancel or return this order? Use the options below.`,
                    orderData: {
                        id: order._id.toString(),
                        status: order.status,
                        totalAmount: order.totalAmount,
                        paymentStatus: order.paymentStatus,
                    },
                    suggestions: ["Cancel This Order", "Return Policy", "Raise a Ticket", "Shop More"],
                };
            }

            if (!userId) {
                return {
                    reply: `🔍 Please **log in** or paste your **24-character Order ID** so I can look up live tracking details for you!`,
                    suggestions: ["Login", "Raise Support Ticket", "Browse Products"],
                };
            }

            return {
                reply: `📦 You don't have any recent orders placed yet. If you have an order ID from guest checkout, please paste it here.`,
                suggestions: ["Browse Products", "Check Offers", "Raise Ticket"],
            };
        } catch (err) {
            console.error("Order lookup error:", err);
        }
    }

    // 4. Returns & Refunds
    if (/return|refund|money back|replace|exchange/i.test(clean)) {
        return {
            reply: `🔄 **Returns & Refund Guidelines:**\n\n• **7-Day Return Window:** You can return or exchange eligible products within 7 days of delivery.\n• **Refund Processing:** Online payment refunds (Razorpay/Cards/UPI) take **3-5 business days**.\n• **Cash on Delivery:** COD refunds are transferred directly via UPI or bank account upon return verification.`,
            suggestions: ["Track Refund Status", "Raise a Ticket", "Track My Order"],
        };
    }

    // 5. Shipping & Delivery
    if (/shipping|delivery|courier|dispatch|how long/i.test(clean)) {
        return {
            reply: `🚚 **Shipping & Delivery Timelines:**\n\n• Standard delivery arrives in **2-5 business days** depending on your location.\n• Orders are dispatched within 24 hours of placement.\n• Tracking updates are sent directly to your registered email and profile dashboard.`,
            suggestions: ["Track My Order", "Change Address", "Raise a Ticket"],
        };
    }

    // Default Fallback
    return {
        reply: `🤔 I can help you with order tracking, return policies, payment issues, or connect you with our human support team. What would you like help with?`,
        suggestions: ["📦 Track My Order", "💳 Payment & Refunds", "🔄 Return Policy", "🎫 Raise a Ticket"],
        isFallback: true,
    };
}

module.exports = {
    processBotQuery,
};
