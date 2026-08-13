import {
    ArrowRight,
    Check,
    CheckCircle2,
    Home,
    Package,
    ShoppingBag,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import Navbar from "../../../components/common/Navbar";

import {
    getSingleOrder,
} from "../../../services/orderService";


function OrderSuccess() {
    const { orderId } = useParams();


    // ==========================================
    // STATE
    // ==========================================

    const [order, setOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(true);


    // ==========================================
    // FETCH ORDER
    // ==========================================

    const fetchOrder = async () => {
        try {
            setLoading(true);


            // ==================================
            // DEBUG ORDER ID
            // ==================================

            console.log(
                "ORDER ID FROM URL:",
                orderId
            );


            // ==================================
            // VALIDATE ORDER ID
            // ==================================

            if (
                !orderId ||
                orderId === "undefined"
            ) {
                throw new Error(
                    "Invalid Order ID"
                );
            }


            // ==================================
            // FETCH ORDER API
            // ==================================

            const response =
                await getSingleOrder(orderId);


            console.log(
                "ORDER RESPONSE:",
                response
            );


            // ==================================
            // GET ORDER DATA
            // ==================================

            const orderData =
                response?.data?.order ||
                response?.data ||
                null;


            console.log(
                "FINAL ORDER DATA:",
                orderData
            );


            setOrder(orderData);

        } catch (error) {
            console.error(
                "FETCH ORDER ERROR:",
                error
            );

            console.log(
                "FETCH ORDER ERROR RESPONSE:",
                error.response?.data
            );

            toast.error(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch order"
            );

        } finally {
            setLoading(false);
        }
    };


    // ==========================================
    // FETCH ON PAGE LOAD
    // ==========================================

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);


    // ==========================================
    // FORMAT PRICE
    // ==========================================

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


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        ).format(
            new Date(date)
        );
    };


    // ==========================================
    // LOADING UI
    // ==========================================

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="min-h-screen bg-slate-50 px-5 py-12">

                    <div className="mx-auto max-w-3xl">

                        <div className="animate-pulse rounded-3xl bg-white p-8 shadow-sm">

                            <div className="mx-auto h-20 w-20 rounded-full bg-slate-100" />

                            <div className="mx-auto mt-6 h-8 w-64 rounded-lg bg-slate-100" />

                            <div className="mx-auto mt-3 h-5 w-80 rounded-lg bg-slate-100" />

                            <div className="mt-10 h-64 rounded-2xl bg-slate-100" />

                        </div>

                    </div>

                </main>
            </>
        );
    }


    // ==========================================
    // ORDER NOT FOUND
    // ==========================================

    if (!order) {
        return (
            <>
                <Navbar />

                <main className="flex min-h-[80vh] items-center justify-center bg-slate-50 px-5">

                    <div className="text-center">

                        <Package
                            size={50}
                            className="mx-auto text-slate-400"
                        />


                        <h1 className="mt-5 text-2xl font-bold text-slate-950">
                            Order not found
                        </h1>


                        <p className="mt-2 text-slate-500">
                            We couldn't find this order.
                        </p>


                        <Link
                            to="/"
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                        >
                            <Home size={18} />

                            Go home
                        </Link>

                    </div>

                </main>
            </>
        );
    }


    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-slate-50 px-5 py-12 sm:px-8">

                <div className="mx-auto max-w-3xl">

                    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">


                        {/* ========================= */}
                        {/* SUCCESS HEADER */}
                        {/* ========================= */}

                        <div className="px-6 py-10 text-center sm:px-10">

                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">

                                <CheckCircle2
                                    size={42}
                                    className="text-emerald-600"
                                />

                            </div>


                            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                                Order confirmed
                            </p>


                            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                Thank you for your order!
                            </h1>


                            <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-500">
                                Your order has been placed
                                successfully. We'll keep you
                                updated about your delivery.
                            </p>

                        </div>


                        {/* ========================= */}
                        {/* ORDER DETAILS */}
                        {/* ========================= */}

                        <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-8 sm:px-10">

                            <div className="grid gap-5 sm:grid-cols-2">

                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Order ID
                                    </p>

                                    <p className="mt-2 break-all text-sm font-semibold text-slate-950">
                                        {order._id}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Order date
                                    </p>

                                    <p className="mt-2 text-sm font-semibold text-slate-950">
                                        {formatDate(
                                            order.createdAt
                                        )}
                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Payment method
                                    </p>

                                    <p className="mt-2 text-sm font-semibold text-slate-950">

                                        {order.paymentMethod ===
                                        "CashOnDelivery"
                                            ? "Cash on Delivery"
                                            : "Razorpay"}

                                    </p>

                                </div>


                                <div>

                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                        Order status
                                    </p>


                                    <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">

                                        <Check size={13} />

                                        {order.status}

                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* ========================= */}
                        {/* ORDER ITEMS */}
                        {/* ========================= */}

                        <div className="px-6 py-8 sm:px-10">

                            <div className="flex items-center gap-3">

                                <ShoppingBag
                                    size={21}
                                    className="text-slate-500"
                                />

                                <h2 className="text-xl font-bold text-slate-950">
                                    Order items
                                </h2>

                            </div>


                            <div className="mt-6 divide-y divide-slate-100">

                                {order.items?.map(
                                    (item) => (

                                        <div
                                            key={
                                                item._id
                                            }
                                            className="flex items-center justify-between gap-5 py-5"
                                        >

                                            <div>

                                                <p className="font-semibold text-slate-950">

                                                    {item
                                                        .product
                                                        ?.name ||
                                                        "Product"}

                                                </p>


                                                <p className="mt-1 text-sm text-slate-500">
                                                    Quantity:{" "}
                                                    {
                                                        item.quantity
                                                    }
                                                </p>

                                            </div>


                                            <p className="font-bold text-slate-950">

                                                {formatPrice(
                                                    item.price *
                                                    item.quantity
                                                )}

                                            </p>

                                        </div>
                                    )
                                )}

                            </div>


                            {/* ===================== */}
                            {/* PRICE DETAILS */}
                            {/* ===================== */}

                            <div className="mt-5 border-t border-slate-200 pt-6">

                                <div className="flex justify-between text-sm">

                                    <span className="text-slate-500">
                                        Original amount
                                    </span>

                                    <span className="font-semibold text-slate-950">
                                        {formatPrice(
                                            order.originalAmount
                                        )}
                                    </span>

                                </div>


                                {order.discountAmount > 0 && (

                                    <div className="mt-4 flex justify-between text-sm">

                                        <span className="text-slate-500">
                                            Coupon discount
                                        </span>

                                        <span className="font-semibold text-emerald-600">
                                            -
                                            {formatPrice(
                                                order.discountAmount
                                            )}
                                        </span>

                                    </div>
                                )}


                                <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-5">

                                    <span className="text-base font-bold text-slate-950">
                                        Total amount
                                    </span>

                                    <span className="text-2xl font-bold text-slate-950">
                                        {formatPrice(
                                            order.totalAmount
                                        )}
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* ========================= */}
                        {/* ACTION BUTTONS */}
                        {/* ========================= */}

                        <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-6 sm:flex-row sm:px-10">

                            <Link
                                to="/my-orders"
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                View my orders

                                <ArrowRight size={17} />
                            </Link>


                            <Link
                                to="/"
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                <ShoppingBag size={17} />

                                Continue shopping
                            </Link>

                        </div>

                    </section>

                </div>

            </main>
        </>
    );
}


export default OrderSuccess;