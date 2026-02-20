"use client";

import { useState, useEffect, useCallback } from "react";
import {
  BUG_STATUSES,
  FEATURE_STATUSES,
  BUG_STATUS_COLORS,
  FEATURE_STATUS_COLORS,
  SEVERITY_COLORS,
} from "@/lib/constants";

type IssueType = "all" | "bugs" | "features";

interface Bug {
  id: string;
  reportNumber: string;
  title: string;
  category: string;
  severity: string;
  status: string;
  assignedTo: string | null;
  resolution: string | null;
  fixedInVersion: string | null;
  stepsToReproduce: string | null;
  expectedBehavior: string | null;
  actualBehavior: string | null;
  createdAt: string;
  tester: { name: string };
  attachments?: { id: string; fileName: string; fileUrl: string }[];
  _count?: { comments: number; attachments: number };
}

interface Feature {
  id: string;
  requestNumber: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  description: string;
  useCase: string | null;
  targetVersion: string | null;
  adminResponse: string | null;
  voteCount: number;
  createdAt: string;
  tester: { name: string };
  _count?: { comments: number };
}

type Issue = (Bug & { _type: "bug" }) | (Feature & { _type: "feature" });

export default function IssueManagement() {
  const [issueType, setIssueType] = useState<IssueType>("all");
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Record<string, Record<string, string>>>({});
  const [bulkStatus, setBulkStatus] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [bugsRes, featuresRes] = await Promise.all([
        fetch("/api/beta/bugs?limit=200"),
        fetch("/api/beta/features?limit=200"),
      ]);
      const bugsData = await bugsRes.json();
      const featuresData = await featuresRes.json();
      setBugs(bugsData.bugs || []);
      setFeatures(featuresData.features || []);
    } catch (error) {
      console.error("Failed to load issues:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const allIssues: Issue[] = [
    ...(issueType !== "features" ? bugs.map((b) => ({ ...b, _type: "bug" as const })) : []),
    ...(issueType !== "bugs" ? features.map((f) => ({ ...f, _type: "feature" as const })) : []),
  ];

  // Filter
  let filtered = allIssues.filter((issue) => {
    if (statusFilter && issue.status !== statusFilter) return false;
    if (severityFilter) {
      if (issue._type === "bug" && issue.severity !== severityFilter) return false;
      if (issue._type === "feature" && issue.priority !== severityFilter) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      const number = issue._type === "bug" ? issue.reportNumber : issue.requestNumber;
      if (!issue.title.toLowerCase().includes(q) && !number.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    if (sortBy === "votes") {
      const va = a._type === "feature" ? a.voteCount : 0;
      const vb = b._type === "feature" ? b.voteCount : 0;
      return vb - va;
    }
    if (sortBy === "severity") {
      const order: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      const sa = a._type === "bug" ? (order[a.severity] ?? 4) : (order[a.priority] ?? 4);
      const sb = b._type === "bug" ? (order[b.severity] ?? 4) : (order[b.priority] ?? 4);
      return sa - sb;
    }
    return 0;
  });

  const handleStatusChange = async (issue: Issue, newStatus: string) => {
    setActionLoading(issue.id);
    try {
      const endpoint = issue._type === "bug"
        ? `/api/admin/bugs/${issue.id}`
        : `/api/admin/features/${issue.id}`;
      await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      await fetchData();
    } catch (error) {
      console.error("Status update failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAssignedToBlur = async (issue: Issue, value: string) => {
    if (issue._type !== "bug") return;
    try {
      await fetch(`/api/admin/bugs/${issue.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: value }),
      });
    } catch (error) {
      console.error("Assign update failed:", error);
    }
  };

  const handleSaveDetail = async (issue: Issue) => {
    setActionLoading(issue.id);
    try {
      const fields = editFields[issue.id] || {};
      const endpoint = issue._type === "bug"
        ? `/api/admin/bugs/${issue.id}`
        : `/api/admin/features/${issue.id}`;
      await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      await fetchData();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkStatus = async () => {
    if (!bulkStatus || selected.size === 0) return;
    setActionLoading("bulk");
    try {
      const promises = Array.from(selected).map((id) => {
        const issue = allIssues.find((i) => i.id === id);
        if (!issue) return Promise.resolve();
        const endpoint = issue._type === "bug"
          ? `/api/admin/bugs/${id}`
          : `/api/admin/features/${id}`;
        return fetch(endpoint, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: bulkStatus }),
        });
      });
      await Promise.all(promises);
      setSelected(new Set());
      setBulkStatus("");
      await fetchData();
    } catch (error) {
      console.error("Bulk update failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkDelete = async () => {
    // Not implemented for bulk — would require admin delete endpoints for bugs/features
    setDeleteConfirm(false);
    setSelected(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((i) => i.id)));
    }
  };

  const getNumber = (issue: Issue) =>
    issue._type === "bug" ? issue.reportNumber : issue.requestNumber;

  const getStatusColors = (issue: Issue) =>
    issue._type === "bug" ? BUG_STATUS_COLORS : FEATURE_STATUS_COLORS;

  const getStatuses = (issue: Issue) =>
    issue._type === "bug" ? BUG_STATUSES : FEATURE_STATUSES;

  const getSeverityLabel = (issue: Issue) =>
    issue._type === "bug" ? issue.severity : issue.priority;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Manage Issues</h1>
        <p className="text-zinc-500 text-sm mt-1">Review and manage bug reports and feature requests</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-brand-card border border-brand-border rounded-lg p-1">
          {(["all", "bugs", "features"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { setIssueType(tab); setSelected(new Set()); }}
              className={`px-3 py-1.5 rounded text-sm capitalize transition-colors ${
                issueType === tab ? "bg-brand-yellow/10 text-brand-yellow" : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-zinc-300 focus:outline-none"
        >
          <option value="">All Statuses</option>
          {Array.from(new Set([...BUG_STATUSES, ...FEATURE_STATUSES])).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-zinc-300 focus:outline-none"
        >
          <option value="">All Severity</option>
          {["critical", "high", "medium", "low"].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-zinc-300 focus:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="votes">Most Voted</option>
          <option value="severity">Severity</option>
        </select>

        <input
          type="text"
          placeholder="Search title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-yellow/50"
        />
      </div>

      {/* Bulk Actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-brand-yellow/5 border border-brand-yellow/20 rounded-lg">
          <span className="text-sm text-brand-yellow font-medium">{selected.size} selected</span>
          <select
            value={bulkStatus}
            onChange={(e) => setBulkStatus(e.target.value)}
            className="px-3 py-1.5 bg-brand-card border border-brand-border rounded text-sm text-zinc-300 focus:outline-none"
          >
            <option value="">Change Status...</option>
            {Array.from(new Set([...BUG_STATUSES, ...FEATURE_STATUSES])).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={handleBulkStatus}
            disabled={!bulkStatus || actionLoading === "bulk"}
            className="px-3 py-1.5 text-xs bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 rounded hover:bg-brand-yellow/20 disabled:opacity-50"
          >
            Apply
          </button>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20"
          >
            Delete Selected
          </button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-brand-card border border-brand-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-zinc-500 text-left border-b border-brand-border">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-4 py-3 font-medium">ID</th>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Author</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Severity</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Assigned</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-zinc-500">
                      No issues found
                    </td>
                  </tr>
                ) : (
                  filtered.map((issue) => (
                    <>
                      <tr
                        key={issue.id}
                        className="border-b border-brand-border/50 hover:bg-white/[0.02] cursor-pointer"
                      >
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selected.has(issue.id)}
                            onChange={() => toggleSelect(issue.id)}
                            className="rounded"
                          />
                        </td>
                        <td className="px-4 py-3 font-mono text-zinc-500 text-xs" onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}>
                          {getNumber(issue)}
                        </td>
                        <td className="px-4 py-3 text-white max-w-[250px] truncate" onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}>
                          {issue.title}
                        </td>
                        <td className="px-4 py-3 text-zinc-400" onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}>
                          {issue.tester?.name}
                        </td>
                        <td className="px-4 py-3 text-zinc-400 text-xs" onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}>
                          {issue.category}
                        </td>
                        <td className="px-4 py-3" onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}>
                          <span className={`text-xs px-2 py-0.5 rounded border ${SEVERITY_COLORS[getSeverityLabel(issue)] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"}`}>
                            {getSeverityLabel(issue)}
                          </span>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={issue.status}
                            onChange={(e) => handleStatusChange(issue, e.target.value)}
                            disabled={actionLoading === issue.id}
                            className={`text-xs px-2 py-1 rounded border cursor-pointer focus:outline-none ${getStatusColors(issue)[issue.status] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"}`}
                            style={{ backgroundColor: "transparent" }}
                          >
                            {getStatuses(issue).map((s) => (
                              <option key={s} value={s} className="bg-brand-card text-white">{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          {issue._type === "bug" ? (
                            <input
                              type="text"
                              defaultValue={issue.assignedTo || ""}
                              onBlur={(e) => handleAssignedToBlur(issue, e.target.value)}
                              placeholder="—"
                              className="w-20 px-2 py-1 bg-transparent border border-brand-border/50 rounded text-xs text-zinc-300 focus:outline-none focus:border-brand-yellow/50"
                            />
                          ) : (
                            <span className="text-zinc-500 text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-zinc-500 text-xs" onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}>
                          {new Date(issue.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                      {expandedId === issue.id && (
                        <tr key={`${issue.id}-detail`} className="border-b border-brand-border/50 bg-brand-dark/50">
                          <td colSpan={9} className="px-6 py-5">
                            <IssueDetail
                              issue={issue}
                              editFields={editFields[issue.id] || {}}
                              setEditFields={(fields) =>
                                setEditFields((prev) => ({ ...prev, [issue.id]: { ...(prev[issue.id] || {}), ...fields } }))
                              }
                              onSave={() => handleSaveDetail(issue)}
                              saving={actionLoading === issue.id}
                            />
                          </td>
                        </tr>
                      )}
                    </>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg">Delete {selected.size} Issues?</h3>
            <p className="text-zinc-400 text-sm mt-2">This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-sm bg-brand-dark border border-brand-border rounded-lg text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex-1 px-4 py-2 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function IssueDetail({
  issue,
  editFields,
  setEditFields,
  onSave,
  saving,
}: {
  issue: Issue;
  editFields: Record<string, string>;
  setEditFields: (fields: Record<string, string>) => void;
  onSave: () => void;
  saving: boolean;
}) {
  if (issue._type === "bug") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <DetailBlock label="Steps to Reproduce" value={issue.stepsToReproduce} />
            <DetailBlock label="Expected Behavior" value={issue.expectedBehavior} />
            <DetailBlock label="Actual Behavior" value={issue.actualBehavior} />
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Resolution</label>
              <textarea
                value={editFields.resolution ?? issue.resolution ?? ""}
                onChange={(e) => setEditFields({ resolution: e.target.value })}
                className="w-full h-20 px-3 py-2 bg-brand-black border border-brand-border rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-yellow/50 resize-none"
                placeholder="Describe the resolution..."
              />
            </div>
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Fixed In Version</label>
              <input
                type="text"
                value={editFields.fixedInVersion ?? issue.fixedInVersion ?? ""}
                onChange={(e) => setEditFields({ fixedInVersion: e.target.value })}
                className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-yellow/50"
                placeholder="e.g., v0.9.3"
              />
            </div>
            <button
              onClick={onSave}
              disabled={saving}
              className="px-4 py-2 text-sm bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 rounded-lg hover:bg-brand-yellow/20 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
        {issue.attachments && issue.attachments.length > 0 && (
          <div>
            <label className="text-xs text-zinc-500 block mb-2">Attachments</label>
            <div className="flex flex-wrap gap-2">
              {issue.attachments.map((a) => (
                <a
                  key={a.id}
                  href={a.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs bg-brand-dark border border-brand-border rounded text-brand-cyan hover:bg-brand-cyan/10 transition-colors"
                >
                  {a.fileName}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Feature request detail
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <DetailBlock label="Description" value={issue.description} />
          <DetailBlock label="Use Case" value={issue.useCase} />
          <div className="text-xs text-zinc-500">Votes: <span className="text-brand-cyan">{issue.voteCount}</span></div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Admin Response</label>
            <textarea
              value={editFields.adminResponse ?? issue.adminResponse ?? ""}
              onChange={(e) => setEditFields({ adminResponse: e.target.value })}
              className="w-full h-20 px-3 py-2 bg-brand-black border border-brand-border rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-yellow/50 resize-none"
              placeholder="Respond to this feature request..."
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Target Version</label>
            <input
              type="text"
              value={editFields.targetVersion ?? issue.targetVersion ?? ""}
              onChange={(e) => setEditFields({ targetVersion: e.target.value })}
              className="w-full px-3 py-2 bg-brand-black border border-brand-border rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-yellow/50"
              placeholder="e.g., v1.0.0"
            />
          </div>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 text-sm bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 rounded-lg hover:bg-brand-yellow/20 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <label className="text-xs text-zinc-500 block mb-1">{label}</label>
      <p className="text-sm text-zinc-300 whitespace-pre-wrap">{value || "—"}</p>
    </div>
  );
}
