import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.role !== "PATIENT") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { action } = await req.json();

    if (action !== "cancel") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: { patient: { select: { userId: true } } },
    });

    // Someone else's appointment gets the same "not found" as a missing one,
    // so this can't be used to probe which IDs exist.
    if (!appointment || appointment.patient.userId !== session.userId) {
      return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
    }
    if (appointment.status === "CANCELLED" || appointment.status === "COMPLETED") {
      return NextResponse.json({ error: "This appointment can't be cancelled." }, { status: 400 });
    }
    if (appointment.dateTime <= new Date()) {
      return NextResponse.json({ error: "This appointment has already passed." }, { status: 400 });
    }

    // Clearing slotKey is what frees the time for someone else.
    await prisma.appointment.update({
      where: { id },
      data: { status: "CANCELLED", slotKey: null },
    });

    return NextResponse.json({ message: "Appointment cancelled." });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}