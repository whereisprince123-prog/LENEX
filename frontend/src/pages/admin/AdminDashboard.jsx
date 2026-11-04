
import { useEffect, useState } from "react";
import {
    Building2,
    Users,
    Wallet,
    CheckCircle2,
    RefreshCw,
    AlertCircle,
    ArrowUpRight,
    CreditCard
} from "lucide-react";
import adminApi from "../../services/adminApi";

const formatNumber = (value) =>
    Number(value || 0).toLocaleString();

const formatMoney = (value) =>
    `RWF ${formatNumber(value)}`;

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await adminApi.get("/admin/stats");

            setStats(response.data.data);
        } catch (err) {
            console.error("Admin statistics error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load platform statistics."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const cards = stats
        ? [
              {
                  label: "Total Businesses",
                  value: formatNumber(stats.total_businesses),
                  icon: Building2,
                  color: "bg-indigo-50 text-indigo-600",
                  description: "Registered on LENEX"
              },
              {
                  label: "Total Customers",
                  value: formatNumber(stats.total_customers),
                  icon: Users,
                  color: "bg-sky-50 text-sky-600",
                  description: "Across all businesses"
              },
              {
                  label: "Total Debt Records",
                  value: formatNumber(stats.total_debts),
                  icon: Wallet,
                  color: "bg-amber-50 text-amber-600",
                  description: "All recorded debts"
              },
              {
                  label: "Paid Debt Records",
                  value: formatNumber(stats.paid_debts),
                  icon: CheckCircle2,
                  color: "bg-emerald-50 text-emerald-600",
                  description: "Marked as paid"
              }
          ]
        : [];

    return (
        <div className="space-y-8">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        PLATFORM OVERVIEW
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Dashboard
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Monitor businesses and debt activity across LENEX.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchStats}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh data
                </button>
            </section>

            {error && (
                <div
                    role="alert"
                    className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center"
                >
                    <div className="flex items-center gap-2">
                        <AlertCircle size={19} />
                        <span>{error}</span>
                    </div>

                    <button
                        type="button"
                        onClick={fetchStats}
                        className="font-semibold underline sm:ml-auto"
                    >
                        Try again
                    </button>
                </div>
            )}

            {loading && !stats ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white"
                        />
                    ))}
                </div>
            ) : stats ? (
                <>
                    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {cards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <article
                                    key={card.label}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">
                                                {card.label}
                                            </p>
                                            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                                                {card.value}
                                            </p>
                                        </div>

                                        <div
                                            className={`rounded-xl p-3 ${card.color}`}
                                        >
                                            <Icon size={22} />
                                        </div>
                                    </div>

                                    <p className="mt-4 text-xs text-slate-500">
                                        {card.description}
                                    </p>
                                </article>
                            );
                        })}
                    </section>

                    <section className="grid gap-5 xl:grid-cols-2">
                        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                                    <CreditCard size={22} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        Debt overview
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Total debt recorded across the platform
                                    </p>
                                </div>
                            </div>

                            <p className="mt-6 text-3xl font-bold text-slate-900">
                                {formatMoney(stats.total_debt_amount)}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Combined amount of all debt records.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                                    <CheckCircle2 size={22} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900">
                                        Payments marked as paid
                                    </h3>
                                    <p className="text-sm text-slate-500">
                                        Amount recorded against paid debts
                                    </p>
                                </div>
                            </div>

                            <p className="mt-6 text-3xl font-bold text-slate-900">
                                {formatMoney(stats.paid_amount)}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Total amount associated with debt records
                                whose status is PAID.
                            </p>
                        </article>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-slate-900">
                                    Platform status
                                </h3>
                                <p className="mt-1 text-sm text-slate-500">
                                    Summary of the data currently available.
                                </p>
                            </div>

                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                Connected
                            </span>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                            <p className="text-sm text-slate-600">
                                Statistics loaded from your LENEX backend.
                            </p>

                            <span className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
                                Live API data
                                <ArrowUpRight size={16} />
                            </span>
                        </div>
                    </section>
                </>
            ) : (
                !error && (
                    <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                        No statistics are available yet.
                    </p>
                )
            )}
        </div>
    );
};

export default AdminDashboard;
