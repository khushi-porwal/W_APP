import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { User, Mail, Shield, MapPin, Plus, KeyRound } from "lucide-react";
import { getMyAddresses, addAddress } from "../../services/addressService";
import toast from "react-hot-toast";

function Profile() {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("info");
    const [addresses, setAddresses] = useState([]);
    const [loadingAddr, setLoadingAddr] = useState(false);

    // Address form
    const [showAddForm, setShowAddForm] = useState(false);
    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
    });

    useEffect(() => {
        if (activeTab === "addresses") {
            fetchAddresses();
        }
    }, [activeTab]);

    const fetchAddresses = async () => {
        try {
            setLoadingAddr(true);
            const res = await getMyAddresses();
            setAddresses(res?.data?.addresses || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingAddr(false);
        }
    };

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await addAddress(form);
            toast.success(res?.message || "Address added successfully");
            setShowAddForm(false);
            setForm({
                fullName: "",
                phone: "",
                street: "",
                city: "",
                state: "",
                pincode: "",
                country: "India",
            });
            fetchAddresses();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add address");
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            {/* Top User Card Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col sm:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-black text-3xl flex items-center justify-center shadow-lg border-2 border-white/20">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <div className="text-center sm:text-left space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-black">{user.name}</h1>
                    <p className="text-indigo-200 text-xs font-semibold">{user.email}</p>
                    <span className="inline-block mt-2 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                        {user.role} Account
                    </span>
                </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-6 text-sm font-extrabold">
                <button
                    onClick={() => setActiveTab("info")}
                    className={`pb-3 transition ${
                        activeTab === "info"
                            ? "text-indigo-600 border-b-2 border-indigo-600"
                            : "text-slate-500 hover:text-slate-900"
                    }`}
                >
                    Personal Information
                </button>
                <button
                    onClick={() => setActiveTab("addresses")}
                    className={`pb-3 transition ${
                        activeTab === "addresses"
                            ? "text-indigo-600 border-b-2 border-indigo-600"
                            : "text-slate-500 hover:text-slate-900"
                    }`}
                >
                    Saved Addresses
                </button>
            </div>

            {/* Tab Contents */}
            {activeTab === "info" && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                    <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">Account Details</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                            <label className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
                                <User size={12} /> Full Name
                            </label>
                            <p className="font-bold text-slate-900 text-base">{user.name}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                            <label className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
                                <Mail size={12} /> Email Address
                            </label>
                            <p className="font-bold text-slate-900 text-base">{user.email}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                            <label className="text-[10px] font-extrabold uppercase text-slate-400 flex items-center gap-1">
                                <Shield size={12} /> System Access
                            </label>
                            <p className="font-bold text-slate-900 text-base capitalize">{user.role}</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "addresses" && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <h2 className="text-lg font-black text-slate-900">Address Book</h2>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="inline-flex items-center gap-1 bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-indigo-700 transition"
                        >
                            <Plus size={16} /> Add Address
                        </button>
                    </div>

                    {showAddForm && (
                        <form onSubmit={handleSaveAddress} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
                            <h3 className="font-bold text-slate-900">New Address Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input
                                    placeholder="Full Name"
                                    required
                                    value={form.fullName}
                                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                    className="p-2.5 bg-white border border-slate-200 rounded-xl"
                                />
                                <input
                                    placeholder="Phone Number (10 digits)"
                                    required
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    className="p-2.5 bg-white border border-slate-200 rounded-xl"
                                />
                                <input
                                    placeholder="Street Address"
                                    required
                                    value={form.street}
                                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                                    className="p-2.5 bg-white border border-slate-200 rounded-xl sm:col-span-2"
                                />
                                <input
                                    placeholder="City"
                                    required
                                    value={form.city}
                                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                                    className="p-2.5 bg-white border border-slate-200 rounded-xl"
                                />
                                <input
                                    placeholder="State"
                                    required
                                    value={form.state}
                                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                                    className="p-2.5 bg-white border border-slate-200 rounded-xl"
                                />
                                <input
                                    placeholder="Pincode"
                                    required
                                    value={form.pincode}
                                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                                    className="p-2.5 bg-white border border-slate-200 rounded-xl"
                                />
                                <input
                                    placeholder="Country"
                                    required
                                    value={form.country}
                                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                                    className="p-2.5 bg-white border border-slate-200 rounded-xl"
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs"
                            >
                                Save Address
                            </button>
                        </form>
                    )}

                    {loadingAddr ? (
                        <p className="text-xs text-slate-400">Loading addresses...</p>
                    ) : addresses.length === 0 ? (
                        <p className="text-xs text-slate-500 py-4 text-center">No saved addresses found.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {addresses.map((addr) => (
                                <div key={addr._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                                    <div className="flex items-center justify-between">
                                        <p className="font-extrabold text-slate-900">{addr.fullName}</p>
                                        {addr.isDefault && <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">Default</span>}
                                    </div>
                                    <p className="text-slate-600">{addr.street}, {addr.city}</p>
                                    <p className="text-slate-600">{addr.state} - {addr.pincode}</p>
                                    <p className="text-slate-500 pt-1">Phone: {addr.phone}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Profile;