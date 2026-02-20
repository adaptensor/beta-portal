import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { SEVERITY_COLORS, BUG_STATUS_COLORS } from "@/lib/constants";
import { isAdmin } from "@/lib/auth";
import CommentThread from "@/components/portal/CommentThread";

export default async function BugDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { id } = await params;

  const bug = await prisma.betaBugReport.findUnique({
    where: { id },
    include: {
      tester: { select: { id: true, name: true, email: true, clerkUserId: true } },
      attachments: true,
      comments: {
        include: { tester: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { votes: true } },
    },
  });

  if (!bug) notFound();

  const isOwner = bug.tester.clerkUserId === userId;
  const admin = isAdmin(userId);

  const commentsForThread = bug.comments.map((c) => ({
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
        <span className="text-sm font-mono text-brand-cyan font-bold">
          {bug.reportNumber}
        </span>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
            SEVERITY_COLORS[bug.severity] || ""
          }`}
        >
          {bug.severity}
        </span>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
            BUG_STATUS_COLORS[bug.status] || ""
          }`}
        >
          {bug.status}
        </span>
      </div>

      {/* Title & meta */}
      <h1 className="text-2xl font-bold text-white mb-2">{bug.title}</h1>
      <p className="text-sm text-zinc-500 mb-6">
        Reported by <span className="text-zinc-300">{bug.tester.name}</span> on{" "}
        {formatDate(bug.createdAt)} ({formatRelativeTime(bug.createdAt)})
        {bug.category && (
          <>
            {" "}
            in{" "}
            <span className="text-brand-cyan">{bug.category}</span>
          </>
        )}
      </p>

      {/* Edit button */}
      {(isOwner || admin) && (
        <div className="mb-6">
          <span className="text-xs text-zinc-600">
            {isOwner ? "You submitted this report" : "Admin access"}
          </span>
        </div>
      )}

      {/* Detail sections */}
      <div className="space-y-4 mb-8">
        {bug.stepsToReproduce && (
          <div className="bg-brand-card border border-brand-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-zinc-300 mb-2">
              Steps to Reproduce
            </h3>
            <p className="text-sm text-zinc-400 whitespace-pre-wrap">
              {bug.stepsToReproduce}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bug.expectedBehavior && (
            <div className="bg-brand-card border border-brand-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-emerald-400 mb-2">
                Expected Behavior
              </h3>
              <p className="text-sm text-zinc-400 whitespace-pre-wrap">
                {bug.expectedBehavior}
              </p>
            </div>
          )}
          {bug.actualBehavior && (
            <div className="bg-brand-card border border-brand-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-red-400 mb-2">
                Actual Behavior
              </h3>
              <p className="text-sm text-zinc-400 whitespace-pre-wrap">
                {bug.actualBehavior}
              </p>
            </div>
          )}
        </div>

        {/* Technical details */}
        {(bug.pageUrl || bug.consoleErrors || bug.browserOs) && (
          <div className="bg-brand-card border border-brand-border rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300">
              Technical Details
            </h3>
            {bug.pageUrl && (
              <div>
                <span className="text-xs text-zinc-500">Page URL: </span>
                <span className="text-sm text-brand-cyan font-mono">
                  {bug.pageUrl}
                </span>
              </div>
            )}
            {bug.browserOs && (
              <div>
                <span className="text-xs text-zinc-500">Browser & OS: </span>
                <span className="text-sm text-zinc-300">{bug.browserOs}</span>
              </div>
            )}
            {bug.consoleErrors && (
              <div>
                <span className="text-xs text-zinc-500 block mb-1">
                  Console Errors:
                </span>
                <pre className="text-xs text-red-400 bg-brand-dark border border-brand-border rounded-lg p-3 overflow-x-auto font-mono">
                  {bug.consoleErrors}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Resolution (if fixed) */}
        {bug.resolution && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-emerald-400 mb-2">
              Resolution
            </h3>
            <p className="text-sm text-zinc-300">{bug.resolution}</p>
            {bug.fixedInVersion && (
              <p className="text-xs text-zinc-500 mt-2">
                Fixed in {bug.fixedInVersion}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Attachments */}
      {bug.attachments.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-zinc-300 mb-3">
            Attachments ({bug.attachments.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bug.attachments.map((att) => (
              <a
                key={att.id}
                href={att.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brand-card border border-brand-border rounded-lg overflow-hidden hover:border-brand-cyan/30 transition-colors"
              >
                {att.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={att.fileUrl}
                    alt={att.fileName}
                    className="w-full h-24 object-cover"
                  />
                ) : (
                  <div className="w-full h-24 flex items-center justify-center text-zinc-500">
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <p className="text-[10px] text-zinc-500 p-2 truncate">
                  {att.fileName}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <CommentThread
        type="bug"
        issueId={bug.id}
        initialComments={commentsForThread}
      />
    </div>
  );
}
