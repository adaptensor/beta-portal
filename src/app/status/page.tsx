import Image from "next/image";
import Link from "next/link";
import {
  MODULES_STATUS,
  STATUS_COLORS,
  PRODUCT_LABELS,
  PRODUCT_BAR_COLORS,
  type ModuleStatus,
  type ProductLine,
} from "@/lib/constants";

function StatusBadge({ status }: { status: ModuleStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}

export default function StatusPage() {
  const liveCount = MODULES_STATUS.filter((m) => m.status === "live").length;
  const betaCount = MODULES_STATUS.filter((m) => m.status === "beta").length;
  const devCount = MODULES_STATUS.filter((m) => m.status === "dev").length;
  const plannedCount = MODULES_STATUS.filter((m) => m.status === "planned").length;
  const avgProgress = Math.round(
    MODULES_STATUS.reduce((sum, m) => sum + m.pct, 0) / MODULES_STATUS.length
  );

  const productOrder: ProductLine[] = ["books", "aero", "vault"];
  const productHeaderColors: Record<ProductLine, string> = {
    books: "text-brand-yellow",
    aero: "text-brand-cyan",
    vault: "text-purple-400",
  };

  const grouped = productOrder.map((product) => ({
    product,
    label: PRODUCT_LABELS[product],
    modules: MODULES_STATUS.filter((m) => m.product === product),
  }));

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-brand-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logoA.svg" alt="Adaptensor" width={32} height={32} />
            <span className="font-bold text-white"><em className="not-italic text-brand-yellow italic">Adapt</em>ensor</span>
            <span className="text-xs text-zinc-500 border border-brand-border rounded px-2 py-0.5">
              Status
            </span>
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-brand-yellow text-brand-black font-semibold rounded-lg text-sm hover:bg-brand-yellow/90 transition-all"
          >
            Join Beta
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Adaptensor Platform Status
          </h1>
          <p className="text-zinc-400">
            Real-time module status across all Adaptensor products.
            Current version: <span className="text-brand-cyan font-mono">v0.9.2-beta</span>
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {[
            { label: "Overall Progress", value: `${avgProgress}%`, color: "text-brand-cyan" },
            { label: "Live Modules", value: String(liveCount), color: "text-emerald-400" },
            { label: "In Beta", value: String(betaCount), color: "text-brand-cyan" },
            { label: "In Development", value: String(devCount), color: "text-orange-400" },
            { label: "Planned", value: String(plannedCount), color: "text-zinc-400" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg bg-brand-card border border-brand-border p-4 text-center"
            >
              <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
              <div className="text-xs text-zinc-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* All Systems Operational Banner */}
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4 mb-8 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-medium text-sm">
            All systems operational
          </span>
          <span className="text-zinc-500 text-sm ml-auto">
            Last checked: just now
          </span>
        </div>

        {/* Module Grid — grouped by product */}
        <div className="space-y-10">
          {grouped.map(({ product, label, modules }) => (
            <div key={product}>
              <h2 className={`text-lg font-bold mb-4 ${productHeaderColors[product]}`}>
                {label}
              </h2>
              <div className="space-y-3">
                {modules.map((mod) => (
                  <div
                    key={mod.name}
                    className="rounded-lg bg-brand-card border border-brand-border p-5 flex items-center gap-6 hover:border-brand-borderHover transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-sm font-semibold text-zinc-200">{mod.name}</h3>
                        <StatusBadge status={mod.status} />
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${mod.pct}%`,
                            backgroundColor: PRODUCT_BAR_COLORS[product],
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-lg font-bold font-mono text-white">{mod.pct}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Platform Specs */}
        <div className="mt-16 rounded-xl bg-brand-card border border-brand-border p-8">
          <h2 className="text-xl font-bold text-white mb-6">Platform Specifications</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Data Models", value: "145+" },
              { label: "API Endpoints", value: "309" },
              { label: "Pages", value: "57" },
              { label: "Products", value: "3" },
              { label: "Database", value: "PostgreSQL" },
              { label: "Auth Provider", value: "Clerk SSO" },
              { label: "Hosting", value: "Vercel" },
              { label: "AI Engine", value: "AdaptGent" },
            ].map((spec) => (
              <div key={spec.label}>
                <div className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{spec.label}</div>
                <div className="text-lg font-semibold font-mono text-white">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Version History */}
        <div className="mt-12 rounded-xl bg-brand-card border border-brand-border p-8">
          <h2 className="text-xl font-bold text-white mb-6">Version History</h2>
          <div className="space-y-4">
            {[
              { version: "v0.9.2", date: "Feb 2026", note: "Beta portal launch, multi-product rebrand, 8 core aviation phases complete" },
              { version: "v0.9.1", date: "Feb 2026", note: "Financial authorization & draw system (AV-9)" },
              { version: "v0.9.0", date: "Jan 2026", note: "Initial platform beta with core modules across all products" },
            ].map((v) => (
              <div key={v.version} className="flex items-start gap-4">
                <span className="text-brand-cyan font-mono text-sm font-bold shrink-0 w-16">{v.version}</span>
                <span className="text-zinc-600 text-sm shrink-0 w-20">{v.date}</span>
                <span className="text-zinc-400 text-sm">{v.note}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-brand-border mt-12">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-zinc-600">
          <span>Adaptensor, Inc. &middot; &copy; 2026</span>
          <Link href="/" className="hover:text-zinc-400 transition-colors">
            Back to Home
          </Link>
        </div>
      </footer>
    </main>
  );
}
