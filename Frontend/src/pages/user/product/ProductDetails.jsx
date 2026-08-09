import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Heart, Minus, Plus, ShieldCheck, ShoppingBag, Truck, Zap, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../context/AuthContext";
import { CartContext } from "../../../context/CartContext";
import { useWishlist } from "../../../context/WishlistContext";
import { getSingleProduct, getAllProducts } from "../../../services/productService";
import ProductCard from "../../../components/product/ProductCard";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);
    const { addToCart } = useContext(CartContext);
    const { addItemToWishlist, removeItemFromWishlist, isInWishlist } = useWishlist();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);

    const isLiked = product ? isInWishlist(product._id) : false;

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                const response = await getSingleProduct(id);
                const prodData = response.data;
                setProduct(prodData);

                // Fetch related products in same category
                if (prodData?.category) {
                    const relRes = await getAllProducts({ category: prodData.category, limit: 4 });
                    if (relRes?.data?.products) {
                        setRelatedProducts(relRes.data.products.filter(p => p._id !== id));
                    }
                }
            } catch (error) {
                const message = error.response?.data?.message || "Unable to fetch product details";
                toast.error(message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    const increaseQuantity = () => {
        if (quantity < product.stock) {
            setQuantity((prev) => prev + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity((prev) => prev - 1);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            toast.error("Please sign in to add products to cart");
            navigate("/login");
            return;
        }

        try {
            setAddingToCart(true);
            await addToCart(product._id, quantity);
            toast.success(`${product.name} added to cart!`);
        } catch (error) {
            const message = error.response?.data?.message || "Unable to add product to cart";
            toast.error(message);
        } finally {
            setAddingToCart(false);
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        navigate("/cart");
    };

    const handleToggleWishlist = async () => {
        if (isLiked) {
            await removeItemFromWishlist(product._id);
        } else {
            await addItemToWishlist(product._id);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid gap-10 lg:grid-cols-2">
                    <div className="aspect-square bg-slate-200 rounded-3xl animate-pulse" />
                    <div className="space-y-4 py-6">
                        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse" />
                        <div className="h-10 w-3/4 bg-slate-200 rounded animate-pulse" />
                        <div className="h-8 w-24 bg-slate-200 rounded animate-pulse" />
                        <div className="h-24 w-full bg-slate-100 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-extrabold text-slate-900">Product Not Found</h1>
                <p className="text-slate-500 text-sm mt-2">The product you requested could not be located.</p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 mt-6 bg-indigo-600 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-700 transition"
                >
                    <ArrowLeft size={18} /> Back to Catalog
                </Link>
            </div>
        );
    }

    const productImage = product.images?.[0] || product.image;
    const isOutOfStock = product.stock <= 0;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
            
            {/* Breadcrumb Navigation */}
            <div>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-indigo-600 transition"
                >
                    <ArrowLeft size={16} /> Back to Products Catalog
                </Link>
            </div>

            {/* Main Product Showcase Grid */}
            <div className="grid gap-12 lg:grid-cols-2 items-start">
                
                {/* Product Media Column */}
                <div className="space-y-4">
                    <div className="relative overflow-hidden rounded-3xl bg-slate-100 border border-slate-200 shadow-lg aspect-square">
                        {productImage ? (
                            <img
                                src={productImage}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400">
                                No image available
                            </div>
                        )}

                        <button
                            onClick={handleToggleWishlist}
                            className={`absolute top-4 right-4 p-3 rounded-full shadow-md backdrop-blur transition ${
                                isLiked
                                    ? "bg-rose-50 text-rose-500"
                                    : "bg-white/90 text-slate-400 hover:text-rose-500"
                            }`}
                        >
                            <Heart className={`w-5 h-5 ${isLiked ? "fill-rose-500" : ""}`} />
                        </button>

                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center">
                                <span className="bg-white text-slate-950 px-6 py-2 rounded-full font-black uppercase text-sm shadow-xl tracking-wider">
                                    Out of Stock
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Specifications & Purchase Column */}
                <div className="space-y-6">
                    <div>
                        <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">
                            {product.category}
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 leading-tight">
                            {product.name}
                        </h1>
                        <p className="text-3xl font-black text-slate-900 mt-4">
                            ₹{Number(product.price).toLocaleString("en-IN")}
                        </p>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    {/* Stock Status Indicator */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Availability:</span>
                        {isOutOfStock ? (
                            <span className="text-xs font-bold text-rose-600">Out of Stock</span>
                        ) : product.stock <= 5 ? (
                            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                                ⚠️ Only {product.stock} items remaining!
                            </span>
                        ) : (
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" /> In Stock ({product.stock} available)
                            </span>
                        )}
                    </div>

                    {/* Quantity Selector & Purchase Buttons */}
                    {!isOutOfStock && (
                        <div className="space-y-6 pt-2">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                                    Select Quantity
                                </label>
                                <div className="inline-flex items-center rounded-xl border border-slate-300 bg-white p-1 shadow-xs">
                                    <button
                                        onClick={decreaseQuantity}
                                        disabled={quantity === 1}
                                        className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="px-5 font-black text-sm text-slate-900">
                                        {quantity}
                                    </span>
                                    <button
                                        onClick={increaseQuantity}
                                        disabled={quantity === product.stock}
                                        className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-30"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-lg shadow-indigo-500/20 transition active:scale-98 disabled:opacity-50"
                                >
                                    <ShoppingBag size={18} />
                                    {addingToCart ? "Adding..." : "Add to Cart"}
                                </button>

                                <button
                                    onClick={handleBuyNow}
                                    className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-4 px-6 rounded-2xl shadow-lg transition active:scale-98"
                                >
                                    <Zap size={18} /> Buy Now
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Assurance Badges */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200 text-slate-600 text-xs">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <Truck className="w-5 h-5 text-indigo-600" />
                            <div>
                                <p className="font-bold text-slate-900">Fast Shipping</p>
                                <p className="text-[10px] text-slate-500">Delivered within 3-5 days</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <ShieldCheck className="w-5 h-5 text-indigo-600" />
                            <div>
                                <p className="font-bold text-slate-900">Guaranteed Genuine</p>
                                <p className="text-[10px] text-slate-500">100% authentic product</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div className="pt-12 border-t border-slate-200 space-y-6">
                    <h2 className="text-2xl font-extrabold text-slate-900">Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map((relProd) => (
                            <ProductCard key={relProd._id} product={relProd} />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
}

export default ProductDetails;
