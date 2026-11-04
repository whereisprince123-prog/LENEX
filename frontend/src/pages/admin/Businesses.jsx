
import { useCallback, useEffect, useState } from "react";
import {
    Search,
    RefreshCw,
    Building2,
    Eye,
    X,
    CheckCircle2,
    Clock3,
    Ban,
    AlertCircle,
    Users,
    UserRound,
    Wallet,
    MapPin,
    Mail,
    Phone
} from "lucide-react";
import adminApi from "../../services/adminApi";

const statuses = ["ALL", "PENDING", "ACTIVE", "SUSPENDED", "INACTIVE"];

const statusStyles = {
    ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
    SUSPENDED: "bg-red-50 text-red-700 ring-red-600/20",
    INACTIVE: "bg-slate-100 text-slate-600 ring-slate-500/20"
};

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime())
        ? "—"
        : date.toLocaleDateString();
};

const Businesses = () => {
    const [businesses, setBusinesses] = useState([]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchBusinesses = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await adminApi.get("/admin/businesses");
            const data = response.data.data;

            setBusinesses(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch businesses error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load businesses. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBusinesses();
    }, [fetchBusinesses]);

    const filteredBusinesses = businesses.filter((business) => {
        const query = search.trim().toLowerCase();

        const matchesSearch =
            !query ||
            [
                business.business_name,
                business.business_email,
                business.business_phone,
                business.business_address
            ].some((value) =>
                String(value || "").toLowerCase().includes(query)
            );

        const matchesStatus =
            statusFilter === "ALL" ||
            business.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const openDetails = async (business) => {
        setSelectedBusiness(business);
        setDetailsLoading(true);
        setError("");

        try {
            const response = await adminApi.get(
                `/admin/businesses/${business.business_id}`
            );

            setSelectedBusiness(response.data.data);
        } catch (err) {
            console.error("Business details error:", err);

            setNotice(
                err.response?.data?.message ||
                "Could not load the latest business details."
            );
        } finally {
            setDetailsLoading(false);
        }
    };

    const changeStatus = async (business, newStatus) => {
        if (business.status === newStatus) return;

        const confirmed = window.confirm(
            `Change ${business.business_name}'s status from ${business.status} to ${newStatus}?`
        );

        if (!confirmed) return;

        try {
            setUpdatingId(business.business_id);
            setError("");
            setNotice("");

            await adminApi.patch(
                `/admin/businesses/${business.business_id}/status`,
                { status: newStatus }
            );

            setBusinesses((current) =>
                current.map((item) =>
                    item.business_id === business.business_id
                        ? { ...item, status: newStatus }
                        : item
                )
            );

            setSelectedBusiness((current) =>
                current &&
                current.business_id === business.business_id
                    ? { ...current, status: newStatus }
                    : current
            );

            setNotice(
                `${business.business_name} is now ${newStatus.toLowerCase()}.`
            );
        } catch (err) {
            console.error("Update business status error:", err);

            setError(
                err.response?.data?.message ||
                "Could not update the business status."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const totalBusinesses = businesses.length;
    const activeBusinesses = businesses.filter(
        (business) => business.status === "ACTIVE"
    ).length;
    const pendingBusinesses = businesses.filter(
        (business) => business.status === "PENDING"
    ).length;
    const suspendedBusinesses = businesses.filter(
        (business) => business.status === "SUSPENDED"
    ).length;

    const summaryCards = [
        {
            label: "Total businesses",
            value: totalBusinesses,
            icon: Building2,
            color: "bg-indigo-50 text-indigo-600"
        },
        {
            label: "Active",
            value: activeBusinesses,
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-600"
        },
        {
            label: "Pending",
            value: pendingBusinesses,
            icon: Clock3,
            color: "bg-amber-50 text-amber-600"
        },
        {
            label: "Suspended",
            value: suspendedBusinesses,
            icon: Ban,
            color: "bg-red-50 text-red-600"
        }
    ];

    return (
        <div className="space-y-7">
            <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <p className="text-sm font-semibold text-indigo-600">
                        PLATFORM MANAGEMENT
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                        Businesses
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        View registered businesses and manage their status.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={fetchBusinesses}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-100 disabled:opacity-60 sm:self-auto"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>
            </section>

            {error && (
                <div
                    role="alert"
                    className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                    <AlertCircle size={19} />
                    <span>{error}</span>
                </div>
            )}

            {notice && (
                <div
                    role="status"
                    className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
                >
                    <span>{notice}</span>
                    <button
                        type="button"
                        onClick={() => setNotice("")}
                        aria-label="Dismiss notification"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {summaryCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <article
                            key={card.label}
                            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-500">
                                    {card.label}
                                </span>
                                <span className={`rounded-xl p-2.5 ${card.color}`}>
                                    <Icon size={20} />
                                </span>
                            </div>

                            <p className="mt-4 text-3xl font-bold text-slate-900">
                                {loading && businesses.length === 0
                                    ? "—"
                                    : card.value.toLocaleString()}
                            </p>
                        </article>
                    );
                })}
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-900">
                            Registered businesses
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                            {filteredBusinesses.length} result(s)
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search businesses..."
                                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-64"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                            aria-label="Filter by business status"
                        >
                            {statuses.map((status) => (
                                <option key={status} value={status}>
                                    {status === "ALL"
                                        ? "All statuses"
                                        : status}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {loading && businesses.length === 0 ? (
                    <div className="p-12 text-center text-sm text-slate-500">
                        Loading businesses...
                    </div>
                ) : !error && filteredBusinesses.length === 0 ? (
                    <div className="p-12 text-center">
                        <Building2
                            size={32}
                            className="mx-auto text-slate-300"
                        />
                        <p className="mt-3 font-semibold text-slate-700">
                            No businesses found
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            Try another search or status filter.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[950px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-5 py-4 font-semibold">
                                        Business
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Contact
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Users
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Customers
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Debts
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Status
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Registered
                                    </th>
                                    <th className="px-5 py-4 font-semibold">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredBusinesses.map((business) => (
                                    <tr
                                        key={business.business_id}
                                        className="transition hover:bg-slate-50/70"
                                    >
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-slate-900">
                                                {business.business_name}
                                            </div>
                                            <div className="mt-1 text-xs text-slate-500">
                                                ID: {business.business_id}
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <p className="text-slate-700">
                                                {business.business_email || "—"}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {business.business_phone || "—"}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            {business.total_users ?? 0}
                                        </td>

                                        <td className="px-5 py-4">
                                            {business.total_customers ?? 0}
                                        </td>

                                        <td className="px-5 py-4">
                                            {business.total_debts ?? 0}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                                                    statusStyles[business.status] ||
                                                    statusStyles.INACTIVE
                                                }`}
                                            >
                                                {business.status}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-slate-600">
                                            {formatDate(business.created_at)}
                                        </td>

                                        <td className="px-5 py-4">
                                            <button
                                                type="button"
                                                onClick={() => openDetails(business)}
                                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                                            >
                                                <Eye size={15} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            {selectedBusiness && (
                <div
                    className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/50 p-0 sm:items-center sm:p-5"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedBusiness(null);
                        }
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="business-details-title"
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
                    >
                        <div className="flex items-start justify-between border-b border-slate-100 p-5 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h3
                                        id="business-details-title"
                                        className="text-lg font-bold text-slate-900"
                                    >
                                        Business details
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">
                                        ID: {selectedBusiness.business_id}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSelectedBusiness(null)}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                                aria-label="Close business details"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {detailsLoading ? (
                            <p className="p-8 text-center text-sm text-slate-500">
                                Loading latest details...
                            </p>
                        ) : (
                            <div className="space-y-6 p-5 sm:p-6">
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900">
                                        {selectedBusiness.business_name}
                                    </h4>
                                    <span
                                        className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                                            statusStyles[selectedBusiness.status] ||
                                            statusStyles.INACTIVE
                                        }`}
                                    >
                                        {selectedBusiness.status}
                                    </span>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex gap-3">
                                        <Mail
                                            size={18}
                                            className="mt-0.5 text-slate-400"
                                        />
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Email
                                            </p>
                                            <p className="mt-1 break-all text-sm font-medium">
                                                {selectedBusiness.business_email || "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Phone
                                            size={18}
                                            className="mt-0.5 text-slate-400"
                                        />
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Phone
                                            </p>
                                            <p className="mt-1 text-sm font-medium">
                                                {selectedBusiness.business_phone || "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <MapPin
                                            size={18}
                                            className="mt-0.5 text-slate-400"
                                        />
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Address
                                            </p>
                                            <p className="mt-1 text-sm font-medium">
                                                {selectedBusiness.business_address || "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Clock3
                                            size={18}
                                            className="mt-0.5 text-slate-400"
                                        />
                                        <div>
                                            <p className="text-xs text-slate-500">
                                                Registered
                                            </p>
                                            <p className="mt-1 text-sm font-medium">
                                                {formatDate(selectedBusiness.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-5">
                                    <h4 className="mb-3 font-semibold text-slate-900">
                                        Change business status
                                    </h4>

                                    <p className="mb-4 text-sm text-slate-500">
                                        A status change can affect the business owner's ability to sign in.
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {statuses
                                            .filter((status) => status !== "ALL")
                                            .map((status) => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    disabled={
                                                        selectedBusiness.status === status ||
                                                        updatingId === selectedBusiness.business_id
                                                    }
                                                    onClick={() =>
                                                        changeStatus(
                                                            selectedBusiness,
                                                            status
                                                        )
                                                    }
                                                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                                                        selectedBusiness.status === status
                                                            ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                                                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    {updatingId === selectedBusiness.business_id &&
                                                    selectedBusiness.status !== status
                                                        ? "Updating..."
                                                        : status}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
};

export default Businesses;
