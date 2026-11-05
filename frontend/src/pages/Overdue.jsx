
import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Search } from "lucide-react";
import api from "../services/api";

const money = (value) =>
  `${new Intl.NumberFormat("en-RW").format(Number(value || 0))} RWF`;

const dateText = (value) => {
  if (!value) return "—";
  const date = String(value).slice(0, 10);
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

const Overdue = () => {
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadDebts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/debts");
      const allDebts = response.data.data || [];
      const today = new Date().toISOString().slice(0, 10);

      const overdue = allDebts.filter((debt) => {
        if (["PAID", "CANCELLED"].includes(debt.status)) return false;

        const dueDate = debt.due_date
          ? String(debt.due_date).slice(0, 10)
          : "";

        return (
          debt.status === "OVERDUE" ||
          (dueDate && dueDate < today)
        );
      });

      setDebts(overdue);
    } catch (err) {
      console.error("Load overdue debts error:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load overdue debts."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDebts();
  }, []);

  const filtered = debts.filter((debt) =>
    [
      debt.customer_name,
      debt.phone_number,
      debt.description,
    ].some((value) =>
      String(value || "").toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalOutstanding = filtered.reduce(
    (sum, debt) =>
      sum +
      Number(
        debt.remaining_amount ??
        (Number(debt.amount || 0) - Number(debt.amount_paid || 0))
      ),
    0
  );

  return (
    <div className="lenex-overdue space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-amber-600">
            <AlertTriangle size={20} />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Debt monitoring
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-gray-900">
            Overdue Debts
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Review customer debts that have passed their due dates.
          </p>
        </div>

        <button
          onClick={loadDebts}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <p className="text-sm text-gray-500">Overdue records</p>
          <p className="mt-2 text-2xl font-bold text-amber-600">
            {debts.length}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5">
          <p className="text-sm text-gray-500">Outstanding in results</p>
          <p className="mt-2 text-xl font-bold text-gray-900">
            {money(totalOutstanding)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <div className="relative mb-5 max-w-md">
          <Search
            size={17}
            className="absolute left-3 top-3 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer or debt..."
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-sky-400"
          />
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <p className="py-10 text-center text-sm text-gray-500">
            Loading overdue debts...
          </p>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <AlertTriangle className="mx-auto text-gray-300" size={32} />
            <p className="mt-3 font-semibold text-gray-800">
              No overdue debts found
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Overdue records will appear here when their due dates pass.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs uppercase text-gray-500">
                  <th className="px-3 py-3">Customer</th>
                  <th className="px-3 py-3">Description</th>
                  <th className="px-3 py-3">Original amount</th>
                  <th className="px-3 py-3">Remaining</th>
                  <th className="px-3 py-3">Due date</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filtered.map((debt) => {
                  const remaining = Math.max(
                    Number(
                      debt.remaining_amount ??
                      (Number(debt.amount || 0) -
                        Number(debt.amount_paid || 0))
                    ),
                    0
                  );

                  return (
                    <tr key={debt.debt_id} className="hover:bg-gray-50">
                      <td className="px-3 py-4">
                        <p className="font-semibold text-gray-900">
                          {debt.customer_name || "Unknown customer"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {debt.phone_number || "No phone"}
                        </p>
                      </td>
                      <td className="px-3 py-4 text-gray-600">
                        {debt.description || "—"}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        {money(debt.amount)}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap font-semibold text-amber-700">
                        {money(remaining)}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap">
                        {dateText(debt.due_date)}
                      </td>
                      <td className="px-3 py-4">
                        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                          Overdue
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overdue;
