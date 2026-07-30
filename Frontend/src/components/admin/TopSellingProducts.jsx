import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { getTopSellingProducts } from "../../services/adminService";

function TopSellingProducts() {

    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {

        try {

           const response = await getTopSellingProducts();

console.log("Top Selling Products Response:", response);
console.log("Products:", response.data);

setProducts(response.data);
        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch top selling products."
            );

        }

    };

    useEffect(() => {

        fetchProducts();

    }, []);

    return (

        <div className="bg-white rounded-2xl shadow-md p-6">

            <h2 className="text-xl font-bold mb-5">

                🏆 Top Selling Products

            </h2>

            {
                products.length === 0 ? (

                    <p className="text-gray-500">

                        No sales data available.

                    </p>

                ) : (

                    <div className="space-y-4">

                        {
                            products.map((product, index) => (

                                <div
                                    key={index}
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

                                                ₹{product.price.toLocaleString()}

                                            </p>

                                        </div>

                                    </div>

                                    <div className="text-right">

                                        <p className="font-bold text-indigo-600">

                                            {product.totalSold} Sold

                                        </p>

                                    </div>

                                </div>

                            ))
                        }

                    </div>

                )
            }

        </div>

    );

}

export default TopSellingProducts;