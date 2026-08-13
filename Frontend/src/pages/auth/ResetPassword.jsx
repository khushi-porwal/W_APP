import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ShoppingBag, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { resetPassword } from "../../services/authService";

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const getPasswordStrength = (pwd) => {
        if (!pwd) return null;
        if (pwd.length < 6) return { label: "Weak", color: "bg-red-500", width: "w-1/4" };
        if (pwd.length < 8) return { label: "Fair", color: "bg-orange-500", width: "w-2/4" };
        if (pwd.length < 12 || !/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd))
            return { label: "Good", color: "bg-yellow-500", width: "w-3/4" };
        return { label: "Strong", color: "bg-green-500", width: "w-full" };
    };

    const strength = getPasswordStrength(password);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password) {
            toast.error("Please enter a new password");
            return;
        }
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            await resetPassword(token, password, confirmPassword);
            setSuccess(true);
            toast.success("Password reset successfully!");
        } catch (error) {
            const message = error.response?.data?.message || "Reset link is invalid or has expired.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">

            {/* Ambient background lights */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/25 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-slate-800/80 rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10">

                {/* Logo */}
                <Link to="/" className="inline-flex items-center gap-3 group mb-8">
                    <div className="p-2.5 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 rounded-2xl shadow-lg shadow-indigo-500/30 text-white transition group-hover:scale-105">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                        LuxeMarket
                    </span>
                </Link>

                {!success ? (
                    <>
                        {/* Header */}
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-300 mb-4">
                                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                                Secure Password Reset
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Set a new password
                            </h1>
                            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                                Create a strong password with at least <strong className="text-slate-300">8 characters</strong>.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">

                            {/* New Password */}
                            <div className="space-y-1.5">
                                <label htmlFor="new-password" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
                                    <input
                                        id="new-password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Minimum 8 characters"
                                        autoComplete="new-password"
                                        className="w-full pl-12 pr-12 py-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>

                                {/* Password strength meter */}
                                {password && (
                                    <div className="space-y-1 pt-1">
                                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-300 ${strength?.color} ${strength?.width}`} />
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            Strength: <span className="font-semibold text-slate-300">{strength?.label}</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <label htmlFor="confirm-password" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
                                    <input
                                        id="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat your new password"
                                        autoComplete="new-password"
                                        className={`w-full pl-12 pr-12 py-3.5 bg-slate-950/70 border rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                                            confirmPassword && confirmPassword !== password
                                                ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                                                : confirmPassword && confirmPassword === password
                                                    ? "border-green-500/60 focus:border-green-500 focus:ring-green-500/20"
                                                    : "border-slate-800 focus:border-indigo-500 focus:ring-indigo-500/20"
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-3.5 text-slate-500 hover:text-slate-300 transition"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {confirmPassword && confirmPassword !== password && (
                                    <p className="text-[11px] text-red-400">Passwords do not match</p>
                                )}
                                {confirmPassword && confirmPassword === password && (
                                    <p className="text-[11px] text-green-400">Passwords match ✓</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Resetting Password...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Reset Password</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    /* Success State */
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-extrabold text-white mb-3">
                            Password Reset! 🎉
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8">
                            Your password has been updated successfully. You can now sign in with your new password.
                        </p>
                        <button
                            onClick={() => navigate("/login")}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
                        >
                            <span>Sign In Now</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Back link */}
                {!success && (
                    <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to Sign In
                        </Link>
                    </div>
                )}

            </div>
        </main>
    );
}

export default ResetPassword;
