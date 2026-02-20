import { prisma } from "./prisma";

export function isAdmin(userId: string): boolean {
  const adminIds = (process.env.ADMIN_USER_IDS || "").split(",").map((s) => s.trim());
  return adminIds.includes(userId);
}

export function requireAdmin(userId: string): void {
  if (!isAdmin(userId)) {
    throw new Error("Unauthorized: admin access required");
  }
}

export async function getTester(clerkUserId: string) {
  return prisma.betaTester.findUnique({
    where: { clerkUserId },
  });
}

export async function requireTester(clerkUserId: string) {
  const tester = await prisma.betaTester.findUnique({
    where: { clerkUserId },
  });

  if (!tester) {
    throw new Error("Beta tester account not found. Please register first.");
  }

  if (tester.status !== "approved" && tester.status !== "active") {
    throw new Error(`Your beta tester account is ${tester.status}. Please wait for approval.`);
  }

  return tester;
}
