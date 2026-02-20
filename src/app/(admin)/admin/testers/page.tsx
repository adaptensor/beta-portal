"use client";

import { useState, useEffect, useCallback } from "react";

interface Tester {
  id: string;
  name: string;
  email: string;
  company: string | null;
  role: string;
  aircraftTypes: string | null;
  currentSoftware: string | null;
  interestedProducts: string | null;
  status: string;
  registeredAt: string;
  approvedAt: string | null;
  lastActiveAt: string | null;
  notes: string | null;
  _count: { bugs: number; features: number };
}

const STATUS_TABS = ["all", "pending", "approved", "active", "suspended"] as const;

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  approved: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  active: "bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30",
  suspended: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function TesterManagement() {
  const [testers, setTesters] = useState<Tester[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

  const fetchTesters = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/testers?status=${activeTab}`);
      const data = await res.json();
      setTesters(data.testers || []);
    } catch (error) {
      console.error("Failed to load testers:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setLoading(true);
    fetchTesters();
  }, [fetchTesters]);

  const handleAction = async (id: string, status: string) => {
    setActionLoading(id);
    try {
      await fetch(`/api/admin/testers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetchTesters();
    } catch (error) {
      console.error("Action failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await fetch(`/api/admin/testers/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      await fetchTesters();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveNotes = async (id: string) => {
    try {
      await fetch(`/api/admin/testers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: editingNotes[id] }),
      });
    } catch (error) {
      console.error("Save notes failed:", error);
    }
  };

  const filteredTesters = testers.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      (t.company || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Manage Testers</h1>
        <p className="text-zinc-500 text-sm mt-1">View and manage beta tester accounts</p>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-1 bg-brand-card border border-brand-border rounded-lg p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded text-sm capitalize transition-colors ${
                activeTab === tab
                  ? "bg-brand-yellow/10 text-brand-yellow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search name, email, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72 px-4 py-2 bg-brand-card border border-brand-border rounded-lg text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-brand-yellow/50"
        />
      </div>

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
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Products</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Registered</th>
                  <th className="px-4 py-3 font-medium">Last Active</th>
                  <th className="px-4 py-3 font-medium">Bugs</th>
                  <th className="px-4 py-3 font-medium">Features</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTesters.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-8 text-center text-zinc-500">
                      No testers found
                    </td>
                  </tr>
                ) : (
                  filteredTesters.map((tester) => (
                    <>
                      <tr
                        key={tester.id}
                        onClick={() => setExpandedId(expandedId === tester.id ? null : tester.id)}
                        className="border-b border-brand-border/50 hover:bg-white/[0.02] cursor-pointer"
                      >
                        <td className="px-4 py-3 text-white font-medium">{tester.name}</td>
                        <td className="px-4 py-3 text-zinc-400">{tester.email}</td>
                        <td className="px-4 py-3 text-zinc-400">{tester.company || "—"}</td>
                        <td className="px-4 py-3 text-zinc-400 text-xs">{tester.role}</td>
                        <td className="px-4 py-3 text-zinc-400 text-xs max-w-[150px] truncate">
                          {tester.interestedProducts?.split(",").join(", ") || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-0.5 rounded border ${STATUS_BADGE[tester.status] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"}`}>
                            {tester.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-500 text-xs">
                          {new Date(tester.registeredAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-zinc-500 text-xs">
                          {tester.lastActiveAt ? new Date(tester.lastActiveAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-4 py-3 text-zinc-400">{tester._count.bugs}</td>
                        <td className="px-4 py-3 text-zinc-400">{tester._count.features}</td>
                        <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-1">
                            {tester.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleAction(tester.id, "approved")}
                                  disabled={actionLoading === tester.id}
                                  className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded hover:bg-emerald-500/30 disabled:opacity-50"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleAction(tester.id, "suspended")}
                                  disabled={actionLoading === tester.id}
                                  className="px-2 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 disabled:opacity-50"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {(tester.status === "approved" || tester.status === "active") && (
                              <button
                                onClick={() => handleAction(tester.id, "suspended")}
                                disabled={actionLoading === tester.id}
                                className="px-2 py-1 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 disabled:opacity-50"
                              >
                                Suspend
                              </button>
                            )}
                            {tester.status === "suspended" && (
                              <button
                                onClick={() => handleAction(tester.id, "approved")}
                                disabled={actionLoading === tester.id}
                                className="px-2 py-1 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded hover:bg-emerald-500/30 disabled:opacity-50"
                              >
                                Reactivate
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteConfirm(tester.id)}
                              className="px-2 py-1 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedId === tester.id && (
                        <tr key={`${tester.id}-detail`} className="border-b border-brand-border/50 bg-brand-dark/50">
                          <td colSpan={11} className="px-6 py-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-3">
                                <h3 className="text-white font-medium text-sm">Profile Details</h3>
                                <div className="space-y-2 text-sm">
                                  <Detail label="Aircraft Types" value={tester.aircraftTypes} />
                                  <Detail label="Current Software" value={tester.currentSoftware} />
                                  <Detail label="Interested Products" value={tester.interestedProducts?.split(",").join(", ")} />
                                  <Detail label="Registered" value={new Date(tester.registeredAt).toLocaleString()} />
                                  <Detail label="Approved" value={tester.approvedAt ? new Date(tester.approvedAt).toLocaleString() : null} />
                                  <Detail label="Last Active" value={tester.lastActiveAt ? new Date(tester.lastActiveAt).toLocaleString() : null} />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h3 className="text-white font-medium text-sm">Admin Notes</h3>
                                <textarea
                                  value={editingNotes[tester.id] ?? tester.notes ?? ""}
                                  onChange={(e) =>
                                    setEditingNotes((prev) => ({ ...prev, [tester.id]: e.target.value }))
                                  }
                                  onBlur={() => handleSaveNotes(tester.id)}
                                  placeholder="Add notes about this tester..."
                                  className="w-full h-24 px-3 py-2 bg-brand-black border border-brand-border rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-yellow/50 resize-none"
                                />
                                <button
                                  onClick={() => handleSaveNotes(tester.id)}
                                  className="px-3 py-1.5 text-xs bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 rounded hover:bg-brand-yellow/20 transition-colors"
                                >
                                  Save Notes
                                </button>
                              </div>
                            </div>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg">Delete Tester?</h3>
            <p className="text-zinc-400 text-sm mt-2">
              This will permanently delete this tester and all their bug reports, feature requests, comments, and votes.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm bg-brand-dark border border-brand-border rounded-lg text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={actionLoading === deleteConfirm}
                className="flex-1 px-4 py-2 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
              >
                {actionLoading === deleteConfirm ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex gap-2">
      <span className="text-zinc-500 min-w-[120px]">{label}:</span>
      <span className="text-zinc-300">{value || "—"}</span>
    </div>
  );
}
