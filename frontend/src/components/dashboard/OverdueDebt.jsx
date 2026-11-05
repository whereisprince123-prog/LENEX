
const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-RW").format(amount) + " RWF";
};

const OverdueDebts = ({ debts }) => {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">

            {/* HEADER */}
            <div className="border-b border-gray-100 px-5 py-4 dark:border-slate-800">
                <h2 className="font-semibold text-gray-900 dark:text-white">
                    Overdue Debts
                </h2>

                <p className="text-sm text-gray-500 dark:text-slate-400">
                    Customers who have passed their due date
                </p>
            </div>

            {/* DEBT LIST */}
            <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {debts.length === 0 ? (
                    <div className="px-5 py-10 text-center text-sm text-gray-500 dark:text-slate-400">
                        🎉 No overdue debts.
                    </div>
                ) : (
                    debts.map((debt) => (
                        <div
                            key={debt.debt_id}
                            className="flex items-center justify-between gap-3 px-5 py-4 transition hover:bg-gray-50 dark:hover:bg-slate-800/60"
                        >
                            <div className="min-w-0">
                                <p className="truncate font-medium text-gray-900 dark:text-white">
                                    {debt.customer_name}
                                </p>

                                <p className="text-xs text-gray-500 dark:text-slate-400">
                                    Due:{" "}
                                    {new Date(
                                        debt.due_date
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="shrink-0 text-right">
                                <p className="font-semibold text-red-600 dark:text-red-400">
                                    {formatMoney(debt.amount)}
                                </p>

                                <p className="text-xs text-red-500 dark:text-red-400">
                                    Overdue
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default OverdueDebts;
