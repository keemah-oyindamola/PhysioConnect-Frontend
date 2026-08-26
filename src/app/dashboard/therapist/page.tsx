import { Calendar, Users, FileText, Clock } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function TherapistDashboardPage() {
  const session = await getSession();

  const therapist = await prisma.therapist.findUnique({
    where: { userId: session!.userId },
    include: {
      user: { select: { name: true } },
      appointments: {
        orderBy: { dateTime: "asc" },
        include: { patient: { include: { user: { select: { name: true } } } } },
      },
    },
  });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const allAppointments = therapist?.appointments ?? [];
  const todaysAppointments = allAppointments.filter(
    (a) => a.dateTime >= todayStart && a.dateTime < todayEnd
  );
  const upcomingCount = allAppointments.filter((a) => a.dateTime >= now).length;
  const uniquePatientIds = new Set(allAppointments.map((a) => a.patientId));

  const stats = [
    { label: "Today's appointments", value: todaysAppointments.length, icon: Clock, surface: "bg-teal-wash" },
    { label: "Upcoming", value: upcomingCount, icon: Calendar, surface: "bg-coral-wash" },
    { label: "Patients seen", value: uniquePatientIds.size, icon: Users, surface: "bg-parchment" },
    { label: "Pending SOAP notes", value: 0, icon: FileText, surface: "bg-sand" },
  ];

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-coral mb-1">
        Welcome back
      </p>
      <h1 className="font-display text-[28px] font-medium tracking-tight mb-8">
        Dr. {therapist?.user.name.split(" ").pop()}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

      <div className="bg-white rounded-2xl border border-ink/8 p-6">
        <h2 className="font-display text-[18px] font-medium mb-4">Today&apos;s appointments</h2>

        {todaysAppointments.length === 0 ? (
          <div className="text-center py-10">
            <Calendar size={28} className="mx-auto text-ink/20 mb-3" />
            <p className="text-[14px] text-ink/60 mb-1">Nothing on the calendar today.</p>
            <p className="text-[12.5px] text-ink/40">
              Appointments will appear here once patients start booking.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-ink/6">
            {todaysAppointments.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[13.5px] font-medium">{appt.patient.user.name}</p>
                  <p className="text-[12px] text-ink/50">{appt.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12.5px] font-mono text-ink/60">
                    {appt.dateTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-teal/10 text-teal">
                    {appt.status}
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