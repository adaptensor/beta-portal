import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════════
// ADAPTAERO BETA TESTING PORTAL
// aviation.adaptensor.io/beta
// ═══════════════════════════════════════════════════════════════

const BRAND = {
  black: "#060505",
  dark: "#0A0A0A",
  card: "#111111",
  cardHover: "#161616",
  border: "#1E1E1E",
  borderHover: "#2A2A2A",
  yellow: "#F4D225",
  yellowDim: "rgba(244,210,37,0.08)",
  yellowGlow: "rgba(244,210,37,0.25)",
  cyan: "#06B6D4",
  cyanDim: "rgba(6,182,212,0.08)",
  cyanGlow: "rgba(6,182,212,0.2)",
  red: "#EF4444",
  redDim: "rgba(239,68,68,0.1)",
  orange: "#F97316",
  orangeDim: "rgba(249,115,22,0.1)",
  green: "#22C55E",
  greenDim: "rgba(34,197,94,0.1)",
  purple: "#A855F7",
  purpleDim: "rgba(168,85,247,0.1)",
  white: "#FFFFFF",
  lightGray: "#E0E0E0",
  gray: "#888888",
  darkGray: "#555555",
};

const FONT = "'DM Sans', 'Segoe UI', system-ui, sans-serif";
const MONO = "'JetBrains Mono', 'Fira Code', monospace";

const SEVERITY = {
  critical: { label: "Critical", color: BRAND.red, bg: BRAND.redDim, icon: "🔴" },
  high: { label: "High", color: BRAND.orange, bg: BRAND.orangeDim, icon: "🟠" },
  medium: { label: "Medium", color: BRAND.yellow, bg: BRAND.yellowDim, icon: "🟡" },
  low: { label: "Low", color: BRAND.cyan, bg: BRAND.cyanDim, icon: "🔵" },
};

const CATEGORIES = [
  "Aircraft Registry", "Work Orders", "Compliance Engine", "Parts Traceability",
  "FAA Forms", "Personnel", "Reporting", "Dashboard", "POS / Counter",
  "Accounting / GL", "AdaptGent AI", "Onboarding", "Mobile / PWA",
  "Performance", "Authentication", "Other"
];

const MODULES_STATUS = [
  { name: "Aircraft Registry", status: "live", pct: 100 },
  { name: "Work Order Engine", status: "live", pct: 100 },
  { name: "Compliance Engine (AD/SB)", status: "live", pct: 100 },
  { name: "Parts Traceability & 8130-3", status: "live", pct: 100 },
  { name: "FAA Form Generation (337)", status: "live", pct: 100 },
  { name: "Personnel & Calibration", status: "live", pct: 100 },
  { name: "Reporting & Analytics", status: "beta", pct: 90 },
  { name: "AdaptGent Aviation AI", status: "beta", pct: 85 },
  { name: "Customer Portal (Owner)", status: "beta", pct: 80 },
  { name: "Data Migration Wizard", status: "dev", pct: 60 },
  { name: "Offline / PWA Mode", status: "dev", pct: 45 },
  { name: "Laser Operations Module", status: "planned", pct: 0 },
];

const SAMPLE_REPORTS = [
  { id: "BUG-001", title: "Squawk item not saving corrective action text", severity: "high", category: "Work Orders", status: "fixed", author: "Mike T.", date: "Feb 18" },
  { id: "BUG-002", title: "AD compliance date picker off by one day (timezone)", severity: "critical", category: "Compliance Engine", status: "investigating", author: "Sarah K.", date: "Feb 19" },
  { id: "BUG-003", title: "8130-3 PDF cuts off serial number field on long parts", severity: "medium", category: "FAA Forms", status: "fixed", author: "Dave R.", date: "Feb 17" },
  { id: "FR-001", title: "Bulk import ADs from CSV for fleet operators", severity: "low", category: "Compliance Engine", status: "planned", author: "Chris M.", date: "Feb 16" },
  { id: "BUG-004", title: "Parts counter POS doesn't auto-print 8130-3 on sale", severity: "high", category: "POS / Counter", status: "in-progress", author: "Lisa P.", date: "Feb 19" },
  { id: "FR-002", title: "Dark/light theme toggle for hangar bay displays", severity: "low", category: "Dashboard", status: "planned", author: "Tom W.", date: "Feb 15" },
];

const STATUS_STYLES = {
  fixed: { color: BRAND.green, bg: BRAND.greenDim, label: "Fixed" },
  investigating: { color: BRAND.orange, bg: BRAND.orangeDim, label: "Investigating" },
  "in-progress": { color: BRAND.cyan, bg: BRAND.cyanDim, label: "In Progress" },
  planned: { color: BRAND.purple, bg: BRAND.purpleDim, label: "Planned" },
  submitted: { color: BRAND.gray, bg: "rgba(136,136,136,0.1)", label: "Submitted" },
};

