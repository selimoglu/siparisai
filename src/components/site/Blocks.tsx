import Link from "next/link";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-sm font-semibold tracking-wide text-accent uppercase">{children}</p>;
}

export function SectionHead({
  eyebrow, title, sub, center = false,
}: { eyebrow?: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl">{title}</h2>
      {sub && <p className="mt-4 text-lg text-muted">{sub}</p>}
    </div>
  );
}

export function Ctas({ secondary = { label: "Komisyonunu hesapla", href: "/#hesapla" } }: {
  secondary?: { label: string; href: string } | null;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/giris?kayit=1" className="btn-primary rounded-full px-7 py-3.5 text-base">
        Ücretsiz başla
      </Link>
      {secondary && (
        <Link href={secondary.href} className="btn-dark rounded-full px-7 py-3.5 text-base">
          {secondary.label}
        </Link>
      )}
    </div>
  );
}

export function PageHero({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-tight sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">{sub}</p>
        <div className="mt-8">
          <Ctas />
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <div className="rounded-3xl bg-brand px-6 py-14 text-center text-white sm:px-12">
        <h2 className="mx-auto max-w-2xl font-display text-3xl leading-tight font-bold sm:text-5xl">
          Platforma çalışmayı bırak. Kendi restoranın için çalış.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/75">
          10 dakikada siten hazır. Taahhüt yok, sipariş başına komisyon yok, müşteri listesi her zaman senin.
        </p>
        <Link
          href="/giris?kayit=1"
          className="btn mt-8 rounded-full bg-accent px-8 py-3.5 text-base text-white hover:brightness-110"
        >
          Ücretsiz başla
        </Link>
      </div>
    </section>
  );
}

export function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className="mt-0.5 shrink-0">
      <circle cx="9" cy="9" r="9" fill="#16ad38" />
      <path d="M5 9.2 7.6 11.8 13 6.4" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Cross() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className="mt-0.5 shrink-0">
      <circle cx="9" cy="9" r="9" fill="#e5e5e5" />
      <path d="M6 6l6 6M12 6l-6 6" stroke="#6b6b6b" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
