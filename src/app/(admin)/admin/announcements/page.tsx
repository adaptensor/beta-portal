"use client";

import { useState, useEffect, useCallback } from "react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  version: string | null;
  isPinned: boolean;
  publishedAt: string;
}

const TYPE_BADGE: Record<string, string> = {
  update: "bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30",
  release: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  breaking: "bg-red-500/20 text-red-400 border-red-500/30",
  maintenance: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

const ANNOUNCEMENT_TYPES = ["update", "release", "breaking", "maintenance"];

export default function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formType, setFormType] = useState("update");
  const [formVersion, setFormVersion] = useState("");
  const [formPinned, setFormPinned] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await fetch("/api/beta/announcements");
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    } catch (error) {
      console.error("Failed to load announcements:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const resetForm = () => {
    setFormTitle("");
    setFormContent("");
    setFormType("update");
    setFormVersion("");
    setFormPinned(false);
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (ann: Announcement) => {
    setFormTitle(ann.title);
    setFormContent(ann.content);
    setFormType(ann.type);
    setFormVersion(ann.version || "");
    setFormPinned(ann.isPinned);
    setEditing(ann);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!formTitle || !formContent || !formType) return;
    setActionLoading("form");
    try {
      if (editing) {
        await fetch(`/api/admin/announcements/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            content: formContent,
            type: formType,
            version: formVersion || null,
            isPinned: formPinned,
          }),
        });
      } else {
        await fetch("/api/admin/announcements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            content: formContent,
            type: formType,
            version: formVersion || null,
            isPinned: formPinned,
          }),
        });
      }
      resetForm();
      await fetchAnnouncements();
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleTogglePin = async (ann: Announcement) => {
    setActionLoading(ann.id);
    try {
      await fetch(`/api/admin/announcements/${ann.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPinned: !ann.isPinned }),
      });
      await fetchAnnouncements();
    } catch (error) {
      console.error("Pin toggle failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      await fetchAnnouncements();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Announcements</h1>
          <p className="text-zinc-500 text-sm mt-1">Manage beta program announcements</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 text-sm bg-brand-yellow text-brand-black font-semibold rounded-lg hover:bg-brand-yellow/90 transition-colors"
        >
          Create New
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-brand-card border border-brand-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white">
            {editing ? "Edit Announcement" : "Create Announcement"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-zinc-500 block mb-1">Title *</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-yellow/50"
                placeholder="Announcement title"
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-zinc-500 block mb-1">Type *</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-zinc-300 focus:outline-none"
                >
                  {ANNOUNCEMENT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs text-zinc-500 block mb-1">Version</label>
                <input
                  type="text"
                  value={formVersion}
                  onChange={(e) => setFormVersion(e.target.value)}
                  className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-yellow/50"
                  placeholder="e.g., v0.9.3"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs text-zinc-500 block mb-1">Content *</label>
            <textarea
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-yellow/50 resize-none"
              placeholder="Announcement content..."
            />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formPinned}
                onChange={(e) => setFormPinned(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-zinc-300">Pin this announcement</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmit}
              disabled={!formTitle || !formContent || actionLoading === "form"}
              className="px-5 py-2 text-sm bg-brand-yellow text-brand-black font-semibold rounded-lg hover:bg-brand-yellow/90 transition-colors disabled:opacity-50"
            >
              {actionLoading === "form" ? "Saving..." : editing ? "Update" : "Publish"}
            </button>
            <button
              onClick={resetForm}
              className="px-5 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-brand-card border border-brand-border rounded-xl p-12 text-center">
          <p className="text-zinc-500">No announcements yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="bg-brand-card border border-brand-border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-white font-medium">{ann.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded border ${TYPE_BADGE[ann.type] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"}`}>
                    {ann.type}
                  </span>
                  {ann.version && (
                    <span className="text-xs font-mono text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded">
                      {ann.version}
                    </span>
                  )}
                  {ann.isPinned && (
                    <span className="text-xs text-brand-yellow">pinned</span>
                  )}
                </div>
                <p className="text-zinc-400 text-sm mt-1 line-clamp-2">{ann.content}</p>
                <p className="text-xs text-zinc-600 mt-1">
                  {new Date(ann.publishedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => openEdit(ann)}
                  className="px-3 py-1.5 text-xs bg-brand-card border border-brand-border rounded hover:bg-brand-cardHover text-zinc-300 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleTogglePin(ann)}
                  disabled={actionLoading === ann.id}
                  className="px-3 py-1.5 text-xs bg-brand-card border border-brand-border rounded hover:bg-brand-cardHover text-zinc-300 transition-colors disabled:opacity-50"
                >
                  {ann.isPinned ? "Unpin" : "Pin"}
                </button>
                <button
                  onClick={() => setDeleteConfirm(ann.id)}
                  className="px-3 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded hover:bg-red-500/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-white font-semibold text-lg">Delete Announcement?</h3>
            <p className="text-zinc-400 text-sm mt-2">This action cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-sm bg-brand-dark border border-brand-border rounded-lg text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={actionLoading === deleteConfirm}
                className="flex-1 px-4 py-2 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 disabled:opacity-50"
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
