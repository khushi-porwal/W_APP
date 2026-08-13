import {
    CreditCard,
    Wallet,
    Copy,
    IndianRupee,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react";

import { toast } from "react-hot-toast";

function PaymentCard({ order }) {

    // =========================
    // Copy Text
    // =========================

    const handleCopy = (text, label) => {

        if (!text) return;

        navigator.clipboard.writeText(text);

        toast.success(`${label} copied`);

    };

    // =========================
    // Payment Badge
    // =========================

    const paymentBadge = () => {

        switch (order.paymentStatus) {

            case "Paid":

                return (

                    <span className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-2 rounded-full">

                        <CheckCircle size={16} />

                        Paid

                    </span>

                );

            case "Pending":

                return (

                    <span className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-2 rounded-full">

                        <Clock size={16} />

                        Pending

                    </span>

                );

            default:

                return (

                    <span className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-2 rounded-full">

                        <XCircle size={16} />

                        Failed

                    </span>

                );

        }

    };

    return (

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            {/* Header */}

            <div className="flex items-center gap-3 mb-6">

                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">

                    <CreditCard
                        className="text-indigo-600"
                        size={24}
                    />

                </div>

                <div>

                    <h2 className="text-xl font-bold">

                        Payment Details

                    </h2>

                    <p className="text-gray-500 text-sm">

                        Payment Summary

                    </p>

                </div>

            </div>

            {/* Payment Information */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>

                    <p className="text-sm text-gray-500">

                        Payment Method

                    </p>

                    <h3 className="font-semibold text-lg">

                        {order.paymentMethod || "N/A"}

                    </h3>

                </div>

                <div>

                    <p className="text-sm text-gray-500 mb-2">

                        Payment Status

                    </p>

                    {paymentBadge()}

                </div>

                <div>

                    <p className="text-sm text-gray-500">

                        Payment ID

                    </p>

                    <div className="flex items-center gap-2">

                        <p className="font-medium break-all">

                            {order.paymentId || "N/A"}

                        </p>

                        {

                            order.paymentId && (

                                <button
                                    onClick={() =>
                                        handleCopy(
                                            order.paymentId,
                                            "Payment ID"
                                        )
                                    }
                                >

                                    <Copy size={16} />

                                </button>

                            )

                        }

                    </div>

                </div>

                <div>

                    <p className="text-sm text-gray-500">

                        Razorpay Order ID

                    </p>

                    <div className="flex items-center gap-2">

                        <p className="font-medium break-all">

                            {order.razorpayOrderId || "N/A"}

                        </p>

                        {

                            order.razorpayOrderId && (

                                <button
                                    onClick={() =>
                                        handleCopy(
                                            order.razorpayOrderId,
                                            "Razorpay Order ID"
                                        )
                                    }
                                >

                                    <Copy size={16} />

                                </button>

                            )

                        }

                    </div>

                </div>

            </div>

            {/* Divider */}

            <hr className="my-6"/>

            {/* Summary */}

            <div className="space-y-4">

                <div className="flex justify-between">

                    <span>Original Amount</span>

                    <span>

                        ₹{order.originalAmount || 0}

                    </span>

                </div>

                <div className="flex justify-between text-green-600">

                    <span>Discount</span>

                    <span>

                        - ₹{order.discountAmount || 0}

                    </span>

                </div>

                <div className="flex justify-between font-bold text-xl border-t pt-4">

                    <span>Total Paid</span>

                    <span className="text-indigo-600">

                        ₹{order.totalAmount || 0}

                    </span>

                </div>

            </div>

        </div>

    );

}

export default PaymentCard;