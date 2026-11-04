const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-RW").format(amount) + " RWF";
};

const OverdueDebts = ({ debts }) => {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="font-semibold text-gray-900">
                    Overdue Debts
                </h2>

                <p className="text-sm text-gray-500">
                    Customers who have passed their due date
                </p>
            </div>

            <div className="divide-y divide-gray-100">
                {debts.length === 0 ? (
                    <div className="px-5 py-10 text-center text-sm text-gray-500">
                        🎉 No overdue debts.
                    </div>
                ) : (
                    debts.map((debt) => (
                        <div
                            key={debt.debt_id}
                            className="flex items-center justify-between px-5 py-4"
                        >
                            <div>
                                <p className="font-medium text-gray-900">
                                    {debt.customer_name}
                                </p>

                                <p className="text-xs text-gray-500">
                                    Due:{" "}
                                    {new Date(
                                        debt.due_date
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-semibold text-red-600">
                                    {formatMoney(debt.amount)}
                                </p>

                                <p className="text-xs text-red-500">
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