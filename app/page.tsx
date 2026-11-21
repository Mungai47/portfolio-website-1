import Link from "next/link";
import Image from "next/image";
import { getPages } from "@/lib/pages";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const pages = await getPages();

  return (
    <main>
      <header className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-6 md:px-12">
        <Link href="/" className="serif text-2xl tracking-[-0.06em]">
          still <span className="text-[#c46d4c]">/</span> light
        </Link>
        <nav className="flex items-center gap-8 text-[11px] uppercase tracking-[0.2em]">
          <a className="hidden transition-colors hover:text-[#c46d4c] sm:block" href="#work">Selected work</a>
          <a className="transition-colors hover:text-[#c46d4c]" href="#contact">Contact</a>
          <Link className="rounded-full border border-[#1d211e] px-4 py-2 transition-colors hover:bg-[#1d211e] hover:text-[#f5f3ed]" href="/admin">
            Client access
          </Link>
        </nav>
      </header>

      <section className="relative mx-auto grid min-h-[620px] max-w-[1440px] overflow-hidden px-6 md:min-h-[690px] md:grid-cols-[0.85fr_1.15fr] md:px-12">
        <div className="relative z-10 flex flex-col justify-center py-16 md:py-20">
          <p className="mb-7 text-[10px] uppercase tracking-[0.3em] text-[#777a72]">Photographer & visual storyteller</p>
          <h1 className="serif max-w-[660px] text-[clamp(4rem,9vw,8.5rem)] leading-[0.87] tracking-[-0.075em]">
            A life, <span className="italic text-[#c46d4c]">well</span>
            <br /> observed.
          </h1>
          <p className="mt-8 max-w-sm text-sm leading-7 text-[#777a72]">
            Honest photographs for the things worth remembering. Based in
            Nairobi, available everywhere.
          </p>
          <a href="#work" className="mt-10 flex w-fit items-center gap-4 text-[10px] uppercase tracking-[0.24em]">
            Explore selected work <span aria-hidden="true" className="text-lg">↓</span>
          </a>
        </div>
        <div className="relative min-h-[390px] md:min-h-[610px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1800&q=90')" }}
            role="img"
            aria-label="Golden morning light over a quiet field"
          />
          <div className="grain pointer-events-none absolute inset-0 opacity-30" />
          <p className="absolute bottom-5 right-0 text-[9px] uppercase tracking-[0.2em] text-white">Fig. 01 — First light, Naivasha</p>
        </div>
        <div className="absolute bottom-0 left-6 right-6 border-t border-[#deddd5] md:left-12 md:right-12" />
      </section>

      <section id="work" className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 md:py-32">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.26em] text-[#c46d4c]">The collection</p>
            <h2 className="serif text-5xl tracking-[-0.06em] md:text-7xl">Selected work</h2>
          </div>
          <span className="hidden pb-2 text-[10px] uppercase tracking-[0.2em] text-[#777a72] sm:block">{String(pages.length).padStart(2, "0")} stories</span>
        </div>
        {pages.length > 0 ? (
          <div className="grid gap-x-6 gap-y-12 md:grid-cols-2">
            {pages.map((page, index) => (
              <Link
                href={`/portfolio/${page.slug}`}
                key={page.slug}
                className={`group block ${index % 2 === 1 ? "md:mt-24" : ""}`}
              >
                <div className="relative aspect-[1.24] overflow-hidden bg-[#e7e4dc]">
                  {page.coverImage || page.images[0] ? (
                    <Image
                      src={page.coverImage || page.images[0]}
                      alt={page.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      unoptimized
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-[10px] uppercase tracking-[0.2em] text-[#777a72]">Photographs coming soon</div>
                  )}
                  <span className="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-[#f5f3ed] text-lg transition-transform group-hover:rotate-45">↗</span>
                </div>
                <div className="mt-5 flex items-start justify-between">
                  <div>
                    <h3 className="serif text-3xl tracking-[-0.045em]">{page.title}</h3>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#777a72]">{page.category}</p>
                  </div>
                  <span className="pt-2 text-[10px] text-[#777a72]">0{index + 1}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="border-t border-[#deddd5] py-12 text-sm text-[#777a72]">New stories are on their way. Check back soon.</p>
        )}
      </section>

      <section id="contact" className="bg-[#1d211e] px-6 py-24 text-[#f5f3ed] md:px-12 md:py-32">
        <div className="mx-auto max-w-[1296px]">
          <p className="mb-6 text-[10px] uppercase tracking-[0.26em] text-[#d89576]">Have something in mind?</p>
          <h2 className="serif max-w-4xl text-6xl leading-[0.95] tracking-[-0.065em] md:text-8xl">Let’s make something that feels like you.</h2>
          <a className="mt-10 inline-block border-b border-[#8c8f86] pb-2 text-sm" href="mailto:hello@stillandlight.studio">hello@stillandlight.studio ↗</a>
          <footer className="mt-24 flex flex-col justify-between gap-4 border-t border-[#444841] pt-5 text-[9px] uppercase tracking-[0.2em] text-[#a2a49e] sm:flex-row">
            <span>© 2026 Still / Light Studio</span>
            <span>Nairobi, Kenya · Available worldwide</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
