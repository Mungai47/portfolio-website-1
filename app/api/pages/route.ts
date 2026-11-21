import { NextResponse } from "next/server";
import { getPages } from "@/lib/pages";

export const runtime = "nodejs";

export async function GET() {
  try {
    return NextResponse.json(await getPages());
  } catch {
    return NextResponse.json({ error: "Could not load portfolio pages." }, { status: 500 });
  }
}
