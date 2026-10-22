"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function CancelAppointmentButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    if (loading) return;
    if (!window.confirm("Cancel this appointment? The time will be released for other patients.")) {
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
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
        className="text-[12px] font-medium px-3 py-1.5 rounded-full border border-coral/40 text-coral hover:bg-coral/5 transition-colors flex items-center gap-1.5 disabled:opacity-60"
      >
        {loading && <Loader2 size={12} className="animate-spin" />}
        Cancel
      </button>
      {error && <p className="text-[11px] text-coral mt-1">{error}</p>}
    </div>
  );
}