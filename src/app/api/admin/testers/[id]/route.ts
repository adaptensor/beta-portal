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
    const { status, notes } = body;

    const data: Record<string, unknown> = {};
    if (status !== undefined) {
      data.status = status;
      if (status === "approved") {
        data.approvedAt = new Date();
      }
    }
    if (notes !== undefined) {
      data.notes = notes;
    }

    const updated = await prisma.betaTester.update({
      where: { id },
      data,
    });

    // Optional: Send approval email via SendGrid
    if (status === "approved" && process.env.SENDGRID_API_KEY) {
      try {
        await sendApprovalEmail(updated.email, updated.name);
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError);
        // Non-blocking — tester is still approved
      }
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update tester error:", error);
    const message = error instanceof Error ? error.message : "Failed to update tester";
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

    // Delete all related records in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete votes
      await tx.betaVote.deleteMany({ where: { testerId: id } });
      // Delete comments
      await tx.betaComment.deleteMany({ where: { testerId: id } });
      // Delete attachments on bugs
      const bugs = await tx.betaBugReport.findMany({ where: { testerId: id }, select: { id: true } });
      if (bugs.length > 0) {
        await tx.betaAttachment.deleteMany({ where: { bugReportId: { in: bugs.map((b) => b.id) } } });
        await tx.betaComment.deleteMany({ where: { bugReportId: { in: bugs.map((b) => b.id) } } });
        await tx.betaVote.deleteMany({ where: { bugReportId: { in: bugs.map((b) => b.id) } } });
      }
      // Delete attachments on features
      const features = await tx.betaFeatureRequest.findMany({ where: { testerId: id }, select: { id: true } });
      if (features.length > 0) {
        await tx.betaAttachment.deleteMany({ where: { featureRequestId: { in: features.map((f) => f.id) } } });
        await tx.betaComment.deleteMany({ where: { featureRequestId: { in: features.map((f) => f.id) } } });
        await tx.betaVote.deleteMany({ where: { featureRequestId: { in: features.map((f) => f.id) } } });
      }
      // Delete bugs and features
      await tx.betaBugReport.deleteMany({ where: { testerId: id } });
      await tx.betaFeatureRequest.deleteMany({ where: { testerId: id } });
      // Delete tester
      await tx.betaTester.delete({ where: { id } });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete tester error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete tester";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function sendApprovalEmail(email: string, name: string) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) return;

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: process.env.SENDGRID_FROM_EMAIL || "beta@adaptensor.io", name: "Adaptensor Beta" },
      subject: "Your Adaptensor Beta Access Has Been Approved",
      content: [
        {
          type: "text/html",
          value: `
            <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Welcome to the Adaptensor Beta, ${name}!</h2>
              <p>Your beta testing account has been approved. You now have full access to the beta portal.</p>
              <p><a href="https://beta.adaptensor.io/portal" style="display: inline-block; padding: 12px 24px; background: #F4D225; color: #060505; text-decoration: none; border-radius: 8px; font-weight: 600;">Open Beta Portal</a></p>
              <p style="color: #666; font-size: 14px;">Submit bug reports, request features, and help shape the future of Adaptensor.</p>
              <p style="color: #999; font-size: 12px;">— The Adaptensor Team</p>
            </div>
          `,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`SendGrid API returned ${response.status}`);
  }
}
