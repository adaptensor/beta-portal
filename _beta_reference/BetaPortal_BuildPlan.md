# AdaptAero Beta Portal — Complete Build Plan

**Project:** beta.adaptensor.io
**Owner:** Jamie (Adaptensor, Inc.)
**Created:** February 20, 2026
**Build Tool:** Claude Code (3-4 sessions)

---

## EXECUTIVE SUMMARY

Standalone Next.js 14 app at `beta.adaptensor.io` serving as the beta testing command center for AdaptAero (Aviation MRO Cloud Platform). Public landing page + authenticated beta portal where testers register, submit bug reports with screenshots, request features, track issues, and download Claude Code session prompts.

This is NOT part of the AdaptBooks monorepo. It's a clean standalone app for speed and isolation — no risk of breaking production AdaptBooks/Aviation code.

---

## ARCHITECTURE

```
beta.adaptensor.io (Vercel)
├── Public Landing Page (/)
├── Public Registration (/register)
├── Public Status Page (/status)
├── Auth (Clerk SSO — same *.adaptensor.io domain)
├── Authenticated Portal (/portal)
│   ├── Dashboard (/portal)
│   ├── Submit Bug (/portal/bugs/new)
│   ├── Submit Feature (/portal/features/new)
│   ├── Issue Tracker (/portal/tracker)
│   ├── My Reports (/portal/my-reports)
│   ├── Session Prompts (/portal/prompts)
│   └── Announcements (/portal/announcements)
├── Admin Panel (/admin) — Jamie only
│   ├── Manage Testers (/admin/testers)
│   ├── Manage Issues (/admin/issues)
│   ├── Manage Prompts (/admin/prompts)
│   └── Analytics (/admin/analytics)
└── API Routes (/api/*)
    ├── /api/beta/register
    ├── /api/beta/bugs
    ├── /api/beta/features
    ├── /api/beta/issues
    ├── /api/beta/prompts
    ├── /api/beta/announcements
    ├── /api/beta/upload
    └── /api/admin/*
```

### Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 14 (App Router) |
| Auth | Clerk (same SSO as *.adaptensor.io) |
| Database | Neon PostgreSQL (same instance: `curly-sunset-11482413`) |
| ORM | Prisma |
| File Storage | Vercel Blob (screenshots, attachments) |
| Email | SendGrid (notifications) |
| Deployment | Vercel (git push to main) |
| Styling | Tailwind CSS + custom brand tokens |
| Repo | `C:\Adaptensor\beta` → GitHub `adaptensor/beta-portal` |

### Domain Setup

- `beta.adaptensor.io` → Vercel project
- Clerk SSO already covers `*.adaptensor.io` wildcard
- Same Neon DB connection string as AdaptBooks (new `beta_*` tables, no conflicts)

---

## CRITICAL RULES

1. **DEPLOYMENT**: `git push origin main` — Vercel auto-deploys from main. NEVER `vercel deploy` or `vercel --prod`.
2. **DATABASE**: Same Neon instance as AdaptBooks. All beta tables prefixed with `beta_`. No modifications to existing tables.
3. **AUTH**: Clerk SSO. Admin check via `userId` match against ADMIN_IDS env var.
4. **BUILD**: `pnpm run build` must pass zero errors before commit.
5. **ENV VARS**: Copy from `C:\Adaptensor\env_vars_jamie.txt`. Clerk keys are the SAME as AdaptBooks (shared SSO domain).
6. **GIT**: New repo at `C:\Adaptensor\beta`. Push to `adaptensor/beta-portal` on GitHub.
7. **UPLOADS**: Use Vercel Blob for screenshots. `BLOB_READ_WRITE_TOKEN` env var on Vercel.
8. **BRANDING**: Yellow #F4D225, Cyan #06B6D4, Black #060505, Dark #0A0A0A, Card #111111, DM Sans font.

---

## DATABASE SCHEMA (Prisma Models)

All tables in the SAME Neon database. Prefixed with `beta_` to avoid any collision with the 113 existing AdaptBooks tables.

