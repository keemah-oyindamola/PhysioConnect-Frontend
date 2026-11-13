import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await transporter.sendMail({
    from: `"PhysioConnect" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset your PhysioConnect password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #16302B;">Reset your password</h2>
        <p style="color: #16302B; opacity: 0.7;">
          Someone requested a password reset for your PhysioConnect account.
          If this was you, click below to set a new password. This link expires in 30 minutes.
        </p>
        <a href="${resetUrl}" style="display: inline-block; background: #1F6F5C; color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; margin: 16px 0;">
          Reset password
        </a>
        <p style="color: #16302B; opacity: 0.5; font-size: 13px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
  });
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendPatientInviteEmail(to: string, name: string, inviteUrl: string) {
  await transporter.sendMail({
    from: `"PhysioConnect" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to PhysioConnect: set your password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #16302B;">Welcome, ${escapeHtml(name)}</h2>
        <p style="color: #16302B; opacity: 0.7;">
          The clinic has created a PhysioConnect account for you, where you can book
          appointments, see your exercises and follow your recovery. Set your password to get started.
          This link is valid for 7 days.
        </p>
        <a href="${inviteUrl}" style="display: inline-block; background: #1F6F5C; color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; margin: 16px 0;">
          Set my password
        </a>
        <p style="color: #16302B; opacity: 0.5; font-size: 13px;">
          If the link has expired, use "Forgot password" on the sign-in page with this email address.
        </p>
      </div>
    `,
  });
}