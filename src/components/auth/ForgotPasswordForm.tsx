"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch {
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <CheckCircle2 size={32} className="mx-auto text-teal mb-3" />
        <p className="text-[14px] text-ink/70">
          If an account exists for <span className="font-medium">{email}</span>, a reset
          link has been sent. Check your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

      {error && <p className="text-[12.5px] text-coral">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-teal text-white text-[14px] font-medium py-3 rounded-xl hover:bg-[#195a4a] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}