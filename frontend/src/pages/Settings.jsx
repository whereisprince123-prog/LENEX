
import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Building2,
  Bell,
  Save,
  CheckCircle2,
} from "lucide-react";



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
        setBusiness(JSON.parse(storedBusiness));
      }

      if (storedPreferences) {
        setPreferences((previous) => ({
          ...previous,
          ...JSON.parse(storedPreferences),
        }));
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
    localStorage.setItem(
      "lenex_preferences",
      JSON.stringify(preferences)
    );
    setSaved(true);
  };

  const businessName =
    business.business_name ||
    business.name ||
    business.businessName ||
    "Your business";

  return (
    <div className="lenex-settings mx-auto max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sky-600">
          <SettingsIcon size={20} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Preferences
          </span>
        </div>

        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your LENEX business information and preferences.
        </p>
      </div>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Building2 size={21} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              Business profile
            </h2>
            <p className="text-sm text-gray-500">
              Information associated with your account.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Business name
            </label>
            <input
              value={businessName}
              readOnly
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600"
            />
          </div>

          <p className="text-xs leading-5 text-gray-500">
            This information is read-only for now. Business profile editing
            will be connected to the backend separately.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Bell size={21} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              Preferences
            </h2>
            <p className="text-sm text-gray-500">
              Choose how you want LENEX to behave.
            </p>
          </div>
        </div>

        <div className="mt-2 divide-y divide-gray-100">
          {[
            {
              key: "emailNotifications",
              title: "Email notifications",
              description: "Preference for receiving account updates by email.",
            },
            {
              key: "overdueReminders",
              title: "Overdue reminders",
              description: "Preference for seeing overdue debt reminders.",
            },
            {
              key: "compactTables",
              title: "Compact tables",
              description: "Preference for a more compact table layout.",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between gap-4 py-4"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {item.description}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={preferences[item.key]}
                onClick={() =>
                  updatePreference(item.key, !preferences[item.key])
                }
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  preferences[item.key] ? "bg-sky-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                    preferences[item.key] ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={savePreferences}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            <Save size={16} />
            Save preferences
          </button>

          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm text-green-600">
              <CheckCircle2 size={16} />
              Preferences saved in this browser
            </span>
          )}
        </div>
      </section>
    </div>
  );
};

export default Settings;
