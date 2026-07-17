import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Package, ShoppingBag } from "lucide-react";
import { cancelOrder } from "../../../services/orderService";
import Navbar from "../../../components/common/Navbar";
import { getMyOrders } from "../../../services/orderService";

function MyOrders() {
  // ===========================
  // STATE
  // ===========================

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===========================
  // FETCH ORDERS
  // ===========================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await getMyOrders();

      console.log("MY ORDERS RESPONSE:", response);

      setOrders(response?.data?.orders || []);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?",
    );

    if (!confirmCancel) return;

    try {
      const response = await cancelOrder(orderId);

      toast.success(response.message);

      fetchOrders();
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ===========================
  // FORMAT PRICE
  // ===========================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  // ===========================
  // FORMAT DATE
  // ===========================

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  // ===========================
  // LOADING UI
  // ===========================

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-slate-50">
          <div className="max-w-7xl mx-auto px-5 py-10">
            <div className="h-10 w-60 bg-slate-200 rounded animate-pulse"></div>

            <div className="mt-10 space-y-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-3xl p-6 shadow animate-pulse"
                >
                  <div className="h-6 w-56 bg-slate-200 rounded"></div>

                  <div className="mt-6 h-5 w-40 bg-slate-200 rounded"></div>

                  <div className="mt-6 h-5 w-64 bg-slate-200 rounded"></div>

                  <div className="mt-6 h-10 w-40 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  // ===========================
  // EMPTY UI
  // ===========================

  if (orders.length === 0) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-lg">
            <ShoppingBag size={70} className="mx-auto text-slate-400" />

            <h2 className="text-3xl font-bold mt-6">No Orders Yet</h2>

            <p className="text-slate-500 mt-3 leading-7">
              Looks like you haven't placed any order yet.
            </p>

            <Link
              to="/products"
              className="inline-block mt-8 bg-slate-900 text-white px-8 py-4 rounded-xl font-semibold hover:bg-slate-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </main>
      </>
    );
  }

  // ===========================
  // MAIN UI
  // ===========================

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 py-10">
          <h1 className="text-4xl font-bold text-slate-900">My Orders</h1>

          <p className="mt-2 text-slate-500">View all your previous orders.</p>

          <div className="mt-10 space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl shadow p-6 border border-slate-200"
              >
                {/* NEXT PART */}

                <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                  {/* LEFT SIDE */}

                  <div className="flex-1">
                    {/* ORDER HEADER */}

                    <div className="flex flex-wrap items-center gap-3">
                      <Package size={20} className="text-slate-600" />

                      <h2 className="text-xl font-bold text-slate-900">
                        Order #{order._id.slice(-8)}
                      </h2>

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

                    {/* DATE */}

                    <p className="mt-4 text-slate-500">
                      Ordered on{" "}
                      <span className="font-medium text-slate-800">
                        {formatDate(order.createdAt)}
                      </span>
                    </p>

                    {/* TOTAL */}

                    <p className="mt-2">
                      <span className="text-slate-500">Total :</span>{" "}
                      <span className="font-bold text-lg">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </p>

                    {/* PAYMENT */}

                    <p className="mt-2">
                      <span className="text-slate-500">Payment :</span>{" "}
                      <span
                        className={`font-semibold
                ${
                  order.paymentStatus === "Paid"
                    ? "text-green-600"
                    : "text-orange-500"
                }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </p>

                    {/* ITEMS */}

                    <p className="mt-2 text-slate-500">
                      Items :{" "}
                      <span className="font-semibold text-slate-900">
                        {order.items.length}
                      </span>
                    </p>

                    {/* ORDERED PRODUCTS */}

                    <div className="mt-6 border-t border-slate-200 pt-5">
                      <h3 className="text-lg font-semibold mb-4">
                        Ordered Products
                      </h3>

                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex gap-4 items-center border rounded-xl p-3 hover:shadow-md transition"
                          >
                            {/* PRODUCT IMAGE */}

                            <img
                              src={item.product?.image}
                              alt={item.product?.name}
                              className="w-20 h-20 rounded-xl object-cover border"
                            />

                            {/* PRODUCT DETAILS */}

                            <div className="flex-1">
                              <h4 className="font-semibold text-lg">
                                {item.product?.name}
                              </h4>

                              <p className="text-slate-500">
                                Quantity : {item.quantity}
                              </p>

                              <p className="font-semibold text-slate-800">
                                {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT SIDE */}

                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-3">

    <Link
        to={`/order/${order._id}`}
        className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-center hover:bg-slate-800 transition"
    >
        View Details
    </Link>

</div>

                    {order.status === "Pending" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="px-6 py-3 rounded-xl border border-red-500 text-red-600 font-semibold hover:bg-red-50 transition"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

export default MyOrders;
