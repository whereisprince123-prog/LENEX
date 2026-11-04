
import { Link } from "react-router-dom";
import { Home, ArrowLeft, SearchX } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg text-center">

        {/* Error illustration */}
        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <SearchX size={42} strokeWidth={1.7} />
          </div>
        </div>

        {/* Error code */}
        <p className="text-8xl font-extrabold tracking-tight text-blue-600">
          404
        </p>

        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          Page not found
        </h1>

        <p className="mt-4 text-base leading-7 text-gray-500">
          Sorry, we couldn't find the page you're looking for.
          It may have been moved, deleted, or the URL may be incorrect.
        </p>

        {/* Navigation buttons */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            <Home size={18} />
            Go to Dashboard
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>

        <p className="mt-10 text-sm text-gray-400">
          LENEX · Debt Management System
        </p>
        <p className="text-xs text-gray-400">
          © 2026 LENEX. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
