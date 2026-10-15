import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  // Same reasoning as the create-staff route: proxy.ts doesn't cover /api,
  // so the check has to live here.
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { isActive } = await req.json();

    if (typeof isActive !== "boolean") {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    if (id === session.userId) {
      return NextResponse.json(
        { error: "You can't deactivate your own account." },
        { status: 400 }
      );
    }

    const target = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!target || target.role === "PATIENT") {
      return NextResponse.json({ error: "Staff member not found." }, { status: 404 });
    }

    await prisma.user.update({ where: { id }, data: { isActive } });

    return NextResponse.json({
      message: isActive ? "Account reactivated." : "Account deactivated.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}