```prisma
// schema.prisma — beta portal tables

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ═══════════════════════════════════════
// BETA TESTERS
// ═══════════════════════════════════════

model BetaTester {
  id              String   @id @default(cuid())
  clerkUserId     String?  @unique @map("clerk_user_id")
  name            String
  email           String   @unique
  company         String?
  role            String   // A&P Mechanic, IA Inspector, Shop Owner, etc.
  aircraftTypes   String?  @map("aircraft_types")
  currentSoftware String?  @map("current_software") // Corridor, CAMP, paper, etc.
  status          String   @default("pending") // pending, approved, active, suspended
  agreedToTerms   Boolean  @default(false) @map("agreed_to_terms")
  inviteCode      String?  @unique @map("invite_code")
  registeredAt    DateTime @default(now()) @map("registered_at")
  approvedAt      DateTime? @map("approved_at")
  lastActiveAt    DateTime? @map("last_active_at")
  notes           String?  // admin notes

  bugs            BetaBugReport[]
  features        BetaFeatureRequest[]
  comments        BetaComment[]
  votes           BetaVote[]

  @@map("beta_testers")
}

// ═══════════════════════════════════════
// BUG REPORTS
// ═══════════════════════════════════════

model BetaBugReport {
  id              String   @id @default(cuid())
  reportNumber    String   @unique @map("report_number") // BUG-001, BUG-002...
  testerId        String   @map("tester_id")
  title           String
  category        String   // Aircraft Registry, Work Orders, Compliance, etc.
  severity        String   // critical, high, medium, low
  status          String   @default("submitted") // submitted, confirmed, investigating, in-progress, fixed, wont-fix, duplicate, closed
  stepsToReproduce String? @map("steps_to_reproduce")
  expectedBehavior String? @map("expected_behavior")
  actualBehavior  String?  @map("actual_behavior")
  browserOs       String?  @map("browser_os")
  pageUrl         String?  @map("page_url")
  consoleErrors   String?  @map("console_errors")
  assignedTo      String?  @map("assigned_to")
  fixedInVersion  String?  @map("fixed_in_version")
  resolution      String?  // fix description
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  resolvedAt      DateTime? @map("resolved_at")

  tester          BetaTester @relation(fields: [testerId], references: [id])
  attachments     BetaAttachment[]
  comments        BetaComment[]
  votes           BetaVote[]

  @@map("beta_bug_reports")
}

// ═══════════════════════════════════════
// FEATURE REQUESTS
// ═══════════════════════════════════════

model BetaFeatureRequest {
  id              String   @id @default(cuid())
  requestNumber   String   @unique @map("request_number") // FR-001, FR-002...
  testerId        String   @map("tester_id")
  title           String
  category        String
  priority        String   @default("medium") // critical, high, medium, low
  status          String   @default("submitted") // submitted, under-review, planned, in-progress, shipped, declined
  description     String
  useCase         String?  @map("use_case")
  targetVersion   String?  @map("target_version")
  adminResponse   String?  @map("admin_response")
  voteCount       Int      @default(0) @map("vote_count")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  tester          BetaTester @relation(fields: [testerId], references: [id])
  attachments     BetaAttachment[]
  comments        BetaComment[]
  votes           BetaVote[]

  @@map("beta_feature_requests")
}

// ═══════════════════════════════════════
// ATTACHMENTS (screenshots, files)
// ═══════════════════════════════════════

model BetaAttachment {
  id              String   @id @default(cuid())
  bugReportId     String?  @map("bug_report_id")
  featureRequestId String? @map("feature_request_id")
  fileName        String   @map("file_name")
  fileUrl         String   @map("file_url") // Vercel Blob URL
  fileSize        Int      @map("file_size") // bytes
  mimeType        String   @map("mime_type")
  uploadedAt      DateTime @default(now()) @map("uploaded_at")

  bugReport       BetaBugReport? @relation(fields: [bugReportId], references: [id])
  featureRequest  BetaFeatureRequest? @relation(fields: [featureRequestId], references: [id])

  @@map("beta_attachments")
}

// ═══════════════════════════════════════
// COMMENTS / DISCUSSION
// ═══════════════════════════════════════

model BetaComment {
  id              String   @id @default(cuid())
  bugReportId     String?  @map("bug_report_id")
  featureRequestId String? @map("feature_request_id")
  testerId        String?  @map("tester_id")
  authorName      String   @map("author_name") // "Jamie (Admin)" or tester name
  isAdmin         Boolean  @default(false) @map("is_admin")
  content         String
  createdAt       DateTime @default(now()) @map("created_at")

  bugReport       BetaBugReport? @relation(fields: [bugReportId], references: [id])
  featureRequest  BetaFeatureRequest? @relation(fields: [featureRequestId], references: [id])
  tester          BetaTester? @relation(fields: [testerId], references: [id])

  @@map("beta_comments")
}

// ═══════════════════════════════════════
// VOTES (feature request upvoting)
// ═══════════════════════════════════════

model BetaVote {
  id              String   @id @default(cuid())
  bugReportId     String?  @map("bug_report_id")
  featureRequestId String? @map("feature_request_id")
  testerId        String   @map("tester_id")
  createdAt       DateTime @default(now()) @map("created_at")

  bugReport       BetaBugReport? @relation(fields: [bugReportId], references: [id])
  featureRequest  BetaFeatureRequest? @relation(fields: [featureRequestId], references: [id])
  tester          BetaTester @relation(fields: [testerId], references: [id])

  @@unique([testerId, bugReportId])
  @@unique([testerId, featureRequestId])

  @@map("beta_votes")
}

// ═══════════════════════════════════════
// SESSION PROMPTS (downloadable Claude Code prompts)
// ═══════════════════════════════════════

model BetaSessionPrompt {
  id              String   @id @default(cuid())
  title           String
  phase           String   // AV-1, AV-2, AV-9, etc.
  description     String
  promptContent   String   @map("prompt_content") // The actual prompt text
  version         String   @default("1.0")
  isPublic        Boolean  @default(true) @map("is_public")
  sortOrder       Int      @default(0) @map("sort_order")
  estimatedTime   String?  @map("estimated_time") // "2-3 hours"
  prerequisites   String?  // Comma-separated phase IDs
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  @@map("beta_session_prompts")
}

// ═══════════════════════════════════════
// ANNOUNCEMENTS / CHANGELOG
// ═══════════════════════════════════════

model BetaAnnouncement {
  id              String   @id @default(cuid())
  title           String
  content         String
  type            String   @default("update") // update, release, breaking, maintenance
  version         String?  // v0.9.2, v0.9.3, etc.
  isPinned        Boolean  @default(false) @map("is_pinned")
  publishedAt     DateTime @default(now()) @map("published_at")

  @@map("beta_announcements")
}

// ═══════════════════════════════════════
// PLATFORM HEALTH / METRICS
// ═══════════════════════════════════════

model BetaPlatformMetric {
  id              String   @id @default(cuid())
  metricName      String   @map("metric_name") // prisma_models, api_routes, pages, uptime_pct
  metricValue     String   @map("metric_value")
  recordedAt      DateTime @default(now()) @map("recorded_at")

  @@map("beta_platform_metrics")
}
```

**Total: 9 new tables, all prefixed `beta_`, zero conflict with existing 113 tables.**

---

## API ROUTES

All routes under `/api/beta/` (public) and `/api/admin/` (Jamie only).

### Public Routes (no auth required)
```
POST /api/beta/register          — Register as beta tester
GET  /api/beta/status             — Platform status (module progress, version)
GET  /api/beta/announcements      — Public announcements/changelog
```

### Authenticated Routes (Clerk auth required, must be approved beta tester)
```
GET    /api/beta/bugs             — List all bug reports (paginated, filterable)
POST   /api/beta/bugs             — Submit new bug report
GET    /api/beta/bugs/:id         — Get bug report detail
PATCH  /api/beta/bugs/:id         — Update own bug report

GET    /api/beta/features         — List all feature requests
POST   /api/beta/features         — Submit new feature request
GET    /api/beta/features/:id     — Get feature request detail
PATCH  /api/beta/features/:id     — Update own feature request
POST   /api/beta/features/:id/vote — Vote for a feature

POST   /api/beta/comments         — Add comment to bug or feature
GET    /api/beta/comments/:type/:id — Get comments for issue

POST   /api/beta/upload           — Upload screenshot/attachment (Vercel Blob)

GET    /api/beta/prompts          — List available session prompts
GET    /api/beta/prompts/:id      — Get prompt content (for download)

GET    /api/beta/me               — Get current tester profile
PATCH  /api/beta/me               — Update profile
GET    /api/beta/my-reports       — Get my submitted bugs + features
```

### Admin Routes (Jamie only — checked by ADMIN_USER_IDS env var)
```
GET    /api/admin/testers         — List all beta testers
PATCH  /api/admin/testers/:id     — Approve/suspend tester
DELETE /api/admin/testers/:id     — Remove tester

PATCH  /api/admin/bugs/:id        — Update bug status, assign, resolve
PATCH  /api/admin/features/:id    — Update feature status, respond

POST   /api/admin/prompts         — Create session prompt
PATCH  /api/admin/prompts/:id     — Update session prompt
DELETE /api/admin/prompts/:id     — Delete session prompt

POST   /api/admin/announcements   — Create announcement
PATCH  /api/admin/announcements/:id — Update announcement
DELETE /api/admin/announcements/:id — Delete announcement

GET    /api/admin/analytics       — Dashboard stats
```

