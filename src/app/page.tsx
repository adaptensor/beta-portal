import Link from "next/link";
import Image from "next/image";
import { MODULES_STATUS, STATUS_COLORS, type ModuleStatus } from "@/lib/constants";

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {children}
    </span>
  );
}

function StatusBadge({ status }: { status: ModuleStatus }) {
  return (
    <Badge className={STATUS_COLORS[status]}>
      {status.toUpperCase()}
    </Badge>
  );
}

/* ─── HERO ──────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Scanline overlay */}
      <div className="scanlines absolute inset-0 z-10" />

      {/* Gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-brand-yellow/5 rounded-full blur-[100px]" />

      <div className="relative z-20 max-w-5xl mx-auto px-6 text-center">
        {/* Beta badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-brand-cyan/30 bg-brand-cyan/10">
          <div className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
          <span className="text-brand-cyan text-sm font-medium tracking-wide">BETA v0.9.2</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight mb-6">
          Shape the Future of{" "}
          <span className="text-brand-cyan">Aviation MRO</span>{" "}
          Software
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-4">
          The only affordable, FAA-compliant MRO + accounting platform built for repair stations,
          A&amp;P mechanics, and aircraft owners.
        </p>
        <p className="text-sm text-zinc-500 mb-10">
          Built by <span className="text-brand-yellow font-semibold">Adaptensor</span> &mdash; 145+ data models, 309 API endpoints, and counting.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="px-8 py-3.5 bg-brand-yellow text-brand-black font-bold rounded-lg hover:bg-brand-yellow/90 transition-all text-lg shadow-lg shadow-brand-yellow/20"
          >
            Join the Beta
          </Link>
          <Link
            href="/status"
            className="px-8 py-3.5 border border-brand-border hover:border-brand-borderHover text-zinc-300 rounded-lg transition-all text-lg"
          >
            View Platform Status
          </Link>
        </div>

        {/* Plane SVG */}
        <div className="mt-16 flex justify-center opacity-20">
          <svg width="120" height="40" viewBox="0 0 120 40" fill="none" className="text-brand-cyan">
            <path d="M2 20L40 8L100 20L40 32Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M100 20H118" stroke="currentColor" strokeWidth="1.5" />
            <path d="M50 20H100" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <circle cx="100" cy="20" r="2" fill="currentColor" />
          </svg>
        </div>
      </div>
    </section>
  );
}

