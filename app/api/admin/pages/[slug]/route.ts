import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getPages, savePages } from "@/lib/pages";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sign in to manage portfolio pages." }, { status: 401 });
  }
  const { slug } = await params;
  const pages = await getPages();
  const remaining = pages.filter((page) => page.slug !== slug);
  if (remaining.length === pages.length) {
    return NextResponse.json({ error: "That portfolio page was not found." }, { status: 404 });
  }
  await savePages(remaining);
  return NextResponse.json({ ok: true });
}
