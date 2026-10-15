import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export type SessionPayload = {
  userId: string;
  role: "PATIENT" | "THERAPIST" | "RECEPTIONIST" | "ADMIN";
};

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  let payload: SessionPayload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string) as SessionPayload;
  } catch {
    return null;
  }

  // Checked against the database on every request, so deactivating someone
  // takes effect immediately instead of when their 7-day token expires.
  // This is outside the try/catch on purpose: a database error should show
  // up as an error, not silently log the person out.
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { isActive: true },
  });

  if (!user || !user.isActive) return null;

  return payload;
}