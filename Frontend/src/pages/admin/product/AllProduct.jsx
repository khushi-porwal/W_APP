import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/common/Navbar";
import { getAllProducts } from "../../../services/productService";

function AllProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // ==========================================
    // FETCH PRODUCTS
    // ==========================================

    const fetchProducts = async () => {
        try {
            setLoading(true);

            const response = await getAllProducts();

            console.log("Products:", response);

            setProducts(response.data.products || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-slate-100 py-10">
                <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">

                    {/* Header */}

                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">
                            All Products
                        </h1>

                        <Link
                            to="/admin/add-product"
                            className="bg-slate-900 text-white px-5 py-3 rounded-xl hover:bg-slate-800 transition"
                        >
                            + Add Product
                        </Link>
                    </div>

                    {/* Loading */}

                    {loading ? (
                        <div className="text-center py-20 text-xl font-semibold">
                            Loading Products...
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 text-lg">
                            No Products Found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full border-collapse">

                                <thead>

                                    <tr className="bg-slate-900 text-white">

                                        <th className="p-4 text-left">
                                            Image
                                        </th>

                                        <th className="p-4 text-left">
                                            Product
                                        </th>

                                        <th className="p-4 text-left">
                                            Category
                                        </th>

                                        <th className="p-4 text-left">
                                            Price
                                        </th>

                                        <th className="p-4 text-left">
                                            Stock
                                        </th>

                                        <th className="p-4 text-center">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {products.map((product) => (

                                        <tr
                                            key={product._id}
                                            className="border-b hover:bg-slate-50"
                                        >

                                            <td className="p-4">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-20 h-20 rounded-lg object-cover"
                                                />
                                            </td>

                                            <td className="p-4 font-semibold">
                                                {product.name}
                                            </td>

                                            <td className="p-4">
                                                {product.category}
                                            </td>

                                            <td className="p-4">
                                                ₹{product.price}
                                            </td>

                                            <td className="p-4">
                                                {product.stock}
                                            </td>

                                            <td className="p-4">

                                                <div className="flex justify-center gap-3">

                                                    <Link
    to={`/admin/edit-product/${product._id}`}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
>
    Edit
</Link>

                                                    <button
                                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                                    >
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
            </main>
        </>
    );
}

export default AllProduct;