"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "danger";

const styles: Record<Variant, string> = {
  primary: "bg-teal text-white border-teal hover:bg-[#195a4a]",
  danger: "border-coral/40 text-coral hover:bg-coral/5",
};

export function AppointmentActionButton({
  id,
  action,
  label,
  variant = "primary",
  confirmMessage,
}: {
  id: string;
  action: "confirm" | "complete" | "cancel";
  label: string;
  variant?: Variant;
  confirmMessage?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    if (loading) return;
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        router.refresh();
      }
    } catch {
      setError("Couldn't reach the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-right">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`text-[12px] font-medium px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 disabled:opacity-60 ${styles[variant]}`}
      >
        {loading && <Loader2 size={12} className="animate-spin" />}
        {label}
      </button>
      {error && <p className="text-[11px] text-coral mt-1 max-w-[180px]">{error}</p>}
    </div>
  );
}