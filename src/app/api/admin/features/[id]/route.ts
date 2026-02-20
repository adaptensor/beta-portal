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
    const { status, targetVersion, adminResponse } = body;

    const data: Record<string, unknown> = {};
    if (status !== undefined) data.status = status;
    if (targetVersion !== undefined) data.targetVersion = targetVersion;
    if (adminResponse !== undefined) data.adminResponse = adminResponse;

    const updated = await prisma.betaFeatureRequest.update({
      where: { id },
      data,
      include: {
        tester: { select: { name: true } },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Admin update feature error:", error);
    const message = error instanceof Error ? error.message : "Failed to update feature";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
