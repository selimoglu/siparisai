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
      <h2 className="font-display text-[28px] leading-[1.1] font-bold tracking-tight sm:text-[40px]">{title}</h2>
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
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="max-w-3xl font-display text-[34px] leading-[1.08] font-bold tracking-tight sm:text-[52px]">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">{sub}</p>
        <div className="mt-8">
          <Ctas />
        </div>
      </div>
    </section>
  );
}

/** Owner tarzı kapanış: yeşil panel, solda başlık ve butonlar, sağda çapraz duran restoran uygulaması. */
export function FinalCta() {
  return (
    <section className="overflow-x-clip bg-white px-3 pt-20 pb-6 sm:px-6 sm:pt-28 sm:pb-10">
      <div className="relative mx-auto max-w-[1280px] rounded-[28px] bg-gradient-to-r from-[#0b8a25] via-[#1c9f3f] to-[#5fd07a] sm:rounded-[36px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1280 520" preserveAspectRatio="none" aria-hidden>
            {Array.from({ length: 10 }, (_, i) => (
              <path key={i} d={`M${-100 + i * 150} 560 Q ${300 + i * 80} 260 ${700 + i * 110} -40`} fill="none" stroke="white" strokeOpacity="0.08" strokeWidth="1.2" />
            ))}
          </svg>
        </div>
        <div className="relative grid lg:grid-cols-2">
          <div className="px-6 pt-12 pb-4 sm:px-12 lg:py-32 lg:pl-20">
            <h2 className="max-w-[520px] text-[32px] leading-[1.06] font-bold tracking-tight text-balance text-white sm:text-[48px]">
              Restoran satışlarınızı artırmanın en kolay yolu.
            </h2>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/giris?kayit=1" className="rounded-xl bg-white px-6 py-3.5 text-[16px] font-bold text-ink transition hover:bg-[#eafbe9]">
                Ücretsiz başla
              </Link>
              <Link href="/nasil-calisir" className="rounded-xl bg-white/25 px-6 py-3.5 text-[16px] font-bold text-white transition hover:bg-white/35">
                Nasıl çalışır?
              </Link>
            </div>
          </div>

          {/* Telefon: üstten panelin dışına taşar, altta panelin kenarında kesilir */}
          <div className="relative h-[380px] [clip-path:inset(-300px_-300px_0_-300px)] lg:h-auto">
            <div className="absolute top-4 left-[62%] w-[300px] origin-top -translate-x-[50%] scale-[0.78] rotate-[13deg] sm:top-8 sm:left-1/2 sm:origin-center sm:-translate-x-[45%] sm:scale-100 lg:-top-20 lg:left-[42%]">
              <div className="rounded-[46px] bg-[#111] p-2.5 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)]">
                <div className="relative h-[600px] overflow-hidden rounded-[38px] bg-white text-ink">
                  <div className="absolute inset-x-0 top-0 z-10 flex h-9 items-center justify-between px-7 text-[12px] font-bold text-white">
                    <span>19:05</span>
                    <span className="h-[22px] w-[84px] rounded-full bg-[#111]" />
                    <span>5G</span>
                  </div>
                  <div className="relative">
                    <FoodArt kind="doner" className="h-[190px] w-full" />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
                    <span className="absolute top-12 left-4 grid h-9 w-9 place-items-center rounded-full bg-white/90">
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
                        <circle cx="8" cy="5" r="3" fill="#2c2c2c" />
                        <path d="M2 15c0-3.3 2.7-5 6-5s6 1.7 6 5Z" fill="#2c2c2c" />
                      </svg>
                    </span>
                  </div>
                  <div className="-mt-6 px-5 text-center">
                    <p className="relative text-[22px] font-bold tracking-tight">Sizin restoranınız</p>
                    <p className="text-[12px] text-muted">Merkez Mah. No: 12</p>
                    <p className="mt-0.5 text-[12px] font-semibold text-accent">● 00:00&apos;a kadar açık</p>
                  </div>
                  <div className="px-4 pt-4">
                    <div className="grid grid-cols-2 rounded-2xl bg-[#f2f2ef] p-1 text-center text-[13px] font-semibold">
                      <span className="rounded-xl bg-white py-2 shadow-sm ring-1 ring-line">Gel-al</span>
                      <span className="py-2 text-muted">Paket servis</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[12px] font-semibold">
                      <span className="flex items-center justify-between rounded-xl bg-[#f2f2ef] px-3 py-2.5">Masa 12 <span className="text-muted">›</span></span>
                      <span className="flex items-center justify-between rounded-xl bg-[#f2f2ef] px-3 py-2.5">⚡ 30 dk <span className="text-muted">›</span></span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-[15px] font-bold">Puan kazanın</p>
                      <p className="text-[12px] text-muted">Keşfet ›</p>
                    </div>
                    <div className="mt-2 flex items-center gap-3 rounded-2xl bg-[#f6f6f3] p-3">
                      <FoodArt kind="lahmacun" className="h-11 w-11 shrink-0 rounded-xl" />
                      <div className="flex-1">
                        <div className="relative h-1 rounded-full bg-[#e2e2de]">
                          <div className="absolute inset-y-0 left-0 w-[35%] rounded-full bg-ink" />
                          <span className="absolute top-1/2 left-[35%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
                        </div>
                        <div className="mt-1.5 flex justify-around text-[10px] font-semibold text-muted">
                          <span>100</span>
                          <span>500</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
