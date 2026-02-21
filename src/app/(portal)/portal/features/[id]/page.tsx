import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { SEVERITY_COLORS, FEATURE_STATUS_COLORS } from "@/lib/constants";
import { isAdmin } from "@/lib/auth";
import VoteButton from "@/components/portal/VoteButton";
import CommentThread from "@/components/portal/CommentThread";

export default async function FeatureDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  try {
    const feature = await prisma.betaFeatureRequest.findUnique({
      where: { id },
      include: {
        tester: { select: { id: true, name: true, email: true, clerkUserId: true } },
        attachments: true,
        comments: {
          include: { tester: { select: { name: true } } },
          orderBy: { createdAt: "asc" },
        },
        votes: { select: { testerId: true } },
      },
    });

    if (!feature) notFound();

    const isOwner = feature.tester.clerkUserId === userId;
    const admin = isAdmin(userId);

    // Check if current user voted
    const currentTester = await prisma.betaTester.findUnique({
      where: { clerkUserId: userId },
      select: { id: true },
    });
    const hasVoted = currentTester
      ? feature.votes.some((v) => v.testerId === currentTester.id)
      : false;

    const commentsForThread = feature.comments.map((c) => ({
      id: c.id,
      authorName: c.authorName,
      isAdmin: c.isAdmin,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
    }));

    return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/portal/tracker"
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="text-sm font-mono text-brand-yellow font-bold">
          {feature.requestNumber}
        </span>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
            SEVERITY_COLORS[feature.priority] || ""
          }`}
        >
          {feature.priority}
        </span>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
            FEATURE_STATUS_COLORS[feature.status] || ""
          }`}
        >
          {feature.status}
        </span>
      </div>

      {/* Title & Vote */}
      <div className="flex items-start justify-between gap-4 mb-2">
        <h1 className="text-2xl font-bold text-white">{feature.title}</h1>
        <VoteButton
          featureId={feature.id}
          initialVoted={hasVoted}
          initialCount={feature.voteCount}
        />
      </div>
      <p className="text-sm text-zinc-500 mb-6">
        Requested by{" "}
        <span className="text-zinc-300">{feature.tester.name}</span> on{" "}
        {formatDate(feature.createdAt)} ({formatRelativeTime(feature.createdAt)})
        {feature.category && (
          <>
            {" "}
            in <span className="text-brand-yellow">{feature.category}</span>
          </>
        )}
      </p>

      {/* Owner / admin tag */}
      {(isOwner || admin) && (
        <div className="mb-6">
          <span className="text-xs text-zinc-600">
            {isOwner ? "You submitted this request" : "Admin access"}
          </span>
        </div>
      )}

      {/* Description */}
      <div className="space-y-4 mb-8">
        <div className="bg-brand-card border border-brand-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-zinc-300 mb-2">
            Description
          </h3>
          <p className="text-sm text-zinc-400 whitespace-pre-wrap">
            {feature.description}
          </p>
        </div>

        {feature.useCase && (
          <div className="bg-brand-card border border-brand-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-brand-yellow mb-2">
              Use Case
            </h3>
            <p className="text-sm text-zinc-400 whitespace-pre-wrap">
              {feature.useCase}
            </p>
          </div>
        )}

        {/* Admin Response */}
        {feature.adminResponse && (
          <div className="bg-brand-yellow/5 border border-brand-yellow/20 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-brand-yellow mb-2">
              Admin Response
            </h3>
            <p className="text-sm text-zinc-300">{feature.adminResponse}</p>
          </div>
        )}

        {/* Target Version */}
        {feature.targetVersion && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Target Version:</span>
            <span className="text-sm font-mono text-brand-cyan">
              {feature.targetVersion}
            </span>
          </div>
        )}
      </div>

      {/* Comments */}
      <CommentThread
        type="feature"
        issueId={feature.id}
        initialComments={commentsForThread}
      />
    </div>
    );
  } catch (error) {
    console.error("[Feature Detail] Database error:", error);
    notFound();
  }
}
