import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, Menu, Search, ShoppingBag, User, X, Shield, LogOut } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { user, logout } = useContext(AuthContext);
    const { totalItems } = useContext(CartContext);
    const { wishlistCount } = useWishlist();

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        navigate("/login");
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery("");
        }
    };

    const navLinkClass = ({ isActive }) =>
        `text-sm font-semibold transition-colors duration-200 ${
            isActive
                ? "text-indigo-600 border-b-2 border-indigo-600 pb-1"
                : "text-slate-600 hover:text-indigo-600 pb-1"
        }`;

    // ─── Admin Topbar ─────────────────────────────────────────────────────────────
    // When the user is an admin, show a minimal admin-only bar.
    // Admins should manage the store via the admin dashboard, not the storefront.
    if (user?.role === "admin") {
        return (
            <header className="sticky top-0 z-50 border-b border-indigo-200/80 bg-white/95 backdrop-blur-md shadow-sm">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                    {/* Logo */}
                    <Link to="/admin/dashboard" className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900">
                        <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-md text-white">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent font-extrabold">
                            LuxeMarket
                        </span>
                        <span className="ml-1 text-xs font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200">
                            Admin
                        </span>
                    </Link>

                    {/* Admin Actions */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/admin/dashboard"
                            className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Shield className="w-3.5 h-3.5" />
                            Go to Dashboard
                        </Link>

                        <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                                    {user.name ? user.name[0].toUpperCase() : "A"}
                                </div>
                                <span className="text-sm font-semibold text-slate-700 max-w-28 truncate hidden sm:block">
                                    {user.name}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={handleLogout}
                                title="Logout"
                                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        );
    }

    // ─── Regular User Navbar ──────────────────────────────────────────────────────
    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-md shadow-xs">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                    <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl shadow-md text-white">
                        <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent font-extrabold">
                        LuxeMarket
                    </span>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden items-center gap-8 md:flex">
                    <NavLink to="/" className={navLinkClass}>
                        Home
                    </NavLink>
                    <NavLink to="/products" className={navLinkClass}>
                        Catalog
                    </NavLink>
                    {user && (
                        <NavLink to="/orders" className={navLinkClass}>
                            My Orders
                        </NavLink>
                    )}
                </nav>

                {/* Desktop Search & User Actions */}
                <div className="hidden items-center gap-3 md:flex">
                    
                    {/* Inline Search Bar */}
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-48 lg:w-64 pl-9 pr-4 py-2 text-xs font-medium bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    </form>

                    {/* Wishlist Icon */}
                    <Link
                        to="/wishlist"
                        aria-label="Wishlist"
                        className="relative rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
                    >
                        <Heart className="w-5 h-5" />
                        {wishlistCount > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs">
                                {wishlistCount > 99 ? "99+" : wishlistCount}
                            </span>
                        )}
                    </Link>

                    {/* Cart Icon */}
                    <Link
                        to="/cart"
                        aria-label="Cart"
                        className="relative rounded-full p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-indigo-600"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        {totalItems > 0 && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shadow-xs">
                                {totalItems > 99 ? "99+" : totalItems}
                            </span>
                        )}
                    </Link>

                    {/* Auth Status / Profile */}
                    {user ? (
                        <div className="ml-2 flex items-center gap-2 border-l border-slate-200 pl-4">
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                                    {user.name ? user.name[0].toUpperCase() : "U"}
                                </div>
                                <span className="max-w-28 truncate">{user.name}</span>
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                title="Logout"
                                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="ml-2 flex items-center gap-2">
                            <Link
                                to="/login"
                                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                            >
                                Sign in
                            </Link>

                            <Link
                                to="/signup"
                                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu & Search Actions */}
                <div className="flex items-center gap-2 md:hidden">
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    
                    <Link to="/cart" className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                        <ShoppingBag className="w-5 h-5" />
                        {totalItems > 0 && (
                            <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {searchOpen && (
                <div className="p-3 bg-slate-50 border-b border-slate-200 md:hidden">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            type="text"
                            placeholder="Search catalog..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </form>
                </div>
            )}

            {/* Mobile Dropdown Menu */}
            {mobileMenuOpen && (
                <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden space-y-2">
                    <NavLink
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/products"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                        Catalog
                    </NavLink>

                    {user && (
                        <>
                            <NavLink
                                to="/wishlist"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center justify-between rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50"
                            >
                                <span>Wishlist</span>
                                {wishlistCount > 0 && (
                                    <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                                        {wishlistCount}
                                    </span>
                                )}
                            </NavLink>

                            <NavLink
                                to="/orders"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50"
                            >
                                My Orders
                            </NavLink>

                            <NavLink
                                to="/profile"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-indigo-50"
                            >
                                Profile ({user.name})
                            </NavLink>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full text-left rounded-lg px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                            >
                                Logout
                            </button>
                        </>
                    )}

                    {!user && (
                        <div className="pt-2 grid grid-cols-2 gap-2">
                            <Link
                                to="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-lg border border-slate-300 px-4 py-2 text-center text-xs font-bold text-slate-700"
                            >
                                Sign in
                            </Link>

                            <Link
                                to="/signup"
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-lg bg-indigo-600 px-4 py-2 text-center text-xs font-bold text-white shadow-sm"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}

export default Navbar;