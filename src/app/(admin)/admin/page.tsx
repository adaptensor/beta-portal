"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Analytics {
  testers: {
    total: number;
    pending: number;
    approved: number;
    active: number;
    suspended: number;
  };
  bugs: {
    total: number;
    open: number;
    fixed: number;
    closed: number;
  };
  features: {
    total: number;
    byStatus: Record<string, number>;
  };
  activity: {
    lastWeek: {
      newTesters: number;
      newBugs: number;
      newFeatures: number;
      resolved: number;
    };
  };
}

interface PendingTester {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string;
  interestedProducts: string | null;
  registeredAt: string;
}

interface Issue {
  id: string;
  reportNumber?: string;
  requestNumber?: string;
  title: string;
  severity?: string;
  priority?: string;
  category: string;
  tester: { name: string };
  createdAt: string;
  voteCount?: number;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [pendingTesters, setPendingTesters] = useState<PendingTester[]>([]);
  const [criticalBugs, setCriticalBugs] = useState<Issue[]>([]);
  const [topFeatures, setTopFeatures] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setFetchError(null);
      const [analyticsRes, testersRes, bugsRes, featuresRes] = await Promise.all([
        fetch("/api/admin/analytics"),
        fetch("/api/admin/testers?status=pending"),
        fetch("/api/beta/bugs?severity=critical&status=submitted&limit=5"),
        fetch("/api/beta/features?limit=5"),
      ]);

      const failed: string[] = [];
      if (!analyticsRes.ok) failed.push(`analytics (${analyticsRes.status})`);
      if (!testersRes.ok) failed.push(`testers (${testersRes.status})`);
      if (!bugsRes.ok) failed.push(`bugs (${bugsRes.status})`);
      if (!featuresRes.ok) failed.push(`features (${featuresRes.status})`);

      if (failed.length > 0) {
        console.error("API errors:", failed.join(", "));
        setFetchError(`Failed to load: ${failed.join(", ")}`);
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
      }

      if (testersRes.ok) {
        const testersData = await testersRes.json();
        setPendingTesters((testersData.testers || []).slice(0, 10));
      }

      if (bugsRes.ok) {
        const bugsData = await bugsRes.json();
        const highBugs = (bugsData.bugs || []).filter(
          (b: Issue & { severity: string; status: string }) =>
            (b.severity === "critical" || b.severity === "high") && b.status === "submitted"
        );
        setCriticalBugs(highBugs.slice(0, 5));
      }

