import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// ADAPTAERO BETA PORTAL — LANDING PAGE
// beta.adaptensor.io (public, no auth)
// ═══════════════════════════════════════════════════════════════

const B = {
  black: "#060505", dark: "#0A0A0A", card: "#111111", cardHover: "#161616",
  border: "#1E1E1E", borderHover: "#2A2A2A", yellow: "#F4D225",
  yellowDim: "rgba(244,210,37,0.08)", yellowGlow: "rgba(244,210,37,0.2)",
  cyan: "#06B6D4", cyanDim: "rgba(6,182,212,0.08)", cyanGlow: "rgba(6,182,212,0.15)",
  red: "#EF4444", redDim: "rgba(239,68,68,0.08)", orange: "#F97316",
  orangeDim: "rgba(249,115,22,0.08)", green: "#22C55E", greenDim: "rgba(34,197,94,0.08)",
  purple: "#A855F7", purpleDim: "rgba(168,85,247,0.08)",
  white: "#FFF", light: "#E0E0E0", gray: "#888", muted: "#555",
};
const F = "'DM Sans', system-ui, sans-serif";
const M = "'JetBrains Mono', 'Fira Code', monospace";

const MODULES = [
  { n: "Aircraft Registry", s: "live", p: 100 },
  { n: "Work Order Engine", s: "live", p: 100 },
  { n: "Compliance Engine", s: "live", p: 100 },
  { n: "Parts Traceability", s: "live", p: 100 },
  { n: "FAA Form Gen (337)", s: "live", p: 100 },
  { n: "Personnel & Calibration", s: "live", p: 100 },
  { n: "Reporting & Analytics", s: "beta", p: 90 },
  { n: "AdaptGent AI", s: "beta", p: 85 },
  { n: "Customer Portal", s: "beta", p: 80 },
  { n: "Migration Wizard", s: "dev", p: 60 },
  { n: "Offline / PWA", s: "dev", p: 45 },
  { n: "Laser Ops Module", s: "planned", p: 0 },
];

const SC = { live: { c: B.green, bg: B.greenDim, t: "LIVE" }, beta: { c: B.cyan, bg: B.cyanDim, t: "BETA" }, dev: { c: B.orange, bg: B.orangeDim, t: "DEV" }, planned: { c: B.muted, bg: "rgba(85,85,85,0.08)", t: "PLANNED" } };

function Badge({ children, color, bg, mono }) {
  return <span style={{ display: "inline-flex", alignItems: "center", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, color, background: bg, letterSpacing: "0.05em", textTransform: "uppercase", fontFamily: mono ? M : F }}>{children}</span>;
}

function AnimNum({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(t); }
      else setVal(start);
    }, 30);
    return () => clearInterval(t);
  }, [target]);
  return <span>{val}{suffix}</span>;
}