---

## PAGE STRUCTURE

### Public Pages (No Auth)
```
/                    — Landing page (hero, features, social proof, CTA)
/register            — Beta registration form
/status              — Public module status board
```

### Portal Pages (Clerk Auth + Approved Tester)
```
/portal              — Dashboard (stats, recent activity, quick actions)
/portal/bugs/new     — Submit bug report form
/portal/bugs/[id]    — Bug report detail + comments
/portal/features/new — Submit feature request form
/portal/features/[id]— Feature detail + voting + comments
/portal/tracker      — Full issue tracker (all bugs + features, sortable/filterable)
/portal/my-reports   — My submitted reports
/portal/prompts      — Browse & download Claude Code session prompts
/portal/prompts/[id] — View full prompt with copy/download
/portal/announcements— Changelog / announcements feed
```

### Admin Pages (Jamie Only)
```
/admin               — Admin dashboard (testers, issues, metrics)
/admin/testers       — Manage beta testers (approve, suspend, stats)
/admin/issues        — Manage all issues (bulk status update, assign)
/admin/prompts       — Manage session prompts (CRUD)
/admin/prompts/new   — Create new session prompt
/admin/announcements — Manage announcements (CRUD)
```

---

## ENV VARS NEEDED

```env
# From C:\Adaptensor\env_vars_jamie.txt — SAME as AdaptBooks
DATABASE_URL="postgresql://neondb_owner:npg_NkMuA18jQDtB@ep-purple-sound-aimxmmbn-pooler.c-4.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...  # Same as AdaptBooks
CLERK_SECRET_KEY=sk_live_...                    # Same as AdaptBooks
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/portal
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/register

# New for beta portal
BLOB_READ_WRITE_TOKEN=vercel_blob_...          # Create in Vercel project settings
SENDGRID_API_KEY=SG....                        # Same as AdaptBooks
ADMIN_USER_IDS=user_2abc123,user_xyz456        # Jamie's Clerk user ID(s)
NEXT_PUBLIC_APP_URL=https://beta.adaptensor.io
NEXT_PUBLIC_AERO_URL=https://aviation.adaptensor.io
```

---

## FILE STRUCTURE

```
C:\Adaptensor\beta\
├── .env.local                    # Local env vars (copied from env_vars_jamie.txt)
├── .gitignore
├── next.config.js
├── package.json
├── pnpm-lock.yaml
├── tailwind.config.ts
├── tsconfig.json
├── prisma/
│   └── schema.prisma             # Beta tables only (9 models)
├── public/
│   ├── logoA.svg                 # Adaptensor logo (copy from AdaptBooks)
│   ├── favicon.ico
│   └── og-image.png              # Social sharing image
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Root layout with Clerk, DM Sans font
│   │   ├── page.tsx              # Landing page (public)
│   │   ├── register/
│   │   │   └── page.tsx          # Registration form (public)
│   │   ├── status/
│   │   │   └── page.tsx          # Module status board (public)
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/page.tsx
│   │   ├── sign-up/
│   │   │   └── [[...sign-up]]/page.tsx
│   │   ├── (portal)/
│   │   │   ├── layout.tsx        # Portal layout (sidebar, header, auth check)
│   │   │   ├── portal/
│   │   │   │   └── page.tsx      # Dashboard
│   │   │   ├── portal/bugs/
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── portal/features/
│   │   │   │   ├── new/page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── portal/tracker/
│   │   │   │   └── page.tsx
│   │   │   ├── portal/my-reports/
│   │   │   │   └── page.tsx
│   │   │   ├── portal/prompts/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   └── portal/announcements/
│   │   │       └── page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx        # Admin layout (admin check)
│   │   │   ├── admin/
│   │   │   │   └── page.tsx      # Admin dashboard
│   │   │   ├── admin/testers/
│   │   │   │   └── page.tsx
│   │   │   ├── admin/issues/
│   │   │   │   └── page.tsx
│   │   │   ├── admin/prompts/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/page.tsx
│   │   │   └── admin/announcements/
│   │   │       └── page.tsx
│   │   └── api/
│   │       ├── beta/
│   │       │   ├── register/route.ts
│   │       │   ├── bugs/route.ts
│   │       │   ├── bugs/[id]/route.ts
│   │       │   ├── features/route.ts
│   │       │   ├── features/[id]/route.ts
│   │       │   ├── features/[id]/vote/route.ts
│   │       │   ├── comments/route.ts
│   │       │   ├── comments/[type]/[id]/route.ts
│   │       │   ├── upload/route.ts
│   │       │   ├── prompts/route.ts
│   │       │   ├── prompts/[id]/route.ts
│   │       │   ├── me/route.ts
│   │       │   ├── my-reports/route.ts
│   │       │   ├── status/route.ts
│   │       │   └── announcements/route.ts
│   │       └── admin/
│   │           ├── testers/route.ts
│   │           ├── testers/[id]/route.ts
│   │           ├── bugs/[id]/route.ts
│   │           ├── features/[id]/route.ts
│   │           ├── prompts/route.ts
│   │           ├── prompts/[id]/route.ts
│   │           ├── announcements/route.ts
│   │           ├── announcements/[id]/route.ts
│   │           └── analytics/route.ts
│   ├── lib/
│   │   ├── prisma.ts             # Prisma client singleton
│   │   ├── auth.ts               # Auth helpers (isAdmin, requireTester, etc.)
│   │   ├── constants.ts          # Categories, severities, statuses
│   │   └── utils.ts              # generateReportNumber, formatDate, etc.
│   └── components/
│       ├── ui/                   # Shared UI (Button, Badge, Input, Select, Card, Modal)
│       ├── layout/               # Header, Sidebar, Footer, NavTabs
│       ├── landing/              # Hero, Features, Pricing, CTA sections
│       ├── portal/               # BugForm, FeatureForm, IssueCard, CommentThread
│       └── admin/                # TesterTable, IssueManager, PromptEditor
```

---

## LANDING PAGE DESIGN

The landing page at `beta.adaptensor.io` sells the beta program. Sections:

