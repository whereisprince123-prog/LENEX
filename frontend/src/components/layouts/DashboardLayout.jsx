
import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ThemeToggle from "../ThemeToggle.jsx";
import {
    LayoutDashboard,
    Users,
    ReceiptText,
    ClockAlert,
    CircleCheck,
    BarChart3,
    Activity,
    Settings,
    Menu,
    X,
    LogOut,
    ChevronRight,
} from "lucide-react";
import api from "../../services/api.js";

const DashboardLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const { t, i18n } = useTranslation();

    const handleLanguageChange = async (event) => {
        const selectedLanguage = event.target.value;

        await i18n.changeLanguage(selectedLanguage);
        localStorage.setItem("lenex_language", selectedLanguage);
    };

    // Get logged-in user and business
    const storedUser = localStorage.getItem("lenex_user");
    const storedBusiness = localStorage.getItem("lenex_business");

    let user = {};
    let business = {};

    try {
        user = storedUser ? JSON.parse(storedUser) : {};
        business = storedBusiness ? JSON.parse(storedBusiness) : {};
    } catch (error) {
        console.error("Unable to read account information:", error);
    }

    const ownerName =
        user.full_name ||
        user.owner_name ||
        user.name ||
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        "Business Owner";

    const ownerEmail = user.email || "";

    const profilePicture =
    user.profile_picture_url ||
    user.avatar_url ||
    user.profile_image ||
    "";

    const businessName =
        business.business_name ||
        business.name ||
        business.businessName ||
        "Your business";

    const initials = ownerName
        .split(" ")
        .filter(Boolean)
        .map((name) => name.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const navigation = [
        { name: t("dashboard"), path: "/dashboard", icon: LayoutDashboard },
        { name: t("customers"), path: "/dashboard/customers", icon: Users },
        { name: t("debts"), path: "/dashboard/debts", icon: ReceiptText },
        { name: t("overdue"), path: "/dashboard/overdue", icon: ClockAlert },
        { name: t("paidDebts"), path: "/dashboard/paid", icon: CircleCheck },
        { name: t("reports"), path: "/dashboard/reports", icon: BarChart3 },
        { name: t("activity"), path: "/dashboard/activity", icon: Activity },
        { name: t("settings"), path: "/dashboard/settings", icon: Settings },
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
        <div className="min-h-screen bg-white text-gray-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100">

            {/* MOBILE OVERLAY */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
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
                    transition-all duration-300
                    dark:border-slate-800 dark:bg-slate-900
                    lg:translate-x-0
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >

                {/* LOGO */}
                <div className="flex h-24 items-center border-b border-gray-100 px-6 dark:border-slate-800">

                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400">
                            <span className="text-xl font-bold text-white">L</span>
                        </div>

                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                                LENEX
                            </h1>

                            <p className="text-xs text-gray-400 dark:text-slate-500">
                                Smarter credit
                            </p>
                        </div>
                    </div>

                    {/* MOBILE CLOSE */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close navigation"
                        className="ml-auto rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* CENTER NAVIGATION */}
                <div className="flex flex-1 flex-col justify-center px-3">

                    <p className="mb-4 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 dark:text-slate-500">
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
                                    className={({ isActive }) => `
                                        group flex items-center gap-3
                                        rounded-xl px-4 py-3
                                        text-sm font-medium
                                        transition-all duration-200
                                        ${
                                            isActive
                                                ? "bg-sky-400 text-white shadow-sm"
                                                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                        }
                                    `}
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                size={20}
                                                strokeWidth={isActive ? 2.2 : 1.8}
                                                className="shrink-0"
                                            />

                                            <span className="flex-1">
                                                {item.name}
                                            </span>

                                            {isActive && (
                                                <ChevronRight size={16} strokeWidth={2} />
                                            )}
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                {/* PROFILE + LOGOUT */}
                <div className="border-t border-gray-100 p-4 dark:border-slate-800">

                   {/* CLICKABLE BUSINESS OWNER PROFILE */}
<NavLink
    to="/dashboard/settings"
    onClick={() => setMobileOpen(false)}
    aria-label="Open profile and account settings"
    className={({ isActive }) => `
        group mb-2 block rounded-xl p-2.5
        transition-all duration-200
        ${
            isActive
                ? "bg-sky-50 dark:bg-sky-500/10"
                : "hover:bg-gray-50 dark:hover:bg-slate-800"
        }
    `}
>
    <div className="flex items-center gap-3">
        {/* PROFILE PICTURE */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-100 text-sm font-bold text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
            {profilePicture ? (
                <img
                    src={profilePicture}
                    alt={`${ownerName}'s profile`}
                    className="h-full w-full object-cover"
                />
            ) : (
                initials
            )}
        </div>

        {/* OWNER DETAILS */}
        <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                {ownerName}
            </p>

            <p className="truncate text-xs text-gray-400 dark:text-slate-500">
                {ownerEmail}
            </p>
        </div>

        <ChevronRight
            size={16}
            className="text-gray-400 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-slate-500"
        />
    </div>
</NavLink>

                    {/* LOGOUT */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-500 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                    >
                        <LogOut size={19} strokeWidth={1.8} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* MAIN AREA */}
            <div className="lg:pl-64">

                {/* MOBILE HEADER */}
                <div className="sticky top-0 z-30 flex h-16 items-center border-b border-gray-100 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 lg:hidden">

                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open navigation"
                        className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800"
                    >
                        <Menu size={22} />
                    </button>

                    <div className="ml-3 flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400">
                            <span className="text-sm font-bold text-white">L</span>
                        </div>

                        <span className="font-bold text-gray-900 dark:text-white">
                            LENEX
                        </span>
                    </div>
                </div>

                {/* LANGUAGE SWITCHER + THEME */}
                <div className="flex justify-end border-b border-gray-100 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 sm:px-6 lg:px-8">

                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        <span className="text-sm text-gray-500 dark:text-slate-400">
                            {t("language")}:
                        </span>

                        <select
                            value={i18n.resolvedLanguage || i18n.language}
                            onChange={handleLanguageChange}
                            aria-label={t("language")}
                            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:ring-sky-900"
                        >
                            <option value="en">🇬🇧 English</option>
                            <option value="rw">🇷🇼 Kinyarwanda</option>
                            <option value="fr">🇫🇷 Français</option>
                        </select>
                    </div>
                </div>

                {/* PAGE CONTENT */}
                <main className="min-h-screen bg-white p-4 transition-colors duration-200 dark:bg-slate-950 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
