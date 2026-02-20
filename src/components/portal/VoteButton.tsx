"use client";

import { useState } from "react";

export default function VoteButton({
  featureId,
  initialVoted,
  initialCount,
}: {
  featureId: string;
  initialVoted: boolean;
  initialCount: number;
}) {
  const [voted, setVoted] = useState(initialVoted);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleVote = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/beta/features/${featureId}/vote`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setVoted(data.voted);
        setCount(data.voteCount);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={loading}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl border transition-all ${
        voted
          ? "bg-brand-yellow/10 border-brand-yellow/30 text-brand-yellow"
          : "bg-brand-card border-brand-border text-zinc-400 hover:border-brand-yellow/20 hover:text-brand-yellow"
      } ${loading ? "opacity-50" : ""}`}
    >
      <svg
        className={`w-5 h-5 transition-transform ${voted ? "scale-110" : ""}`}
        fill={voted ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M5 15l7-7 7 7" />
      </svg>
      <span className="text-sm font-bold font-mono">{count}</span>
    </button>
  );
}
