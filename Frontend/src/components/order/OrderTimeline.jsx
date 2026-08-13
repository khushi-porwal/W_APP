import {
    ShoppingBag,
    CreditCard,
    Package,
    Truck,
    CheckCircle,
    XCircle,
} from "lucide-react";

function OrderTimeline({ order }) {

    const currentStatus = order.status;

    const timeline = [

        {
            title: "Order Placed",
            icon: <ShoppingBag size={18} />,
            completed: true,
        },

        {
            title: "Payment Completed",
            icon: <CreditCard size={18} />,
            completed: order.paymentStatus === "Paid",
        },

        {
            title: "Processing",
            icon: <Package size={18} />,
            completed: [
                "Processing",
                "Shipped",
                "Delivered",
            ].includes(currentStatus),
        },

        {
            title: "Shipped",
            icon: <Truck size={18} />,
            completed: [
                "Shipped",
                "Delivered",
            ].includes(currentStatus),
        },

        {
            title: "Delivered",
            icon: <CheckCircle size={18} />,
            completed: currentStatus === "Delivered",
        },

    ];

    return (

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

            <h2 className="text-xl font-bold mb-6">

                Order Timeline

            </h2>

            <div className="space-y-6">

                {

                    timeline.map((step, index) => (

                        <div
                            key={index}
                            className="flex items-start gap-4"
                        >

                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center
                                ${
                                    step.completed
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-200 text-gray-500"
                                }`}
                            >

                                {step.icon}

                            </div>

                            <div className="flex-1">

                                <h3
                                    className={`font-semibold
                                    ${
                                        step.completed
                                            ? "text-black"
                                            : "text-gray-500"
                                    }`}
                                >

                                    {step.title}

                                </h3>

                            </div>

                        </div>

                    ))

                }

                {

                    currentStatus === "Cancelled" && (

                        <div className="flex items-start gap-4">

                            <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center">

                                <XCircle size={18} />

                            </div>

                            <div>

                                <h3 className="font-semibold text-red-600">

                                    Order Cancelled

                                </h3>

                            </div>

                        </div>

                    )

                }

            </div>

        </div>

    );

}

export default OrderTimeline;