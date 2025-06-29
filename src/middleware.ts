import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const TOKEN_SECRET = new TextEncoder().encode(process.env.TOKEN_SECRET!);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, TOKEN_SECRET);
    return NextResponse.next();
  } catch (err) {
    console.error("Invalid JWT:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
export const config = {
  //matcher: ["/dashboard/:path*", "/profile/:path*"], 
};