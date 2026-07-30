import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AdminRoute({ children }) {

    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    console.log("User:", user);
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Only admin can access
    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;