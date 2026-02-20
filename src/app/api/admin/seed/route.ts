import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isAdmin } from "@/lib/auth";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    requireAdmin(userId);

    const results: string[] = [];

    // Get the first admin user ID from env
    const adminIds = (process.env.ADMIN_USER_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);
    const adminClerkId = adminIds[0] || userId;

    // 1. Create Jamie's admin account if not exists
    let adminTester = await prisma.betaTester.findFirst({
      where: { clerkUserId: adminClerkId },
    });

    if (!adminTester) {
      adminTester = await prisma.betaTester.create({
        data: {
          clerkUserId: adminClerkId,
          name: "Jamie",
          email: "jamie@adaptensor.io",
          company: "Adaptensor, Inc.",
          role: "Shop Owner / Manager",
          interestedProducts: "AdaptBooks,AdaptAero,AdaptVault",
          status: "active",
          agreedToTerms: true,
          approvedAt: new Date(),
          lastActiveAt: new Date(),
        },
      });
      results.push("Created admin tester account");
    } else {
      // Make sure status is active
      if (adminTester.status !== "active") {
        await prisma.betaTester.update({
          where: { id: adminTester.id },
          data: { status: "active" },
        });
      }
      results.push("Admin tester account already exists");
    }

    // 2. Seed bug reports if empty
    const bugCount = await prisma.betaBugReport.count();
    if (bugCount === 0) {
      const bugs = [
        {
          reportNumber: "BUG-001",
          testerId: adminTester.id,
          title: "AD compliance date shows wrong timezone",
          category: "Aero: Compliance Engine",
          severity: "medium",
          status: "fixed",
          stepsToReproduce: "1. Create an AD compliance entry\n2. Set due date to March 15\n3. View in dashboard\n4. Date shows March 14 in Pacific timezone",
          expectedBehavior: "Date should display in the shop's configured timezone",
          actualBehavior: "Date displays in UTC, causing off-by-one day errors for users west of GMT",
          resolution: "Timezone now uses shop's configured timezone instead of UTC",
          fixedInVersion: "v0.9.3",
          resolvedAt: new Date(),
        },
        {
          reportNumber: "BUG-002",
          testerId: adminTester.id,
          title: "Parts POS receipt missing 8130-3 reference",
          category: "Aero: Parts Traceability",
          severity: "high",
          status: "investigating",
          stepsToReproduce: "1. Sell a part with 8130-3 tag at POS\n2. Print receipt\n3. Check receipt for 8130-3 reference",
          expectedBehavior: "Receipt should include 8130-3 tag number for traceability",
          actualBehavior: "Receipt shows part number and description but no 8130-3 reference",
        },
        {
          reportNumber: "BUG-003",
          testerId: adminTester.id,
          title: "Invoice PDF cuts off last line item on page break",
          category: "Books: Accounting / GL",
          severity: "medium",
          status: "submitted",
          stepsToReproduce: "1. Create an invoice with 20+ line items\n2. Generate PDF\n3. Check page break area",
          expectedBehavior: "All line items should be fully visible across page breaks",
          actualBehavior: "The last line item before a page break gets partially cut off",
        },
        {
          reportNumber: "BUG-004",
          testerId: adminTester.id,
          title: "Work order status stuck on Awaiting Parts after parts received",
          category: "Aero: Work Orders",
          severity: "high",
          status: "in-progress",
          stepsToReproduce: "1. Create work order with parts requirement\n2. Order parts\n3. Receive parts in inventory\n4. Check work order status",
          expectedBehavior: "Work order status should update to 'Ready for Work' after parts received",
          actualBehavior: "Status remains 'Awaiting Parts' even after inventory shows parts received",
        },
        {
          reportNumber: "BUG-005",
          testerId: adminTester.id,
          title: "Dashboard load time over 5 seconds with 50+ aircraft",
          category: "Platform: Performance",
          severity: "medium",
          status: "confirmed",
          stepsToReproduce: "1. Add 50+ aircraft to registry\n2. Navigate to main dashboard\n3. Observe load time",
          expectedBehavior: "Dashboard should load within 2 seconds regardless of fleet size",
          actualBehavior: "Dashboard takes 5-8 seconds to load with 50+ aircraft due to unoptimized queries",
        },
      ];

      for (const bug of bugs) {
        await prisma.betaBugReport.create({ data: bug });
      }
      results.push(`Seeded ${bugs.length} bug reports`);
    } else {
      results.push(`Bug reports already exist (${bugCount} found)`);
    }

    // 3. Seed feature requests if empty
    const featureCount = await prisma.betaFeatureRequest.count();
    if (featureCount === 0) {
      const features = [
        {
          requestNumber: "FR-001",
          testerId: adminTester.id,
          title: "Bulk import ADs from CSV for fleet operators",
          category: "Aero: Compliance Engine",
          priority: "high",
          status: "planned",
          description: "Fleet operators managing 20+ aircraft need a way to bulk import Airworthiness Directives from a CSV file rather than entering each one manually.",
          useCase: "A regional airline with 35 aircraft needs to import 200+ ADs when onboarding. Currently this takes days of manual entry.",
          voteCount: 8,
        },
        {
          requestNumber: "FR-002",
          testerId: adminTester.id,
          title: "QuickBooks Online auto-sync",
          category: "Books: Accounting / GL",
          priority: "critical",
          status: "under-review",
          description: "Two-way sync between AdaptBooks and QuickBooks Online for shops that want to keep using QBO for tax preparation while using AdaptBooks for day-to-day operations.",
          useCase: "Our accountant uses QuickBooks for taxes. We need transactions to flow from AdaptBooks to QBO automatically.",
          voteCount: 12,
        },
        {
          requestNumber: "FR-003",
          testerId: adminTester.id,
          title: "Photo annotation on work order squawk images",
          category: "Aero: Work Orders",
          priority: "medium",
          status: "submitted",
          description: "Allow mechanics to draw arrows, circles, and text annotations on photos attached to work order squawks to highlight specific areas of concern.",
          useCase: "When documenting corrosion or damage, mechanics want to circle the affected area and add a note directly on the photo.",
          voteCount: 5,
        },
        {
          requestNumber: "FR-004",
          testerId: adminTester.id,
          title: "Document expiration alerts for insurance certs",
          category: "Vault: Document Upload",
          priority: "medium",
          status: "submitted",
          description: "Set expiration dates on uploaded documents (insurance certificates, licenses) and receive email/dashboard alerts when they're about to expire.",
          useCase: "Shop manager needs to track insurance certificate expirations for 15 subcontractors without manually checking each one.",
          voteCount: 3,
        },
      ];

      for (const feature of features) {
        await prisma.betaFeatureRequest.create({ data: feature });
      }
      results.push(`Seeded ${features.length} feature requests`);
    } else {
      results.push(`Feature requests already exist (${featureCount} found)`);
    }

    // 4. Seed comments if empty
    const commentCount = await prisma.betaComment.count();
    if (commentCount === 0) {
      const bug1 = await prisma.betaBugReport.findFirst({ where: { reportNumber: "BUG-001" } });
      const bug2 = await prisma.betaBugReport.findFirst({ where: { reportNumber: "BUG-002" } });
      const fr2 = await prisma.betaFeatureRequest.findFirst({ where: { requestNumber: "FR-002" } });

      const comments = [];

      if (bug1) {
        comments.push({
          bugReportId: bug1.id,
          testerId: adminTester.id,
          authorName: "Jamie (Admin)",
          isAdmin: true,
          content: "Fixed in v0.9.3. Please verify on your end.",
        });
      }

      if (bug2) {
        comments.push({
          bugReportId: bug2.id,
          testerId: adminTester.id,
          authorName: adminTester.name,
          isAdmin: false,
          content: "I can reproduce this on Chrome 122. The 8130-3 tag number shows on the work order but not on the POS receipt.",
        });
      }

      if (fr2) {
        comments.push({
          featureRequestId: fr2.id,
          testerId: adminTester.id,
          authorName: "Jamie (Admin)",
          isAdmin: true,
          content: "This is our most-requested feature. Scoping the integration now.",
        });
      }

      for (const comment of comments) {
        await prisma.betaComment.create({ data: comment });
      }
      results.push(`Seeded ${comments.length} comments`);
    } else {
      results.push(`Comments already exist (${commentCount} found)`);
    }

    // 5. Seed announcements if empty
    const annCount = await prisma.betaAnnouncement.count();
    if (annCount === 0) {
      const announcements = [
        {
          title: "Adaptensor Beta v0.9.2 Released",
          type: "release",
          version: "v0.9.2",
          isPinned: true,
          content: "All 8 core AdaptAero phases complete. 145+ data models, 309 API endpoints, 57 pages. Full accounting integration with aviation MRO. AdaptBooks POS and GL live. AdaptVault in beta.",
        },
        {
          title: "Beta Testing Portal Launch",
          type: "update",
          content: "The beta testing portal is live at beta.adaptensor.io. Submit bug reports, request features, vote on what matters to you, and track issue progress. Your feedback directly shapes our roadmap.",
        },
        {
          title: "Multi-Product Beta Now Open",
          type: "update",
          content: "Beta testing now covers all three Adaptensor products: AdaptBooks (POS + Accounting), AdaptAero (Aviation MRO), and AdaptVault (Document Management). Test everything, report everything.",
        },
        {
          title: "Scheduled Database Maintenance",
          type: "maintenance",
          content: "Brief maintenance window planned for this weekend. You may experience intermittent slowness for 10-15 minutes. No data will be affected.",
        },
      ];

      for (const ann of announcements) {
        await prisma.betaAnnouncement.create({ data: ann });
      }
      results.push(`Seeded ${announcements.length} announcements`);
    } else {
      results.push(`Announcements already exist (${annCount} found)`);
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Seed error:", error);
    const message = error instanceof Error ? error.message : "Failed to seed data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