1. **Hero** — "Shape the Future of Aviation MRO Software" with animated plane icon, beta badge, CTA to register
2. **The Problem** — "Paper logbooks. $500/month Corridor. QuickBooks for the rest. Sound familiar?"
3. **What You're Testing** — Module grid showing all 12 modules with live/beta/dev status
4. **Why Join** — Early access, direct input on features, founding member pricing when GA, your name in the credits
5. **Platform Stats** — 145+ Prisma models, 309 API routes, 57 pages, built-in accounting
6. **Current Testers** — "23 beta testers across 6 repair stations" (anonymized testimonials)
7. **How It Works** — Register → Get approved → Access platform → Report & request → Ship together
8. **Bottom CTA** — Register button + "No credit card. No commitment. Just feedback."

---

## BUILD SESSIONS

### SESSION BETA-1: Scaffold + Database + Landing Page

**Duration:** ~2 hours
**Goal:** Project scaffold, Prisma schema, database push, landing page, registration form, public status page.

### SESSION BETA-2: Auth + Portal Core

**Duration:** ~2 hours
**Goal:** Clerk auth integration, portal layout with sidebar, dashboard page, bug report form + submission, feature request form + submission, file upload to Vercel Blob.

### SESSION BETA-3: Tracker + Comments + Prompts + Voting

**Duration:** ~2 hours
**Goal:** Issue tracker with sorting/filtering, comment threads on issues, feature voting, session prompts browser with download, my-reports page, announcements feed.

### SESSION BETA-4: Admin Panel + Polish + Health Check

**Duration:** ~1-2 hours
**Goal:** Admin dashboard, tester management, issue management, prompt CRUD, announcement CRUD, seed sample data, fix the `api.adaptbooks.io/api/count/sessions` 404 error in AdaptBooks, end-to-end test, deploy.

---

## CLAUDE CODE SESSION PROMPTS

---

### SESSION BETA-1: Scaffold + Database + Landing Page

