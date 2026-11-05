import Link from "next/link";
import { Users, Calendar, CalendarPlus, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { clinicDayRange, formatDateTime } from "@/lib/booking";

const statusStyle: Record<string, string> = {
  PENDING: "bg-amber/10 text-amber",
  CONFIRMED: "bg-teal/10 text-teal",
};

export default async function ReceptionistDashboardPage() {
  const now = new Date();
  const { start, end } = clinicDayRange();

  const [totalPatients, todaysCount, upcomingAppointments] = await Promise.all([
    prisma.patient.count({ where: { user: { isActive: true } } }),
    prisma.appointment.count({
      where: { dateTime: { gte: start, lt: end }, status: { not: "CANCELLED" } },
    }),
    prisma.appointment.findMany({
      where: { dateTime: { gte: now }, status: { in: ["PENDING", "CONFIRMED"] } },
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
    { label: "Today's appointments", value: todaysCount, icon: Clock, surface: "bg-coral-wash" },
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
        <Link
          href="/dashboard/receptionist/appointments"
          className="col-span-2 bg-teal rounded-2xl p-5 flex flex-col justify-center items-center text-white hover:bg-[#195a4a] transition-colors"
        >
          <CalendarPlus size={20} className="mb-2" />
          <p className="text-[13.5px] font-medium">Book an appointment</p>
        </Link>
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
              <div key={appt.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium">{appt.patient.user.name}</p>
                  <p className="text-[12px] text-ink/50 truncate">
                    with {appt.therapist.user.name} · {appt.reason}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[12.5px] font-mono text-ink/60">
                    {formatDateTime(appt.dateTime)}
                  </p>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusStyle[appt.status]}`}
                  >
                    {appt.status.charAt(0) + appt.status.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}