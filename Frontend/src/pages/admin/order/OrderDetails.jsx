import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  getAdminSingleOrder,
  updateOrderStatus,
} from "../../../services/orderService";

import { User, Package, MapPinned, CreditCard, Truck } from "lucide-react";

function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  // Fetch Order
const fetchOrder = async (showLoader = true) => {
  if (showLoader) {
    setLoading(true);
  }

  try {
    const response = await getAdminSingleOrder(orderId);

    setOrder(response.data);
    setStatus(response.data.status);

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to fetch order"
    );
  } finally {
    if (showLoader) {
      setLoading(false);
    }
  }
};
  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // Update Status
  // Update Status
const handleUpdateStatus = async () => {
  try {
    setUpdating(true);

    const response = await updateOrderStatus(order._id, status);

    toast.success(response.message);

    await fetchOrder(false);

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to update status"
    );
  } finally {
    setUpdating(false);
  }
};

  if (loading) {
    
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h2 className="text-xl font-semibold">Loading Order...</h2>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h2 className="text-xl text-red-500">Order not found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>

      {/* Customer Information */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <User size={22} className="text-indigo-600" />
          <h2 className="text-xl font-semibold">Customer Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Customer Name</p>

            <p className="text-lg font-semibold mt-1">{order.user?.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email Address</p>

            <p className="text-lg font-semibold mt-1">{order.user?.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Order ID</p>

            <p className="text-base font-medium mt-1 break-all">{order._id}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Order Date</p>

            <p className="text-base font-medium mt-1">
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Ordered Products */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <Package size={22} className="text-indigo-600" />
          <h2 className="text-xl font-semibold">Ordered Products</h2>
        </div>

        <div className="space-y-5">
          {order.items?.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 hover:shadow-lg transition-all duration-300"
            >
              {/* Product */}

              <div className="flex items-center gap-5">
                <img
                  src={item.product?.image}
                  alt={item.product?.name}
                  className="w-24 h-24 rounded-xl object-cover border"
                />

                <div>
                  <h3 className="text-lg font-semibold">
                    {item.product?.name}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    {item.product?.category}
                  </p>

                  <div className="flex gap-6 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>

                      <p className="font-semibold">{item.quantity}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">Unit Price</p>

                      <p className="font-semibold">₹{item.price}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total */}

              <div className="text-right">
                <p className="text-sm text-gray-500">Total</p>

                <h2 className="text-2xl font-bold text-indigo-600">
                  ₹{item.quantity * item.price}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <MapPinned size={22} className="text-indigo-600" />
          <h2 className="text-xl font-semibold">Shipping Address</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>

            <p className="text-lg font-semibold mt-1">
              {order.address?.fullName}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Phone Number</p>

            <p className="text-lg font-semibold mt-1">{order.address?.phone}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm text-gray-500">Street Address</p>

            <p className="text-lg font-semibold mt-1">
              {order.address?.street}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">City</p>

            <p className="text-lg font-semibold mt-1">{order.address?.city}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">State</p>

            <p className="text-lg font-semibold mt-1">{order.address?.state}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Country</p>

            <p className="text-lg font-semibold mt-1">
              {order.address?.country}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Pincode</p>

            <p className="text-lg font-semibold mt-1">
              {order.address?.pincode}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <CreditCard size={22} className="text-indigo-600" />
          <h2 className="text-xl font-semibold">Payment Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500">Payment Method</p>

            <p className="text-lg font-semibold mt-1">{order.paymentMethod}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Payment Status</p>

            <span
              className={`inline-flex mt-2 px-3 py-1 rounded-full text-sm font-medium
                ${
                  order.paymentStatus === "Paid"
                    ? "bg-green-100 text-green-700"
                    : order.paymentStatus === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.paymentStatus === "Failed"
                        ? "bg-red-100 text-red-700"
                        : order.paymentStatus === "REFUND_PENDING"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-blue-100 text-blue-700"
                }`}
            >
              {order.paymentStatus}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Payment ID</p>

            <p className="text-base font-medium mt-1 break-all">
              {order.paymentId || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Razorpay Order ID</p>

            <p className="text-base font-medium mt-1 break-all">
              {order.razorpayOrderId || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Original Amount</p>

            <p className="text-lg font-semibold mt-1">
              ₹{order.originalAmount}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Discount</p>

            <p className="text-lg font-semibold mt-1 text-green-600">
              - ₹{order.discountAmount}
            </p>
          </div>

          <div className="md:col-span-2 border-t pt-4">
            <p className="text-sm text-gray-500">Total Paid</p>

            <h2 className="text-2xl font-bold text-indigo-600 mt-1">
              ₹{order.totalAmount}
            </h2>
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-5">
          <Truck size={22} className="text-indigo-600" />
          <h2 className="text-xl font-semibold">Order Status</h2>
        </div>

        <div className="space-y-6">
          {/* Current Status */}

          <div>
            <p className="text-sm text-gray-500 mb-2">Current Status</p>

            <span
              className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold
            ${
              order.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : order.status === "Processing"
                  ? "bg-blue-100 text-blue-700"
                  : order.status === "Shipped"
                    ? "bg-purple-100 text-purple-700"
                    : order.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
            }`}
            >
              {order.status}
            </span>
          </div>

          {/* Change Status */}

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
    <option value="Pending">Pending</option>
    <option value="Processing">Processing</option>
    <option value="Shipped">Shipped</option>
    <option value="Delivered">Delivered</option>
    <option value="Cancelled">Cancelled</option>
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
    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
>
    {updating ? "Updating..." : "Update Status"}
</button>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
