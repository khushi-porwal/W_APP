import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const UserLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans antialiased">
            <Navbar />
            <main className="flex-grow pt-20">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default UserLayout;
