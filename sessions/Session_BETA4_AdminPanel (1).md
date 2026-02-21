# SESSION BETA-4: Admin Panel + AdaptBooks Fix + Seed Data

You are finishing the beta.adaptensor.io build. Sessions BETA-1, 2, 3 are complete. An addendum was also applied that rebranded to multi-product (Adaptensor, not AdaptAero), removed all Session Prompts pages/routes/references, and added the `interested_products` field to registration.

Read the codebase first: `ls src/app`, `ls src/app/(portal)`, `ls src/app/api`, `ls src/lib`. Understand what exists.

## CRITICAL RULES
- Deployment: `git push origin main`. NEVER `vercel deploy`.
- Database: Same Neon instance as AdaptBooks. Only touch `beta_*` tables. NEVER run `prisma db push` — it will drop 80+ production tables. Use raw SQL `ALTER TABLE` for any schema changes.
- Auth: Clerk SSO (shared `*.adaptensor.io`).
- Build: `pnpm run build` must pass zero errors before commit.
- Brand: Yellow #F4D225, Cyan #06B6D4, Purple #A855F7, Black #060505, Dark #0A0A0A, Card #111111.
- Session Prompts have been REMOVED. Do not create any prompt-related pages, routes, or references.

## STEP 1: Admin Layout

