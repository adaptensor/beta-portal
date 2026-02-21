# BETA PORTAL ADDENDUM — Multi-Product Rebrand + Remove Developer References

Read the codebase first: ls src/app, ls src/lib, ls src/components, ls src/app/(portal)/portal

## CRITICAL RULES (SAME AS BEFORE)
- git push origin main only. Never vercel deploy.
- pnpm run build must pass zero errors.
- Same Neon DB. Only touch beta_ tables.

---

## ISSUE 1: Remove ALL "Session Prompts" and Developer/Code References

Beta testers are A&P mechanics, shop owners, and aircraft operators. They are NOT writing code. Remove every reference to Claude Code, session prompts, development phases, and anything that implies testers are building software.

### Changes Required:

**1. Delete the Session Prompts pages entirely:**
- Delete `src/app/(portal)/portal/prompts/page.tsx`
- Delete `src/app/(portal)/portal/prompts/[id]/page.tsx`
- Delete `src/app/api/beta/prompts/route.ts`
- Delete `src/app/api/beta/prompts/[id]/route.ts`

**2. Remove "Session Prompts" from the sidebar navigation:**
- In `src/components/PortalSidebar.tsx` (or wherever the sidebar nav links are defined), remove the "Session Prompts" link entirely from the nav array.

**3. Update the portal Dashboard page:**
- In `src/app/(portal)/portal/page.tsx`, remove any "Session Prompts" card, link, or mention.

**4. Remove from admin panel (if built yet):**
- If admin prompt management pages exist under `src/app/(admin)/admin/prompts/`, delete them.
- If admin API routes exist at `src/app/api/admin/prompts/`, delete them.
- Remove "Session Prompts" or "Manage Prompts" from any admin sidebar navigation.

**5. Update the landing page (src/app/page.tsx):**
- Remove any mention of "Claude Code", "session prompts", "development phases", "developers", "build prompts", or "extend the build".
- The "How It Works" section should say: Register → Get Approved → Test & Report → We Ship — with NO mention of code, prompts, or development tools.

**6. Update the status page (src/app/status/page.tsx):**
- Remove any developer-oriented sections or prompt references.

**7. Search the ENTIRE codebase for stray references:**
```bash
grep -ri "session prompt" src/ --include="*.tsx" --include="*.ts" -l
grep -ri "claude code" src/ --include="*.tsx" --include="*.ts" -l
grep -ri "prompts" src/ --include="*.tsx" --include="*.ts" -l
grep -ri "developer" src/ --include="*.tsx" --include="*.ts" -l
```
Remove or reword every hit. The word "developer" should only appear in the context of "our development team" when describing who fixes bugs — never implying the tester is a developer.

---

## ISSUE 2: Rebrand Landing Page for Multi-Product Beta

The landing page currently only talks about AdaptAero (Aviation MRO). We are beta testing THREE products. The landing page needs to reflect the full Adaptensor platform.

### Rewrite the Landing Page (src/app/page.tsx):

**NAV BAR:**
- Logo: "Adaptensor" (not "AdaptAero") — "Adapt" in italic yellow, "ensor" in white/gray
- Badge: BETA (keep cyan)
- Nav links: Products, Why Join, Status, Join Beta

**HERO SECTION:**
- Headline: "The Business Platform That Does Everything" or "One Platform. Every Module. Zero Compromise."
- Subtitle: "AdaptBooks for accounting and POS. AdaptAero for FAA-compliant aviation MRO. AdaptVault for secure document management. All integrated. All affordable. Help us test it."
- Keep the "Join the Beta" yellow CTA + "View Platform Status" secondary button
- Keep the three reassurances: No credit card, Full platform access, Pre-loaded demo data

**THE PROBLEM SECTION (rewrite the 3 cards):**
Card 1: "$500–$5K/month — Legacy software charges thousands and still needs QuickBooks on the side. Every competitor requires separate accounting."
Card 2: "Paper & Spreadsheets — The majority of small businesses and aviation shops still run on paper, spreadsheets, and disconnected tools. Compliance risk and lost revenue."
Card 3: "2x Double Entry — Your team enters data in the operations system, then again in accounting software. Every day. On every transaction. That stops here."

**NEW SECTION: "Three Products, One Platform" (replace or add after The Problem)**
Three product cards side by side:

Card 1 — AdaptBooks (Yellow accent):
- Icon: cash register or ledger icon
- "AdaptBooks — POS + Full Accounting"
- "Point of sale, inventory, double-entry general ledger, AP/AR, financial reporting, work orders. The business backbone."
- URL: books.adaptensor.io

