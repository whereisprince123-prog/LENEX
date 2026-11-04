
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Building2,
    Users,
    Activity,
    Settings,
    ShieldCheck,
    LogOut,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import ThemeToggle from "../ThemeToggle";
import adminApi from "../../services/adminApi";
const navigation = [
    {
        label: "Overview",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
        end: true
    },
    {
        label: "Businesses",
        path: "/admin/businesses",
        icon: Building2
    },
    {
        label: "Administrators",
        path: "/admin/administrators",
        icon: Users
    },
    {
        label: "Activity Logs",
        path: "/admin/activity",
        icon: Activity
    },
    {
        label: "Settings",
        path: "/admin/settings",
        icon: Settings
    }
];

const AdminLayout = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const admin = JSON.parse(
        localStorage.getItem("lenex_admin") || "null"
    );

 const handleAdminLogout = async () => {
    try {
        await adminApi.post("/auth/admin/logout");
    } catch (error) {
        // Continue logging out locally.
    } finally {
        window.location.href = "/admin/login";
    }
};

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    onClick={closeSidebar}
                    className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-slate-950 text-white transition-transform duration-200 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-indigo-500 p-2">
                            <ShieldCheck size={23} />
                        </div>
                        <div>
                            <p className="text-lg font-bold tracking-wide">
                                LENEX
                            </p>
                            <p className="text-xs text-slate-400">
                                Administration
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={closeSidebar}
                        className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-4 pb-3 pt-7">
                    <p className="px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
                        Workspace
                    </p>
                </div>

                <nav className="flex-1 space-y-1 px-3">
                    {navigation.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-indigo-500 text-white shadow-lg shadow-indigo-950/30"
                                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    }`
                                }
                            >
                                <Icon size={19} />
                                {item.label}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="border-t border-white/10 p-4">
                    <div className="mb-4 flex items-center gap-3 rounded-xl bg-white/5 p-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 font-bold text-indigo-300">
                            {(admin?.full_name || "A")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                                {admin?.full_name || "Administrator"}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                                {admin?.role || "ADMIN"}
                            </p>
                        </div>
                    </div>
                  
                    <button
                        type="button"
                        onClick={handleAdminLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-300"
                    >
                        <LogOut size={18} />
                        Sign out
                    </button>
                </div>
            </aside>

            <div className="min-h-screen lg:pl-64">
                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 hover:bg-slate-100 lg:hidden"
                            aria-label="Open navigation"
                        >
                            <Menu size={22} />
                        </button>

                        <div>
                              
                            <p className="text-sm text-slate-500">
                                LENEX Platform
                            </p>
                            <h1 className="text-lg font-bold">
                                Admin Portal
                            </h1>
                        </div>
                    </div>

                    <div className="hidden items-center gap-3 sm:flex">
                         <ThemeToggle />
                        <div className="text-right">
                            <p className="text-sm font-semibold">
                                {admin?.full_name || "Administrator"}
                            </p>
                            <p className="text-xs text-slate-500">
                                {admin?.email || ""}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-700">
                            {(admin?.full_name || "A")
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
