"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, SEVERITIES } from "@/lib/constants";

export default function NewFeatureRequestPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    priority: "medium",
    description: "",
    useCase: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/beta/features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");

      router.push(`/portal/features/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-brand-dark border border-brand-border rounded-lg px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-cyan/50 transition-colors text-sm";
  const labelClass = "block text-sm font-medium text-zinc-300 mb-1.5";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/portal"
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-bold text-white">Request a Feature</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-brand-card border border-brand-border rounded-xl p-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="title" className={labelClass}>
              Feature Title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="Brief description of the feature you'd like"
              className={inputClass}
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="category" className={labelClass}>
                Module / Category <span className="text-red-400">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="priority" className={labelClass}>
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className={inputClass}
              >
                {Object.entries(SEVERITIES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the feature in detail. What should it do? Why is it needed?"
              className={inputClass}
            />
          </div>

          {/* Use Case */}
          <div>
            <label htmlFor="useCase" className={labelClass}>
              Use Case
            </label>
            <textarea
              id="useCase"
              name="useCase"
              rows={3}
              value={form.useCase}
              onChange={handleChange}
              placeholder="How would you use this in your daily operations?"
              className={inputClass}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between">
          <Link
            href="/portal"
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-brand-yellow text-brand-black font-semibold rounded-lg hover:bg-brand-yellow/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Feature Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
