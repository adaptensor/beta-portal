import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

const TYPE_STYLES: Record<string, string> = {
  release: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  update: "bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30",
  breaking: "bg-red-500/20 text-red-400 border-red-500/30",
  maintenance: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export default async function AnnouncementsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  try {
    const announcements = await prisma.betaAnnouncement.findMany({
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
    });

    return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Announcements</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Platform updates, releases, and important notices.
        </p>
      </div>

      {announcements.length === 0 ? (
        <div className="bg-brand-card border border-brand-border rounded-xl p-12 text-center">
          <p className="text-zinc-500">No announcements yet. Stay tuned!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div
              key={a.id}
              className={`bg-brand-card border rounded-xl p-6 ${
                a.isPinned
                  ? "border-brand-yellow/30"
                  : "border-brand-border"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                {a.isPinned && (
                  <span className="flex items-center gap-1 text-brand-yellow text-xs">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                    </svg>
                    Pinned
                  </span>
                )}
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    TYPE_STYLES[a.type] || TYPE_STYLES.update
                  }`}
                >
                  {a.type}
                </span>
                {a.version && (
                  <span className="text-xs font-mono text-zinc-500">
                    {a.version}
                  </span>
                )}
                <span className="text-xs text-zinc-600 ml-auto">
                  {formatDate(a.publishedAt)}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">
                {a.title}
              </h2>
              <div className="text-sm text-zinc-400 whitespace-pre-wrap leading-relaxed">
                {a.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    );
  } catch (error) {
    console.error("[Announcements] Database error:", error);
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Announcements</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Platform updates, releases, and important notices.
          </p>
        </div>
        <div className="bg-brand-card border border-brand-border rounded-xl p-12 text-center">
          <p className="text-zinc-500">No announcements available at this time.</p>
        </div>
      </div>
    );
  }
}
