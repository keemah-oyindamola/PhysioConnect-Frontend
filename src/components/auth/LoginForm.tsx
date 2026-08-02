"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: wire to real auth once the backend exists
    setTimeout(() => setSubmitting(false), 800);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full bg-white border border-ink/12 rounded-xl px-4 py-3 text-[14px] outline-none focus:border-teal focus:ring-2 focus:ring-teal/15 transition-colors"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="password" className="text-[12.5px] font-medium text-ink/70">
            Password
          </label>
          <Link href="/forgot-password" className="text-[12px] text-teal font-medium hover:underline">
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="••••••••"
            className="w-full bg-white border border-ink/12 rounded-xl px-4 py-3 pr-11 text-[14px] outline-none focus:border-teal focus:ring-2 focus:ring-teal/15 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 bg-teal text-white text-[14px] font-medium py-3.5 rounded-xl hover:bg-[#195a4a] transition-colors shadow-[0_12px_24px_-10px_rgba(31,111,92,0.55)] flex items-center justify-center gap-2 disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in"}
        {!submitting && <ArrowRight size={15} />}
      </button>

      <p className="text-[13px] text-ink/55 text-center mt-2">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-teal font-medium hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}