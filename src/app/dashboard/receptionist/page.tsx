import { Users, Calendar, UserPlus, Clock } from "lucide-react";
import { prisma } from "@/lib/db";

export default async function ReceptionistDashboardPage() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const [totalPatients, todaysAppointments, upcomingAppointments] = await Promise.all([
    prisma.user.count({ where: { role: "PATIENT" } }),
    prisma.appointment.count({
      where: { dateTime: { gte: todayStart, lt: todayEnd } },
    }),
    prisma.appointment.findMany({
      where: { dateTime: { gte: now } },
      orderBy: { dateTime: "asc" },
      take: 6,
      include: {
        patient: { include: { user: { select: { name: true } } } },
        therapist: { include: { user: { select: { name: true } } } },
      },
    }),
  ]);

  const stats = [
    { label: "Total patients", value: totalPatients, icon: Users, surface: "bg-teal-wash" },
    { label: "Today's appointments", value: todaysAppointments, icon: Clock, surface: "bg-coral-wash" },
  ];

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-coral mb-1">
        Front desk
      </p>
      <h1 className="font-display text-[28px] font-medium tracking-tight mb-8">
        Today at the clinic
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
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
        <a
          href="/dashboard/receptionist/register"
          className="col-span-2 bg-teal rounded-2xl p-5 flex flex-col justify-center items-center text-white hover:bg-[#195a4a] transition-colors"
        >
          <UserPlus size={20} className="mb-2" />
          <p className="text-[13.5px] font-medium">Register a patient</p>
        </a>
      </div>

      <div className="bg-white rounded-2xl border border-ink/8 p-6">
        <h2 className="font-display text-[18px] font-medium mb-4">Upcoming appointments</h2>

        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-10">
            <Calendar size={28} className="mx-auto text-ink/20 mb-3" />
            <p className="text-[14px] text-ink/60 mb-1">Nothing scheduled yet.</p>
            <p className="text-[12.5px] text-ink/40">
              Booked appointments across all therapists will appear here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-ink/6">
            {upcomingAppointments.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[13.5px] font-medium">{appt.patient.user.name}</p>
                  <p className="text-[12px] text-ink/50">
                    with {appt.therapist.user.name} — {appt.reason}
                  </p>
                </div>
                <p className="text-[12.5px] font-mono text-ink/60">
                  {appt.dateTime.toLocaleString([], {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}