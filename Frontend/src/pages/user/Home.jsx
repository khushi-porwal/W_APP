import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Heart, Star, Sparkles, ShieldCheck, Truck, RefreshCw, Zap } from "lucide-react";
import { getProducts } from "../../services/productService";
import { getPublicCategories } from "../../services/categoryService";
import { CartContext } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import toast from "react-hot-toast";

function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const { addToCart } = useContext(CartContext);
    const { addItemToWishlist, removeItemFromWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [prodRes, catRes] = await Promise.all([
                    getProducts({ limit: 8 }),
                    getPublicCategories()
                ]);

                if (prodRes?.data?.products) setProducts(prodRes.data.products.slice(0, 8));
                else if (prodRes?.data) setProducts((Array.isArray(prodRes.data) ? prodRes.data : []).slice(0, 8));

                if (catRes?.data?.categories) setCategories(catRes.data.categories);
                else if (catRes?.data) setCategories(Array.isArray(catRes.data) ? catRes.data : []);
            } catch (error) {
                console.error("Error fetching homepage data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleAddToCart = async (product) => {
        try {
            await addToCart(product._id, 1);
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            toast.error("Failed to add product to cart");
        }
    };

    const toggleWishlist = async (productId) => {
        if (isInWishlist(productId)) {
            await removeItemFromWishlist(productId);
        } else {
            await addItemToWishlist(productId);
        }
    };

    return (
        <div className="space-y-16 pb-12">
            
            {/* Hero Banner Section */}
            <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-8 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 via-slate-900/95 to-slate-900 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
                    alt="Hero Banner"
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                />

                <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md">
                            <Sparkles className="w-4 h-4 text-indigo-400" /> New Season Collection 2026
                        </div>
                        
                        <h1 className="text-4xl sm:text-6xl font-black leading-tight tracking-tight text-white">
                            Elevate Your Style & <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Everyday Living</span>
                        </h1>

                        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
                            Discover luxury audio, trendy apparel, and curated home decor crafted for premium comfort and timeless elegance.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Link
                                to="/products"
                                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
                            >
                                Shop Catalog <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/products?category=Electronics"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-4 rounded-2xl font-bold text-sm backdrop-blur transition"
                            >
                                Explore Tech
                            </Link>
                        </div>
                    </div>

                    {/* Hero Highlight Cards Grid */}
                    <div className="hidden lg:grid grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-3 transform hover:scale-105 transition">
                            <div className="w-10 h-10 bg-indigo-500/20 text-indigo-300 rounded-xl flex items-center justify-center">
                                <Zap className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg text-white">Flash Deals</h3>
                            <p className="text-xs text-slate-300">Up to 40% discount on selected tech & gear</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl space-y-3 transform hover:scale-105 transition">
                            <div className="w-10 h-10 bg-purple-500/20 text-purple-300 rounded-xl flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-lg text-white">Guaranteed Quality</h3>
                            <p className="text-xs text-slate-300">Handpicked items tested for premium durability</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Discover Categories</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Shop by Collection</h2>
                    </div>
                    <Link to="/products" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <Link
                                key={cat._id || cat.slug}
                                to={`/products?category=${encodeURIComponent(cat.name)}`}
                                className="group relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900 border border-slate-200 shadow-xs hover:shadow-xl transition duration-300"
                            >
                                <img
                                    src={cat.image || "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800"}
                                    alt={cat.name}
                                    className="w-full h-full object-cover opacity-85 group-hover:scale-110 transition duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-4 flex flex-col justify-end">
                                    <h3 className="text-white font-bold text-base sm:text-lg group-hover:text-indigo-300 transition">
                                        {cat.name}
                                    </h3>
                                    <p className="text-slate-300 text-xs line-clamp-1 opacity-0 group-hover:opacity-100 transition duration-300">
                                        {cat.description || "Explore collection"}
                                    </p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        [1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[4/3] rounded-2xl bg-slate-200 animate-pulse" />
                        ))
                    )}
                </div>
            </section>

            {/* Featured Products Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Trending Now</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Featured Products</h2>
                    </div>
                    <Link to="/products" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                        Explore Catalog <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => {
                            const isLiked = isInWishlist(product._id);
                            return (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition duration-300 flex flex-col justify-between group"
                                >
                                    {/* Image & Wishlist Button */}
                                    <div className="relative aspect-square overflow-hidden bg-slate-50">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                        <button
                                            onClick={() => toggleWishlist(product._id)}
                                            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition ${
                                                isLiked
                                                    ? "bg-rose-50 text-rose-500"
                                                    : "bg-white/80 text-slate-400 hover:text-rose-500"
                                            }`}
                                        >
                                            <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500" : ""}`} />
                                        </button>
                                        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-800 uppercase tracking-wider shadow-2xs">
                                            {product.category}
                                        </span>
                                    </div>

                                    {/* Info & CTA */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <Link to={`/products/${product._id}`}>
                                                <h3 className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-indigo-600 transition">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                                                {product.description}
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <div>
                                                <span className="text-xs text-slate-400">Price</span>
                                                <p className="text-lg font-black text-slate-900">
                                                    ₹{product.price?.toLocaleString("en-IN")}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition active:scale-95"
                                            >
                                                <ShoppingBag className="w-3.5 h-3.5" /> Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Promotional Promo Coupon Callout */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between shadow-xl gap-6">
                    <div className="space-y-2 text-center md:text-left">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Special Promotion</span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold">Get 10% Off Your First Purchase</h2>
                        <p className="text-indigo-200 text-sm max-w-lg">
                            Use coupon code <span className="font-mono bg-white text-indigo-900 font-extrabold px-2 py-0.5 rounded">WELCOME10</span> at checkout for instant savings.
                        </p>
                    </div>
                    <Link
                        to="/products"
                        className="bg-white text-indigo-950 hover:bg-indigo-50 font-extrabold px-8 py-4 rounded-2xl text-sm transition shadow-lg shrink-0"
                    >
                        Claim Discount Now
                    </Link>
                </div>
            </section>

        </div>
    );
}

export default Home;