"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { PasswordInput } from "@/components/common/PasswordInput";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing its token. Please request a new one.");
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
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setError("Couldn't reach the server. Please try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-4">
        <CheckCircle2 size={32} className="mx-auto text-teal mb-3" />
        <p className="text-[14px] text-ink/70">
          Password reset. Taking you to sign in...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">
          New password
        </label>
        <PasswordInput value={password} onChange={setPassword} placeholder="At least 8 characters" />
      </div>
      <div>
        <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">
          Confirm new password
        </label>
        <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" />
      </div>

      {error && <p className="text-[12.5px] text-coral">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-teal text-white text-[14px] font-medium py-3 rounded-xl hover:bg-[#195a4a] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Resetting..." : "Reset password"}
      </button>
    </form>
  );
}