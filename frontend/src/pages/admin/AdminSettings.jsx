
import { useEffect, useState } from "react";
import adminApi from "../../services/adminApi";

export default function AdminSettings() {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    role: "",
    is_active: 1,
  });

const emptyContactSettings = {
  platform_name: "LENEX",
  tagline: "",
  support_email: "",
  contact_phone: "",
  whatsapp_number: "",
  contact_address: "",
  city: "",
  country: "",
  business_hours: "",
  facebook_url: "",
  instagram_url: "",
  linkedin_url: "",
  website_url: "",
};

const [contactSettings, setContactSettings] = useState(emptyContactSettings);
const [loadingContact, setLoadingContact] = useState(true);
const [savingContact, setSavingContact] = useState(false);

useEffect(() => {
  const loadContactSettings = async () => {
    try {
      const response = await adminApi.get("/admin/settings/platform");

      setContactSettings({
        ...emptyContactSettings,
        ...response.data.data,
      });
    } catch (err) {
      console.error("Load contact settings error:", err);
      setError(
        err.response?.data?.message ||
        "Unable to load LENEX contact settings."
      );
    } finally {
      setLoadingContact(false);
    }
  };

  loadContactSettings();
}, []);

  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const savedAdmin = JSON.parse(
          localStorage.getItem("lenex_admin") || "{}"
        );

        if (!cancelled) {
          setProfile((current) => ({
            ...current,
            full_name: savedAdmin.full_name || "",
            email: savedAdmin.email || "",
            role: savedAdmin.role || "",
            is_active: savedAdmin.is_active ?? 1,
          }));
        }
      } catch (err) {
        console.error("Read admin profile error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleProfileChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
  };

  const handlePasswordChange = (event) => {
    setPasswords({
      ...passwords,
      [event.target.name]: event.target.value,
    });
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSavingProfile(true);

    try {
      const response = await adminApi.patch("/admin/profile", {
        full_name: profile.full_name,
        email: profile.email,
      });

      const updatedProfile = {
        ...profile,
        ...response.data.data,
      };

      setProfile(updatedProfile);

      const savedAdmin = JSON.parse(
        localStorage.getItem("lenex_admin") || "{}"
      );

      localStorage.setItem(
        "lenex_admin",
        JSON.stringify({
          ...savedAdmin,
          full_name: updatedProfile.full_name,
          email: updatedProfile.email,
        })
      );

      setSuccess(
        response.data.message || "Profile updated successfully."
      );
    } catch (err) {
      console.error("Save admin profile error:", err);
      setError(
        err.response?.data?.message || "Could not update your profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSavePassword = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (passwords.new_password !== passwords.confirm_password) {
      setError("New password and confirmation do not match.");
      return;
    }

    if (passwords.new_password.length < 8) {
      setError("Your new password must be at least 8 characters long.");
      return;
    }

    setSavingPassword(true);

    try {
      const response = await adminApi.patch("/admin/password", {
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });

      setPasswords({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      setSuccess(
        response.data.message || "Password changed successfully."
      );
    } catch (err) {
      console.error("Change admin password error:", err);
      setError(
        err.response?.data?.message || "Could not change your password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

const handleContactChange = (event) => {
  const { name, value } = event.target;

  setContactSettings((current) => ({
    ...current,
    [name]: value,
  }));
};

const handleSaveContact = async (event) => {
  event.preventDefault();
  setError("");
  setSuccess("");
  setSavingContact(true);

  try {
    const response = await adminApi.patch(
      "/admin/settings/platform",
      contactSettings
    );

    setContactSettings({
      ...emptyContactSettings,
      ...response.data.data,
    });

    setSuccess(
      response.data.message ||
      "LENEX contact information updated successfully."
    );
  } catch (err) {
    console.error("Save contact settings error:", err);

    setError(
      err.response?.data?.message ||
      "Unable to save contact information."
    );
  } finally {
    setSavingContact(false);
  }
};

  if (loading) {
    return (
      <div className="p-8 text-sm text-slate-500">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div>
        <p className="text-sm font-medium text-blue-600">
          LENEX / Administration
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
          Admin Settings
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your profile and account security.
        </p>
      </div>

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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Profile settings */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-2">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Profile information
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Update your name and email address.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-5">
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
                value={profile.full_name}
                onChange={handleProfileChange}
                maxLength={100}
                required
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
                value={profile.email}
                onChange={handleProfileChange}
                maxLength={150}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {savingProfile ? "Saving..." : "Save profile"}
            </button>
          </form>
        </section>

        {/* Account overview */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Account overview
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Administrator role
              </p>
              <p className="mt-1 font-semibold text-slate-900">
                {profile.role === "SUPER_ADMIN"
                  ? "Super Admin"
                  : "Admin"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Account status
              </p>
              <span className="mt-2 inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                {Number(profile.is_active) === 1 ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="rounded-xl bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-900">
                Keep your account secure
              </p>
              <p className="mt-1 text-sm text-blue-800">
                Use a strong, unique password and never share it with others.
              </p>
            </div>
          </div>
        </section>

        
{/* LENEX PLATFORM CONTACT SETTINGS */}
{profile.role === "SUPER_ADMIN" && (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-3">
    <div className="mb-6">
      <h2 className="text-lg font-bold text-slate-900">
        Contact & Support Settings
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Manage the contact information displayed on the public LENEX website.
      </p>
    </div>

    {loadingContact ? (
      <p className="text-sm text-slate-500">
        Loading platform contact settings...
      </p>
    ) : (
      <form onSubmit={handleSaveContact} className="space-y-6">
        {/* Platform information */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
            Platform information
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ["platform_name", "Platform name"],
              ["tagline", "Platform tagline"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {label}
                </label>
                <input
                  name={name}
                  value={contactSettings[name] || ""}
                  onChange={handleContactChange}
                  maxLength={255}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
            Contact information
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ["support_email", "Support email", "email"],
              ["contact_phone", "Phone number", "tel"],
              ["whatsapp_number", "WhatsApp number", "tel"],
              ["contact_address", "Street / physical address", "text"],
              ["city", "City", "text"],
              ["country", "Country", "text"],
              ["business_hours", "Business hours", "text"],
            ].map(([name, label, type]) => (
              <div key={name}>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {label}
                </label>
                <input
                  name={name}
                  type={type}
                  value={contactSettings[name] || ""}
                  onChange={handleContactChange}
                  maxLength={255}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
            Social media & website
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              ["facebook_url", "Facebook URL"],
              ["instagram_url", "Instagram URL"],
              ["linkedin_url", "LinkedIn URL"],
              ["website_url", "Website URL"],
            ].map(([name, label]) => (
              <div key={name}>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  {label}
                </label>
                <input
                  name={name}
                  type="url"
                  value={contactSettings[name] || ""}
                  onChange={handleContactChange}
                  maxLength={255}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <p className="text-xs text-slate-500">
            Changes will appear on the public website after saving.
          </p>

          <button
            type="submit"
            disabled={savingContact}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {savingContact ? "Saving..." : "Save contact settings"}
          </button>
        </div>
      </form>
    )}
  </section>
)}


        {/* Password settings */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 xl:col-span-3">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Change password
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Confirm your current password before choosing a new one.
            </p>
          </div>

          <form onSubmit={handleSavePassword} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label
                  htmlFor="current_password"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Current password
                </label>
                <input
                  id="current_password"
                  name="current_password"
                  type="password"
                  autoComplete="current-password"
                  value={passwords.current_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="new_password"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  New password
                </label>
                <input
                  id="new_password"
                  name="new_password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  value={passwords.new_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="confirm_password"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Confirm new password
                </label>
                <input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  value={passwords.confirm_password}
                  onChange={handlePasswordChange}
                  required
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {savingPassword ? "Updating..." : "Change password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
