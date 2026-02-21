import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import {
  SEVERITY_COLORS,
  BUG_STATUS_COLORS,
  FEATURE_STATUS_COLORS,
} from "@/lib/constants";

export default async function MyReportsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  try {
    const tester = await prisma.betaTester.findUnique({
      where: { clerkUserId: userId },
    });
    if (!tester) redirect("/register");

    const [bugs, features] = await Promise.all([
      prisma.betaBugReport.findMany({
        where: { testerId: tester.id },
        orderBy: { createdAt: "desc" },
      }),
      prisma.betaFeatureRequest.findMany({
        where: { testerId: tester.id },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const totalSubmitted = bugs.length + features.length;
    const openBugs = bugs.filter((b) =>
      ["submitted", "confirmed", "investigating", "in-progress"].includes(b.status)
    ).length;
    const openFeatures = features.filter((f) =>
      ["submitted", "under-review", "planned", "in-progress"].includes(f.status)
    ).length;
    const resolved = bugs.filter((b) => b.status === "fixed").length +
      features.filter((f) => f.status === "shipped").length;

    const stats = [
      { label: "Total Submitted", value: totalSubmitted, color: "text-brand-cyan" },
      { label: "Open", value: openBugs + openFeatures, color: "text-brand-yellow" },
      { label: "Resolved", value: resolved, color: "text-emerald-400" },
    ];

    return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">My Reports</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-brand-card border border-brand-border rounded-xl p-5"
          >
            <p className={`text-3xl font-bold font-mono ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-sm text-zinc-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Bug Reports */}
      <div className="bg-brand-card border border-brand-border rounded-xl">
        <div className="p-5 border-b border-brand-border flex items-center justify-between">
          <h2 className="text-white font-semibold">
            My Bug Reports ({bugs.length})
          </h2>
          <Link
            href="/portal/bugs/new"
            className="text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            + Report Bug
          </Link>
        </div>
        {bugs.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            You haven&apos;t reported any bugs yet.
          </div>
        ) : (
          <div className="divide-y divide-brand-border">
            {bugs.map((bug) => (
              <Link
                key={bug.id}
                href={`/portal/bugs/${bug.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-xs font-mono font-bold text-brand-cyan w-16 shrink-0">
                  {bug.reportNumber}
                </span>
                <span className="flex-1 text-sm text-white truncate">
                  {bug.title}
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    SEVERITY_COLORS[bug.severity] || ""
                  }`}
                >
                  {bug.severity}
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    BUG_STATUS_COLORS[bug.status] || ""
                  }`}
                >
                  {bug.status}
                </span>
                <span className="text-xs text-zinc-600 whitespace-nowrap hidden sm:inline">
                  {formatDate(bug.createdAt)}
                </span>
                <span className="text-xs text-zinc-600 whitespace-nowrap hidden lg:inline">
                  Updated {formatRelativeTime(bug.updatedAt)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Feature Requests */}
      <div className="bg-brand-card border border-brand-border rounded-xl">
        <div className="p-5 border-b border-brand-border flex items-center justify-between">
          <h2 className="text-white font-semibold">
            My Feature Requests ({features.length})
          </h2>
          <Link
            href="/portal/features/new"
            className="text-sm text-brand-yellow hover:text-brand-yellow/80 transition-colors"
          >
            + Request Feature
          </Link>
        </div>
        {features.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-sm">
            You haven&apos;t requested any features yet.
          </div>
        ) : (
          <div className="divide-y divide-brand-border">
            {features.map((feature) => (
              <Link
                key={feature.id}
                href={`/portal/features/${feature.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-xs font-mono font-bold text-brand-yellow w-16 shrink-0">
                  {feature.requestNumber}
                </span>
                <span className="flex-1 text-sm text-white truncate">
                  {feature.title}
                </span>
                <span className="text-xs font-mono text-zinc-500">
                  {feature.voteCount} votes
                </span>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    FEATURE_STATUS_COLORS[feature.status] || ""
                  }`}
                >
                  {feature.status}
                </span>
                <span className="text-xs text-zinc-600 whitespace-nowrap hidden sm:inline">
                  {formatDate(feature.createdAt)}
                </span>
                <span className="text-xs text-zinc-600 whitespace-nowrap hidden lg:inline">
                  Updated {formatRelativeTime(feature.updatedAt)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    );
  } catch (error) {
    console.error("[My Reports] Database error:", error);
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Unable to load reports</h2>
          <p className="text-gray-400 mb-4">
            We&apos;re having trouble loading your reports. Please try again in a moment.
          </p>
          <a href="/portal/my-reports" className="inline-block px-4 py-2 bg-yellow-500 text-black rounded font-medium hover:bg-yellow-400 transition-colors">
            Try Again
          </a>
        </div>
      </div>
    );
  }
}
