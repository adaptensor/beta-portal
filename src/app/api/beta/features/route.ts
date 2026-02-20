import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { requireTester } from "@/lib/auth";
import { generateFeatureNumber } from "@/lib/utils";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "votes";

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { requestNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy =
      sort === "votes"
        ? [{ voteCount: "desc" as const }, { createdAt: "desc" as const }]
        : [{ createdAt: "desc" as const }];

    const [features, total] = await Promise.all([
      prisma.betaFeatureRequest.findMany({
        where,
        include: {
          tester: { select: { name: true, id: true } },
          _count: { select: { comments: true, votes: true } },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.betaFeatureRequest.count({ where }),
    ]);

    return NextResponse.json({
      features,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("List features error:", error);
    return NextResponse.json(
      { error: "Failed to fetch features" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tester = await requireTester(userId);
    const body = await request.json();

    const { title, category, priority, description, useCase } = body;

    if (!title || !category || !description) {
      return NextResponse.json(
        { error: "Title, category, and description are required" },
        { status: 400 }
      );
    }

    const requestNumber = await generateFeatureNumber();

    const feature = await prisma.betaFeatureRequest.create({
      data: {
        requestNumber,
        testerId: tester.id,
        title,
        category,
        priority: priority || "medium",
        description,
        useCase: useCase || null,
      },
      include: {
        tester: { select: { name: true } },
      },
    });

    // Update tester last active
    await prisma.betaTester.update({
      where: { id: tester.id },
      data: { lastActiveAt: new Date() },
    });

    return NextResponse.json(feature, { status: 201 });
  } catch (error) {
    console.error("Create feature error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create feature request";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
