import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const announcements = await prisma.betaAnnouncement.findMany({
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
    });

    return NextResponse.json({ announcements });
  } catch (error) {
    console.error("List announcements error:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements" },
      { status: 500 }
    );
  }
}
