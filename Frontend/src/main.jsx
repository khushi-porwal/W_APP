import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import { BrowserRouter } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import App from "./App";

import AuthProvider from "./context/AuthContext";

import { CartProvider } from "./context/CartContext";

import { WishlistProvider } from "./context/WishlistContext";

import "./index.css";


createRoot(
    document.getElementById("root")
).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <WishlistProvider>
                        <App />
                    </WishlistProvider>
                </CartProvider>
            </AuthProvider>

            <Toaster position="top-right" />
        </BrowserRouter>
    </StrictMode>
);