      if (featuresRes.ok) {
        const featuresData = await featuresRes.json();
        const topF = (featuresData.features || [])
          .filter((f: Issue & { status: string }) => f.status === "submitted")
          .sort((a: Issue, b: Issue) => (b.voteCount || 0) - (a.voteCount || 0));
        setTopFeatures(topF.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to load admin data:", error);
      setFetchError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTesterAction = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await fetch(`/api/admin/testers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchData();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSeedData = async () => {
    setActionLoading("seed");
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json();
      if (data.error) {
        alert("Seed error: " + data.error);
      } else {
        alert("Sample data seeded successfully!");
        await fetchData();
      }
    } catch (error) {
      console.error("Seed failed:", error);
      alert("Failed to seed data");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Beta program overview and management</p>
        </div>
        <button
          onClick={handleSeedData}
          disabled={actionLoading === "seed"}
          className="px-4 py-2 text-sm bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 transition-colors disabled:opacity-50"
        >
          {actionLoading === "seed" ? "Seeding..." : "Seed Sample Data"}
        </button>
      </div>

      {fetchError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {fetchError}. Check the browser console for details.
        </div>
      )}

      {/* Stats Cards */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Testers"
            value={analytics.testers.total}
            breakdown={`${analytics.testers.pending} pending · ${analytics.testers.approved} approved · ${analytics.testers.active} active · ${analytics.testers.suspended} suspended`}
            color="yellow"
          />
          <StatCard
            title="Bug Reports"
            value={analytics.bugs.total}
            breakdown={`${analytics.bugs.open} open · ${analytics.bugs.fixed} fixed · ${analytics.bugs.closed} closed`}
            color="red"
          />
          <StatCard
            title="Feature Requests"
            value={analytics.features.total}
            breakdown={`${analytics.features.byStatus?.submitted || 0} submitted · ${analytics.features.byStatus?.planned || 0} planned · ${analytics.features.byStatus?.shipped || 0} shipped`}
            color="cyan"
          />
          <StatCard
            title="New This Week"
            value={
              analytics.activity.lastWeek.newTesters +
              analytics.activity.lastWeek.newBugs +
              analytics.activity.lastWeek.newFeatures
            }
            breakdown={`${analytics.activity.lastWeek.newTesters} testers · ${analytics.activity.lastWeek.newBugs} bugs · ${analytics.activity.lastWeek.newFeatures} features`}
            color="green"
          />
        </div>
      )}

      {/* Pending Registrations */}
      <section className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-border flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Pending Registrations</h2>
          <span className="text-xs font-mono bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
            {pendingTesters.length} pending
          </span>
        </div>
        {pendingTesters.length === 0 ? (
          <div className="px-6 py-8 text-center text-zinc-500 text-sm">
            No pending registrations
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-500 text-left border-b border-brand-border">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Company</th>
                  <th className="px-6 py-3 font-medium">Role</th>
                  <th className="px-6 py-3 font-medium">Products</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingTesters.map((tester) => (
                  <tr key={tester.id} className="border-b border-brand-border/50 hover:bg-white/[0.02]">
                    <td className="px-6 py-3 text-white">{tester.name}</td>
                    <td className="px-6 py-3 text-zinc-400">{tester.email}</td>
                    <td className="px-6 py-3 text-zinc-400">{tester.company || "—"}</td>
                    <td className="px-6 py-3 text-zinc-400">{tester.role}</td>
                    <td className="px-6 py-3 text-zinc-400 text-xs">
                      {tester.interestedProducts?.split(",").join(", ") || "—"}
                    </td>
                    <td className="px-6 py-3 text-zinc-500 text-xs">
                      {new Date(tester.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTesterAction(tester.id, "approved")}
                          disabled={actionLoading === tester.id}
                          className="px-3 py-1 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded hover:bg-emerald-500/30 transition-colors disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleTesterAction(tester.id, "suspended")}
                          disabled={actionLoading === tester.id}
                          className="px-3 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Issues Needing Attention */}
      <section className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-border">
          <h2 className="text-lg font-semibold text-white">Issues Needing Attention</h2>
        </div>
        <div className="divide-y divide-brand-border/50">
          {criticalBugs.length === 0 && topFeatures.length === 0 ? (
            <div className="px-6 py-8 text-center text-zinc-500 text-sm">
              No urgent issues
            </div>
          ) : (
            <>
              {criticalBugs.map((bug) => (
                <Link
                  key={bug.id}
                  href="/admin/issues"
                  className="flex items-center gap-4 px-6 py-3 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-xs font-mono text-zinc-500">{bug.reportNumber}</span>
                  <span className="text-white flex-1 truncate">{bug.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded border ${
                    bug.severity === "critical"
                      ? "bg-red-500/20 text-red-400 border-red-500/30"
                      : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                  }`}>
                    {bug.severity}
                  </span>
                  <span className="text-xs text-zinc-500">{bug.tester?.name}</span>
                </Link>
              ))}
              {topFeatures.map((feat) => (
                <Link
                  key={feat.id}
                  href="/admin/issues"
                  className="flex items-center gap-4 px-6 py-3 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-xs font-mono text-zinc-500">{feat.requestNumber}</span>
                  <span className="text-white flex-1 truncate">{feat.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded border bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30">
                    {feat.voteCount} votes
                  </span>
                  <span className="text-xs text-zinc-500">{feat.tester?.name}</span>
                </Link>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/testers"
          className="px-5 py-2.5 bg-brand-card border border-brand-border rounded-lg text-sm text-white hover:bg-brand-cardHover transition-colors"
        >
          Manage All Testers
        </Link>
        <Link
          href="/admin/issues"
          className="px-5 py-2.5 bg-brand-card border border-brand-border rounded-lg text-sm text-white hover:bg-brand-cardHover transition-colors"
        >
          Manage All Issues
        </Link>
        <Link
          href="/admin/announcements"
          className="px-5 py-2.5 bg-brand-card border border-brand-border rounded-lg text-sm text-white hover:bg-brand-cardHover transition-colors"
        >
          Create Announcement
        </Link>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  breakdown,
  color,
}: {
  title: string;
  value: number;
  breakdown: string;
  color: "yellow" | "red" | "cyan" | "green";
}) {
  const colorMap = {
    yellow: "text-brand-yellow",
    red: "text-red-400",
    cyan: "text-brand-cyan",
    green: "text-emerald-400",
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-xl p-5">
      <p className="text-zinc-500 text-sm">{title}</p>
      <p className={`text-3xl font-bold mt-1 ${colorMap[color]}`}>{value}</p>
      <p className="text-xs text-zinc-600 mt-2">{breakdown}</p>
    </div>
  );
}
