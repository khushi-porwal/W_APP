import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    ShoppingBag,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowRight,
    Sparkles,
    ShieldCheck,
    Star,
    Zap,
    Gift
} from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { loginUser, signupUser } from "../../services/authService";

function AuthContainer({ initialTab = "login" }) {
    const [activeTab, setActiveTab] = useState(initialTab); // "login" | "signup"
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const location = useLocation();
    const { login, user } = useContext(AuthContext);

    // Sync tab with initialTab prop if changed
    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    // If user is already logged in, redirect to home
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        if (tab === "login") {
            navigate("/login", { replace: true });
        } else {
            navigate("/signup", { replace: true });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (activeTab === "signup") {
            if (!formData.name.trim()) {
                toast.error("Please enter your full name");
                return;
            }
            if (!formData.email.trim()) {
                toast.error("Please enter your email address");
                return;
            }
            if (!formData.password || formData.password.length < 8) {
                toast.error("Password must be at least 8 characters");
                return;
            }

            try {
                setLoading(true);
                const response = await signupUser(formData);
                toast.success(response.message || "Account created successfully!");
                // Automatically switch to login tab with pre-filled email
                setActiveTab("login");
                navigate("/login", { replace: true });
            } catch (error) {
                const message = error.response?.data?.message || "Failed to create account";
                toast.error(message);
            } finally {
                setLoading(false);
            }
        } else {
            // Sign In
            if (!formData.email.trim()) {
                toast.error("Please enter your email address");
                return;
            }
            if (!formData.password) {
                toast.error("Please enter your password");
                return;
            }

            try {
                setLoading(true);
                const response = await loginUser({
                    email: formData.email,
                    password: formData.password,
                });

                if (response?.data?.token) {
                    login(response.data.token);
                    toast.success(response.message || "Signed in successfully!");
                    navigate("/");
                } else {
                    toast.error("Invalid response from server");
                }
            } catch (error) {
                const message = error.response?.data?.message || "Invalid credentials. Please try again.";
                toast.error(message);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
            
            {/* Ambient Animated Gradient Background Lights */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/25 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

            {/* Auth Card Container */}
            <div className="w-full max-w-5xl bg-slate-900/90 backdrop-blur-2xl border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
                
                {/* Left Side: Branding & Feature Showcase */}
                <section className="lg:col-span-5 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 relative overflow-hidden">
                    
                    {/* Decorative subtle pattern overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-5 pointer-events-none" />

                    {/* Top Logo */}
                    <div className="relative z-10">
                        <Link to="/" className="inline-flex items-center gap-3 group">
                            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-lg shadow-indigo-500/30 text-white transition group-hover:scale-105">
                                <ShoppingBag className="w-6 h-6" />
                            </div>
                            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                                LuxeMarket
                            </span>
                        </Link>
                    </div>

                    {/* Hero Text & Value Highlights */}
                    <div className="my-10 space-y-8 relative z-10">
                        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-300 backdrop-blur-md">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Premium Shopping Experience
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white">
                            Your Gateway to <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">Curated Luxury.</span>
                        </h1>

                        <p className="text-slate-400 text-sm leading-relaxed">
                            Sign in or create your account to unlock personalized deals, saved wishlist items, and seamless order tracking.
                        </p>

                        {/* Feature Badges */}
                        <div className="space-y-4 pt-2">
                            <div className="flex items-start gap-3 text-slate-300 text-xs sm:text-sm font-medium">
                                <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg shrink-0 mt-0.5">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <div>
                                    <strong className="text-white font-semibold block">Instant 1-Click Access</strong>
                                    Fast checkout & synced cart across all your devices.
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-slate-300 text-xs sm:text-sm font-medium">
                                <div className="p-1.5 bg-purple-500/20 text-purple-400 rounded-lg shrink-0 mt-0.5">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <strong className="text-white font-semibold block">Bank-Grade Security</strong>
                                    Encrypted sessions and 100% safe checkout protection.
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-slate-300 text-xs sm:text-sm font-medium">
                                <div className="p-1.5 bg-pink-500/20 text-pink-400 rounded-lg shrink-0 mt-0.5">
                                    <Gift className="w-4 h-4" />
                                </div>
                                <div>
                                    <strong className="text-white font-semibold block">Exclusive Member Perks</strong>
                                    Unlock 10% OFF coupon code <code className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-pink-300">WELCOME10</code> on signup.
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Proof Quote Card */}
                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl relative z-10 backdrop-blur-md">
                        <div className="flex items-center gap-1 text-amber-400 mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                            <span className="text-xs font-bold text-slate-300 ml-1">5.0 Star Rating</span>
                        </div>
                        <p className="text-xs text-slate-300 italic">
                            "LuxeMarket offers the smoothest checkout and highest quality products!"
                        </p>
                        <p className="text-[11px] text-slate-500 mt-2 font-medium">
                            Joined by 50,000+ happy shoppers worldwide
                        </p>
                    </div>

                </section>

                {/* Right Side: Authentication Form */}
                <section className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between bg-slate-900/40">
                    <div>
                        
                        {/* Tab Switcher Bar */}
                        <div className="bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800/80 grid grid-cols-2 gap-1 mb-8">
                            <button
                                type="button"
                                onClick={() => handleTabSwitch("login")}
                                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center gap-2 ${
                                    activeTab === "login"
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30"
                                        : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                                }`}
                            >
                                Sign In
                            </button>

                            <button
                                type="button"
                                onClick={() => handleTabSwitch("signup")}
                                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-200 flex items-center justify-center gap-2 ${
                                    activeTab === "signup"
                                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30"
                                        : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                                }`}
                            >
                                Create Account
                            </button>
                        </div>

                        {/* Form Title */}
                        <div className="mb-8">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                {activeTab === "login" ? "Welcome Back 👋" : "Create Your Account ✨"}
                            </h2>
                            <p className="text-slate-400 text-sm mt-2">
                                {activeTab === "login"
                                    ? "Enter your credentials to manage orders & access your account."
                                    : "Fill in your details below to get started with LuxeMarket."}
                            </p>
                        </div>

                        {/* Form Fields */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            
                            {/* Full Name field (Sign Up only) */}
                            {activeTab === "signup" && (
                                <div className="space-y-1.5">
                                    <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            autoComplete="name"
                                            className="w-full pl-12 pr-4 py-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email Address field */}
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password field */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Password
                                    </label>
                                    {activeTab === "login" && (
                                        <span className="text-xs font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer">
                                            Forgot password?
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder={activeTab === "signup" ? "Minimum 8 characters" : "••••••••"}
                                        autoComplete={activeTab === "signup" ? "new-password" : "current-password"}
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition"
                                        title={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {activeTab === "signup" && (
                                    <p className="text-[11px] text-slate-500 mt-1">
                                        Must be at least 8 characters long.
                                    </p>
                                )}
                            </div>

                            {/* Quick Demo Credentials helper */}
                            {activeTab === "login" && (
                                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 space-y-2">
                                    <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                                        <span>🔑 Demo Account Credentials:</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ email: "admin@example.com", password: "admin1234" })}
                                            className="px-3 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-xs transition flex items-center gap-1.5 text-left"
                                        >
                                            👑 Admin Login
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ email: "user@example.com", password: "user1234" })}
                                            className="px-3 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-xs transition flex items-center gap-1.5 text-left"
                                        >
                                            👤 Customer Login
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>{activeTab === "signup" ? "Creating Account..." : "Signing In..."}</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>{activeTab === "signup" ? "Create Account" : "Sign In"}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                        </form>
                    </div>

                    {/* Footer Links & Guest Mode */}
                    <div className="pt-8 border-t border-slate-800/80 text-center space-y-3">
                        <p className="text-slate-400 text-xs">
                            {activeTab === "login" ? (
                                <>
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => handleTabSwitch("signup")}
                                        className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                                    >
                                        Create one now
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => handleTabSwitch("login")}
                                        className="font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                                    >
                                        Sign in instead
                                    </button>
                                </>
                            )}
                        </p>

                        <div>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-300 transition"
                            >
                                Continue as Guest to explore catalog <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>

                </section>
            </div>
        </main>
    );
}

export default AuthContainer;
