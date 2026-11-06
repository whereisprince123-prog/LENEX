
import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Building2,
  Bell,
  Save,
  CheckCircle2,
  LayoutGrid,
  Mail,
  Clock3,
  Table2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const preferenceItems = [
  {
    key: "emailNotifications",
    title: "Email notifications",
    description: "Receive important account and business updates.",
    icon: Mail,
  },
  {
    key: "overdueReminders",
    title: "Overdue reminders",
    description: "Keep overdue customer debts visible to you.",
    icon: Clock3,
  },
  {
    key: "compactTables",
    title: "Compact tables",
    description: "Display more records using less screen space.",
    icon: Table2,
  },
];

const Settings = () => {
  const [business, setBusiness] = useState({});
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    overdueReminders: true,
    compactTables: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const storedBusiness = localStorage.getItem("lenex_business");
      const storedPreferences = localStorage.getItem("lenex_preferences");

      if (storedBusiness) {
        const parsedBusiness = JSON.parse(storedBusiness);
        setBusiness(
          parsedBusiness && typeof parsedBusiness === "object"
            ? parsedBusiness
            : {}
        );
      }

      if (storedPreferences) {
        const parsedPreferences = JSON.parse(storedPreferences);

        if (
          parsedPreferences &&
          typeof parsedPreferences === "object" &&
          !Array.isArray(parsedPreferences)
        ) {
          setPreferences((previous) => ({
            ...previous,
            ...parsedPreferences,
          }));
        }
      }
    } catch (error) {
      console.error("Unable to load LENEX settings:", error);
    }
  }, []);

  const updatePreference = (key, value) => {
    setPreferences((previous) => ({
      ...previous,
      [key]: value,
    }));
    setSaved(false);
  };

  const savePreferences = () => {
    try {
      localStorage.setItem(
        "lenex_preferences",
        JSON.stringify(preferences)
      );
      setSaved(true);
    } catch (error) {
      console.error("Unable to save preferences:", error);
      setSaved(false);
    }
  };

  const businessName =
    business.business_name ||
    business.name ||
    business.businessName ||
    "Your business";

  const businessEmail = business.business_email || "";
  const businessPhone = business.business_phone || "";

  return (
    <div className="lenex-settings mx-auto max-w-5xl space-y-8 pb-10">

      {/* PAGE HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sky-600">
            <SettingsIcon size={17} />
            <span className="text-xs font-bold uppercase tracking-[0.16em]">
              Workspace configuration
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Settings
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 dark:text-gray-400">
            Manage your business information and personalize your LENEX
            workspace experience.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
          <ShieldCheck size={15} />
          Account protected
        </div>
      </div>

      {/* BUSINESS PROFILE */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 dark:border-gray-800 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
              <Building2 size={21} />
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                Business profile
              </h2>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                Your registered business information
              </p>
            </div>
          </div>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            Read only
          </span>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-2xl font-bold text-white shadow-sm">
              {businessName.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-bold text-gray-900 dark:text-white">
                {businessName}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                LENEX business workspace
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-lg bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-700 dark:bg-sky-950/40 dark:text-sky-400 sm:self-center">
              <Building2 size={14} />
              Business account
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-5 dark:border-gray-800 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400">
                BUSINESS NAME
              </label>
              <input
                value={businessName}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400">
                BUSINESS EMAIL
              </label>
              <input
                value={businessEmail || "Not provided"}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-500 dark:text-gray-400">
                BUSINESS PHONE
              </label>
              <input
                value={businessPhone || "Not provided"}
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              />
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-gray-500 dark:text-gray-400">
            Business profile editing will be available through a separate
            secure profile management feature.
          </p>
        </div>
      </section>

      {/* PREFERENCES */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">

        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 dark:border-gray-800 sm:px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600 dark:bg-sky-950/50 dark:text-sky-400">
            <LayoutGrid size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Workspace preferences
            </h2>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Customize how you use LENEX.
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-100 px-5 dark:divide-gray-800 sm:px-6">
          {preferenceItems.map((item) => {
            const Icon = item.icon;
            const enabled = preferences[item.key];

            return (
              <div
                key={item.key}
                className="flex items-center justify-between gap-4 py-5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-label={item.title}
                  aria-checked={enabled}
                  onClick={() =>
                    updatePreference(item.key, !enabled)
                  }
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-sky-100 dark:focus:ring-sky-900/40 ${
                    enabled
                      ? "bg-sky-600"
                      : "bg-gray-300 dark:bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                      enabled ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* SAVE ACTION */}
        <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-4 dark:border-gray-800 dark:bg-gray-950/40 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="min-h-5">
            {saved ? (
              <p className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={15} />
                Preferences saved successfully.
              </p>
            ) : (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Remember to save your changes.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={savePreferences}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100 dark:focus:ring-sky-900/40"
          >
            <Save size={16} />
            Save changes
          </button>
        </div>
      </section>

      {/* SECURITY INFORMATION */}
      <section className="flex flex-col gap-4 rounded-2xl border border-sky-100 bg-sky-50/70 p-5 dark:border-sky-900/40 dark:bg-sky-950/20 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 dark:bg-gray-900 dark:text-sky-400">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Your business data matters
            </h3>
            <p className="mt-1 max-w-xl text-xs leading-5 text-gray-600 dark:text-gray-400">
              Keep your login credentials private and always sign out when
              using a shared device.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-sky-700 dark:text-sky-400">
          Protected workspace
          <ChevronRight size={15} />
        </div>
      </section>
    </div>
  );
};

export default Settings;