```
You are building a standalone Next.js 14 beta testing portal for Adaptensor's AdaptAero Aviation MRO platform. The portal lives at beta.adaptensor.io.

## CRITICAL RULES
- Deployment: git push origin main. NEVER vercel deploy.
- Database: Neon PostgreSQL (SAME instance as AdaptBooks). All tables prefixed beta_. DO NOT touch existing tables.
- Auth: Clerk SSO (same keys as AdaptBooks — shared *.adaptensor.io domain).
- Build: pnpm run build must pass zero errors before commit.
- Styling: Tailwind CSS. Brand colors: Yellow #F4D225, Cyan #06B6D4, Black #060505, Dark #0A0A0A, Card #111111, Border #1E1E1E. Font: DM Sans.

## STEP 1: Initialize Project

cd /c/Adaptensor
npx create-next-app@latest beta --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd beta
pnpm add @clerk/nextjs @prisma/client @vercel/blob
pnpm add -D prisma

## STEP 2: Configure

Create/update these files:

### next.config.js
module.exports = {
  images: { remotePatterns: [{ protocol: 'https', hostname: '**.public.blob.vercel-storage.com' }] },
};

### tailwind.config.ts
Add custom colors:
- brand: { yellow: '#F4D225', cyan: '#06B6D4', black: '#060505', dark: '#0A0A0A', card: '#111111', cardHover: '#161616', border: '#1E1E1E', borderHover: '#2A2A2A' }
Add DM Sans font family.

### .env.local
Read env vars from C:\Adaptensor\env_vars_jamie.txt. You need:
- DATABASE_URL (same Neon connection string as AdaptBooks)
- NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (same as AdaptBooks)
- CLERK_SECRET_KEY (same as AdaptBooks)
- NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
- NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
- NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/portal
- NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/register
- ADMIN_USER_IDS=<Jamie's Clerk user ID — find it in env_vars_jamie.txt or Clerk dashboard>
- NEXT_PUBLIC_APP_URL=https://beta.adaptensor.io
- NEXT_PUBLIC_AERO_URL=https://aviation.adaptensor.io

## STEP 3: Prisma Schema

Create prisma/schema.prisma with these 9 models (ALL mapped to beta_ prefixed table names):

1. BetaTester — id, clerkUserId (unique), name, email (unique), company, role, aircraftTypes, currentSoftware, status (pending/approved/active/suspended), agreedToTerms, inviteCode (unique), registeredAt, approvedAt, lastActiveAt, notes. Relations: bugs, features, comments, votes. @@map("beta_testers")

2. BetaBugReport — id, reportNumber (unique, BUG-001 format), testerId, title, category, severity (critical/high/medium/low), status (submitted/confirmed/investigating/in-progress/fixed/wont-fix/duplicate/closed), stepsToReproduce, expectedBehavior, actualBehavior, browserOs, pageUrl, consoleErrors, assignedTo, fixedInVersion, resolution, createdAt, updatedAt, resolvedAt. Relations: tester, attachments, comments, votes. @@map("beta_bug_reports")

3. BetaFeatureRequest — id, requestNumber (unique, FR-001 format), testerId, title, category, priority, status (submitted/under-review/planned/in-progress/shipped/declined), description, useCase, targetVersion, adminResponse, voteCount (default 0), createdAt, updatedAt. Relations: tester, attachments, comments, votes. @@map("beta_feature_requests")

4. BetaAttachment — id, bugReportId (optional), featureRequestId (optional), fileName, fileUrl (Vercel Blob URL), fileSize, mimeType, uploadedAt. Relations: bugReport, featureRequest. @@map("beta_attachments")

5. BetaComment — id, bugReportId (optional), featureRequestId (optional), testerId (optional), authorName, isAdmin (default false), content, createdAt. Relations: bugReport, featureRequest, tester. @@map("beta_comments")

6. BetaVote — id, bugReportId (optional), featureRequestId (optional), testerId, createdAt. @@unique([testerId, bugReportId]), @@unique([testerId, featureRequestId]). Relations: bugReport, featureRequest, tester. @@map("beta_votes")

7. BetaSessionPrompt — id, title, phase, description, promptContent, version, isPublic (default true), sortOrder, estimatedTime, prerequisites, createdAt, updatedAt. @@map("beta_session_prompts")

8. BetaAnnouncement — id, title, content, type (update/release/breaking/maintenance), version, isPinned, publishedAt. @@map("beta_announcements")

9. BetaPlatformMetric — id, metricName, metricValue, recordedAt. @@map("beta_platform_metrics")

After creating schema, run:
npx prisma db push
npx prisma generate

Verify with Neon MCP that the 9 beta_ tables exist alongside the existing 113 tables. DO NOT modify or drop any existing tables.

## STEP 4: Lib Files

### src/lib/prisma.ts
Standard Prisma client singleton with globalThis pattern for dev hot reload.

### src/lib/constants.ts
Export these constants:

CATEGORIES = ["Aircraft Registry", "Work Orders", "Compliance Engine", "Parts Traceability", "FAA Forms", "Personnel", "Reporting", "Dashboard", "POS / Counter", "Accounting / GL", "AdaptGent AI", "Onboarding", "Mobile / PWA", "Performance", "Authentication", "Other"]

SEVERITIES = { critical: { label: "Critical", color: "red" }, high: { label: "High", color: "orange" }, medium: { label: "Medium", color: "yellow" }, low: { label: "Low", color: "cyan" } }

BUG_STATUSES = ["submitted", "confirmed", "investigating", "in-progress", "fixed", "wont-fix", "duplicate", "closed"]

FEATURE_STATUSES = ["submitted", "under-review", "planned", "in-progress", "shipped", "declined"]

TESTER_ROLES = ["A&P Mechanic", "IA Inspector", "Shop Owner / Manager", "Avionics Technician", "Parts Manager", "Service Writer", "Aircraft Owner / Operator", "FBO Manager", "Other"]

CURRENT_SOFTWARE_OPTIONS = ["None (paper/spreadsheets)", "Corridor / ATP", "CAMP Systems", "Quantum MX", "AvSight", "Traxxall", "Ramco", "Custom / In-house", "Other"]

MODULES_STATUS = [
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
]

### src/lib/auth.ts
Helper functions:
- isAdmin(userId: string): boolean — checks against ADMIN_USER_IDS env var
- requireAdmin(userId: string): throws error if not admin
- getTester(clerkUserId: string): returns BetaTester or null
- requireTester(clerkUserId: string): returns BetaTester, throws if not found or not approved

### src/lib/utils.ts
- generateBugNumber(): queries DB for max report_number, increments. Format: BUG-001
- generateFeatureNumber(): same for FR-001
- formatDate(date): "Feb 20, 2026"
- formatRelativeTime(date): "2 hours ago", "yesterday"
- cn(...classes): classnames merge utility

## STEP 5: Root Layout

src/app/layout.tsx:
- ClerkProvider wrapping everything
- Google Fonts: DM Sans (400, 500, 600, 700, 800) + JetBrains Mono (400, 700)
- Metadata: title "AdaptAero Beta Program | Adaptensor", description, og:image
- Dark background (#060505) as body default
- export const dynamic = "force-dynamic"

## STEP 6: Landing Page

src/app/page.tsx — Full landing page. This should be STUNNING. Aviation MRO theme.

Sections:
1. HERO: "Shape the Future of Aviation MRO Software" — Large headline, "AdaptAero" in cyan, subtitle about the only affordable FAA-compliant MRO + accounting system. Animated plane SVG. "Join the Beta" yellow CTA button. Badge: "BETA v0.9.2" in cyan. Subtle scan-line background effect (CSS only, no canvas).

2. THE PROBLEM: Three cards showing pain points — "$500-$5,000/mo for Corridor + QuickBooks", "Paper logbooks = compliance risk", "Double data entry kills productivity". Each card has icon, stat, description. Dark cards with subtle gradient borders.

3. WHAT YOU'RE TESTING: Grid of 12 modules with colored status badges (LIVE in green, BETA in cyan, DEV in orange, PLANNED in gray) and progress bars. Same data from MODULES_STATUS constant.

4. PLATFORM STATS: Animated counter row — "145+ Prisma Models", "309 API Endpoints", "57 Pages", "$99-$299/mo vs $500-$5,000+". Use monospace font for numbers.

5. WHY JOIN: Four benefit cards — "Early Access" (get the platform before GA launch), "Direct Influence" (your feedback shapes the roadmap), "Founding Member Pricing" (locked-in rate at GA), "Industry Recognition" (named in launch credits). Each with icon and description.

6. HOW IT WORKS: 4-step horizontal flow — Register → Get Approved → Test & Report → Ship Together. Connected by dotted lines. Each step has numbered circle, icon, title, description.

7. CTA: "Stop flying blind with paper and spreadsheets." Yellow button "Apply for Beta Access" linking to /register. "No credit card. No commitment. Just feedback."

8. FOOTER: Adaptensor Inc. | Links to aviation.adaptensor.io, books.adaptensor.io, vault.adaptensor.io | v0.9.2-beta | © 2026

Copy the Adaptensor logo from C:\Adaptensor\adaptbooks\packages\web\public\logoA.svg into public/logoA.svg.

## STEP 7: Registration Page

src/app/register/page.tsx — Public registration form (no auth required).

Fields:
- Full Name (required)
- Email (required, validated)
- Company / Shop Name
- Role (required, dropdown from TESTER_ROLES)
- Aircraft Types You Work On (text input)
- Current MRO Software (dropdown from CURRENT_SOFTWARE_OPTIONS)
- Checkbox: "I understand this is beta software..." (required)

Submit calls POST /api/beta/register. Shows success confirmation with "We'll review your application and email you when approved."

Style: Dark card centered, max-width 580px, same brand styling. Adaptensor logo at top.

## STEP 8: Registration API Route

src/app/api/beta/register/route.ts:
- POST handler
- Validates required fields (name, email, role, agreed)
- Checks for duplicate email
- Creates BetaTester record with status: "pending"
- If the user is signed in with Clerk, link clerkUserId
- Returns { success: true, message: "Application submitted" }
- (Optional) Send notification email to Jamie via SendGrid

## STEP 9: Public Status Page

src/app/status/page.tsx:
- Shows module status grid (same as landing page section but full-page)
- Platform health metrics
- Current version info
- Recent announcements
- No auth required

## STEP 10: Build & Test

pnpm run build — must pass zero errors.
Test locally: pnpm run dev — verify landing page, registration, status page.

## STEP 11: Git Setup & Deploy

git init
git remote add origin https://github.com/adaptensor/beta-portal.git
(Create the repo on GitHub first if it doesn't exist)
git add .
git commit -m "feat: beta portal scaffold + landing + registration + status"
git push -u origin main

Then in Vercel:
- Import the adaptensor/beta-portal repo
- Set the domain to beta.adaptensor.io
- Add all env vars from .env.local
- Deploy

DO NOT PROCEED TO SESSION 2 UNTIL:
- [x] pnpm run build passes zero errors
- [x] Landing page renders with all sections
- [x] Registration form submits and creates DB record
- [x] Status page shows module grid
- [x] Logo displays correctly
- [x] All 9 beta_ tables exist in Neon alongside existing 113 tables
```

---

### SESSION BETA-2: Auth + Portal Core

