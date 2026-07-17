import { Routes, Route } from "react-router-dom";
import EditProduct from "../pages/admin/product/EditProduct";
import AddProduct from "../pages/admin/product/AddProduct";
import AllProducts from "../pages/admin/product/AllProduct";
import ProtectedRoute from "./ProtectedRoute";

function AdminRoutes() {
  return (
    <Routes>
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <AllProducts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/add-product"
        element={
          <ProtectedRoute>
            <AddProduct />
          </ProtectedRoute>
        }
      />
      <Route
    path="/admin/edit-product/:id"
    element={
        <ProtectedRoute>
            <EditProduct />
        </ProtectedRoute>
    }
/>
    </Routes>
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
