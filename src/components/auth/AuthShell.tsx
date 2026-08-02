import type { ReactNode } from "react";
import { Wordmark } from "@/components/common/Logo";

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="min-h-screen w-full grid md:grid-cols-2 bg-paper text-ink">
      {/* Brand panel */}
      <div className="hidden md:flex flex-col justify-between bg-ink text-paper p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-coral/10 blur-3xl -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-teal/20 blur-3xl -ml-16 -mb-16" />

        <Wordmark dark />

        <div className="relative">
          <svg viewBox="0 0 280 200" className="w-full max-w-[320px] mb-10">
            <path
              d="M20 170 A130 130 0 0 1 260 170"
              fill="none"
              stroke="#F3F5F2"
              strokeOpacity="0.15"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <path
              d="M20 170 A130 130 0 0 1 260 170"
              fill="none"
              stroke="#E8734A"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="320"
              strokeDashoffset="70"
            />
            <circle cx="260" cy="170" r="6" fill="#F3F5F2" />
          </svg>
          <p className="font-display text-[26px] leading-snug font-medium max-w-sm mb-3">
            Recovery you can actually see.
          </p>
          <p className="text-[13.5px] text-paper/55 max-w-xs leading-relaxed">
            Booking, records, exercise plans, and progress — all in one place, for patients,
            therapists, and the clinics that run them.
          </p>
        </div>

        <p className="text-[11px] text-paper/40 font-mono">© 2026 PhysioConnect</p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <div className="md:hidden mb-8">
            <Wordmark />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-coral mb-2">{subtitle}</p>
          <h1 className="font-display text-[30px] font-medium tracking-tight mb-8">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}
