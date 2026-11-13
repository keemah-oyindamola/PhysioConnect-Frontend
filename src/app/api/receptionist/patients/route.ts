import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendPatientInviteEmail } from "@/lib/email";

const INVITE_VALID_DAYS = 7;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d\s()-]{7,20}$/;

export async function POST(req: NextRequest) {
  const session = await getSession();

  // proxy.ts doesn't cover /api, so the role check has to live here.
  if (!session || session.role !== "RECEPTIONIST") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Please enter the patient's full name." }, { status: 400 });
    }
    if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }
    if (phone && !PHONE_PATTERN.test(phone)) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }

    // Case-insensitive, so "Ada@x.com" can't slip past an existing "ada@x.com".
    const existing = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true },
    });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Nobody knows this password. The patient sets their own through the invite link.
    const unusablePassword = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 10);

    // Same pattern as forgot-password: store only a hash of the token.
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiry = new Date(Date.now() + INVITE_VALID_DAYS * 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: unusablePassword,
        role: "PATIENT",
        resetToken: hashedToken,
        resetTokenExpiry: expiry,
        patient: { create: { phone: phone || null } },
      },
    });

    // The account exists either way. A failed email shouldn't look like a failed registration.
    let emailSent = true;
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
      if (!appUrl) throw new Error("NEXT_PUBLIC_APP_URL is not set");
      await sendPatientInviteEmail(
        user.email,
        user.name,
        `${appUrl}/reset-password?token=${rawToken}`
      );
    } catch (err) {
      console.error("Invite email failed:", err);
      emailSent = false;
    }

    return NextResponse.json(
      { message: "Patient registered.", emailSent },
      { status: 201 }
    );
  } catch (err) {
    // P2002 = unique constraint: another receptionist registered this email a moment ago.
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}