import {
    createContext,
    useEffect,
    useState,
} from "react";

import api from "../services/api";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const fetchProfile = async () => {
        try {
            const response = await api.get("/profile");

            setUser(response.data.data);
        } catch (error) {
            localStorage.removeItem("token");

            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem(
            "token",
            token
        );

        fetchProfile();
    };

    const logout = () => {
        localStorage.removeItem("token");

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;