export default function BetaLanding() {
  const [hoverCTA, setHoverCTA] = useState(false);
  const [hoverCTA2, setHoverCTA2] = useState(false);

  const ctaStyle = (hover) => ({
    display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 32px",
    borderRadius: 12, border: "none", cursor: "pointer", fontWeight: 700,
    fontSize: 15, fontFamily: F, transition: "all 0.25s",
    background: hover ? "#FFE033" : B.yellow, color: B.black,
    transform: hover ? "translateY(-2px)" : "none",
    boxShadow: hover ? `0 8px 30px ${B.yellowGlow}` : "none",
    textDecoration: "none",
  });

  return (
    <div style={{ minHeight: "100vh", background: B.black, color: B.white, fontFamily: F, position: "relative", overflow: "hidden" }}>
      {/* ── Ambient ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: `radial-gradient(ellipse 900px 700px at 15% 5%, rgba(6,182,212,0.05) 0%, transparent 70%), radial-gradient(ellipse 700px 500px at 85% 95%, rgba(244,210,37,0.03) 0%, transparent 70%)` }} />
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(6,182,212,0.012) 3px,rgba(6,182,212,0.012) 4px)", zIndex: 1 }} />

      <div style={{ position: "relative", zIndex: 2 }}>

        {/* ═══ NAV ═══ */}
        <nav style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${B.cyanDim}, ${B.yellowDim})`, border: `1px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={B.cyan} strokeWidth="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800 }}><span style={{ color: B.yellow, fontStyle: "italic" }}>Adapt</span><span>Aero</span></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <span style={{ fontSize: 13, color: B.gray, cursor: "pointer" }}>Status</span>
            <span style={{ fontSize: 13, color: B.gray, cursor: "pointer" }}>Login</span>
            <a href="#register" style={ctaStyle(false)}
              onMouseEnter={() => {}} onMouseLeave={() => {}}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>Join Beta</span>
            </a>
          </div>
        </nav>

        {/* ═══ HERO ═══ */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 32px 60px", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 600, height: 600, background: `radial-gradient(circle, ${B.cyanGlow} 0%, transparent 70%)`, opacity: 0.3, pointerEvents: "none" }} />

          <Badge color={B.cyan} bg={B.cyanDim} mono>BETA v0.9.2 · FEBRUARY 2026</Badge>

          <h1 style={{ fontSize: 56, fontWeight: 900, lineHeight: 1.08, margin: "24px auto 0", maxWidth: 800, letterSpacing: "-0.03em", position: "relative" }}>
            Shape the Future of{" "}
            <span style={{ background: `linear-gradient(135deg, ${B.cyan}, #38BDF8)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Aviation MRO
            </span>
            {" "}Software
          </h1>

          <p style={{ fontSize: 18, color: B.gray, maxWidth: 620, margin: "20px auto 0", lineHeight: 1.6 }}>
            The only affordable, modern, FAA-compliant maintenance tracking system with
            <strong style={{ color: B.yellow }}> built-in double-entry accounting</strong>.
            Help us build what the industry needs.
          </p>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 36 }}>
            <button style={ctaStyle(hoverCTA)} onMouseEnter={() => setHoverCTA(true)} onMouseLeave={() => setHoverCTA(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
              Apply for Beta Access
            </button>
            <button style={{ padding: "14px 28px", borderRadius: 12, border: `1px solid ${B.border}`, background: "transparent", color: B.light, fontWeight: 600, fontSize: 14, fontFamily: F, cursor: "pointer", transition: "all 0.2s" }}>
              View Status →
            </button>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 40 }}>
            {[
              { icon: "✓", text: "No credit card required" },
              { icon: "✓", text: "Full platform access" },
              { icon: "✓", text: "Pre-loaded demo data" },
            ].map((item, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: B.muted }}>
                <span style={{ color: B.green, fontWeight: 700 }}>{item.icon}</span> {item.text}
              </span>
            ))}
          </div>
        </section>

        {/* ═══ THE PROBLEM ═══ */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Badge color={B.red} bg={B.redDim}>THE PROBLEM</Badge>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 16, letterSpacing: "-0.02em" }}>
              Aviation MRO software is <span style={{ color: B.red }}>broken</span>.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {[
              { num: "$500–$5K", sub: "/month for Corridor + QuickBooks", desc: "Legacy systems charge thousands monthly and still don't include accounting. You're paying twice for half the solution.", icon: "💸" },
              { num: "60–70%", sub: "of shops still on paper", desc: "The vast majority of independent A&P mechanics track maintenance with paper logbooks and handwritten receipts. One lost form = compliance nightmare.", icon: "📋" },
              { num: "2×", sub: "double data entry", desc: "Every competitor requires separate accounting software. Your team enters parts in Corridor, then again in QuickBooks. Every day. On every job.", icon: "⚠️" },
            ].map((card, i) => (
              <div key={i} style={{
                background: B.card, borderRadius: 16, padding: "28px 24px",
                border: `1px solid ${B.border}`, position: "relative", overflow: "hidden",
              }}>
                <div style={{ position: "absolute", top: -10, right: -5, fontSize: 60, opacity: 0.04 }}>{card.icon}</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: B.red, fontFamily: M, letterSpacing: "-0.03em" }}>{card.num}</div>
                <div style={{ fontSize: 13, color: B.muted, marginTop: 2, fontFamily: M }}>{card.sub}</div>
                <p style={{ fontSize: 14, color: B.gray, lineHeight: 1.6, marginTop: 12 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ WHAT YOU'RE TESTING ═══ */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Badge color={B.cyan} bg={B.cyanDim}>WHAT YOU'RE TESTING</Badge>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 16, letterSpacing: "-0.02em" }}>
              12 Modules. <span style={{ color: B.cyan }}>8 Live.</span> Built for your shop.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
            {MODULES.map((m, i) => {
              const s = SC[m.s];
              return (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 18px",
                  background: B.card, borderRadius: 12, border: `1px solid ${B.border}`,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: m.s === "planned" ? B.muted : B.light }}>{m.n}</div>
                    <div style={{ height: 4, background: "rgba(255,255,255,0.04)", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                      <div style={{ width: `${m.p}%`, height: "100%", borderRadius: 2, background: m.p === 100 ? B.green : m.p > 70 ? B.cyan : m.p > 30 ? B.orange : B.muted, transition: "width 1.5s ease" }} />
                    </div>
                  </div>
                  <Badge color={s.c} bg={s.bg} mono>{s.t}</Badge>
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ PLATFORM STATS ═══ */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px 60px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            {[
              { val: 145, suf: "+", label: "Prisma Models", color: B.cyan },
              { val: 309, suf: "", label: "API Endpoints", color: B.green },
              { val: 57, suf: "", label: "Frontend Pages", color: B.yellow },
              { val: 113, suf: "", label: "Database Tables", color: B.purple },
              { val: 99, suf: "", label: "$/mo Starting", color: B.green, prefix: "$" },
            ].map((s, i) => (
              <div key={i} style={{
                background: B.card, borderRadius: 14, padding: "24px 20px", textAlign: "center",
                border: `1px solid ${B.border}`,
              }}>
                <div style={{ fontSize: 40, fontWeight: 900, color: s.color, fontFamily: M, letterSpacing: "-0.03em" }}>
                  {s.prefix || ""}<AnimNum target={s.val} suffix={s.suf} />
                </div>
                <div style={{ fontSize: 12, color: B.muted, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: M }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ WHY JOIN ═══ */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <Badge color={B.yellow} bg={B.yellowDim}>WHY JOIN</Badge>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 16, letterSpacing: "-0.02em" }}>
              Beta testers get <span style={{ color: B.yellow }}>founding member</span> status.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {[
              { icon: "🔑", title: "Early Access", desc: "Full platform access months before GA launch. See features before anyone else and test with demo data that mirrors real MRO operations." },
              { icon: "🎯", title: "Direct Influence", desc: "Your bug reports and feature requests shape the roadmap. We don't just listen — we build what the community needs. Every report gets reviewed." },
              { icon: "💰", title: "Founding Pricing", desc: "Lock in founding member pricing at GA launch. Beta testers get a permanent discount on their subscription tier — forever." },
              { icon: "✈️", title: "Industry Recognition", desc: "Named in launch credits as a founding beta tester. Your shop helped build the platform that changes aviation MRO for thousands." },
            ].map((card, i) => (
              <div key={i} style={{
                background: B.card, borderRadius: 16, padding: "28px 24px",
                border: `1px solid ${B.border}`, transition: "border-color 0.2s, transform 0.2s",
                cursor: "default",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = B.borderHover; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = B.border; e.currentTarget.style.transform = "none"; }}
              >
                <div style={{ fontSize: 32, marginBottom: 14 }}>{card.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{card.title}</h3>
                <p style={{ fontSize: 14, color: B.gray, lineHeight: 1.6 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ HOW IT WORKS ═══ */}
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <Badge color={B.green} bg={B.greenDim}>HOW IT WORKS</Badge>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginTop: 16, letterSpacing: "-0.02em" }}>
              Four steps to <span style={{ color: B.green }}>shaping aviation software</span>.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, position: "relative" }}>
            {[
              { num: "01", title: "Register", desc: "Fill out a quick form with your shop info and what you fly. Takes 2 minutes.", color: B.cyan },
              { num: "02", title: "Get Approved", desc: "We review applications to keep the beta focused. Most get approved within 24 hours.", color: B.yellow },
              { num: "03", title: "Test & Report", desc: "Use the platform, find bugs, request features. Upload screenshots. Every report matters.", color: B.orange },
              { num: "04", title: "Ship Together", desc: "Watch your feedback turn into features. Get founding member pricing at GA launch.", color: B.green },
            ].map((step, i) => (
              <div key={i} style={{
                background: B.card, borderRadius: 16, padding: "28px 24px",
                border: `1px solid ${B.border}`, position: "relative",
              }}>
                <div style={{ position: "absolute", top: 16, right: 18, fontSize: 48, fontWeight: 900, fontFamily: M, color: `${step.color}10`, lineHeight: 1 }}>{step.num}</div>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${step.color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: step.color, fontFamily: M }}>{step.num}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: B.gray, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ BOTTOM CTA ═══ */}
        <section style={{ maxWidth: 800, margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
          <h2 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
            Stop flying blind with<br />
            <span style={{ color: B.yellow }}>paper and spreadsheets</span>.
          </h2>
          <p style={{ fontSize: 16, color: B.gray, marginTop: 16, marginBottom: 32 }}>
            No credit card. No commitment. Just feedback that builds the future of MRO software.
          </p>
          <button id="register" style={ctaStyle(hoverCTA2)} onMouseEnter={() => setHoverCTA2(true)} onMouseLeave={() => setHoverCTA2(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
            Apply for Beta Access
          </button>

          <div style={{ marginTop: 40, padding: "16px 24px", background: B.yellowDim, borderRadius: 12, border: `1px solid rgba(244,210,37,0.12)`, display: "inline-flex", alignItems: "center", gap: 12, maxWidth: 500 }}>
            <span style={{ fontSize: 13, color: B.light, lineHeight: 1.5 }}>
              <strong style={{ color: B.yellow }}>23 beta testers</strong> across <strong style={{ color: B.yellow }}>6 repair stations</strong> are already testing. Join them.
            </span>
          </div>
        </section>

        {/* ═══ FOOTER ═══ */}
        <footer style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 32px 32px", borderTop: `1px solid ${B.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 13, color: B.muted }}>
            <span style={{ fontStyle: "italic", color: B.yellow }}>Adapt</span><span style={{ color: B.gray }}>ensor</span>, Inc. · © 2026
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            {["aviation.adaptensor.io", "books.adaptensor.io", "vault.adaptensor.io"].map((l, i) => (
              <span key={i} style={{ fontSize: 11, color: B.muted, fontFamily: M }}>{l}</span>
            ))}
          </div>
          <span style={{ fontSize: 11, color: B.muted, fontFamily: M }}>v0.9.2-beta</span>
        </footer>
      </div>
    </div>
  );
}
