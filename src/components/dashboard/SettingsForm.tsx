"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PasswordInput } from "@/components/common/PasswordInput";

type Message = { type: "error" | "success"; text: string } | null;

export function SettingsForm({
  name,
  email,
  canEditName,
}: {
  name: string;
  email: string;
  canEditName: boolean;
}) {
  const router = useRouter();

  const [newName, setNewName] = useState(name);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<Message>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<Message>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);

    if (newName.trim().length < 2) {
      setProfileMsg({ type: "error", text: "Please enter your full name." });
      return;
    }

    setProfileLoading(true);
    try {
      const res = await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      const data = await res.json();

      if (!res.ok) {
        setProfileMsg({ type: "error", text: data.error || "Something went wrong." });
      } else {
        setProfileMsg({ type: "success", text: "Name updated." });
        router.refresh();
      }
    } catch {
      setProfileMsg({ type: "error", text: "Couldn't reach the server. Please try again." });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMsg({ type: "error", text: "Please fill in every field." });
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "New passwords don't match." });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPasswordMsg({ type: "error", text: data.error || "Something went wrong." });
      } else {
        setPasswordMsg({ type: "success", text: "Password updated." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setPasswordMsg({ type: "error", text: "Couldn't reach the server. Please try again." });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-widest text-coral mb-1">
        Settings
      </p>
      <h1 className="font-display text-[28px] font-medium tracking-tight mb-8">
        Your account
      </h1>

      <div className="bg-white rounded-2xl border border-ink/8 p-6 mb-6 max-w-xl">
        <h2 className="font-display text-[17px] font-medium mb-4">Profile</h2>

        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">
              Full name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={!canEditName}
              className="w-full bg-white/70 border border-ink/12 rounded-xl px-4 py-2.5 text-[14px] outline-none focus:border-teal transition-colors disabled:bg-ink/5 disabled:text-ink/50 disabled:cursor-not-allowed"
            />
            {!canEditName && (
              <p className="text-[11.5px] text-ink/45 mt-1.5">
                Your name is managed by your clinic administrator.
              </p>
            )}
          </div>

          <div>
            <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full bg-ink/5 border border-ink/12 rounded-xl px-4 py-2.5 text-[14px] text-ink/50 cursor-not-allowed"
            />
          </div>

          {profileMsg && (
            <p className={`text-[12.5px] ${profileMsg.type === "error" ? "text-coral" : "text-teal"}`}>
              {profileMsg.text}
            </p>
          )}

          {canEditName && (
            <button
              type="submit"
              disabled={profileLoading}
              className="self-start bg-teal text-white text-[14px] font-medium px-5 py-2.5 rounded-xl hover:bg-[#195a4a] transition-colors flex items-center gap-2 disabled:opacity-70"
            >
              {profileLoading && <Loader2 size={16} className="animate-spin" />}
              {profileLoading ? "Saving..." : "Save changes"}
            </button>
          )}
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-ink/8 p-6 max-w-xl">
        <h2 className="font-display text-[17px] font-medium mb-4">Change password</h2>

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">
              Current password
            </label>
            <PasswordInput value={currentPassword} onChange={setCurrentPassword} placeholder="••••••••" />
          </div>
          <div>
            <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">
              New password
            </label>
            <PasswordInput value={newPassword} onChange={setNewPassword} placeholder="At least 8 characters" />
          </div>
          <div>
            <label className="text-[12.5px] font-medium text-ink/70 mb-1.5 block">
              Confirm new password
            </label>
            <PasswordInput value={confirmPassword} onChange={setConfirmPassword} placeholder="••••••••" />
          </div>

          {passwordMsg && (
            <p className={`text-[12.5px] ${passwordMsg.type === "error" ? "text-coral" : "text-teal"}`}>
              {passwordMsg.text}
            </p>
          )}

          <button
            type="submit"
            disabled={passwordLoading}
            className="self-start bg-teal text-white text-[14px] font-medium px-5 py-2.5 rounded-xl hover:bg-[#195a4a] transition-colors flex items-center gap-2 disabled:opacity-70"
          >
            {passwordLoading && <Loader2 size={16} className="animate-spin" />}
            {passwordLoading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}