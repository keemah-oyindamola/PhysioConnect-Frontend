import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export type SessionPayload = {
  userId: string;
  role: "PATIENT" | "THERAPIST" | "RECEPTIONIST" | "ADMIN";
};

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as SessionPayload;
  } catch {
    return null;
  }
}