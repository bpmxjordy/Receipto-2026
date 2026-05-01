import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Nav ── */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-receipto-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-receipto-600">R</span>
          <span className="text-xl font-semibold text-receipto-600">
            Receipto
          </span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link
            href="/privacy"
            className="text-gray-600 hover:text-receipto-500 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-gray-600 hover:text-receipto-500 transition-colors"
          >
            Terms
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-receipto-50 via-white to-receipto-100" />
          <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-receipto-100/60 blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-receipto-200/40 blur-3xl" />

          <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-36 text-center">
            {/* Logo */}
            <div className="mx-auto mb-8 w-24 h-24 rounded-2xl bg-receipto-50 border-2 border-receipto-300 flex items-center justify-center shadow-lg shadow-receipto-200/50">
              <span className="text-5xl font-bold text-receipto-300">R</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-receipto-600 mb-4 tracking-tight">
              Track your receipts.
              <br />
              <span className="text-receipto-300">Know your impact.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
              Receipto digitises your paper receipts, auto-categorises every
              item, and shows your spending and CO₂ footprint — all on-device,
              all private.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button className="px-8 py-3 bg-receipto-300 text-white font-semibold rounded-xl shadow-lg shadow-receipto-300/30 hover:bg-receipto-400 transition-all hover:shadow-xl hover:shadow-receipto-400/30 hover:-translate-y-0.5">
                Coming Soon on iOS
              </button>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-3xl font-bold text-center text-receipto-600 mb-12">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              emoji="📷"
              title="Snap a receipt"
              description="Take a photo of any paper receipt. On-device OCR extracts every line item instantly."
            />
            <FeatureCard
              emoji="🏷️"
              title="Auto-categorise"
              description="AI running entirely on your phone classifies items into spending categories — consistently, every time."
            />
            <FeatureCard
              emoji="🌍"
              title="See your impact"
              description="Track your CO₂ footprint per item, per receipt, and over time. Know where you can make a difference."
            />
          </div>
        </section>

        {/* ── Extra features ── */}
        <section className="bg-receipto-50 py-20">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-receipto-600 mb-6">
                  Privacy first
                </h2>
                <p className="text-gray-600 text-lg mb-4">
                  Receipt photos never leave your device. The AI categoriser
                  runs locally using Gemma 3n — no cloud processing, no data
                  harvesting.
                </p>
                <p className="text-gray-600">
                  Your receipt data syncs to your private account via Firebase,
                  encrypted in transit and at rest. Only you can see your data.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-48 h-48 rounded-3xl bg-white border-2 border-receipto-200 flex items-center justify-center shadow-xl shadow-receipto-100">
                  <span className="text-7xl">🔒</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-receipto-200 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Jordan Cartwright. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-receipto-500 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-receipto-500 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-receipto-200 shadow-sm hover:shadow-lg hover:shadow-receipto-100/50 transition-all hover:-translate-y-1 group">
      <div className="w-14 h-14 rounded-xl bg-receipto-50 flex items-center justify-center mb-4 group-hover:bg-receipto-100 transition-colors">
        <span className="text-3xl">{emoji}</span>
      </div>
      <h3 className="text-xl font-semibold text-receipto-600 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
