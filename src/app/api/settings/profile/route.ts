import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  // Therapists and receptionists can't rename themselves: the admin owns that.
  // Checked here on the server, same reason as the staff route: the UI can be bypassed.
  if (session.role !== "PATIENT" && session.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Your name is managed by your clinic administrator." },
      { status: 403 }
    );
  }

  try {
    const { name } = await req.json();
    const trimmed = typeof name === "string" ? name.trim() : "";

    if (trimmed.length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: session.userId },
      data: { name: trimmed },
    });

    return NextResponse.json({ message: "Name updated." });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}