import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRelativeTime } from "@/lib/utils";
import {
  SEVERITY_COLORS,
  BUG_STATUS_COLORS,
  FEATURE_STATUS_COLORS,
} from "@/lib/constants";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  try {
    const tester = await prisma.betaTester.findUnique({
      where: { clerkUserId: userId },
    });
    if (!tester) redirect("/register");

    // Fetch stats
    const [myBugs, myFeatures, openBugs, openFeatures, fixedThisWeek, myVotes] =
      await Promise.all([
        prisma.betaBugReport.count({ where: { testerId: tester.id } }),
        prisma.betaFeatureRequest.count({ where: { testerId: tester.id } }),
        prisma.betaBugReport.count({
          where: {
            status: {
              in: ["submitted", "confirmed", "investigating", "in-progress"],
            },
          },
        }),
        prisma.betaFeatureRequest.count({
          where: {
            status: { in: ["submitted", "under-review", "planned", "in-progress"] },
          },
        }),
        prisma.betaBugReport.count({
          where: {
            status: "fixed",
            resolvedAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
        }),
        prisma.betaVote.count({ where: { testerId: tester.id } }),
      ]);

    // Recent activity (last 5 items combined)
    const [recentBugs, recentFeatures] = await Promise.all([
      prisma.betaBugReport.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { tester: { select: { name: true } } },
      }),
      prisma.betaFeatureRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { tester: { select: { name: true } } },
      }),
    ]);

    type ActivityItem = {
      type: "bug" | "feature";
      id: string;
      number: string;
      title: string;
      status: string;
      severity?: string;
      priority?: string;
      author: string;
      createdAt: Date;
    };

    const recentActivity: ActivityItem[] = [
      ...recentBugs.map((b) => ({
        type: "bug" as const,
        id: b.id,
        number: b.reportNumber,
        title: b.title,
        status: b.status,
        severity: b.severity,
        author: b.tester.name,
        createdAt: b.createdAt,
      })),
      ...recentFeatures.map((f) => ({
        type: "feature" as const,
        id: f.id,
        number: f.requestNumber,
        title: f.title,
        status: f.status,
        priority: f.priority,
        author: f.tester.name,
        createdAt: f.createdAt,
      })),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5);

    // Recent announcements
    const announcements = await prisma.betaAnnouncement.findMany({
      take: 2,
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
    });

    const stats = [
      {
        label: "Your Reports",
        value: myBugs + myFeatures,
        color: "text-brand-cyan",
      },
      {
        label: "Open Issues",
        value: openBugs + openFeatures,
        color: "text-brand-yellow",
      },
      { label: "Fixed This Week", value: fixedThisWeek, color: "text-emerald-400" },
      { label: "Votes Cast", value: myVotes, color: "text-purple-400" },
    ];

    return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-card to-brand-dark border border-brand-border rounded-xl p-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {tester.name.split(" ")[0]}
          </h1>
          <span className="text-xs font-mono bg-brand-cyan/20 text-brand-cyan px-2 py-1 rounded border border-brand-cyan/20">
            BETA TESTER
          </span>
        </div>
        <p className="text-zinc-400 mt-1">
          Help us build the future of business software. Report bugs, request
          features, and shape the platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/portal/bugs/new"
          className="group bg-brand-card border border-brand-border rounded-xl p-6 hover:border-red-500/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Report a Bug</h3>
              <p className="text-sm text-zinc-500">
                Found something broken? Let us know.
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/portal/features/new"
          className="group bg-brand-card border border-brand-border rounded-xl p-6 hover:border-brand-yellow/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center group-hover:bg-brand-yellow/20 transition-colors">
              <svg
                className="w-6 h-6 text-brand-yellow"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold">Request a Feature</h3>
              <p className="text-sm text-zinc-500">
                Have an idea? We want to hear it.
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-brand-card border border-brand-border rounded-xl">
        <div className="p-5 border-b border-brand-border flex items-center justify-between">
          <h2 className="text-white font-semibold">Recent Activity</h2>
          <Link
            href="/portal/tracker"
            className="text-sm text-brand-cyan hover:text-brand-cyan/80 transition-colors"
          >
            View All
          </Link>
        </div>
        {recentActivity.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            No activity yet. Be the first to report a bug or request a feature!
          </div>
        ) : (
          <div className="divide-y divide-brand-border">
            {recentActivity.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={`/portal/${item.type === "bug" ? "bugs" : "features"}/${item.id}`}
                className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors"
              >
                <span
                  className={`text-xs font-mono font-bold ${
                    item.type === "bug" ? "text-brand-cyan" : "text-brand-yellow"
                  }`}
                >
                  {item.number}
                </span>
                <span className="flex-1 text-sm text-white truncate">
                  {item.title}
                </span>
                {item.severity && (
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                      SEVERITY_COLORS[item.severity] || ""
                    }`}
                  >
                    {item.severity}
                  </span>
                )}
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    item.type === "bug"
                      ? BUG_STATUS_COLORS[item.status] || ""
                      : FEATURE_STATUS_COLORS[item.status] || ""
                  }`}
                >
                  {item.status}
                </span>
                <span className="text-xs text-zinc-600 whitespace-nowrap">
                  {item.author} &middot; {formatRelativeTime(item.createdAt)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Announcements Preview */}
      {announcements.length > 0 && (
        <div className="bg-brand-card border border-brand-border rounded-xl">
          <div className="p-5 border-b border-brand-border flex items-center justify-between">
            <h2 className="text-white font-semibold">Announcements</h2>
            <Link
              href="/portal/announcements"
              className="text-sm text-brand-cyan hover:text-brand-cyan/80 transition-colors"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-brand-border">
            {announcements.map((a) => (
              <div key={a.id} className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  {a.isPinned && (
                    <span className="text-brand-yellow text-xs">pinned</span>
                  )}
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                      a.type === "release"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : a.type === "breaking"
                          ? "bg-red-500/20 text-red-400 border-red-500/30"
                          : "bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30"
                    }`}
                  >
                    {a.type}
                  </span>
                  {a.version && (
                    <span className="text-xs font-mono text-zinc-500">
                      {a.version}
                    </span>
                  )}
                </div>
                <h3 className="text-white font-medium text-sm">{a.title}</h3>
                <p className="text-zinc-500 text-xs mt-1 line-clamp-2">
                  {a.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    );
  } catch (error) {
    console.error("[Portal Dashboard] Database error:", error);
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-8 max-w-md text-center">
          <h2 className="text-xl font-semibold text-red-400 mb-2">Unable to load dashboard</h2>
          <p className="text-gray-400 mb-4">
            We&apos;re having trouble loading this page. Please try again in a moment.
          </p>
          <a href="/portal" className="inline-block px-4 py-2 bg-yellow-500 text-black rounded font-medium hover:bg-yellow-400 transition-colors">
            Try Again
          </a>
        </div>
      </div>
    );
  }
}
