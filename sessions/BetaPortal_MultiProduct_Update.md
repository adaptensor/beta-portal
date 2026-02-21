# Quick Update: Expand Beta Portal Categories for Multi-Product Coverage

## Context
The beta portal at beta.adaptensor.io currently has categories for AdaptAero aviation modules only. We need to expand it to cover AdaptBooks (POS + Accounting) and AdaptVault (document vault) as well, since beta testers will be testing all three products.

## What to Change

### 1. Update src/lib/constants.ts

Replace the existing CATEGORIES array with a grouped structure:

```typescript
export const CATEGORIES = [
  // AdaptAero — Aviation MRO
  "Aero: Aircraft Registry",
  "Aero: Work Orders",
  "Aero: Compliance Engine",
  "Aero: Parts Traceability",
  "Aero: FAA Forms",
  "Aero: Personnel & Calibration",
  "Aero: Reporting",
  "Aero: AdaptGent AI",
  "Aero: Customer Portal",
  "Aero: Migration Wizard",
  // AdaptBooks — POS + Accounting
  "Books: Point of Sale",
  "Books: Inventory Management",
  "Books: Accounting / GL",
  "Books: Accounts Receivable",
  "Books: Accounts Payable",
  "Books: Financial Reports",
  "Books: Customer Management",
  "Books: Work Orders (Base)",
  // AdaptVault — Document Storage
  "Vault: Document Upload",
  "Vault: AI Analysis",
  "Vault: Search & Retrieval",
  "Vault: Retention Policies",
  "Vault: Access Controls",
  // Cross-Platform
  "Platform: Authentication / SSO",
  "Platform: Dashboard",
  "Platform: Mobile / PWA",
  "Platform: Performance",
  "Platform: Onboarding",
  "Platform: Other",
];

// Product labels for display
export const PRODUCTS = {
  "Aero": { label: "AdaptAero", color: "#06B6D4", url: "aviation.adaptensor.io" },
  "Books": { label: "AdaptBooks", color: "#F4D225", url: "books.adaptensor.io" },
  "Vault": { label: "AdaptVault", color: "#A855F7", url: "vault.adaptensor.io" },
  "Platform": { label: "Cross-Platform", color: "#888888", url: "adaptensor.io" },
};
```

### 2. Update the Module Status in constants.ts

Add AdaptBooks and AdaptVault modules to MODULES_STATUS:

```typescript
export const MODULES_STATUS = [
  // AdaptAero
  { name: "Aircraft Registry", product: "Aero", status: "live", pct: 100 },
  { name: "Work Order Engine", product: "Aero", status: "live", pct: 100 },
  { name: "Compliance Engine (AD/SB)", product: "Aero", status: "live", pct: 100 },
  { name: "Parts Traceability & 8130-3", product: "Aero", status: "live", pct: 100 },
  { name: "FAA Form Generation (337)", product: "Aero", status: "live", pct: 100 },
  { name: "Personnel & Calibration", product: "Aero", status: "live", pct: 100 },
  { name: "Reporting & Analytics", product: "Aero", status: "beta", pct: 90 },
  { name: "AdaptGent Aviation AI", product: "Aero", status: "beta", pct: 85 },
  { name: "Customer Portal (Owner)", product: "Aero", status: "beta", pct: 80 },
  { name: "Data Migration Wizard", product: "Aero", status: "dev", pct: 60 },
  // AdaptBooks
  { name: "Point of Sale / Register", product: "Books", status: "live", pct: 100 },
  { name: "Inventory Management", product: "Books", status: "live", pct: 100 },
  { name: "General Ledger / Accounting", product: "Books", status: "live", pct: 100 },
  { name: "AP / AR / Statements", product: "Books", status: "live", pct: 100 },
  { name: "Financial Reporting", product: "Books", status: "live", pct: 100 },
  { name: "Customer Management", product: "Books", status: "live", pct: 100 },
  { name: "Onboarding Wizard", product: "Books", status: "beta", pct: 70 },
  // AdaptVault
  { name: "Document Vault", product: "Vault", status: "beta", pct: 75 },
  { name: "AI Document Analysis", product: "Vault", status: "dev", pct: 50 },
  { name: "Auto-Trigger Release", product: "Vault", status: "dev", pct: 40 },
];
```

### 3. Update Landing Page, Status Page, and Tracker

In the landing page (app/page.tsx), status page (app/status/page.tsx), and tracker page:
- Group modules by product with product headers
- Use product-specific colors (Aero=cyan, Books=yellow, Vault=purple)
- Add product filter tabs to the tracker page

### 4. Update Registration Form

In app/register/page.tsx, add a question:
"Which products are you most interested in testing?" with checkboxes:
- [ ] AdaptAero (Aviation MRO)
- [ ] AdaptBooks (POS + Accounting)
- [ ] AdaptVault (Document Vault)
- [ ] All of the above

This maps to a new field `interestedProducts` on BetaTester (add to Prisma schema as optional String).

### 5. Build & Deploy

pnpm run build — zero errors
git add .
git commit -m "feat: expand categories for multi-product beta (Aero + Books + Vault)"
git push origin main
