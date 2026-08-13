import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { getLowStockProducts } from "../../services/adminService";

function LowStockProducts() {

    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {

        try {

            const response = await getLowStockProducts();

            setProducts(response.data.products);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch low stock products."
            );

        }

    };

    useEffect(() => {

        fetchProducts();

    }, []);

    return (

        <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-xl font-bold mb-5">

                ⚠️ Low Stock Products

            </h2>

            {
                products.length === 0 ? (

                    <p className="text-gray-500">

                        No low stock products.

                    </p>

                ) : (

                    <div className="space-y-4">

                        {
                            products.map((product) => (

                                <div
                                    key={product._id}
                                    className="flex items-center justify-between border-b pb-3"
                                >

                                    <div className="flex items-center gap-4">

                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-14 h-14 rounded-lg object-cover border"
                                        />

                                        <div>

                                            <h3 className="font-semibold">

                                                {product.name}

                                            </h3>

                                            <p className="text-sm text-gray-500">

                                                {product.category}

                                            </p>

                                        </div>

                                    </div>

                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                            product.stock <= 2
                                                ? "bg-red-100 text-red-600"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {product.stock} Left
                                    </span>

                                </div>

                            ))
                        }

                    </div>

                )
            }

        </div>

    );

}

export default LowStockProducts;