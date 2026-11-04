import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    ReceiptText,
    ClockAlert,
    CircleCheck,
    Activity,
    Settings,
    Menu,
    X,
    LogOut,
    ChevronRight,
} from "lucide-react";
import api from "../services/api.js";
const DashboardLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    // Get logged-in user
    const storedUser = localStorage.getItem("lenex_user");

    let user = {};

    try {
        user = storedUser ? JSON.parse(storedUser) : {};
    } catch (error) {
        console.error("Unable to read logged-in user:", error);
    }

    // Support different possible names returned by the backend
    const ownerName =
        user.full_name ||
        user.owner_name ||
        user.name ||
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        "Business Owner";

    const initials = ownerName
        .split(" ")
        .filter(Boolean)
        .map((name) => name.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const navigation = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Customers",
            path: "/dashboard/customers",
            icon: Users,
        },
        {
            name: "Debts",
            path: "/dashboard/debts",
            icon: ReceiptText,
        },
        {
            name: "Overdue",
            path: "/dashboard/overdue",
            icon: ClockAlert,
        },
        {
            name: "Paid Debts",
            path: "/dashboard/paid",
            icon: CircleCheck,
        },
        {
            name: "Activity",
            path: "/dashboard/activity",
            icon: Activity,
        },
        {
            name: "Settings",
            path: "/dashboard/settings",
            icon: Settings,
        },
    ];
const handleLogout = async () => {
    try {
        await api.post("/auth/business/logout");
    } catch (error) {
        // Continue logging out locally even if the request fails.
    } finally {
        window.location.href = "/login";
    }
};

    return (
        <div className="min-h-screen bg-white">

            {/* MOBILE OVERLAY */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/30 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    flex w-64 flex-col
                    border-r border-gray-100
                    bg-white
                    transition-transform duration-300
                    lg:translate-x-0
                    ${
                        mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* LOGO */}
                <div className="flex h-24 items-center border-b border-gray-100 px-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400">
                            <span className="text-xl font-bold text-white">
                                L
                            </span>
                        </div>

                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-gray-900">
                                LENEX
                            </h1>

                            <p className="text-xs text-gray-400">
                                Smarter credit
                            </p>
                        </div>

                    </div>

                    {/* MOBILE CLOSE */}
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="ml-auto rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 lg:hidden"
                    >
                        <X size={20} />
                    </button>

                </div>

                {/* CENTER NAVIGATION */}
                <div className="flex flex-1 flex-col justify-center px-3">

                    <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                        Workspace
                    </p>

                    <nav className="space-y-1">

                        {navigation.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === "/dashboard"}
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) =>
                                        `
                                        group flex items-center gap-3
                                        rounded-xl px-4 py-3
                                        text-sm font-medium
                                        transition-all duration-200
                                        ${
                                            isActive
                                                ? "bg-sky-400 text-white shadow-sm"
                                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                                        }
                                        `
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                size={20}
                                                strokeWidth={
                                                    isActive ? 2.2 : 1.8
                                                }
                                                className="shrink-0"
                                            />

                                            <span className="flex-1">
                                                {item.name}
                                            </span>

                                            {isActive && (
                                                <ChevronRight
                                                    size={16}
                                                    strokeWidth={2}
                                                />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}

                    </nav>

                </div>

                {/* PROFILE + LOGOUT */}
                <div className="border-t border-gray-100 p-4">

                    {/* PROFILE */}
                    <div className="mb-2 flex items-center gap-3 rounded-xl p-2.5">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600">
                            {initials}
                        </div>

                        <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-semibold text-gray-900">
                                {ownerName}
                            </p>

                            <p className="text-xs text-gray-400">
                                Business Owner
                            </p>

                        </div>

                        <ChevronRight
                            size={17}
                            className="text-gray-300"
                        />

                    </div>

                    {/* LOGOUT */}
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                        <LogOut
                            size={19}
                            strokeWidth={1.8}
                        />

                        <span>
                            Logout
                        </span>
                    </button>

                </div>

            </aside>

            {/* MAIN AREA */}
            <div className="lg:pl-64">

                {/* MOBILE HEADER */}
                <div className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-100 bg-white/95 px-4 backdrop-blur lg:hidden">

                    <button
                        onClick={() => setMobileOpen(true)}
                        className="rounded-xl p-2 text-gray-500 hover:bg-gray-50"
                    >
                        <Menu size={22} />
                    </button>

                    <div className="ml-3 flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400">
                            <span className="text-sm font-bold text-white">
                                L
                            </span>
                        </div>

                        <span className="font-bold text-gray-900">
                            LENEX
                        </span>

                    </div>

                </div>

                {/* PAGE CONTENT */}
                <main className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default DashboardLayout;