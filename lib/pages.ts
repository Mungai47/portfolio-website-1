import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { PortfolioPage } from "@/lib/types";

const dataDirectory = path.join(process.cwd(), "data");
const pagesFile = path.join(dataDirectory, "pages.json");

export async function getPages(): Promise<PortfolioPage[]> {
  try {
    const contents = await readFile(pagesFile, "utf8");
    const pages: unknown = JSON.parse(contents);
    if (!Array.isArray(pages)) {
      throw new Error("Portfolio page data must be an array.");
    }
    return pages as PortfolioPage[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function savePages(pages: PortfolioPage[]): Promise<void> {
  await mkdir(dataDirectory, { recursive: true });
  const temporaryFile = `${pagesFile}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(pages, null, 2)}\n`, "utf8");
  const { rename } = await import("node:fs/promises");
  await rename(temporaryFile, pagesFile);
}
