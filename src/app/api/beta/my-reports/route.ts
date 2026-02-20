import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { requireTester } from "@/lib/auth";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tester = await requireTester(userId);

    const [bugs, features] = await Promise.all([
      prisma.betaBugReport.findMany({
        where: { testerId: tester.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          reportNumber: true,
          title: true,
          status: true,
          severity: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.betaFeatureRequest.findMany({
        where: { testerId: tester.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          requestNumber: true,
          title: true,
          status: true,
          priority: true,
          voteCount: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return NextResponse.json({ bugs, features });
  } catch (error) {
    console.error("My reports error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch reports";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
