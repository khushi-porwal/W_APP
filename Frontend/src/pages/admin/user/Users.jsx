import React, { useState, useEffect } from "react";
import {
    Users as UsersIcon,
    Shield,
    UserCheck,
    Search,
    UserPlus,
    Trash2,
    RefreshCw,
    X,
    Check,
    AlertTriangle
} from "lucide-react";
import toast from "react-hot-toast";
import {
    getAllUsers,
    createAdminUser,
    updateUserRole,
    deleteUser
} from "../../../services/adminService";

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    // Modal states
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // New user form state
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
    });

    const [submitting, setSubmitting] = useState(false);

    const fetchUsersData = async () => {
        try {
            setLoading(true);
            const res = await getAllUsers();
            if (res?.data?.users) {
                setUsers(res.data.users);
            } else if (Array.isArray(res?.data)) {
                setUsers(res.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsersData();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setSubmitting(true);
            const res = await createAdminUser(formData);
            toast.success(res.message || "User created successfully!");
            setAddModalOpen(false);
            setFormData({ name: "", email: "", password: "", role: "user" });
            fetchUsersData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create user");
        } finally {
            setSubmitting(false);
        }
    };

    const handleRoleToggle = async (userToUpdate) => {
        const newRole = userToUpdate.role === "admin" ? "user" : "admin";
        try {
            const res = await updateUserRole(userToUpdate._id, newRole);
            toast.success(res.message || `Updated role to ${newRole}`);
            fetchUsersData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update role");
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;
        try {
            setSubmitting(true);
            const res = await deleteUser(selectedUser._id);
            toast.success(res.message || "User deleted successfully");
            setDeleteModalOpen(false);
            setSelectedUser(null);
            fetchUsersData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete user");
        } finally {
            setSubmitting(false);
        }
    };

    // Filtered users
    const filteredUsers = users.filter((u) => {
        const matchesSearch =
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === "all" || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const totalUsers = users.length;
    const totalAdmins = users.filter((u) => u.role === "admin").length;
    const totalCustomers = users.filter((u) => u.role === "user").length;

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            
            {/* Top Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">User Management</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage user roles, admin permissions, and registered customer accounts.</p>
                </div>
                <button
                    onClick={() => setAddModalOpen(true)}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
                >
                    <UserPlus className="w-4 h-4" /> Add User / Admin
                </button>
            </div>

            {/* KPI Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl">
                        <UsersIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered Users</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-0.5">{totalUsers}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="p-3.5 bg-purple-50 text-purple-600 rounded-xl">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Admin Accounts</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-0.5">{totalAdmins}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
                        <UserCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Accounts</p>
                        <h3 className="text-2xl font-black text-slate-900 mt-0.5">{totalCustomers}</h3>
                    </div>
                </div>
            </div>

            {/* Controls Header (Search & Filter) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                    />
                </div>

                {/* Role Filter Tabs */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                    {["all", "admin", "user"].map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition ${
                                roleFilter === role
                                    ? "bg-slate-900 text-white shadow-xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {role === "all" ? "All Roles" : role}
                        </button>
                    ))}
                    <button
                        onClick={fetchUsersData}
                        title="Refresh"
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-500 font-medium">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        Loading user accounts...
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-800">No Users Found</h3>
                        <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or role filter.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Joined Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-50/80 transition">
                                        <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
                                                {u.name ? u.name[0].toUpperCase() : "U"}
                                            </div>
                                            <span>{u.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                                                    u.role === "admin"
                                                        ? "bg-purple-50 text-purple-700 border-purple-200"
                                                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                }`}
                                            >
                                                {u.role === "admin" ? (
                                                    <>
                                                        <Shield className="w-3.5 h-3.5" /> Admin
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserCheck className="w-3.5 h-3.5" /> Customer
                                                    </>
                                                )}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) : "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                
                                                {/* Toggle Role Button */}
                                                <button
                                                    onClick={() => handleRoleToggle(u)}
                                                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition"
                                                    title="Switch Role between Admin & Customer"
                                                >
                                                    Set to {u.role === "admin" ? "Customer" : "Admin"}
                                                </button>

                                                {/* Delete Button */}
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(u);
                                                        setDeleteModalOpen(true);
                                                    }}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Create User Modal */}
            {addModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-extrabold text-slate-900">Add New Account</h3>
                            <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Jane Doe"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="jane@example.com"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Minimum 8 characters"
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Account Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="user">Customer (Standard User)</option>
                                    <option value="admin">Administrator (Full Admin Access)</option>
                                </select>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setAddModalOpen(false)}
                                    className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md"
                                >
                                    {submitting ? "Creating..." : "Create Account"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4">
                        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900">Delete User Account?</h3>
                        <p className="text-xs text-slate-500">
                            Are you sure you want to delete <strong className="text-slate-800">{selectedUser.email}</strong>? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                disabled={submitting}
                                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-md"
                            >
                                {submitting ? "Deleting..." : "Delete Account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Users;
