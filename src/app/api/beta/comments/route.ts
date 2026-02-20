import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { requireTester, isAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tester = await requireTester(userId);
    const body = await request.json();
    const { bugReportId, featureRequestId, content } = body;

    if (!content || (!bugReportId && !featureRequestId)) {
      return NextResponse.json(
        { error: "Content and a bug or feature ID are required" },
        { status: 400 }
      );
    }

    const admin = isAdmin(userId);

    const comment = await prisma.betaComment.create({
      data: {
        bugReportId: bugReportId || null,
        featureRequestId: featureRequestId || null,
        testerId: tester.id,
        authorName: admin ? `${tester.name} (Admin)` : tester.name,
        isAdmin: admin,
        content,
      },
      include: {
        tester: { select: { name: true } },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Create comment error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create comment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
