import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ChatbotWidget from "../components/chat/ChatbotWidget";

const UserLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans antialiased relative">
            <Navbar />
            <main className="flex-grow pt-20">
                <Outlet />
            </main>
            <Footer />
            <ChatbotWidget />
        </div>
    );
};

export default UserLayout;
