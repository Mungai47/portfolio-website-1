import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPages } from "@/lib/pages";

export const dynamic = "force-dynamic";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const portfolioPage = (await getPages()).find((page) => page.slug === slug);
  if (!portfolioPage) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-[1440px] px-6 md:px-12">
      <header className="flex items-center justify-between py-6">
        <Link href="/" className="serif text-2xl tracking-[-0.06em]">still <span className="text-[#c46d4c]">/</span> light</Link>
        <Link href="/#work" className="text-[10px] uppercase tracking-[0.2em] text-[#777a72] hover:text-[#c46d4c]">← All stories</Link>
      </header>
      <section className="py-16 md:py-24">
        <p className="mb-5 text-[10px] uppercase tracking-[0.26em] text-[#c46d4c]">{portfolioPage.category}</p>
        <h1 className="serif max-w-5xl text-6xl leading-[0.9] tracking-[-0.07em] md:text-9xl">{portfolioPage.title}</h1>
        <p className="mt-7 max-w-lg text-sm leading-7 text-[#777a72]">{portfolioPage.description}</p>
      </section>
      <section className="grid gap-4 pb-20 md:grid-cols-2">
        {portfolioPage.images.length > 0 ? portfolioPage.images.map((image, index) => (
            <div key={`${image}-${index}`} className={`${index === 0 ? "md:col-span-2" : ""} overflow-hidden bg-[#e7e4dc]`}>
              <Image
                src={image}
                alt={`${portfolioPage.title}, photograph ${index + 1}`}
                width={1800}
                height={1200}
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
                className="max-h-[850px] w-full object-cover"
              />
            </div>
          )) : (
            <p className="py-12 text-sm text-[#777a72]">Photographs for this story are coming soon.</p>
          )}
      </section>
      <footer className="flex justify-between border-t border-[#deddd5] py-6 text-[9px] uppercase tracking-[0.2em] text-[#777a72]">
        <span>© 2026 Still / Light Studio</span>
        <Link href="/#contact" className="hover:text-[#c46d4c]">Get in touch ↗</Link>
      </footer>
    </main>
  );
}
