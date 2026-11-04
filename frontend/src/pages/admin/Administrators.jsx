
import { useEffect, useMemo, useState } from "react";
import adminApi from "../../services/adminApi";

const emptyForm = {
  full_name: "",
  email: "",
  password: "",
  role: "ADMIN",
};

export default function Administrators() {
  const [administrators, setAdministrators] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [updatingId, setUpdatingId] = useState(null);

  const currentAdmin = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("lenex_admin") || "{}");
    } catch {
      return {};
    }
  }, []);

  const isSuperAdmin = currentAdmin.role === "SUPER_ADMIN";

  const loadAdministrators = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminApi.get("/admin/administrators", {
        params: { search },
      });

      setAdministrators(response.data.data || []);
    } catch (err) {
      console.error("Load administrators error:", err);
      setError(
        err.response?.data?.message ||
          "Could not load administrators. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdministrators();
  }, [search]);

  const handleInputChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const response = await adminApi.post(
        "/admin/administrators",
        form
      );

      setSuccess(
        response.data.message || "Administrator created successfully."
      );
      setForm(emptyForm);
      setShowForm(false);

      await loadAdministrators();
    } catch (err) {
      console.error("Create administrator error:", err);
      setError(
        err.response?.data?.message ||
          "Could not create administrator."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (admin) => {
    const nextStatus = Number(admin.is_active) === 1 ? 0 : 1;
    const action = nextStatus ? "activate" : "deactivate";

    const confirmed = window.confirm(
      `Are you sure you want to ${action} ${admin.full_name}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");
    setUpdatingId(admin.admin_id);

    try {
      const response = await adminApi.patch(
        `/admin/administrators/${admin.admin_id}/status`,
        { is_active: nextStatus }
      );

      setSuccess(
        response.data.message || "Administrator status updated."
      );

      await loadAdministrators();
    } catch (err) {
      console.error("Update administrator status error:", err);
      setError(
        err.response?.data?.message ||
          "Could not update administrator status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-600">
            LENEX / Administration
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Administrators
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage platform administrator accounts and access.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            type="button"
            onClick={() => {
              setError("");
              setSuccess("");
              setForm(emptyForm);
              setShowForm(!showForm);
            }}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            {showForm ? "Cancel" : "+ Add administrator"}
          </button>
        )}
      </div>

      {/* Feedback messages */}
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      {/* Create administrator form */}
      {showForm && isSuperAdmin && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Create administrator
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            The password will be hashed by the backend before storage.
          </p>

          <form onSubmit={handleCreate} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="full_name"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Full name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleInputChange}
                  maxLength={100}
                  required
                  autoComplete="name"
                  placeholder="Enter full name"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleInputChange}
                  maxLength={150}
                  required
                  autoComplete="email"
                  placeholder="admin@example.com"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Temporary password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleInputChange}
                  minLength={8}
                  required
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="role"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Administrator role
                </label>
                <select
                  id="role"
                  name="role"
                  value={form.role}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Creating..." : "Create administrator"}
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total administrators</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {administrators.length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Active accounts</p>
          <p className="mt-2 text-3xl font-bold text-green-600">
            {administrators.filter((a) => Number(a.is_active) === 1).length}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Super administrators</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">
            {administrators.filter((a) => a.role === "SUPER_ADMIN").length}
          </p>
        </div>
      </div>

      {/* Administrators table */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              All administrators
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review account details and access status.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or email..."
              aria-label="Search administrators"
              className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-64"
            />

            <button
              type="button"
              onClick={loadAdministrators}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading administrators...
          </div>
        ) : administrators.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-slate-700">
              No administrators found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try another search or create an administrator.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Administrator</th>
                  <th className="px-5 py-4 font-semibold">Role</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Created</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {administrators.map((admin) => {
                  const isActive = Number(admin.is_active) === 1;
                  const isCurrentAdmin =
                    String(admin.admin_id) ===
                    String(currentAdmin.admin_id);

                  return (
                    <tr
                      key={admin.admin_id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-900">
                          {admin.full_name}
                          {isCurrentAdmin && (
                            <span className="ml-2 text-xs font-normal text-blue-600">
                              You
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-slate-500">
                          {admin.email}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            admin.role === "SUPER_ADMIN"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {admin.role === "SUPER_ADMIN"
                            ? "Super Admin"
                            : "Admin"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                            isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-green-600" : "bg-red-600"
                            }`}
                          />
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {admin.created_at
                          ? new Date(admin.created_at).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="px-5 py-4 text-right">
                        {isSuperAdmin ? (
                          <button
                            type="button"
                            disabled={updatingId === admin.admin_id}
                            onClick={() => handleStatusChange(admin)}
                            className={`rounded-lg px-3 py-2 text-xs font-semibold disabled:opacity-50 ${
                              isActive
                                ? "bg-red-50 text-red-700 hover:bg-red-100"
                                : "bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            {updatingId === admin.admin_id
                              ? "Updating..."
                              : isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">
                            View only
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t border-slate-200 px-5 py-4 text-xs text-slate-500">
          Showing {administrators.length} administrator
          {administrators.length === 1 ? "" : "s"}
        </div>
      </section>
    </div>
  );
}
