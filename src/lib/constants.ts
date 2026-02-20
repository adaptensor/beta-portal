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

export type ProductLine = "books" | "aero" | "vault";

export interface ModuleInfo {
  name: string;
  status: ModuleStatus;
  pct: number;
  product: ProductLine;
}

export const PRODUCT_COLORS: Record<ProductLine, string> = {
  books: "text-brand-yellow border-brand-yellow/30",
  aero: "text-brand-cyan border-brand-cyan/30",
  vault: "text-purple-400 border-purple-400/30",
};

export const PRODUCT_BG_COLORS: Record<ProductLine, string> = {
  books: "bg-brand-yellow/10",
  aero: "bg-brand-cyan/10",
  vault: "bg-purple-500/10",
};

export const PRODUCT_BAR_COLORS: Record<ProductLine, string> = {
  books: "#FBBF24",
  aero: "#06B6D4",
  vault: "#A855F7",
};

export const PRODUCT_LABELS: Record<ProductLine, string> = {
  books: "AdaptBooks",
  aero: "AdaptAero",
  vault: "AdaptVault",
};

export const MODULES_STATUS: ModuleInfo[] = [
  // AdaptBooks
  { name: "POS / Register", status: "live", pct: 100, product: "books" },
  { name: "Inventory Management", status: "live", pct: 100, product: "books" },
  { name: "Accounting / General Ledger", status: "live", pct: 100, product: "books" },
  { name: "Accounts Payable / Receivable", status: "live", pct: 100, product: "books" },
  { name: "Financial Reports", status: "live", pct: 100, product: "books" },
  { name: "Customer Management", status: "live", pct: 100, product: "books" },
  { name: "Onboarding Wizard", status: "beta", pct: 70, product: "books" },
  // AdaptAero
  { name: "Aircraft Registry", status: "live", pct: 100, product: "aero" },
  { name: "Work Order Engine", status: "live", pct: 100, product: "aero" },
  { name: "Compliance Engine (AD/SB)", status: "live", pct: 100, product: "aero" },
  { name: "Parts Traceability & 8130-3", status: "live", pct: 100, product: "aero" },
  { name: "FAA Form Generation (337)", status: "live", pct: 100, product: "aero" },
  { name: "Personnel & Calibration", status: "live", pct: 100, product: "aero" },
  { name: "Reporting & Analytics", status: "beta", pct: 90, product: "aero" },
  { name: "AdaptGent Aviation AI", status: "beta", pct: 85, product: "aero" },
  { name: "Customer Portal (Owner)", status: "beta", pct: 80, product: "aero" },
  { name: "Data Migration Wizard", status: "dev", pct: 60, product: "aero" },
  { name: "Offline / PWA Mode", status: "dev", pct: 45, product: "aero" },
  { name: "Laser Operations Module", status: "planned", pct: 0, product: "aero" },
  // AdaptVault
  { name: "Document Vault", status: "beta", pct: 75, product: "vault" },
  { name: "AI Analysis", status: "dev", pct: 50, product: "vault" },
  { name: "Auto-Trigger Release", status: "dev", pct: 40, product: "vault" },
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
