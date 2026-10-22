"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CalendarPlus } from "lucide-react";
import { formatHour } from "@/lib/booking";

type Therapist = { id: string; name: string; specialty: string | null };

export function BookingForm({
  therapists,
  minDate,
  maxDate,
}: {
  therapists: Therapist[];
  minDate: string;
  maxDate: string;
}) {
  const router = useRouter();
  const requestRef = useRef(0);

  const [therapistId, setTherapistId] = useState("");
  const [date, setDate] = useState("");
  const [hours, setHours] = useState<number[]>([]);
  const [hour, setHour] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsMessage, setSlotsMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSlots = async (tid: string, d: string) => {
    // If the patient changes the date again before this finishes,
    // the older response is ignored.
    const requestId = ++requestRef.current;
    setHour(null);
    setHours([]);
    setSlotsMessage("");
    if (!tid || !d) {
      setSlotsLoading(false);
      return;
    }

    setSlotsLoading(true);
    try {
      const res = await fetch(
        `/api/appointments/slots?therapistId=${encodeURIComponent(tid)}&date=${d}`
      );
      const data = await res.json();
      if (requestId !== requestRef.current) return;

      const found: number[] = data.hours ?? [];
      setHours(found);
      if (data.message) setSlotsMessage(data.message);
      else if (!res.ok) setSlotsMessage(data.error || "Couldn't load times.");
      else if (found.length === 0) setSlotsMessage("No free times on this day. Try another date.");
    } catch {
      if (requestId === requestRef.current) {
        setSlotsMessage("Couldn't load times. Please try again.");
      }
    } finally {
      if (requestId === requestRef.current) setSlotsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!therapistId || !date || hour === null || reason.trim().length < 3) {
      setError("Please choose a physiotherapist, a date, a time, and describe your reason for visiting.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ therapistId, date, hour, reason }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        if (res.status === 409) loadSlots(therapistId, date);
        return;
      }

      setSuccess("Appointment requested. Your physiotherapist will confirm it shortly.");
      setReason("");
      loadSlots(therapistId, date);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-white/70 border border-ink/12 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-teal transition-colors";

  if (therapists.length === 0) {
    return (
      <p className="text-[13.5px] text-ink/60">
        No physiotherapists are available yet. An administrator needs to add one before
        appointments can be booked.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">
            Physiotherapist
          </label>
          <select
            value={therapistId}
            onChange={(e) => {
              setTherapistId(e.target.value);
              loadSlots(e.target.value, date);
            }}
            className={inputClass}
          >
            <option value="">Choose one...</option>
            {therapists.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
                {t.specialty ? ` (${t.specialty})` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">Date</label>
          <input
            type="date"
            value={date}
            min={minDate}
            max={maxDate}
            onChange={(e) => {
              setDate(e.target.value);
              loadSlots(therapistId, e.target.value);
            }}
            className={inputClass}
          />
        </div>
      </div>

      {therapistId && date && (
        <div>
          <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">
            Available times (Lagos time)
          </label>
          {slotsLoading ? (
            <p className="text-[12.5px] text-ink/50 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Checking availability...
            </p>
          ) : hours.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {hours.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHour(h)}
                  className={`px-3.5 py-2 rounded-full text-[13px] border transition-colors ${
                    hour === h
                      ? "bg-teal text-white border-teal"
                      : "border-ink/15 text-ink/70 hover:border-teal hover:text-teal"
                  }`}
                >
                  {formatHour(h)}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[12.5px] text-ink/50">{slotsMessage}</p>
          )}
        </div>
      )}

      <div>
        <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">
          Reason for visit
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={200}
          rows={3}
          placeholder="e.g. Lower back pain after lifting, started two weeks ago"
          className={inputClass}
        />
      </div>

      {error && <p className="text-[12.5px] text-coral">{error}</p>}
      {success && <p className="text-[12.5px] text-teal">{success}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="self-start bg-teal text-white text-[14px] font-medium px-5 py-2.5 rounded-xl hover:bg-[#195a4a] transition-colors flex items-center gap-2 disabled:opacity-70"
      >
        {submitting ? <Loader2 size={16} className="animate-spin" /> : <CalendarPlus size={16} />}
        {submitting ? "Booking..." : "Request appointment"}
      </button>
    </form>
  );
}