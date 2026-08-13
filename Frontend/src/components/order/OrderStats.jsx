import {
    Package,
    ShoppingCart,
    Wallet,
    IndianRupee,
} from "lucide-react";

function OrderStats({ order }) {

    const totalItems = order.items?.length || 0;

    const totalQuantity =
        order.items?.reduce(
            (total, item) => total + item.quantity,
            0
        ) || 0;

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

            {/* Total Products */}

            <div className="bg-white rounded-xl shadow-md p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-gray-500">

                            Total Products

                        </p>

                        <h2 className="text-3xl font-bold mt-2">

                            {totalItems}

                        </h2>

                    </div>

                    <Package
                        className="text-indigo-600"
                        size={40}
                    />

                </div>

            </div>

            {/* Quantity */}

            <div className="bg-white rounded-xl shadow-md p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-gray-500">

                            Total Quantity

                        </p>

                        <h2 className="text-3xl font-bold mt-2">

                            {totalQuantity}

                        </h2>

                    </div>

                    <ShoppingCart
                        className="text-green-600"
                        size={40}
                    />

                </div>

            </div>

            {/* Original Amount */}

            <div className="bg-white rounded-xl shadow-md p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-gray-500">

                            Original Amount

                        </p>

                        <h2 className="text-3xl font-bold mt-2">

                            ₹{order.originalAmount}

                        </h2>

                    </div>

                    <IndianRupee
                        className="text-orange-600"
                        size={40}
                    />

                </div>

            </div>

            {/* Total Paid */}

            <div className="bg-white rounded-xl shadow-md p-6">

                <div className="flex items-center justify-between">

                    <div>

                        <p className="text-gray-500">

                            Total Paid

                        </p>

                        <h2 className="text-3xl font-bold mt-2 text-indigo-600">

                            ₹{order.totalAmount}

                        </h2>

                    </div>

                    <Wallet
                        className="text-purple-600"
                        size={40}
                    />

                </div>

            </div>

        </div>

    );

}

export default OrderStats;