import { Quote, Star } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";

export function Testimonial() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-24">
      <Reveal>
        <div className="bg-sand rounded-[28px] border border-ink/8 shadow-[0_30px_60px_-35px_rgba(22,48,43,0.35)] p-10 md:p-14 grid md:grid-cols-[auto_1fr] gap-8 items-start">
          <Quote size={40} className="text-coral/30 shrink-0" />
          <div>
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber text-amber" />
              ))}
            </div>
            <p className="font-display text-[22px] md:text-[26px] leading-snug font-medium mb-6 max-w-2xl">
              &quot;Our therapists got two hours a day back. Patients stopped calling to ask
              &apos;am I improving&apos; — they can just look at their own chart.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-parchment flex items-center justify-center font-display text-[13px]">
                AO
              </div>
              <div>
                <p className="text-[13.5px] font-medium">Dr. Ada Okafor</p>
                <p className="text-[12px] text-ink/50">Lead Physiotherapist, Lagos Rehab Centre</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}