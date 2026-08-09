import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Package, ShoppingBag, ArrowRight } from "lucide-react";
import { getMyOrders, cancelOrder } from "../../../services/orderService";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getMyOrders();
            setOrders(response?.data?.orders || []);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;
        try {
            const response = await cancelOrder(orderId);
            toast.success(response.message || "Order cancelled successfully");
            fetchOrders();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to cancel order");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price || 0);
    };

    const formatDate = (date) => {
        return new Intl.DateTimeFormat("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        }).format(new Date(date));
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
                <div className="h-8 w-48 bg-slate-200 rounded-xl animate-pulse" />
                {[1, 2].map((i) => (
                    <div key={i} className="h-48 bg-slate-200 rounded-3xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag size={36} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">No Orders Found</h2>
                <p className="text-slate-500 text-sm mb-6">You haven't placed any orders yet.</p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
                >
                    Explore Products <ArrowRight size={16} />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900">My Orders</h1>
                <p className="text-slate-500 text-xs mt-1">Track and manage your order history</p>
            </div>

            <div className="space-y-6">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-slate-900 text-base">
                                        Order #{order._id.slice(-8).toUpperCase()}
                                    </h3>
                                    <p className="text-xs text-slate-400">Placed on {formatDate(order.createdAt)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                                        order.status === "Delivered"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : order.status === "Cancelled"
                                            ? "bg-rose-50 text-rose-700"
                                            : order.status === "Processing"
                                            ? "bg-sky-50 text-sky-700"
                                            : "bg-amber-50 text-amber-700"
                                    }`}
                                >
                                    ● {order.status}
                                </span>
                                <Link
                                    to={`/order/${order._id}`}
                                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {order.items.map((item) => (
                                <div
                                    key={item._id}
                                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100"
                                >
                                    <img
                                        src={item.product?.image || "https://via.placeholder.com/80"}
                                        alt={item.product?.name}
                                        className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                                    />
                                    <div className="min-w-0">
                                        <h4 className="font-bold text-xs text-slate-900 truncate">
                                            {item.product?.name}
                                        </h4>
                                        <p className="text-[10px] text-slate-500">Qty: {item.quantity}</p>
                                        <p className="text-xs font-black text-slate-900 mt-0.5">
                                            {formatPrice(item.price)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Footer Summary */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
                            <div className="flex items-center gap-4 text-slate-600">
                                <span>Total: <strong className="text-slate-900 text-sm">{formatPrice(order.totalAmount)}</strong></span>
                                <span>•</span>
                                <span>Payment: <strong className={order.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}>{order.paymentStatus}</strong></span>
                            </div>

                            {order.status === "Pending" && (
                                <button
                                    onClick={() => handleCancelOrder(order._id)}
                                    className="text-rose-600 font-bold hover:bg-rose-50 px-3 py-1.5 rounded-lg transition"
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyOrders;
