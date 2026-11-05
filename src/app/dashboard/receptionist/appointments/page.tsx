import { Calendar } from "lucide-react";
import { prisma } from "@/lib/db";
import { BookingForm } from "@/components/dashboard/BookingForm";
import { AppointmentActionButton } from "@/components/dashboard/AppointmentActionButton";
import {
  MAX_DAYS_AHEAD,
  addDays,
  clinicDayRange,
  formatDateTime,
  formatTime,
  todayInClinic,
} from "@/lib/booking";

const statusStyle: Record<string, string> = {
  PENDING: "bg-amber/10 text-amber",
  CONFIRMED: "bg-teal/10 text-teal",
  COMPLETED: "bg-ink/8 text-ink/60",
  CANCELLED: "bg-coral/10 text-coral",
  EXPIRED: "bg-ink/8 text-ink/50",
};

const include = {
  patient: { include: { user: { select: { name: true } } } },
  therapist: { include: { user: { select: { name: true } } } },
} as const;

export default async function ReceptionistAppointmentsPage() {
  const now = new Date();
  const today = todayInClinic();
  const { start, end } = clinicDayRange(today);

  const [therapists, patients, todays, upcoming, recent] = await Promise.all([
    prisma.therapist.findMany({
      where: { user: { isActive: true } },
      select: { id: true, specialty: true, user: { select: { name: true } } },
      orderBy: { user: { name: "asc" } },
    }),
    prisma.patient.findMany({
      where: { user: { isActive: true } },
      select: { id: true, user: { select: { name: true, email: true } } },
      orderBy: { user: { name: "asc" } },
      take: 500,
    }),
    prisma.appointment.findMany({
      where: { dateTime: { gte: start, lt: end }, status: { not: "CANCELLED" } },
      orderBy: { dateTime: "asc" },
      include,
    }),
    prisma.appointment.findMany({
      where: { dateTime: { gte: end }, status: { in: ["PENDING", "CONFIRMED"] } },
      orderBy: { dateTime: "asc" },
      take: 50,
      include,
    }),
    prisma.appointment.findMany({
      where: { OR: [{ dateTime: { lt: start } }, { status: "CANCELLED" }] },
      orderBy: { dateTime: "desc" },
      take: 20,
      include,
    }),
  ]);

  type Appt = (typeof todays)[number];

  const renderRow = (a: Appt, { withDate, canCancel }: { withDate: boolean; canCancel: boolean }) => {
    // A request nobody confirmed before its time passed is just stale.
    const label = a.status === "PENDING" && a.dateTime <= now ? "EXPIRED" : a.status;
    const cancellable =
      canCancel && (a.status === "PENDING" || a.status === "CONFIRMED") && a.dateTime > now;

    return (
      <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="min-w-0">
          <p className="text-[13.5px] font-medium">
            {withDate ? formatDateTime(a.dateTime) : formatTime(a.dateTime)} · {a.patient.user.name}
          </p>
          <p className="text-[12px] text-ink/50 truncate">
            with {a.therapist.user.name} · {a.reason}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusStyle[label]}`}>
            {label.charAt(0) + label.slice(1).toLowerCase()}
          </span>
          {cancellable && (
            <AppointmentActionButton
              id={a.id}
              action="cancel"
              label="Cancel"
              variant="danger"
              confirmMessage="Cancel this appointment? The time will be released and the patient will see it as cancelled."
            />
          )}
        </div>
      </div>
    );
  };

  const section = (
    title: string,
    items: Appt[],
    options: { withDate: boolean; canCancel: boolean },
    emptyText: string
  ) => (
    <div className="bg-white rounded-2xl border border-ink/8 p-6 mb-6">
      <h2 className="font-display text-[17px] font-medium mb-4">
        {title} ({items.length})
      </h2>
      {items.length === 0 ? (
        <div className="text-center py-6">
          <Calendar size={26} className="mx-auto text-ink/20 mb-2" />
          <p className="text-[13.5px] text-ink/50">{emptyText}</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-ink/6">
          {items.map((a) => renderRow(a, options))}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-coral mb-1">
        Appointments
      </p>
      <h1 className="font-display text-[28px] font-medium tracking-tight mb-8">
        Front desk schedule
      </h1>

      <div className="bg-white rounded-2xl border border-ink/8 p-6 mb-6">
        <h2 className="font-display text-[17px] font-medium mb-4">Book for a patient</h2>
        <BookingForm
          therapists={therapists.map((t) => ({
            id: t.id,
            name: t.user.name,
            specialty: t.specialty,
          }))}
          patients={patients.map((p) => ({
            id: p.id,
            name: p.user.name,
            email: p.user.email,
          }))}
          minDate={today}
          maxDate={addDays(today, MAX_DAYS_AHEAD)}
        />
      </div>

      {section("Today", todays, { withDate: false, canCancel: true }, "Nothing scheduled today.")}
      {section("Upcoming", upcoming, { withDate: true, canCancel: true }, "No upcoming appointments.")}
      {section("Recent", recent, { withDate: true, canCancel: false }, "No past or cancelled appointments yet.")}
    </div>
  );
}