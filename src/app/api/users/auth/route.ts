import { NextResponse } from "next/server";
import { getCurrentUserFromToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUserFromToken(req);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ 
      id: user.id,
      email: user.email,
      username: user.username,
    });
  } catch (error) {
    console.error("Error in auth route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
