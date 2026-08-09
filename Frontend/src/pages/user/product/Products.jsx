import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import toast from "react-hot-toast";
import ProductCard from "../../../components/product/ProductCard";
import { getAllProducts } from "../../../services/productService";
import { getPublicCategories } from "../../../services/categoryService";

function Products() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const initialSearch = searchParams.get("search") || "";
    const initialCategory = searchParams.get("category") || "";

    const [search, setSearch] = useState(initialSearch);
    const [category, setCategory] = useState(initialCategory);
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    // Sync state if searchParams in URL changes
    useEffect(() => {
        const qSearch = searchParams.get("search") || "";
        const qCategory = searchParams.get("category") || "";
        setSearch(qSearch);
        setCategory(qCategory);
        setPage(1);
    }, [searchParams]);

    useEffect(() => {
        const fetchCategoriesList = async () => {
            try {
                const res = await getPublicCategories();
                if (res?.data?.categories) setCategories(res.data.categories);
                else if (res?.data) setCategories(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        fetchCategoriesList();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getAllProducts({
                search,
                category,
                sort,
                page,
                limit: 12,
            });

            if (response?.data) {
                setProducts(response.data.products || []);
                setTotalPages(response.data.totalPages || 1);
                setTotalProducts(response.data.totalProducts || 0);
            }
        } catch (error) {
            const message = error.response?.data?.message || "Unable to fetch products";
            toast.error(message);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [category, sort, page]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("");
        setSort("");
        setPage(1);
        setSearchParams({});
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Products Catalog</span>
                <h1 className="text-3xl sm:text-5xl font-black mt-2">Explore Premium Products</h1>
                <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
                    Filter by category, search by keywords, and find the perfect items for your lifestyle.
                </p>
            </div>

            {/* Search & Filter Controls */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="grid gap-4 md:grid-cols-12 items-center">
                    
                    {/* Search Field */}
                    <form onSubmit={handleSearchSubmit} className="md:col-span-6 relative">
                        <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search catalog..."
                            className="w-full pl-11 pr-24 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg transition"
                        >
                            Search
                        </button>
                    </form>

                    {/* Category Dropdown */}
                    <div className="md:col-span-3 relative">
                        <select
                            value={category}
                            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                            className="w-full py-2.5 px-4 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map((c) => (
                                <option key={c._id || c.slug} value={c.name}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="md:col-span-3">
                        <select
                            value={sort}
                            onChange={(e) => { setSort(e.target.value); setPage(1); }}
                            className="w-full py-2.5 px-4 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Sort by: Default</option>
                            <option value="lowToHigh">Price: Low to High</option>
                            <option value="highToLow">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {/* Active Filter Tags */}
                {(category || search || sort) && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap text-xs">
                        <span className="text-slate-400 font-bold">Active Filters:</span>
                        {category && (
                            <span className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                Category: {category}
                            </span>
                        )}
                        {search && (
                            <span className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                Query: "{search}"
                            </span>
                        )}
                        <button
                            onClick={clearFilters}
                            className="text-rose-600 font-bold hover:underline ml-auto flex items-center gap-1"
                        >
                            <X className="w-3.5 h-3.5" /> Clear All
                        </button>
                    </div>
                )}
            </div>

            {/* Results Count Bar */}
            <div className="flex items-center justify-between text-sm text-slate-600">
                <p>
                    Showing <span className="font-extrabold text-slate-900">{totalProducts}</span> products
                </p>
                {totalPages > 1 && (
                    <p className="font-semibold text-slate-500">
                        Page {page} of {totalPages}
                    </p>
                )}
            </div>

            {/* Products Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center my-10 max-w-lg mx-auto">
                    <Search size={40} className="mx-auto text-slate-300 mb-3" />
                    <h3 className="text-lg font-bold text-slate-900">No matching products</h3>
                    <p className="text-slate-500 text-xs mt-1">
                        Try adjusting your search keyword or clearing category filters.
                    </p>
                    <button
                        onClick={clearFilters}
                        className="mt-4 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                        Reset Catalog
                    </button>
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && products.length > 0 && totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-6">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage((prev) => prev - 1)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>

                    <span className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs">
                        {page} / {totalPages}
                    </span>

                    <button
                        disabled={page === totalPages}
                        onClick={() => setPage((prev) => prev + 1)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            )}

        </div>
    );
}

export default Products;