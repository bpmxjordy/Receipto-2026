import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Receipto",
  description: "Receipto privacy policy. Learn how we handle your data.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <div className="prose prose-gray max-w-none space-y-6">
          <p className="text-gray-600">
            <strong>Last updated:</strong> {new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            What we collect
          </h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>
              <strong>Account information:</strong> Email address and display
              name when you sign up.
            </li>
            <li>
              <strong>Receipt data:</strong> Photos and extracted text from
              receipts you scan. These are stored in your private account.
            </li>
            <li>
              <strong>Usage data:</strong> Basic crash reports and anonymous
              analytics via Sentry.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            What we don&apos;t do
          </h2>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>We do not sell or share your personal data.</li>
            <li>
              We do not process receipt images on external servers — OCR and
              categorisation run on your device.
            </li>
            <li>We do not use your data for advertising.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">
            Data storage
          </h2>
          <p className="text-gray-600">
            Your data is stored securely in Firebase (Google Cloud) in the
            europe-west2 (London) region. Data is encrypted in transit and at
            rest.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8">Contact</h2>
          <p className="text-gray-600">
            For privacy questions, contact:{" "}
            <a
              href="mailto:privacy@receipto.app"
              className="text-receipto-400 hover:text-receipto-500 underline"
            >
              privacy@receipto.app
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
