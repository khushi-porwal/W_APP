import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Package, ArrowLeft } from "lucide-react";

import Navbar from "../../../components/common/Navbar";
import { getSingleOrder } from "../../../services/orderService";

function OrderDetails() {

    // ===========================
    // PARAMS
    // ===========================

    const { orderId } = useParams();

    // ===========================
    // STATE
    // ===========================

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // ===========================
    // FETCH ORDER
    // ===========================

    const fetchOrder = async () => {

        try {

            setLoading(true);

            const response =
                await getSingleOrder(orderId);

            console.log(
                "ORDER DETAILS RESPONSE:",
                response
            );

            setOrder(response.data);

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch order"
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchOrder();

    }, [orderId]);

    // ===========================
    // FORMAT PRICE
    // ===========================

    const formatPrice = (price) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(price || 0);

    };

    // ===========================
    // FORMAT DATE
    // ===========================

    const formatDate = (date) => {

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        ).format(new Date(date));

    };

    // ===========================
    // LOADING
    // ===========================

    if (loading) {

        return (

            <>
                <Navbar />

                <main className="min-h-screen bg-slate-50 flex justify-center items-center">

                    <h2 className="text-2xl font-bold">

                        Loading...

                    </h2>

                </main>

            </>

        );

    }

    // ===========================
    // NO ORDER
    // ===========================

    if (!order) {

        return (

            <>
                <Navbar />

                <main className="min-h-screen bg-slate-50 flex justify-center items-center">

                    <h2 className="text-2xl font-bold">

                        Order not found

                    </h2>

                </main>

            </>

        );

    }

    // ===========================
    // UI
    // ===========================

    return (

        <>
            <Navbar />

            <main className="min-h-screen bg-slate-50">

                <div className="max-w-7xl mx-auto px-5 py-10">

                    {/* Back */}

                    <Link
                        to="/orders"
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
                    >
                        <ArrowLeft size={18} />

                        Back to Orders
                    </Link>

                    {/* Heading */}

                    <div className="mt-6 flex flex-wrap items-center gap-3">

                        <Package size={24} />

                        <h1 className="text-3xl font-bold">

                            Order #{order._id.slice(-8)}

                        </h1>

                        <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${
                                order.status === "Delivered"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "Cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : order.status === "Processing"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                            {order.status}
                        </span>

                    </div>

                    <p className="mt-3 text-slate-500">

                        Ordered on {formatDate(order.createdAt)}

                    </p>

                    {/* Products */}

                    <div className="mt-10 bg-white rounded-3xl shadow p-6">

                        <h2 className="text-2xl font-bold">

                            Ordered Products

                        </h2>

                        <div className="mt-6 space-y-5">

                            {order.items.map((item) => (

                                <div
                                    key={item._id}
                                    className="flex gap-5 border rounded-2xl p-4"
                                >

                                    <img
                                        src={item.product?.image}
                                        alt={item.product?.name}
                                        className="w-24 h-24 rounded-xl object-cover border"
                                    />

                                    <div className="flex-1">

                                        <h3 className="text-xl font-semibold">

                                            {item.product?.name}

                                        </h3>

                                        <p className="mt-2 text-slate-500">

                                            Quantity : {item.quantity}

                                        </p>

                                        <p className="mt-2 font-bold">

                                            {formatPrice(item.price)}

                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                    {/* Address */}

                    <div className="mt-8 bg-white rounded-3xl shadow p-6">

                        <h2 className="text-2xl font-bold">

                            Delivery Address

                        </h2>

                        <div className="mt-5 space-y-2">

                            <p>{order.address.fullName}</p>

                            <p>{order.address.phone}</p>

                            <p>{order.address.street}</p>

                            <p>

                                {order.address.city},{" "}
                                {order.address.state}

                            </p>

                            <p>{order.address.country}</p>

                            <p>{order.address.pincode}</p>

                        </div>

                    </div>

                    {/* Payment */}

                    <div className="mt-8 bg-white rounded-3xl shadow p-6">

                        <h2 className="text-2xl font-bold">

                            Payment Details

                        </h2>

                        <div className="mt-5 space-y-3">

                            <p>

                                <strong>Method : </strong>

                                {order.paymentMethod}

                            </p>

                            <p>

                                <strong>Status : </strong>

                                {order.paymentStatus}

                            </p>

                        </div>

                    </div>

                    {/* Summary */}

                    <div className="mt-8 bg-white rounded-3xl shadow p-6">

                        <h2 className="text-2xl font-bold">

                            Order Summary

                        </h2>

                        <div className="mt-5 space-y-3">

                            <p>

                                Original Amount :

                                {" "}

                                {formatPrice(
                                    order.originalAmount
                                )}

                            </p>

                            <p>

                                Discount :

                                {" "}

                                {formatPrice(
                                    order.discountAmount
                                )}

                            </p>

                            <p className="text-xl font-bold">

                                Total :

                                {" "}

                                {formatPrice(
                                    order.totalAmount
                                )}

                            </p>

                        </div>

                    </div>

                </div>

            </main>

        </>

    );

}

export default OrderDetails;