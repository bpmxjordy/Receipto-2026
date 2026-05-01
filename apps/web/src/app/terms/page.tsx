import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Receipto",
  description: "Receipto terms of service.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-receipto-200">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-receipto-600">R</span>
          <span className="text-xl font-semibold text-receipto-600">
            Receipto
          </span>
        </Link>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-receipto-600 mb-8">
          Terms of Service
        </h1>

        <div className="prose prose-gray max-w-none space-y-6">
          <p className="text-gray-600">
            <strong>Last updated:</strong> {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            Acceptance of Terms
          </h2>
          <p className="text-gray-600">
            By using Receipto, you agree to these terms. If you do not agree,
            please do not use the app.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            Use of Service
          </h2>
          <p className="text-gray-600">
            Receipto is a personal receipt tracking and carbon footprint
            estimation tool. The CO₂ values provided are estimates based on
            publicly available data and should not be relied upon for regulatory
            or scientific purposes.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            Your Data
          </h2>
          <p className="text-gray-600">
            You retain ownership of all data you submit to Receipto. You can
            export or delete your data at any time from the app settings.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            Limitation of Liability
          </h2>
          <p className="text-gray-600">
            Receipto is provided &quot;as is&quot; without warranties of any
            kind. We are not liable for any damages arising from your use of the
            app.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">Contact</h2>
          <p className="text-gray-600">
            For questions about these terms, contact:{" "}
            <a
              href="mailto:legal@receipto.app"
              className="text-receipto-400 hover:text-receipto-500 underline"
            >
              legal@receipto.app
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
