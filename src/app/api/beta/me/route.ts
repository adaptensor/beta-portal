import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tester = await prisma.betaTester.findUnique({
      where: { clerkUserId: userId },
      include: {
        _count: {
          select: {
            bugs: true,
            features: true,
            votes: true,
          },
        },
      },
    });

    if (!tester) {
      return NextResponse.json(
        { error: "Beta tester not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tester);
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { company, aircraftTypes, currentSoftware } = body;

    const tester = await prisma.betaTester.update({
      where: { clerkUserId: userId },
      data: {
        ...(company !== undefined && { company }),
        ...(aircraftTypes !== undefined && { aircraftTypes }),
        ...(currentSoftware !== undefined && { currentSoftware }),
        lastActiveAt: new Date(),
      },
    });

    return NextResponse.json(tester);
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
