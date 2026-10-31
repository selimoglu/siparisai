import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS } from "@/components/site/posts";
import { FinalCta } from "@/components/site/Blocks";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  return p ? { title: `${p.title} · SiparişAI`, description: p.excerpt } : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <>
      <article className="mx-auto max-w-2xl px-4 py-16 sm:py-24">
        <Link href="/blog" className="text-sm font-semibold text-brand">← Blog</Link>
        <h1 className="mt-6 font-display text-[32px] leading-[1.1] font-bold tracking-tight sm:text-[44px]">{p.title}</h1>
        <p className="mt-4 text-lg text-muted">{p.excerpt}</p>
        <p className="mt-2 text-sm text-muted">{p.minutes} dk okuma</p>
        <div className="mt-10 space-y-5 text-lg leading-relaxed text-ink/85">
          {p.body.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </article>
      <FinalCta />
    </>
  );
}
