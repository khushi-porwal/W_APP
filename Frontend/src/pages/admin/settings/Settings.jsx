import React, { useState, useEffect } from "react";
import {
    Settings as SettingsIcon,
    Store,
    Truck,
    DollarSign,
    Bell,
    Shield,
    Save,
    CheckCircle2,
    RefreshCw
} from "lucide-react";
import toast from "react-hot-toast";

function Settings() {
    const [settings, setSettings] = useState({
        storeName: "LuxeMarket",
        supportEmail: "support@luxemarket.com",
        supportPhone: "+91 98765 43210",
        currencySymbol: "₹",
        flatShippingFee: 99,
        freeShippingThreshold: 1499,
        taxPercentage: 18,
        maintenanceMode: false,
        emailNotifications: true,
        lowStockAlerts: true,
    });

    const [loading, setLoading] = useState(false);

    // Load persisted settings from localStorage if existing
    useEffect(() => {
        const saved = localStorage.getItem("luxemarket_admin_settings");
        if (saved) {
            try {
                setSettings(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved settings:", e);
            }
        }
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            localStorage.setItem("luxemarket_admin_settings", JSON.stringify(settings));
            toast.success("System settings updated successfully!");
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-8 max-w-5xl mx-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">System & Store Settings</h1>
                    <p className="text-slate-500 text-sm mt-1">Configure global store preferences, shipping policies, tax rates, and feature toggles.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
                >
                    <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Settings"}
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                
                {/* Store Profile Settings */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Store className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900">Store Identity</h3>
                            <p className="text-xs text-slate-400">Basic information shown on customer receipts & emails</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Store Name
                            </label>
                            <input
                                type="text"
                                name="storeName"
                                value={settings.storeName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Support Email
                            </label>
                            <input
                                type="email"
                                name="supportEmail"
                                value={settings.supportEmail}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Contact Phone Number
                            </label>
                            <input
                                type="text"
                                name="supportPhone"
                                value={settings.supportPhone}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Currency Symbol
                            </label>
                            <input
                                type="text"
                                name="currencySymbol"
                                value={settings.currencySymbol}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Shipping & Tax Rules */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
                            <Truck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900">Shipping & Tax Policies</h3>
                            <p className="text-xs text-slate-400">Default checkout calculations for customer orders</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Flat Shipping Fee (₹)
                            </label>
                            <input
                                type="number"
                                name="flatShippingFee"
                                value={settings.flatShippingFee}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Free Shipping Minimum (₹)
                            </label>
                            <input
                                type="number"
                                name="freeShippingThreshold"
                                value={settings.freeShippingThreshold}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                Tax Rate (%)
                            </label>
                            <input
                                type="number"
                                name="taxPercentage"
                                value={settings.taxPercentage}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Feature Toggles */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold text-slate-900">System Flags & Feature Controls</h3>
                            <p className="text-xs text-slate-400">Toggle store maintenance and automated notifications</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Store Maintenance Mode</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Temporarily pause storefront orders for maintenance.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="maintenanceMode"
                                    checked={settings.maintenanceMode}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Send Order Confirmation Emails</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Automatically send order status updates to customer emails.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="emailNotifications"
                                    checked={settings.emailNotifications}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">Low Inventory Alerts</h4>
                                <p className="text-xs text-slate-500 mt-0.5">Notify admin dashboard when product stock drops below 5 units.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="lowStockAlerts"
                                    checked={settings.lowStockAlerts}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 text-sm"
                    >
                        <Save className="w-4 h-4" /> Save System Settings
                    </button>
                </div>

            </form>
        </div>
    );
}

export default Settings;
