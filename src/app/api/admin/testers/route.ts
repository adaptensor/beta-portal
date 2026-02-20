import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    requireAdmin(userId);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status && status !== "all") {
      where.status = status;
    }

    const testers = await prisma.betaTester.findMany({
      where,
      include: {
        _count: {
          select: {
            bugs: true,
            features: true,
          },
        },
      },
      orderBy: { registeredAt: "desc" },
    });

    return NextResponse.json({ testers });
  } catch (error) {
    console.error("List testers error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch testers";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
