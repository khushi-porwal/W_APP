import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CartContext } from "../../../context/CartContext";
import CouponSection from "../../../components/common/CouponSection";

function Cart() {
    const {
        cartItems,
        totalItems,
        totalAmount,
        cartLoading,
        changeCartQuantity,
        removeCartItem,
    } = useContext(CartContext);

    const navigate = useNavigate();

    const [updatingCartId, setUpdatingCartId] = useState(null);
    const [deletingCartId, setDeletingCartId] = useState(null);

    // Coupon state
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const couponDiscount = appliedCoupon?.discountAmount || 0;

    const handleQuantityChange = async (cartItem, newQuantity) => {
        if (newQuantity < 1) return;
        if (newQuantity > cartItem.product.stock) {
            toast.error(`Only ${cartItem.product.stock} items available`);
            return;
        }
        try {
            setUpdatingCartId(cartItem._id);
            await changeCartQuantity(cartItem._id, newQuantity);
        } finally {
            setUpdatingCartId(null);
        }
    };

    const handleRemoveItem = async (cartId) => {
        try {
            setDeletingCartId(cartId);
            await removeCartItem(cartId);
        } finally {
            setDeletingCartId(null);
        }
    };

    const finalTotal = Math.max(0, totalAmount - couponDiscount);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);
    };

    if (cartLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="animate-pulse space-y-6">
                    <div className="h-10 w-48 bg-slate-200 rounded-xl" />
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="h-40 bg-slate-200 rounded-3xl" />
                            ))}
                        </div>
                        <div className="h-80 bg-slate-200 rounded-3xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center my-10">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag size={36} />
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                    Your Shopping Cart is Empty
                </h1>
                <p className="text-slate-500 text-sm mb-8">
                    Discover products in our store and add items to your cart.
                </p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold text-sm px-8 py-4 rounded-2xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20"
                >
                    <ShoppingBag size={18} /> Start Shopping Now
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition"
                >
                    <ArrowLeft size={16} /> Continue Shopping
                </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-4 border-b border-slate-200">
                <div>
                    <h1 className="text-3xl font-black text-slate-900">Shopping Cart</h1>
                    <p className="text-slate-500 text-xs mt-1">Review your items before proceeding to checkout</p>
                </div>
                <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                    {totalItems} {totalItems === 1 ? "Item" : "Items"} in Cart
                </span>
            </div>

            <div className="grid items-start gap-8 lg:grid-cols-12">
                {/* Cart Items List */}
                <div className="lg:col-span-8 space-y-4">
                    {cartItems.map((cartItem) => {
                        const product = cartItem.product;
                        const productImage = product?.image || product?.images?.[0];
                        const isUpdating = updatingCartId === cartItem._id;
                        const isDeleting = deletingCartId === cartItem._id;

                        return (
                            <div
                                key={cartItem._id}
                                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row gap-5 items-center justify-between"
                            >
                                <Link
                                    to={`/products/${product._id}`}
                                    className="w-full sm:w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200"
                                >
                                    <img
                                        src={productImage || "https://via.placeholder.com/150"}
                                        alt={product.name}
                                        className="w-full h-full object-cover hover:scale-105 transition"
                                    />
                                </Link>

                                <div className="flex-1 w-full space-y-2">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <span className="text-[10px] font-bold text-indigo-600 uppercase">
                                                {product.category}
                                            </span>
                                            <Link to={`/products/${product._id}`}>
                                                <h3 className="text-base font-bold text-slate-900 line-clamp-1 hover:text-indigo-600 transition">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(cartItem._id)}
                                            disabled={isDeleting}
                                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition"
                                            title="Remove item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between pt-2">
                                        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
                                            <button
                                                onClick={() => handleQuantityChange(cartItem, cartItem.quantity - 1)}
                                                disabled={cartItem.quantity <= 1 || isUpdating}
                                                className="p-1 text-slate-600 hover:bg-white rounded disabled:opacity-30"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="px-3 text-xs font-black text-slate-900">
                                                {isUpdating ? "..." : cartItem.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(cartItem, cartItem.quantity + 1)}
                                                disabled={cartItem.quantity >= product.stock || isUpdating}
                                                className="p-1 text-slate-600 hover:bg-white rounded disabled:opacity-30"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <p className="text-base font-black text-slate-900">
                                            {formatPrice(product.price * cartItem.quantity)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary & Coupon Card */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Coupon Section Component */}
                    <CouponSection
                        subtotal={totalAmount}
                        appliedCoupon={appliedCoupon}
                        onApply={(couponData) => setAppliedCoupon(couponData)}
                        onRemove={() => setAppliedCoupon(null)}
                    />

                    {/* Summary Calculation */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                            Order Summary
                        </h2>

                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span className="font-bold text-slate-900">{formatPrice(totalAmount)}</span>
                            </div>
                            {couponDiscount > 0 && (
                                <div className="flex justify-between text-emerald-600 font-bold">
                                    <span>Coupon Discount</span>
                                    <span>- {formatPrice(couponDiscount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-slate-600">
                                <span>Estimated Shipping</span>
                                <span className="font-bold text-emerald-600">FREE</span>
                            </div>
                            <div className="border-t border-slate-200 pt-3 flex justify-between items-center text-sm font-black">
                                <span className="text-slate-900">Final Total</span>
                                <span className="text-xl text-indigo-600">{formatPrice(finalTotal)}</span>
                            </div>
                        </div>

                        <button
                            onClick={() =>
                                navigate("/checkout", {
                                    state: {
                                        appliedCoupon,
                                        couponCode: appliedCoupon?.couponCode,
                                        discountAmount: couponDiscount,
                                    },
                                })
                            }
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition active:scale-98"
                        >
                            Proceed to Checkout
                        </button>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 text-xs text-slate-600">
                        <Truck className="w-5 h-5 text-indigo-600 shrink-0" />
                        <p>Enjoy free express shipping on this order with full tracking details.</p>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Cart;