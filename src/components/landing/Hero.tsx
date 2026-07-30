import { ArrowRight } from "lucide-react";
import { HeroArc } from "@/components/landing/HeroArc";

export function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-28 grid md:grid-cols-[1.1fr_0.9fr] gap-16 items-center relative">
      <div>
        <div className="inline-flex items-center gap-2 bg-coral/10 text-coral font-mono text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-coral" />
          For clinics, therapists &amp; patients
        </div>
        <h1 className="font-display text-[46px] md:text-[64px] leading-[1.02] font-medium tracking-tight mb-6">
          Recovery you
          <br />
          can actually <span className="text-teal italic">see.</span>
        </h1>
        <p className="text-[16.5px] text-ink/65 max-w-md mb-9 leading-relaxed">
          PhysioConnect brings booking, records, exercise plans, and progress into one place —
          so patients know exactly how they&apos;re healing, and therapists spend less time on paperwork.
        </p>
        <div className="flex flex-wrap items-center gap-4 mb-14">
          <button className="bg-teal text-white text-[14px] font-medium px-6 py-3.5 rounded-full hover:bg-[#195a4a] transition-colors shadow-[0_12px_24px_-10px_rgba(31,111,92,0.55)] flex items-center gap-2">
            Book a demo <ArrowRight size={15} />
          </button>
          <button className="text-[14px] font-medium text-ink/70 border border-ink/15 px-6 py-3.5 rounded-full hover:border-ink/30 hover:bg-teal-wash transition-colors">
            I&apos;m a patient
          </button>
        </div>
        <div className="flex items-center gap-7">
          <div>
            <p className="font-display text-[24px] font-medium">128+</p>
            <p className="text-[11.5px] text-ink/50">patients tracked</p>
          </div>
          <div className="w-px h-9 bg-ink/12" />
          <div>
            <p className="font-display text-[24px] font-medium">87%</p>
            <p className="text-[11.5px] text-ink/50">avg. recovery rate</p>
          </div>
          <div className="w-px h-9 bg-ink/12" />
          <div>
            <p className="font-display text-[24px] font-medium">4.9<span className="text-[15px]">/5</span></p>
            <p className="text-[11.5px] text-ink/50">from clinics</p>
          </div>
        </div>
      </div>
      <HeroArc />
    </section>
  );
}