import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import CouponTable from "../../../components/admin/CouponTable";
import CouponModal from "../../../components/admin/CouponModal";

import {
    getAllCoupons,
    deleteCoupon,
    toggleCouponStatus,
} from "../../../services/couponService";

function Coupons() {

    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const [open, setOpen] = useState(false);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    // =========================
    // Fetch Coupons
    // =========================

    const fetchCoupons = async () => {

        try {

            const response = await getAllCoupons(
                search,
                page,
                5
            );

            setCoupons(response.data.coupons);

            setTotalPages(response.data.totalPages || 1);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch coupons"
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchCoupons();

    }, [search, page]);

    // =========================
    // Delete Coupon
    // =========================

    const handleDelete = async (coupon) => {

        const confirmDelete = window.confirm(
            `Delete coupon "${coupon.code}"?`
        );

        if (!confirmDelete) return;

        try {

            const response = await deleteCoupon(coupon._id);

            toast.success(response.message);

            fetchCoupons();

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to delete coupon"
            );

        }

    };
    const handleToggleStatus = async (couponId) => {

    try {

        const response = await toggleCouponStatus(couponId);

        toast.success(response.message);

        fetchCoupons();

    } catch (error) {

        toast.error(
            error.response?.data?.message ||
            "Failed to update status"
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

                    Coupons

                </h1>

                <button
                    onClick={() => {

                        setSelectedCoupon(null);

                        setOpen(true);

                    }}
                    className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
                >

                    + Add Coupon

                </button>

            </div>

            {/* Search */}

            <div className="mb-6">

                <input
                    type="text"
                    placeholder="Search coupon..."
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

                coupons.length === 0 ? (

                    <div className="bg-white rounded-xl shadow p-10 text-center">

                        <h2 className="text-xl font-semibold">

                            No Coupons Found

                        </h2>

                        <p className="text-gray-500 mt-2">

                            Create your first coupon.

                        </p>

                    </div>

                ) : (

                    <>

                        <CouponTable
    coupons={coupons}
    onEdit={(coupon) => {
        setSelectedCoupon(coupon);
        setOpen(true);
    }}
    onDelete={handleDelete}
    onToggleStatus={handleToggleStatus}
/>

                        {/* Pagination */}

                        <div className="flex justify-center gap-4 mt-6">

                            <button
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                                className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
                            >

                                Previous

                            </button>

                            <span>

                                Page {page} of {totalPages}

                            </span>

                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}
                                className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
                            >

                                Next

                            </button>

                        </div>

                    </>

                )

            }

            {/* Modal */}

            <CouponModal
                open={open}
                setOpen={setOpen}
                fetchCoupons={fetchCoupons}
                selectedCoupon={selectedCoupon}
            />

        </div>

    );

}

export default Coupons;