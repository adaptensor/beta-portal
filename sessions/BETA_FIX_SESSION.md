# BETA-FIX — Fix beta.adaptensor.io 500 Errors (Safe Database Recovery)

## CRITICAL SAFETY RULE — READ THIS FIRST
**DO NOT run `prisma db push` against this database.** The beta portal shares a Neon PostgreSQL instance with AdaptBooks (251 models, production data). `prisma db push` can DROP and RECREATE tables if the schema has drifted. That may be exactly what caused this problem in the first place. We use `prisma migrate` exclusively — it only runs forward migrations and NEVER drops existing tables or data.

---

## Context
The admin dashboard at `beta.adaptensor.io` is broken. The browser console shows:
- 4 API endpoints returning **500 Internal Server Error**:
  - `GET /api/admin/analytics`
  - `GET /api/admin/testers?status=pending`
  - `GET /api/beta/features?limit=5`
  - `GET /api/beta/bugs?severity=critical&status=submitted&limit=5`
- A **Clerk deprecation warning** for `afterSignInUrl`
- A **render loop** (`ol/or` stack trace) caused by cascading 500 errors feeding undefined data into React state

**Root Cause (Suspected):** The 9 `beta_*` database tables (defined in `prisma/schema.prisma` with `@@map`) either were never created on the production Neon instance, or were previously created and then accidentally dropped by a destructive `prisma db push` command. The API handlers try to query these tables, get a "table does not exist" error from Postgres, and return 500.

**Project Location:** `c:\Adaptensor\beta\`
**Database:** Neon PostgreSQL (shared with AdaptBooks — DO NOT TOUCH AdaptBooks tables)
**Auth:** Clerk
**Hosting:** Vercel
**Framework:** Next.js 14 App Router

---

## Phase 0 — RECONNAISSANCE (Do This First, Change Nothing)

Before touching anything, we need to know the exact state of the database. Run these commands and PRINT the results. Do not modify anything yet.

### Step 0.1 — Check what tables currently exist in the database
```bash
npx prisma db execute --stdin <<'SQL'
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
SQL
```
**Print the full output.** We need to see:
- Whether ANY `beta_*` tables exist
- What AdaptBooks tables are present (so we know what NOT to touch)

### Step 0.2 — Check the Prisma schema for all beta_* models
```bash
grep -n "@@map" prisma/schema.prisma
```
This shows us every model that maps to a `beta_*` table name. Print the output.

### Step 0.3 — Check if a migrations folder exists
```bash
ls -la prisma/migrations/ 2>/dev/null || echo "NO MIGRATIONS FOLDER EXISTS"
```
If no migrations folder exists, we need to create the initial migration. If migrations exist, we need to check their status.

### Step 0.4 — Check migration status (if migrations folder exists)
```bash
npx prisma migrate status
```
Print the output. This tells us if there are pending migrations, failed migrations, or a drift between the schema and the database.

### Step 0.5 — Check the actual schema of any existing beta tables
If any `beta_*` tables exist from Step 0.1, run:
```bash
npx prisma db execute --stdin <<'SQL'
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name LIKE 'beta_%'
ORDER BY table_name, ordinal_position;
SQL
```
This tells us if the tables exist but have a different schema than what Prisma expects.

### Step 0.6 — Print the Prisma schema models
```bash
grep -A 20 "^model Beta\|^model beta" prisma/schema.prisma
```
Or if models aren't prefixed with Beta:
```bash
grep -B 2 "@@map.*beta_" prisma/schema.prisma | head -20
```
We need to see the model names and their `@@map` table names.

**STOP HERE.** Print all results from Steps 0.1-0.6. Summarize what you found:
- Do the beta_* tables exist? (Yes/No, list which ones)
- Are there existing Prisma migrations? (Yes/No)
- Is there schema drift? (Yes/No)
- What AdaptBooks tables are present? (Just count them — do NOT list them all)

Wait for confirmation before proceeding to Phase 1.

---

## Phase 1 — Create or Apply Database Migration (SAFE)

Based on what we found in Phase 0, follow ONE of these paths:

### Path A — No beta_* tables exist AND no migrations folder
The tables were never created (or were dropped). We need to create them safely.

```bash
# 1. Create the initial migration WITHOUT applying it
npx prisma migrate dev --name init_beta_tables --create-only

