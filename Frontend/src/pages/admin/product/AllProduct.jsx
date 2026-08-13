import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, PackageSearch } from "lucide-react";

import {
    getAllProducts,
    deleteProduct,
} from "../../../services/productService";

function AllProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await getAllProducts();
            setProducts(response.data.products || []);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (!confirmDelete) return;
        try {
            const response = await deleteProduct(productId);
            toast.success(response.message || "Product deleted");
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete product");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">All Products</h1>
                    <p className="text-gray-500 text-sm mt-1">{products.length} products in your store</p>
                </div>
                <Link
                    to="/admin/add-product"
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                >
                    <Plus size={18} />
                    Add Product
                </Link>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full sm:w-80 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-16 text-center">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading products...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="p-16 text-center">
                        <PackageSearch size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 font-medium">No products found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-14 h-14 rounded-xl object-cover shadow-sm"
                                                />
                                                <span className="font-semibold text-gray-800 text-sm">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-700">₹{product.price?.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                                product.stock > 10 ? "bg-green-100 text-green-700" :
                                                product.stock > 0 ? "bg-yellow-100 text-yellow-700" :
                                                "bg-red-100 text-red-700"
                                            }`}>
                                                {product.stock > 0 ? `${product.stock} left` : "Out of stock"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    to={`/admin/edit-product/${product._id}`}
                                                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    <Pencil size={14} />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product._id)}
                                                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllProduct;
