import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { CartContext } from "../../context/CartContext";
import { Trash2, ShoppingBag, Heart, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const Wishlist = () => {
    const { wishlistItems, loading, removeItemFromWishlist } = useWishlist();
    const { addToCart } = useContext(CartContext);

    const handleAddToCart = async (product) => {
        try {
            await addToCart(product._id, 1);
            toast.success("Added to cart!");
        } catch (error) {
            toast.error("Failed to add item to cart");
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                <div className="animate-spin w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-slate-500 font-medium">Loading your wishlist...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center justify-between pb-6 border-b border-slate-200 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                        <Heart className="w-8 h-8 text-rose-500 fill-rose-500" /> My Wishlist
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved for later
                    </p>
                </div>
                <Link
                    to="/products"
                    className="hidden sm:flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
                >
                    Continue Shopping <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {wishlistItems.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto my-10">
                    <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-10 h-10" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Your Wishlist is Empty</h2>
                    <p className="text-slate-500 text-sm mb-6">
                        Explore our catalog and tap the heart icon on any product to save your favorites here.
                    </p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-md"
                    >
                        Browse Products <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => {
                        const product = item.product || item;
                        if (!product || typeof product !== "object") return null;

                        return (
                            <div
                                key={item._id || product._id}
                                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition group flex flex-col justify-between"
                            >
                                <div className="relative aspect-square overflow-hidden bg-slate-100">
                                    <img
                                        src={product.image || "https://via.placeholder.com/400"}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <button
                                        onClick={() => removeItemFromWishlist(product._id)}
                                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-slate-400 hover:text-rose-600 hover:bg-white transition shadow-sm"
                                        title="Remove from Wishlist"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="p-4 flex-grow flex flex-col justify-between">
                                    <div>
                                        <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                                            {product.category || "General"}
                                        </span>
                                        <Link to={`/products/${product._id}`}>
                                            <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mt-2 hover:text-indigo-600 transition">
                                                {product.name}
                                            </h3>
                                        </Link>
                                        <p className="text-lg font-extrabold text-slate-900 mt-2">
                                            ₹{product.price?.toLocaleString("en-IN")}
                                        </p>
                                    </div>

                                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-xs"
                                        >
                                            <ShoppingBag className="w-4 h-4" /> Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
