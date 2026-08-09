import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

// Layouts
import UserLayout from "../layout/UserLayout";
import AdminLayout from "../layout/AdminLayout";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// Auth Pages
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

// User Storefront Pages
import Home from "../pages/user/Home";
import Products from "../pages/user/product/Products";
import ProductDetails from "../pages/user/product/ProductDetails";
import Cart from "../pages/user/cart/Cart";
import Checkout from "../pages/user/checkout/Checkout";
import MyOrders from "../pages/user/order/MyOrders";
import OrderDetails from "../pages/user/order/OrderDetails";
import Profile from "../pages/user/Profile";
import Wishlist from "../pages/user/Wishlist";

// Admin Dashboard Pages
import Dashboard from "../pages/admin/dashboard/Dashboard";
import AllProducts from "../pages/admin/product/AllProduct";
import AddProduct from "../pages/admin/product/AddProduct";
import EditProduct from "../pages/admin/product/EditProduct";
import Categories from "../pages/admin/category/Categories";
import AllOrders from "../pages/admin/order/AllOrders";
import AdminOrderDetails from "../pages/admin/order/OrderDetails";
import Coupon from "../pages/admin/coupon/Coupons";
import Users from "../pages/admin/user/Users";
import Analytics from "../pages/admin/analytics/Analytics";
import Settings from "../pages/admin/settings/Settings";

// General Pages
import NotFound from "../pages/NotFound";

function RootPage() {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-800 border-t-indigo-500" />
                    <p className="mt-4 text-xs font-semibold text-slate-400">Loading LuxeMarket...</p>
                </div>
            </main>
        );
    }

    if (!user) {
        return <Login />;
    }

    // Admins go straight to the admin dashboard
    if (user.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return <Home />;
}

function AppRoutes() {
    return (
        <Routes>
            {/* Standalone Auth Routes (Full-screen ambient design) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* User Storefront Routes (Wrapped in UserLayout header/footer) */}
            <Route element={<UserLayout />}>
                <Route path="/" element={<RootPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />

                {/* Protected User Routes */}
                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute>
                            <Cart />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/wishlist"
                    element={
                        <ProtectedRoute>
                            <Wishlist />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute>
                            <MyOrders />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/order/:orderId"
                    element={
                        <ProtectedRoute>
                            <OrderDetails />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Protected Admin Routes (Wrapped in AdminLayout sidebar/topbar) */}
            <Route
                element={
                    <AdminRoute>
                        <AdminLayout />
                    </AdminRoute>
                }
            >
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/products" element={<AllProducts />} />
                <Route path="/admin/add-product" element={<AddProduct />} />
                <Route path="/admin/edit-product/:id" element={<EditProduct />} />
                <Route path="/admin/categories" element={<Categories />} />
                <Route path="/admin/orders" element={<AllOrders />} />
                <Route path="/admin/orders/:orderId" element={<AdminOrderDetails />} />
                <Route path="/admin/coupons" element={<Coupon />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                <Route path="/admin/settings" element={<Settings />} />
            </Route>

            {/* Unmatched Fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default AppRoutes;

