import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    ArrowLeft,
    Copy,
    Download,
    CheckCircle,
    Clock,
    XCircle,
    Truck,
} from "lucide-react";

function OrderHeader({ order }) {

    // =========================
    // Copy Order ID
    // =========================

    const handleCopy = () => {

        navigator.clipboard.writeText(order._id);

        toast.success("Order ID copied!");

    };

    // =========================
    // Payment Badge
    // =========================

    const renderPaymentBadge = () => {

        switch (order.paymentStatus) {

            case "Paid":

                return (
                    <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                        <CheckCircle size={16} />
                        Paid
                    </span>
                );

            case "Pending":

                return (
                    <span className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">
                        <Clock size={16} />
                        Pending
                    </span>
                );

            default:

                return (
                    <span className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                        <XCircle size={16} />
                        Failed
                    </span>
                );

        }

    };

    // =========================
    // Order Status Badge
    // =========================

    const renderOrderBadge = () => {

        switch (order.status) {

            case "Pending":

                return (
                    <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium">
                        Pending
                    </span>
                );

            case "Processing":

                return (
                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                        Processing
                    </span>
                );

            case "Shipped":

                return (
                    <span className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                        <Truck size={16} />
                        Shipped
                    </span>
                );

            case "Delivered":

                return (
                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                        Delivered
                    </span>
                );

            default:

                return (
                    <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium">
                        Cancelled
                    </span>
                );

        }

    };

    return (

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            {/* Top Section */}

            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">

                {/* Left */}

                <div>

                    <Link
                        to="/admin/orders"
                        className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium mb-4"
                    >
                        <ArrowLeft size={18} />
                        Back to Orders
                    </Link>

                    <h1 className="text-3xl font-bold">

                        Order #{order._id.slice(-8)}

                    </h1>

                    <p className="text-gray-500 mt-2">

                        Placed on{" "}

                        {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                            }
                        )}

                    </p>

                </div>

                {/* Right */}

                <div className="flex flex-wrap gap-3">

                    {renderPaymentBadge()}

                    {renderOrderBadge()}

                </div>

            </div>

            {/* Bottom */}

            <div className="flex flex-col lg:flex-row justify-between lg:items-center mt-6 border-t pt-6 gap-4">

                <div className="flex items-center flex-wrap gap-3">

                    <span className="font-semibold">

                        Order ID:

                    </span>

                    <span className="text-gray-600 break-all">

                        {order._id}

                    </span>

                    <button
                        onClick={handleCopy}
                        className="text-indigo-600 hover:text-indigo-700"
                    >
                        <Copy size={18} />
                    </button>

                </div>

                <button
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
                >
                    <Download size={18} />
                    Download Invoice
                </button>

            </div>

        </div>

    );

}

export default OrderHeader;