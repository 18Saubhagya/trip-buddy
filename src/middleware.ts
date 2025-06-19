import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const TOKEN_SECRET = process.env.TOKEN_SECRET as string;

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    jwt.verify(token, TOKEN_SECRET);
    return NextResponse.next();
  } catch (err) {
    console.error("Invalid JWT:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], 
};