/* ─── THE PROBLEM ───────────────────────────────── */
function TheProblem() {
  const problems = [
    {
      icon: (
        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      stat: "$500-$5,000/mo",
      title: "Corridor + QuickBooks",
      desc: "You pay Corridor for MRO, QuickBooks for accounting, and still double-enter everything.",
    },
    {
      icon: (
        <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      ),
      stat: "87% of shops",
      title: "Paper Logbooks = Risk",
      desc: "Paper-based compliance tracking means missed ADs, expired inspections, and FAA findings.",
    },
    {
      icon: (
        <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      ),
      stat: "2x the work",
      title: "Double Data Entry",
      desc: "Parts logged in MRO, re-entered in accounting. Work orders here, invoices there. Time wasted.",
    },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Sound Familiar?
        </h2>
        <p className="text-zinc-500 text-center mb-16 max-w-2xl mx-auto">
          Paper logbooks. $500/month Corridor. QuickBooks for the rest. The aviation MRO industry
          deserves better.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {problems.map((p, i) => (
            <div
              key={i}
              className="gradient-border rounded-xl bg-brand-card p-8 hover:bg-brand-cardHover transition-colors"
            >
              <div className="mb-4">{p.icon}</div>
              <div className="text-2xl font-bold font-mono text-white mb-2">{p.stat}</div>
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">{p.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── WHAT YOU'RE TESTING ───────────────────────── */
function ModulesGrid() {
  return (
    <section className="py-24 px-6 bg-brand-dark/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          What You&apos;re Testing
        </h2>
        <p className="text-zinc-500 text-center mb-16 max-w-2xl mx-auto">
          12 modules covering everything from aircraft registry to laser operations.
          Your feedback directly shapes what ships.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES_STATUS.map((mod) => (
            <div
              key={mod.name}
              className="rounded-lg bg-brand-card border border-brand-border p-5 hover:border-brand-borderHover transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-zinc-200">{mod.name}</h3>
                <StatusBadge status={mod.status} />
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full animate-progress"
                  style={{
                    width: `${mod.pct}%`,
                    backgroundColor:
                      mod.status === "live" ? "#10b981" :
                      mod.status === "beta" ? "#06B6D4" :
                      mod.status === "dev" ? "#f97316" : "#71717a",
                  }}
                />
              </div>
              <div className="text-right mt-1">
                <span className="text-xs text-zinc-500 font-mono">{mod.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PLATFORM STATS ────────────────────────────── */
function PlatformStats() {
  const stats = [
    { value: "145+", label: "Prisma Models" },
    { value: "309", label: "API Endpoints" },
    { value: "57", label: "Pages" },
    { value: "$99-$299", label: "vs $500-$5,000+" },
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center animate-count">
              <div className="text-3xl md:text-4xl font-bold font-mono text-white mb-1">
                {s.value}
              </div>
              <div className="text-sm text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── WHY JOIN ──────────────────────────────────── */
function WhyJoin() {
  const benefits = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
        </svg>
      ),
      title: "Early Access",
      desc: "Get the full platform before GA launch. Explore every module, test every workflow.",
      color: "text-brand-cyan",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
      title: "Direct Influence",
      desc: "Your feedback shapes the roadmap. Feature requests go straight to the dev team.",
      color: "text-brand-yellow",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
      ),
      title: "Founding Member Pricing",
      desc: "Beta testers get a locked-in rate at GA. The earlier you join, the more you save.",
      color: "text-emerald-400",
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
      title: "Industry Recognition",
      desc: "Your name in the launch credits. Help build the platform your peers will use.",
      color: "text-purple-400",
    },
  ];

  return (
    <section className="py-24 px-6 bg-brand-dark/50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Why Join the Beta?
        </h2>
        <p className="text-zinc-500 text-center mb-16 max-w-2xl mx-auto">
          This isn&apos;t just testing. You&apos;re co-building the future of aviation MRO software.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="rounded-xl bg-brand-card border border-brand-border p-6 hover:border-brand-borderHover transition-colors text-center"
            >
              <div className={`${b.color} flex justify-center mb-4`}>{b.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{b.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ──────────────────────────────── */
function HowItWorks() {
  const steps = [
    { num: 1, title: "Register", desc: "Fill out the beta application. Takes 2 minutes.", icon: "pencil" },
    { num: 2, title: "Get Approved", desc: "We review and approve within 24 hours.", icon: "check" },
    { num: 3, title: "Test & Report", desc: "Access the platform. Submit bugs and feature requests.", icon: "bug" },
    { num: 4, title: "Ship Together", desc: "Your feedback goes live. Watch your ideas ship.", icon: "rocket" },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How It Works
        </h2>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px border-t border-dashed border-zinc-700" />

          {steps.map((s) => (
            <div key={s.num} className="text-center relative">
              <div className="w-16 h-16 rounded-full bg-brand-card border-2 border-brand-cyan/30 flex items-center justify-center mx-auto mb-4 relative z-10">
                <span className="text-brand-cyan font-bold text-xl font-mono">{s.num}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
              <p className="text-zinc-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── BOTTOM CTA ────────────────────────────────── */
function BottomCTA() {
  return (
    <section className="py-24 px-6 bg-brand-dark/50">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Stop flying blind with paper and spreadsheets.
        </h2>
        <p className="text-zinc-400 mb-10 text-lg">
          Join the beta testers building the MRO platform they actually want to use.
        </p>
        <Link
          href="/register"
          className="inline-block px-10 py-4 bg-brand-yellow text-brand-black font-bold rounded-lg hover:bg-brand-yellow/90 transition-all text-lg shadow-lg shadow-brand-yellow/20"
        >
          Apply for Beta Access
        </Link>
        <p className="text-zinc-600 text-sm mt-6">
          No credit card. No commitment. Just feedback.
        </p>
      </div>
    </section>
  );
}

/* ─── FOOTER ────────────────────────────────────── */
function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-brand-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image src="/logoA.svg" alt="Adaptensor" width={28} height={28} />
          <span className="text-zinc-500 text-sm">Adaptensor, Inc.</span>
        </div>

        <div className="flex items-center gap-6 text-sm text-zinc-500">
          <a href="https://aviation.adaptensor.io" className="hover:text-zinc-300 transition-colors">
            AdaptAero
          </a>
          <a href="https://books.adaptensor.io" className="hover:text-zinc-300 transition-colors">
            AdaptBooks
          </a>
          <a href="https://vault.adaptensor.io" className="hover:text-zinc-300 transition-colors">
            AdaptVault
          </a>
        </div>

        <div className="text-sm text-zinc-600">
          v0.9.2-beta &middot; &copy; 2026
        </div>
      </div>
    </footer>
  );
}

/* ─── HEADER / NAV ──────────────────────────────── */
function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-black/80 backdrop-blur-md border-b border-brand-border/50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image src="/logoA.svg" alt="Adaptensor" width={32} height={32} />
          <span className="font-bold text-white">AdaptAero</span>
          <Badge className="bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30 ml-1">BETA</Badge>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <a href="#modules" className="hover:text-white transition-colors">Modules</a>
          <a href="#why" className="hover:text-white transition-colors">Why Join</a>
          <Link href="/status" className="hover:text-white transition-colors">Status</Link>
          <Link
            href="/register"
            className="px-4 py-2 bg-brand-yellow text-brand-black font-semibold rounded-lg hover:bg-brand-yellow/90 transition-all text-sm"
          >
            Join Beta
          </Link>
        </nav>

        {/* Mobile menu button */}
        <Link
          href="/register"
          className="md:hidden px-4 py-2 bg-brand-yellow text-brand-black font-semibold rounded-lg text-sm"
        >
          Join Beta
        </Link>
      </div>
    </header>
  );
}

/* ─── PAGE ──────────────────────────────────────── */
export default function LandingPage() {
  return (
    <main>
      <Header />
      <Hero />
      <TheProblem />
      <div id="modules">
        <ModulesGrid />
      </div>
      <PlatformStats />
      <div id="why">
        <WhyJoin />
      </div>
      <HowItWorks />
      <BottomCTA />
      <Footer />
    </main>
  );
}
