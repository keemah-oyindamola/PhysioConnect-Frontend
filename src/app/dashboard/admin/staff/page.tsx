import { prisma } from "@/lib/db";
import { StaffForm } from "@/components/dashboard/StaffForm";

export default async function StaffPage() {
  const staff = await prisma.user.findMany({
    where: { role: { in: ["THERAPIST", "RECEPTIONIST", "ADMIN"] } },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const roleBadge: Record<string, string> = {
    THERAPIST: "bg-teal/10 text-teal",
    RECEPTIONIST: "bg-amber/10 text-amber",
    ADMIN: "bg-coral/10 text-coral",
  };

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-coral mb-1">
        Staff
      </p>
      <h1 className="font-display text-[28px] font-medium tracking-tight mb-8">
        Manage staff accounts
      </h1>

      <div className="bg-white rounded-2xl border border-ink/8 p-6 mb-6">
        <h2 className="font-display text-[17px] font-medium mb-4">Add a staff member</h2>
        <StaffForm />
      </div>

      <div className="bg-white rounded-2xl border border-ink/8 p-6">
        <h2 className="font-display text-[17px] font-medium mb-4">
          Current staff ({staff.length})
        </h2>

        {staff.length === 0 ? (
          <p className="text-[13.5px] text-ink/50 text-center py-6">
            No staff accounts yet — add your first one above.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-ink/6">
            {staff.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[13.5px] font-medium">{s.name}</p>
                  <p className="text-[12px] text-ink/50">{s.email}</p>
                </div>
                <span
                  className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${roleBadge[s.role]}`}
                >
                  {s.role.charAt(0) + s.role.slice(1).toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}