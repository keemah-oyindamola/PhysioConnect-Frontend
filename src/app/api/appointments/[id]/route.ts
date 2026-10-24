import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ACTIONS = ["cancel", "confirm", "complete"];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (
    !session ||
    (session.role !== "PATIENT" &&
      session.role !== "THERAPIST" &&
      session.role !== "RECEPTIONIST")
  ) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { action } = await req.json();

    if (!ACTIONS.includes(action)) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { select: { userId: true } },
        therapist: { select: { userId: true } },
      },
    });

    const isPatientOwner =
      session.role === "PATIENT" && appointment?.patient.userId === session.userId;
    const isTherapistOwner =
      session.role === "THERAPIST" && appointment?.therapist.userId === session.userId;
    const isFrontDesk = session.role === "RECEPTIONIST";

    // Someone else's appointment gets the same "not found" as a missing one,
    // so this can't be used to probe which IDs exist.
    if (!appointment || (!isPatientOwner && !isTherapistOwner && !isFrontDesk)) {
      return NextResponse.json({ error: "Appointment not found." }, { status: 404 });
    }

    // Only the treating therapist decides whether a visit is confirmed or done.
    if ((action === "confirm" || action === "complete") && !isTherapistOwner) {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    const now = new Date();

    if (action === "cancel") {
      if (appointment.status !== "PENDING" && appointment.status !== "CONFIRMED") {
        return NextResponse.json(
          { error: "This appointment can't be cancelled." },
          { status: 400 }
        );
      }
      if (appointment.dateTime <= now) {
        return NextResponse.json(
          { error: "This appointment has already passed." },
          { status: 400 }
        );
      }
    } else if (action === "confirm") {
      if (appointment.status !== "PENDING") {
        return NextResponse.json(
          { error: "Only pending requests can be confirmed." },
          { status: 400 }
        );
      }
      if (appointment.dateTime <= now) {
        return NextResponse.json(
          { error: "This request is for a time that has already passed." },
          { status: 400 }
        );
      }
    } else {
      if (appointment.status !== "CONFIRMED") {
        return NextResponse.json(
          { error: "Only confirmed appointments can be marked complete." },
          { status: 400 }
        );
      }
      if (appointment.dateTime > now) {
        return NextResponse.json(
          { error: "This visit hasn't happened yet." },
          { status: 400 }
        );
      }
    }

    // Clearing slotKey on cancel is what frees the time for someone else.
    const data =
      action === "cancel"
        ? { status: "CANCELLED" as const, slotKey: null }
        : action === "confirm"
          ? { status: "CONFIRMED" as const }
          : { status: "COMPLETED" as const };

    // Matching on the status we just read makes this atomic: if two people act
    // on the same appointment at the same instant, only one update goes through.
    const result = await prisma.appointment.updateMany({
      where: { id, status: appointment.status },
      data,
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "This appointment was just updated. Please refresh the page." },
        { status: 409 }
      );
    }

    const messages: Record<string, string> = {
      cancel: "Appointment cancelled.",
      confirm: "Appointment confirmed.",
      complete: "Visit marked as complete.",
    };
    return NextResponse.json({ message: messages[action] });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}