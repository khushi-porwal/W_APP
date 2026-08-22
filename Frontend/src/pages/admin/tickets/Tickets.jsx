import React, { useEffect, useState } from "react";
import {
    Ticket,
    CheckCircle2,
    Clock,
    AlertCircle,
    Search,
    Filter,
    MessageSquare,
    ChevronRight,
    User,
    Mail,
    Calendar,
    RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";
import { getAdminTickets, updateTicketStatus } from "../../../services/chatService";

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [adminNote, setAdminNote] = useState("");
    const [updating, setUpdating] = useState(false);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const params = {};
            if (statusFilter) params.status = statusFilter;
            if (priorityFilter) params.priority = priorityFilter;

            const res = await getAdminTickets(params);
            if (res.success) {
                setTickets(res.tickets || []);
            }
        } catch (err) {
            console.error("Error fetching tickets:", err);
            toast.error("Failed to load support tickets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [statusFilter, priorityFilter]);

    const handleSelectTicket = (t) => {
        setSelectedTicket(t);
        setAdminNote(t.adminNote || "");
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!selectedTicket) return;
        setUpdating(true);
        try {
            const res = await updateTicketStatus(selectedTicket._id, {
                status: newStatus,
                adminNote,
            });
            if (res.success) {
                toast.success(`Ticket marked as ${newStatus}`);
                setSelectedTicket(res.ticket);
                setTickets((prev) =>
                    prev.map((t) => (t._id === res.ticket._id ? res.ticket : t))
                );
            }
        } catch (err) {
            console.error("Update ticket error:", err);
            toast.error("Failed to update ticket");
        } finally {
            setUpdating(false);
        }
    };

    const handleSaveNote = async () => {
        if (!selectedTicket) return;
        setUpdating(true);
        try {
            const res = await updateTicketStatus(selectedTicket._id, {
                adminNote,
            });
            if (res.success) {
                toast.success("Admin note saved");
                setSelectedTicket(res.ticket);
                setTickets((prev) =>
                    prev.map((t) => (t._id === res.ticket._id ? res.ticket : t))
                );
            }
        } catch (err) {
            toast.error("Failed to save note");
        } finally {
            setUpdating(false);
        }
    };

    const filteredTickets = tickets.filter((t) => {
        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        return (
            t.ticketId?.toLowerCase().includes(s) ||
            t.name?.toLowerCase().includes(s) ||
            t.email?.toLowerCase().includes(s) ||
            t.subject?.toLowerCase().includes(s) ||
            t.category?.toLowerCase().includes(s)
        );
    });

    const getStatusBadge = (status) => {
        const map = {
            open: "bg-amber-100 text-amber-800 border-amber-300",
            in_progress: "bg-blue-100 text-blue-800 border-blue-300",
            resolved: "bg-emerald-100 text-emerald-800 border-emerald-300",
            closed: "bg-gray-100 text-gray-800 border-gray-300",
        };
        return (
            <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    map[status] || "bg-gray-100 text-gray-800"
                }`}
            >
                {status.replace("_", " ").toUpperCase()}
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        const map = {
            urgent: "text-red-700 bg-red-50 border-red-200",
            high: "text-orange-700 bg-orange-50 border-orange-200",
            medium: "text-indigo-700 bg-indigo-50 border-indigo-200",
            low: "text-gray-700 bg-gray-50 border-gray-200",
        };
        return (
            <span
                className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                    map[priority] || "bg-gray-50 text-gray-600"
                }`}
            >
                {priority?.toUpperCase()}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Ticket className="text-indigo-600 w-7 h-7" />
                        Customer Support Tickets
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage issues and requests escalated from chatbot & customer helpdesk
                    </p>
                </div>

                <button
                    onClick={fetchTickets}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-sm font-medium transition cursor-pointer self-start"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="md:col-span-2 relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search ticket #, customer name, email, subject..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>

                <div>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Priorities</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>
            </div>

            {/* Tickets Main Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Tickets List */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[650px]">
                    <div className="p-4 border-b border-gray-100 font-semibold text-sm text-gray-700 bg-gray-50/50 flex justify-between items-center">
                        <span>Tickets ({filteredTickets.length})</span>
                    </div>

                    <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400">Loading tickets...</div>
                        ) : filteredTickets.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">
                                <Ticket className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                                No support tickets match your filters.
                            </div>
                        ) : (
                            filteredTickets.map((t) => (
                                <div
                                    key={t._id}
                                    onClick={() => handleSelectTicket(t)}
                                    className={`p-4 hover:bg-indigo-50/40 transition cursor-pointer flex flex-col gap-2 ${
                                        selectedTicket?._id === t._id
                                            ? "bg-indigo-50/70 border-l-4 border-indigo-600"
                                            : ""
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                                            {t.ticketId}
                                        </span>
                                        {getStatusBadge(t.status)}
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                                            {t.subject}
                                        </h4>
                                        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                                            {t.message}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                                        <span>{t.name}</span>
                                        <div className="flex items-center gap-1.5">
                                            {getPriorityBadge(t.priority)}
                                            <span>
                                                {new Date(t.createdAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Ticket Details View */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between h-[650px] overflow-y-auto">
                    {selectedTicket ? (
                        <div className="space-y-5">
                            {/* Top row */}
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-mono font-bold text-indigo-600">
                                            {selectedTicket.ticketId}
                                        </span>
                                        {getStatusBadge(selectedTicket.status)}
                                        {getPriorityBadge(selectedTicket.priority)}
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900 mt-1">
                                        {selectedTicket.subject}
                                    </h2>
                                </div>

                                {/* Status actions */}
                                <div className="flex gap-2">
                                    {selectedTicket.status !== "in_progress" && (
                                        <button
                                            onClick={() => handleUpdateStatus("in_progress")}
                                            disabled={updating}
                                            className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold rounded-lg transition"
                                        >
                                            In Progress
                                        </button>
                                    )}
                                    {selectedTicket.status !== "resolved" && (
                                        <button
                                            onClick={() => handleUpdateStatus("resolved")}
                                            disabled={updating}
                                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold rounded-lg transition"
                                        >
                                            Resolve
                                        </button>
                                    )}
                                    {selectedTicket.status !== "closed" && (
                                        <button
                                            onClick={() => handleUpdateStatus("closed")}
                                            disabled={updating}
                                            className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs font-semibold rounded-lg transition"
                                        >
                                            Close
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Customer Info Card */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 p-3.5 rounded-xl text-xs text-gray-600">
                                <div>
                                    <span className="text-gray-400 block font-medium">Customer</span>
                                    <span className="font-semibold text-gray-900">{selectedTicket.name}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block font-medium">Email</span>
                                    <span className="font-semibold text-gray-900">{selectedTicket.email}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block font-medium">Category</span>
                                    <span className="font-semibold text-indigo-700">{selectedTicket.category}</span>
                                </div>
                            </div>

                            {/* Issue Message */}
                            <div>
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Customer Issue Description
                                </h4>
                                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {selectedTicket.message}
                                </div>
                            </div>

                            {/* Chat Context Snapshot if available */}
                            {selectedTicket.chatHistory && selectedTicket.chatHistory.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                                        Chatbot Conversation Snapshot
                                    </h4>
                                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl max-h-40 overflow-y-auto space-y-2 text-xs">
                                        {selectedTicket.chatHistory.map((m, i) => (
                                            <div
                                                key={i}
                                                className={`p-2 rounded-lg ${
                                                    m.sender === "user"
                                                        ? "bg-indigo-100 text-indigo-900 ml-4"
                                                        : "bg-white text-gray-700 mr-4 border border-gray-200"
                                                }`}
                                            >
                                                <span className="font-bold text-[10px] block opacity-70">
                                                    {m.sender.toUpperCase()}
                                                </span>
                                                <span>{m.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Admin Notes Section */}
                            <div className="pt-2">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                    Internal Admin Note
                                </h4>
                                <div className="flex gap-2">
                                    <textarea
                                        rows={2}
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        placeholder="Add resolution notes, tracking action taken, or comments..."
                                        className="flex-1 p-2.5 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                                    />
                                    <button
                                        onClick={handleSaveNote}
                                        disabled={updating}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition self-end cursor-pointer"
                                    >
                                        Save Note
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Ticket className="w-14 h-14 text-gray-300 mb-3" />
                            <p className="text-base font-semibold text-gray-600">No ticket selected</p>
                            <p className="text-xs text-gray-400 mt-1">Select a ticket from the left panel to inspect details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tickets;
