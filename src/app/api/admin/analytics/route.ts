import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    requireAdmin(userId);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const [
      allTesters,
      allBugs,
      allFeatures,
      newTestersThisWeek,
      newBugsThisWeek,
      newFeaturesThisWeek,
      resolvedThisWeek,
      topVotedFeatures,
    ] = await Promise.all([
      prisma.betaTester.findMany({
        select: {
          status: true,
          role: true,
          currentSoftware: true,
          interestedProducts: true,
        },
      }),
      prisma.betaBugReport.findMany({
        select: { status: true, severity: true, category: true, resolvedAt: true, createdAt: true },
      }),
      prisma.betaFeatureRequest.findMany({
        select: { status: true, category: true, voteCount: true },
      }),
      prisma.betaTester.count({ where: { registeredAt: { gte: oneWeekAgo } } }),
      prisma.betaBugReport.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      prisma.betaFeatureRequest.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      prisma.betaBugReport.count({ where: { resolvedAt: { gte: oneWeekAgo } } }),
      prisma.betaFeatureRequest.findMany({
        select: { id: true, title: true, voteCount: true, requestNumber: true },
        orderBy: { voteCount: "desc" },
        take: 5,
      }),
    ]);

    // Aggregate tester stats
    const testerStats = {
      total: allTesters.length,
      pending: allTesters.filter((t) => t.status === "pending").length,
      approved: allTesters.filter((t) => t.status === "approved").length,
      active: allTesters.filter((t) => t.status === "active").length,
      suspended: allTesters.filter((t) => t.status === "suspended").length,
      byRole: countBy(allTesters, "role"),
      byCurrentSoftware: countBy(allTesters, "currentSoftware"),
      byInterestedProducts: countProducts(allTesters),
    };

    // Aggregate bug stats
    const openStatuses = ["submitted", "confirmed", "investigating", "in-progress"];
    const fixedStatuses = ["fixed"];
    const closedStatuses = ["closed", "wont-fix", "duplicate"];

    const resolvedBugs = allBugs.filter((b) => b.resolvedAt);
    let avgResolutionDays = 0;
    if (resolvedBugs.length > 0) {
      const totalDays = resolvedBugs.reduce((sum, b) => {
        const diff = new Date(b.resolvedAt!).getTime() - new Date(b.createdAt).getTime();
        return sum + diff / (1000 * 60 * 60 * 24);
      }, 0);
      avgResolutionDays = Math.round((totalDays / resolvedBugs.length) * 10) / 10;
    }

    const bugStats = {
      total: allBugs.length,
      open: allBugs.filter((b) => openStatuses.includes(b.status)).length,
      fixed: allBugs.filter((b) => fixedStatuses.includes(b.status)).length,
      closed: allBugs.filter((b) => closedStatuses.includes(b.status)).length,
      bySeverity: countBy(allBugs, "severity"),
      byCategory: countBy(allBugs, "category"),
      avgResolutionDays,
    };

    // Aggregate feature stats
    const featureStats = {
      total: allFeatures.length,
      byStatus: countBy(allFeatures, "status"),
      topVoted: topVotedFeatures,
    };

    return NextResponse.json({
      testers: testerStats,
      bugs: bugStats,
      features: featureStats,
      activity: {
        lastWeek: {
          newTesters: newTestersThisWeek,
          newBugs: newBugsThisWeek,
          newFeatures: newFeaturesThisWeek,
          resolved: resolvedThisWeek,
        },
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch analytics";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

function countBy<T>(items: T[], key: keyof T): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const val = (item[key] as string) || "Unknown";
    counts[val] = (counts[val] || 0) + 1;
  }
  return counts;
}

function countProducts(testers: { interestedProducts: string | null }[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const t of testers) {
    if (!t.interestedProducts) continue;
    const products = t.interestedProducts.split(",").map((p) => p.trim());
    for (const p of products) {
      if (p) counts[p] = (counts[p] || 0) + 1;
    }
  }
  return counts;
}
