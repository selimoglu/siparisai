import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/site/Reveal";
import { POSTS } from "@/components/site/posts";
import { PageHero } from "@/components/site/Blocks";

export const metadata: Metadata = { title: "Blog · SiparişAI" };

const dateTr = (d: string) => new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });

export default function Blog() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Restoranın için büyüme rehberleri."
        sub="Komisyon, doğrudan sipariş, Google ve müşteri sadakati üzerine kısa ve uygulanabilir yazılar."
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-24 md:grid-cols-3">
        {POSTS.map((p, i) => (
          <Reveal key={p.slug} delay={i * 100}>
            <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col rounded-3xl p-6 ring-1 ring-line transition hover:bg-bg hover:ring-accent">
              <div className="mb-5 h-36 rounded-2xl bg-gradient-to-br from-[#16ad38] via-[#0f8f28] to-[#094413]" />
              <p className="text-xs text-muted">{dateTr(p.date)} · {p.minutes} dk okuma</p>
              <h2 className="mt-2 font-display text-xl leading-snug font-bold">{p.title}</h2>
              <p className="mt-2 flex-1 text-muted">{p.excerpt}</p>
              <span className="mt-4 text-sm font-semibold text-brand group-hover:underline">Oku →</span>
            </Link>
          </Reveal>
        ))}
      </section>
    </>
  );
}
