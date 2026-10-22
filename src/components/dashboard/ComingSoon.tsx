import type { LucideIcon } from "lucide-react";

export function ComingSoon({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-coral mb-1">
        {eyebrow}
      </p>
      <h1 className="font-display text-[28px] font-medium tracking-tight mb-8">{title}</h1>

      <div className="bg-white rounded-2xl border border-ink/8 p-10 text-center">
        <Icon size={28} className="mx-auto text-ink/20 mb-3" />
        <p className="font-display text-[18px] font-medium mb-1">Coming soon</p>
        <p className="text-[13.5px] text-ink/50 max-w-sm mx-auto">{description}</p>
      </div>
    </div>
  );
}