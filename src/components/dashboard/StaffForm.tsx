"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, UserPlus } from "lucide-react";
import { PasswordInput } from "@/components/common/PasswordInput";

export function StaffForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("THERAPIST");
  const [specialty, setSpecialty] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !email || !password) {
      setError("Please fill in every field.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, specialty }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setSuccess(`Account created for ${name}.`);
      setName("");
      setEmail("");
      setPassword("");
      setSpecialty("");
      setLoading(false);
      router.refresh();
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setLoading(false);
    }
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
            placeholder="Chidi Nwosu"
            className="w-full bg-white/70 border border-ink/12 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-teal transition-colors"
          />
        </div>
        <div>
          <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="chidi@physioconnect.com"
            className="w-full bg-white/70 border border-ink/12 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-teal transition-colors"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-white/70 border border-ink/12 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-teal transition-colors"
          >
            <option value="THERAPIST">Physiotherapist</option>
            <option value="RECEPTIONIST">Receptionist</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div>
          <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">
            Temporary password
          </label>
          <PasswordInput value={password} onChange={setPassword} placeholder="At least 8 characters" />
        </div>
      </div>

      {role === "THERAPIST" && (
        <div>
          <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">
            Specialty (optional)
          </label>
          <input
            type="text"
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="Sports rehab, post-op recovery..."
            className="w-full bg-white/70 border border-ink/12 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-teal transition-colors"
          />
        </div>
      )}

      {error && <p className="text-[12.5px] text-coral">{error}</p>}
      {success && <p className="text-[12.5px] text-teal">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="self-start bg-teal text-white text-[14px] font-medium px-5 py-2.5 rounded-xl hover:bg-[#195a4a] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
        {loading ? "Creating..." : "Create account"}
      </button>
    </form>
  );
}