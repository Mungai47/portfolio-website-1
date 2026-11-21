"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PortfolioPage } from "@/lib/types";

export default function AdminDashboard() {
  const [pages, setPages] = useState<PortfolioPage[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  async function loadPages() {
    const response = await fetch("/api/admin/pages");
    if (response.status === 401) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Could not load your pages.");
    setPages(data);
    setAuthenticated(true);
    setLoading(false);
  }

  useEffect(() => {
    loadPages().catch((cause: unknown) => {
      setError(cause instanceof Error ? cause.message : "Could not connect to the server.");
      setLoading(false);
    });
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Sign-in failed.");
      setPassword("");
      await loadPages();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  async function createPage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, description }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create the page.");
      setPages((current) => [data, ...current]);
      setTitle("");
      setCategory("");
      setDescription("");
      setNotice(`“${data.title}” is ready. Upload photographs to publish it.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create the page.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadImages(slug: string, files: File[]) {
    if (files.length === 0) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const form = new FormData();
      files.forEach((file) => form.append("files", file));
      form.append("slug", slug);
      const response = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Upload failed.");
      setPages((current) => current.map((page) => page.slug === slug ? data.page : page));
      setNotice(`${data.imageUrls.length} ${data.imageUrls.length === 1 ? "photograph" : "photographs"} uploaded.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload failed.");
    } finally {
      setBusy(false);
      const input = fileInputs.current[slug];
      if (input) input.value = "";
    }
  }

  async function deletePage(page: PortfolioPage) {
    if (!window.confirm(`Delete “${page.title}”? This removes the page from your portfolio.`)) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/pages/${encodeURIComponent(page.slug)}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete the page.");
      setPages((current) => current.filter((item) => item.slug !== page.slug));
      setNotice(`“${page.title}” was deleted.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not delete the page.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthenticated(false);
    setPages([]);
  }

  if (loading) {
    return <main className="grid min-h-screen place-items-center text-sm text-[#777a72]">Opening your studio…</main>;
  }

  if (!authenticated) {
    return (
      <main className="grid min-h-screen place-items-center px-6">
        <section className="w-full max-w-md">
          <Link href="/" className="serif text-2xl tracking-[-0.06em]">still <span className="text-[#c46d4c]">/</span> light</Link>
          <p className="mt-16 text-[10px] uppercase tracking-[0.25em] text-[#c46d4c]">Private studio</p>
          <h1 className="serif mt-3 text-5xl tracking-[-0.06em]">Welcome back.</h1>
          <p className="mt-4 text-sm leading-6 text-[#777a72]">Sign in to create portfolio pages and add your latest photographs.</p>
          <form onSubmit={signIn} className="mt-9">
            <label htmlFor="password" className="mb-2 block text-[10px] uppercase tracking-[0.18em]">Studio password</label>
            <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full border border-[#deddd5] bg-transparent px-4 py-3 outline-none focus:border-[#c46d4c]" />
            {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
            <button disabled={busy} className="mt-4 w-full bg-[#1d211e] px-5 py-3 text-[10px] uppercase tracking-[0.2em] text-white disabled:opacity-50">{busy ? "Signing in…" : "Enter studio →"}</button>
          </form>
          <Link href="/" className="mt-8 inline-block text-xs text-[#777a72] hover:text-[#c46d4c]">← Back to portfolio</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] px-6 md:px-12">
      <header className="flex items-center justify-between border-b border-[#deddd5] py-6">
        <Link href="/" className="serif text-2xl tracking-[-0.06em]">still <span className="text-[#c46d4c]">/</span> light</Link>
        <div className="flex items-center gap-5">
          <Link href="/" className="text-[10px] uppercase tracking-[0.18em] text-[#777a72] hover:text-[#c46d4c]">View portfolio ↗</Link>
          <button onClick={signOut} className="text-[10px] uppercase tracking-[0.18em] text-[#777a72] hover:text-[#c46d4c]">Sign out</button>
        </div>
      </header>
      <section className="py-12 md:py-16">
        <p className="text-[10px] uppercase tracking-[0.25em] text-[#c46d4c]">Your workspace</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1 className="serif text-6xl tracking-[-0.07em] md:text-8xl">Studio desk</h1>
          <p className="pb-2 text-sm text-[#777a72]">{pages.length} portfolio {pages.length === 1 ? "page" : "pages"}</p>
        </div>
        <p className="mt-4 max-w-lg text-sm leading-6 text-[#777a72]">Create a new story for your portfolio, then add photographs to bring it to life.</p>
      </section>

      <section className="grid gap-12 border-t border-[#deddd5] py-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#c46d4c]">01 — New story</p>
          <h2 className="serif mt-3 text-4xl tracking-[-0.05em]">Create a page</h2>
          <form onSubmit={createPage} className="mt-7 space-y-5">
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.16em]">Page title</span>
              <input required maxLength={100} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. The Sunday Table" className="w-full border-b border-[#c9c8c0] bg-transparent py-3 text-sm outline-none placeholder:text-[#a3a39d] focus:border-[#c46d4c]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.16em]">Category</span>
              <input required maxLength={50} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Portraits, Travel, Editorial…" className="w-full border-b border-[#c9c8c0] bg-transparent py-3 text-sm outline-none placeholder:text-[#a3a39d] focus:border-[#c46d4c]" />
            </label>
            <label className="block">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.16em]">Short introduction</span>
              <textarea maxLength={500} rows={3} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="A few words about this collection…" className="w-full resize-y border-b border-[#c9c8c0] bg-transparent py-3 text-sm outline-none placeholder:text-[#a3a39d] focus:border-[#c46d4c]" />
            </label>
            <button disabled={busy} className="bg-[#1d211e] px-6 py-3 text-[10px] uppercase tracking-[0.18em] text-white disabled:opacity-50">{busy ? "Please wait…" : "Create portfolio page →"}</button>
          </form>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#c46d4c]">02 — Your stories</p>
          <div className="mt-3 divide-y divide-[#deddd5]">
            {pages.map((page) => (
              <article key={page.slug} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
                <div className="h-20 w-24 shrink-0 overflow-hidden bg-[#e7e4dc]">
                  {page.coverImage && <Image src={page.coverImage} alt="" width={96} height={80} unoptimized className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="serif truncate text-2xl tracking-[-0.04em]">{page.title}</h3>
                  <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-[#777a72]">{page.category} · {page.images.length} {page.images.length === 1 ? "image" : "images"}</p>
                  <Link href={`/portfolio/${page.slug}`} className="mt-2 inline-block text-[10px] text-[#c46d4c] hover:underline">Open page ↗</Link>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <input
                    ref={(element) => { fileInputs.current[page.slug] = element; }}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    className="sr-only"
                    aria-label={`Upload photographs to ${page.title}`}
                    onChange={(event) => uploadImages(page.slug, Array.from(event.target.files ?? []))}
                  />
                  <button disabled={busy} onClick={() => fileInputs.current[page.slug]?.click()} className="border border-[#c9c8c0] px-4 py-2 text-[9px] uppercase tracking-[0.14em] hover:border-[#1d211e] disabled:opacity-50">+ Photos</button>
                  <button disabled={busy} onClick={() => deletePage(page)} className="px-2 py-2 text-[9px] uppercase tracking-[0.14em] text-[#777a72] hover:text-red-700 disabled:opacity-50">Delete</button>
                </div>
              </article>
            ))}
            {pages.length === 0 && <p className="py-10 text-sm text-[#777a72]">No portfolio pages yet. Create your first story on the left.</p>}
          </div>
        </div>
      </section>
      {(error || notice) && (
        <p role={error ? "alert" : "status"} className={`fixed bottom-6 left-1/2 z-20 -translate-x-1/2 px-5 py-3 text-sm text-white shadow-lg ${error ? "bg-red-800" : "bg-[#1d211e]"}`}>
          {error || notice}
        </p>
      )}
    </main>
  );
}
