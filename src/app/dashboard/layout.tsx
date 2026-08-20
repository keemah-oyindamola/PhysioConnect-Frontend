import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, role: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-paper text-ink">
      <Sidebar role={user.role.toLowerCase()} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar name={user.name} role={user.role.toLowerCase()} />
        <main className="flex-1 px-6 md:px-10 py-8 max-w-6xl w-full">
          {children}
        </main>
      </div>
    </div>
  );
}