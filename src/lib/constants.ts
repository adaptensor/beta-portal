export const CATEGORIES = [
  "Aircraft Registry",
  "Work Orders",
  "Compliance Engine",
  "Parts Traceability",
  "FAA Forms",
  "Personnel",
  "Reporting",
  "Dashboard",
  "POS / Counter",
  "Accounting / GL",
  "AdaptGent AI",
  "Onboarding",
  "Mobile / PWA",
  "Performance",
  "Authentication",
  "Other",
] as const;

export const SEVERITIES = {
  critical: { label: "Critical", color: "red" },
  high: { label: "High", color: "orange" },
  medium: { label: "Medium", color: "yellow" },
  low: { label: "Low", color: "cyan" },
} as const;

export const BUG_STATUSES = [
  "submitted",
  "confirmed",
  "investigating",
  "in-progress",
  "fixed",
  "wont-fix",
  "duplicate",
  "closed",
] as const;

export const FEATURE_STATUSES = [
  "submitted",
  "under-review",
  "planned",
  "in-progress",
  "shipped",
  "declined",
] as const;

export const TESTER_ROLES = [
  "A&P Mechanic",
  "IA Inspector",
  "Shop Owner / Manager",
  "Avionics Technician",
  "Parts Manager",
  "Service Writer",
  "Aircraft Owner / Operator",
  "FBO Manager",
  "Other",
] as const;

export const CURRENT_SOFTWARE_OPTIONS = [
  "None (paper/spreadsheets)",
  "Corridor / ATP",
  "CAMP Systems",
  "Quantum MX",
  "AvSight",
  "Traxxall",
  "Ramco",
  "Custom / In-house",
  "Other",
] as const;

export type ModuleStatus = "live" | "beta" | "dev" | "planned";

export interface ModuleInfo {
  name: string;
  status: ModuleStatus;
  pct: number;
}

export const MODULES_STATUS: ModuleInfo[] = [
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

export const STATUS_COLORS: Record<ModuleStatus, string> = {
  live: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  beta: "bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30",
  dev: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  planned: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

export const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  low: "bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30",
};

export const BUG_STATUS_COLORS: Record<string, string> = {
  submitted: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  investigating: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "in-progress": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  fixed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "wont-fix": "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  duplicate: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  closed: "bg-zinc-600/20 text-zinc-500 border-zinc-600/30",
};

export const FEATURE_STATUS_COLORS: Record<string, string> = {
  submitted: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
  "under-review": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  planned: "bg-brand-yellow/20 text-brand-yellow border-brand-yellow/30",
  "in-progress": "bg-orange-500/20 text-orange-400 border-orange-500/30",
  shipped: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  declined: "bg-red-500/20 text-red-400 border-red-500/30",
};