Create `src/app/(admin)/layout.tsx`:
- Clerk auth check — redirect to /sign-in if not signed in
- Check if userId is in `ADMIN_USER_IDS` env var (use the isAdmin helper from `src/lib/auth.ts`)
- If not admin: redirect to /portal with "Access denied" toast or message
- Admin layout structure:
  - Fixed left sidebar (250px, dark #0A0A0A), same style as portal sidebar
  - Logo: "Adaptensor" with "Admin" badge
  - Nav links: Dashboard, Manage Testers, Manage Issues, Announcements
  - NO "Session Prompts" or "Manage Prompts" link — these were removed
  - Bottom: User avatar + name from Clerk, "Back to Portal" link, Sign Out
- Main content area with padding
- Mobile: sidebar becomes hamburger menu (same pattern as portal layout)

## STEP 2: Admin Dashboard

Create `src/app/(admin)/admin/page.tsx`:

Summary stats cards (query real data from beta_ tables):
- Total Testers: show breakdown (pending / approved / active / suspended)
- Total Bug Reports: show breakdown (open / fixed / closed)
- Total Feature Requests: show breakdown (submitted / planned / shipped)
- New This Week: count of testers + bugs + features created in last 7 days

Recent Pending Registrations section:
- Show last 10 testers with status "pending"
- Each row: Name, Email, Company, Role, Interested Products, Registered Date
- Inline "Approve" button (green) and "Reject" button (red) on each row
- Approve button calls PATCH /api/admin/testers/[id] with status: "approved"
- Reject button calls PATCH /api/admin/testers/[id] with status: "suspended"
- Refresh list after action

Issues Needing Attention section:
- Show bugs with severity "critical" or "high" that have status "submitted" (unreviewed)
- Show feature requests with highest vote counts that are still "submitted"
- Each row: ID (BUG-XXX or FR-XXX), Title, Severity/Priority badge, Author, Date
- Click to navigate to the admin issue management page

Quick links row: "Manage All Testers" button, "Manage All Issues" button, "Create Announcement" button

## STEP 3: Tester Management

Create `src/app/(admin)/admin/testers/page.tsx`:

Full table of all beta testers with these columns:
- Name
- Email
- Company
- Role
- Interested Products (from the new field)
- Status (colored badge: pending=orange, approved=green, active=cyan, suspended=red)
- Registered Date
- Last Active (if any)
- Bug Count (count of related BetaBugReport records)
- Feature Count (count of related BetaFeatureRequest records)

Filter tabs above table: All | Pending | Approved | Active | Suspended
Search box: filter by name, email, or company (client-side filter is fine for beta scale)

Inline actions per row:
- If pending: "Approve" button, "Reject" button
- If approved/active: "Suspend" button
- If suspended: "Reactivate" button (sets status back to approved)
- "Delete" button with confirmation modal on all rows

Expandable row detail (click row to expand):
- Full profile: all fields including aircraftTypes, currentSoftware, interestedProducts
- Admin Notes field: textarea that saves via PATCH on blur or button click
- Registration date, approval date, last active date

Create admin API routes:

`src/app/api/admin/testers/route.ts`:
- GET: Return all testers with _count of bugs and features. Accept `status` query param for filtering. Order by registeredAt desc.

`src/app/api/admin/testers/[id]/route.ts`:
- PATCH: Update tester. Accept `status`, `notes` fields. When changing status to "approved", set `approvedAt` to now.
- DELETE: Delete tester and all related records (bugs, features, comments, votes, attachments). Use a transaction.

Optional: When approving a tester, if `SENDGRID_API_KEY` is set, send an approval notification email:
- From: beta@adaptensor.io (or whatever sender is verified in SendGrid)
- To: tester's email
- Subject: "Your Adaptensor Beta Access Has Been Approved"
- Body: Welcome message with link to beta.adaptensor.io/portal
- If SendGrid fails, still approve the tester (email is nice-to-have, not blocking)

## STEP 4: Issue Management

Create `src/app/(admin)/admin/issues/page.tsx`:

Combined bug + feature list (similar to the portal tracker but with admin edit capabilities).

Filter controls:
- Tab toggle: All | Bugs | Features
- Status filter (multi-select)
- Severity filter
- Category filter
- Sort: Newest | Oldest | Most Voted | Severity (Critical first)
- Search by title

Table columns:
- Checkbox (for bulk actions)
- ID (BUG-XXX / FR-XXX, linked to detail)
- Title
- Author
- Category
- Severity/Priority badge
- Status badge — THIS IS AN INLINE DROPDOWN for admins
- Assigned To — inline text input for admins
- Date

Inline admin actions per row:
- Status dropdown: click the status badge to change it. For bugs: all BUG_STATUSES. For features: all FEATURE_STATUSES. On change, call PATCH API.
- Assign To: editable text field. On blur, call PATCH API.

Expanded row detail (click row):
- Full report content (steps to reproduce, expected/actual, etc.)
- Screenshots/attachments displayed
- For bugs: Resolution text field (textarea), Fixed In Version field (text input)
- For features: Admin Response field (textarea), Target Version field (text input)
- Save button for the detail fields
- Comment thread (read-only here, or link to the portal detail page)

Bulk actions bar (appears when checkboxes selected):
- "Change Status" dropdown — apply to all selected
- "Delete Selected" with confirmation

Create admin API routes:

`src/app/api/admin/bugs/[id]/route.ts`:
- PATCH: Update bug fields. Accept: status, assignedTo, resolution, fixedInVersion. When status changes to "fixed", set resolvedAt to now.

`src/app/api/admin/features/[id]/route.ts`:
- PATCH: Update feature fields. Accept: status, targetVersion, adminResponse.

## STEP 5: Announcement Management

Create `src/app/(admin)/admin/announcements/page.tsx`:

List all announcements with:
- Title, Type badge (update=cyan, release=green, breaking=red, maintenance=orange), Version tag, Pinned status, Published Date
- "Create New" button at top
- Each row: Edit button, Pin/Unpin toggle, Delete button with confirmation

Create/Edit form (can be modal or inline):
- Title (required)
- Type dropdown: update, release, breaking, maintenance
- Version (optional, e.g., "v0.9.3")
- Content (required, textarea — supports plain text, rendered as-is on the announcements page)
- Is Pinned toggle
- Published Date (defaults to now)

Create admin API routes:

`src/app/api/admin/announcements/route.ts`:
- POST: Create announcement. Required: title, content, type.

`src/app/api/admin/announcements/[id]/route.ts`:
- PATCH: Update announcement fields.
- DELETE: Delete announcement.

## STEP 6: Analytics API

Create `src/app/api/admin/analytics/route.ts`:
- GET: Returns aggregated stats (used by admin dashboard). Auth required + admin check.

Response shape:
```json
{
  "testers": {
    "total": 23,
    "pending": 5,
    "approved": 12,
    "active": 4,
    "suspended": 2,
    "byRole": { "A&P Mechanic": 8, "Shop Owner / Manager": 5, ... },
    "byCurrentSoftware": { "None (paper/spreadsheets)": 10, "Corridor / ATP": 4, ... },
    "byInterestedProducts": { "AdaptAero": 15, "AdaptBooks": 12, "AdaptVault": 8 }
  },
  "bugs": {
    "total": 42,
    "open": 18,
    "fixed": 20,
    "closed": 4,
    "bySeverity": { "critical": 3, "high": 8, "medium": 15, "low": 16 },
    "byCategory": { "Aero: Work Orders": 6, "Books: Accounting / GL": 4, ... },
    "avgResolutionDays": 3.2
  },
  "features": {
    "total": 15,
    "byStatus": { "submitted": 8, "planned": 4, "shipped": 2, "declined": 1 },
    "topVoted": [{ "id": "...", "title": "...", "voteCount": 12 }, ...]
  },
  "activity": {
    "lastWeek": {
      "newTesters": 3,
      "newBugs": 7,
      "newFeatures": 2,
      "resolved": 5
    }
  }
}
```

## STEP 7: FIX ADAPTBOOKS COUNT/SESSIONS 404 ERROR

Now switch to the AdaptBooks codebase at `C:\Adaptensor\adaptbooks`.

The error: `api.adaptbooks.io/api/count/sessions` returns 404 in the browser console on the landing page and/or dashboard.

Investigation steps:
1. Search the frontend for this endpoint:
```bash
grep -r "count/sessions" packages/web/ --include="*.tsx" --include="*.ts" -l
grep -r "count/sessions" packages/web/.next/ --include="*.js" -l 2>/dev/null
```

2. Search the API for this route:
```bash
grep -r "count" packages/api/src/routes/ --include="*.ts" -l
```

3. Based on findings, choose ONE approach:

**Option A (preferred if the call is non-essential):** Remove the frontend fetch call entirely. If it's just visitor analytics or a session counter that doesn't affect functionality, delete it.

**Option B (if it's needed for the UI):** Create the missing route:
```
packages/api/src/routes/count.ts
  GET /api/count/sessions — returns { count: number }
  POST /api/count/sessions — increments count, returns { count: number }
```
Use the existing Neon database. Create a simple table if needed:
```sql
CREATE TABLE IF NOT EXISTS site_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  page TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
Register the route in the Express router.

After fixing:
```bash
cd /c/Adaptensor/adaptbooks
pnpm -r run build  # Must pass zero errors — all 4 packages
git add -f packages/web/app/ packages/api/src/
git commit -m "fix: resolve count/sessions 404 error"
git push origin main
```

## STEP 8: Seed Sample Beta Data

Create an admin-only seed endpoint at `src/app/api/admin/seed/route.ts`:
- POST: Seeds sample data (only runs if tables are empty to prevent duplicates)
- Auth required + admin check

Seed the following:

**Jamie's admin account (if not already in beta_testers):**
- Look up Jamie's Clerk user ID from the ADMIN_USER_IDS env var
- Create or find BetaTester with status "active", role "Shop Owner / Manager", company "Adaptensor, Inc.", interestedProducts "AdaptBooks,AdaptAero,AdaptVault"

**5 sample bug reports:**
1. BUG-001: "AD compliance date shows wrong timezone" — Aero: Compliance Engine, severity: medium, status: fixed, resolution: "Timezone now uses shop's configured timezone instead of UTC"
2. BUG-002: "Parts POS receipt missing 8130-3 reference" — Aero: Parts Traceability, severity: high, status: investigating
3. BUG-003: "Invoice PDF cuts off last line item on page break" — Books: Accounting / GL, severity: medium, status: submitted
4. BUG-004: "Work order status stuck on Awaiting Parts after parts received" — Aero: Work Orders, severity: high, status: in-progress
5. BUG-005: "Dashboard load time over 5 seconds with 50+ aircraft" — Platform: Performance, severity: medium, status: confirmed

**4 sample feature requests:**
1. FR-001: "Bulk import ADs from CSV for fleet operators" — Aero: Compliance Engine, priority: high, voteCount: 8, status: planned
2. FR-002: "QuickBooks Online auto-sync" — Books: Accounting / GL, priority: critical, voteCount: 12, status: under-review
3. FR-003: "Photo annotation on work order squawk images" — Aero: Work Orders, priority: medium, voteCount: 5, status: submitted
4. FR-004: "Document expiration alerts for insurance certs" — Vault: Document Upload, priority: medium, voteCount: 3, status: submitted

**3 sample comments:**
- One admin comment on BUG-001: "Fixed in v0.9.3. Please verify on your end." (isAdmin: true)
- One tester comment on BUG-002: "I can reproduce this on Chrome 122. The 8130-3 tag number shows on the work order but not on the POS receipt."
- One admin comment on FR-002: "This is our most-requested feature. Scoping the integration now." (isAdmin: true)

**4 announcements** (if not already seeded from BETA-3):
1. Type: "release", title: "Adaptensor Beta v0.9.2 Released", version: "v0.9.2", isPinned: true, content: "All 8 core AdaptAero phases complete. 145+ data models, 309 API endpoints, 57 pages. Full accounting integration with aviation MRO. AdaptBooks POS and GL live. AdaptVault in beta."
2. Type: "update", title: "Beta Testing Portal Launch", content: "The beta testing portal is live at beta.adaptensor.io. Submit bug reports, request features, vote on what matters to you, and track issue progress. Your feedback directly shapes our roadmap."
3. Type: "update", title: "Multi-Product Beta Now Open", content: "Beta testing now covers all three Adaptensor products: AdaptBooks (POS + Accounting), AdaptAero (Aviation MRO), and AdaptVault (Document Management). Test everything, report everything."
4. Type: "maintenance", title: "Scheduled Database Maintenance", content: "Brief maintenance window planned for this weekend. You may experience intermittent slowness for 10-15 minutes. No data will be affected."

After seeding, call this endpoint once manually:
```bash
curl -X POST https://beta.adaptensor.io/api/admin/seed \
  -H "Authorization: Bearer <your-clerk-session-token>"
```
Or add a "Seed Sample Data" button on the admin dashboard that calls it.

## STEP 9: Build, Test, Deploy

### Beta Portal:
```bash
cd /c/Adaptensor/beta
pnpm run build  # Must pass zero errors
git add .
git commit -m "feat: admin panel + tester management + issue management + announcements + seed data"
git push origin main
```

### AdaptBooks (if count/sessions was fixed):
```bash
cd /c/Adaptensor/adaptbooks
pnpm -r run build  # Must pass zero errors — all 4 packages
git add -f packages/web/app/ packages/api/src/
git commit -m "fix: count/sessions 404 error"
git push origin main
```

## FINAL CHECKLIST

### Public Pages
- [ ] Landing page loads at beta.adaptensor.io with multi-product branding
- [ ] Registration form works with interested products checkboxes
- [ ] Status page shows modules grouped by product
- [ ] Logo renders correctly

### Auth
- [ ] Sign in with Clerk works
- [ ] Non-registered users see "Register first" message
- [ ] Pending testers see "Under review" message
- [ ] Approved testers access portal

### Portal
- [ ] Dashboard shows real stats
- [ ] Bug report form submits with screenshots
- [ ] Feature request form submits
- [ ] Tracker filters/sorts/paginates
- [ ] Comments work on both issue types (admin comments have gold border)
- [ ] Voting works on features
- [ ] My Reports shows user's submissions
- [ ] Announcements feed renders
- [ ] NO "Session Prompts" anywhere in the UI

### Admin Panel
- [ ] Admin dashboard shows real stats with pending tester list
- [ ] Approve/suspend/delete testers works
- [ ] Approval sends email (if SendGrid configured)
- [ ] Issue management with inline status change works
- [ ] Bulk status change works
- [ ] Bug resolution + fixedInVersion saves
- [ ] Feature admin response + targetVersion saves
- [ ] Announcement CRUD works (create, edit, pin, delete)
- [ ] Non-admin users get redirected, cannot access /admin
- [ ] NO "Session Prompts" or "Manage Prompts" in admin nav

### AdaptBooks
- [ ] count/sessions 404 error resolved (removed or route created)
- [ ] All 4 packages build clean
- [ ] No regressions on existing functionality

### Deployment
- [ ] beta.adaptensor.io resolves and loads
- [ ] Vercel auto-deployed from git push
- [ ] Sample data seeded
- [ ] Jamie's admin account active and can access /admin
