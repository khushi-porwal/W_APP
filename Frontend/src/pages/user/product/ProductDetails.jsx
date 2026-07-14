import {
    ArrowLeft,
    Heart,
    Minus,
    Plus,
    ShieldCheck,
    ShoppingBag,
    Truck,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import Navbar from "../../../components/common/Navbar";

import {
    getSingleProduct,
} from "../../../services/productService";

function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);

    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);

                const response =
                    await getSingleProduct(id);

                setProduct(response.data);
            } catch (error) {
                const message =
                    error.response?.data?.message ||
                    "Unable to fetch product";

                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const increaseQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(
                (previousQuantity) =>
                    previousQuantity + 1
            );
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(
                (previousQuantity) =>
                    previousQuantity - 1
            );
        }
    };

    if (loading) {
        return <ProductDetailsSkeleton />;
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-slate-50">
                <Navbar />

                <main className="flex min-h-[calc(100vh-72px)] items-center justify-center px-5">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-slate-950">
                            Product not found
                        </h1>

                        <p className="mt-3 text-slate-600">
                            The product you're looking for is unavailable.
                        </p>

                        <Link
                            to="/products"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
                        >
                            <ArrowLeft size={18} />

                            Back to shop
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const productImage =
        product.images?.[0] || product.image;

    const isOutOfStock = product.stock <= 0;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main>
                <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-14">
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"
                    >
                        <ArrowLeft size={18} />

                        Back to shop
                    </Link>

                    <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
                        {/* Product Image */}
                        <div className="relative overflow-hidden rounded-[2rem] bg-slate-100">
                            <div className="aspect-square">
                                {productImage ? (
                                    <img
                                        src={productImage}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center">
                                        <p className="text-sm font-medium text-slate-400">
                                            No image available
                                        </p>
                                    </div>
                                )}
                            </div>

                            {isOutOfStock && (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45">
                                    <span className="rounded-full bg-white px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-slate-950">
                                        Out of stock
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Product Information */}
                        <div className="flex flex-col justify-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                                {product.category}
                            </p>

                            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                                {product.name}
                            </h1>

                            <p className="mt-6 text-3xl font-bold text-slate-950">
                                ₹
                                {Number(
                                    product.price
                                ).toLocaleString("en-IN")}
                            </p>

                            <p className="mt-6 text-base leading-8 text-slate-600">
                                {product.description}
                            </p>

                            <div className="my-8 border-t border-slate-200" />

                            {/* Stock */}
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold text-slate-700">
                                    Availability
                                </p>

                                {isOutOfStock ? (
                                    <span className="text-sm font-semibold text-red-600">
                                        Out of stock
                                    </span>
                                ) : product.stock <= 5 ? (
                                    <span className="text-sm font-semibold text-amber-700">
                                        Only {product.stock} left
                                    </span>
                                ) : (
                                    <span className="text-sm font-semibold text-emerald-700">
                                        In stock
                                    </span>
                                )}
                            </div>

                            {!isOutOfStock && (
                                <>
                                    {/* Quantity */}
                                    <div className="mt-7">
                                        <p className="text-sm font-semibold text-slate-700">
                                            Quantity
                                        </p>

                                        <div className="mt-3 flex w-fit items-center rounded-xl border border-slate-300 bg-white">
                                            <button
                                                type="button"
                                                onClick={
                                                    decreaseQuantity
                                                }
                                                disabled={
                                                    quantity === 1
                                                }
                                                className="flex h-12 w-12 items-center justify-center text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                <Minus size={18} />
                                            </button>

                                            <span className="flex h-12 min-w-12 items-center justify-center border-x border-slate-300 px-4 text-sm font-bold text-slate-950">
                                                {quantity}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={
                                                    increaseQuantity
                                                }
                                                disabled={
                                                    quantity ===
                                                    product.stock
                                                }
                                                className="flex h-12 w-12 items-center justify-center text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                                            >
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
                                        <button
                                            type="button"
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                                        >
                                            <ShoppingBag
                                                size={19}
                                            />

                                            Add to cart
                                        </button>

                                        <button
                                            type="button"
                                            aria-label="Add to wishlist"
                                            className="inline-flex h-13 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-slate-700 transition hover:border-slate-950 hover:text-slate-950"
                                        >
                                            <Heart size={20} />
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Benefits */}
                            <div className="mt-10 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2">
                                <div className="flex items-start gap-3">
                                    <Truck
                                        size={20}
                                        className="mt-0.5 shrink-0 text-slate-700"
                                    />

                                    <div>
                                        <p className="text-sm font-semibold text-slate-950">
                                            Reliable delivery
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Track your order from checkout to delivery.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <ShieldCheck
                                        size={20}
                                        className="mt-0.5 shrink-0 text-slate-700"
                                    />

                                    <div>
                                        <p className="text-sm font-semibold text-slate-950">
                                            Secure shopping
                                        </p>

                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Your account and checkout experience are protected.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function ProductDetailsSkeleton() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
                <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
                    <div className="aspect-square animate-pulse rounded-[2rem] bg-slate-200" />

                    <div className="flex flex-col justify-center">
                        <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />

                        <div className="mt-5 h-12 w-4/5 animate-pulse rounded bg-slate-200" />

                        <div className="mt-6 h-8 w-32 animate-pulse rounded bg-slate-200" />

                        <div className="mt-8 h-4 w-full animate-pulse rounded bg-slate-100" />

                        <div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" />

                        <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-slate-100" />

                        <div className="mt-10 h-14 w-full animate-pulse rounded-xl bg-slate-200" />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProductDetails;