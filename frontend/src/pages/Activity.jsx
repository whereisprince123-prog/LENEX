
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    Activity as ActivityIcon,
    RefreshCw,
    Clock,
    Users,
    CreditCard,
    Pencil,
    Trash2,
    AlertCircle,
    CheckCircle2,
    FileText,
} from "lucide-react";

import api from "../services/api";

const Activity = () => {
    const { t } = useTranslation();

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchActivities = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/activity");
            setActivities(response.data.data || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                t("unableToLoadActivity")
            );
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const formatDate = (value) => {
        if (!value) return t("dateUnavailable");

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return t("dateUnavailable");
        }

        return date.toLocaleString();
    };

    const getActivityStyle = (action = "") => {
        const value = action.toLowerCase();

        if (value.includes("customer")) {
            if (value.includes("delete")) {
                return {
                    icon: Trash2,
                    color: "bg-red-50 text-red-600",
                };
            }

            if (value.includes("update")) {
                return {
                    icon: Pencil,
                    color: "bg-amber-50 text-amber-600",
                };
            }

            return {
                icon: Users,
                color: "bg-sky-50 text-sky-600",
            };
        }

        if (value.includes("payment") || value.includes("paid")) {
            return {
                icon: CheckCircle2,
                color: "bg-green-50 text-green-600",
            };
        }

        if (value.includes("debt")) {
            return {
                icon: CreditCard,
                color: "bg-violet-50 text-violet-600",
            };
        }

        return {
            icon: FileText,
            color: "bg-gray-100 text-gray-600",
        };
    };

    const translateAction = (action = "ACTIVITY") => {
        const normalized = action.toUpperCase();

        const actionTranslations = {
            CUSTOMER_CREATED: "activityCustomerCreated",
            CUSTOMER_UPDATED: "activityCustomerUpdated",
            CUSTOMER_DELETED: "activityCustomerDeleted",
            DEBT_CREATED: "activityDebtCreated",
            DEBT_UPDATED: "activityDebtUpdated",
            DEBT_CANCELLED: "activityDebtCancelled",
            PAYMENT_RECORDED: "activityPaymentRecorded",
            DEBT_PAID: "activityDebtPaid",
        };

        return t(actionTranslations[normalized] || "activityAction", {
            action: normalized.replaceAll("_", " "),
        });
    };

    const translateEntity = (entity = "") => {
        const entities = {
            CUSTOMER: "customer",
            DEBT: "debt",
            PAYMENT: "payment",
        };

        return t(entities[entity.toUpperCase()] || "entity");
    };

    return (
        <div className="lenex-activity min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl">

                {/* Page heading */}
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-sky-100 p-3 text-sky-700">
                            <ActivityIcon size={25} />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {t("activityLogs")}
                            </h1>

                            <p className="mt-1 text-sm text-gray-500">
                                {t("activityLogsDescription")}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={fetchActivities}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <RefreshCw
                            size={16}
                            className={loading ? "animate-spin" : ""}
                        />
                        {t("refresh")}
                    </button>
                </div>

                {/* Summary */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            {t("activitiesLoaded")}
                        </p>

                        <p className="mt-2 text-3xl font-bold text-gray-900">
                            {activities.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                        <p className="text-sm text-gray-500">
                            {t("latestActivity")}
                        </p>

                        <p className="mt-2 text-base font-semibold text-gray-900">
                            {activities.length > 0
                                ? formatDate(activities[0].created_at)
                                : t("noActivityYet")}
                        </p>
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                        <AlertCircle size={20} className="mt-0.5 shrink-0" />

                        <div>
                            <p className="font-semibold">
                                {t("couldNotLoadActivities")}
                            </p>

                            <p className="mt-1 text-sm">{error}</p>

                            <button
                                onClick={fetchActivities}
                                className="mt-2 text-sm font-semibold underline"
                            >
                                {t("tryAgain")}
                            </button>
                        </div>
                    </div>
                )}

                {/* Activity list */}
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <div>
                            <h2 className="font-semibold text-gray-900">
                                {t("recentActivity")}
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                {t("mostRecentEventsFirst")}
                            </p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 text-center text-sm text-gray-500">
                            {t("loadingActivityLogs")}
                        </div>
                    ) : activities.length === 0 && !error ? (
                        <div className="px-6 py-14 text-center">
                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                                <Clock size={26} />
                            </div>

                            <h3 className="font-semibold text-gray-900">
                                {t("noActivityRecorded")}
                            </h3>

                            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                                {t("activityEmptyDescription")}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {activities.map((item) => {
                                const style = getActivityStyle(item.action);
                                const Icon = style.icon;

                                return (
                                    <div
                                        key={item.log_id}
                                        className="flex gap-4 px-5 py-5 transition hover:bg-gray-50"
                                    >
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${style.color}`}
                                        >
                                            <Icon size={19} />
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {translateAction(item.action)}
                                                </span>

                                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                                                    {translateEntity(item.entity_type)}
                                                    {item.entity_id
                                                        ? ` #${item.entity_id}`
                                                        : ""}
                                                </span>
                                            </div>

                                            <p className="mt-2 text-sm text-gray-600">
                                                {item.description}
                                            </p>

                                            <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                                                <Clock size={13} />
                                                {formatDate(item.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Activity;
