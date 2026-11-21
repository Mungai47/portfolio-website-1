import { NextResponse } from "next/server";
import { isValidAdminPassword, setAdminSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET) {
    return NextResponse.json({ error: "Admin sign-in is not configured on this server." }, { status: 503 });
  }

  let body: { password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (typeof body.password !== "string" || !isValidAdminPassword(body.password)) {
    return NextResponse.json({ error: "That password is not correct." }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
