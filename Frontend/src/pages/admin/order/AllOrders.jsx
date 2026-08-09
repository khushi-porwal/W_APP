import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../../../services/orderService";
import { ShoppingBag, Eye, Search } from "lucide-react";

const STATUS_STYLES = {
    Delivered: "bg-green-100 text-green-700",
    Shipped: "bg-blue-100 text-blue-700",
    Processing: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-700",
    Placed: "bg-purple-100 text-purple-700",
};

function AllOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await getAllOrders();
            setOrders(response.data.orders || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const statuses = ["All", "Placed", "Processing", "Shipped", "Delivered", "Cancelled"];

    const filtered = orders.filter((order) => {
        const matchesSearch =
            order._id.toLowerCase().includes(search.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">All Orders</h1>
                    <p className="text-gray-500 text-sm mt-1">{orders.length} total orders</p>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by ID, customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {statuses.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                statusFilter === s
                                    ? "bg-indigo-600 text-white shadow-md"
                                    : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-400"
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-16 text-center">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading orders...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-16 text-center">
                        <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No orders found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-xs bg-gray-100 px-2.5 py-1.5 rounded-lg text-gray-600">
                                                #{order._id.slice(-8).toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-800 text-sm">{order.user?.name || "—"}</p>
                                            <p className="text-xs text-gray-500">{order.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-700">
                                            ₹{order.totalAmount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium capitalize">
                                                {order.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {order.createdAt
                                                ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                                : "—"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-700"}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => navigate(`/admin/orders/${order._id}`)}
                                                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                <Eye size={14} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllOrders;
