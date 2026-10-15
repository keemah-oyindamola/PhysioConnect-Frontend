import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { StaffForm } from "@/components/dashboard/StaffForm";
import { StaffActions } from "@/components/dashboard/StaffActions";

export default async function StaffPage() {
  const session = await getSession();

  const staff = await prisma.user.findMany({
    where: { role: { in: ["THERAPIST", "RECEPTIONIST", "ADMIN"] } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
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
            {staff.map((s) => {
              const isSelf = s.id === session?.userId;
              return (
                <div
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div className={`min-w-0 ${s.isActive ? "" : "opacity-50"}`}>
                    <p className="text-[13.5px] font-medium truncate">
                      {s.name}
                      {isSelf && <span className="text-ink/40 font-normal"> (you)</span>}
                    </p>
                    <p className="text-[12px] text-ink/50 truncate">{s.email}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {!s.isActive && (
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-ink/8 text-ink/60">
                        Deactivated
                      </span>
                    )}
                    <span
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${roleBadge[s.role]}`}
                    >
                      {s.role.charAt(0) + s.role.slice(1).toLowerCase()}
                    </span>
                    {!isSelf && (
                      <StaffActions id={s.id} name={s.name} isActive={s.isActive} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}