"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TESTER_ROLES, CURRENT_SOFTWARE_OPTIONS } from "@/lib/constants";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    aircraftTypes: "",
    currentSoftware: "",
    agreedToTerms: false,
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/beta/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Application Submitted!</h1>
          <p className="text-zinc-400 mb-8">
            We&apos;ll review your application and email you when approved.
            This usually takes less than 24 hours.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 border border-brand-border text-zinc-300 rounded-lg hover:border-brand-borderHover transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-[580px]">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image src="/logoA.svg" alt="Adaptensor" width={40} height={40} />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Join the AdaptAero Beta</h1>
          <p className="text-zinc-400">
            Tell us about yourself and how you work with aircraft.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="rounded-xl bg-brand-card border border-brand-border p-8 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Full Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-brand-dark border border-brand-border text-white placeholder-zinc-600 focus:outline-none focus:border-brand-cyan/50 transition-colors"
              placeholder="John Smith"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-brand-dark border border-brand-border text-white placeholder-zinc-600 focus:outline-none focus:border-brand-cyan/50 transition-colors"
              placeholder="john@repairstation.com"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Company / Shop Name
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-brand-dark border border-brand-border text-white placeholder-zinc-600 focus:outline-none focus:border-brand-cyan/50 transition-colors"
              placeholder="Smith Aviation Services"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Role <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-brand-dark border border-brand-border text-white focus:outline-none focus:border-brand-cyan/50 transition-colors"
            >
              <option value="">Select your role...</option>
              {TESTER_ROLES.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Aircraft Types */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Aircraft Types You Work On
            </label>
            <input
              type="text"
              value={formData.aircraftTypes}
              onChange={(e) => setFormData({ ...formData, aircraftTypes: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-brand-dark border border-brand-border text-white placeholder-zinc-600 focus:outline-none focus:border-brand-cyan/50 transition-colors"
              placeholder="Cessna 172, Piper PA-28, King Air..."
            />
          </div>

          {/* Current Software */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Current MRO Software
            </label>
            <select
              value={formData.currentSoftware}
              onChange={(e) => setFormData({ ...formData, currentSoftware: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg bg-brand-dark border border-brand-border text-white focus:outline-none focus:border-brand-cyan/50 transition-colors"
            >
              <option value="">Select current software...</option>
              {CURRENT_SOFTWARE_OPTIONS.map((sw) => (
                <option key={sw} value={sw}>{sw}</option>
              ))}
            </select>
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3 pt-2">
            <input
              type="checkbox"
              required
              checked={formData.agreedToTerms}
              onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
              className="mt-1 w-4 h-4 rounded border-brand-border bg-brand-dark text-brand-cyan focus:ring-brand-cyan/50"
            />
            <label className="text-sm text-zinc-400">
              I understand this is beta software and may contain bugs. I agree to provide
              constructive feedback to help improve the platform. <span className="text-red-400">*</span>
            </label>
          </div>

          {/* Error */}
          {status === "error" && (
            <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {errorMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full py-3 bg-brand-yellow text-brand-black font-bold rounded-lg hover:bg-brand-yellow/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "submitting" ? "Submitting..." : "Submit Application"}
          </button>

          <p className="text-center text-xs text-zinc-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-brand-cyan hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
