"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function StaffActions({
  id,
  name,
  isActive,
}: {
  id: string;
  name: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClick = async () => {
    if (loading) return;

    if (
      isActive &&
      !window.confirm(
        `Deactivate ${name}? They'll be signed out and unable to log in until you reactivate them.`
      )
    ) {
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/staff/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
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
        className={`text-[12px] font-medium px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 disabled:opacity-60 ${
          isActive
            ? "border-coral/40 text-coral hover:bg-coral/5"
            : "border-teal/40 text-teal hover:bg-teal/5"
        }`}
      >
        {loading && <Loader2 size={12} className="animate-spin" />}
        {isActive ? "Deactivate" : "Reactivate"}
      </button>
      {error && <p className="text-[11px] text-coral mt-1">{error}</p>}
    </div>
  );
}