```
You are continuing the beta.adaptensor.io build. Session BETA-1 is complete — scaffold, database, landing page, registration are working.

Read the codebase first: ls src/app, ls src/lib, ls prisma. Understand what exists.

## CRITICAL RULES (SAME AS SESSION 1)
- git push origin main only. Never vercel deploy.
- Same Neon DB. Only touch beta_ tables.
- pnpm run build must pass zero errors.
- Brand: Yellow #F4D225, Cyan #06B6D4, Black #060505.

## STEP 1: Clerk Auth Pages

Create sign-in and sign-up catch-all routes:

src/app/sign-in/[[...sign-in]]/page.tsx — Clerk <SignIn /> component with dark theme, branded
src/app/sign-up/[[...sign-up]]/page.tsx — Clerk <SignUp /> component with dark theme, branded

## STEP 2: Portal Layout

src/app/(portal)/layout.tsx:
- Clerk auth check: if not signed in, redirect to /sign-in
- Check if user is an approved beta tester (query beta_testers by clerk_user_id)
- If not a beta tester: show "You need to register for the beta program" with link to /register
- If tester status is "pending": show "Your application is under review"
- If approved/active: render the portal layout

Layout structure:
- Fixed left sidebar (250px, dark #0A0A0A):
  - Logo (logoA.svg, small)
  - "AdaptAero Beta" title
  - Nav links: Dashboard, Report Bug, Request Feature, Tracker, My Reports, Session Prompts, Announcements
  - Bottom: User avatar + name from Clerk, Sign Out button
- Main content area with top padding
- Mobile: sidebar becomes hamburger menu

## STEP 3: Portal Dashboard

src/app/(portal)/portal/page.tsx:

Welcome banner: "Welcome back, {name}" with beta tester badge

Stats row (query actual DB):
- Your Reports: count of bugs + features by this tester
- Open Issues: total open bugs + features across all testers
- Fixed This Week: bugs resolved in last 7 days
- Feature Votes Cast: total votes by this tester

Quick Actions: Two cards — "Report a Bug" (red icon) and "Request Feature" (yellow icon)

Recent Activity: Last 5 items (bugs + features combined, sorted by createdAt desc) across ALL testers. Shows ID, title, severity badge, status badge, author, time ago.

Announcements preview: Last 2 pinned or recent announcements.

## STEP 4: Bug Report Form

src/app/(portal)/portal/bugs/new/page.tsx:

Form fields:
- Bug Title (required)
- Module/Category (required, dropdown from CATEGORIES)
- Severity (required, dropdown: critical/high/medium/low)
- Steps to Reproduce (required, textarea, 4 rows)
- Expected Behavior (textarea, 2 rows)
- Actual Behavior (textarea, 2 rows)
- Page URL (text, placeholder "e.g. aviation.adaptensor.io/compliance/ads")
- Console Errors (textarea, monospace font, placeholder "Paste any error messages from browser console")
- Browser & OS (text)
- Screenshots (file upload, multiple, accept image/*)

Screenshot upload:
- When files are selected, immediately upload each to POST /api/beta/upload
- Show upload progress and thumbnails
- Store returned Vercel Blob URLs
- Attach URLs when submitting the bug report

Submit calls POST /api/beta/bugs with all fields + attachment URLs.
On success: redirect to /portal/bugs/[id] (the new bug's detail page) with success toast.

## STEP 5: Bug Report API

src/app/api/beta/bugs/route.ts:
- GET: List all bugs, paginated (page/limit query params), filterable by status/severity/category. Include tester name. Order by createdAt desc.
- POST: Create bug. Auth required. Get tester from Clerk userId. Generate reportNumber (BUG-XXX). Create BetaBugReport + link BetaAttachment records.

src/app/api/beta/bugs/[id]/route.ts:
- GET: Single bug with tester, attachments, comments, vote count.
- PATCH: Update own bug (title, description, etc.). Only the original tester or admin.

## STEP 6: File Upload API

src/app/api/beta/upload/route.ts:
- POST handler
- Accept multipart form data
- Use @vercel/blob put() to upload
- Max file size: 10MB
- Accepted types: image/png, image/jpeg, image/gif, image/webp, application/pdf
- Returns { url, fileName, fileSize, mimeType }

## STEP 7: Feature Request Form

src/app/(portal)/portal/features/new/page.tsx:

Form fields:
- Feature Title (required)
- Module/Category (required, dropdown)
- Priority (dropdown: critical/high/medium/low)
- Description (required, textarea, 4 rows)
- Use Case (textarea, 3 rows, "How would you use this in your daily operations?")

Submit calls POST /api/beta/features.
On success: redirect to /portal/features/[id].

## STEP 8: Feature Request API

src/app/api/beta/features/route.ts:
- GET: List all features, paginated, filterable by status/priority/category. Include vote count. Order by voteCount desc, createdAt desc.
- POST: Create feature. Auth required. Generate requestNumber (FR-XXX).

src/app/api/beta/features/[id]/route.ts:
- GET: Single feature with tester, attachments, comments, votes.
- PATCH: Update own feature.

src/app/api/beta/features/[id]/vote/route.ts:
- POST: Toggle vote. If already voted, remove vote. If not, add vote. Update voteCount on the feature. Return new vote state + count.

## STEP 9: Bug Detail Page

src/app/(portal)/portal/bugs/[id]/page.tsx:
- Full bug report display with all fields
- Severity and status badges
- Screenshots displayed as thumbnails (click to enlarge in modal)
- Comment thread at bottom (see Session 3)
- "Back to Tracker" link
- If own bug: edit button

## STEP 10: Feature Detail Page

src/app/(portal)/portal/features/[id]/page.tsx:
- Full feature request display
- Vote button with count (animated on click)
- Admin response section (if any)
- Comment thread at bottom
- "Back to Tracker" link

## STEP 11: Build & Deploy

pnpm run build — zero errors.
git add .
git commit -m "feat: portal auth + dashboard + bug/feature forms + file upload"
git push origin main

DO NOT PROCEED TO SESSION 3 UNTIL:
- [x] Sign in/up works with Clerk
- [x] Portal layout renders with sidebar
- [x] Dashboard shows real stats from DB
- [x] Bug report form submits with screenshots
- [x] Feature request form submits
- [x] Bug detail page renders
- [x] Feature detail page renders with voting
- [x] File upload to Vercel Blob works
- [x] pnpm run build zero errors
```

---

### SESSION BETA-3: Tracker + Comments + Prompts