# 2. INSPECT the generated migration SQL before applying
cat prisma/migrations/*_init_beta_tables/migration.sql

# 3. Verify the SQL ONLY creates beta_* tables
#    It should contain CREATE TABLE statements for beta_* tables ONLY
#    If it contains ANY DROP TABLE, ALTER TABLE on non-beta tables, 
#    or references AdaptBooks tables — STOP AND REPORT

# 4. If the SQL looks safe (only CREATE TABLE beta_*), apply it
npx prisma migrate deploy
```

### Path B — No beta_* tables exist BUT migrations folder exists
Migrations were created but never deployed to production.

```bash
# 1. Check migration status
npx prisma migrate status

# 2. If there are pending migrations, inspect them first
ls prisma/migrations/
cat prisma/migrations/*/migration.sql

# 3. Verify they only touch beta_* tables, then apply
npx prisma migrate deploy
```

### Path C — Some beta_* tables exist but schema is different
Tables exist but the columns don't match the Prisma schema (drift).

```bash
# 1. Create a new migration to reconcile
npx prisma migrate dev --name fix_beta_schema --create-only

# 2. INSPECT the SQL — it should only ALTER beta_* tables
cat prisma/migrations/*_fix_beta_schema/migration.sql

# 3. If safe, apply
npx prisma migrate deploy
```

### Path D — All beta_* tables exist with correct schema
The database is fine. The 500 errors have a different cause. Skip to Phase 3 and investigate the API route handlers directly.

**After migration completes, verify:**
```bash
npx prisma db execute --stdin <<'SQL'
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'beta_%'
ORDER BY table_name;
SQL
```
All 9 beta_* tables should now appear.

**Generate the Prisma client:**
```bash
npx prisma generate
```

---

## Phase 2 — Fix Clerk Deprecation Warning

### Step 2.1 — Update .env.local
**File:** `c:\Adaptensor\beta\.env.local`

Find and replace these environment variables:

**OLD (deprecated):**
```
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/portal
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/register
```

**NEW (current):**
```
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/portal
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/register
```

We use `FALLBACK` (not `FORCE`) so existing redirect behavior is preserved — it only kicks in when no `redirect_url` query parameter is present.

### Step 2.2 — Check for hardcoded references
Search the entire codebase for any hardcoded uses of the deprecated prop:
```bash
grep -rn "afterSignInUrl\|afterSignUpUrl\|AFTER_SIGN_IN\|AFTER_SIGN_UP" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx"
```
If any component passes `afterSignInUrl` as a prop to a Clerk component (like `<SignIn>` or `<ClerkProvider>`), rename it to `fallbackRedirectUrl`.

### Step 2.3 — Update Vercel Environment Variables
**In the Vercel dashboard for the beta project:**
1. Remove: `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
2. Remove: `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
3. Add: `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` = `/portal`
4. Add: `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` = `/register`

Verify these are also set:
- `DATABASE_URL` — Neon pooled connection string
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `ADMIN_USER_IDS` = `user_39orNzw4ePkqW1E3ow0c8ZTT3Nk`

Print a reminder for Jamie to update Vercel manually — Claude Code cannot access the Vercel dashboard.

---

## Phase 3 — Harden Admin Dashboard Error Handling

**File:** `c:\Adaptensor\beta\src\app\(admin)\admin\page.tsx`

The admin page makes 4 parallel `fetch()` calls. When the API returns 500 (because tables don't exist), the response body is an error object — not the expected data structure. The code then tries to read `.total` from undefined, causing the `TypeError: Cannot read properties of undefined (reading 'total')` cascade.

### Step 3.1 — Find the useEffect that fetches dashboard data
Look for the `useEffect` or data-fetching function that calls all 4 endpoints:
- `/api/admin/analytics`
- `/api/admin/testers?status=pending`
- `/api/beta/features?limit=5`
- `/api/beta/bugs?severity=critical&status=submitted&limit=5`

### Step 3.2 — Add response validation
Wrap each fetch with proper error handling. The pattern should be:

```typescript
// For each API call, check .ok BEFORE parsing
const analyticsRes = await fetch('/api/admin/analytics');
if (!analyticsRes.ok) {
  console.error(`Analytics API failed: ${analyticsRes.status}`);
  // Set safe defaults instead of error objects
  setAnalytics({ total: 0, active: 0, new: 0 }); // or whatever the shape is
} else {
  const data = await analyticsRes.json();
  setAnalytics(data);
}

const testersRes = await fetch('/api/admin/testers?status=pending');
if (!testersRes.ok) {
  console.error(`Testers API failed: ${testersRes.status}`);
  setPendingTesters([]);
} else {
  const data = await testersRes.json();
  setPendingTesters((data.testers || []).slice(0, 10));
}

const featuresRes = await fetch('/api/beta/features?limit=5');
if (!featuresRes.ok) {
  console.error(`Features API failed: ${featuresRes.status}`);
  setFeatures([]);
} else {
  const data = await featuresRes.json();
  setFeatures(data.features || []);
}

const bugsRes = await fetch('/api/beta/bugs?severity=critical&status=submitted&limit=5');
if (!bugsRes.ok) {
  console.error(`Bugs API failed: ${bugsRes.status}`);
  setBugs([]);
} else {
  const data = await bugsRes.json();
  setBugs(data.bugs || []);
}
```

Adapt the state setter names and data shapes to match what the page actually uses. The key rule: **NEVER call `.json()` on a non-ok response and feed it into state as if it were valid data.**

### Step 3.3 — Add a visible error banner
If any endpoint failed, show a subtle warning at the top of the admin dashboard:
```tsx
{hasErrors && (
  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-4">
    Some dashboard data could not be loaded. Check the browser console for details.
  </div>
)}
```

---

## Phase 4 — Fix Build Script (Prevent Recurrence)

**File:** `c:\Adaptensor\beta\package.json`

### Step 4.1 — Update the build script
**OLD:**
```json
"build": "next build"
```

**NEW:**
```json
"build": "prisma generate && prisma migrate deploy && next build"
```

**Why this order:**
1. `prisma generate` — creates the TypeScript client from the schema
2. `prisma migrate deploy` — applies any pending migrations to the production database (safe, forward-only, never drops tables)
3. `next build` — builds the Next.js app with the up-to-date Prisma client

**NOTE:** `prisma migrate deploy` is production-safe. It:
- Only runs migrations that haven't been applied yet
- Never creates new migrations
- Never drops tables
- Never resets the database
- Exits cleanly if there are no pending migrations

---

## Phase 5 — Seed Data (If Needed)

Only run this if the tables were freshly created (Path A or B in Phase 1):

```bash
pnpm run seed
```

If the seed script doesn't exist or fails, check:
```bash
cat prisma/seed.ts 2>/dev/null || cat prisma/seed.js 2>/dev/null || echo "No seed file found"
```

If no seed file exists, that's fine — the dashboard will just show empty data, which is correct.

---

## Phase 6 — Verify Everything Works

### Step 6.1 — Local build test
```bash
pnpm run build
```
Must complete with 0 errors.

### Step 6.2 — Test the API endpoints locally (if possible)
```bash
pnpm run dev
# In another terminal:
curl -s http://localhost:3000/api/admin/analytics | head -20
curl -s http://localhost:3000/api/beta/features?limit=5 | head -20
curl -s http://localhost:3000/api/beta/bugs?severity=critical&status=submitted&limit=5 | head -20
curl -s http://localhost:3000/api/admin/testers?status=pending | head -20
```

Each should return JSON, not a 500 error.

### Step 6.3 — Check for any remaining issues
```bash
# Search for any other deprecated Clerk patterns
grep -rn "afterSignInUrl\|afterSignUpUrl" src/ --include="*.ts" --include="*.tsx"

# Verify the Prisma client is generated correctly
ls node_modules/.prisma/client/index.js && echo "Prisma client exists" || echo "MISSING"
```

---

## Phase 7 — Commit and Deploy

```bash
git add -A
git commit -m "fix: resolve beta dashboard 500 errors and Clerk deprecation

- Create/apply database migration for beta_* tables (safe, forward-only)
- Rename deprecated Clerk env vars to FALLBACK_REDIRECT variants
- Add response validation in admin dashboard to prevent cascade failures
- Update build script: prisma generate + migrate deploy before next build
- Add error banner for partial data load failures"
```

**DO NOT push yet.** Print a summary of:
1. Which migration path was followed (A/B/C/D)
2. How many beta_* tables were created/verified
3. What Clerk env vars were changed
4. What files were modified
5. Any warnings or concerns

Wait for Jamie to review and push.

---

## Rules
- **NEVER** run `prisma db push` — use `prisma migrate` exclusively
- **NEVER** run `prisma migrate reset` — this drops ALL tables
- **NEVER** modify or delete any non-beta table
- **ALWAYS** inspect generated migration SQL before applying
- **ALWAYS** print results and wait for confirmation after Phase 0
- Commit after all phases complete, not during
- `pnpm -r run build` OR `pnpm run build` must pass with 0 errors
- DO NOT push — print summary and wait
