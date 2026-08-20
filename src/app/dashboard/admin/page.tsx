import { Users, Activity, UserCog, Calendar } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [patientCount, therapistCount, receptionistCount, appointmentCount] =
    await Promise.all([
      prisma.user.count({ where: { role: "PATIENT" } }),
      prisma.user.count({ where: { role: "THERAPIST" } }),
      prisma.user.count({ where: { role: "RECEPTIONIST" } }),
      prisma.appointment.count(),
    ]);

  const stats = [
    { label: "Patients", value: patientCount, icon: Users, surface: "bg-teal-wash" },
    { label: "Therapists", value: therapistCount, icon: Activity, surface: "bg-coral-wash" },
    { label: "Receptionists", value: receptionistCount, icon: UserCog, surface: "bg-parchment" },
    { label: "Appointments", value: appointmentCount, icon: Calendar, surface: "bg-sand" },
  ];

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-coral mb-1">
        Overview
      </p>
      <h1 className="font-display text-[28px] font-medium tracking-tight mb-8">
        Clinic at a glance
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`${s.surface} rounded-2xl border border-ink/8 p-5`}>
              <Icon size={18} className="text-ink/50 mb-3" />
              <p className="font-display text-[28px] font-medium leading-none">{s.value}</p>
              <p className="text-[12px] text-ink/50 mt-1.5">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-ink/8 p-6 mt-6">
        <p className="text-[13.5px] text-ink/50">
          Manage physiotherapists and receptionist accounts from the{" "}
          <a href="/dashboard/admin/staff" className="text-teal font-medium hover:underline">
            Staff
          </a>{" "}
          page.
        </p>
      </div>
    </div>
  );
}