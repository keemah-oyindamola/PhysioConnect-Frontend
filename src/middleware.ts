import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (!path.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as {
      role: string;
    };

    const roleFromUrl = path.split("/")[2]; // e.g. "admin" from /dashboard/admin

    if (roleFromUrl && payload.role.toLowerCase() !== roleFromUrl) {
      // Logged in, but trying to view someone else's dashboard —
      // send them to their own instead of letting the request through.
      return NextResponse.redirect(
        new URL(`/dashboard/${payload.role.toLowerCase()}`, req.url)
      );
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};