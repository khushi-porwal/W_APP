import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import { getMonthlyRevenue } from "../../services/adminService";

function MonthlyRevenueChart() {

    const [chartData, setChartData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRevenue = async () => {

        try {

            const response = await getMonthlyRevenue();

            console.log(response);

            setChartData(response.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load revenue chart."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchRevenue();
    }, []);

    if (loading) {

        return (

            <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

                Loading Revenue...

            </div>

        );

    }

    return (

        <div className="bg-white rounded-2xl shadow-md p-6 mt-8">

            <h2 className="text-xl font-bold mb-6">

                Monthly Revenue

            </h2>

            <ResponsiveContainer
                width="100%"
                height={350}
            >

                <LineChart data={chartData}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#4F46E5"
                        strokeWidth={3}
                    />

                </LineChart>

            </ResponsiveContainer>

        </div>

    );

}

export default MonthlyRevenueChart;