import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SLOT_HOURS, dateProblem, slotDateTime, makeSlotKey } from "@/lib/booking";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  try {
    const therapistId = req.nextUrl.searchParams.get("therapistId");
    const date = req.nextUrl.searchParams.get("date");

    if (!therapistId || !date) {
      return NextResponse.json({ error: "Missing therapist or date." }, { status: 400 });
    }

    const problem = dateProblem(date);
    if (problem) {
      return NextResponse.json({ hours: [], message: problem });
    }

    const now = new Date();
    const candidates = SLOT_HOURS.map((hour) => ({
      hour,
      when: slotDateTime(date, hour),
    })).filter((slot) => slot.when > now);

    const taken = await prisma.appointment.findMany({
      where: {
        slotKey: { in: candidates.map((s) => makeSlotKey(therapistId, s.when)) },
      },
      select: { slotKey: true },
    });
    const takenKeys = new Set(taken.map((t) => t.slotKey));

    const hours = candidates
      .filter((s) => !takenKeys.has(makeSlotKey(therapistId, s.when)))
      .map((s) => s.hour);

    return NextResponse.json({ hours });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}