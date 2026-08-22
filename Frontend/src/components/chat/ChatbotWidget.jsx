import React, { useState, useEffect, useRef } from "react";
import {
    MessageSquare,
    X,
    Send,
    Bot,
    User,
    Sparkles,
    RotateCcw,
    AlertCircle,
    CheckCircle2,
    Package,
    CreditCard,
    Truck,
    RotateCcw as ReturnIcon,
    Headphones,
    Minimize2,
    Ticket,
    ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { sendChatMessage, submitSupportTicket } from "../../services/chatService";

const INITIAL_GREETING = {
    id: "init-1",
    sender: "bot",
    text: "👋 Hi! Welcome to **W_APP Support**. I'm your AI virtual assistant here to help with any issue, order tracking, returns, or support inquiries.",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    suggestions: [
        "📦 Track My Order",
        "💳 Payment & Refunds",
        "🚚 Shipping & Delivery",
        "🔄 Return & Exchange Policy",
        "🎫 Raise a Support Ticket",
    ],
};

const ChatbotWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem("wapp_chat_history");
            return saved ? JSON.parse(saved) : [INITIAL_GREETING];
        } catch {
            return [INITIAL_GREETING];
        }
    });
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [showTicketForm, setShowTicketForm] = useState(false);
    const [ticketData, setTicketData] = useState({
        name: "",
        email: "",
        subject: "",
        category: "General Issue",
        priority: "medium",
        message: "",
    });
    const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
    const [submittedTicket, setSubmittedTicket] = useState(null);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Sync user details into ticket form if logged in
    useEffect(() => {
        if (user) {
            setTicketData((prev) => ({
                ...prev,
                name: user.name || prev.name,
                email: user.email || prev.email,
            }));
        }
    }, [user]);

    // Save messages to local storage
    useEffect(() => {
        try {
            localStorage.setItem("wapp_chat_history", JSON.stringify(messages));
        } catch (e) {
            console.error("Local storage error:", e);
        }
    }, [messages]);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && !showTicketForm) {
            scrollToBottom();
        }
    }, [messages, isTyping, isOpen, showTicketForm]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !showTicketForm) {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [isOpen, showTicketForm]);

    const handleSendMessage = async (textToSend) => {
        const query = (textToSend || inputMessage).trim();
        if (!query) return;

        // Check if user clicked "Raise a Support Ticket" shortcut
        if (
            query.toLowerCase().includes("raise a ticket") ||
            query.toLowerCase().includes("open ticket form") ||
            query.toLowerCase().includes("raise ticket")
        ) {
            setShowTicketForm(true);
            setInputMessage("");
            return;
        }

        const userMsg = {
            id: `usr-${Date.now()}`,
            sender: "user",
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        const updatedHistory = [...messages, userMsg];
        setMessages(updatedHistory);
        setInputMessage("");
        setIsTyping(true);

        try {
            const apiRes = await sendChatMessage(query, updatedHistory);
            if (apiRes.success && apiRes.data) {
                const botMsg = {
                    id: `bot-${Date.now()}`,
                    sender: "bot",
                    text: apiRes.data.message,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    suggestions: apiRes.data.suggestions || [],
                    orderData: apiRes.data.orderData || null,
                    isTicketPrompt: apiRes.data.isTicketPrompt,
                };
                setMessages((prev) => [...prev, botMsg]);
            }
        } catch (error) {
            console.error("Chat message error:", error);
            const errorMsg = {
                id: `bot-${Date.now()}`,
                sender: "bot",
                text: "⚠️ Sorry, I encountered a temporary connection issue. You can still submit a support ticket directly to our team!",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                suggestions: ["🎫 Raise a Support Ticket", "🔄 Try Again"],
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleResetChat = () => {
        setMessages([INITIAL_GREETING]);
        setShowTicketForm(false);
        setSubmittedTicket(null);
        localStorage.removeItem("wapp_chat_history");
        toast.success("Chat history reset");
    };

    const handleTicketSubmit = async (e) => {
        e.preventDefault();
        if (!ticketData.name || !ticketData.email || !ticketData.subject || !ticketData.message) {
            toast.error("Please fill in all required ticket fields");
            return;
        }

        setIsSubmittingTicket(true);
        try {
            const res = await submitSupportTicket({
                ...ticketData,
                chatHistory: messages.slice(-8), // Send recent context
            });

            if (res.success) {
                setSubmittedTicket(res.ticket);
                toast.success(`Support Ticket #${res.ticket.ticketId} created!`);
                // Append bot message in background
                const confirmationMsg = {
                    id: `bot-${Date.now()}`,
                    sender: "bot",
                    text: `✅ **Ticket Created:** \`${res.ticket.ticketId}\`\n**Subject:** ${res.ticket.subject}\n\nOur team has received your request and will reach out to **${ticketData.email}** shortly.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    suggestions: ["📦 Track My Order", "🛍️ Browse Store", "Ask Another Question"],
                };
                setMessages((prev) => [...prev, confirmationMsg]);
            }
        } catch (err) {
            console.error("Ticket submission failed:", err);
            toast.error(err.response?.data?.message || "Failed to submit ticket. Please try again.");
        } finally {
            setIsSubmittingTicket(false);
        }
    };

    // Helper to render text with bold/bullets/code
    const renderFormattedText = (text) => {
        if (!text) return null;

        return text.split("\n").map((line, idx) => {
            // Check for bold or bullet points
            const isBullet = line.trim().startsWith("•") || line.trim().startsWith("-");
            
            // Format bold text **text** and inline code `code`
            const formattedLine = line
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/`(.*?)`/g, "<code class='bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-xs font-mono font-semibold'>$1</code>");

            return (
                <div
                    key={idx}
                    className={`leading-relaxed ${isBullet ? "pl-2 flex items-start space-x-1" : ""} ${line === "" ? "h-2" : ""}`}
                    dangerouslySetInnerHTML={{ __html: formattedLine }}
                />
            );
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
            {/* Chatbot Window */}
            {isOpen && (
                <div className="w-[92vw] sm:w-[410px] h-[580px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 mb-4">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-4 flex items-center justify-between shadow-md">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white border border-white/30 shadow-inner">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-indigo-700 rounded-full shadow-sm"></span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-base flex items-center gap-1.5 leading-tight">
                                    W_APP Assistant
                                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                                </h3>
                                <p className="text-xs text-indigo-100/90 font-medium">Customer Support & Help</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-1">
                            <button
                                onClick={handleResetChat}
                                title="Reset Conversation"
                                className="p-1.5 text-indigo-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                title="Close Chat"
                                className="p-1.5 text-indigo-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content Area (Messages OR Support Ticket Form) */}
                    {showTicketForm ? (
                        /* Support Ticket Form View */
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50/70 text-gray-800">
                            <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
                                <div className="flex items-center space-x-2">
                                    <Ticket className="w-5 h-5 text-indigo-600" />
                                    <h4 className="font-semibold text-gray-900 text-sm">Raise a Support Ticket</h4>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowTicketForm(false);
                                        setSubmittedTicket(null);
                                    }}
                                    className="text-xs font-medium text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                                >
                                    Back to Chat
                                </button>
                            </div>

                            {submittedTicket ? (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center my-4">
                                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                                    <h5 className="font-bold text-emerald-900 text-base">Ticket Submitted!</h5>
                                    <p className="text-xs text-emerald-700 mt-1">
                                        Your ticket reference is: <strong className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded">{submittedTicket.ticketId}</strong>
                                    </p>
                                    <p className="text-xs text-gray-600 mt-2">
                                        Our support executive will review the details and reach out to you via email.
                                    </p>
                                    <button
                                        onClick={() => {
                                            setShowTicketForm(false);
                                            setSubmittedTicket(null);
                                        }}
                                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition"
                                    >
                                        Return to Conversation
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
                                    <p className="text-gray-500 mb-1">
                                        Need human help or faced an issue? Fill out this quick form and our support desk will assist you.
                                    </p>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Your Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={ticketData.name}
                                            onChange={(e) => setTicketData({ ...ticketData, name: e.target.value })}
                                            placeholder="Enter your name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Email Address *</label>
                                        <input
                                            type="email"
                                            required
                                            value={ticketData.email}
                                            onChange={(e) => setTicketData({ ...ticketData, email: e.target.value })}
                                            placeholder="Enter your email"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-800"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">Category</label>
                                            <select
                                                value={ticketData.category}
                                                onChange={(e) => setTicketData({ ...ticketData, category: e.target.value })}
                                                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-800 text-xs"
                                            >
                                                <option value="Order & Tracking">Order & Tracking</option>
                                                <option value="Payment & Refund">Payment & Refund</option>
                                                <option value="Shipping & Delivery">Shipping & Delivery</option>
                                                <option value="Returns & Exchange">Returns & Exchange</option>
                                                <option value="Product Inquiry">Product Inquiry</option>
                                                <option value="Account & Security">Account & Security</option>
                                                <option value="General Issue">General Issue</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">Priority</label>
                                            <select
                                                value={ticketData.priority}
                                                onChange={(e) => setTicketData({ ...ticketData, priority: e.target.value })}
                                                className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-800 text-xs"
                                            >
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                                <option value="urgent">Urgent</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Issue Subject *</label>
                                        <input
                                            type="text"
                                            required
                                            value={ticketData.subject}
                                            onChange={(e) => setTicketData({ ...ticketData, subject: e.target.value })}
                                            placeholder="e.g. Damaged product delivered / Refund pending"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-800"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-1">Detailed Message *</label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={ticketData.message}
                                            onChange={(e) => setTicketData({ ...ticketData, message: e.target.value })}
                                            placeholder="Describe what happened and how we can help..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white text-gray-800 resize-none"
                                        ></textarea>
                                    </div>

                                    <div className="flex gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowTicketForm(false)}
                                            className="w-1/3 py-2 text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmittingTicket}
                                            className="w-2/3 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition flex items-center justify-center space-x-1.5 shadow disabled:opacity-50 cursor-pointer"
                                        >
                                            {isSubmittingTicket ? (
                                                <span>Submitting...</span>
                                            ) : (
                                                <>
                                                    <span>Submit Ticket</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ) : (
                        /* Standard Chat Messages Feed */
                        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/60">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                                >
                                    <div className="flex items-end gap-2 max-w-[85%]">
                                        {msg.sender === "bot" && (
                                            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm mb-1">
                                                <Bot className="w-4 h-4" />
                                            </div>
                                        )}

                                        <div
                                            className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                                                msg.sender === "user"
                                                    ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-none"
                                                    : "bg-white text-gray-800 border border-gray-200/80 rounded-bl-none"
                                            }`}
                                        >
                                            <div className="space-y-1">
                                                {renderFormattedText(msg.text)}
                                            </div>

                                            {/* Order Data Card if present */}
                                            {msg.orderData && (
                                                <div className="mt-3 p-2.5 bg-indigo-50/80 rounded-xl border border-indigo-100 text-indigo-950 space-y-1">
                                                    <div className="flex justify-between items-center font-semibold text-xs border-b border-indigo-200/50 pb-1">
                                                        <span>Order #{msg.orderData.id.slice(-6).toUpperCase()}</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-200 text-indigo-800 font-bold">
                                                            {msg.orderData.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-[11px] text-gray-600 pt-1">
                                                        <span>Total: ₹{msg.orderData.totalAmount}</span>
                                                        <span>Payment: {msg.orderData.paymentStatus}</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Ticket Form Prompt Button */}
                                            {msg.isTicketPrompt && (
                                                <div className="mt-2.5 pt-2 border-t border-gray-100">
                                                    <button
                                                        onClick={() => setShowTicketForm(true)}
                                                        className="w-full py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition cursor-pointer"
                                                    >
                                                        <Ticket className="w-3.5 h-3.5" />
                                                        <span>Open Support Ticket Form</span>
                                                    </button>
                                                </div>
                                            )}

                                            <span
                                                className={`text-[9px] block mt-1.5 text-right font-medium ${
                                                    msg.sender === "user" ? "text-indigo-200" : "text-gray-400"
                                                }`}
                                            >
                                                {msg.timestamp}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Chips / Suggestions */}
                                    {msg.suggestions && msg.suggestions.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2 pl-9">
                                            {msg.suggestions.map((sug, sIdx) => (
                                                <button
                                                    key={sIdx}
                                                    onClick={() => handleSendMessage(sug)}
                                                    className="px-2.5 py-1 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 hover:text-indigo-800 rounded-full text-[11px] font-medium shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1"
                                                >
                                                    <span>{sug}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Typing Indicator */}
                            {isTyping && (
                                <div className="flex items-end gap-2">
                                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1.5">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    )}

                    {/* Chat Input Bar */}
                    {!showTicketForm && (
                        <div className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type your issue or question..."
                                className="flex-1 px-3.5 py-2.5 text-xs bg-gray-100/80 hover:bg-gray-100 focus:bg-white text-gray-800 rounded-xl border border-transparent focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-gray-400"
                            />
                            <button
                                onClick={() => handleSendMessage()}
                                disabled={!inputMessage.trim() || isTyping}
                                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded-xl shadow-md transition-all active:scale-95 flex-shrink-0 cursor-pointer"
                                title="Send Message"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Floating Trigger Launcher Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-xl hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-indigo-200"
                aria-label="Open Customer Support Chat"
            >
                {isOpen ? (
                    <X className="w-6 h-6 transition-transform duration-200" />
                ) : (
                    <>
                        <MessageSquare className="w-7 h-7 transition-transform group-hover:scale-110" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
                        </span>
                    </>
                )}
            </button>
        </div>
    );
};

export default ChatbotWidget;
