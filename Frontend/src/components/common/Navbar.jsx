import {
    useContext,
    useState,
} from "react";

import {
    Link,
    NavLink,
    useNavigate,
} from "react-router-dom";

import {
    Heart,
    Menu,
    Search,
    ShoppingBag,
    User,
    X,
} from "lucide-react";

import { AuthContext } from "../../context/AuthContext";

import { CartContext } from "../../context/CartContext";

function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] =
        useState(false);

    const { user, logout } =
        useContext(AuthContext);

    const { totalItems } =
        useContext(CartContext);

    const navigate = useNavigate();

    const handleLogout = () => {
        logout();

        setMobileMenuOpen(false);

        navigate("/login");
    };

    const navLinkClass = ({ isActive }) =>
        `text-sm font-medium transition ${
            isActive
                ? "text-slate-950"
                : "text-slate-600 hover:text-slate-950"
        }`;

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold tracking-tight text-slate-950"
                >
                    ShopNest
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-8 md:flex">
                    <NavLink
                        to="/"
                        className={navLinkClass}
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/products"
                        className={navLinkClass}
                    >
                        Shop
                    </NavLink>

                    {user && (
                        <NavLink
                            to="/orders"
                            className={navLinkClass}
                        >
                            My Orders
                        </NavLink>
                    )}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden items-center gap-2 md:flex">
                    {/* Search */}
                    <button
                        type="button"
                        aria-label="Search"
                        className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                    >
                        <Search size={20} />
                    </button>

                    {user && (
                        <>
                            {/* Wishlist */}
                            <Link
                                to="/wishlist"
                                aria-label="Wishlist"
                                className="rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                            >
                                <Heart size={20} />
                            </Link>

                            {/* Cart */}
                            <Link
                                to="/cart"
                                aria-label="Cart"
                                className="relative rounded-xl p-2.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                            >
                                <ShoppingBag
                                    size={20}
                                />

                                {totalItems > 0 && (
                                    <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-slate-950 px-1 text-[10px] font-bold text-white">
                                        {totalItems > 99
                                            ? "99+"
                                            : totalItems}
                                    </span>
                                )}
                            </Link>
                        </>
                    )}

                    {/* Authentication */}
                    {user ? (
                        <div className="ml-2 flex items-center gap-3 border-l border-slate-200 pl-4">
                            {/* Profile */}
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                <User size={18} />

                                <span className="max-w-28 truncate">
                                    {user.name}
                                </span>
                            </Link>

                            {/* Logout */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="ml-2 flex items-center gap-2">
                            <Link
                                to="/login"
                                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                            >
                                Sign in
                            </Link>

                            <Link
                                to="/signup"
                                className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Create account
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    type="button"
                    onClick={() =>
                        setMobileMenuOpen(
                            (previousState) =>
                                !previousState
                        )
                    }
                    aria-label="Toggle navigation menu"
                    className="rounded-xl p-2.5 text-slate-700 transition hover:bg-slate-100 md:hidden"
                >
                    {mobileMenuOpen ? (
                        <X size={22} />
                    ) : (
                        <Menu size={22} />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="border-t border-slate-200 bg-white px-5 py-5 md:hidden">
                    <nav className="mx-auto flex max-w-7xl flex-col gap-2">
                        {/* Home */}
                        <NavLink
                            to="/"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                            className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                            Home
                        </NavLink>

                        {/* Shop */}
                        <NavLink
                            to="/products"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                            className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                            Shop
                        </NavLink>

                        {user && (
                            <>
                                {/* Wishlist */}
                                <NavLink
                                    to="/wishlist"
                                    onClick={() =>
                                        setMobileMenuOpen(
                                            false
                                        )
                                    }
                                    className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                >
                                    Wishlist
                                </NavLink>

                                {/* Cart */}
                                <NavLink
                                    to="/cart"
                                    onClick={() =>
                                        setMobileMenuOpen(
                                            false
                                        )
                                    }
                                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                >
                                    <span>
                                        Cart
                                    </span>

                                    {totalItems > 0 && (
                                        <span className="flex min-h-6 min-w-6 items-center justify-center rounded-full bg-slate-950 px-1.5 text-xs font-bold text-white">
                                            {totalItems >
                                            99
                                                ? "99+"
                                                : totalItems}
                                        </span>
                                    )}
                                </NavLink>

                                {/* Orders */}
                                <NavLink
                                    to="/orders"
                                    onClick={() =>
                                        setMobileMenuOpen(
                                            false
                                        )
                                    }
                                    className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                >
                                    My Orders
                                </NavLink>

                                {/* Profile */}
                                <NavLink
                                    to="/profile"
                                    onClick={() =>
                                        setMobileMenuOpen(
                                            false
                                        )
                                    }
                                    className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                >
                                    Profile
                                </NavLink>

                                {/* Logout */}
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="mt-3 rounded-xl bg-slate-950 px-4 py-3 text-left text-sm font-semibold text-white"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                        {!user && (
                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <Link
                                    to="/login"
                                    onClick={() =>
                                        setMobileMenuOpen(
                                            false
                                        )
                                    }
                                    className="rounded-xl border border-slate-300 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                                >
                                    Sign in
                                </Link>

                                <Link
                                    to="/signup"
                                    onClick={() =>
                                        setMobileMenuOpen(
                                            false
                                        )
                                    }
                                    className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-semibold text-white"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Navbar;