Card 2 — AdaptAero (Cyan accent):
- Icon: plane icon
- "AdaptAero — Aviation MRO"
- "Aircraft registry, work orders, AD/SB compliance, parts traceability, 8130-3 tags, FAA form generation, inspection scheduling. Built for A&P mechanics and Part 145 shops."
- URL: aviation.adaptensor.io

Card 3 — AdaptVault (Purple accent #A855F7):
- Icon: shield/lock icon
- "AdaptVault — Secure Document Vault"
- "Encrypted document storage, AI-powered analysis, full-text search, retention compliance, auto-trigger release. Your permanent records, protected."
- URL: vault.adaptensor.io

**MODULE GRID SECTION (update):**
- Keep the grid but group by product with product headers
- Add AdaptBooks modules: POS/Register (LIVE), Inventory (LIVE), Accounting/GL (LIVE), AP/AR (LIVE), Financial Reports (LIVE), Customer Management (LIVE), Onboarding Wizard (BETA 70%)
- Add AdaptVault modules: Document Vault (BETA 75%), AI Analysis (DEV 50%), Auto-Trigger Release (DEV 40%)
- Use product-specific colors: Aero modules get cyan accents, Books get yellow, Vault get purple

**PLATFORM STATS (update):**
- 145+ Data Models
- 309 API Endpoints  
- 57 Pages
- 3 Products
- $99/mo Starting Price
(Remove anything that sounds like developer metrics if it feels too technical — keep it impressive but business-oriented)

**WHY JOIN (keep as-is, works for multi-product)**

**HOW IT WORKS (rewrite Step 3):**
- Step 1: Register (same)
- Step 2: Get Approved (same)
- Step 3: "Test & Report" — "Use all three products. Explore the demo data. Find bugs, request features, upload screenshots. Every report gets reviewed by our team."
- Step 4: "We Ship Together" (same, but remove any code/development language)

**BOTTOM CTA (rewrite):**
- "Stop duct-taping your business together with five different apps."
- "One platform for operations, accounting, compliance, and documents. Join the beta."
- Yellow CTA button: "Apply for Beta Access"
- Social proof: "23 beta testers across 6 businesses are already testing. Join them."

**FOOTER:**
- "Adaptensor, Inc." (not AdaptAero)
- Links: aviation.adaptensor.io, books.adaptensor.io, vault.adaptensor.io, beta.adaptensor.io

---

## ISSUE 3: Update Registration Page

In src/app/register/page.tsx:

**1. Update the page title/header:**
- "Join the Adaptensor Beta Program" (not AdaptAero)
- Subtitle: "Get early access to AdaptBooks, AdaptAero, and AdaptVault."

**2. Add a new field after "Current MRO Software":**
Label: "Which products are you most interested in testing?"
Type: Checkboxes (multi-select)
Options:
- AdaptBooks (POS + Accounting)
- AdaptAero (Aviation MRO)
- AdaptVault (Document Vault)
- All of the above

This is informational only (helps Jamie prioritize). Store as comma-separated string in a new optional field. If the Prisma schema doesn't have this field yet, add it:

```sql
ALTER TABLE beta_testers ADD COLUMN IF NOT EXISTS interested_products TEXT;
```

Then update the Prisma schema to match:
```prisma
interestedProducts String? @map("interested_products")
```

Run `npx prisma db push` after the schema change.

**3. Update the registration API** (src/app/api/beta/register/route.ts):
- Accept the new `interestedProducts` field
- Save it to the database

---

## ISSUE 4: Update Status Page

In src/app/status/page.tsx:
- Title: "Adaptensor Platform Status" (not AdaptAero)
- Group modules by product with colored section headers
- Remove any developer/prompt references

---

## Build & Deploy

After ALL changes:

```bash
# Search for any remaining bad references
grep -ri "session prompt" src/ --include="*.tsx" --include="*.ts"
grep -ri "claude code" src/ --include="*.tsx" --include="*.ts"
# Should return ZERO results

pnpm run build  # Must pass zero errors

git add .
git commit -m "feat: multi-product rebrand + remove developer references + expand categories"
git push origin main
```

## Checklist Before Done

- [ ] "Session Prompts" completely removed from sidebar, pages, API routes, admin
- [ ] Zero grep results for "session prompt", "claude code", "prompts" in user-facing code
- [ ] Landing page hero says "Adaptensor" not "AdaptAero"
- [ ] Three product cards (Books/Aero/Vault) on landing page
- [ ] Module grid grouped by product with correct colors
- [ ] Registration form has "interested products" checkboxes
- [ ] Status page titled "Adaptensor Platform Status"
- [ ] Footer says "Adaptensor, Inc." everywhere
- [ ] pnpm run build — zero errors
- [ ] All pages render correctly after changes
