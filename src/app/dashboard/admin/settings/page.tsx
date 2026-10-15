import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export default async function AdminSettingsPage() {
  const session = await getSession();

  const user = await prisma.user.findUnique({
    where: { id: session!.userId },
    select: { name: true, email: true },
  });

  return <SettingsForm name={user!.name} email={user!.email} canEditName={true} />;
}