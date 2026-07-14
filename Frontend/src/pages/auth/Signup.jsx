import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { signupUser } from "../../services/authService";

function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
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

        const response = await signupUser(formData);

        toast.success(response.message);

        navigate("/login");
    } catch (error) {
        const message =
            error.response?.data?.message ||
            "Something went wrong";

        toast.error(message);
    } finally {
        setLoading(false);
    }
};

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="grid min-h-screen lg:grid-cols-2">
                {/* Left Content */}
                <section className="hidden bg-slate-950 lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
                    <Link
                        to="/"
                        className="text-2xl font-bold tracking-tight text-white"
                    >
                        ShopNest
                    </Link>

                    <div className="max-w-xl">
                        <p className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                            Shop smarter
                        </p>

                        <h1 className="text-5xl font-bold leading-tight tracking-tight text-white xl:text-6xl">
                            Everything you love,
                            <span className="block text-slate-400">
                                all in one place.
                            </span>
                        </h1>

                        <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
                            Create your account to discover products, save your
                            favourites and enjoy a seamless shopping experience.
                        </p>
                    </div>

                    <p className="text-sm text-slate-500">
                        Secure shopping. Simple checkout. Better experience.
                    </p>
                </section>

                {/* Signup Form */}
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
                                START SHOPPING
                            </p>

                            <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                Create your account
                            </h2>

                            <p className="mt-3 text-base text-slate-600">
                                Enter your details to get started with ShopNest.
                            </p>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Full name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
                                />
                            </div>

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
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 8 characters"
                                    autoComplete="new-password"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-4 focus:ring-slate-950/10"
                                />

                                <p className="mt-2 text-xs text-slate-500">
                                    Use at least 8 characters for your password.
                                </p>
                            </div>

                           <button
    type="submit"
    disabled={loading}
    className="w-full rounded-xl bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-950/20 disabled:cursor-not-allowed disabled:opacity-60"
>
    {loading ? "Creating account..." : "Create account"}
</button>
                        </form>

                        <p className="mt-8 text-center text-sm text-slate-600">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-slate-950 underline-offset-4 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>

                        <p className="mt-8 text-center text-xs leading-5 text-slate-500">
                            By creating an account, you agree to our Terms of
                            Service and Privacy Policy.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Signup;