"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Mail, Loader2 } from "lucide-react";
import { PasswordInput } from "../common/PasswordInput";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in every field.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      router.push(`/dashboard/${data.role.toLowerCase()}`);
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">Full name</label>
        <div className="relative">
          <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ada Okafor"
            className="w-full bg-white/70 border border-ink/12 rounded-xl pl-10 pr-4 py-2.5 text-[14px] outline-none focus:border-teal transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">Email</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-white/70 border border-ink/12 rounded-xl pl-10 pr-4 py-2.5 text-[14px] outline-none focus:border-teal transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">Password</label>
       <PasswordInput value={password} onChange={setPassword} placeholder="At least 8 characters" />
      </div>

      <div>
        <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">Confirm password</label>
      <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" />
      </div>

      {error && <p className="text-[12.5px] text-coral">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-teal text-white text-[14px] font-medium py-3 rounded-xl hover:bg-[#195a4a] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-[11.5px] text-ink/45 text-center leading-relaxed">
        This creates a patient account. Physiotherapists, receptionists, and admins are
        added by a clinic administrator, not through public signup.
      </p>
    </form>
  );
}