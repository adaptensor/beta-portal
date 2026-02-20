import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  if (!isAdmin(userId)) {
    redirect("/portal");
  }

  const user = await currentUser();
  const adminName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Admin";

  return (
    <div className="min-h-screen bg-brand-black">
      <AdminSidebar adminName={adminName} />
      <main className="lg:ml-[250px] min-h-screen">
        <div className="p-6 pt-16 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}
