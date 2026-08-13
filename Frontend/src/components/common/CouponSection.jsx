import React, { useEffect, useState } from "react";
import { Tag, Check, X, Sparkles, ChevronDown, ChevronUp, AlertCircle, Percent } from "lucide-react";
import toast from "react-hot-toast";
import { applyCoupon, getActiveCoupons } from "../../services/couponService";

const CouponSection = ({ subtotal = 0, appliedCoupon = null, onApply, onRemove }) => {
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [inputCode, setInputCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [fetchingCoupons, setFetchingCoupons] = useState(true);
    const [showOffers, setShowOffers] = useState(true);

    // Fetch active coupons for discovery drawer
    useEffect(() => {
        let isMounted = true;
        const fetchCoupons = async () => {
            try {
                setFetchingCoupons(true);
                const res = await getActiveCoupons();
                if (res?.success && isMounted) {
                    setAvailableCoupons(res.data || []);
                }
            } catch (err) {
                // Silent fail if unauthenticated or error
                console.error("Failed to load active coupons:", err);
            } finally {
                if (isMounted) setFetchingCoupons(false);
            }
        };

        fetchCoupons();
        return () => {
            isMounted = false;
        };
    }, []);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleApplyCode = async (codeToApply) => {
        const code = codeToApply?.trim()?.toUpperCase();
        if (!code) {
            toast.error("Please enter a coupon code");
            return;
        }

        try {
            setLoading(true);
            const res = await applyCoupon({ code, amount: subtotal });
            if (res?.success && res?.data) {
                toast.success(res.message || `Coupon ${code} applied!`);
                onApply(res.data);
                setInputCode("");
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Invalid or expired coupon code";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-indigo-600" /> Apply Discount Coupon
                </label>
                {availableCoupons.length > 0 && !appliedCoupon && (
                    <button
                        type="button"
                        onClick={() => setShowOffers(!showOffers)}
                        className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        {availableCoupons.length} Available {showOffers ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                )}
            </div>

            {/* Applied Coupon State Badge */}
            {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50/80 border border-emerald-200/80 p-3.5 rounded-xl shadow-xs animate-fadeIn">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black">
                            <Check className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5">
                                Code <span className="font-mono bg-emerald-100 px-1.5 py-0.5 rounded text-emerald-800 uppercase">{appliedCoupon.couponCode}</span> Applied
                            </p>
                            <p className="text-[11px] font-bold text-emerald-700 mt-0.5">
                                You save {formatPrice(appliedCoupon.discountAmount)} on this order
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onRemove}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                        title="Remove Coupon"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <>
                    {/* Manual Coupon Code Form */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleApplyCode(inputCode);
                        }}
                        className="flex gap-2"
                    >
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="ENTER COUPON CODE"
                                value={inputCode}
                                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                                className="w-full uppercase text-xs font-bold pl-3 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !inputCode.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-2.5 rounded-xl transition shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {loading ? "Checking..." : "Apply"}
                        </button>
                    </form>

                    {/* Available Offers Drawer (Discovery UX) */}
                    {showOffers && (
                        <div className="space-y-2 pt-1 border-t border-slate-100">
                            {fetchingCoupons ? (
                                <div className="p-3 text-center text-xs text-slate-400 animate-pulse">
                                    Checking available offers...
                                </div>
                            ) : availableCoupons.length === 0 ? (
                                <p className="text-[11px] text-slate-400 text-center py-1">
                                    No active promotional codes available right now.
                                </p>
                            ) : (
                                availableCoupons.map((coupon) => {
                                    const minAmt = coupon.minimumAmount || 0;
                                    const isEligible = subtotal >= minAmt;
                                    const shortfall = minAmt - subtotal;

                                    return (
                                        <div
                                            key={coupon._id}
                                            className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                                                isEligible
                                                    ? "bg-slate-50/70 border-slate-200 hover:border-indigo-300"
                                                    : "bg-slate-50/30 border-slate-100 opacity-75"
                                            }`}
                                        >
                                            <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                                                    <Percent className="w-3.5 h-3.5" />
                                                </div>
                                                <div className="truncate">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-extrabold text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase">
                                                            {coupon.code}
                                                        </span>
                                                        <span className="text-[11px] font-black text-emerald-600">
                                                            {coupon.discountPercentage}% OFF
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] font-medium text-slate-500 mt-1 truncate">
                                                        Max discount {formatPrice(coupon.maxDiscount)}
                                                        {minAmt > 0 && ` on orders above ${formatPrice(minAmt)}`}
                                                    </p>
                                                    {!isEligible && shortfall > 0 && (
                                                        <p className="text-[10px] font-bold text-amber-600 flex items-center gap-1 mt-0.5">
                                                            <AlertCircle className="w-3 h-3 shrink-0" />
                                                            Add {formatPrice(shortfall)} more to unlock
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleApplyCode(coupon.code)}
                                                disabled={!isEligible || loading}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-black transition shrink-0 ${
                                                    isEligible
                                                        ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs"
                                                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                                                }`}
                                            >
                                                {loading ? "..." : "Apply"}
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CouponSection;
