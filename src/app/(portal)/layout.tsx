import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import PortalSidebar from "@/components/portal/PortalSidebar";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const tester = await prisma.betaTester.findUnique({
    where: { clerkUserId: userId },
  });

  // Not a registered beta tester
  if (!tester) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-brand-card border border-brand-border rounded-xl p-8 text-center">
          <Image
            src="/logoA.svg"
            alt="Adaptensor"
            width={48}
            height={48}
            className="mx-auto mb-6"
          />
          <h1 className="text-xl font-bold text-white mb-2">
            Beta Access Required
          </h1>
          <p className="text-zinc-400 mb-6">
            You need to register for the beta program to access the portal.
            It only takes a minute.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-yellow text-brand-black font-semibold rounded-lg hover:bg-brand-yellow/90 transition-colors"
            >
              Register for Beta
            </Link>
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Tester exists but pending approval
  if (tester.status === "pending") {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-brand-card border border-brand-border rounded-xl p-8 text-center">
          <Image
            src="/logoA.svg"
            alt="Adaptensor"
            width={48}
            height={48}
            className="mx-auto mb-6"
          />
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-yellow/10 border border-brand-yellow/20 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-brand-yellow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white mb-2">
            Application Under Review
          </h1>
          <p className="text-zinc-400 mb-4">
            Thanks for registering, <span className="text-white">{tester.name}</span>!
            Your application is being reviewed. We&apos;ll notify you at{" "}
            <span className="text-brand-cyan">{tester.email}</span> once
            approved.
          </p>
          <p className="text-xs text-zinc-600">
            Applied {new Date(tester.registeredAt).toLocaleDateString()}
          </p>
          <Link
            href="/"
            className="inline-block mt-6 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  // Suspended tester
  if (tester.status === "suspended") {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-brand-card border border-brand-border rounded-xl p-8 text-center">
          <h1 className="text-xl font-bold text-red-400 mb-2">
            Access Suspended
          </h1>
          <p className="text-zinc-400">
            Your beta tester account has been suspended. Please contact
            support if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  // Update last active
  await prisma.betaTester.update({
    where: { id: tester.id },
    data: { lastActiveAt: new Date() },
  });

  const testerName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : tester.name;

  return (
    <div className="min-h-screen bg-brand-black">
      <PortalSidebar testerName={testerName} />
      <main className="lg:ml-[250px] min-h-screen">
        <div className="p-6 pt-16 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}
