import { Link } from "react-router-dom";

function OrderTable({

    orders,

    onStatusUpdate,

    onCancel,

}) {

    return (

        <div className="bg-white rounded-xl shadow overflow-hidden">

            <table className="w-full">

                <thead className="bg-gray-100">

                    <tr>

                        <th className="p-4">Order ID</th>

                        <th>Customer</th>

                        <th>Total</th>

                        <th>Payment</th>

                        <th>Status</th>

                        <th>Date</th>

                        <th>Actions</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        orders.map((order) => (

                            <tr
                                key={order._id}
                                className="border-b text-center hover:bg-gray-50"
                            >

                                {/* Order ID */}

                                <td className="p-4 font-semibold">

                                    #{order._id.slice(-6)}

                                </td>

                                {/* Customer */}

                                <td>

                                    {order.user?.name || "N/A"}

                                </td>

                                {/* Total */}

                                <td>

                                    ₹{order.totalAmount}

                                </td>

                                {/* Payment */}

                                <td>

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium
                                        ${
                                            order.paymentStatus === "Paid"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >

                                        {order.paymentStatus}

                                    </span>

                                </td>

                                {/* Order Status */}

                                <td>

                                    <select
                                        value={order.orderStatus}
                                        onChange={(e) =>
                                            onStatusUpdate(
                                                order._id,
                                                e.target.value
                                            )
                                        }
                                        className="border rounded-lg px-2 py-1"
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

                                </td>

                                {/* Date */}

                                <td>

                                    {

                                        new Date(
                                            order.createdAt
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )

                                    }

                                </td>

                                {/* Actions */}

                                <td>

                                    <div className="flex justify-center gap-2">

                                        <Link
                                            to={`/admin/orders/${order._id}`}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                        >

                                            View

                                        </Link>

                                        {

                                            order.orderStatus !== "Cancelled" && (

                                                <button
                                                    onClick={() =>
                                                        onCancel(order._id)
                                                    }
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                                >

                                                    Cancel

                                                </button>

                                            )

                                        }

                                    </div>

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

        </div>

    );

}

export default OrderTable;