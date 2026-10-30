import Link from "next/link";
import FoodArt from "./FoodArt";

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

function CtaButtons() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <Link href="/giris?kayit=1" className="btn-primary rounded-full px-7 py-3.5 text-base">Ücretsiz başla</Link>
      <Link href="/nasil-calisir" className="btn-ghost rounded-full px-7 py-3.5 text-base">Nasıl çalışır?</Link>
    </div>
  );
}

/** Owner tarzı kapanış: başlık, butonlar, restoran uygulaması görünen telefon, tekrar butonlar. */
export function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#eaf7ea] to-[#d3f1d6]">
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-60" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M-50 ${520 + i * 60} C 360 ${300 + i * 60}, 1080 ${760 + i * 40}, 1500 ${420 + i * 60}`} fill="none" stroke="#16ad38" strokeOpacity={0.18} strokeWidth="1.5" />
        ))}
      </svg>
      <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-16 text-center sm:pt-28">
        <h2 className="mx-auto max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-balance sm:text-6xl">
          Restoran satışlarınızı artırmanın en kolay yolu.
        </h2>
        <div className="mt-8">
          <CtaButtons />
        </div>

        <div className="mx-auto mt-14 h-[480px] w-[250px] sm:h-[570px] sm:w-[300px]">
          <div className="origin-top scale-[0.83] sm:scale-100">
            <div className="w-[300px] rounded-[44px] bg-[#111] p-2 text-left shadow-[0_40px_90px_-30px_rgba(9,68,19,0.55)]">
              <div className="relative h-[560px] overflow-hidden rounded-[37px] bg-white text-ink">
                <div className="absolute inset-x-0 top-0 z-10 flex h-8 items-center justify-between px-6 text-[11px] font-semibold text-white">
                  <span>19:05</span>
                  <span className="h-[18px] w-[72px] rounded-full bg-[#111]" />
                  <span>5G</span>
                </div>
                <FoodArt kind="burger" className="h-[250px] w-full" />
                <div className="px-5 pt-4">
                  <p className="text-[11px] font-semibold text-muted">Sizin restoranınız</p>
                  <p className="text-xl font-bold tracking-tight">Çıtır tavuk burger</p>
                  <div className="mt-3 grid grid-cols-2 rounded-full bg-bg p-1 text-center text-[12px] font-semibold">
                    <span className="rounded-full bg-white py-1.5 shadow-sm">Gel-al</span>
                    <span className="py-1.5 text-muted">Paket servis</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-2xl border border-line px-3 py-2.5 text-[12px]">
                    <span className="text-muted">Teslim alma</span>
                    <span className="font-semibold">Bugün 19:30</span>
                  </div>
                  <div className="mt-3 rounded-2xl bg-[#eaf7ea] p-3">
                    <p className="text-[12px] font-semibold text-brand">İlk hediyenize 400 puan kaldı</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white">
                      <div className="h-full w-[60%] rounded-full bg-accent" />
                    </div>
                  </div>
                  <div className="mt-3 flex h-11 items-center justify-center rounded-2xl bg-ink text-[13px] font-semibold text-white">
                    Sipariş ver · 245 ₺
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <CtaButtons />
        </div>
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