```
You are continuing the beta.adaptensor.io build. Sessions BETA-1 and BETA-2 are complete.

Read the codebase first. Understand what exists.

## CRITICAL RULES (SAME AS BEFORE)

## STEP 1: Issue Tracker Page

src/app/(portal)/portal/tracker/page.tsx:

Full-featured issue tracker combining bugs AND features in one view.

Controls row:
- Tab toggle: All | Bugs | Features
- Filter by status (multi-select chips)
- Filter by severity (chips)
- Filter by category (dropdown)
- Sort: Newest | Oldest | Most Voted | Severity
- Search: text search on title

Table/list view (responsive):
- ID column (BUG-001 in cyan, FR-001 in yellow, monospace)
- Title + author ("by Mike T.")
- Category tag
- Severity badge (colored)
- Status badge (colored)
- Vote count (for features)
- Date
- Click row → navigate to detail page

Pagination at bottom.

API: GET /api/beta/bugs and GET /api/beta/features with query params, combine on frontend.

## STEP 2: Comment System

src/app/api/beta/comments/route.ts:
- POST: Add comment. Fields: bugReportId OR featureRequestId, content. Auth required. Gets tester name from DB. isAdmin flag if userId matches ADMIN_USER_IDS.

src/app/api/beta/comments/[type]/[id]/route.ts:
- GET: type is "bug" or "feature", id is the report/request id. Returns all comments ordered by createdAt asc.

Comment thread component (src/components/portal/CommentThread.tsx):
- Shows all comments in chronological order
- Admin comments have gold/yellow border and "ADMIN" badge
- Tester comments have subtle border
- Each comment: avatar initial circle, name, time ago, content
- Add comment form at bottom: textarea + submit button
- Optimistic UI update on submit

Add CommentThread to both bugs/[id] and features/[id] pages.

## STEP 3: My Reports Page

src/app/(portal)/portal/my-reports/page.tsx:
- Two sections: "My Bug Reports" and "My Feature Requests"
- Each shows a list of the current tester's submissions
- Columns: ID, Title, Status, Date Submitted, Last Updated
- Click to navigate to detail page
- Quick stats at top: total submitted, open, resolved

## STEP 4: Session Prompts Page

src/app/(portal)/portal/prompts/page.tsx:
- Lists all session prompts from BetaSessionPrompt table (isPublic=true)
- Grouped by phase: AV-1 through AV-11+, BETA-1 through BETA-4
- Each card shows: phase badge, title, description, estimated time, prerequisites
- Click to view full prompt

src/app/(portal)/portal/prompts/[id]/page.tsx:
- Full prompt display
- Prompt content rendered in a monospace code block with syntax highlighting
- "Copy to Clipboard" button (copies the full promptContent)
- "Download as .md" button (generates and downloads a .md file)
- Prerequisites listed with links to prerequisite prompts
- Version info
- Back to all prompts link

## STEP 5: Prompts API

src/app/api/beta/prompts/route.ts:
- GET: List all public prompts, ordered by sortOrder then phase.

src/app/api/beta/prompts/[id]/route.ts:
- GET: Single prompt with full content.

## STEP 6: Announcements Page

src/app/(portal)/portal/announcements/page.tsx:
- Changelog-style feed
- Each announcement: type badge (update=cyan, release=green, breaking=red, maintenance=orange), title, version tag, content (rendered as markdown), date
- Pinned announcements stay at top with pin icon

src/app/api/beta/announcements/route.ts:
- GET: List all announcements, pinned first, then by publishedAt desc.

## STEP 7: Seed Session Prompts

Create a seed script or API route to populate BetaSessionPrompt table with the actual Claude Code prompts from the AdaptBooks build. Seed these prompts:

1. AV-1: Aircraft Registry & Component Tracking (from Aviation_ClaudeCode_BuildPlan.md)
2. AV-2: Aviation Work Orders & Squawk Management
3. AV-3: FAA Compliance Engine
4. AV-4: Parts Traceability & 8130-3 Tags
5. AV-5: FAA Form Generation
6. AV-6: Personnel & Tool Calibration
7. AV-7: Aviation Reporting & AdaptGent
8. AV-8: Polish, Testing & Launch
9. AV-9: Financial Authorization & Draw System
10. BETA-1: Beta Portal Scaffold (this session!)
11. BETA-2: Auth + Portal Core
12. BETA-3: Tracker + Comments + Prompts
13. BETA-4: Admin + Polish

For each, set title, phase, description, estimated time. The promptContent can initially be placeholder text like "Session prompt content will be populated from the build plan documents." — Jamie will update these with actual content later, or you can read from the project files if accessible.

## STEP 8: Seed Sample Announcements

Seed 3-4 announcements:
1. Type "release", title "AdaptAero Beta v0.9.2 Released", version "v0.9.2", content about 145+ models, 309 routes, all 8 core phases complete.
2. Type "update", title "Beta Testing Portal Launch", content about the new beta portal with bug reporting, feature requests, session prompts.
3. Type "update", title "Customer Portal Coming Soon", content about the owner-facing portal.

## STEP 9: Build & Deploy

pnpm run build — zero errors.
git add .
git commit -m "feat: tracker + comments + prompts + announcements + seed data"
git push origin main

DO NOT PROCEED TO SESSION 4 UNTIL:
- [x] Tracker page filters and sorts correctly
- [x] Comments work on both bug and feature detail pages
- [x] Admin comments show with gold border
- [x] My Reports page shows current user's submissions
- [x] Prompts page lists all seeded prompts
- [x] Prompt detail page has working copy/download
- [x] Announcements page renders feed
- [x] pnpm run build zero errors
```

---

### SESSION BETA-4: Admin Panel + AdaptBooks Fix + Deploy

