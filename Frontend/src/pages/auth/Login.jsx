import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        setLoading(true);

        const response = await loginUser(formData);

        login(response.data.token);

        toast.success(response.message);

        navigate("/");
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Unable to login";

        toast.error(message);
    } finally {
        setLoading(false);
    }
};
    return (
        <main className="min-h-screen bg-slate-50">
            <div className="grid min-h-screen lg:grid-cols-2">
                {/* Left Section */}
                <section className="hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
                    <Link
                        to="/"
                        className="text-2xl font-bold tracking-tight text-white"
                    >
                        ShopNest
                    </Link>

                    <div className="max-w-xl">
                        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                            Welcome back
                        </p>

                        <h1 className="text-5xl font-bold leading-tight tracking-tight text-white xl:text-6xl">
                            Your next favourite
                            <span className="block text-slate-400">
                                find is waiting.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
                            Sign in to continue shopping, manage your orders and
                            access your saved products.
                        </p>
                    </div>

                    <p className="text-sm text-slate-500">
                        Secure access. Seamless shopping. One account.
                    </p>
                </section>

                {/* Login Form */}
                <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
                    <div className="w-full max-w-md">
                        <div className="mb-10 lg:hidden">
                            <Link
                                to="/"
                                className="text-2xl font-bold tracking-tight text-slate-950"
                            >
                                ShopNest
                            </Link>
                        </div>

                        <div className="mb-8">
                            <p className="mb-2 text-sm font-semibold text-slate-500">
                                WELCOME BACK
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                Sign in to your account
                            </h2>

                            <p className="mt-3 text-base text-slate-600">
                                Enter your email and password to continue.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
                                />
                            </div>

                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-semibold text-slate-700"
                                    >
                                        Password
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className="text-sm font-semibold text-slate-700 underline-offset-4 hover:text-slate-950 hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-950/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading
                                    ? "Signing in..."
                                    : "Sign in"}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-600">
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                className="font-semibold text-slate-950 underline-offset-4 hover:underline"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Login;