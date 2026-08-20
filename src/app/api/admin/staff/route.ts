import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await getSession();

  // This is the check that actually matters — proxy.ts never sees this
  // request at all, since it only guards page navigation, not API calls.
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  try {
    const { name, email, password, role, specialty } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Please fill in every field." }, { status: 400 });
    }
    if (!["THERAPIST", "RECEPTIONIST", "ADMIN"].includes(role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        ...(role === "THERAPIST" && {
          therapist: { create: { specialty: specialty || null } },
        }),
      },
    });

    return NextResponse.json(
      { message: "Staff account created.", id: user.id },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}