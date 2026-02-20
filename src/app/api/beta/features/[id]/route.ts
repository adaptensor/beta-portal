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

    const feature = await prisma.betaFeatureRequest.findUnique({
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
        votes: { select: { testerId: true } },
        _count: { select: { votes: true } },
      },
    });

    if (!feature) {
      return NextResponse.json(
        { error: "Feature request not found" },
        { status: 404 }
      );
    }

    // Check if current user has voted
    const tester = await prisma.betaTester.findUnique({
      where: { clerkUserId: userId },
      select: { id: true },
    });

    const hasVoted = tester
      ? feature.votes.some((v) => v.testerId === tester.id)
      : false;

    return NextResponse.json({ ...feature, hasVoted });
  } catch (error) {
    console.error("Get feature error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feature request" },
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

    const feature = await prisma.betaFeatureRequest.findUnique({
      where: { id },
      include: { tester: true },
    });

    if (!feature) {
      return NextResponse.json(
        { error: "Feature request not found" },
        { status: 404 }
      );
    }

    // Only the original tester or admin can update
    if (feature.tester.clerkUserId !== userId && !isAdmin(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, category, priority, description, useCase } = body;

    const updated = await prisma.betaFeatureRequest.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(category !== undefined && { category }),
        ...(priority !== undefined && { priority }),
        ...(description !== undefined && { description }),
        ...(useCase !== undefined && { useCase }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update feature error:", error);
    return NextResponse.json(
      { error: "Failed to update feature request" },
      { status: 500 }
    );
  }
}
