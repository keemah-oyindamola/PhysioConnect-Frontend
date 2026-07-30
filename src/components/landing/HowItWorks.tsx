import { Reveal } from "@/components/common/Reveal";

const steps = [
  { n: "01", title: "Book in under a minute", copy: "Patients pick a therapist, a time, and a reason — no forms to hunt for." },
  { n: "02", title: "Get a plan, not a printout", copy: "Exercises arrive with video, reps, and a clear reason why — assigned by your therapist." },
  { n: "03", title: "Watch the arc move", copy: "Pain score down, range of motion up. Every session updates the same chart." },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-teal-wash border-y border-ink/8 scroll-mt-24">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-24">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-widest text-coral mb-3">How it works</p>
          <h2 className="font-display text-[32px] md:text-[38px] font-medium tracking-tight mb-16 max-w-xl">
            From first booking to full recovery.
          </h2>
        </Reveal>
        <div className="relative grid md:grid-cols-3 gap-10">
          <div className="hidden md:block absolute top-6 left-[16.5%] right-[16.5%] h-px bg-ink/15" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-ink text-paper font-mono text-[13px] flex items-center justify-center mb-6 relative z-10">
                  {s.n}
                </div>
                <h3 className="font-display text-[19px] font-medium mb-2.5">{s.title}</h3>
                <p className="text-[13.5px] text-ink/60 leading-relaxed">{s.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
