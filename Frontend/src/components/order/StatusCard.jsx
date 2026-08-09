import {
    Truck,
    PackageCheck,
    Clock,
    CheckCircle,
    XCircle,
} from "lucide-react";

function StatusCard({

    order,

    status,

    setStatus,

    updating,

    handleUpdateStatus,

}) {

    // =========================
    // Status Badge
    // =========================

    const renderStatusBadge = () => {

        switch (order.status) {

            case "Pending":

                return (
                    <span className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full">
                        <Clock size={16}/>
                        Pending
                    </span>
                );

            case "Processing":

                return (
                    <span className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
                        <PackageCheck size={16}/>
                        Processing
                    </span>
                );

            case "Shipped":

                return (
                    <span className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full">
                        <Truck size={16}/>
                        Shipped
                    </span>
                );

            case "Delivered":

                return (
                    <span className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                        <CheckCircle size={16}/>
                        Delivered
                    </span>
                );

            default:

                return (
                    <span className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full">
                        <XCircle size={16}/>
                        Cancelled
                    </span>
                );

        }

    };

    return (

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            {/* Header */}

            <div className="flex items-center gap-3 mb-6">

                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">

                    <Truck
                        className="text-indigo-600"
                        size={24}
                    />

                </div>

                <div>

                    <h2 className="text-xl font-bold">

                        Order Status

                    </h2>

                    <p className="text-gray-500 text-sm">

                        Manage order workflow

                    </p>

                </div>

            </div>

            {/* Current Status */}

            <div className="mb-6">

                <p className="text-sm text-gray-500 mb-2">

                    Current Status

                </p>

                {renderStatusBadge()}

            </div>

            {/* Change Status */}

            <div className="space-y-4">

                <div>

                    <label className="block text-sm font-medium text-gray-700 mb-2">

                        Change Status

                    </label>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={
                            order.status === "Delivered" ||
                            order.status === "Cancelled"
                        }
                        className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Processing">
                            Processing
                        </option>

                        <option value="Shipped">
                            Shipped
                        </option>

                        <option value="Delivered">
                            Delivered
                        </option>

                        <option value="Cancelled">
                            Cancelled
                        </option>

                    </select>

                </div>

                <button
                    onClick={handleUpdateStatus}
                    disabled={
                        updating ||
                        status === order.status ||
                        order.status === "Delivered" ||
                        order.status === "Cancelled"
                    }
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >

                    {

                        updating

                            ? "Updating..."

                            : "Update Status"

                    }

                </button>

            </div>

        </div>

    );

}

export default StatusCard;