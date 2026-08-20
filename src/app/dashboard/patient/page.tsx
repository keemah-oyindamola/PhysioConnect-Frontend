import { Calendar, Activity, FileText, ArrowRight } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function PatientDashboardPage() {
  const session = await getSession();

  const patient = await prisma.patient.findUnique({
    where: { userId: session!.userId },
    include: {
      appointments: {
        orderBy: { dateTime: "asc" },
        where: { dateTime: { gte: new Date() } },
        take: 5,
      },
      user: { select: { name: true } },
    },
  });

  const upcomingCount = patient?.appointments.length ?? 0;

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-coral mb-1">
        Welcome back
      </p>
      <h1 className="font-display text-[28px] font-medium tracking-tight mb-8">
        Hi, {patient?.user.name.split(" ")[0]}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-parchment rounded-2xl border border-ink/8 p-5">
          <Calendar size={18} className="text-teal mb-3" />
          <p className="font-display text-[24px] font-medium">{upcomingCount}</p>
          <p className="text-[12px] text-ink/50">upcoming appointments</p>
        </div>
        <div className="bg-teal-wash rounded-2xl border border-ink/8 p-5">
          <Activity size={18} className="text-coral mb-3" />
          <p className="font-display text-[15px] font-medium">No exercises yet</p>
          <p className="text-[12px] text-ink/50">assigned after your first visit</p>
        </div>
        <div className="bg-coral-wash rounded-2xl border border-ink/8 p-5">
          <FileText size={18} className="text-amber mb-3" />
          <p className="font-display text-[15px] font-medium">No records yet</p>
          <p className="text-[12px] text-ink/50">created by your therapist</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-ink/8 p-6">
        <h2 className="font-display text-[18px] font-medium mb-4">
          Upcoming appointments
        </h2>

        {upcomingCount === 0 ? (
          <div className="text-center py-10">
            <Calendar size={28} className="mx-auto text-ink/20 mb-3" />
            <p className="text-[14px] text-ink/60 mb-1">No appointments booked yet.</p>
            <p className="text-[12.5px] text-ink/40 mb-5">
              Book your first session to get started.
            </p>
            <button className="bg-teal text-white text-[13.5px] font-medium px-5 py-2.5 rounded-full inline-flex items-center gap-2 hover:bg-[#195a4a] transition-colors">
              Book an appointment <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-ink/6">
            {patient!.appointments.map((appt) => (
              <div key={appt.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[13.5px] font-medium">{appt.reason}</p>
                  <p className="text-[12px] text-ink/50">
                    {appt.dateTime.toLocaleString()}
                  </p>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-teal/10 text-teal">
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}