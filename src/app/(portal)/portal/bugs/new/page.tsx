"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES, SEVERITIES } from "@/lib/constants";

interface UploadedFile {
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  preview?: string;
}

export default function NewBugReportPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "",
    severity: "",
    stepsToReproduce: "",
    expectedBehavior: "",
    actualBehavior: "",
    pageUrl: "",
    consoleErrors: "",
    browserOs: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/beta/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        const data = await res.json();
        setUploads((prev) => [
          ...prev,
          {
            ...data,
            preview: file.type.startsWith("image/")
              ? URL.createObjectURL(file)
              : undefined,
          },
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeUpload = (index: number) => {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/beta/bugs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          attachmentUrls: uploads,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit");

      router.push(`/portal/bugs/${data.id}`);
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
        <h1 className="text-2xl font-bold text-white">Report a Bug</h1>
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
              Bug Title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={form.title}
              onChange={handleChange}
              placeholder="Brief description of the bug"
              className={inputClass}
            />
          </div>

          {/* Category & Severity */}
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
              <label htmlFor="severity" className={labelClass}>
                Severity <span className="text-red-400">*</span>
              </label>
              <select
                id="severity"
                name="severity"
                required
                value={form.severity}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select severity</option>
                {Object.entries(SEVERITIES).map(([key, val]) => (
                  <option key={key} value={key}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Steps to Reproduce */}
          <div>
            <label htmlFor="stepsToReproduce" className={labelClass}>
              Steps to Reproduce <span className="text-red-400">*</span>
            </label>
            <textarea
              id="stepsToReproduce"
              name="stepsToReproduce"
              required
              rows={4}
              value={form.stepsToReproduce}
              onChange={handleChange}
              placeholder={"1. Go to...\n2. Click on...\n3. Observe..."}
              className={inputClass}
            />
          </div>

          {/* Expected / Actual */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="expectedBehavior" className={labelClass}>
                Expected Behavior
              </label>
              <textarea
                id="expectedBehavior"
                name="expectedBehavior"
                rows={2}
                value={form.expectedBehavior}
                onChange={handleChange}
                placeholder="What should happen"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="actualBehavior" className={labelClass}>
                Actual Behavior
              </label>
              <textarea
                id="actualBehavior"
                name="actualBehavior"
                rows={2}
                value={form.actualBehavior}
                onChange={handleChange}
                placeholder="What actually happened"
                className={inputClass}
              />
            </div>
          </div>

          {/* Page URL */}
          <div>
            <label htmlFor="pageUrl" className={labelClass}>
              Page URL
            </label>
            <input
              id="pageUrl"
              name="pageUrl"
              type="text"
              value={form.pageUrl}
              onChange={handleChange}
              placeholder="e.g. aviation.adaptensor.io/compliance/ads"
              className={inputClass}
            />
          </div>

          {/* Console Errors */}
          <div>
            <label htmlFor="consoleErrors" className={labelClass}>
              Console Errors
            </label>
            <textarea
              id="consoleErrors"
              name="consoleErrors"
              rows={3}
              value={form.consoleErrors}
              onChange={handleChange}
              placeholder="Paste any error messages from browser console"
              className={`${inputClass} font-mono text-xs`}
            />
          </div>

          {/* Browser & OS */}
          <div>
            <label htmlFor="browserOs" className={labelClass}>
              Browser & OS
            </label>
            <input
              id="browserOs"
              name="browserOs"
              type="text"
              value={form.browserOs}
              onChange={handleChange}
              placeholder="e.g. Chrome 121 on Windows 11"
              className={inputClass}
            />
          </div>
        </div>

        {/* Screenshots */}
        <div className="bg-brand-card border border-brand-border rounded-xl p-6">
          <label className={labelClass}>Screenshots</label>
          <div
            className="border-2 border-dashed border-brand-border rounded-lg p-6 text-center cursor-pointer hover:border-brand-cyan/30 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <svg
              className="w-8 h-8 mx-auto text-zinc-600 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm text-zinc-500">
              {uploading
                ? "Uploading..."
                : "Click to upload screenshots (PNG, JPG, GIF, WebP, PDF)"}
            </p>
            <p className="text-xs text-zinc-600 mt-1">Max 10MB per file</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/gif,image/webp,application/pdf"
            onChange={handleFileUpload}
            className="hidden"
          />

          {uploads.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {uploads.map((file, i) => (
                <div
                  key={i}
                  className="relative group bg-brand-dark border border-brand-border rounded-lg overflow-hidden"
                >
                  {file.preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={file.preview}
                      alt={file.fileName}
                      className="w-full h-24 object-cover"
                    />
                  ) : (
                    <div className="w-full h-24 flex items-center justify-center text-zinc-500 text-xs">
                      {file.fileName}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => removeUpload(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    &times;
                  </button>
                  <p className="text-[10px] text-zinc-500 p-1 truncate">
                    {file.fileName}
                  </p>
                </div>
              ))}
            </div>
          )}
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
            disabled={submitting || uploading}
            className="px-6 py-3 bg-brand-yellow text-brand-black font-semibold rounded-lg hover:bg-brand-yellow/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Bug Report"}
          </button>
        </div>
      </form>
    </div>
  );
}
