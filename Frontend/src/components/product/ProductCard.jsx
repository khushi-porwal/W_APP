import {
    Heart,
    ShoppingBag,
} from "lucide-react";

import { Link } from "react-router-dom";

function ProductCard({ product }) {
    console.log("SINGLE PRODUCT:", product);
     const productImage =
        product.images?.[0] || product.image;

    const isOutOfStock = product.stock <= 0;

    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-slate-100">
                {productImage ? (
                    <img
                        src={productImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm font-medium text-slate-400">
                            No image available
                        </p>
                    </div>
                )}

                {/* Category */}
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold capitalize text-slate-700 shadow-sm backdrop-blur">
                    {product.category}
                </span>

                {/* Wishlist */}
                <button
                    type="button"
                    aria-label={`Add ${product.name} to wishlist`}
                    className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-950 hover:text-white"
                >
                    <Heart size={18} />
                </button>

                {/* Stock Badge */}
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45">
                        <span className="rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950">
                            Out of stock
                        </span>
                    </div>
                )}
            </div>

            {/* Product Content */}
            <div className="p-5">
                <Link
                    to={`/products/${product._id}`}
                    className="block"
                >
                    <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-slate-950 transition hover:text-slate-600">
                        {product.name}
                    </h3>
                </Link>

                <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">
                    {product.description}
                </p>

                <div className="mt-5 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-medium text-slate-500">
                            Price
                        </p>

                        <p className="mt-1 text-xl font-bold text-slate-950">
                            ₹
                            {Number(product.price).toLocaleString(
                                "en-IN"
                            )}
                        </p>
                    </div>

                    <button
                        type="button"
                        disabled={isOutOfStock}
                        aria-label={`Add ${product.name} to cart`}
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                        <ShoppingBag size={19} />
                    </button>
                </div>

                {product.stock > 0 && product.stock <= 5 && (
                    <p className="mt-4 text-xs font-semibold text-amber-700">
                        Only {product.stock} left in stock
                    </p>
                )}
            </div>
        </article>
    );
}

export default ProductCard;