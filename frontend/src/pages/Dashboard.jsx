
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Users,
    CreditCard,
    AlertTriangle,
    CheckCircle,
    Plus,
    RefreshCw,
    ArrowUpRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import DashboardCard from "../components/dashboard/DashboardCard.jsx";
import RecentDebts from "../components/dashboard/RecentDebt.jsx";
import OverdueDebts from "../components/dashboard/OverdueDebt.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const COLORS = ["#F59E0B", "#EF4444", "#10B981"];

const money = (value) =>
    `${new Intl.NumberFormat("en-RW", {
        maximumFractionDigits: 0,
    }).format(Number(value) || 0)} RWF`;

const TooltipContent = ({ active, payload, label, theme }) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs text-gray-500 dark:text-slate-400">
                {label}
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                {money(payload[0].value)}
            </p>
        </div>
    );
};

const Dashboard = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { theme } = useTheme();

    const isDark = theme === "dark";

    const [summary, setSummary] = useState(null);
    const [recentDebts, setRecentDebts] = useState([]);
    const [overdueDebts, setOverdueDebts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const loadDashboard = useCallback(async (refresh = false) => {
        try {
            refresh ? setRefreshing(true) : setLoading(true);
            setError("");

            const [summaryRes, recentRes, overdueRes] = await Promise.all([
                api.get("/dashboard/summary"),
                api.get("/dashboard/recent-debts"),
                api.get("/dashboard/overdue-debts"),
            ]);

            setSummary(summaryRes.data.data);
            setRecentDebts(recentRes.data.data || []);
            setOverdueDebts(overdueRes.data.data || []);
        } catch (err) {
            console.error("Dashboard error:", err);
            setError(
err.response?.data?.message ||
t("dashboardLoadError")
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    let user = {};

    try {
        user = JSON.parse(localStorage.getItem("lenex_user") || "{}");
    } catch {
        user = {};
    }

    const ownerName =
        user.full_name ||
        user.owner_name ||
        user.name ||
        [user.first_name, user.last_name].filter(Boolean).join(" ") ||
        "there";

    const amounts = [
        { name: t("unpaid"), amount: Number(summary?.unpaid_amount) || 0 },
        { name: t("overdue"), amount: Number(summary?.overdue_amount) || 0 },
        { name: t("paid"), amount: Number(summary?.paid_amount) || 0 },
    ];

    const statuses = [
        { name: t("unpaid"), value: Number(summary?.unpaid_count) || 0 },
        { name: t("overdue"), value: Number(summary?.overdue_count) || 0 },
        { name: t("paid"), value: Number(summary?.paid_count) || 0 },
    ];

    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />
            </div>
        );
    }

    if (error && !summary) {
        return (
            <div className="rounded-xl border border-red-200 bg-white p-5 dark:border-red-900/50 dark:bg-slate-900">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {t("unableToLoadDashboard")}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                    {error}
                </p>
                <button
                    onClick={() => loadDashboard()}
                    className="mt-4 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-600"
                >
                    {t("tryAgain")}
                </button>
            </div>
        );
    }

    return (
        <main className="min-w-0 space-y-6 pb-6 text-gray-900 dark:text-slate-100">

            {/* HEADER */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                        {t("businessOverview")}
                    </p>

                    <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {t("welcomeBack")}, {ownerName}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                        {t("businessOverviewDescription")}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        onClick={() => loadDashboard(true)}
                        disabled={refreshing}
                        aria-label={t("refreshDashboard")}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <RefreshCw
                            size={15}
                            className={refreshing ? "animate-spin" : ""}
                        />
                        {t("refresh")}
                    </button>

                    <button
                        onClick={() => navigate("/dashboard/customers")}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <Plus size={16} />
                        {t("customer")}
                    </button>

                    <button
                        onClick={() => navigate("/dashboard/debts")}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-500 px-3 text-sm font-medium text-white transition hover:bg-sky-600"
                    >
                        <Plus size={16} />
                        {t("recordDebt")}
                    </button>
                </div>
            </header>

            {/* ERROR MESSAGE */}
            {error && (
                <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-300">
                    {error}
                </p>
            )}

            {/* SUMMARY CARDS */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                <DashboardCard
                    title={t("totalCustomers")}
                    value={summary?.total_customers || 0}
                    subtitle={t("activeCustomers")}
                    icon={<Users size={19} />}
                    iconClass="bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"
                />

                <DashboardCard
                    title={t("unpaidDebts")}
                    value={money(summary?.unpaid_amount)}
                    subtitle={`${summary?.unpaid_count || 0} ${t("unpaidDebts")}`}
                    icon={<CreditCard size={19} />}
                    iconClass="bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
                />

                <DashboardCard
                    title={t("overdue")}
                    value={money(summary?.overdue_amount)}
                    subtitle={`${summary?.overdue_count || 0} ${t("overdue")}`}
                    icon={<AlertTriangle size={19} />}
                    iconClass="bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400"
                />

                <DashboardCard
                    title={t("paidDebts")}
                    value={money(summary?.paid_amount)}
                    subtitle={`${summary?.paid_count || 0} ${t("paidDebts")}`}
                    icon={<CheckCircle size={19} />}
                    iconClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
                />
            </section>

            {/* CHARTS */}
            <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-5">

                {/* DEBT AMOUNTS BAR CHART */}
                <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-5 xl:col-span-3">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {t("debtAmounts")}
                        </h2>
                        <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                            {t("breakdownByDebtStatus")}
                        </p>
                    </div>

                    <div className="mt-4 h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={amounts}
                                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                            >
                                <CartesianGrid
                                    vertical={false}
                                    stroke={isDark ? "#334155" : "#F1F5F9"}
                                />

                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 12,
                                        fill: isDark ? "#CBD5E1" : "#64748B",
                                    }}
                                />

                                <YAxis
                                    width={55}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fontSize: 11,
                                        fill: isDark ? "#CBD5E1" : "#64748B",
                                    }}
                                    tickFormatter={(value) =>
                                        value >= 1000
                                            ? `${Math.round(value / 1000)}k`
                                            : value
                                    }
                                />

                                <Tooltip
                                    content={<TooltipContent theme={theme} />}
                                />

                                <Bar
                                    dataKey="amount"
                                    radius={[5, 5, 0, 0]}
                                    maxBarSize={54}
                                >
                                    {amounts.map((item, index) => (
                                        <Cell
                                            key={item.name}
                                            fill={COLORS[index]}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* DEBT DISTRIBUTION PIE CHART */}
                <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 transition-colors dark:border-slate-800 dark:bg-slate-900 sm:p-5 xl:col-span-2">
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {t("debtDistribution")}
                    </h2>

                    <p className="mt-1 text-xs text-gray-500 dark:text-slate-400">
                        {t("numberOfDebtsByStatus")}
                    </p>

                    <div className="mt-2 h-64 w-full">
                        {statuses.every((item) => item.value === 0) ? (
                            <div className="flex h-full items-center justify-center text-sm text-gray-400 dark:text-slate-500">
                                {t("noDebtRecordsYet")}
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statuses.filter(
                                            (item) => item.value > 0
                                        )}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius={55}
                                        outerRadius={82}
                                        paddingAngle={3}
                                    >
                                        {statuses
                                            .filter((item) => item.value > 0)
                                            .map((item) => (
                                                <Cell
                                                    key={item.name}
                                                    fill={
                                                        COLORS[
                                                            statuses.findIndex(
                                                                (status) =>
                                                                    status.name === item.name
                                                            )
                                                        ]
                                                    }
                                                    stroke="none"
                                                />
                                            ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-600 dark:text-slate-400">
                        {statuses.map((item, index) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: COLORS[index] }}
                                />
                                {item.name}
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* RECENT AND OVERDUE DEBTS */}
            <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-3">
                <div className="min-w-0 xl:col-span-2">
                    <RecentDebts debts={recentDebts} />
                </div>

                <div className="min-w-0">
                    <OverdueDebts debts={overdueDebts} />
                </div>
            </section>

            {/* CALL TO ACTION */}
            <section className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                        {t("keepYourRecordsUpToDate")}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                        {t("addDebtOrReviewOutstandingBalances")}
                    </p>
                </div>

                <button
                    onClick={() => navigate("/dashboard/debts")}
                    className="inline-flex shrink-0 items-center justify-center gap-2 self-start text-sm font-semibold text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 sm:self-center"
                >
                    {t("manageCustomerDebts")}
                    <ArrowUpRight size={16} />
                </button>
            </section>
        </main>
    );
};

export default Dashboard;
