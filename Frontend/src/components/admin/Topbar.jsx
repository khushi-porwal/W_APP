import {
    Bell,
    Search,
    UserCircle2,
    Menu,
} from "lucide-react";
import { BadgeCheck } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function Topbar() {

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const { user } = useContext(AuthContext);

    return (
        <header className="bg-white border-b shadow-sm">

            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">

                {/* Left Section */}
                <div className="flex items-center gap-3">

                    {/* Mobile Menu Button */}
                    <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                        <Menu size={22} />
                    </button>

                    <div>
                        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                            Admin Dashboard
                        </h1>

                        <p className="hidden sm:flex text-sm text-gray-500 mt-1">
                            {today}
                        </p>
                    </div>

                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3 sm:gap-5">

                    {/* Search */}
                    <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-56 lg:w-80">

                        <Search
                            size={18}
                            className="text-gray-500"
                        />

                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent outline-none ml-3 w-full text-sm"
                        />

                    </div>

                    {/* Mobile Search */}
                    <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
                        <Search size={20} />
                    </button>

                    {/* Notification */}
                    <button className="relative p-2 rounded-xl hover:bg-gray-100 transition">

                        <Bell size={22} />

                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>

                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center">
    <BadgeCheck
        size={24}
        className="text-indigo-600"
    />
</div>

                        <div className="hidden sm:block">

                            <h3 className="font-semibold text-gray-800 leading-5">
                                {user?.name}
                            </h3>

                            <p className="text-xs text-gray-500 truncate max-w-[180px]">
                                {user?.email}
                            </p>

                        </div>

                        <span className="hidden lg:inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                            ● Online
                        </span>

                    </div>

                </div>

            </div>

        </header>
    );
}

export default Topbar;