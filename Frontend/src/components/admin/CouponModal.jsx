import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
    createCoupon,
    updateCoupon,
} from "../../services/couponService";

function CouponModal({
    open,
    setOpen,
    fetchCoupons,
    selectedCoupon,
}) {

    const initialState = {
        code: "",
        discountPercentage: "",
        minimumAmount: "",
        maxDiscount: "",
        usageLimit: "",
        expiryDate: "",
        isActive: true,
    };

    const [formData, setFormData] = useState(initialState);

    const [loading, setLoading] = useState(false);

    // =========================
    // Load Selected Coupon
    // =========================

    useEffect(() => {

        if (selectedCoupon) {

            setFormData({

                code: selectedCoupon.code,

                discountPercentage: selectedCoupon.discountPercentage,

                minimumAmount: selectedCoupon.minimumAmount,

                maxDiscount: selectedCoupon.maxDiscount,

                usageLimit: selectedCoupon.usageLimit,

                expiryDate: selectedCoupon.expiryDate.slice(0, 10),

                isActive: selectedCoupon.isActive,

            });

        } else {

            setFormData(initialState);

        }

    }, [selectedCoupon]);

    // =========================
    // Handle Input Change
    // =========================

    const handleChange = (e) => {

        const { name, value, checked, type } = e.target;

        setFormData((prev) => ({

            ...prev,

            [name]: type === "checkbox" ? checked : value,

        }));

    };

    // =========================
    // Submit
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            let response;

            if (selectedCoupon) {

                response = await updateCoupon(
                    selectedCoupon._id,
                    formData
                );

            } else {

                response = await createCoupon(
                    formData
                );

            }

            toast.success(response.message);

            fetchCoupons();

            setOpen(false);

            setFormData(initialState);

        } catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Something went wrong"

            );

        } finally {

            setLoading(false);

        }

    };

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white w-[500px] rounded-xl shadow-xl p-6">

                <h2 className="text-2xl font-bold mb-6">

                    {selectedCoupon ? "Edit Coupon" : "Add Coupon"}

                </h2>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        name="code"
                        placeholder="Coupon Code"
                        value={formData.code}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                    />

                    <input
                        type="number"
                        name="discountPercentage"
                        placeholder="Discount Percentage"
                        value={formData.discountPercentage}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                    />

                    <input
                        type="number"
                        name="minimumAmount"
                        placeholder="Minimum Amount"
                        value={formData.minimumAmount}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                    />

                    <input
                        type="number"
                        name="maxDiscount"
                        placeholder="Maximum Discount"
                        value={formData.maxDiscount}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                    />

                    <input
                        type="number"
                        name="usageLimit"
                        placeholder="Usage Limit"
                        value={formData.usageLimit}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                    />

                    <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                        className="w-full border rounded-lg p-3"
                    />

                    <label className="flex items-center gap-2">

                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />

                        Active

                    </label>

                    <div className="flex justify-end gap-3 pt-2">

                        <button
                            type="button"
                            onClick={() => {

                                setOpen(false);

                                setFormData(initialState);

                            }}
                            className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                        >

                            Cancel

                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                        >

                            {loading
                                ? selectedCoupon
                                    ? "Updating..."
                                    : "Creating..."
                                : selectedCoupon
                                ? "Update Coupon"
                                : "Create Coupon"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default CouponModal;