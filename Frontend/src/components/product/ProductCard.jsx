import { useContext } from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import toast from "react-hot-toast";

function ProductCard({ product }) {
    const { addToCart } = useContext(CartContext);
    const { addItemToWishlist, removeItemFromWishlist, isInWishlist } = useWishlist();

    const productImage = product.images?.[0] || product.image;
    const isOutOfStock = product.stock <= 0;
    const isLiked = isInWishlist(product._id);

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;
        try {
            await addToCart(product._id, 1);
            toast.success("Added to cart!");
        } catch (error) {
            toast.error("Failed to add to cart");
        }
    };

    const handleToggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isLiked) {
            await removeItemFromWishlist(product._id);
        } else {
            await addItemToWishlist(product._id);
        }
    };

    return (
        <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 flex flex-col justify-between">
            {/* Product Image & Badges */}
            <div className="relative aspect-square overflow-hidden bg-slate-50">
                {productImage ? (
                    <img
                        src={productImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-sm font-medium text-slate-400">No image available</p>
                    </div>
                )}

                {/* Category Badge */}
                <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-800 shadow-2xs backdrop-blur">
                    {product.category}
                </span>

                {/* Wishlist Toggle Button */}
                <button
                    type="button"
                    onClick={handleToggleWishlist}
                    aria-label={`Toggle wishlist for ${product.name}`}
                    className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full shadow-xs backdrop-blur transition ${
                        isLiked
                            ? "bg-rose-50 text-rose-500"
                            : "bg-white/90 text-slate-400 hover:bg-white hover:text-rose-500"
                    }`}
                >
                    <Heart size={18} className={isLiked ? "fill-rose-500" : ""} />
                </button>

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/45 backdrop-blur-xs">
                        <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-md">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info & Actions */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                    <Link to={`/products/${product._id}`} className="block">
                        <h3 className="line-clamp-1 text-base font-bold tracking-tight text-slate-900 transition hover:text-indigo-600">
                            {product.name}
                        </h3>
                    </Link>

                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {product.description}
                    </p>
                </div>

                <div>
                    <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-slate-400">Price</p>
                            <p className="text-lg font-black text-slate-950">
                                ₹{Number(product.price).toLocaleString("en-IN")}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 shadow-xs active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                        >
                            <ShoppingBag size={18} />
                        </button>
                    </div>

                    {product.stock > 0 && product.stock <= 5 && (
                        <p className="mt-2 text-[10px] font-bold text-amber-600 flex items-center gap-1">
                            ⚠️ Only {product.stock} items remaining!
                        </p>
                    )}
                </div>
            </div>
        </article>
    );
}

export default ProductCard;