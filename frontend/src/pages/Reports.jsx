
import { useEffect, useState } from "react";
import {
    Wallet,
    TrendingUp,
    Clock,
    AlertTriangle,
    RefreshCw,
    FileBarChart,
    Search,
    ChevronLeft,
    ChevronRight,
    CalendarDays
} from "lucide-react";

import { getFinancialSummary, getPaymentHistory } from "../services/reportService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-RW", {
        style: "currency",
        currency: "RWF",
        maximumFractionDigits: 0
    }).format(Number(amount || 0));
};

const SummaryCard = ({ title, value, description, icon: Icon }) => (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Icon size={21} />
            </div>
        </div>

        <h3 className="mt-4 text-2xl font-bold text-gray-900">
            {value}
        </h3>

        <p className="mt-2 text-xs text-gray-500">{description}</p>
    </div>
);

const Reports = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [payments, setPayments] = useState([]);
const [paymentLoading, setPaymentLoading] = useState(false);
const [paymentError, setPaymentError] = useState("");
const [paymentSearch, setPaymentSearch] = useState("");
const [paymentPage, setPaymentPage] = useState(1);
const [paymentPagination, setPaymentPagination] = useState({
    currentPage: 1,
    limit: 10,
    totalRecords: 0,
    totalPages: 0
});

    const [filters, setFilters] = useState({
        startDate: "",
        endDate: ""
    });

    const loadReport = async () => {
        try {
            setLoading(true);
            setError("");

            const result = await getFinancialSummary(filters);

            setReport(result.data);
        } catch (err) {
            console.error("Reports error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load reports. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const loadPaymentHistory = async (page = 1, search = paymentSearch) => {
    try {
        setPaymentLoading(true);
        setPaymentError("");

        const result = await getPaymentHistory({
            ...filters,
            page,
            limit: 10,
            search
        });

        setPayments(result.data || []);
        setPaymentPagination(result.pagination);
        setPaymentPage(page);

    } catch (err) {
        console.error("Payment history error:", err);

        setPaymentError(
            err.response?.data?.message ||
            "Unable to load payment history."
        );
    } finally {
        setPaymentLoading(false);
    }
};

    useEffect(() => {
        loadReport();
        loadPaymentHistory(1, "");
    }, []);

    const handleFilter = (event) => {
        event.preventDefault();
        loadReport();
        loadPaymentHistory(1, paymentSearch);
    };
const clearFilters = async () => {
    const emptyFilters = {
        startDate: "",
        endDate: ""
    };

    setFilters(emptyFilters);
    setPaymentSearch("");

    try {
        setLoading(true);
        setPaymentLoading(true);
        setError("");
        setPaymentError("");

        const [summaryResult, paymentResult] = await Promise.all([
            getFinancialSummary(emptyFilters),
            getPaymentHistory({
                ...emptyFilters,
                page: 1,
                limit: 10,
                search: ""
            })
        ]);

        setReport(summaryResult.data);
        setPayments(paymentResult.data || []);
        setPaymentPagination(
            paymentResult.pagination || {
                currentPage: 1,
                limit: 10,
                totalRecords: 0,
                totalPages: 0
            }
        );
        setPaymentPage(1);

    } catch (err) {
        console.error("Clear report filters error:", err);

        setError(
            err.response?.data?.message ||
            "Unable to reload reports."
        );

    } finally {
        setLoading(false);
        setPaymentLoading(false);
    }
};



    if (loading && !report) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <RefreshCw className="animate-spin text-blue-600" size={28} />
                <span className="ml-3 text-gray-500">
                    Loading reports...
                </span>
            </div>
        );
    }

    const financial = report?.financial;
  const status = report?.debtStatus || {};

  // Export payment history and financial summary to CSV
