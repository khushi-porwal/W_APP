import { ArrowRight, ShieldCheck, Truck, Undo2 } from "lucide-react";
import { Link } from "react-router-dom";

import Navbar from "../../components/common/Navbar";

function Home() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main>
                {/* Hero */}
                <section className="bg-slate-50">
                    <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:px-10 lg:py-24">
                        <div className="max-w-2xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                                New collection
                            </p>

                            <h1 className="mt-5 text-5xl font-bold leading-[1.05] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
                                Better products.
                                <span className="block text-slate-500">
                                    Simpler shopping.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                                Discover thoughtfully selected products for
                                everyday life. Shop favourites, save what you
                                love and enjoy a seamless checkout experience.
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    to="/products"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    Shop collection

                                    <ArrowRight size={18} />
                                </Link>

                                <Link
                                    to="/signup"
                                    className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100"
                                >
                                    Create an account
                                </Link>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="relative">
                            <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-slate-200">
                                <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 p-10">
                                    <div className="w-full max-w-sm rounded-[2rem] border border-white/80 bg-white/70 p-8 shadow-xl backdrop-blur">
                                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                            ShopNest Edit
                                        </p>

                                        <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
                                            Everyday essentials.
                                        </h2>

                                        <p className="mt-4 leading-7 text-slate-600">
                                            Curated products designed to make
                                            everyday shopping feel effortless.
                                        </p>

                                        <div className="mt-8 grid grid-cols-2 gap-3">
                                            <div className="h-32 rounded-2xl bg-slate-950" />
                                            <div className="h-32 rounded-2xl bg-slate-300" />
                                            <div className="h-32 rounded-2xl bg-slate-200" />
                                            <div className="h-32 rounded-2xl bg-slate-700" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits */}
                <section className="border-y border-slate-200">
                    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-3 lg:px-10">
                        <div className="flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                <Truck size={20} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-950">
                                    Reliable delivery
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Track your orders from checkout to delivery.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                <ShieldCheck size={20} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-950">
                                    Secure payments
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    A protected and seamless checkout experience.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                                <Undo2 size={20} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-950">
                                    Easy shopping
                                </h3>

                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                    Save favourites and manage orders with ease.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Preview Placeholder */}
                <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                                Featured
                            </p>

                            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                                Products worth discovering
                            </h2>

                            <p className="mt-3 max-w-2xl text-slate-600">
                                Explore popular products selected from our
                                collection.
                            </p>
                        </div>

                        <Link
                            to="/products"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-950"
                        >
                            View all products

                            <ArrowRight size={17} />
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                            >
                                <div className="aspect-square animate-pulse bg-slate-100" />

                                <div className="p-5">
                                    <div className="h-3 w-20 animate-pulse rounded bg-slate-100" />

                                    <div className="mt-4 h-5 w-4/5 animate-pulse rounded bg-slate-200" />

                                    <div className="mt-5 h-4 w-24 animate-pulse rounded bg-slate-100" />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Home;