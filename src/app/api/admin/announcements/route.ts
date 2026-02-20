import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    requireAdmin(userId);

    const body = await request.json();
    const { title, content, type, version, isPinned } = body;

    if (!title || !content || !type) {
      return NextResponse.json(
        { error: "Title, content, and type are required" },
        { status: 400 }
      );
    }

    const announcement = await prisma.betaAnnouncement.create({
      data: {
        title,
        content,
        type,
        version: version || null,
        isPinned: isPinned || false,
      },
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error("Create announcement error:", error);
    const message = error instanceof Error ? error.message : "Failed to create announcement";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