// ─── Icon components ───
const PlaneIcon = ({ size = 20, color = BRAND.cyan }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
  </svg>
);

const BugIcon = ({ size = 18, color = BRAND.red }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2l1.88 1.88M14.12 3.88L16 2M9 7.13v-1a3.003 3.003 0 116 0v1"/>
    <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 014-4h4a4 4 0 014 4v3c0 3.3-2.7 6-6 6z"/>
    <path d="M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-2.1 1.7-3.9 3.8-4M20.97 5c0 2.1-1.6 3.8-3.5 4M22 13h-4M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
  </svg>
);

const SparkleIcon = ({ size = 18, color = BRAND.yellow }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"/>
  </svg>
);

const ShieldIcon = ({ size = 18, color = BRAND.green }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
);

const UploadIcon = ({ size = 18, color = BRAND.gray }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
  </svg>
);

const CheckIcon = ({ size = 16, color = BRAND.green }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ChevronIcon = ({ size = 16, color = BRAND.gray, direction = "right" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ transform: direction === "down" ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

// ─── Reusable components ───
function Badge({ children, color, bg }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 700,
      padding: "3px 10px", borderRadius: 20, color, background: bg,
      letterSpacing: "0.03em", textTransform: "uppercase", fontFamily: MONO,
    }}>
      {children}
    </span>
  );
}

function InputField({ label, required, type = "text", placeholder, value, onChange, rows }) {
  const baseStyle = {
    width: "100%", background: BRAND.dark, border: `1px solid ${BRAND.border}`,
    borderRadius: 10, padding: rows ? "12px 14px" : "10px 14px", color: BRAND.white,
    fontSize: 14, fontFamily: FONT, outline: "none", transition: "border-color 0.2s",
    resize: rows ? "vertical" : undefined,
  };
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BRAND.lightGray, marginBottom: 6, fontFamily: FONT }}>
          {label}{required && <span style={{ color: BRAND.yellow, marginLeft: 3 }}>*</span>}
        </label>
      )}
      {rows ? (
        <textarea rows={rows} placeholder={placeholder} value={value} onChange={onChange}
          style={baseStyle}
          onFocus={e => e.target.style.borderColor = BRAND.cyan}
          onBlur={e => e.target.style.borderColor = BRAND.border}
        />
      ) : (
        <input type={type} placeholder={placeholder} value={value} onChange={onChange}
          style={baseStyle}
          onFocus={e => e.target.style.borderColor = BRAND.cyan}
          onBlur={e => e.target.style.borderColor = BRAND.border}
        />
      )}
    </div>
  );
}

function SelectField({ label, required, options, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BRAND.lightGray, marginBottom: 6, fontFamily: FONT }}>
          {label}{required && <span style={{ color: BRAND.yellow, marginLeft: 3 }}>*</span>}
        </label>
      )}
      <select value={value} onChange={onChange}
        style={{
          width: "100%", background: BRAND.dark, border: `1px solid ${BRAND.border}`,
          borderRadius: 10, padding: "10px 14px", color: value ? BRAND.white : BRAND.darkGray,
          fontSize: 14, fontFamily: FONT, outline: "none", cursor: "pointer",
          appearance: "none", WebkitAppearance: "none",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
        }}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── Main Portal Component ───
