import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateBugNumber(): Promise<string> {
  const latest = await prisma.betaBugReport.findFirst({
    orderBy: { reportNumber: "desc" },
    select: { reportNumber: true },
  });

  if (!latest) return "BUG-001";

  const num = parseInt(latest.reportNumber.replace("BUG-", ""), 10);
  return `BUG-${String(num + 1).padStart(3, "0")}`;
}

export async function generateFeatureNumber(): Promise<string> {
  const latest = await prisma.betaFeatureRequest.findFirst({
    orderBy: { requestNumber: "desc" },
    select: { requestNumber: true },
  });

  if (!latest) return "FR-001";

  const num = parseInt(latest.requestNumber.replace("FR-", ""), 10);
  return `FR-${String(num + 1).padStart(3, "0")}`;
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return "yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;
  return formatDate(date);
}
