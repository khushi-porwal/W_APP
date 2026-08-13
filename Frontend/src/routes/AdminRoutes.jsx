import { Routes, Route } from "react-router-dom";

import AdminRoute from "./AdminRoute";
import AdminLayout from "../layout/AdminLayout";

import Dashboard from "../pages/admin/dashboard/Dashboard";

import Coupon from "../pages/admin/coupon/Coupons";
import AllProducts from "../pages/admin/product/AllProduct";
import AddProduct from "../pages/admin/product/AddProduct";
import EditProduct from "../pages/admin/product/EditProduct";

import AllOrders from "../pages/admin/order/AllOrders";
import OrderDetails from "../pages/admin/order/OrderDetails";

import Categories from "../pages/admin/category/Categories";

function AdminRoutes() {
  return (
    <>
      <Routes>
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          {/* Dashboard */}

          <Route path="/admin/dashboard" element={<Dashboard />} />

          {/* Products */}

          <Route path="/admin/products" element={<AllProducts />} />
          <Route path="/admin/products/:id" element={<EditProduct />} />

          <Route path="/admin/add-product" element={<AddProduct />} />

          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />

          {/* Orders */}

          <Route path="/admin/orders" element={<AllOrders />} />

          <Route path="/admin/orders/:orderId" element={<OrderDetails />} />

          <Route path="/admin/coupons" element={<Coupon />} />
        </Route>
      </Routes>
    </>
  );
}

export default AdminRoutes;

// Interview mein ProtectedRoute ka answer

// “I created a ProtectedRoute component that checks
// authentication state from AuthContext. While the profile
// is being restored, it shows a loading state. If the user
// is unauthenticated, it redirects to login; otherwise,
// it renders the protected component.”

// Ek aur important question:

// Is ProtectedRoute enough for security?

// Answer:

// “No. ProtectedRoute only controls frontend navigation
// and improves user experience. Actual authorization is
// enforced on the backend using JWT authentication middleware.”

// Interview answer

// useParams is used to access dynamic URL parameters
// from the current route.