export default function AdaptAeroBetaPortal() {
  const [view, setView] = useState("dashboard"); // dashboard | register | report | feature | tracker
  const [animateIn, setAnimateIn] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [submitted, setSubmitted] = useState(null); // "bug" | "feature" | null
  const [reports, setReports] = useState(SAMPLE_REPORTS);

  // Registration form
  const [regForm, setRegForm] = useState({ name: "", email: "", company: "", role: "", aircraft: "", mroSoftware: "", agree: false });

  // Bug report form
  const [bugForm, setBugForm] = useState({ title: "", category: "", severity: "", steps: "", expected: "", actual: "", browser: "", screenshots: [] });

  // Feature request form
  const [featForm, setFeatForm] = useState({ title: "", category: "", description: "", useCase: "", priority: "" });

  const fileInputRef = useRef(null);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const switchView = (v) => {
    setAnimateIn(false);
    setSubmitted(null);
    setTimeout(() => { setView(v); setAnimateIn(true); }, 200);
  };

  const handleRegister = (e) => {
    e?.preventDefault();
    setRegistered(true);
    switchView("dashboard");
  };

  const handleBugSubmit = (e) => {
    e?.preventDefault();
    const newReport = {
      id: `BUG-${String(reports.filter(r => r.id.startsWith("BUG")).length + 1).padStart(3, "0")}`,
      title: bugForm.title, severity: bugForm.severity || "medium",
      category: bugForm.category || "Other", status: "submitted",
      author: regForm.name || "Beta Tester", date: "Just now",
    };
    setReports([newReport, ...reports]);
    setSubmitted("bug");
    setBugForm({ title: "", category: "", severity: "", steps: "", expected: "", actual: "", browser: "", screenshots: [] });
  };

  const handleFeatureSubmit = (e) => {
    e?.preventDefault();
    const newReport = {
      id: `FR-${String(reports.filter(r => r.id.startsWith("FR")).length + 1).padStart(3, "0")}`,
      title: featForm.title, severity: featForm.priority || "low",
      category: featForm.category || "Other", status: "submitted",
      author: regForm.name || "Beta Tester", date: "Just now",
    };
    setReports([newReport, ...reports]);
    setSubmitted("feature");
    setFeatForm({ title: "", category: "", description: "", useCase: "", priority: "" });
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFilesChosen = (e) => {
    const files = Array.from(e.target.files || []);
    const newScreenshots = files.map(f => ({ name: f.name, size: (f.size / 1024).toFixed(1) + " KB" }));
    setBugForm(prev => ({ ...prev, screenshots: [...prev.screenshots, ...newScreenshots] }));
  };

  // ─── NAV TABS ───
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "◆" },
    { id: "report", label: "Report Bug", icon: "⬡" },
    { id: "feature", label: "Request Feature", icon: "✦" },
    { id: "tracker", label: "Tracker", icon: "◎" },
  ];

  // ═══ RENDER ═══
  return (
    <div style={{
      minHeight: "100vh", background: BRAND.black, color: BRAND.white, fontFamily: FONT,
      position: "relative", overflow: "hidden",
    }}>
      {/* ── Ambient background ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
        background: `
          radial-gradient(ellipse 800px 600px at 20% 10%, rgba(6,182,212,0.04) 0%, transparent 70%),
          radial-gradient(ellipse 600px 400px at 80% 90%, rgba(244,210,37,0.03) 0%, transparent 70%),
          radial-gradient(ellipse 400px 400px at 50% 50%, rgba(6,182,212,0.02) 0%, transparent 70%)
        `,
      }} />

      {/* ── Scan line effect ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.015) 2px, rgba(6,182,212,0.015) 4px)",
        zIndex: 1,
      }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

        {/* ═══ HEADER ═══ */}
        <header style={{
          padding: "28px 0 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${BRAND.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center",
              background: `linear-gradient(135deg, ${BRAND.cyanDim}, rgba(244,210,37,0.05))`,
              border: `1px solid ${BRAND.border}`,
            }}>
              <PlaneIcon size={22} color={BRAND.cyan} />
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em" }}>
                  <span style={{ color: BRAND.yellow, fontStyle: "italic" }}>Adapt</span>
                  <span style={{ color: BRAND.white }}>Aero</span>
                </span>
                <Badge color={BRAND.cyan} bg={BRAND.cyanDim}>BETA</Badge>
              </div>
              <div style={{ fontSize: 11, color: BRAND.darkGray, fontFamily: MONO, letterSpacing: "0.05em", marginTop: 2 }}>
                AVIATION MRO CLOUD PLATFORM
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {registered && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8, padding: "6px 14px",
                background: BRAND.greenDim, borderRadius: 20, border: `1px solid rgba(34,197,94,0.15)`,
              }}>
                <CheckIcon size={14} />
                <span style={{ fontSize: 12, fontWeight: 600, color: BRAND.green }}>Beta Tester</span>
              </div>
            )}
            {!registered && (
              <button onClick={() => switchView("register")}
                style={{
                  padding: "8px 20px", borderRadius: 10, border: "none", cursor: "pointer",
                  background: BRAND.yellow, color: BRAND.black, fontWeight: 700, fontSize: 13,
                  fontFamily: FONT, transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.target.style.background = "#FFE033"; e.target.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.target.style.background = BRAND.yellow; e.target.style.transform = "none"; }}
              >
                Join Beta Program
              </button>
            )}
          </div>
        </header>

        {/* ═══ NAV TABS ═══ */}
        <nav style={{
          display: "flex", gap: 4, padding: "16px 0", borderBottom: `1px solid ${BRAND.border}`,
          overflowX: "auto",
        }}>
          {tabs.map(tab => {
            const active = view === tab.id;
            return (
              <button key={tab.id} onClick={() => switchView(tab.id)}
                style={{
                  padding: "8px 18px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: active ? BRAND.cyanDim : "transparent",
                  color: active ? BRAND.cyan : BRAND.gray,
                  fontWeight: active ? 700 : 500, fontSize: 13, fontFamily: FONT,
                  transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
                  borderBottom: active ? `2px solid ${BRAND.cyan}` : "2px solid transparent",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { if (!active) e.target.style.color = BRAND.lightGray; }}
                onMouseLeave={e => { if (!active) e.target.style.color = BRAND.gray; }}
              >
                <span style={{ fontSize: 11 }}>{tab.icon}</span> {tab.label}
              </button>
            );
          })}
        </nav>

        {/* ═══ CONTENT ═══ */}
        <main style={{
          padding: "32px 0 60px",
          opacity: animateIn ? 1 : 0,
          transform: animateIn ? "translateY(0)" : "translateY(12px)",
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        }}>

          {/* ──── DASHBOARD VIEW ──── */}
          {view === "dashboard" && (
            <div>
              {/* Welcome banner */}
              <div style={{
                background: `linear-gradient(135deg, ${BRAND.card}, ${BRAND.dark})`,
                borderRadius: 16, padding: "32px 36px", marginBottom: 28,
                border: `1px solid ${BRAND.border}`,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: -40, right: -20, width: 200, height: 200,
                  background: `radial-gradient(circle, ${BRAND.cyanGlow} 0%, transparent 70%)`,
                  opacity: 0.4,
                }} />
                <div style={{ position: "relative" }}>
                  <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.02em" }}>
                    Welcome to the <span style={{ color: BRAND.cyan }}>AdaptAero</span> Beta
                  </h1>
                  <p style={{ fontSize: 15, color: BRAND.gray, lineHeight: 1.6, maxWidth: 650 }}>
                    You're testing the only affordable, modern, FAA-compliant MRO tracking system with built-in
                    double-entry accounting. Your feedback directly shapes what ships. Every bug report and feature
                    request gets reviewed by the development team.
                  </p>
                  <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
                    <button onClick={() => switchView("report")}
                      style={{
                        padding: "10px 22px", borderRadius: 10, border: `1px solid ${BRAND.border}`,
                        background: BRAND.card, color: BRAND.white, fontWeight: 600, fontSize: 13,
                        fontFamily: FONT, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND.red; e.currentTarget.style.background = BRAND.redDim; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = BRAND.border; e.currentTarget.style.background = BRAND.card; }}
                    >
                      <BugIcon size={16} /> Report a Bug
                    </button>
                    <button onClick={() => switchView("feature")}
                      style={{
                        padding: "10px 22px", borderRadius: 10, border: `1px solid ${BRAND.border}`,
                        background: BRAND.card, color: BRAND.white, fontWeight: 600, fontSize: 13,
                        fontFamily: FONT, cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND.yellow; e.currentTarget.style.background = BRAND.yellowDim; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = BRAND.border; e.currentTarget.style.background = BRAND.card; }}
                    >
                      <SparkleIcon size={16} /> Request Feature
                    </button>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 28 }}>
                {[
                  { label: "Beta Version", value: "0.9.2", sub: "Build 2026.02.20", color: BRAND.cyan },
                  { label: "Modules Live", value: "8 / 12", sub: "4 in development", color: BRAND.green },
                  { label: "Open Issues", value: String(reports.filter(r => r.status !== "fixed").length), sub: `${reports.filter(r => r.status === "fixed").length} resolved`, color: BRAND.orange },
                  { label: "Prisma Models", value: "145+", sub: "309 API routes", color: BRAND.purple },
                  { label: "Beta Testers", value: registered ? "You + 23" : "23", sub: "6 repair stations", color: BRAND.yellow },
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: BRAND.card, borderRadius: 14, padding: "20px 18px",
                    border: `1px solid ${BRAND.border}`, transition: "border-color 0.2s",
                  }}>
                    <div style={{ fontSize: 11, color: BRAND.darkGray, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                      {stat.label}
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: stat.color, letterSpacing: "-0.02em" }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: 12, color: BRAND.darkGray, marginTop: 4 }}>{stat.sub}</div>
                  </div>
                ))}
              </div>

              {/* Module status */}
              <div style={{
                background: BRAND.card, borderRadius: 16, padding: "24px 28px",
                border: `1px solid ${BRAND.border}`, marginBottom: 28,
              }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                  <ShieldIcon size={18} /> Module Status
                </h2>
                <div style={{ display: "grid", gap: 10 }}>
                  {MODULES_STATUS.map((mod, i) => {
                    const statusColors = {
                      live: { c: BRAND.green, bg: BRAND.greenDim, t: "LIVE" },
                      beta: { c: BRAND.cyan, bg: BRAND.cyanDim, t: "BETA" },
                      dev: { c: BRAND.orange, bg: BRAND.orangeDim, t: "DEV" },
                      planned: { c: BRAND.darkGray, bg: "rgba(85,85,85,0.1)", t: "PLANNED" },
                    };
                    const s = statusColors[mod.status];
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{ flex: "0 0 200px", fontSize: 13, fontWeight: 500, color: mod.status === "planned" ? BRAND.darkGray : BRAND.lightGray }}>
                          {mod.name}
                        </div>
                        <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.04)", borderRadius: 3, overflow: "hidden" }}>
                          <div style={{
                            width: `${mod.pct}%`, height: "100%", borderRadius: 3,
                            background: mod.pct === 100 ? BRAND.green : mod.pct > 70 ? BRAND.cyan : mod.pct > 30 ? BRAND.orange : BRAND.darkGray,
                            transition: "width 1s ease",
                          }} />
                        </div>
                        <div style={{ flex: "0 0 55px", textAlign: "right" }}>
                          <Badge color={s.c} bg={s.bg}>{s.t}</Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent activity */}
              <div style={{
                background: BRAND.card, borderRadius: 16, padding: "24px 28px",
                border: `1px solid ${BRAND.border}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <h2 style={{ fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", gap: 10 }}>
                    Recent Reports
                  </h2>
                  <button onClick={() => switchView("tracker")}
                    style={{
                      background: "none", border: "none", color: BRAND.cyan, fontSize: 13,
                      fontWeight: 600, cursor: "pointer", fontFamily: FONT,
                      display: "flex", alignItems: "center", gap: 4,
                    }}>
                    View All <ChevronIcon size={14} color={BRAND.cyan} />
                  </button>
                </div>
                {reports.slice(0, 4).map((r, i) => {
                  const sev = SEVERITY[r.severity] || SEVERITY.medium;
                  const st = STATUS_STYLES[r.status] || STATUS_STYLES.submitted;
                  return (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 14, padding: "14px 0",
                      borderTop: i > 0 ? `1px solid rgba(255,255,255,0.04)` : "none",
                    }}>
                      <span style={{ fontFamily: MONO, fontSize: 12, color: BRAND.darkGray, flex: "0 0 65px" }}>{r.id}</span>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: BRAND.lightGray }}>{r.title}</span>
                      <Badge color={sev.color} bg={sev.bg}>{sev.label}</Badge>
                      <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ──── REGISTER VIEW ──── */}
          {view === "register" && (
            <div style={{ maxWidth: 580, margin: "0 auto" }}>
              <div style={{
                background: BRAND.card, borderRadius: 16, padding: "36px 32px",
                border: `1px solid ${BRAND.border}`,
              }}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px",
                    background: `linear-gradient(135deg, ${BRAND.cyanDim}, ${BRAND.yellowDim})`,
                    border: `1px solid ${BRAND.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <PlaneIcon size={28} />
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Join the Beta Program</h2>
                  <p style={{ fontSize: 14, color: BRAND.gray }}>
                    Get early access to AdaptAero and help shape the future of affordable MRO software.
                  </p>
                </div>

                <InputField label="Full Name" required placeholder="e.g. John Smith" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} />
                <InputField label="Email" required type="email" placeholder="you@yourshop.com" value={regForm.email} onChange={e => setRegForm({...regForm, email: e.target.value})} />
                <InputField label="Company / Shop Name" placeholder="e.g. Skyline Aviation Services" value={regForm.company} onChange={e => setRegForm({...regForm, company: e.target.value})} />

                <SelectField label="Your Role" required options={[
                  "A&P Mechanic", "IA Inspector", "Shop Owner / Manager", "Avionics Technician",
                  "Parts Manager", "Service Writer", "Aircraft Owner / Operator", "FBO Manager", "Other"
                ]} value={regForm.role} onChange={e => setRegForm({...regForm, role: e.target.value})} placeholder="Select your role..." />

                <InputField label="Aircraft Types You Work On" placeholder="e.g. Cessna 172, Piper Cherokee, Beechcraft Bonanza..." value={regForm.aircraft} onChange={e => setRegForm({...regForm, aircraft: e.target.value})} />

                <SelectField label="Current MRO Software" options={[
                  "None (paper/spreadsheets)", "Corridor / ATP", "CAMP Systems", "Quantum MX",
                  "AvSight", "Traxxall", "Ramco", "Custom / In-house", "Other"
                ]} value={regForm.mroSoftware} onChange={e => setRegForm({...regForm, mroSoftware: e.target.value})} placeholder="What are you using today?" />

                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 20, marginBottom: 24 }}>
                  <input type="checkbox" checked={regForm.agree}
                    onChange={e => setRegForm({...regForm, agree: e.target.checked})}
                    style={{ marginTop: 3, accentColor: BRAND.cyan, width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 13, color: BRAND.gray, lineHeight: 1.5 }}>
                    I understand this is beta software. I agree to report bugs and provide feedback.
                    My data during beta testing may be reset. I will not use this for production
                    maintenance records until the platform reaches v1.0 GA release.
                  </span>
                </div>

                <button onClick={handleRegister}
                  disabled={!regForm.name || !regForm.email || !regForm.role || !regForm.agree}
                  style={{
                    width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
                    background: (regForm.name && regForm.email && regForm.role && regForm.agree) ? BRAND.yellow : BRAND.border,
                    color: (regForm.name && regForm.email && regForm.role && regForm.agree) ? BRAND.black : BRAND.darkGray,
                    fontWeight: 700, fontSize: 15, fontFamily: FONT, transition: "all 0.2s",
                    opacity: (regForm.name && regForm.email && regForm.role && regForm.agree) ? 1 : 0.5,
                  }}
                  onMouseEnter={e => { if (regForm.agree) e.target.style.background = "#FFE033"; }}
                  onMouseLeave={e => { if (regForm.agree) e.target.style.background = BRAND.yellow; }}
                >
                  🛩️  Register for Beta Access
                </button>

                <div style={{ textAlign: "center", marginTop: 16 }}>
                  <span style={{ fontSize: 12, color: BRAND.darkGray }}>
                    Beta includes full platform access with demo data pre-loaded.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ──── BUG REPORT VIEW ──── */}
          {view === "report" && (
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
              {submitted === "bug" ? (
                <div style={{
                  background: BRAND.card, borderRadius: 16, padding: "48px 32px",
                  border: `1px solid rgba(34,197,94,0.2)`, textAlign: "center",
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
                    background: BRAND.greenDim, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <CheckIcon size={32} />
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: BRAND.green }}>Bug Report Submitted</h2>
                  <p style={{ fontSize: 14, color: BRAND.gray, marginBottom: 24 }}>
                    Your report has been logged. Our dev team will review it and update the status in the tracker.
                  </p>
                  <button onClick={() => { setSubmitted(null); switchView("tracker"); }}
                    style={{
                      padding: "10px 24px", borderRadius: 10, border: `1px solid ${BRAND.border}`,
                      background: BRAND.card, color: BRAND.cyan, fontWeight: 600, fontSize: 13,
                      fontFamily: FONT, cursor: "pointer",
                    }}>
                    View in Tracker →
                  </button>
                </div>
              ) : (
                <div style={{
                  background: BRAND.card, borderRadius: 16, padding: "32px",
                  border: `1px solid ${BRAND.border}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, background: BRAND.redDim,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <BugIcon size={20} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: 20, fontWeight: 800 }}>Report a Bug</h2>
                      <p style={{ fontSize: 13, color: BRAND.darkGray }}>Help us squash it. The more detail, the faster the fix.</p>
                    </div>
                  </div>

                  <InputField label="Bug Title" required placeholder="Brief description of the issue" value={bugForm.title} onChange={e => setBugForm({...bugForm, title: e.target.value})} />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <SelectField label="Module" required options={CATEGORIES} value={bugForm.category} onChange={e => setBugForm({...bugForm, category: e.target.value})} placeholder="Select module..." />
                    <SelectField label="Severity" required options={["critical", "high", "medium", "low"]} value={bugForm.severity} onChange={e => setBugForm({...bugForm, severity: e.target.value})} placeholder="Select severity..." />
                  </div>

                  <InputField label="Steps to Reproduce" required placeholder={"1. Go to Aircraft Registry\n2. Click 'Add Aircraft'\n3. Enter N-number and save\n4. Error appears..."} rows={4} value={bugForm.steps} onChange={e => setBugForm({...bugForm, steps: e.target.value})} />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <InputField label="Expected Behavior" placeholder="What should happen" rows={2} value={bugForm.expected} onChange={e => setBugForm({...bugForm, expected: e.target.value})} />
                    <InputField label="Actual Behavior" placeholder="What actually happens" rows={2} value={bugForm.actual} onChange={e => setBugForm({...bugForm, actual: e.target.value})} />
                  </div>

                  <InputField label="Browser & OS" placeholder="e.g. Chrome 122 on Windows 11" value={bugForm.browser} onChange={e => setBugForm({...bugForm, browser: e.target.value})} />

                  {/* Screenshot upload */}
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BRAND.lightGray, marginBottom: 6, fontFamily: FONT }}>
                      Screenshots
                    </label>
                    <input type="file" ref={fileInputRef} multiple accept="image/*" style={{ display: "none" }} onChange={handleFilesChosen} />
                    <button onClick={handleFileSelect}
                      style={{
                        width: "100%", padding: "20px", borderRadius: 10,
                        border: `2px dashed ${BRAND.border}`, background: "transparent",
                        color: BRAND.gray, cursor: "pointer", fontSize: 13, fontFamily: FONT,
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND.cyan; e.currentTarget.style.background = BRAND.cyanDim; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = BRAND.border; e.currentTarget.style.background = "transparent"; }}
                    >
                      <UploadIcon size={24} color={BRAND.darkGray} />
                      <span>Click to upload screenshots (PNG, JPG, GIF)</span>
                      <span style={{ fontSize: 11, color: BRAND.darkGray }}>Max 10MB per file</span>
                    </button>
                    {bugForm.screenshots.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                        {bugForm.screenshots.map((s, i) => (
                          <div key={i} style={{
                            display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                            background: BRAND.dark, borderRadius: 8, border: `1px solid ${BRAND.border}`,
                          }}>
                            <span style={{ fontSize: 12, color: BRAND.lightGray }}>{s.name}</span>
                            <span style={{ fontSize: 10, color: BRAND.darkGray }}>{s.size}</span>
                            <button onClick={() => setBugForm(prev => ({...prev, screenshots: prev.screenshots.filter((_, j) => j !== i)}))}
                              style={{ background: "none", border: "none", color: BRAND.red, cursor: "pointer", fontSize: 14, padding: "0 2px" }}>×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button onClick={handleBugSubmit}
                    disabled={!bugForm.title || !bugForm.category || !bugForm.severity}
                    style={{
                      width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
                      background: (bugForm.title && bugForm.category && bugForm.severity) ? BRAND.red : BRAND.border,
                      color: BRAND.white, fontWeight: 700, fontSize: 15, fontFamily: FONT,
                      transition: "all 0.2s",
                      opacity: (bugForm.title && bugForm.category && bugForm.severity) ? 1 : 0.5,
                    }}>
                    🐛  Submit Bug Report
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ──── FEATURE REQUEST VIEW ──── */}
          {view === "feature" && (
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
              {submitted === "feature" ? (
                <div style={{
                  background: BRAND.card, borderRadius: 16, padding: "48px 32px",
                  border: `1px solid rgba(244,210,37,0.2)`, textAlign: "center",
                }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px",
                    background: BRAND.yellowDim, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <SparkleIcon size={28} color={BRAND.yellow} />
                  </div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8, color: BRAND.yellow }}>Feature Request Submitted</h2>
                  <p style={{ fontSize: 14, color: BRAND.gray, marginBottom: 24 }}>
                    Your request has been logged. We prioritize features based on beta tester feedback and regulatory impact.
                  </p>
                  <button onClick={() => { setSubmitted(null); switchView("tracker"); }}
                    style={{
                      padding: "10px 24px", borderRadius: 10, border: `1px solid ${BRAND.border}`,
                      background: BRAND.card, color: BRAND.yellow, fontWeight: 600, fontSize: 13,
                      fontFamily: FONT, cursor: "pointer",
                    }}>
                    View in Tracker →
                  </button>
                </div>
              ) : (
                <div style={{
                  background: BRAND.card, borderRadius: 16, padding: "32px",
                  border: `1px solid ${BRAND.border}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, background: BRAND.yellowDim,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <SparkleIcon size={20} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: 20, fontWeight: 800 }}>Request a Feature</h2>
                      <p style={{ fontSize: 13, color: BRAND.darkGray }}>What would make AdaptAero indispensable for your shop?</p>
                    </div>
                  </div>

                  <InputField label="Feature Title" required placeholder="e.g. Bulk AD import from CSV" value={featForm.title} onChange={e => setFeatForm({...featForm, title: e.target.value})} />

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <SelectField label="Module" required options={CATEGORIES} value={featForm.category} onChange={e => setFeatForm({...featForm, category: e.target.value})} placeholder="Select module..." />
                    <SelectField label="Priority" options={["critical", "high", "medium", "low"]} value={featForm.priority} onChange={e => setFeatForm({...featForm, priority: e.target.value})} placeholder="How important?" />
                  </div>

                  <InputField label="Description" required placeholder="Describe the feature in detail. What should it do? How should it work?" rows={4} value={featForm.description} onChange={e => setFeatForm({...featForm, description: e.target.value})} />

                  <InputField label="Use Case" placeholder="How would you use this in your day-to-day operations? What problem does it solve?" rows={3} value={featForm.useCase} onChange={e => setFeatForm({...featForm, useCase: e.target.value})} />

                  <button onClick={handleFeatureSubmit}
                    disabled={!featForm.title || !featForm.category || !featForm.description}
                    style={{
                      width: "100%", padding: "14px", borderRadius: 12, border: "none", cursor: "pointer",
                      background: (featForm.title && featForm.category && featForm.description) ? BRAND.yellow : BRAND.border,
                      color: (featForm.title && featForm.category && featForm.description) ? BRAND.black : BRAND.darkGray,
                      fontWeight: 700, fontSize: 15, fontFamily: FONT,
                      transition: "all 0.2s",
                      opacity: (featForm.title && featForm.category && featForm.description) ? 1 : 0.5,
                    }}>
                    ✦  Submit Feature Request
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ──── TRACKER VIEW ──── */}
          {view === "tracker" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Issue Tracker</h2>
                <div style={{ display: "flex", gap: 8 }}>
                  {Object.entries(STATUS_STYLES).map(([key, val]) => (
                    <Badge key={key} color={val.color} bg={val.bg}>{val.label}</Badge>
                  ))}
                </div>
              </div>

              <div style={{
                background: BRAND.card, borderRadius: 16, overflow: "hidden",
                border: `1px solid ${BRAND.border}`,
              }}>
                {/* Table header */}
                <div style={{
                  display: "grid", gridTemplateColumns: "80px 1fr 140px 90px 100px 80px",
                  padding: "12px 20px", gap: 12,
                  background: BRAND.dark, borderBottom: `1px solid ${BRAND.border}`,
                  fontSize: 11, fontWeight: 700, color: BRAND.darkGray, textTransform: "uppercase",
                  letterSpacing: "0.06em", fontFamily: MONO,
                }}>
                  <span>ID</span>
                  <span>Title</span>
                  <span>Module</span>
                  <span>Severity</span>
                  <span>Status</span>
                  <span>Date</span>
                </div>

                {/* Table rows */}
                {reports.map((r, i) => {
                  const sev = SEVERITY[r.severity] || SEVERITY.medium;
                  const st = STATUS_STYLES[r.status] || STATUS_STYLES.submitted;
                  return (
                    <div key={i} style={{
                      display: "grid", gridTemplateColumns: "80px 1fr 140px 90px 100px 80px",
                      padding: "14px 20px", gap: 12, alignItems: "center",
                      borderBottom: `1px solid rgba(255,255,255,0.03)`,
                      transition: "background 0.15s", cursor: "pointer",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = BRAND.cardHover}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontFamily: MONO, fontSize: 12, color: r.id.startsWith("FR") ? BRAND.yellow : BRAND.cyan }}>{r.id}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: BRAND.lightGray }}>{r.title}</div>
                        <div style={{ fontSize: 11, color: BRAND.darkGray, marginTop: 2 }}>by {r.author}</div>
                      </div>
                      <span style={{ fontSize: 12, color: BRAND.gray }}>{r.category}</span>
                      <Badge color={sev.color} bg={sev.bg}>{sev.label}</Badge>
                      <Badge color={st.color} bg={st.bg}>{st.label}</Badge>
                      <span style={{ fontSize: 12, color: BRAND.darkGray }}>{r.date}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: BRAND.darkGray }}>
                Showing {reports.length} reports · Updated in real-time
              </div>
            </div>
          )}

        </main>

        {/* ═══ FOOTER ═══ */}
        <footer style={{
          padding: "24px 0 32px", borderTop: `1px solid ${BRAND.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: BRAND.darkGray }}>
              <span style={{ fontStyle: "italic", color: BRAND.yellow }}>Adapt</span>
              <span style={{ color: BRAND.gray }}>ensor</span>
              <span style={{ color: BRAND.darkGray }}>, Inc.</span>
            </span>
            <span style={{ color: BRAND.border }}>·</span>
            <span style={{ fontSize: 12, color: BRAND.darkGray, fontFamily: MONO }}>v0.9.2-beta</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["aviation.adaptensor.io", "adaptbooks.io", "vault.adaptensor.io"].map((link, i) => (
              <span key={i} style={{ fontSize: 12, color: BRAND.darkGray, fontFamily: MONO }}>{link}</span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
