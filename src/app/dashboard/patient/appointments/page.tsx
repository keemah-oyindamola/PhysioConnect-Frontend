import { Calendar } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { BookingForm } from "@/components/dashboard/BookingForm";
import { CancelAppointmentButton } from "@/components/dashboard/CancelAppointmentButton";
import { MAX_DAYS_AHEAD, addDays, formatDateTime, todayInClinic } from "@/lib/booking";

const statusStyle: Record<string, string> = {
  PENDING: "bg-amber/10 text-amber",
  CONFIRMED: "bg-teal/10 text-teal",
  COMPLETED: "bg-ink/8 text-ink/60",
  CANCELLED: "bg-coral/10 text-coral",
};

export default async function PatientAppointmentsPage() {
  const session = await getSession();

  const [therapists, patient] = await Promise.all([
    prisma.therapist.findMany({
      where: { user: { isActive: true } },
      select: { id: true, specialty: true, user: { select: { name: true } } },
      orderBy: { user: { name: "asc" } },
    }),
    prisma.patient.findUnique({
      where: { userId: session!.userId },
      include: {
        appointments: {
          orderBy: { dateTime: "desc" },
          include: { therapist: { include: { user: { select: { name: true } } } } },
        },
      },
    }),
  ]);

  const now = new Date();
  const all = patient?.appointments ?? [];
  const upcoming = all
    .filter((a) => a.dateTime >= now && (a.status === "PENDING" || a.status === "CONFIRMED"))
    .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());
  const history = all.filter((a) => !upcoming.includes(a));

  const today = todayInClinic();

  const renderRow = (appt: (typeof all)[number], canCancel: boolean) => (
    <div key={appt.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="text-[13.5px] font-medium">{formatDateTime(appt.dateTime)}</p>
        <p className="text-[12px] text-ink/50 truncate">
          with {appt.therapist.user.name} · {appt.reason}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusStyle[appt.status]}`}>
          {appt.status.charAt(0) + appt.status.slice(1).toLowerCase()}
        </span>
        {canCancel && <CancelAppointmentButton id={appt.id} />}
      </div>
    </div>
  );

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-coral mb-1">
        Appointments
      </p>
      <h1 className="font-display text-[28px] font-medium tracking-tight mb-8">
        Book and manage your visits
      </h1>

      <div className="bg-white rounded-2xl border border-ink/8 p-6 mb-6">
        <h2 className="font-display text-[17px] font-medium mb-4">Book an appointment</h2>
        <BookingForm
          therapists={therapists.map((t) => ({
            id: t.id,
            name: t.user.name,
            specialty: t.specialty,
          }))}
          minDate={today}
          maxDate={addDays(today, MAX_DAYS_AHEAD)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-ink/8 p-6 mb-6">
        <h2 className="font-display text-[17px] font-medium mb-4">
          Upcoming ({upcoming.length})
        </h2>
        {upcoming.length === 0 ? (
          <div className="text-center py-8">
            <Calendar size={26} className="mx-auto text-ink/20 mb-2" />
            <p className="text-[13.5px] text-ink/50">Nothing booked yet.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-ink/6">
            {upcoming.map((a) => renderRow(a, true))}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="bg-white rounded-2xl border border-ink/8 p-6">
          <h2 className="font-display text-[17px] font-medium mb-4">History</h2>
          <div className="flex flex-col divide-y divide-ink/6">
            {history.map((a) => renderRow(a, false))}
          </div>
        </div>
      )}
    </div>
  );
}