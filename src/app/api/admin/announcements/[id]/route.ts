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
    const { title, content, type, version, isPinned, publishedAt } = body;

    const data: Record<string, unknown> = {};
    if (title !== undefined) data.title = title;
    if (content !== undefined) data.content = content;
    if (type !== undefined) data.type = type;
    if (version !== undefined) data.version = version;
    if (isPinned !== undefined) data.isPinned = isPinned;
    if (publishedAt !== undefined) data.publishedAt = new Date(publishedAt);

    const updated = await prisma.betaAnnouncement.update({
      where: { id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update announcement error:", error);
    const message = error instanceof Error ? error.message : "Failed to update announcement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
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

    await prisma.betaAnnouncement.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete announcement error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete announcement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
