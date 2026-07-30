import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import RecentOrdersTable from "../../../components/admin/RecentOrdersTable";
import {
    UsersRound,
    Boxes,
    ShoppingBag,
    WalletCards,
    TrendingUp,
} from "lucide-react";
import TopCategories from "../../../components/admin/TopCategories";
import BestCustomers from "../../../components/admin/BestCustomers";
import LowStockProducts from "../../../components/admin/LowStockProducts";
import TopSellingProducts from "../../../components/admin/TopSellingProducts";
import OrderStatusChart from "../../../components/admin/OrderStatusChart";
import { getDashboardStats } from "../../../services/adminService";
import MonthlyRevenueChart from "../../../components/admin/MonthlyRevenueChart";
function Dashboard() {

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
    });

    const [loading, setLoading] = useState(true);

    const fetchDashboard = async () => {
        try {

            const response = await getDashboardStats();

            setStats(response.data);

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <h2 className="text-2xl font-semibold animate-pulse">
                    Loading Dashboard...
                </h2>
            </div>
        );
    }

    const cards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: UsersRound,
            bg: "bg-blue-100",
            iconColor: "text-blue-600",
            border: "border-blue-500",
        },
        {
            title: "Products",
            value: stats.totalProducts,
            icon: Boxes,
            bg: "bg-green-100",
            iconColor: "text-green-600",
            border: "border-green-500",
        },
        {
            title: "Orders",
            value: stats.totalOrders,
            icon: ShoppingBag,
            bg: "bg-orange-100",
            iconColor: "text-orange-600",
            border: "border-orange-500",
        },
        {
            title: "Revenue",
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: WalletCards,
            bg: "bg-purple-100",
            iconColor: "text-purple-600",
            border: "border-purple-500",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-100 p-8">

            {/* Header */}

            <div className="flex justify-between items-center mb-10">

                <div>

                    <h1 className="text-4xl font-bold">
                        Dashboard
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Welcome back, Admin 👋
                    </p>

                </div>

                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-5 py-3 rounded-full shadow">

                    <TrendingUp size={18} />

                    <span className="font-semibold">
                        Business Growing
                    </span>

                </div>

            </div>

            {/* Statistic Cards */}

<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7">

    {cards.map((card, index) => {

        const Icon = card.icon;

        return (

            <div
                key={index}
                className={`bg-white rounded-2xl border-l-4 ${card.border}
                shadow-md p-6 hover:shadow-2xl hover:-translate-y-2
                transition-all duration-300 cursor-pointer`}
            >

                <div className="flex justify-between items-center">

                    <div>

                        <p className="text-gray-500 font-medium">
                            {card.title}
                        </p>

                        <h2 className="text-4xl font-bold mt-4">
                            {card.value}
                        </h2>

                    </div>

                    <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${card.bg}`}
                    >

                        <Icon
                            className={`w-8 h-8 ${card.iconColor}`}
                        />

                    </div>

                </div>

            </div>

        );

    })}

</div>

{/* Recent Orders */}
<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

    <div className="xl:col-span-2">
        <MonthlyRevenueChart />
    </div>

    <OrderStatusChart />

</div>

<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

    <TopSellingProducts />

    <LowStockProducts />

</div>

<RecentOrdersTable />

<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

    <BestCustomers />

    <TopCategories />

</div>


        </div>
    );
}

export default Dashboard;