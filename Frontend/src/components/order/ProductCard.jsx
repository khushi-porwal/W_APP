import { Package, Eye } from "lucide-react";
import { Link } from "react-router-dom";

function ProductCard({ order }) {

    return (

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            {/* Header */}

            <div className="flex items-center gap-3 mb-6">

                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">

                    <Package
                        className="text-indigo-600"
                        size={24}
                    />

                </div>

                <div>

                    <h2 className="text-xl font-bold">

                        Ordered Products

                    </h2>

                    <p className="text-gray-500 text-sm">

                        {order.items?.length || 0} Product(s)

                    </p>

                </div>

            </div>

            {/* Products */}

            <div className="space-y-5">

                {

                    order.items?.map((item) => (

                        <div
                            key={item._id}
                            className="border rounded-xl p-5 hover:shadow-lg transition-all duration-300"
                        >

                            <div className="flex flex-col lg:flex-row justify-between gap-6">

                                {/* Left */}

                                <div className="flex gap-5">

                                    <img
                                        src={item.product?.image}
                                        alt={item.product?.name}
                                        className="w-28 h-28 rounded-xl object-cover border"
                                    />

                                    <div>

                                        <h3 className="text-xl font-semibold">

                                            {item.product?.name}

                                        </h3>

                                        <p className="text-gray-500 mt-1">

                                            {item.product?.category}

                                        </p>

                                        <div className="grid grid-cols-2 gap-6 mt-5">

                                            <div>

                                                <p className="text-gray-500 text-sm">

                                                    Quantity

                                                </p>

                                                <h4 className="font-semibold">

                                                    {item.quantity}

                                                </h4>

                                            </div>

                                            <div>

                                                <p className="text-gray-500 text-sm">

                                                    Unit Price

                                                </p>

                                                <h4 className="font-semibold">

                                                    ₹{item.price}

                                                </h4>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* Right */}

                                <div className="flex flex-col justify-between items-end">

                                    <div>

                                        <p className="text-gray-500 text-sm">

                                            Total

                                        </p>

                                        <h2 className="text-3xl font-bold text-indigo-600">

                                            ₹{item.quantity * item.price}

                                        </h2>

                                    </div>

                                    <Link
                                        to={`/admin/products/${item.product?._id}`}
                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
                                    >

                                        <Eye size={18} />

                                        View Product

                                    </Link>

                                </div>

                            </div>

                        </div>

                    ))

                }

            </div>

        </div>

    );

}

export default ProductCard;