import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  getAdminSingleOrder,
  updateOrderStatus,
} from "../../../services/orderService";

import OrderHeader from "../../../components/order/OrderHeader";
import InvoiceButton from "../../../components/order/InvoiceButton";
import OrderStats from "../../../components/order/OrderStats";
import CustomerCard from "../../../components/order/CustomerCard";
import ProductCard from "../../../components/order/ProductCard";
import ShippingCard from "../../../components/order/ShippingCard";
import PaymentCard from "../../../components/order/PaymentCard";
import CouponCard from "../../../components/order/CouponCard";
import StatusCard from "../../../components/order/StatusCard";
import OrderTimeline from "../../../components/order/OrderTimeline";

function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  // =========================
  // Fetch Order
  // =========================

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

  // =========================
  // Update Order Status
  // =========================

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);

      const response = await updateOrderStatus(
        order._id,
        status
      );

      toast.success(response.message);

      await fetchOrder(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update status"
      );
    } finally {
      setUpdating(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h2 className="text-xl font-semibold">
          Loading Order...
        </h2>
      </div>
    );
  }

  // =========================
  // Order Not Found
  // =========================

  if (!order) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <h2 className="text-2xl font-bold">
          Order Not Found
        </h2>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="max-w-7xl mx-auto p-6">

      <OrderHeader order={order} />

      <InvoiceButton order={order} />

      <OrderStats order={order} />

      <CustomerCard order={order} />

      <ProductCard order={order} />

      <ShippingCard order={order} />

      <PaymentCard order={order} />

      <CouponCard order={order} />

      <StatusCard
        order={order}
        status={status}
        setStatus={setStatus}
        updating={updating}
        handleUpdateStatus={handleUpdateStatus}
      />

      <OrderTimeline order={order} />

    </div>
  );
}

export default OrderDetails;