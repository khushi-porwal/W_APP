import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Package, ArrowLeft, Download, CheckCircle, Clock, Truck, ShieldCheck } from "lucide-react";
import jsPDF from "jspdf";
import { getSingleOrder } from "../../../services/orderService";
import { createPaymentOrder, verifyPayment, markPaymentFailed } from "../../../services/paymentService";

function OrderDetails() {
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const response = await getSingleOrder(orderId);
            setOrder(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch order details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    const downloadInvoice = () => {
        if (!order) return;
        try {
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.text("LuxeMarket - Invoice", 14, 20);
            
            doc.setFontSize(10);
            doc.text(`Invoice No: INV-${order._id.slice(-8).toUpperCase()}`, 14, 30);
            doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, 14, 35);
            doc.text(`Customer: ${order.address?.fullName || "Valued Customer"}`, 14, 40);

            doc.line(14, 45, 196, 45);

            doc.setFontSize(12);
            doc.text("Items Summary", 14, 55);

            let y = 65;
            order.items.forEach((item, index) => {
                doc.setFontSize(10);
                doc.text(`${index + 1}. ${item.product?.name || "Product"} (x${item.quantity}) - Rs. ${item.price}`, 14, y);
                y += 8;
            });

            doc.line(14, y + 5, 196, y + 5);
            doc.setFontSize(12);
            doc.text(`Total Amount: Rs. ${order.totalAmount}`, 14, y + 15);
            doc.text(`Payment Status: ${order.paymentStatus}`, 14, y + 22);

            doc.save(`Invoice_${order._id.slice(-8)}.pdf`);
            toast.success("Invoice downloaded!");
        } catch (err) {
            toast.error("Failed to generate PDF invoice");
        }
    };

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
            month: "long",
            year: "numeric",
        }).format(new Date(date));
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Fetching order details...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-md mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-900">Order Not Found</h2>
                <Link to="/orders" className="inline-block mt-4 text-indigo-600 font-bold hover:underline">
                    Back to Orders
                </Link>
            </div>
        );
    }

    const steps = [
        { label: "Order Placed", status: "Pending" },
        { label: "Processing", status: "Processing" },
        { label: "Shipped", status: "Shipped" },
        { label: "Delivered", status: "Delivered" },
    ];

    const currentStepIndex = steps.findIndex(s => s.status === order.status);

    const handleRetryPayment = async () => {
        if (!order) return;
        try {
            setPaying(true);
            const paymentOrderRes = await createPaymentOrder(order._id);
            const razorpayOrder = paymentOrderRes?.data;

            if (!razorpayOrder) {
                throw new Error("Failed to initialize Razorpay order");
            }

            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SyZiAEpn6NAc95";

            const options = {
                key: razorpayKey,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency || "INR",
                name: "LuxeMarket",
                description: `Payment for Order #${order._id.slice(-6).toUpperCase()}`,
                order_id: razorpayOrder.id,
                prefill: {
                    name: order.address?.fullName || "",
                    email: order.user?.email || "",
                    contact: order.address?.phone || "",
                },
                theme: {
                    color: "#4f46e5",
                },
                handler: async function (paymentResponse) {
                    try {
                        setPaying(true);
                        await verifyPayment({
                            orderId: order._id,
                            razorpay_order_id: paymentResponse.razorpay_order_id,
                            razorpay_payment_id: paymentResponse.razorpay_payment_id,
                            razorpay_signature: paymentResponse.razorpay_signature,
                        });
                        toast.success("Payment successful!");
                        fetchOrder();
                    } catch (err) {
                        toast.error(err.response?.data?.message || "Payment verification failed");
                        fetchOrder();
                    } finally {
                        setPaying(false);
                    }
                },
                modal: {
                    ondismiss: async function () {
                        try {
                            await markPaymentFailed(order._id);
                            toast.error("Payment cancelled");
                        } catch (err) {
                            console.error(err);
                        }
                        fetchOrder();
                    },
                },
            };

            if (!window.Razorpay) {
                toast.error("Razorpay SDK is unavailable. Please refresh and try again.");
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", async function (failureResponse) {
                try {
                    await markPaymentFailed(order._id);
                    toast.error(failureResponse.error?.description || "Payment failed");
                } catch (err) {
                    console.error(err);
                }
                fetchOrder();
            });
            rzp.open();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || "Failed to start payment");
        } finally {
            setPaying(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="flex items-center justify-between">
                <Link
                    to="/orders"
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
                >
                    <ArrowLeft size={16} /> Back to My Orders
                </Link>

                <button
                    onClick={downloadInvoice}
                    className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs px-4 py-2 rounded-xl hover:bg-indigo-100 transition"
                >
                    <Download size={15} /> Download Invoice
                </button>
            </div>

            {/* Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                            Order Receipt
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                            Order #{order._id.slice(-8).toUpperCase()}
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
                    </div>

                    <span
                        className={`px-4 py-1.5 rounded-full text-xs font-black uppercase ${
                            order.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : order.status === "Cancelled"
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                    >
                        ● {order.status}
                    </span>
                </div>

                {/* Progress Tracker Timeline */}
                {order.status !== "Cancelled" && (
                    <div className="pt-6 border-t border-slate-100">
                        <div className="grid grid-cols-4 gap-2 text-center">
                            {steps.map((step, idx) => {
                                const isPassed = currentStepIndex >= idx;
                                return (
                                    <div key={step.status} className="space-y-2">
                                        <div
                                            className={`h-2 rounded-full transition-all ${
                                                isPassed ? "bg-indigo-600" : "bg-slate-200"
                                            }`}
                                        />
                                        <span className={`text-[10px] font-bold block ${isPassed ? "text-slate-900" : "text-slate-400"}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Items Summary */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                        <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                            Ordered Items ({order.items.length})
                        </h2>

                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item._id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                    <img
                                        src={item.product?.image || "https://via.placeholder.com/100"}
                                        alt={item.product?.name}
                                        className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm text-slate-900">{item.product?.name}</h3>
                                        <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-black text-sm text-slate-900">{formatPrice(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delivery Address */}
                    {order.address && (
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-2 text-xs">
                            <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 mb-3">
                                Shipping Destination
                            </h2>
                            <p className="font-bold text-slate-900 text-sm">{order.address.fullName}</p>
                            <p className="text-slate-600">{order.address.street}, {order.address.city}</p>
                            <p className="text-slate-600">{order.address.state} - {order.address.pincode}, {order.address.country}</p>
                            <p className="text-slate-600 font-medium pt-1">Phone: {order.address.phone}</p>
                        </div>
                    )}
                </div>

                {/* Financial Summary */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4 text-xs">
                        <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                            Payment Breakdown
                        </h2>

                        <div className="space-y-2">
                            <div className="flex justify-between text-slate-600">
                                <span>Payment Method</span>
                                <span className="font-bold text-slate-900">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Payment Status</span>
                                <span className={`font-bold ${order.paymentStatus === "Paid" ? "text-emerald-600" : "text-amber-600"}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Original Subtotal</span>
                                <span className="font-bold text-slate-900">{formatPrice(order.originalAmount || order.totalAmount)}</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between text-emerald-600 font-bold">
                                    <span>Discount Applied</span>
                                    <span>- {formatPrice(order.discountAmount)}</span>
                                </div>
                            )}
                            <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-black">
                                <span className="text-slate-900">Total Paid</span>
                                <span className="text-xl text-indigo-600">{formatPrice(order.totalAmount)}</span>
                            </div>

                            {order.paymentMethod === "Razorpay" && order.paymentStatus !== "Paid" && order.status !== "Cancelled" && (
                                <button
                                    onClick={handleRetryPayment}
                                    disabled={paying}
                                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <ShieldCheck size={16} />
                                    {paying ? "Processing Payment..." : "Pay Now with Razorpay"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetails;