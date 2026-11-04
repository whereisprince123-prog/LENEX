
import { useCallback, useEffect, useState } from "react";
import {
    Activity,
    Search,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Clock3,
    AlertCircle
} from "lucide-react";
import adminApi from "../../services/adminApi";

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleString();
};

const actionStyle = (action) => {
    if (action.includes("SUSPENDED")) {
        return "bg-red-50 text-red-700";
    }

    if (action.includes("ACTIVE") || action.includes("UPDATED")) {
        return "bg-indigo-50 text-indigo-700";
    }

    if (action.includes("CREATED")) {
        return "bg-emerald-50 text-emerald-700";
    }

    return "bg-slate-100 text-slate-700";
};

const ActivityLogs = () => {
    const [logs, setLogs] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchLogs = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await adminApi.get("/admin/activity", {
                params: {
                    page,
                    limit: 20,
                    search
                }
            });

            setLogs(response.data.data || []);
            setPagination(response.data.pagination);
        } catch (err) {
            console.error("Activity logs error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load activity logs."
            );
        } finally {
            setLoading(false);
        }
    }, [page, search]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const handleSearch = (event) => {
        event.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    };

    return (
        <div className="space-y-7">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-semibold text-indigo-600">
                        SECURITY AND AUDIT
                    </p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                        Activity Logs
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Review administrative actions recorded on LENEX.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchLogs}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-100 disabled:opacity-60"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                            <Activity size={22} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">
                                Recorded actions
                            </p>
                            <p className="text-2xl font-bold">
                                {pagination.total.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                            <ShieldCheck size={22} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">
                                Audit tracking
                            </p>
                            <p className="text-lg font-bold">
                                Enabled
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row"
                >
                    <div className="relative flex-1">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="search"
                            value={searchInput}
                            onChange={(event) =>
                                setSearchInput(event.target.value)
                            }
                            placeholder="Search action, admin, or description..."
                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>

                    <button
                        type="submit"
                        className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        Search logs
                    </button>
                </form>

                {error && (
                    <div
                        role="alert"
                        className="m-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                    >
                        <AlertCircle size={19} />
                        {error}
                    </div>
                )}

                {loading && logs.length === 0 && !error ? (
                    <p className="p-10 text-center text-sm text-slate-500">
                        Loading activity logs...
                    </p>
                ) : !loading && logs.length === 0 ? (
                    <div className="p-12 text-center">
                        <Activity
                            size={32}
                            className="mx-auto text-slate-300"
                        />
                        <p className="mt-3 font-semibold text-slate-700">
                            No activity records found
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Administrative actions will appear here when logged.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4">Action</th>
                                    <th className="px-5 py-4">Administrator</th>
                                    <th className="px-5 py-4">Description</th>
                                    <th className="px-5 py-4">Entity</th>
                                    <th className="px-5 py-4">Date and time</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {logs.map((log) => (
                                    <tr
                                        key={log.log_id}
                                        className="hover:bg-slate-50/70"
                                    >
                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${actionStyle(log.action)}`}
                                            >
                                                {log.action}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-medium text-slate-800">
                                                {log.admin_name || "Unknown admin"}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {log.admin_email || "—"}
                                            </p>
                                        </td>

                                        <td className="max-w-sm px-5 py-4 text-slate-600">
                                            {log.description}
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="font-medium text-slate-700">
                                                {log.entity_type}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                ID: {log.entity_id || "—"}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Clock3
                                                    size={15}
                                                    className="shrink-0 text-slate-400"
                                                />
                                                {formatDate(log.created_at)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
                    <p className="text-sm text-slate-500">
                        {pagination.total === 0
                            ? "No records"
                            : `Showing ${(page - 1) * pagination.limit + 1}–${Math.min(
                                  page * pagination.limit,
                                  pagination.total
                              )} of ${pagination.total}`}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            disabled={page <= 1 || loading}
                            onClick={() => setPage((current) => current - 1)}
                            className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:opacity-40"
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <span className="text-sm text-slate-600">
                            Page {page} of {Math.max(1, pagination.totalPages)}
                        </span>

                        <button
                            type="button"
                            disabled={
                                page >= pagination.totalPages || loading
                            }
                            onClick={() => setPage((current) => current + 1)}
                            className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:opacity-40"
                            aria-label="Next page"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ActivityLogs;
