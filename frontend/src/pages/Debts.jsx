import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Pencil,
    X,
    Eye,
    CheckCircle2,
    XCircle,
    ReceiptText,
    CalendarDays,
    UserRound,
    ClockAlert,
    Banknote,
} from "lucide-react";

import api from "../services/api";

const Debts = () => {
    const [debts, setDebts] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingDebt, setEditingDebt] = useState(null);

    const [selectedDebt, setSelectedDebt] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const [cancelDebt, setCancelDebt] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    const [payingDebt, setPayingDebt] = useState(null);
    const [paying, setPaying] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentNotes, setPaymentNotes] = useState("");

    

    

    const [formData, setFormData] = useState({
        customer_id: "",
        amount: "",
        description: "",
        debt_date: "",
        due_date: "",
        notes: ""
    });

    // ==========================================
    // LOAD DEBTS
    // ==========================================

    const loadDebts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/debts");

            setDebts(response.data.data || []);

        } catch (error) {
            console.error("Load debts error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to load debts."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // LOAD CUSTOMERS
    // ==========================================

    const loadCustomers = async () => {
        try {
            const response = await api.get("/customers");

            setCustomers(response.data.data || []);

        } catch (error) {
            console.error("Load customers error:", error);
        }
    };

    useEffect(() => {
        loadDebts();
        loadCustomers();
    }, []);

    // ==========================================
    // FORM HANDLING
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const openAddModal = () => {
        setEditingDebt(null);

        setFormData({
            customer_id: "",
            amount: "",
            description: "",
            debt_date: new Date().toISOString().split("T")[0],
            due_date: "",
            notes: ""
        });

        setShowModal(true);
    };

    const openEditModal = (debt) => {
        setEditingDebt(debt);

        setFormData({
            customer_id: debt.customer_id,
            amount: debt.amount,
            description: debt.description || "",
            debt_date: debt.debt_date
                ? debt.debt_date.split("T")[0]
                : "",
            due_date: debt.due_date
                ? debt.due_date.split("T")[0]
                : "",
            notes: debt.notes || ""
        });

        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingDebt(null);
    };

    // ==========================================
    // CREATE / UPDATE DEBT
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");

            if (editingDebt) {
                await api.put(
                    `/debts/${editingDebt.debt_id}`,
                    formData
                );
            } else {
                await api.post(
                    "/debts",
                    formData
                );
            }

            setShowModal(false);
            setEditingDebt(null);

            await loadDebts();

        } catch (error) {
            console.error("Save debt error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to save debt."
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // CANCEL DEBT
    // ==========================================

    const handleCancelDebt = async () => {
        if (!cancelDebt) return;

        try {
            setCancelling(true);

            await api.patch(
                `/debts/${cancelDebt.debt_id}/cancel`
            );

            setDebts((previous) =>
                previous.map((debt) =>
                    debt.debt_id === cancelDebt.debt_id
                        ? {
                              ...debt,
                              status: "CANCELLED"
                          }
                        : debt
                )
            );

            setCancelDebt(null);

        } catch (error) {
            console.error("Cancel debt error:", error);

            setError(
                error.response?.data?.message ||
                "Unable to cancel debt."
            );
        } finally {
            setCancelling(false);
        }
    };

    // ==========================================
    // FORMAT MONEY
    // ==========================================

    const formatMoney = (amount) => {
        return (
            new Intl.NumberFormat("en-RW").format(
                Number(amount || 0)
            ) + " RWF"
        );
    };

    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };

    // ==========================================
    // STATUS
    // ==========================================

    const getEffectiveStatus = (debt) => {
        if (debt.status === "PAID") {
            return "PAID";
        }

        if (debt.status === "CANCELLED") {
            return "CANCELLED";
        }

        if (debt.status === "PARTIALLY_PAID") {
            if (
                debt.due_date &&
                new Date(debt.due_date) <
                    new Date(new Date().setHours(0, 0, 0, 0))
            ) {
                return "OVERDUE";
            }

            return "PARTIALLY_PAID";
        }

        if (
            debt.status === "OVERDUE" ||
            (
                debt.status === "UNPAID" &&
                debt.due_date &&
                new Date(debt.due_date) <
                    new Date(
                        new Date().setHours(0, 0, 0, 0)
                    )
            )
        ) {
            return "OVERDUE";
        }

        return "UNPAID";
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case "PAID":
                return "bg-green-100 text-green-700";

            case "OVERDUE":
                return "bg-red-100 text-red-700";

            case "PARTIALLY_PAID":
                return "bg-sky-100 text-sky-700";

            case "CANCELLED":
                return "bg-gray-100 text-gray-600";

            default:
                return "bg-yellow-100 text-yellow-700";
        }
    };

    // ==========================================
// RECORD PAYMENT
// ==========================================

    const openPaymentModal = (debt) => {
        const remaining = Math.max(
            Number(debt.remaining_amount ?? (Number(debt.amount || 0) - Number(debt.amount_paid || 0))),
            0
        );

        setPayingDebt({
            ...debt,
            amount_paid: Number(debt.amount_paid || 0),
            remaining_amount: remaining
        });
        setPaymentAmount("");
        setPaymentNotes("");
        setError("");
    };

    const closePaymentModal = () => {
        if (paying) return;

        setPayingDebt(null);
        setPaymentAmount("");
        setPaymentNotes("");
    };
const handleRecordPayment = async (e) => {
    e.preventDefault();

    if (!payingDebt) {
        return;
    }

    const amount = Number(paymentAmount);
    const remaining = Number(payingDebt.remaining_amount);

    if (!amount || amount <= 0) {
        setError("Please enter a valid payment amount.");
        return;
    }

    if (amount > remaining) {
        setError(
            `Payment cannot be greater than the remaining balance of ${remaining.toLocaleString()} RWF.`
        );
        return;
    }

    try {
        setPaying(true);
        setError("");

        const response = await api.post(
            `/debts/${payingDebt.debt_id}/payments`,
            {
                amount_paid: amount,
                notes: paymentNotes || null
            }
        );

        console.log("Payment recorded:", response.data);

       // Close payment modal
setPayingDebt(null);

        // Clear form
        setPaymentAmount("");
        setPaymentNotes("");
        setPayingDebt(null);

        // Refresh debts
        await loadDebts();

    } catch (error) {
        console.error("Record payment error:", error);

        setError(
            error.response?.data?.message ||
            "Failed to record payment."
        );
    } finally {
        setPaying(false);
    }
};


    // ==========================================
    // PAGE
    // ==========================================

    const unpaidDebts = debts.filter(
        (debt) => getEffectiveStatus(debt) === "UNPAID"
    );

    const overdueDebts = debts.filter(
        (debt) => getEffectiveStatus(debt) === "OVERDUE"
    );

    const paidDebts = debts.filter(
        (debt) => getEffectiveStatus(debt) === "PAID"
    );

    const partiallyPaidDebts = debts.filter(
        (debt) => getEffectiveStatus(debt) === "PARTIALLY_PAID"
    );

    const filteredDebts = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return debts;
        }

        return debts.filter((debt) =>
            [
                debt.customer_name,
                debt.phone_number,
                debt.description,
                debt.amount,
                debt.status,
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(query)
                )
        );
    }, [debts, search]);

    const getInitials = (name = "") => {
        return name
            .split(" ")
            .filter(Boolean)
            .map((word) => word.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();
    };

    return (
        <div className="lenex-debts space-y-6">

            {/* HEADER */}

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                            <ReceiptText size={19} />
                        </div>

                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-500">
                            Debts
                        </span>
                    </div>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">
                        Debt Management
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Record and track customer credit with confidence.
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
                >
                    <Plus size={18} />
                    Record Debt
                </button>
            </div>

            {/* ERROR */}

            {error && (
                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* SUMMARY CARDS */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Total Debts
                            </p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {debts.length}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                            <ReceiptText size={21} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Unpaid
                            </p>
                            <p className="mt-2 text-xl font-bold text-gray-900">
                                {formatMoney(
                                    unpaidDebts.reduce(
                                        (total, debt) =>
                                            total + Number(debt.amount || 0),
                                        0
                                    )
                                )}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                            <Banknote size={21} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Overdue
                            </p>
                            <p className="mt-2 text-xl font-bold text-gray-900">
                                {formatMoney(
                                    overdueDebts.reduce(
                                        (total, debt) =>
                                            total + Number(debt.amount || 0),
                                        0
                                    )
                                )}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                            <ClockAlert size={21} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Paid
                            </p>
                            <p className="mt-2 text-xl font-bold text-gray-900">
                                {formatMoney(
                                    paidDebts.reduce(
                                        (total, debt) =>
                                            total + Number(debt.amount || 0),
                                        0
                                    )
                                )}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <CheckCircle2 size={21} />
                        </div>
                    </div>
                </div>
            </div>

            {/* DEBT TABLE */}

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                        <h2 className="font-semibold text-gray-900">
                            All Debt Records
                        </h2>

                        <p className="mt-1 text-xs text-gray-400">
                            {filteredDebts.length} record
                            {filteredDebts.length !== 1 ? "s" : ""}
                            {search ? " matching your search" : ""}
                        </p>
                    </div>

                    <div className="relative w-full sm:w-80">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search debts..."
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex min-h-[320px] items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-sky-500" />
                            <p className="mt-3 text-sm text-gray-500">
                                Loading debts...
                            </p>
                        </div>
                    </div>
                ) : filteredDebts.length === 0 ? (
                    <div className="px-6 py-20 text-center">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                            <ReceiptText size={28} strokeWidth={1.7} />
                        </div>

                        <h3 className="mt-5 text-lg font-semibold text-gray-900">
                            {search
                                ? "No debts found"
                                : "No debt records yet"}
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                            {search
                                ? "Try searching with a different customer, phone number or description."
                                : "Record your first customer debt to start tracking credit."}
                        </p>

                        {!search && (
                            <button
                                onClick={openAddModal}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                            >
                                <Plus size={17} />
                                Record Debt
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[950px]">

                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/70 text-left">

                                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                                        Customer
                                    </th>

                                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                                        Amount
                                    </th>

                                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                                        Debt Date
                                    </th>

                                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                                        Due Date
                                    </th>

                                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                                        Actions
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {filteredDebts.map((debt) => {

                                    const status = getEffectiveStatus(debt);

                                    return (
                                        <tr
                                            key={debt.debt_id}
                                            className="group border-b border-gray-100 last:border-0 transition hover:bg-gray-50/70"
                                        >

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-600">
                                                        {getInitials(
                                                            debt.customer_name
                                                        )}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate font-semibold text-gray-900">
                                                            {debt.customer_name}
                                                        </p>

                                                        <p className="mt-0.5 text-xs text-gray-400">
                                                            {debt.phone_number ||
                                                                "No phone number"}
                                                        </p>
                                                    </div>

                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">
                                                    {formatMoney(debt.amount)}
                                                </p>

                                                {Number(debt.amount_paid || 0) > 0 && (
                                                    <p className="mt-0.5 text-xs text-green-600">
                                                        Paid: {formatMoney(debt.amount_paid)}
                                                    </p>
                                                )}

                                                {Number(debt.remaining_amount || 0) > 0 && (
                                                    <p className="mt-0.5 text-xs text-gray-400">
                                                        Remaining: {formatMoney(debt.remaining_amount)}
                                                    </p>
                                                )}

                                                {debt.description && (
                                                    <p className="mt-0.5 max-w-[190px] truncate text-xs text-gray-400">
                                                        {debt.description}
                                                    </p>
                                                )}
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <CalendarDays
                                                        size={15}
                                                        className="text-gray-400"
                                                    />
                                                    {formatDate(debt.debt_date)}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <CalendarDays
                                                        size={15}
                                                        className="text-gray-400"
                                                    />
                                                    {formatDate(debt.due_date)}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                                                        status
                                                    )}`}
                                                >
                                                    {status === "PAID" && (
                                                        <CheckCircle2 size={14} />
                                                    )}

                                                    {status === "OVERDUE" && (
                                                        <ClockAlert size={14} />
                                                    )}

                                                    {status === "CANCELLED" && (
                                                        <XCircle size={14} />
                                                    )}

                                                    {status === "UNPAID" && (
                                                        <ReceiptText size={14} />
                                                    )}

                                                    {status === "PARTIALLY_PAID" && (
                                                        <Banknote size={14} />
                                                    )}

                                                    {status}
                                                </span>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex justify-end gap-1">

                                                    <button
                                                        onClick={() => {
                                                            setSelectedDebt(debt);
                                                            setShowDetails(true);
                                                        }}
                                                        title="View debt"
                                                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                                                    >
                                                        <Eye size={17} />
                                                    </button>

                                                    {status !== "PAID" &&
                                                        status !== "CANCELLED" && (
                                                            <>
                                                                <button
                                                                    onClick={() =>
                                                                        openPaymentModal(
                                                                            debt
                                                                        )
                                                                    }
                                                                    title="Record payment"
                                                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-green-50 hover:text-green-600"
                                                                >
                                                                    <CheckCircle2
                                                                        size={17}
                                                                    />
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        openEditModal(
                                                                            debt
                                                                        )
                                                                    }
                                                                    title="Edit debt"
                                                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-sky-50 hover:text-sky-600"
                                                                >
                                                                    <Pencil
                                                                        size={17}
                                                                    />
                                                                </button>

                                                                <button
                                                                    onClick={() =>
                                                                        setCancelDebt(
                                                                            debt
                                                                        )
                                                                    }
                                                                    title="Cancel debt"
                                                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                                                                >
                                                                    <XCircle
                                                                        size={17}
                                                                    />
                                                                </button>
                                                            </>
                                                        )}

                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ADD / EDIT MODAL */}

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">

                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                                    {editingDebt ? (
                                        <Pencil size={18} />
                                    ) : (
                                        <ReceiptText size={19} />
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        {editingDebt
                                            ? "Edit Debt"
                                            : "Record New Debt"}
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {editingDebt
                                            ? "Update this customer's credit information."
                                            : "Record a customer's credit information."}
                                    </p>
                                </div>

                            </div>

                            <button
                                onClick={closeModal}
                                disabled={saving}
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 p-6"
                        >

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Customer *
                                </label>

                                <div className="relative">

                                    <UserRound
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <select
                                        name="customer_id"
                                        value={formData.customer_id}
                                        onChange={handleChange}
                                        required
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50"
                                    >
                                        <option value="">
                                            Select customer
                                        </option>

                                        {customers.map((customer) => (
                                            <option
                                                key={customer.customer_id}
                                                value={customer.customer_id}
                                            >
                                                {customer.full_name} —{" "}
                                                {customer.phone_number}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Amount (RWF) *
                                </label>

                                <div className="relative">

                                    <Banknote
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                    <input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        min="1"
                                        step="1"
                                        placeholder="50000"
                                        required
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50"
                                    />

                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Description
                                </label>

                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="e.g. Rice - 2 bags"
                                    className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50"
                                />
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Debt Date *
                                    </label>

                                    <input
                                        type="date"
                                        name="debt_date"
                                        value={formData.debt_date}
                                        onChange={handleChange}
                                        required
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Due Date *
                                    </label>

                                    <input
                                        type="date"
                                        name="due_date"
                                        value={formData.due_date}
                                        onChange={handleChange}
                                        required
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50"
                                    />
                                </div>

                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Optional notes..."
                                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50"
                                />
                            </div>

                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={17} />
                                            {editingDebt
                                                ? "Save Changes"
                                                : "Record Debt"}
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}

            {/* VIEW DETAILS MODAL */}

            {showDetails && selectedDebt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]">

                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">

                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                                    <Eye size={18} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Debt Details
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Complete debt information
                                    </p>
                                </div>

                            </div>

                            <button
                                onClick={() => {
                                    setShowDetails(false);
                                    setSelectedDebt(null);
                                }}
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="space-y-5 p-6">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-sm font-bold text-sky-600">
                                    {getInitials(selectedDebt.customer_name)}
                                </div>

                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {selectedDebt.customer_name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {selectedDebt.phone_number ||
                                            "No phone number"}
                                    </p>
                                </div>

                            </div>

                            <div className="grid gap-3 sm:grid-cols-3">

                                <div className="rounded-xl bg-gray-50 p-4">
                                    <p className="text-xs text-gray-500">
                                        Original amount
                                    </p>

                                    <p className="mt-1 font-bold text-gray-900">
                                        {formatMoney(selectedDebt.amount)}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-green-50 p-4">
                                    <p className="text-xs text-green-600">
                                        Paid
                                    </p>

                                    <p className="mt-1 font-bold text-green-700">
                                        {formatMoney(selectedDebt.amount_paid || 0)}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-yellow-50 p-4">
                                    <p className="text-xs text-yellow-700">
                                        Remaining
                                    </p>

                                    <p className="mt-1 font-bold text-yellow-700">
                                        {formatMoney(
                                            selectedDebt.remaining_amount ??
                                                (Number(selectedDebt.amount || 0) - Number(selectedDebt.amount_paid || 0))
                                        )}
                                    </p>
                                </div>

                            </div>

                            <div className="rounded-xl bg-gray-50 p-4">
                                <p className="text-xs text-gray-500">
                                    Status
                                </p>

                                <span
                                    className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                                        getEffectiveStatus(selectedDebt)
                                    )}`}
                                >
                                    {getEffectiveStatus(selectedDebt)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Debt Date
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {formatDate(selectedDebt.debt_date)}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Due Date
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-gray-900">
                                        {formatDate(selectedDebt.due_date)}
                                    </p>
                                </div>

                            </div>

                            {selectedDebt.description && (
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Description
                                    </p>

                                    <p className="mt-1 text-sm text-gray-800">
                                        {selectedDebt.description}
                                    </p>
                                </div>
                            )}

                            {selectedDebt.notes && (
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Notes
                                    </p>

                                    <p className="mt-1 text-sm text-gray-800">
                                        {selectedDebt.notes}
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {/* CANCEL CONFIRMATION */}

            {cancelDebt && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]">

                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                            <XCircle size={24} />
                        </div>

                        <h2 className="mt-4 text-lg font-bold text-gray-900">
                            Cancel this debt?
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            This will mark the debt as cancelled. It will no
                            longer be treated as an unpaid debt.
                        </p>

                        <div className="mt-4 rounded-xl bg-gray-50 p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">
                                    Amount
                                </span>

                                <span className="font-bold text-gray-900">
                                    {formatMoney(cancelDebt.amount)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">

                            <button
                                onClick={() => setCancelDebt(null)}
                                disabled={cancelling}
                                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                            >
                                Keep Debt
                            </button>

                            <button
                                onClick={handleCancelDebt}
                                disabled={cancelling}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {cancelling
                                    ? "Cancelling..."
                                    : "Cancel Debt"}
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {/* RECORD PAYMENT MODAL */}

            {payingDebt && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]">

                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

                        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">

                            <div className="flex items-start gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                                    <Banknote size={19} />
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Record Payment
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Record a full or partial payment for this debt.
                                    </p>
                                </div>

                            </div>

                            <button
                                type="button"
                                onClick={closePaymentModal}
                                disabled={paying}
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <form onSubmit={handleRecordPayment} className="space-y-5 p-6">

                            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600">
                                        {getInitials(payingDebt.customer_name)}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900">
                                            {payingDebt.customer_name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {payingDebt.phone_number || "No phone number"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="rounded-xl border border-gray-100 bg-white p-3">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                        Debt
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-gray-900">
                                        {formatMoney(payingDebt.amount)}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-green-100 bg-green-50 p-3">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-green-600">
                                        Paid
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-green-700">
                                        {formatMoney(payingDebt.amount_paid || 0)}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-3">
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-yellow-700">
                                        Remaining
                                    </p>
                                    <p className="mt-1 text-sm font-bold text-yellow-700">
                                        {formatMoney(payingDebt.remaining_amount)}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Payment amount (RWF) *
                                </label>

                                <div className="relative">
                                    <Banknote
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="number"
                                        value={paymentAmount}
                                        onChange={(event) => setPaymentAmount(event.target.value)}
                                        min="1"
                                        max={payingDebt.remaining_amount}
                                        step="1"
                                        placeholder="e.g. 30000"
                                        required
                                        autoFocus
                                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50"
                                    />
                                </div>

                                <div className="mt-2 flex items-center justify-between text-xs">
                                    <span className="text-gray-400">
                                        Maximum payment
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentAmount(String(payingDebt.remaining_amount))}
                                        className="font-semibold text-sky-600 hover:text-sky-700"
                                    >
                                        Pay remaining {formatMoney(payingDebt.remaining_amount)}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Payment note
                                </label>
                                <textarea
                                    value={paymentNotes}
                                    onChange={(event) => setPaymentNotes(event.target.value)}
                                    rows="3"
                                    placeholder="Optional note about this payment..."
                                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50"
                                />
                            </div>

                            {paymentAmount && Number(paymentAmount) > 0 && Number(paymentAmount) <= Number(payingDebt.remaining_amount) && (
                                <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-medium text-sky-600">
                                                Balance after payment
                                            </p>
                                            <p className="mt-1 text-lg font-bold text-sky-700">
                                                {formatMoney(
                                                    Number(payingDebt.remaining_amount) - Number(paymentAmount)
                                                )}
                                            </p>
                                        </div>
                                        <Banknote size={22} className="text-sky-500" />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                                <button
                                    type="button"
                                    onClick={closePaymentModal}
                                    disabled={paying}
                                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

    <button
    type="submit"
    disabled={paying}
    className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
>
    {paying ? (
        <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Recording...
        </>
    ) : (
        <>
            <CheckCircle2 size={17} />
            Record Payment
        </>
    )}
</button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
export default Debts;