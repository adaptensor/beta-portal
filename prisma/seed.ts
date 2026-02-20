import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding beta portal data...");

  // ═══════════════════════════════════════
  // SESSION PROMPTS
  // ═══════════════════════════════════════

  const prompts = [
    {
      phase: "AV-1",
      title: "Aircraft Registry & Component Tracking",
      description:
        "Build the aircraft registry system with FAA N-number lookup, component tracking, and AD/SB compliance linkage.",
      estimatedTime: "2-3 hours",
      prerequisites: null,
      sortOrder: 1,
      promptContent: `You are building the Aircraft Registry & Component Tracking module for AdaptAero Aviation MRO Platform.

## Overview
This session builds the core aircraft registry — the foundation every other module depends on. An aircraft record includes FAA registration data (N-number, serial, type certificate), airworthiness info, engine/prop/avionics components, and compliance tracking hooks.

## Key Features
- Aircraft CRUD with N-number uniqueness per organization
- Component tree (airframe → engines → props → avionics)
- AD/SB applicability linking
- Import from FAA registry CSV
- Search and filtering by type, status, base location

## Models
Aircraft, AircraftComponent, AircraftDocument, ComponentHistory

## API Endpoints
- POST /api/aviation/aircraft — Create aircraft
- GET /api/aviation/aircraft — List with filters
- GET /api/aviation/aircraft/:id — Detail with components
- PATCH /api/aviation/aircraft/:id — Update
- POST /api/aviation/aircraft/:id/components — Add component

Session prompt content will be populated with full build instructions from the AdaptAero build plan.`,
    },
    {
      phase: "AV-2",
      title: "Aviation Work Orders & Squawk Management",
      description:
        "Implement work order lifecycle from squawk creation through inspection, approval, parts ordering, labor tracking, and signoff.",
      estimatedTime: "2-3 hours",
      prerequisites: "AV-1",
      sortOrder: 2,
      promptContent: `You are building the Work Order & Squawk Management module for AdaptAero.

## Overview
Work orders are the bread and butter of any MRO shop. This module handles the full lifecycle: squawk entry → work order creation → task assignment → parts requisition → labor tracking → inspection → signoff → invoicing hook.

## Key Features
- Squawk intake with severity classification
- Work order templates (Annual, 100-hour, Phase, AOG)
- Task breakdown with estimated vs actual hours
- Parts requisition linked to inventory
- Digital signoff with A&P/IA authorization
- Work order status board (Kanban view)

## Models
WorkOrder, WorkOrderTask, Squawk, LaborEntry, WorkOrderApproval

Session prompt content will be populated with full build instructions from the AdaptAero build plan.`,
    },
    {
      phase: "AV-3",
      title: "FAA Compliance Engine (AD/SB Tracking)",
      description:
        "Build the compliance engine for tracking Airworthiness Directives, Service Bulletins, and recurring inspections.",
      estimatedTime: "2-3 hours",
      prerequisites: "AV-1",
      sortOrder: 3,
      promptContent: `You are building the FAA Compliance Engine for AdaptAero.

## Overview
Compliance is non-negotiable in aviation. This module tracks ADs (mandatory), SBs (recommended), and recurring inspections with automatic due-date calculations based on flight hours, calendar time, and cycles.

## Key Features
- AD/SB database with applicability matching
- Recurring inspection schedules (Annual, 100-hr, Phase)
- Compliance status dashboard (compliant/due soon/overdue)
- Automatic alerts for upcoming compliance items
- Integration with FAA AD database feeds

## Models
ComplianceItem, ComplianceSchedule, ComplianceRecord, ComplianceAlert

Session prompt content will be populated with full build instructions from the AdaptAero build plan.`,
    },
    {
      phase: "AV-4",
      title: "Parts Traceability & 8130-3 Tags",
      description:
        "Implement parts inventory with full traceability, FAA 8130-3 tag generation, and vendor management.",
      estimatedTime: "2-3 hours",
      prerequisites: "AV-1, AV-2",
      sortOrder: 4,
      promptContent: `You are building the Parts Traceability & 8130-3 Tags module for AdaptAero.

## Overview
Every part on an aircraft must be traceable. This module manages parts inventory with batch/serial tracking, condition codes (new/overhauled/serviceable/etc.), vendor management, and FAA 8130-3 Authorized Release Certificate generation.

## Key Features
- Parts inventory with condition tracking
- 8130-3 tag generation (PDF)
- Vendor/supplier management
- Purchase order integration
- Core return tracking
- Minimum stock alerts

## Models
Part, PartInventory, PartTransaction, Vendor, PurchaseOrder, Tag8130

Session prompt content will be populated with full build instructions from the AdaptAero build plan.`,
    },
    {
      phase: "AV-5",
      title: "FAA Form Generation (337 & More)",
      description:
        "Build the form generation system for FAA Form 337 (Major Repair/Alteration) and other regulatory documents.",
      estimatedTime: "2-3 hours",
      prerequisites: "AV-1, AV-2, AV-3",
      sortOrder: 5,
      promptContent: `You are building the FAA Form Generation module for AdaptAero.

## Overview
FAA Form 337 is required for any major repair or alteration. This module generates compliant 337s from work order data, with proper formatting, digital signatures, and PDF export. Also handles weight & balance forms and other regulatory documents.

## Key Features
- FAA Form 337 generation from work order data
- Digital signature capture
- PDF export with proper FAA formatting
- Form history and versioning
- Weight & balance calculations

## Models
FAAForm, FormSignature, FormRevision

Session prompt content will be populated with full build instructions from the AdaptAero build plan.`,
    },
    {
      phase: "AV-6",
      title: "Personnel & Tool Calibration Tracking",
      description:
        "Build personnel management with certificate tracking and tool/equipment calibration scheduling.",
      estimatedTime: "1-2 hours",
      prerequisites: "AV-1",
      sortOrder: 6,
      promptContent: `You are building the Personnel & Tool Calibration module for AdaptAero.

## Overview
Track your mechanics' certifications (A&P, IA, specialized ratings) and manage tool calibration schedules. FAA requires proof that the person signing off work holds valid certificates and that measurement tools are within calibration.

## Key Features
- Personnel profiles with certificate tracking
- A&P and IA certificate expiration alerts
- Tool inventory with calibration schedules
- Calibration due date alerts
- Training record management

## Models
Personnel, Certificate, Tool, CalibrationRecord, TrainingRecord

Session prompt content will be populated with full build instructions from the AdaptAero build plan.`,
    },
    {
      phase: "AV-7",
      title: "Aviation Reporting & AdaptGent AI",
      description:
        "Build the reporting dashboard and integrate AdaptGent AI assistant for aviation-specific queries and analysis.",
      estimatedTime: "2-3 hours",
      prerequisites: "AV-1 through AV-6",
      sortOrder: 7,
      promptContent: `You are building the Reporting & AdaptGent AI module for AdaptAero.

## Overview
Comprehensive reporting dashboard with pre-built aviation reports (fleet status, compliance overview, labor utilization, parts consumption) plus AdaptGent — an AI assistant trained on aviation MRO context that can answer questions about your fleet, compliance status, and operational metrics.

## Key Features
- Fleet status dashboard
- Compliance overview reports
- Labor utilization analytics
- Parts consumption trends
- AdaptGent AI chat interface
- Natural language queries over your data

## Reports
FleetStatus, ComplianceOverview, LaborUtilization, PartsConsumption, RevenueByAircraft

Session prompt content will be populated with full build instructions from the AdaptAero build plan.`,
    },
    {
      phase: "AV-8",
      title: "Polish, Testing & Launch Prep",
      description:
        "Final polish pass — responsive design, error handling, loading states, SEO, performance optimization, and launch preparation.",
      estimatedTime: "2-3 hours",
      prerequisites: "AV-1 through AV-7",
      sortOrder: 8,
      promptContent: `You are doing the final polish pass on AdaptAero.

## Overview
This session focuses on production readiness: responsive design verification, error boundaries, loading skeletons, SEO metadata, performance optimization (lazy loading, image optimization), accessibility audit, and deployment configuration.

## Key Areas
- Responsive design audit (mobile, tablet, desktop)
- Error boundaries and fallback UI
- Loading skeletons for all data-fetching pages
- SEO metadata and Open Graph tags
- Performance optimization
- Accessibility (ARIA labels, keyboard navigation)
- Environment variable validation
- Deployment checklist

Session prompt content will be populated with full build instructions from the AdaptAero build plan.`,
    },
    {
      phase: "AV-9",
      title: "Financial Authorization & Draw System",
      description:
        "Build the financial authorization system with work order draw approvals, customer deposits, and payment tracking.",
      estimatedTime: "2-3 hours",
      prerequisites: "AV-2, AV-4",
      sortOrder: 9,
      promptContent: `You are building the Financial Authorization & Draw System for AdaptAero.

## Overview
Aviation MRO work often involves progressive billing (draws) as work proceeds. This module handles customer authorization for work scopes, deposit collection, progress billing, and final invoicing — all tied to work orders and parts usage.

## Key Features
- Customer work authorization forms
- Deposit collection and tracking
- Progressive draw requests
- Customer approval workflow
- Final invoice generation
- Payment tracking and aging

## Models
Authorization, Deposit, DrawRequest, Invoice, Payment

Session prompt content will be populated with full build instructions from the AdaptAero build plan.`,
    },
    {
      phase: "BETA-1",
      title: "Beta Portal Scaffold + Landing + Registration",
      description:
        "Initialize the standalone beta testing portal with Next.js 14, Prisma schema, landing page, registration form, and public status page.",
      estimatedTime: "2 hours",
      prerequisites: null,
      sortOrder: 10,
      promptContent: `You are building a standalone Next.js 14 beta testing portal for Adaptensor's AdaptAero Aviation MRO platform. The portal lives at beta.adaptensor.io.

## What Gets Built
- Project scaffold (Next.js 14 + Tailwind + Clerk + Prisma)
- 9 Prisma models (all beta_ prefixed)
- Database push to Neon PostgreSQL
- Landing page with hero, problem statement, modules grid, stats, benefits
- Registration form for beta testers
- Public status page with module progress
- Brand tokens: Yellow #F4D225, Cyan #06B6D4, Black #060505

## Critical Rules
- git push origin main only (Vercel auto-deploys)
- Same Neon DB as AdaptBooks — beta_ prefix on all tables
- pnpm run build must pass zero errors

Session prompt content will be populated with full build instructions from the beta portal build plan.`,
    },
    {
      phase: "BETA-2",
      title: "Auth + Portal Core (Dashboard, Bug/Feature Forms)",
      description:
        "Integrate Clerk SSO, build the portal layout with sidebar, dashboard page, bug report form with screenshot upload, and feature request form.",
      estimatedTime: "2 hours",
      prerequisites: "BETA-1",
      sortOrder: 11,
      promptContent: `You are continuing the beta.adaptensor.io build. Session BETA-1 is complete.

## What Gets Built
- Clerk sign-in/sign-up pages
- Portal layout with auth guard (4 states: not registered, pending, suspended, active)
- Sidebar navigation with 7 links
- Dashboard with real stats, recent activity, announcements preview
- Bug report form with screenshot upload to Vercel Blob
- Feature request form
- Bug detail page with attachments
- Feature detail page with voting
- File upload API (Vercel Blob, 10MB max)

## Key Patterns
- Server components for data fetching
- Client components for interactivity
- Auth check: Clerk userId → BetaTester lookup → status validation

Session prompt content will be populated with full build instructions from the beta portal build plan.`,
    },
    {
      phase: "BETA-3",
      title: "Tracker + Comments + Prompts + Announcements",
      description:
        "Build the issue tracker with filtering/sorting, comment threads with admin styling, session prompts browser, my-reports page, and announcements feed.",
      estimatedTime: "2 hours",
      prerequisites: "BETA-1, BETA-2",
      sortOrder: 12,
      promptContent: `You are continuing the beta.adaptensor.io build. Sessions BETA-1 and BETA-2 are complete.

## What Gets Built
- Issue tracker combining bugs + features with tab toggle, filters, sorting, search, pagination
- Comment system API (POST + GET) with admin detection
- CommentThread component with gold/yellow admin styling and ADMIN badge
- My Reports page showing current user's submissions
- Session Prompts browser grouped by phase
- Prompt detail page with copy-to-clipboard and download-as-markdown
- Announcements feed with pinned items and type badges
- Seed data for prompts and announcements

## Key Patterns
- Client components for interactive tracker
- Server components for data-heavy pages
- Admin comment detection via ADMIN_USER_IDS env var

Session prompt content will be populated with full build instructions from the beta portal build plan.`,
    },
    {
      phase: "BETA-4",
      title: "Admin Panel + Polish + Deploy",
      description:
        "Build the admin dashboard, tester management, issue management, prompt CRUD, announcement CRUD, seed sample data, and final deployment.",
      estimatedTime: "1-2 hours",
      prerequisites: "BETA-1, BETA-2, BETA-3",
      sortOrder: 13,
      promptContent: `You are finishing the beta.adaptensor.io build. Sessions BETA-1, 2, 3 are complete.

## What Gets Built
- Admin layout with admin-only access check
- Admin dashboard with summary stats and recent registrations
- Tester management (approve, suspend, delete, search, filter)
- Issue management (change status, assign, bulk actions)
- Session prompt CRUD (create, edit, delete, reorder)
- Announcement CRUD (create, edit, delete, pin)
- Analytics API (aggregated stats)
- Seed sample beta data
- Final build verification and deployment

## Critical Rules
- Admin check: userId in ADMIN_USER_IDS env var
- Non-admin users redirected to /portal
- pnpm run build must pass zero errors before commit

Session prompt content will be populated with full build instructions from the beta portal build plan.`,
    },
  ];

  for (const prompt of prompts) {
    await prisma.betaSessionPrompt.upsert({
      where: {
        id: `seed-${prompt.phase.toLowerCase()}`,
      },
      update: {
        ...prompt,
      },
      create: {
        id: `seed-${prompt.phase.toLowerCase()}`,
        ...prompt,
      },
    });
  }
  console.log(`  Seeded ${prompts.length} session prompts`);

  // ═══════════════════════════════════════
  // ANNOUNCEMENTS
  // ═══════════════════════════════════════

  const announcements = [
    {
      id: "seed-announce-1",
      title: "AdaptAero Beta v0.9.2 Released",
      type: "release",
      version: "v0.9.2",
      isPinned: true,
      content: `We're excited to announce AdaptAero Beta v0.9.2 — our most comprehensive release yet.

What's included:
- 145+ Prisma models across all aviation MRO modules
- 309 API endpoints covering the full MRO workflow
- 57 pages including dashboards, forms, and reports
- All 8 core build phases (AV-1 through AV-8) complete
- Built-in double-entry accounting (GL, AP, AR, payroll)
- FAA Form 337 generation
- 8130-3 parts traceability
- AdaptGent AI assistant for aviation queries

This is a fully functional aviation MRO + accounting platform. Your feedback during beta testing will directly shape the GA release.`,
      publishedAt: new Date("2026-02-18T10:00:00Z"),
    },
    {
      id: "seed-announce-2",
      title: "Beta Testing Portal Launch",
      type: "update",
      version: null,
      isPinned: true,
      content: `Welcome to the AdaptAero Beta Testing Portal!

This portal is your command center for beta testing. Here's what you can do:
- Report Bugs: Found something broken? Submit a detailed bug report with screenshots.
- Request Features: Have an idea that would make your shop run better? Tell us.
- Track Issues: See all reported bugs and feature requests, filter and sort them.
- Vote on Features: Upvote the features you want to see prioritized.
- Download Session Prompts: Browse the Claude Code prompts used to build AdaptAero.
- Stay Updated: Follow announcements for releases and updates.

Your feedback is invaluable. Every bug report and feature request helps us build the MRO platform that aviation professionals actually need.`,
      publishedAt: new Date("2026-02-20T08:00:00Z"),
    },
    {
      id: "seed-announce-3",
      title: "Customer Portal (Owner-Facing) Coming Soon",
      type: "update",
      version: "v0.9.3",
      isPinned: false,
      content: `We're currently building the Customer Portal — a dedicated interface for aircraft owners to:
- View work order status and progress
- Approve work scopes and authorize draws
- Download completed forms and invoices
- Communicate with the shop directly

This module is currently at 80% completion and is in active beta testing. If you're an aircraft owner or operator, we'd especially love your feedback on what features matter most to you.

Expected in the next release cycle.`,
      publishedAt: new Date("2026-02-19T14:00:00Z"),
    },
    {
      id: "seed-announce-4",
      title: "Scheduled Maintenance Window",
      type: "maintenance",
      version: null,
      isPinned: false,
      content: `We'll be performing database maintenance on Saturday, February 22 from 2:00 AM - 4:00 AM EST. The beta portal and aviation platform may experience brief intermittent downtime during this window.

No data will be lost. All submitted bug reports and feature requests are safely backed up.`,
      publishedAt: new Date("2026-02-20T16:00:00Z"),
    },
  ];

  for (const announcement of announcements) {
    await prisma.betaAnnouncement.upsert({
      where: { id: announcement.id },
      update: {
        title: announcement.title,
        type: announcement.type,
        version: announcement.version,
        isPinned: announcement.isPinned,
        content: announcement.content,
        publishedAt: announcement.publishedAt,
      },
      create: announcement,
    });
  }
  console.log(`  Seeded ${announcements.length} announcements`);

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
