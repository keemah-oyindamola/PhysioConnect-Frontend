import { Users, Activity, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";

const roleCards = [
  {
    icon: Users,
    title: "Patients",
    copy: "See your prescribed exercises, track how far you've come, and message your therapist directly — no phone tag.",
    tint: "#1F6F5C",
    surface: "bg-teal-wash",
  },
  {
    icon: Activity,
    title: "Physiotherapists",
    copy: "Write a SOAP note in seconds, not fifteen minutes. Your caseload, calendar, and progress — one screen.",
    tint: "#E8734A",
    surface: "bg-coral-wash",
  },
  {
    icon: ShieldCheck,
    title: "Clinics & hospitals",
    copy: "Run the front desk, billing, and every department's calendar from one system built for how clinics work.",
    tint: "#C98A2C",
    surface: "bg-parchment",
  },
];

export function Roles() {
  return (
    <section id="roles" className="relative scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10 pb-24">
        <Reveal>
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-teal mb-3">Who it&apos;s for</p>
              <h2 className="font-display text-[32px] md:text-[38px] font-medium tracking-tight max-w-lg">
                One system. Three very different days.
              </h2>
            </div>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {roleCards.map((r, i) => {
            const Icon = r.icon;
            return (
              <Reveal key={r.title} delay={i * 0.12}>
                <div
                  className={`${r.surface} rounded-[22px] p-7 border border-ink/8 shadow-[0_20px_40px_-30px_rgba(22,48,43,0.4)] hover:-translate-y-1.5 hover:shadow-[0_30px_50px_-25px_rgba(22,48,43,0.3)] transition-all`}
                  style={{ marginTop: i === 1 ? "0px" : i === 0 ? "-8px" : "16px" }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 bg-white/70"
                    style={{ boxShadow: `inset 0 0 0 1px ${r.tint}30` }}
                  >
                    <Icon size={20} style={{ color: r.tint }} strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-[20px] font-medium mb-2.5">{r.title}</h3>
                  <p className="text-[13.5px] text-ink/60 leading-relaxed">{r.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
