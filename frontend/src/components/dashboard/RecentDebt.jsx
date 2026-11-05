
const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-RW").format(amount) + " RWF";
};

const getStatusStyle = (status) => {
    switch (status) {
        case "PAID":
            return "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400";

        case "OVERDUE":
            return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400";

        default:
            return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400";
    }
};

const RecentDebts = ({ debts }) => {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-800">
                <div>
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                        Recent Debts
                    </h2>

                    <p className="text-sm text-gray-500 dark:text-slate-400">
                        Latest customer debts
                    </p>
                </div>

                <button
                    type="button"
                    className="text-sm font-medium text-sky-600 transition hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300"
                >
                    View all
                </button>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">

                    <thead>
                        <tr className="border-b border-gray-100 text-left dark:border-slate-800">
                            <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-400 dark:text-slate-500">
                                Customer
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-400 dark:text-slate-500">
                                Amount
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-400 dark:text-slate-500">
                                Due Date
                            </th>

                            <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-400 dark:text-slate-500">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {debts.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-5 py-10 text-center text-sm text-gray-500 dark:text-slate-400"
                                >
                                    No debts recorded yet.
                                </td>
                            </tr>
                        ) : (
                            debts.map((debt) => (
                                <tr
                                    key={debt.debt_id}
                                    className="border-b border-gray-50 transition last:border-0 hover:bg-gray-50 dark:border-slate-800/70 dark:hover:bg-slate-800/60"
                                >
                                    <td className="px-5 py-4">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {debt.customer_name}
                                            </p>

                                            <p className="text-xs text-gray-500 dark:text-slate-400">
                                                {debt.phone_number}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 font-medium text-gray-900 dark:text-slate-200">
                                        {formatMoney(debt.amount)}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-gray-600 dark:text-slate-300">
                                        {new Date(
                                            debt.due_date
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                debt.status
                                            )}`}
                                        >
                                            {debt.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentDebts;
