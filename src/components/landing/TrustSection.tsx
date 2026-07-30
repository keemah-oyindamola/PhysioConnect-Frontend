import { CheckCircle2 } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";

const trustPoints = ["Role-based access", "Full audit trail", "Encrypted file storage", "Two-factor auth"];

export function TrustSection() {
  return (
    <section id="trust" className="bg-ink text-paper relative overflow-hidden scroll-mt-24">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-coral/10 blur-3xl -mr-20 -mt-20" />
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-20 grid md:grid-cols-2 gap-12 items-center relative">
        <Reveal>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-coral mb-3">Built for medical data</p>
            <h2 className="font-display text-[28px] md:text-[34px] font-medium tracking-tight mb-4">
              Records handled the way they should be.
            </h2>
            <p className="text-[14px] text-paper/60 leading-relaxed max-w-md">
              Role-based access, full audit logs, and encrypted storage for every scan, note, and
              message — so patient trust isn&apos;t an afterthought.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="grid grid-cols-2 gap-4">
            {trustPoints.map((f) => (
              <div key={f} className="bg-paper/5 border border-paper/10 rounded-2xl p-4 flex flex-col gap-3">
                <CheckCircle2 size={18} className="text-coral" />
                <p className="text-[13px] leading-snug">{f}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}