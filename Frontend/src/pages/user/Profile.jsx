import { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";

function Profile() {
    const { user } = useContext(AuthContext);

    return (
        <main className="min-h-screen bg-slate-50 px-5 py-16">
            <div className="mx-auto max-w-3xl">
                <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                        My account
                    </p>

                    <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
                        Profile
                    </h1>

                    <div className="mt-10 grid gap-5 sm:grid-cols-2">
                        <div className="rounded-2xl bg-slate-50 p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Full name
                            </p>

                            <p className="mt-2 text-lg font-semibold text-slate-950">
                                {user.name}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Email address
                            </p>

                            <p className="mt-2 break-all text-lg font-semibold text-slate-950">
                                {user.email}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-slate-50 p-5">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Account role
                            </p>

                            <p className="mt-2 text-lg font-semibold capitalize text-slate-950">
                                {user.role}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Profile;