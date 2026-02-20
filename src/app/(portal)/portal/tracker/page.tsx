"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import {
  CATEGORIES,
  SEVERITY_COLORS,
  BUG_STATUS_COLORS,
  FEATURE_STATUS_COLORS,
  BUG_STATUSES,
  FEATURE_STATUSES,
} from "@/lib/constants";

type TrackerItem = {
  type: "bug" | "feature";
  id: string;
  number: string;
  title: string;
  category: string;
  status: string;
  severity?: string;
  priority?: string;
  voteCount?: number;
  author: string;
  createdAt: string;
  commentCount: number;
};

type Tab = "all" | "bugs" | "features";
type SortOption = "newest" | "oldest" | "votes" | "severity";

const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export default function TrackerPage() {
  const [items, setItems] = useState<TrackerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("all");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const fetches: Promise<Response>[] = [];

      if (tab !== "features") {
        const bugParams = new URLSearchParams({ page: String(page), limit: "50" });
        if (search) bugParams.set("search", search);
        if (categoryFilter) bugParams.set("category", categoryFilter);
        fetches.push(fetch(`/api/beta/bugs?${bugParams}`));
      }

      if (tab !== "bugs") {
        const featureParams = new URLSearchParams({ page: String(page), limit: "50" });
        if (search) featureParams.set("search", search);
        if (categoryFilter) featureParams.set("category", categoryFilter);
        fetches.push(fetch(`/api/beta/features?${featureParams}`));
      }

      const responses = await Promise.all(fetches);
      const data = await Promise.all(responses.map((r) => r.json()));

      let combined: TrackerItem[] = [];

      if (tab === "all") {
        const bugsData = data[0];
        const featuresData = data[1];
        combined = [
          ...(bugsData.bugs || []).map(
            (b: {
              id: string;
              reportNumber: string;
              title: string;
              category: string;
              status: string;
              severity: string;
              tester: { name: string };
              createdAt: string;
              _count: { comments: number };
            }) => ({
              type: "bug" as const,
              id: b.id,
              number: b.reportNumber,
              title: b.title,
              category: b.category,
              status: b.status,
              severity: b.severity,
              author: b.tester.name,
              createdAt: b.createdAt,
              commentCount: b._count.comments,
            })
          ),
          ...(featuresData.features || []).map(
            (f: {
              id: string;
              requestNumber: string;
              title: string;
              category: string;
              status: string;
              priority: string;
              voteCount: number;
              tester: { name: string };
              createdAt: string;
              _count: { comments: number };
            }) => ({
              type: "feature" as const,
              id: f.id,
              number: f.requestNumber,
              title: f.title,
              category: f.category,
              status: f.status,
              priority: f.priority,
              voteCount: f.voteCount,
              author: f.tester.name,
              createdAt: f.createdAt,
              commentCount: f._count.comments,
            })
          ),
        ];
        setTotalPages(
          Math.max(bugsData.totalPages || 1, featuresData.totalPages || 1)
        );
      } else if (tab === "bugs") {
        const bugsData = data[0];
        combined = (bugsData.bugs || []).map(
          (b: {
            id: string;
            reportNumber: string;
            title: string;
            category: string;
            status: string;
            severity: string;
            tester: { name: string };
            createdAt: string;
            _count: { comments: number };
          }) => ({
            type: "bug" as const,
            id: b.id,
            number: b.reportNumber,
            title: b.title,
            category: b.category,
            status: b.status,
            severity: b.severity,
            author: b.tester.name,
            createdAt: b.createdAt,
            commentCount: b._count.comments,
          })
        );
        setTotalPages(bugsData.totalPages || 1);
      } else {
        const featuresData = data[0];
        combined = (featuresData.features || []).map(
          (f: {
            id: string;
            requestNumber: string;
            title: string;
            category: string;
            status: string;
            priority: string;
            voteCount: number;
            tester: { name: string };
            createdAt: string;
            _count: { comments: number };
          }) => ({
            type: "feature" as const,
            id: f.id,
            number: f.requestNumber,
            title: f.title,
            category: f.category,
            status: f.status,
            priority: f.priority,
            voteCount: f.voteCount,
            author: f.tester.name,
            createdAt: f.createdAt,
            commentCount: f._count.comments,
          })
        );
        setTotalPages(featuresData.totalPages || 1);
      }

      setItems(combined);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [tab, page, search, categoryFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [tab, search, categoryFilter]);

  // Client-side filtering for status and severity
  const filteredItems = items.filter((item) => {
    if (statusFilter.length > 0 && !statusFilter.includes(item.status))
      return false;
    if (severityFilter.length > 0) {
      const level = item.type === "bug" ? item.severity : item.priority;
      if (!level || !severityFilter.includes(level)) return false;
    }
    return true;
  });

  // Client-side sorting
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sort) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "votes":
        return (b.voteCount || 0) - (a.voteCount || 0);
      case "severity": {
        const aLevel = a.severity || a.priority || "low";
        const bLevel = b.severity || b.priority || "low";
        return (SEVERITY_ORDER[aLevel] ?? 3) - (SEVERITY_ORDER[bLevel] ?? 3);
      }
      default:
        return 0;
    }
  });

  const toggleStatus = (s: string) => {
    setStatusFilter((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const toggleSeverity = (s: string) => {
    setSeverityFilter((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const allStatuses =
    tab === "bugs"
      ? BUG_STATUSES
      : tab === "features"
        ? FEATURE_STATUSES
        : Array.from(new Set([...BUG_STATUSES, ...FEATURE_STATUSES]));

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Issue Tracker</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/portal/bugs/new"
            className="px-3 py-2 bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-medium rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Report Bug
          </Link>
          <Link
            href="/portal/features/new"
            className="px-3 py-2 bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 text-sm font-medium rounded-lg hover:bg-brand-yellow/30 transition-colors"
          >
            Request Feature
          </Link>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-brand-card border border-brand-border rounded-xl p-4 space-y-3">
        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-1 bg-brand-dark rounded-lg p-1">
            {(["all", "bugs", "features"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setStatusFilter([]);
                }}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  tab === t
                    ? "bg-brand-card text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {t === "all" ? "All" : t === "bugs" ? "Bugs" : "Features"}
              </button>
            ))}
          </div>
          <div className="flex-1 relative">
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or ID..."
              className="w-full bg-brand-dark border border-brand-border rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-cyan/50"
            />
          </div>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-brand-dark border border-brand-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand-cyan/50"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="votes">Most Voted</option>
            <option value="severity">Severity</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-brand-dark border border-brand-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand-cyan/50"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <span className="text-[10px] text-zinc-600 uppercase tracking-wider">
            Severity:
          </span>
          {["critical", "high", "medium", "low"].map((s) => (
            <button
              key={s}
              onClick={() => toggleSeverity(s)}
              className={`text-[10px] font-medium px-2 py-1 rounded-full border transition-colors ${
                severityFilter.includes(s)
                  ? SEVERITY_COLORS[s]
                  : "bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-500"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Status chips */}
        <div className="flex flex-wrap gap-1.5 items-center">
          <span className="text-[10px] text-zinc-600 uppercase tracking-wider mr-1">
            Status:
          </span>
          {allStatuses.map((s) => {
            const colors =
              (BUG_STATUS_COLORS[s] || FEATURE_STATUS_COLORS[s] || "");
            return (
              <button
                key={s}
                onClick={() => toggleStatus(s)}
                className={`text-[10px] font-medium px-2 py-1 rounded-full border transition-colors ${
                  statusFilter.includes(s)
                    ? colors
                    : "bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-500"
                }`}
              >
                {s}
              </button>
            );
          })}
          {(statusFilter.length > 0 || severityFilter.length > 0) && (
            <button
              onClick={() => {
                setStatusFilter([]);
                setSeverityFilter([]);
              }}
              className="text-[10px] text-zinc-500 hover:text-white ml-2"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500">Loading...</div>
        ) : sortedItems.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">
            No issues found. Adjust your filters or be the first to report one!
          </div>
        ) : (
          <div className="divide-y divide-brand-border">
            {sortedItems.map((item) => (
              <Link
                key={`${item.type}-${item.id}`}
                href={`/portal/${item.type === "bug" ? "bugs" : "features"}/${item.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors"
              >
                {/* ID */}
                <span
                  className={`text-xs font-mono font-bold w-16 shrink-0 ${
                    item.type === "bug" ? "text-brand-cyan" : "text-brand-yellow"
                  }`}
                >
                  {item.number}
                </span>

                {/* Title + author */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.title}</p>
                  <p className="text-xs text-zinc-600 truncate">
                    by {item.author} &middot;{" "}
                    {formatRelativeTime(item.createdAt)}
                    {item.commentCount > 0 && (
                      <span className="ml-2 text-zinc-500">
                        {item.commentCount} comment
                        {item.commentCount !== 1 ? "s" : ""}
                      </span>
                    )}
                  </p>
                </div>

                {/* Category */}
                <span className="hidden md:inline text-[10px] text-zinc-500 bg-brand-dark px-2 py-0.5 rounded border border-brand-border shrink-0">
                  {item.category}
                </span>

                {/* Severity / Priority */}
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${
                    SEVERITY_COLORS[item.severity || item.priority || ""] || ""
                  }`}
                >
                  {item.severity || item.priority}
                </span>

                {/* Status */}
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${
                    item.type === "bug"
                      ? BUG_STATUS_COLORS[item.status] || ""
                      : FEATURE_STATUS_COLORS[item.status] || ""
                  }`}
                >
                  {item.status}
                </span>

                {/* Vote count for features */}
                {item.type === "feature" && (
                  <span className="text-xs font-mono text-zinc-500 w-8 text-right shrink-0">
                    {item.voteCount || 0}
                    <svg
                      className="w-3 h-3 inline ml-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M5 15l7-7 7 7" />
                    </svg>
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm bg-brand-card border border-brand-border rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-zinc-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 text-sm bg-brand-card border border-brand-border rounded-lg text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
