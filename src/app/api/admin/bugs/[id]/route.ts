import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    requireAdmin(userId);

    const { id } = await params;
    const body = await request.json();
    const { status, assignedTo, resolution, fixedInVersion } = body;

    const data: Record<string, unknown> = {};
    if (status !== undefined) {
      data.status = status;
      if (status === "fixed") {
        data.resolvedAt = new Date();
      }
    }
    if (assignedTo !== undefined) data.assignedTo = assignedTo;
    if (resolution !== undefined) data.resolution = resolution;
    if (fixedInVersion !== undefined) data.fixedInVersion = fixedInVersion;

    const updated = await prisma.betaBugReport.update({
      where: { id },
      data,
      include: {
        tester: { select: { name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Admin update bug error:", error);
    const message = error instanceof Error ? error.message : "Failed to update bug";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
