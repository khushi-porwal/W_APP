import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Mail, Phone, MapPin, Heart, ShieldCheck, Truck, RefreshCw, CreditCard } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Features Highlights Bar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-center md:text-left">
                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-800/50 backdrop-blur border border-slate-800">
                        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-sm">Free Express Shipping</h4>
                            <p className="text-xs text-slate-400">On all orders above ₹999</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-800/50 backdrop-blur border border-slate-800">
                        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-sm">100% Secure Payment</h4>
                            <p className="text-xs text-slate-400">Razorpay & Encrypted SSL</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-800/50 backdrop-blur border border-slate-800">
                        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                            <RefreshCw className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-sm">7-Day Easy Returns</h4>
                            <p className="text-xs text-slate-400">Hassle-free replacement policy</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-slate-800/50 backdrop-blur border border-slate-800">
                        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-white font-semibold text-sm">Instant Refunds</h4>
                            <p className="text-xs text-slate-400">Directly into your original method</p>
                        </div>
                    </div>
                </div>

                {/* Footer Main Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12">
                    
                    {/* Brand & Bio */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link to="/" className="flex items-center space-x-2 text-2xl font-extrabold text-white">
                            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg text-white">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <span className="bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                                LuxeMarket
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                            Your premier destination for curated fashion, high-tech electronics, modern home decor, and luxury lifestyle accessories. Experience quality crafted for your lifestyle.
                        </p>
                        <div className="pt-2 flex items-center space-x-3 text-slate-400 text-xs">
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-indigo-400" /> New Delhi, India</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Phone className="w-4 h-4 text-indigo-400" /> +91 98765 43210</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-3">
                        <h3 className="text-white font-bold text-sm tracking-wider uppercase">Shop Categories</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/products?category=Electronics" className="hover:text-indigo-400 transition-colors">Electronics & Tech</Link></li>
                            <li><Link to="/products?category=Fashion" className="hover:text-indigo-400 transition-colors">Fashion & Apparel</Link></li>
                            <li><Link to="/products?category=Home+%26+Living" className="hover:text-indigo-400 transition-colors">Home & Living</Link></li>
                            <li><Link to="/products?category=Beauty+%26+Accessories" className="hover:text-indigo-400 transition-colors">Beauty & Accessories</Link></li>
                            <li><Link to="/products" className="hover:text-indigo-400 transition-colors">Browse All Products</Link></li>
                        </ul>
                    </div>

                    {/* Customer Account */}
                    <div className="space-y-3">
                        <h3 className="text-white font-bold text-sm tracking-wider uppercase">Account & Support</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/profile" className="hover:text-indigo-400 transition-colors">My Account</Link></li>
                            <li><Link to="/orders" className="hover:text-indigo-400 transition-colors">Track Orders</Link></li>
                            <li><Link to="/cart" className="hover:text-indigo-400 transition-colors">Shopping Cart</Link></li>
                            <li><Link to="/wishlist" className="hover:text-indigo-400 transition-colors">My Wishlist</Link></li>
                            <li><Link to="/admin/dashboard" className="hover:text-indigo-400 transition-colors text-indigo-400 font-medium">Admin Portal</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Subscription */}
                    <div className="space-y-3">
                        <h3 className="text-white font-bold text-sm tracking-wider uppercase">Stay in the Loop</h3>
                        <p className="text-xs text-slate-400">Subscribe to receive exclusive deals, new arrivals, and coupon codes directly in your inbox.</p>
                        <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed successfully!"); }} className="space-y-2">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    className="w-full pl-3 pr-10 py-2 text-sm rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                                />
                                <button type="submit" className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md transition-colors">
                                    Join
                                </button>
                            </div>
                        </form>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                    <p>© {new Date().getFullYear()} LuxeMarket Inc. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for an exceptional shopping experience.
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
