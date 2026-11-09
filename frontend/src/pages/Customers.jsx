
import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Pencil,
    Trash2,
    X,
    Users,
    Phone,
    MapPin,
    CalendarDays,
    UserRound,
    FileText,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import api from "../services/api";

const emptyForm = {
    full_name: "",
    phone_number: "",
    home_address: "",
    notes: "",
};

const Customers = () => {
    const { t, i18n } = useTranslation();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [search, setSearch] = useState("");

    /* LOAD CUSTOMERS */
    const loadCustomers = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/customers");
            setCustomers(response.data.data || []);
        } catch (error) {
            console.error("Load customers error:", error);
            setError(
                 error.response?.data?.message ||
        t("unableToLoadCustomers")
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    /* FORM */
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const openAddModal = () => {
        setEditingCustomer(null);
        setFormData(emptyForm);
        setError("");
        setShowModal(true);
    };

    const openEditModal = (customer) => {
        setEditingCustomer(customer);

        setFormData({
            full_name: customer.full_name || "",
            phone_number: customer.phone_number || "",
            home_address: customer.home_address || "",
            notes: customer.notes || "",
        });

        setError("");
        setShowModal(true);
    };

    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setEditingCustomer(null);
        setFormData(emptyForm);
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            if (editingCustomer) {
                const response = await api.put(
                    `/customers/${editingCustomer.customer_id}`,
                    formData
                );

                setCustomers((previous) =>
                    previous.map((customer) =>
                        customer.customer_id ===
                        editingCustomer.customer_id
                            ? {
                                  ...customer,
                                  ...formData,
                              }
                            : customer
                    )
                );

                console.log(response.data.message);
            } else {
                const response = await api.post(
                    "/customers",
                    formData
                );

                setCustomers((previous) => [
                    response.data.data,
                    ...previous,
                ]);
            }

            setShowModal(false);
            setEditingCustomer(null);
            setFormData(emptyForm);
        } catch (error) {
            console.error("Customer save error:", error);

            setError(
                    error.response?.data?.message ||
        t("unableToSaveCustomer")
            );
        } finally {
            setSaving(false);
        }
    };

    /* SEARCH */
    const filteredCustomers = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) return customers;

        return customers.filter((customer) =>
            [
                customer.full_name,
                customer.phone_number,
                customer.home_address,
            ]
                .filter(Boolean)
                .some((value) =>
                    String(value).toLowerCase().includes(query)
                )
        );
    }, [customers, search]);

    /* HELPERS */
    const getInitials = (name = "") =>
        name
            .split(" ")
            .filter(Boolean)
            .map((word) => word.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase();

    const formatDate = (date) => {
        if (!date) return "—";

        const localeMap = {
            en: "en-RW",
            rw: "rw-RW",
            fr: "fr-FR",
        };

        const language =
            i18n.resolvedLanguage?.split("-")[0] || "en";

        return new Date(date).toLocaleDateString(
            localeMap[language] || "en-RW",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    const inputClass =
        "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:bg-slate-800 dark:focus:ring-sky-500/10";

    const labelClass =
        "mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-300";

    return (
        <div className="space-y-6 text-gray-900 dark:text-slate-100">

            {/* PAGE HEADER */}
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-500 dark:bg-sky-500/15 dark:text-sky-400">
                            <Users size={19} />
                        </div>

                        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-500 dark:text-sky-400">
                            {t("customers")}
                        </span>
                    </div>

                    <h1 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {t("customerManagement")}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                        {t("customerManagementDescription")}
                    </p>
                </div>

                <button
                    onClick={openAddModal}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
                >
                    <Plus size={18} />
                    {t("addCustomer")}
                </button>
            </div>

            {/* SUMMARY */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                                {t("totalCustomers")}
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                                {customers.length}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-500 dark:bg-sky-500/15 dark:text-sky-400">
                            <Users size={21} />
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400">
                                {t("showing")}
                            </p>

                            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                                {filteredCustomers.length}
                            </p>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-gray-500 dark:bg-slate-800 dark:text-slate-400">
                            <Search size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* SEARCH + TABLE */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">

                {/* TOOLBAR */}
                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                            {t("allCustomers")}
                        </h2>

                        <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">
                            {t("registeredCustomerCount", {
    count: customers.length,
})}
                        </p>
                    </div>

                    <div className="relative w-full sm:w-80">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder={t("searchCustomers")}
                            className="h-11 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:bg-slate-800 dark:focus:ring-sky-500/10"
                        />
                    </div>
                </div>

                {/* ERROR */}
                {error && !showModal && (
                    <div className="m-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/40">
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {error}
                        </p>

                        <button
                            onClick={loadCustomers}
                            className="mt-1 text-sm font-semibold text-red-700 underline dark:text-red-400"
                        >
                            {t("tryAgain")}
                        </button>
                    </div>
                )}

                {/* LOADING */}
                {loading ? (
                    <div className="flex min-h-[320px] items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />

                            <p className="mt-3 text-sm text-gray-500 dark:text-slate-400">
                                {t("loadingCustomers")}
                            </p>
                        </div>
                    </div>
                ) : filteredCustomers.length === 0 ? (

                    /* EMPTY STATE */
                    <div className="px-6 py-20 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 text-sky-500 dark:bg-sky-500/15 dark:text-sky-400">
                            <Users size={28} strokeWidth={1.7} />
                        </div>

                        <h3 className="mt-5 text-lg font-semibold text-gray-900 dark:text-white">
                            {search
                                ? t("noCustomersFound")
                                : t("noCustomersYet")}
                        </h3>

                        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500 dark:text-slate-400">
                            {search
                                ? t("tryDifferentSearch")
                                : t("addFirstCustomer")}
                        </p>

                        {!search && (
                            <button
                                onClick={openAddModal}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                            >
                                <Plus size={17} />
                                {t("addCustomer")}
                            </button>
                        )}
                    </div>
                ) : (

                    /* CUSTOMER TABLE */
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px]">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/70 text-left dark:border-slate-800 dark:bg-slate-800/60">
                                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-slate-400">
                                        {t("customer")}
                                    </th>

                                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-slate-400">
                                        {t("contact")}
                                    </th>

                                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-slate-400">
                                        {t("address")}
                                    </th>

                                    <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-slate-400">
                                        {t("added")}
                                    </th>

                                    <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400 dark:text-slate-400">
                                        {t("actions")}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr
                                        key={customer.customer_id}
                                        className="group border-b border-gray-100 transition last:border-0 hover:bg-gray-50/70 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                    >
                                        {/* CUSTOMER */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-50 text-xs font-bold text-sky-600 dark:bg-sky-500/15 dark:text-sky-400">
                                                    {getInitials(customer.full_name)}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="truncate font-semibold text-gray-900 dark:text-white">
                                                        {customer.full_name}
                                                    </p>

                                                    {customer.notes && (
                                                        <p className="mt-0.5 max-w-[220px] truncate text-xs text-gray-400 dark:text-slate-500">
                                                            {customer.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        {/* CONTACT */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                                                <Phone
                                                    size={15}
                                                    className="text-gray-400 dark:text-slate-500"
                                                />
                                                {customer.phone_number}
                                            </div>
                                        </td>

                                        {/* ADDRESS */}
                                        <td className="px-6 py-4">
                                            <div className="flex max-w-[190px] items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
                                                <MapPin
                                                    size={15}
                                                    className="shrink-0 text-gray-400 dark:text-slate-500"
                                                />

                                                <span className="truncate">
                                                    {customer.home_address ||
                                                        t("noAddress")}
                                                </span>
                                            </div>
                                        </td>

                                        {/* DATE */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                                                <CalendarDays
                                                    size={15}
                                                    className="text-gray-400 dark:text-slate-500"
                                                />

                                                {formatDate(customer.created_at)}
                                            </div>
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() =>
                                                        openEditModal(customer)
                                                    }
                                                    title={t("editCustomer")}
                                                    aria-label={t("editCustomer")}
                                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-sky-50 hover:text-sky-600 dark:text-slate-500 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    type="button"
                                                    title={t("deleteCustomer")}
                                                    aria-label={t("deleteCustomer")}
                                                    className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ADD / EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px]">
                    <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl dark:border dark:border-slate-800 dark:bg-slate-900">

                        {/* MODAL HEADER */}
                        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5 dark:border-slate-800">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-500 dark:bg-sky-500/15 dark:text-sky-400">
                                    {editingCustomer ? (
                                        <Pencil size={18} />
                                    ) : (
                                        <UserRound size={19} />
                                    )}
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                        {editingCustomer
                                            ? t("editCustomer")
                                            : t("addCustomer")}
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                                        {editingCustomer
                                            ? t("updateCustomerInformation")
                                            : t("addCustomerDescription")}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={saving}
                                aria-label={t("closeModal")}
                                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5 px-6 py-6"
                        >
                            {error && (
                                <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            {/* NAME */}
                            <div>
                                <label className={labelClass}>
                                    {t("fullName")}
                                </label>

                                <div className="relative">
                                    <UserRound
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                                    />

                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        placeholder={t("exampleName")}
                                        required
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* PHONE */}
                            <div>
                                <label className={labelClass}>
                                    {t("phoneNumber")}
                                </label>

                                <div className="relative">
                                    <Phone
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                                    />

                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        placeholder={t("examplePhone")}
                                        required
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* ADDRESS */}
                            <div>
                                <label className={labelClass}>
                                    {t("homeAddress")}
                                </label>

                                <div className="relative">
                                    <MapPin
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500"
                                    />

                                    <input
                                        type="text"
                                        name="home_address"
                                        value={formData.home_address}
                                        onChange={handleChange}
                                        placeholder={t("exampleAddress")}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* NOTES */}
                            <div>
                                <label className={labelClass}>
                                    {t("notes")}
                                </label>

                                <div className="relative">
                                    <FileText
                                        size={17}
                                        className="absolute left-3 top-3.5 text-gray-400 dark:text-slate-500"
                                    />

                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder={t("optionalNotes")}
                                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-sky-500 dark:focus:bg-slate-800 dark:focus:ring-sky-500/10"
                                    />
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5 dark:border-slate-800">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={saving}
                                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                                >
                                    {t("cancel")}
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                           {t("saving")}
                                        </>
                                    ) : (
                                        <>
                                            <Plus size={17} />
                                            {editingCustomer
                                                ? t("saveChanges")
                                                : t("addCustomer")}
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
};

export default Customers;
