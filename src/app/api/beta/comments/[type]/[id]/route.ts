import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string; id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, id } = await params;

    const where =
      type === "bug"
        ? { bugReportId: id }
        : type === "feature"
          ? { featureRequestId: id }
          : null;

    if (!where) {
      return NextResponse.json(
        { error: "Type must be 'bug' or 'feature'" },
        { status: 400 }
      );
    }

    const comments = await prisma.betaComment.findMany({
      where,
      include: {
        tester: { select: { name: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("List comments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
