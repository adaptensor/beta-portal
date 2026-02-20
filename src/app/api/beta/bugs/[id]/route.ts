import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const bug = await prisma.betaBugReport.findUnique({
      where: { id },
      include: {
        tester: { select: { id: true, name: true, email: true } },
        attachments: true,
        comments: {
          include: {
            tester: { select: { name: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { votes: true } },
      },
    });

    if (!bug) {
      return NextResponse.json(
        { error: "Bug report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(bug);
  } catch (error) {
    console.error("Get bug error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bug report" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const bug = await prisma.betaBugReport.findUnique({
      where: { id },
      include: { tester: true },
    });

    if (!bug) {
      return NextResponse.json(
        { error: "Bug report not found" },
        { status: 404 }
      );
    }

    // Only the original tester or admin can update
    if (bug.tester.clerkUserId !== userId && !isAdmin(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      category,
      severity,
      stepsToReproduce,
      expectedBehavior,
      actualBehavior,
      browserOs,
      pageUrl,
      consoleErrors,
    } = body;

    const updated = await prisma.betaBugReport.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(category !== undefined && { category }),
        ...(severity !== undefined && { severity }),
        ...(stepsToReproduce !== undefined && { stepsToReproduce }),
        ...(expectedBehavior !== undefined && { expectedBehavior }),
        ...(actualBehavior !== undefined && { actualBehavior }),
        ...(browserOs !== undefined && { browserOs }),
        ...(pageUrl !== undefined && { pageUrl }),
        ...(consoleErrors !== undefined && { consoleErrors }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update bug error:", error);
    return NextResponse.json(
      { error: "Failed to update bug report" },
      { status: 500 }
    );
  }
}
