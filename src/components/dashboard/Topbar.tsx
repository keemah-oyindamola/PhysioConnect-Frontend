"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, Loader2, Menu } from "lucide-react";

export function Topbar({
  name,
  role,
  onMenuClick,
}: {
  name: string;
  role: string;
  onMenuClick: () => void;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between h-16 px-4 sm:px-6 md:px-10 border-b border-ink/8 bg-paper">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden text-ink/60"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <p className="text-[13px] text-ink/50 capitalize hidden sm:block">
          {role} dashboard
        </p>
      </div>
      <div className="flex items-center gap-3 sm:gap-4">
        <button className="relative w-9 h-9 rounded-full bg-white border border-ink/10 flex items-center justify-center">
          <Bell size={16} />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-sand flex items-center justify-center font-display text-[13px]">
            {initials}
          </div>
          <p className="hidden sm:block text-[13.5px] font-medium">{name}</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-9 h-9 rounded-full bg-white border border-ink/10 flex items-center justify-center text-ink/60 hover:text-coral transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          aria-label="Sign out"
        >
          {loggingOut ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <LogOut size={16} />
          )}
        </button>
      </div>
    </div>
  );
}