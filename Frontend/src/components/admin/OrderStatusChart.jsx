import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

import { getOrderStatus } from "../../services/adminService";

const COLORS = [
    "#4F46E5",
    "#22C55E",
    "#F59E0B",
    "#EF4444",
    "#06B6D4",
    "#8B5CF6",
];

function OrderStatusChart() {

    const [chartData, setChartData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await getOrderStatus();

            console.log("Full Response:", response);
            console.log("Response Data:", response.data);

            setChartData(response.data);

        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load order status."
            );
        }
    };

    useEffect(() => {

        fetchData();

    }, []);

    return (

        <div className="bg-white rounded-2xl shadow-md p-6 h-[430px]">

            <h2 className="text-xl font-bold mb-5">

                Order Status

            </h2>

            <ResponsiveContainer width="100%" height="90%">

                <PieChart>

                    <Pie
                        data={chartData}
                        dataKey="count"
                        nameKey="status"
                        outerRadius={110}
                        label
                    >

                        {
                            chartData.map((entry, index) => (

                                <Cell
                                    key={index}
                                    fill={
                                        COLORS[index % COLORS.length]
                                    }
                                />

                            ))
                        }

                    </Pie>

                    <Tooltip />

                    <Legend />

                </PieChart>

            </ResponsiveContainer>

        </div>

    );

}

export default OrderStatusChart;