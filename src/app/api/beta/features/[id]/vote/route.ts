import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { requireTester } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tester = await requireTester(userId);
    const { id } = await params;

    // Check feature exists
    const feature = await prisma.betaFeatureRequest.findUnique({
      where: { id },
    });

    if (!feature) {
      return NextResponse.json(
        { error: "Feature request not found" },
        { status: 404 }
      );
    }

    // Check if already voted
    const existingVote = await prisma.betaVote.findUnique({
      where: {
        testerId_featureRequestId: {
          testerId: tester.id,
          featureRequestId: id,
        },
      },
    });

    if (existingVote) {
      // Remove vote
      await prisma.betaVote.delete({ where: { id: existingVote.id } });
      await prisma.betaFeatureRequest.update({
        where: { id },
        data: { voteCount: { decrement: 1 } },
      });

      return NextResponse.json({
        voted: false,
        voteCount: feature.voteCount - 1,
      });
    } else {
      // Add vote
      await prisma.betaVote.create({
        data: {
          testerId: tester.id,
          featureRequestId: id,
        },
      });
      await prisma.betaFeatureRequest.update({
        where: { id },
        data: { voteCount: { increment: 1 } },
      });

      return NextResponse.json({
        voted: true,
        voteCount: feature.voteCount + 1,
      });
    }
  } catch (error) {
    console.error("Vote error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to toggle vote";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
