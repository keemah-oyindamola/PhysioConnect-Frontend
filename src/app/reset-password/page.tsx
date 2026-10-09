import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <AuthShell
      title="Set a new password"
      subtitle="Reset password"
      footer={<span className="text-ink/40">This link is valid for 30 minutes.</span>}
    >
      <Suspense fallback={<p className="text-[13.5px] text-ink/50">Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}