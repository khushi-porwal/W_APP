import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";
import { toast } from "react-hot-toast";

import { getRecentOrders } from "../../services/adminService";

function RecentOrdersTable() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecentOrders = async () => {

        try {

            const response = await getRecentOrders();

            console.log(response);

            setOrders(response.data.orders);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch recent orders."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchRecentOrders();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow p-6 mt-8">
                Loading Recent Orders...
            </div>
        );
    }

    return (

        <div className="bg-white rounded-xl shadow mt-8">

            <div className="p-6 border-b">

                <h2 className="text-xl font-bold">
                    Recent Orders
                </h2>

            </div>

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-gray-50">

                        <tr>

                            <th className="text-left p-4">
                                Customer
                            </th>

                            <th className="text-left p-4">
                                Amount
                            </th>

                            <th className="text-left p-4">
                                Payment
                            </th>

                            <th className="text-left p-4">
                                Status
                            </th>

                            <th className="text-left p-4">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {orders.map((order) => (

                            <tr
                                key={order._id}
                                className="border-b hover:bg-gray-50"
                            >

                                <td className="p-4">

                                    <h3 className="font-semibold">
                                        {order.user?.name}
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        {order.user?.email}
                                    </p>

                                </td>

                                <td className="p-4">
                                    ₹{order.totalAmount}
                                </td>

                                <td className="p-4">
                                    {order.paymentStatus}
                                </td>

                                <td className="p-4">
                                    {order.status}
                                </td>

                                <td className="p-4">

                                    <Link
                                        to={`/admin/orders/${order._id}`}
                                        className="text-indigo-600 hover:text-indigo-800"
                                    >
                                        <Eye size={20} />
                                    </Link>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default RecentOrdersTable;