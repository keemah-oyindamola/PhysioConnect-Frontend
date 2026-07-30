export function Logomark({ size = 34, dark = false }: { size?: number; dark?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="20" fill={dark ? "#F3F5F2" : "#1F6F5C"} />
      <path
        d="M9 26c3.5-9 7-13 11-13s7.5 4 11 13"
        stroke={dark ? "#1F6F5C" : "#F3F5F2"}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="9" cy="26" r="2.1" fill="#E8734A" />
    </svg>
  );
}

export function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <Logomark dark={dark} />
      <span
        className={`font-display text-[19px] font-medium tracking-tight ${
          dark ? "text-paper" : "text-ink"
        }`}
      >
        Physio<span className="text-coral">Connect</span>
      </span>
    </div>
  );
}