```
You are finishing the beta.adaptensor.io build. Sessions BETA-1, 2, 3 are complete.

Read the codebase first. Understand what exists.

## CRITICAL RULES (SAME AS BEFORE)

## STEP 1: Admin Layout

src/app/(admin)/layout.tsx:
- Clerk auth check
- Check if userId is in ADMIN_USER_IDS env var
- If not admin: redirect to /portal with "Access denied" message
- Admin layout: same sidebar style but with admin-specific nav items
- Nav: Dashboard, Manage Testers, Manage Issues, Session Prompts, Announcements

## STEP 2: Admin Dashboard

src/app/(admin)/admin/page.tsx:
- Summary stats cards:
  - Total Testers (pending / approved / active)
  - Total Bug Reports (open / fixed / closed)
  - Total Feature Requests (submitted / planned / shipped)
  - New This Week (testers + reports)
- Recent registrations (last 10 pending testers with approve/reject buttons)
- Recent issues needing attention (unassigned, critical severity, etc.)
- Quick links to manage pages

## STEP 3: Tester Management

src/app/(admin)/admin/testers/page.tsx:
- Table of all beta testers
- Columns: Name, Email, Company, Role, Status, Registered Date, Last Active, Bug Count, Feature Count
- Inline actions: Approve, Suspend, Delete
- Status filter tabs: All | Pending | Approved | Active | Suspended
- Search by name/email/company
- Click to expand: shows full profile details + notes field

Admin API:
src/app/api/admin/testers/route.ts — GET all testers with counts
src/app/api/admin/testers/[id]/route.ts — PATCH (update status, add notes), DELETE

When approving a tester, optionally send approval email via SendGrid.

## STEP 4: Issue Management

src/app/(admin)/admin/issues/page.tsx:
- Combined bug + feature list (same as tracker but with admin actions)
- Admin actions per issue:
  - Change status (dropdown with all status options)
  - Assign to (text field or dropdown)
  - Set fixedInVersion / targetVersion
  - Add admin response (for features)
  - Add resolution text (for bugs)
- Bulk actions: select multiple → change status
- Priority sorting: Critical → High → Medium → Low

Admin API:
src/app/api/admin/bugs/[id]/route.ts — PATCH (status, assignedTo, resolution, fixedInVersion)
src/app/api/admin/features/[id]/route.ts — PATCH (status, targetVersion, adminResponse)

## STEP 5: Prompt Management

src/app/(admin)/admin/prompts/page.tsx:
- List all prompts (including non-public)
- Reorder via sortOrder
- Edit inline or navigate to edit page
- Delete with confirmation

src/app/(admin)/admin/prompts/new/page.tsx:
- Create form: title, phase, description, promptContent (large textarea or code editor), version, estimatedTime, prerequisites, isPublic toggle, sortOrder

Admin API:
src/app/api/admin/prompts/route.ts — POST create
src/app/api/admin/prompts/[id]/route.ts — PATCH update, DELETE

## STEP 6: Announcement Management

src/app/(admin)/admin/announcements/page.tsx:
- List all announcements
- Create new, edit, delete
- Toggle pinned status
- Set type (update/release/breaking/maintenance)

Admin API:
src/app/api/admin/announcements/route.ts — POST
src/app/api/admin/announcements/[id]/route.ts — PATCH, DELETE

## STEP 7: Analytics API

src/app/api/admin/analytics/route.ts:
- GET: Returns aggregated stats
  - testers: { total, pending, approved, active, byRole: {...}, byCurrentSoftware: {...} }
  - bugs: { total, open, fixed, bySeverity: {...}, byCategory: {...}, avgResolutionDays }
  - features: { total, byStatus: {...}, topVoted: [...] }
  - activity: { lastWeek: { newTesters, newBugs, newFeatures, resolved } }

## STEP 8: FIX ADAPTBOOKS COUNT SESSION ERROR

Now switch to the AdaptBooks codebase at C:\Adaptensor\adaptbooks.

The error: api.adaptbooks.io/api/count/sessions returns 404.

Investigate:
1. Find where the frontend calls this endpoint: search packages/web for "count/sessions"
2. Options:
   a. If it's a visitor counter: create a simple API route in packages/api/src/routes/ that returns a session count or creates a session record.
   b. If it's not needed: remove the frontend call.
3. The error occurs in page-*.js, likely in the main dashboard or landing page.

Look at the error trace:
- layout-*.js has error handler at position 739
- page-*.js calls at position 5478 (eo function = fetch count) and 5859 (eu function = create count)
- These are likely visitor analytics — a simple count of page visits.

Fix approach (simplest):
- Add a beta_page_views or site_sessions table (or just use the existing beta_platform_metrics table)
- Create GET /api/count/sessions (returns count) and POST /api/count/sessions (increments)
- OR simply remove the call from the frontend if it's not essential

After fixing, build AdaptBooks:
cd /c/Adaptensor/adaptbooks
pnpm -r run build
git add -f packages/web/app/ packages/api/src/
git commit -m "fix: count sessions endpoint + beta portal reference"
git push origin main

## STEP 9: Seed Sample Beta Data

Create a seed script at prisma/seed.ts or an admin endpoint POST /api/admin/seed:

Seed:
- 5-10 sample bug reports at various statuses (submitted, investigating, fixed, etc.)
- 3-5 sample feature requests with varying vote counts
- 2-3 sample comments on the reports
- Session prompts (from Step 7 of Session BETA-3)
- Announcements (from Step 8 of Session BETA-3)
- Jamie's account as an active beta tester + admin

## STEP 10: Final Build, Test, Deploy

1. Beta portal:
   cd /c/Adaptensor/beta
   pnpm run build — zero errors
   git add .
   git commit -m "feat: admin panel + seed data + polish"
   git push origin main

2. AdaptBooks (if count/sessions was fixed):
   cd /c/Adaptensor/adaptbooks
   pnpm -r run build — zero errors
   git add -f packages/web/app/ packages/api/src/
   git commit -m "fix: count sessions 404"
   git push origin main

## FINAL CHECKLIST

### Public
- [ ] Landing page loads at beta.adaptensor.io with all sections
- [ ] Registration form works, creates DB record
- [ ] Status page shows module grid
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
- [ ] Comments work on both issue types
- [ ] Voting works on features
- [ ] My Reports shows user's submissions
- [ ] Session Prompts page lists all prompts with copy/download
- [ ] Announcements feed renders

### Admin
- [ ] Admin dashboard shows stats
- [ ] Approve/suspend testers works
- [ ] Change issue status works
- [ ] CRUD session prompts works
- [ ] CRUD announcements works
- [ ] Non-admin users cannot access /admin

### AdaptBooks
- [ ] count/sessions 404 error resolved
- [ ] All 4 packages build clean
- [ ] No regressions on existing functionality

### Deployment
- [ ] beta.adaptensor.io resolves and loads
- [ ] SSL certificate active
- [ ] All env vars set in Vercel
- [ ] 9 beta_ tables in Neon alongside 113 existing tables
```

---

## QUICK REFERENCE

| What | Where |
|------|-------|
| Beta repo | `C:\Adaptensor\beta` |
| AdaptBooks repo | `C:\Adaptensor\adaptbooks` |
| Env vars | `C:\Adaptensor\env_vars_jamie.txt` |
| Neon project | `curly-sunset-11482413` |
| Database | Same connection string as AdaptBooks |
| Clerk | Same keys as AdaptBooks (*.adaptensor.io SSO) |
| GitHub | `adaptensor/beta-portal` |
| Domain | `beta.adaptensor.io` (Vercel) |
| Logo | Copy `logoA.svg` from AdaptBooks `packages/web/public/` |

---

*Adaptensor, Inc. | Built with purpose. Built to last. Built to fly.*
