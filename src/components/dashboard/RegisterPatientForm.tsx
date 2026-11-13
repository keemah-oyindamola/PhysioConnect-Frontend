"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";

type Message = { type: "error" | "success" | "warning"; text: string } | null;

export function RegisterPatientForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (name.trim().length < 2 || !email.trim()) {
      setMessage({ type: "error", text: "Please enter the patient's name and email." });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/receptionist/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Something went wrong." });
        return;
      }

      setMessage(
        data.emailSent
          ? {
              type: "success",
              text: `${name.trim()} is registered. An email with a link to set their password was sent to ${email.trim()}.`,
            }
          : {
              type: "warning",
              text: `${name.trim()} is registered, but the invitation email couldn't be sent. Ask them to use "Forgot password" on the sign-in page with ${email.trim()}.`,
            }
      );
      setName("");
      setEmail("");
      setPhone("");
      router.refresh();
    } catch {
      setMessage({ type: "error", text: "Couldn't reach the server. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-white/70 border border-ink/12 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-teal transition-colors";

  const messageColor = {
    error: "text-coral",
    success: "text-teal",
    warning: "text-amber",
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ngozi Adeyemi"
            className={inputClass}
          />
        </div>
        <div>
          <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="patient@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="sm:max-w-[calc(50%-0.5rem)]">
        <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">
          Phone (optional)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="0801 234 5678"
          className={inputClass}
        />
      </div>

      {message && (
        <p className={`text-[12.5px] ${messageColor[message.type]}`}>{message.text}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="self-start bg-teal text-white text-[14px] font-medium px-5 py-2.5 rounded-xl hover:bg-[#195a4a] transition-colors flex items-center gap-2 disabled:opacity-70"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
        {loading ? "Registering..." : "Register patient"}
      </button>
    </form>
  );
}