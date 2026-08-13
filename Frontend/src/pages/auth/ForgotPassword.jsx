import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Mail, ArrowRight, ArrowLeft, Sparkles, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { forgotPassword } from "../../services/authService";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email address");
            return;
        }

        try {
            setLoading(true);
            await forgotPassword(email.trim());
            setSubmitted(true);
        } catch (error) {
            const message = error.response?.data?.message || "Failed to send reset email. Please try again.";
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

                {!submitted ? (
                    <>
                        {/* Header */}
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-indigo-300 mb-4">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                Password Recovery
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                Forgot your password?
                            </h1>
                            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                                No worries! Enter your registered email and we'll send you a secure reset link valid for <strong className="text-slate-300">15 minutes</strong>.
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label htmlFor="forgot-email" className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-3.5" />
                                    <input
                                        id="forgot-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Sending Reset Link...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Send Reset Link</span>
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
                            Check your inbox!
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed mb-2">
                            A password reset link has been sent to
                        </p>
                        <p className="font-bold text-indigo-300 text-sm mb-6 break-all">
                            {email}
                        </p>
                        <p className="text-slate-500 text-xs mb-8">
                            The link will expire in <strong className="text-slate-400">15 minutes</strong>. If you don't see the email, check your spam/junk folder.
                        </p>
                        <button
                            onClick={() => { setSubmitted(false); setEmail(""); }}
                            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4 transition"
                        >
                            Didn't receive it? Try again
                        </button>
                    </div>
                )}

                {/* Back to login */}
                <div className="mt-8 pt-6 border-t border-slate-800/80 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Sign In
                    </Link>
                </div>

            </div>
        </main>
    );
}

export default ForgotPassword;
