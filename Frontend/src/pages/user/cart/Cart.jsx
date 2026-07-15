import {
    ArrowLeft,
    Minus,
    Plus,
    ShoppingBag,
    Trash2,
    Truck,
} from "lucide-react";

import {
    useContext,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import Navbar from "../../../components/common/Navbar";

import { CartContext } from "../../../context/CartContext";


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

    const [updatingCartId, setUpdatingCartId] =
        useState(null);

    const [deletingCartId, setDeletingCartId] =
        useState(null);


    // ==========================================
    // UPDATE CART QUANTITY
    // ==========================================

    const handleQuantityChange = async (
        cartItem,
        newQuantity
    ) => {
        if (newQuantity < 1) {
            return;
        }

        if (
            newQuantity >
            cartItem.product.stock
        ) {
            toast.error(
                `Only ${cartItem.product.stock} items are available`
            );

            return;
        }

        try {
            setUpdatingCartId(cartItem._id);

            await changeCartQuantity(
                cartItem._id,
                newQuantity
            );
        } finally {
            setUpdatingCartId(null);
        }
    };


    // ==========================================
    // REMOVE CART ITEM
    // ==========================================

    const handleRemoveItem = async (cartId) => {
        try {
            setDeletingCartId(cartId);

            await removeCartItem(cartId);
        } finally {
            setDeletingCartId(null);
        }
    };


    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (price) => {
        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(price);
    };


    // ==========================================
    // LOADING STATE
    // ==========================================

    if (cartLoading) {
        return (
            <>
                <Navbar />

                <main className="min-h-screen bg-slate-50">
                    <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
                        <div className="animate-pulse">
                            <div className="h-10 w-52 rounded-xl bg-slate-200" />

                            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
                                <div className="space-y-4">
                                    {[1, 2, 3].map(
                                        (item) => (
                                            <div
                                                key={item}
                                                className="h-44 rounded-3xl bg-slate-200"
                                            />
                                        )
                                    )}
                                </div>

                                <div className="h-96 rounded-3xl bg-slate-200" />
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    }


    // ==========================================
    // EMPTY CART
    // ==========================================

    if (cartItems.length === 0) {
        return (
            <>
                <Navbar />

                <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 px-5">
                    <div className="max-w-md text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
                            <ShoppingBag
                                size={34}
                                className="text-slate-700"
                            />
                        </div>

                        <h1 className="mt-7 text-3xl font-bold tracking-tight text-slate-950">
                            Your cart is empty
                        </h1>

                        <p className="mt-3 text-base leading-7 text-slate-600">
                            Looks like you haven't added
                            anything to your cart yet.
                            Explore our products and find
                            something you'll love.
                        </p>

                        <Link
                            to="/products"
                            className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            <ShoppingBag size={18} />

                            Start shopping
                        </Link>
                    </div>
                </main>
            </>
        );
    }


    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
                    {/* Back Link */}
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
                    >
                        <ArrowLeft size={18} />

                        Continue shopping
                    </Link>


                    {/* Page Header */}
                    <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                                Shopping cart
                            </p>

                            <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
                                Your cart
                            </h1>
                        </div>

                        <p className="text-sm font-medium text-slate-600">
                            {totalItems}{" "}
                            {totalItems === 1
                                ? "item"
                                : "items"}{" "}
                            in your cart
                        </p>
                    </div>


                    {/* Cart Layout */}
                    <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
                        {/* Cart Items */}
                        <section className="space-y-4">
                            {cartItems.map(
                                (cartItem) => {
                                    const product =
                                        cartItem.product;

                                    const productImage =
                                        product?.image ||
                                        product?.images?.[0];

                                    const isUpdating =
                                        updatingCartId ===
                                        cartItem._id;

                                    const isDeleting =
                                        deletingCartId ===
                                        cartItem._id;

                                    return (
                                        <article
                                            key={
                                                cartItem._id
                                            }
                                            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                                        >
                                            <div className="flex flex-col gap-6 sm:flex-row">
                                                {/* Product Image */}
                                                <Link
                                                    to={`/products/${product._id}`}
                                                    className="flex h-48 w-full shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 sm:h-40 sm:w-40"
                                                >
                                                    {productImage ? (
                                                        <img
                                                            src={
                                                                productImage
                                                            }
                                                            alt={
                                                                product.name
                                                            }
                                                            className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                                        />
                                                    ) : (
                                                        <ShoppingBag
                                                            size={
                                                                32
                                                            }
                                                            className="text-slate-400"
                                                        />
                                                    )}
                                                </Link>


                                                {/* Product Details */}
                                                <div className="flex min-w-0 flex-1 flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div>
                                                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                                                    {
                                                                        product.category
                                                                    }
                                                                </p>

                                                                <Link
                                                                    to={`/products/${product._id}`}
                                                                    className="mt-2 block"
                                                                >
                                                                    <h2 className="text-xl font-bold text-slate-950 transition hover:text-slate-600">
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </h2>
                                                                </Link>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleRemoveItem(
                                                                        cartItem._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    isDeleting
                                                                }
                                                                aria-label="Remove product"
                                                                className="rounded-xl p-2.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                                            >
                                                                <Trash2
                                                                    size={
                                                                        19
                                                                    }
                                                                />
                                                            </button>
                                                        </div>

                                                        <p className="mt-3 text-lg font-bold text-slate-950">
                                                            {formatPrice(
                                                                product.price
                                                            )}
                                                        </p>
                                                    </div>


                                                    {/* Quantity And Total */}
                                                    <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                                        <div>
                                                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                                Quantity
                                                            </p>

                                                            <div className="inline-flex items-center rounded-xl border border-slate-200 bg-slate-50 p-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleQuantityChange(
                                                                            cartItem,
                                                                            cartItem.quantity -
                                                                                1
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        cartItem.quantity <=
                                                                            1 ||
                                                                        isUpdating
                                                                    }
                                                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                                                                >
                                                                    <Minus
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>

                                                                <span className="min-w-10 text-center text-sm font-bold text-slate-950">
                                                                    {isUpdating
                                                                        ? "..."
                                                                        : cartItem.quantity}
                                                                </span>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleQuantityChange(
                                                                            cartItem,
                                                                            cartItem.quantity +
                                                                                1
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        cartItem.quantity >=
                                                                            product.stock ||
                                                                        isUpdating
                                                                    }
                                                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                                                                >
                                                                    <Plus
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>

                                                            <p className="mt-2 text-xs text-slate-500">
                                                                {
                                                                    product.stock
                                                                }{" "}
                                                                available
                                                            </p>
                                                        </div>

                                                        <div className="sm:text-right">
                                                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                                Item total
                                                            </p>

                                                            <p className="mt-1 text-xl font-bold text-slate-950">
                                                                {formatPrice(
                                                                    product.price *
                                                                        cartItem.quantity
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                }
                            )}
                        </section>


                        {/* Order Summary */}
                        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28">
                            <h2 className="text-xl font-bold text-slate-950">
                                Order summary
                            </h2>

                            <div className="mt-6 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">
                                        Subtotal
                                    </span>

                                    <span className="font-semibold text-slate-950">
                                        {formatPrice(
                                            totalAmount
                                        )}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">
                                        Delivery
                                    </span>

                                    <span className="font-semibold text-emerald-600">
                                        Free
                                    </span>
                                </div>

                                <div className="border-t border-slate-200 pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-950">
                                            Total
                                        </span>

                                        <span className="text-2xl font-bold text-slate-950">
                                            {formatPrice(
                                                totalAmount
                                            )}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-xs text-slate-500">
                                        Taxes calculated at
                                        checkout.
                                    </p>
                                </div>
                            </div>


                            {/* Delivery Info */}
                            <div className="mt-6 flex gap-3 rounded-2xl bg-slate-50 p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm">
                                    <Truck size={19} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-950">
                                        Free delivery
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Enjoy free delivery on
                                        your complete order.
                                    </p>
                                </div>
                            </div>


                            {/* Checkout Button */}
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/checkout")
                                }
                                className="mt-6 w-full rounded-xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Proceed to checkout
                            </button>

                            <Link
                                to="/products"
                                className="mt-3 block rounded-xl px-5 py-3 text-center text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                            >
                                Continue shopping
                            </Link>
                        </aside>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Cart;