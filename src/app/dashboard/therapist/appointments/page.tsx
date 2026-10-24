import { Calendar } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDateTime } from "@/lib/booking";
import { AppointmentActionButton } from "@/components/dashboard/AppointmentActionButton";

const statusStyle: Record<string, string> = {
  PENDING: "bg-amber/10 text-amber",
  CONFIRMED: "bg-teal/10 text-teal",
  COMPLETED: "bg-ink/8 text-ink/60",
  CANCELLED: "bg-coral/10 text-coral",
  EXPIRED: "bg-ink/8 text-ink/50",
};

export default async function TherapistAppointmentsPage() {
  const session = await getSession();

  const therapist = await prisma.therapist.findUnique({
    where: { userId: session!.userId },
    include: {
      appointments: {
        orderBy: { dateTime: "asc" },
        include: { patient: { include: { user: { select: { name: true } } } } },
      },
    },
  });

  if (!therapist) {
    return (
      <p className="text-[14px] text-ink/60">
        Your physiotherapist profile isn&apos;t set up yet. Please contact your administrator.
      </p>
    );
  }

  const now = new Date();
  const all = therapist.appointments;
  type Appt = (typeof all)[number];

  const toConfirm = all.filter((a) => a.status === "PENDING" && a.dateTime > now);
  const toComplete = all.filter((a) => a.status === "CONFIRMED" && a.dateTime <= now);
  const upcoming = all.filter((a) => a.status === "CONFIRMED" && a.dateTime > now);

  const active = new Set<Appt>([...toConfirm, ...toComplete, ...upcoming]);
  const history = all
    .filter((a) => !active.has(a))
    .sort((a, b) => b.dateTime.getTime() - a.dateTime.getTime())
    .slice(0, 30);

  const renderRow = (appt: Appt, actions?: React.ReactNode) => {
    // A request nobody confirmed before its time passed is just stale.
    const label =
      appt.status === "PENDING" && appt.dateTime <= now ? "EXPIRED" : appt.status;

    return (
      <div key={appt.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="min-w-0">
          <p className="text-[13.5px] font-medium">{appt.patient.user.name}</p>
          <p className="text-[12px] text-ink/50 truncate">
            {formatDateTime(appt.dateTime)} · {appt.reason}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${statusStyle[label]}`}>
            {label.charAt(0) + label.slice(1).toLowerCase()}
          </span>
          {actions}
        </div>
      </div>
    );
  };

  const section = (
    title: string,
    hint: string,
    items: Appt[],
    actionsFor?: (a: Appt) => React.ReactNode
  ) =>
    items.length === 0 ? null : (
      <div className="bg-white rounded-2xl border border-ink/8 p-6 mb-6">
        <h2 className="font-display text-[17px] font-medium">
          {title} ({items.length})
        </h2>
        <p className="text-[12.5px] text-ink/50 mb-4">{hint}</p>
        <div className="flex flex-col divide-y divide-ink/6">
          {items.map((a) => renderRow(a, actionsFor?.(a)))}
        </div>
      </div>
    );

  const nothingActive =
    toConfirm.length === 0 && toComplete.length === 0 && upcoming.length === 0;

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-coral mb-1">
        Appointments
      </p>
      <h1 className="font-display text-[28px] font-medium tracking-tight mb-8">
        Your schedule
      </h1>

      {nothingActive && (
        <div className="bg-white rounded-2xl border border-ink/8 p-10 text-center mb-6">
          <Calendar size={28} className="mx-auto text-ink/20 mb-3" />
          <p className="text-[14px] text-ink/60 mb-1">Nothing needs your attention.</p>
          <p className="text-[12.5px] text-ink/40">
            New booking requests from patients will appear here.
          </p>
        </div>
      )}

      {section(
        "Needs your confirmation",
        "Patients have asked for these times. Confirm to lock them in, or decline to release the slot.",
        toConfirm,
        (a) => (
          <div className="flex gap-2">
            <AppointmentActionButton id={a.id} action="confirm" label="Confirm" />
            <AppointmentActionButton
              id={a.id}
              action="cancel"
              label="Decline"
              variant="danger"
              confirmMessage="Decline this request? The time will be released and the patient will see it as cancelled."
            />
          </div>
        )
      )}

      {section(
        "Ready to complete",
        "These visits have taken place. Mark them complete once you've seen the patient.",
        toComplete,
        (a) => <AppointmentActionButton id={a.id} action="complete" label="Mark complete" />
      )}

      {section(
        "Upcoming",
        "Confirmed visits.",
        upcoming,
        (a) => (
          <AppointmentActionButton
            id={a.id}
            action="cancel"
            label="Cancel"
            variant="danger"
            confirmMessage="Cancel this confirmed appointment? The time will be released and the patient will see it as cancelled."
          />
        )
      )}

      {section("History", "Your 30 most recent past or cancelled appointments.", history)}
    </div>
  );
}