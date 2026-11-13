import Link from "next/link";
import { prisma } from "@/lib/db";
import { CLINIC_TZ } from "@/lib/booking";
import { RegisterPatientForm } from "@/components/dashboard/RegisterPatientForm";

export default async function RegisterPatientPage() {
  const recent = await prisma.user.findMany({
    where: { role: "PATIENT" },
    orderBy: { createdAt: "desc" },
    take: 8,
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-coral mb-1">
        Register patient
      </p>
      <h1 className="font-display text-[28px] font-medium tracking-tight mb-8">
        Add a new patient
      </h1>

      <div className="bg-white rounded-2xl border border-ink/8 p-6 mb-6">
        <h2 className="font-display text-[17px] font-medium mb-1">Patient details</h2>
        <p className="text-[12.5px] text-ink/50 mb-4">
          The patient gets an email with a link to set their own password. Once they&apos;re
          registered, book their first visit from{" "}
          <Link
            href="/dashboard/receptionist/appointments"
            className="text-teal font-medium hover:underline"
          >
            Appointments
          </Link>
          .
        </p>
        <RegisterPatientForm />
      </div>

      <div className="bg-white rounded-2xl border border-ink/8 p-6">
        <h2 className="font-display text-[17px] font-medium mb-4">Recently registered</h2>
        {recent.length === 0 ? (
          <p className="text-[13.5px] text-ink/50 text-center py-6">No patients yet.</p>
        ) : (
          <div className="flex flex-col divide-y divide-ink/6">
            {recent.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-[13.5px] font-medium truncate">{p.name}</p>
                  <p className="text-[12px] text-ink/50 truncate">{p.email}</p>
                </div>
                <p className="text-[12px] text-ink/50 shrink-0">
                  {p.createdAt.toLocaleDateString("en-GB", {
                    timeZone: CLINIC_TZ,
                    day: "numeric",
                    month: "short",
                    year: "numeric",
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