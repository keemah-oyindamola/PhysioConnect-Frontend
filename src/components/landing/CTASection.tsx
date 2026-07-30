import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/common/Reveal";

export function CTASection() {
  return (
    <section className="max-w-6xl mx-auto px-6 md:px-10 py-28 text-center relative">
      <div className="absolute left-1/2 -translate-x-1/2 top-8 w-72 h-72 rounded-full bg-teal/10 blur-3xl -z-10" />
      <Reveal>
        <h2 className="font-display text-[34px] md:text-[44px] font-medium tracking-tight mb-4 max-w-lg mx-auto">
          Your recovery, in one place.
        </h2>
        <p className="text-[14.5px] text-ink/60 mb-8 max-w-sm mx-auto">
          Whether you&apos;re booking your first session or running a whole department — start here.
        </p>
        <button className="bg-teal text-white text-[14px] font-medium px-7 py-3.5 rounded-full hover:bg-[#195a4a] transition-colors shadow-[0_16px_32px_-14px_rgba(31,111,92,0.6)] inline-flex items-center gap-2">
          Get started <ArrowRight size={15} />
        </button>
      </Reveal>
    </section>
  );
}