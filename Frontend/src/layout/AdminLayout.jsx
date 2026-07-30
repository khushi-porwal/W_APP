import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

function AdminLayout() {
    return (
        <div className="h-screen bg-gray-100">

            <Sidebar />

            <div className="ml-72 h-screen flex flex-col">

                <Topbar />

                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>

            </div>

        </div>
    );
}

export default AdminLayout;