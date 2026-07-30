import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Crown } from "lucide-react";

import { getBestCustomers } from "../../services/adminService";

function BestCustomers() {

    const [customers, setCustomers] = useState([]);

    const fetchCustomers = async () => {

        try {

            const response = await getBestCustomers();

            setCustomers(response.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to fetch customers."
            );

        }

    };

    useEffect(() => {

        fetchCustomers();

    }, []);

    return (

        <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="flex items-center gap-2 mb-5">

                <Crown className="text-yellow-500" />

                <h2 className="text-xl font-bold">

                    Best Customers

                </h2>

            </div>

            {
                customers.length === 0 ? (

                    <p className="text-gray-500">

                        No customers found.

                    </p>

                ) : (

                    <div className="space-y-4">

                        {
                            customers.map((customer) => (

                                <div
                                    key={customer._id}
                                    className="flex items-center justify-between border-b pb-3"
                                >

                                    <div>

                                        <h3 className="font-semibold">

                                            {customer.name}

                                        </h3>

                                        <p className="text-sm text-gray-500">

                                            {customer.email}

                                        </p>

                                    </div>

                                    <div className="text-right">

                                        <p className="font-bold text-green-600">

                                            ₹{customer.totalSpent}

                                        </p>

                                        <p className="text-sm text-gray-500">

                                            {customer.totalOrders} Orders

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

export default BestCustomers;