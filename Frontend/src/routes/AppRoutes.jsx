import { Routes, Route } from "react-router-dom";
import Products from "../pages/user/product/Products";
import ProductDetails from "../pages/user/product/ProductDetails";
import Signup from "../pages/auth/Signup";
import MyOrders from "../pages/user/order/MyOrders";
import Login from "../pages/auth/Login";
import Cart from "../pages/user/cart/Cart";
import Home from "../pages/user/Home";
import Profile from "../pages/user/Profile";
import Checkout from "../pages/user/checkout/Checkout";
import OrderSuccess from "../pages/user/order/OrderSuccess";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/products" element={<Products />} />

      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/" element={<Home />} />
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
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />

      <Route
    path="/order-success/:orderId"
    element={
        <ProtectedRoute>
            <OrderSuccess />
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
    </Routes>
  );
}

export default AppRoutes;

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
