import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../../../services/orderService";

function AllOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getAllOrders();

      setOrders(response.data.orders);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Orders</h1>

      {orders.length === 0 ? (
        <h2>No Orders Found</h2>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3">Order ID</th>

              <th className="border p-3">Customer</th>

              <th className="border p-3">Total</th>

              <th className="border p-3">Payment</th>

              <th className="border p-3">Status</th>

              <th className="border p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="border p-3">{order._id.slice(-8)}</td>

                <td className="border p-3">
                  <div>
                    <p className="font-medium">{order.user?.name}</p>

                    <p className="text-sm text-gray-500">{order.user?.email}</p>
                  </div>
                </td>

                <td className="border p-3">₹{order.totalAmount}</td>

                <td className="border p-3">{order.paymentMethod}</td>

                <td className="border p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                        ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "Processing"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                        }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td className="border p-3">
                  <button
                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AllOrders;
