import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getPages, savePages } from "@/lib/pages";

export const runtime = "nodejs";

const imageTypes: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};
const maxBytes = 10 * 1024 * 1024;
const maxFiles = 20;
const maxBatchBytes = 50 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sign in to upload photographs." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Could not read the upload." }, { status: 400 });
  }
  const files = form.getAll("files");
  const slug = form.get("slug");
  if (typeof slug !== "string" || files.length === 0 || files.some((file) => !(file instanceof File))) {
    return NextResponse.json({ error: "Choose one or more images and a portfolio page." }, { status: 400 });
  }
  const imageFiles = files as File[];
  if (imageFiles.length > maxFiles) {
    return NextResponse.json({ error: `Upload no more than ${maxFiles} images at a time.` }, { status: 413 });
  }
  if (imageFiles.some((file) => !imageTypes[file.type])) {
    return NextResponse.json({ error: "Use a JPEG, PNG, WebP, or GIF image." }, { status: 415 });
  }
  if (imageFiles.some((file) => file.size === 0 || file.size > maxBytes)) {
    return NextResponse.json({ error: "Each image must be smaller than 10 MB." }, { status: 413 });
  }
  if (imageFiles.reduce((total, file) => total + file.size, 0) > maxBatchBytes) {
    return NextResponse.json({ error: "The combined upload must be smaller than 50 MB." }, { status: 413 });
  }

  const pages = await getPages();
  const pageIndex = pages.findIndex((page) => page.slug === slug);
  if (pageIndex === -1) {
    return NextResponse.json({ error: "That portfolio page was not found." }, { status: 404 });
  }

  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDirectory, { recursive: true });
  const filenames = imageFiles.map((file) => `${randomUUID()}${imageTypes[file.type]}`);
  const imageUrls = filenames.map((filename) => `/uploads/${filename}`);
  const writtenFiles: string[] = [];

  try {
    for (let index = 0; index < imageFiles.length; index += 1) {
      const file = imageFiles[index];
      const filename = filenames[index];
      await writeFile(
        path.join(uploadDirectory, filename),
        Buffer.from(await file.arrayBuffer()),
        { flag: "wx" },
      );
      writtenFiles.push(path.join(uploadDirectory, filename));
    }

    pages[pageIndex].images.push(...imageUrls);
    if (!pages[pageIndex].coverImage) pages[pageIndex].coverImage = imageUrls[0];
    await savePages(pages);
  } catch (error) {
    await Promise.all(writtenFiles.map((filePath) => unlink(filePath)));
    throw error;
  }

  return NextResponse.json({ imageUrls, page: pages[pageIndex] }, { status: 201 });
}
