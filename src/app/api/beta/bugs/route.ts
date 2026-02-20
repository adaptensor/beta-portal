import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { requireTester } from "@/lib/auth";
import { generateBugNumber } from "@/lib/utils";

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
    const severity = searchParams.get("severity");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (severity) where.severity = severity;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { reportNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const [bugs, total] = await Promise.all([
      prisma.betaBugReport.findMany({
        where,
        include: {
          tester: { select: { name: true, id: true } },
          _count: { select: { comments: true, attachments: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.betaBugReport.count({ where }),
    ]);

    return NextResponse.json({
      bugs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("List bugs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bugs" },
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
      attachmentUrls,
    } = body;

    if (!title || !category || !severity) {
      return NextResponse.json(
        { error: "Title, category, and severity are required" },
        { status: 400 }
      );
    }

    const reportNumber = await generateBugNumber();

    const bug = await prisma.betaBugReport.create({
      data: {
        reportNumber,
        testerId: tester.id,
        title,
        category,
        severity,
        stepsToReproduce: stepsToReproduce || null,
        expectedBehavior: expectedBehavior || null,
        actualBehavior: actualBehavior || null,
        browserOs: browserOs || null,
        pageUrl: pageUrl || null,
        consoleErrors: consoleErrors || null,
        attachments: {
          create: (attachmentUrls || []).map(
            (a: {
              url: string;
              fileName: string;
              fileSize: number;
              mimeType: string;
            }) => ({
              fileName: a.fileName,
              fileUrl: a.url,
              fileSize: a.fileSize,
              mimeType: a.mimeType,
            })
          ),
        },
      },
      include: {
        tester: { select: { name: true } },
        attachments: true,
      },
    });

    // Update tester last active
    await prisma.betaTester.update({
      where: { id: tester.id },
      data: { lastActiveAt: new Date() },
    });

    return NextResponse.json(bug, { status: 201 });
  } catch (error) {
    console.error("Create bug error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create bug report";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
