"use client";

import { useState, useEffect } from "react";
import { formatRelativeTime } from "@/lib/utils";

interface Comment {
  id: string;
  authorName: string;
  isAdmin: boolean;
  content: string;
  createdAt: string;
}

export default function CommentThread({
  type,
  issueId,
  initialComments,
}: {
  type: "bug" | "feature";
  issueId: string;
  initialComments: Comment[];
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Keep in sync with server data on mount
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError("");

    try {
      const body =
        type === "bug"
          ? { bugReportId: issueId, content: content.trim() }
          : { featureRequestId: issueId, content: content.trim() };

      const res = await fetch("/api/beta/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post comment");
      }

      const newComment = await res.json();
      setComments((prev) => [...prev, newComment]);
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-xl">
      <div className="p-5 border-b border-brand-border">
        <h3 className="text-white font-semibold">
          Comments ({comments.length})
        </h3>
      </div>

      {comments.length === 0 ? (
        <div className="p-8 text-center text-zinc-500 text-sm">
          No comments yet. Be the first to add one.
        </div>
      ) : (
        <div className="divide-y divide-brand-border">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 ${comment.isAdmin ? "border-l-2 border-l-brand-yellow" : ""}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    comment.isAdmin
                      ? "bg-brand-yellow/20 text-brand-yellow"
                      : "bg-brand-cyan/20 text-brand-cyan"
                  }`}
                >
                  {comment.authorName.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-white font-medium">
                  {comment.authorName}
                </span>
                {comment.isAdmin && (
                  <span className="text-[10px] font-bold bg-brand-yellow/20 text-brand-yellow px-1.5 py-0.5 rounded">
                    ADMIN
                  </span>
                )}
                <span className="text-xs text-zinc-600">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              <p className="text-sm text-zinc-300 pl-9 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add comment form */}
      <div className="p-4 border-t border-brand-border">
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            className="w-full bg-brand-dark border border-brand-border rounded-lg p-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-cyan/50 resize-none"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="px-4 py-2 bg-brand-cyan text-white text-sm font-medium rounded-lg hover:bg-brand-cyan/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
