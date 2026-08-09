import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import OrderTable from "../../../components/order/OrderTable";

import {
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
} from "../../../services/orderService";

function Orders() {

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    // =========================
    // Fetch Orders
    // =========================

    const fetchOrders = async () => {

        try {

            const response = await getAllOrders(
                search,
                "",
                page,
                10
            );

            setOrders(response.data.orders);

            setTotalPages(response.data.totalPages || 1);

        } catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to fetch orders"

            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchOrders();

    }, [search, page]);

    // =========================
    // Update Status
    // =========================

    const handleStatusUpdate = async (

        orderId,

        status

    ) => {

        try {

            const response = await updateOrderStatus(

                orderId,

                status

            );

            toast.success(response.message);

            fetchOrders();

        } catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to update order"

            );

        }

    };

    // =========================
    // Cancel Order
    // =========================

    const handleCancel = async (orderId) => {

        const confirmCancel = window.confirm(

            "Are you sure you want to cancel this order?"

        );

        if (!confirmCancel) return;

        try {

            const response = await cancelOrder(orderId);

            toast.success(response.message);

            fetchOrders();

        } catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Failed to cancel order"

            );

        }

    };

    if (loading) {

        return (

            <div className="flex justify-center items-center h-screen">

                Loading...

            </div>

        );

    }

    return (

        <div className="p-6">

            {/* Header */}

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">

                    Orders

                </h1>

            </div>

            {/* Search */}

            <div className="mb-6">

                <input
                    type="text"
                    placeholder="Search Order..."
                    value={search}
                    onChange={(e) => {

                        setSearch(e.target.value);

                        setPage(1);

                    }}
                    className="w-80 border rounded-lg px-4 py-2"
                />

            </div>

            {/* Table */}

            {

                orders.length === 0 ? (

                    <p>No Orders Found</p>

                ) : (

                    <OrderTable

                        orders={orders}

                        onStatusUpdate={handleStatusUpdate}

                        onCancel={handleCancel}

                    />

                )

            }

            {/* Pagination */}

            <div className="flex justify-center items-center gap-4 mt-6">

                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-4 py-2 rounded-lg bg-gray-200"
                >

                    Previous

                </button>

                <span>

                    Page {page} of {totalPages}

                </span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-4 py-2 rounded-lg bg-gray-200"
                >

                    Next

                </button>

            </div>

        </div>

    );

}

export default Orders;