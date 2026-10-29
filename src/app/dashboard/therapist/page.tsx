import Link from "next/link";
import { Calendar, Users, Clock, Activity } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { clinicDayRange, formatTime } from "@/lib/booking";

const statusStyle: Record<string, string> = {
  PENDING: "bg-amber/10 text-amber",
  CONFIRMED: "bg-teal/10 text-teal",
  COMPLETED: "bg-ink/8 text-ink/60",
};

export default async function TherapistDashboardPage() {
  const session = await getSession();

  const therapist = await prisma.therapist.findUnique({
    where: { userId: session!.userId },
    select: { id: true, user: { select: { name: true } } },
  });

  if (!therapist) {
    return (
      <p className="text-[14px] text-ink/60">
        Your physiotherapist profile isn&apos;t set up yet. Please contact your administrator.
      </p>
    );
  }

  const now = new Date();
  const { start, end } = clinicDayRange();
  const therapistId = therapist.id;

  const [todays, upcomingCount, awaitingCount, patientsSeen] = await Promise.all([
    prisma.appointment.findMany({
      where: { therapistId, dateTime: { gte: start, lt: end }, status: { not: "CANCELLED" } },
      orderBy: { dateTime: "asc" },
      include: { patient: { include: { user: { select: { name: true } } } } },
    }),
    prisma.appointment.count({
      where: { therapistId, dateTime: { gte: now }, status: { in: ["PENDING", "CONFIRMED"] } },
    }),
    prisma.appointment.count({
      where: { therapistId, dateTime: { gte: now }, status: "PENDING" },
    }),
    prisma.appointment.findMany({
      where: { therapistId, status: "COMPLETED" },
      distinct: ["patientId"],
      select: { patientId: true },
    }),
  ]);

  const stats = [
    { label: "Today's appointments", value: todays.length, icon: Clock, surface: "bg-teal-wash", href: null },
    { label: "Upcoming", value: upcomingCount, icon: Calendar, surface: "bg-coral-wash", href: null },
    { label: "Patients seen", value: patientsSeen.length, icon: Users, surface: "bg-parchment", href: null },
    {
      label: "Awaiting confirmation",
      value: awaitingCount,
      icon: Activity,
      surface: "bg-sand",
      href: "/dashboard/therapist/appointments",
    },
  ];

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-coral mb-1">
        Welcome back
      </p>
      <h1 className="font-display text-[28px] font-medium tracking-tight mb-8">
        Dr. {therapist.user.name.split(" ").pop()}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          const card = (
            <div className={`${s.surface} rounded-2xl border border-ink/8 p-5 h-full`}>
              <Icon size={18} className="text-ink/50 mb-3" />
              <p className="font-display text-[28px] font-medium leading-none">{s.value}</p>
              <p className="text-[12px] text-ink/50 mt-1.5">{s.label}</p>
            </div>
          );
          return s.href ? (
            <Link key={s.label} href={s.href}>
              {card}
            </Link>
          ) : (
            <div key={s.label}>{card}</div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-ink/8 p-6">
        <h2 className="font-display text-[18px] font-medium mb-4">Today&apos;s appointments</h2>

        {todays.length === 0 ? (
          <div className="text-center py-10">
            <Calendar size={28} className="mx-auto text-ink/20 mb-3" />
            <p className="text-[14px] text-ink/60 mb-1">Nothing on the calendar today.</p>
            <p className="text-[12.5px] text-ink/40">
              Appointments will appear here once patients start booking.
            </p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-ink/6">
            {todays.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[13.5px] font-medium">{appt.patient.user.name}</p>
                  <p className="text-[12px] text-ink/50">{appt.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-[12.5px] font-mono text-ink/60">{formatTime(appt.dateTime)}</p>
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