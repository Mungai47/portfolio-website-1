import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getPages, savePages } from "@/lib/pages";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sign in to manage portfolio pages." }, { status: 401 });
  }
  try {
    return NextResponse.json(await getPages());
  } catch {
    return NextResponse.json({ error: "Could not load portfolio pages." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sign in to manage portfolio pages." }, { status: 401 });
  }

  let body: { title?: unknown; category?: unknown; description?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  if (!title || title.length > 100 || !category || category.length > 50 || description.length > 500) {
    return NextResponse.json({ error: "Add a title (up to 100 characters), category (up to 50), and description (up to 500)." }, { status: 400 });
  }

  const pages = await getPages();
  const baseSlug = title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "gallery";
  let slug = baseSlug;
  let suffix = 2;
  while (pages.some((page) => page.slug === slug)) slug = `${baseSlug}-${suffix++}`;

  const page = {
    slug,
    title,
    category,
    description,
    coverImage: "",
    images: [] as string[],
    createdAt: new Date().toISOString(),
  };
  await savePages([page, ...pages]);
  return NextResponse.json(page, { status: 201 });
}