const exportCSV = () => {
    const rows = [
        ["LENEX BUSINESS REPORT"],
        ["Total Debt", financial?.totalDebtAmount || 0],
        ["Total Collected", financial?.totalCollected || 0],
        ["Outstanding Balance", financial?.outstandingBalance || 0],
        ["Overdue Balance", financial?.overdueBalance || 0],
        [],
        [
            "Customer",
            "Phone",
            "Debt Description",
            "Payment Date",
            "Amount Paid",
            "Recorded By"
        ],
        ...payments.map((payment) => [
            payment.customer_name || "",
            payment.phone_number || "",
            payment.debt_description || "",
            payment.payment_date || "",
            payment.amount_paid || 0,
            payment.recorded_by_name || "Unknown"
        ])
    ];

    const csvContent = rows
        .map((row) =>
            row.map((value) =>
                `"${String(value ?? "").replace(/"/g, '""')}"`
            ).join(",")
        )
        .join("\n");

    const blob = new Blob(
        ["\uFEFF" + csvContent],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "lenex-business-report.csv";
    link.click();

    URL.revokeObjectURL(url);
};

// Export financial summary and payment history to PDF
const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("LENEX Business Report", 14, 20);

    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

    doc.setFontSize(14);
    doc.text("Financial Overview", 14, 42);

    autoTable(doc, {
        startY: 48,
        head: [["Financial Item", "Amount"]],
        body: [
            ["Total Debt", formatCurrency(financial?.totalDebtAmount)],
            ["Total Collected", formatCurrency(financial?.totalCollected)],
            ["Outstanding Balance", formatCurrency(financial?.outstandingBalance)],
            ["Overdue Balance", formatCurrency(financial?.overdueBalance)]
        ]
    });

    const nextY = doc.lastAutoTable.finalY + 12;

    doc.setFontSize(14);
    doc.text("Payment History", 14, nextY);

    autoTable(doc, {
        startY: nextY + 6,
        head: [[
            "Customer",
            "Phone",
            "Debt",
            "Payment Date",
            "Amount Paid",
            "Recorded By"
        ]],
        body: payments.map((payment) => [
            payment.customer_name || "",
            payment.phone_number || "",
            payment.debt_description || "",
            payment.payment_date
                ? new Date(payment.payment_date).toLocaleDateString()
                : "",
            formatCurrency(payment.amount_paid),
            payment.recorded_by_name || "Unknown"
        ]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [37, 99, 235] }
    });

    doc.save("lenex-business-report.pdf");
};

