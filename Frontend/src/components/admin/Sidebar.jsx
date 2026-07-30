import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Tags,
    TicketPercent,
    BarChart3,
    Settings,
    LogOut,
} from "lucide-react";

const menuItems = [
    {
        title: "Dashboard",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Products",
        path: "/admin/products",
        icon: Package,
    },
    {
        title: "Orders",
        path: "/admin/orders",
        icon: ShoppingCart,
    },
    {
        title: "Users",
        path: "/admin/users",
        icon: Users,
    },
    {
        title: "Categories",
        path: "/admin/categories",
        icon: Tags,
    },
    {
        title: "Coupons",
        path: "/admin/coupons",
        icon: TicketPercent,
    },
    {
        title: "Analytics",
        path: "/admin/analytics",
        icon: BarChart3,
    },
    {
        title: "Settings",
        path: "/admin/settings",
        icon: Settings,
    },
];

function Sidebar() {

    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (

        <aside
    className="
        fixed
        top-0
        left-0
        w-72
        h-screen
        bg-slate-900
        text-white
        flex
        flex-col
        shadow-2xl
        z-50
    "
>

            {/* Logo & User */}

            <div className="border-b border-slate-800 px-6 py-8">

                <div className="flex flex-col items-center">

                    {user?.profileImage ? (

                        <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
                        />

                    ) : (

                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center text-3xl font-bold shadow-lg">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>

                    )}

                    <h2 className="mt-5 text-lg font-semibold">
                        {user?.name}
                    </h2>

                    <p className="text-sm text-slate-400 truncate max-w-[220px]">
                        {user?.email}
                    </p>

                    <span className="mt-4 flex items-center gap-2 rounded-full bg-green-600/20 text-green-400 px-3 py-1 text-xs font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        Online
                    </span>

                </div>

            </div>

            {/* Navigation */}

            <nav className="flex-1 overflow-y-auto px-4 py-6">

                <ul className="space-y-2">

                    {menuItems.map((item) => {

                        const Icon = item.icon;

                        return (

                            <li key={item.title}>

                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300
                                        ${
                                            isActive
                                                ? "bg-indigo-600 text-white shadow-lg border-l-4 border-white"
                                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                        }`
                                    }
                                >

                                    <Icon
                                        size={21}
                                        className="transition-transform duration-300 group-hover:scale-110"
                                    />

                                    <span className="font-medium">
                                        {item.title}
                                    </span>

                                </NavLink>

                            </li>

                        );

                    })}

                </ul>

            </nav>

            {/* Logout */}

            <div className="border-t border-slate-800 p-5">

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-3 rounded-xl bg-red-500 px-4 py-3 font-medium transition-all duration-300 hover:bg-red-600 hover:shadow-lg"
                >

                    <LogOut size={20} />

                    Logout

                </button>

            </div>

        </aside>

    );
}

export default Sidebar;