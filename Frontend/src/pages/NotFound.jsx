import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
            <div className="max-w-md bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl">
                <div className="text-6xl font-black text-indigo-600 mb-2">404</div>
                <h1 className="text-2xl font-extrabold text-slate-900 mb-3">Page Not Found</h1>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                    Oops! The page you are looking for doesn't exist or has been moved to a new web address.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-indigo-700 transition shadow-md"
                    >
                        <Home className="w-4 h-4" /> Go Back Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-bold text-sm px-6 py-3 rounded-xl hover:bg-slate-200 transition"
                    >
                        <ArrowLeft className="w-4 h-4" /> Previous Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