// Print the report page
const printReport = () => {
    window.print();
};

    return (
        <div className="space-y-7">

          {/* Page heading */}
<div className="reports-no-print flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
    <div>
        <div className="flex items-center gap-2">
            <FileBarChart className="text-blue-600" size={25} />
            <h1 className="text-2xl font-bold text-gray-900">
                Business Reports
            </h1>
        </div>

        <p className="mt-2 text-sm text-gray-500">
            Understand your debts, collections and outstanding balances.
        </p>
    </div>

    <div className="flex flex-wrap gap-2">
        <button
            onClick={exportCSV}
            disabled={!report}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
            Export CSV
        </button>

        <button
            onClick={exportPDF}
            disabled={!report}
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
            Export PDF
        </button>

        <button
            onClick={printReport}
            disabled={!report}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
            Print
        </button>

        <button
            onClick={() => {
                loadReport();
                loadPaymentHistory(1, paymentSearch);
            }}
            disabled={loading || paymentLoading}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
            <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
            />
            Refresh
        </button>
    </div>
</div>

            {/* Date filters */}
          <form
    onSubmit={handleFilter}
    className="reports-no-print flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-end"
>
                <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        Start date
                    </label>

                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) =>
                            setFilters({ ...filters, startDate: e.target.value })
                        }
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        End date
                    </label>

                    <input
                        type="date"
                        value={filters.endDate}
                        min={filters.startDate || undefined}
                        onChange={(e) =>
                            setFilters({ ...filters, endDate: e.target.value })
                        }
                        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 outline-none focus:border-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    Apply filters
                </button>

                <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Clear
                </button>
            </form>

            {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertTriangle size={20} />
                    {error}
                </div>
            )}

            {/* Financial summary */}
            {financial && (
                <>
                    <div>
                        <h2 className="mb-4 text-lg font-semibold text-gray-900">
                            Financial Overview
                        </h2>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <SummaryCard
                                title="Total debt"
                                value={formatCurrency(financial.totalDebtAmount)}
                                description={`${financial.totalDebtRecords} debt records`}
                                icon={Wallet}
                            />

                            <SummaryCard
                                title="Total collected"
                                value={formatCurrency(financial.totalCollected)}
                                description={`${financial.paymentCount} payment transactions`}
                                icon={TrendingUp}
                            />

                            <SummaryCard
                                title="Outstanding balance"
                                value={formatCurrency(financial.outstandingBalance)}
                                description="Remaining amount on active debts"
                                icon={Clock}
                            />

                            <SummaryCard
                                title="Overdue balance"
                                value={formatCurrency(financial.overdueBalance)}
                                description={`${financial.overdueCount} overdue debts`}
                                icon={AlertTriangle}
                            />
                        </div>
                    </div>

                    {/* Debt status */}
                    <div className="rounded-2xl border border-gray-200 bg-white p-5">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Debt Status Breakdown
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Number of debts in each category.
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
                            {[
                               { label: "Paid", value: status?.paid, color: "text-green-600", bg: "bg-green-50" },
    { label: "Unpaid", value: status?.unpaid, color: "text-gray-700", bg: "bg-gray-100" },
    { label: "Partially paid", value: status?.partiallyPaid, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Overdue", value: status?.overdue, color: "text-red-600", bg: "bg-red-50" },
    { label: "Cancelled", value: status?.cancelled, color: "text-gray-500", bg: "bg-gray-100" },
    { label: "All records", value: status?.totalRecords, color: "text-purple-600", bg: "bg-purple-50" }
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className={`${item.bg} rounded-xl p-4`}
                                >
                                    <p className="text-xs font-medium text-gray-600">
                                        {item.label}
                                    </p>

                                    <p className={`mt-2 text-2xl font-bold ${item.color}`}>
                                        {item.value ?? 0}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                     
                  {/* PAYMENT HISTORY */}
                       <div className="rounded-2xl border border-gray-200 bg-white p-5">

    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
            <h2 className="text-lg font-semibold text-gray-900">
                Payment History
            </h2>
            <p className="mt-1 text-sm text-gray-500">
                View payments received from your customers.
            </p>
        </div>

        <div className="relative w-full sm:w-72">
            <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
                type="text"
                placeholder="Search customer or debt..."
                value={paymentSearch}
                onChange={(e) => setPaymentSearch(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        loadPaymentHistory(1, paymentSearch);
                    }
                }}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
            />
        </div>
    </div>

    <div className="mt-4 flex justify-end">
        <button
            onClick={() => loadPaymentHistory(1, paymentSearch)}
            disabled={paymentLoading}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
            Search payments
        </button>
    </div>

    {paymentError && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {paymentError}
        </div>
    )}

    <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">

            <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Phone</th>
                    <th className="px-4 py-3 font-medium">Debt</th>
                    <th className="px-4 py-3 font-medium">Payment date</th>
                    <th className="px-4 py-3 font-medium">Amount paid</th>
                    <th className="px-4 py-3 font-medium">Recorded by</th>
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

                {paymentLoading ? (
                    <tr>
                        <td colSpan="6" className="px-4 py-10 text-center text-gray-500">
                            Loading payment history...
                        </td>
                    </tr>
                ) : payments.length === 0 ? (
                    <tr>
                        <td colSpan="6" className="px-4 py-10 text-center text-gray-500">
                            <CalendarDays size={28} className="mx-auto mb-2 text-gray-400" />
                            No payment records found.
                        </td>
                    </tr>
                ) : (
                    payments.map((payment) => (
                        <tr
                            key={payment.payment_id}
                            className="hover:bg-gray-50"
                        >
                            <td className="px-4 py-4 font-medium text-gray-900">
                                {payment.customer_name}
                            </td>

                            <td className="px-4 py-4 text-gray-600">
                                {payment.phone_number}
                            </td>

                            <td className="max-w-[180px] truncate px-4 py-4 text-gray-600">
                                {payment.debt_description || "—"}
                            </td>

                            <td className="whitespace-nowrap px-4 py-4 text-gray-600">
                                {payment.payment_date
                                    ? new Date(payment.payment_date).toLocaleDateString()
                                    : "—"}
                            </td>

                            <td className="whitespace-nowrap px-4 py-4 font-semibold text-green-700">
                                {formatCurrency(payment.amount_paid)}
                            </td>

                            <td className="px-4 py-4 text-gray-600">
                                {payment.recorded_by_name || "Unknown"}
                            </td>
                        </tr>
                    ))
                )}

            </tbody>
        </table>
    </div>

    {/* Pagination */}
    <div className="mt-5 flex flex-col justify-between gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">

        <p className="text-sm text-gray-500">
            Showing {payments.length} of {paymentPagination.totalRecords} payments
        </p>

        <div className="flex items-center gap-3">

            <button
                onClick={() => loadPaymentHistory(paymentPage - 1)}
                disabled={paymentPage <= 1 || paymentLoading}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
                <ChevronLeft size={16} />
                Previous
            </button>

            <span className="text-sm text-gray-600">
                Page {paymentPagination.currentPage || 1} of {paymentPagination.totalPages || 1}
            </span>

            <button
                onClick={() => loadPaymentHistory(paymentPage + 1)}
                disabled={
                    paymentPage >= paymentPagination.totalPages ||
                    paymentLoading
                }
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
                Next
                <ChevronRight size={16} />
            </button>

        </div>
    </div>

                       </div>
                    
                </>

               
            )}
        </div>
    );
};

export default Reports;
