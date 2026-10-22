import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SLOT_HOURS, dateProblem, slotDateTime, makeSlotKey } from "@/lib/booking";

export async function POST(req: NextRequest) {
  const session = await getSession();

  // Same lesson as the staff routes: proxy.ts doesn't cover /api,
  // so the role check has to live here.
  if (!session || session.role !== "PATIENT") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const therapistId = typeof body.therapistId === "string" ? body.therapistId : "";
    const date = typeof body.date === "string" ? body.date : "";
    const hour = body.hour;
    const reason = typeof body.reason === "string" ? body.reason.trim() : "";

    if (!therapistId || !date || !Number.isInteger(hour) || !SLOT_HOURS.includes(hour)) {
      return NextResponse.json({ error: "Please choose a therapist, date and time." }, { status: 400 });
    }
    if (reason.length < 3 || reason.length > 200) {
      return NextResponse.json(
        { error: "Please describe your reason for visiting (3 to 200 characters)." },
        { status: 400 }
      );
    }

    const problem = dateProblem(date);
    if (problem) {
      return NextResponse.json({ error: problem }, { status: 400 });
    }

    const when = slotDateTime(date, hour);
    if (when <= new Date()) {
      return NextResponse.json({ error: "That time has already passed." }, { status: 400 });
    }

    const patient = await prisma.patient.findUnique({
      where: { userId: session.userId },
      select: { id: true },
    });
    if (!patient) {
      return NextResponse.json({ error: "Patient profile not found." }, { status: 404 });
    }

    const therapist = await prisma.therapist.findFirst({
      where: { id: therapistId, user: { isActive: true } },
      select: { id: true },
    });
    if (!therapist) {
      return NextResponse.json({ error: "That physiotherapist isn't available." }, { status: 404 });
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        therapistId: therapist.id,
        dateTime: when,
        reason,
        slotKey: makeSlotKey(therapist.id, when),
      },
    });

    return NextResponse.json({ message: "Appointment requested.", id: appointment.id }, { status: 201 });
  } catch (err) {
    // P2002 = unique constraint violation: someone else took this slot in the same instant.
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json(
        { error: "Sorry, that time was just taken. Please pick another." },
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