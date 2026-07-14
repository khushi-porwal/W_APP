import {
    ChevronLeft,
    ChevronRight,
    Search,
    SlidersHorizontal,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import toast from "react-hot-toast";

import Navbar from "../../../components/common/Navbar";
import ProductCard from "../../../components/product/ProductCard";

import { getAllProducts } from "../../../services/productService";

function Products() {
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");

    const [sort, setSort] = useState("");

    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    const [totalProducts, setTotalProducts] = useState(0);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const response = await getAllProducts({
                search,
                category,
                sort,
                page,
                limit: 8,
            });

            setProducts(response.data.products);

            setTotalPages(response.data.totalPages);

            setTotalProducts(response.data.totalProducts);
        } catch (error) {
            const message =
                error.response?.data?.message ||
                "Unable to fetch products";

            toast.error(message);

            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [category, sort, page]);

    const handleSearch = (e) => {
        e.preventDefault();

        setPage(1);

        fetchProducts();
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);

        setPage(1);
    };

    const handleSortChange = (e) => {
        setSort(e.target.value);

        setPage(1);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main>
                {/* Shop Header */}
                <section className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-18">
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                            Shop
                        </p>

                        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                            Discover our collection
                        </h1>

                        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                            Browse products, explore categories and find
                            something worth adding to your everyday.
                        </p>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10">
                    {/* Search + Filters */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
                            {/* Search */}
                            <form
                                onSubmit={handleSearch}
                                className="relative"
                            >
                                <Search
                                    size={19}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                    placeholder="Search products..."
                                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-24 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
                                />

                                <button
                                    type="submit"
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                                >
                                    Search
                                </button>
                            </form>

                            {/* Category */}
                            <div className="relative">
                                <SlidersHorizontal
                                    size={17}
                                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <select
                                    value={category}
                                    onChange={handleCategoryChange}
                                    className="w-full min-w-48 appearance-none rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
                                >
                                    <option value="">
                                        All categories
                                    </option>

                                    <option value="Electronics">
                                        Electronics
                                    </option>

                                    <option value="Fashion">
                                        Fashion
                                    </option>

                                    <option value="Home">
                                        Home
                                    </option>

                                    <option value="Beauty">
                                        Beauty
                                    </option>
                                </select>
                            </div>

                            {/* Sort */}
                            <select
                                value={sort}
                                onChange={handleSortChange}
                                className="w-full min-w-48 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
                            >
                                <option value="">
                                    Sort by
                                </option>

                                <option value="lowToHigh">
                                    Price: Low to high
                                </option>

                                <option value="highToLow">
                                    Price: High to low
                                </option>
                            </select>
                        </div>
                    </div>

                    {/* Result Count */}
                    <div className="mt-8 flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                            <span className="font-semibold text-slate-950">
                                {totalProducts}
                            </span>{" "}
                            products found
                        </p>

                        {totalPages > 1 && (
                            <p className="text-sm text-slate-500">
                                Page {page} of {totalPages}
                            </p>
                        )}
                    </div>

                    {/* Products */}
                    {loading ? (
                        <ProductSkeleton />
                    ) : products.length > 0 ? (
                        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
                            <Search
                                size={32}
                                className="mx-auto text-slate-400"
                            />

                            <h2 className="mt-5 text-xl font-semibold text-slate-950">
                                No products found
                            </h2>

                            <p className="mt-2 text-sm text-slate-600">
                                Try changing your search or filters.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {!loading &&
                        products.length > 0 &&
                        totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-3">
                                <button
                                    type="button"
                                    disabled={page === 1}
                                    onClick={() =>
                                        setPage(
                                            (previousPage) =>
                                                previousPage - 1
                                        )
                                    }
                                    className="flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft size={18} />

                                    Previous
                                </button>

                                <div className="flex h-11 min-w-11 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white">
                                    {page}
                                </div>

                                <button
                                    type="button"
                                    disabled={page === totalPages}
                                    onClick={() =>
                                        setPage(
                                            (previousPage) =>
                                                previousPage + 1
                                        )
                                    }
                                    className="flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Next

                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}
                </section>
            </main>
        </div>
    );
}

function ProductSkeleton() {
    return (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
                <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                >
                    <div className="aspect-square animate-pulse bg-slate-200" />

                    <div className="p-5">
                        <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />

                        <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-100" />

                        <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-100" />

                        <div className="mt-6 h-6 w-24 animate-pulse rounded bg-slate-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Products;


// Interview mein bolna:

// “The frontend sends filter, sorting and pagination values as 
// query parameters, while MongoDB handles filtering, sorting and 
// pagination on the backend.”