"use client";

import { useInView, useSteps } from "./anim";

/*
 * Ana sayfa ilk bölüm görseli: restoranın bugünkü sorunu.
 * 1) Google'da rakipler üstte, sen en altta.  2) Aşağı kayar: platformda yüksek komisyon ve olumsuz metrikler.
 */
const DUR = [1400, 1700, 2100, 1500, 3200, 500] as const;
const QUERY = "yakınımda pide siparişi";

const RIVALS = [
  { n: "Rakip 1", r: "4,7", d: "0,8 km" },
  { n: "Rakip 2", r: "4,6", d: "1,1 km" },
  { n: "Rakip 3", r: "4,5", d: "1,4 km" },
];

function Phone({ s }: { s: number }) {
  const scrolled = s >= 3 && s <= 4;
  return (
    <div className="rounded-[44px] bg-[#111] p-2 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
      <div className="relative h-[500px] w-[290px] overflow-hidden rounded-[37px] bg-white text-ink">
        <div className="absolute inset-x-0 top-0 z-20 flex h-8 items-center justify-between bg-white px-6 text-[11px] font-semibold">
          <span>12:30</span>
          <span className="h-[18px] w-[72px] rounded-full bg-[#111]" />
          <span>5G</span>
        </div>

        <div
          className="absolute inset-x-0 top-8 transition-transform duration-[900ms] ease-[cubic-bezier(0.3,0.7,0.2,1)]"
          style={{ transform: `translateY(${scrolled ? -468 : 0}px)` }}
        >
          {/* Google */}
          <div className="h-[468px] px-4 pt-3">
            <p className="text-center text-lg font-bold tracking-tight">
              <span className="text-[#4285f4]">G</span><span className="text-[#ea4335]">o</span><span className="text-[#fbbc05]">o</span><span className="text-[#4285f4]">g</span><span className="text-[#34a853]">l</span><span className="text-[#ea4335]">e</span>
            </p>
            <div className="mt-2 flex h-10 items-center rounded-full border border-line px-4 text-[12px] shadow-sm">
              <span
                key={s === 0 ? "typing" : "typed"}
                className="block whitespace-nowrap"
                style={s === 0 ? { clipPath: "inset(0 100% 0 0)", animation: "reveal-text 1.2s steps(24) forwards" } : undefined}
              >
                {QUERY}
              </span>
            </div>
            <div className={`mt-3 space-y-2 transition-opacity duration-500 ${s >= 1 ? "opacity-100" : "opacity-0"}`}>
              {RIVALS.map((r, i) => (
                <div
                  key={r.n}
                  className={`flex items-center gap-3 rounded-2xl border border-line p-3 ${s >= 1 ? "anim-slide-in" : ""}`}
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-[#1a0dab]">{r.n}</p>
                    <p className="text-[10px] text-muted">★ {r.r} · {r.d} · Açık</p>
                  </div>
                  <span className="rounded-full bg-[#e8f0fe] px-2.5 py-1 text-[10px] font-semibold text-[#1a73e8]">Sipariş ver</span>
                </div>
              ))}
              <div
                className={`flex items-center gap-3 rounded-2xl border p-3 transition-all duration-500 ${
                  s >= 2 ? "border-[#e5484d] bg-[#fff1f1]" : "border-line opacity-60"
                } ${s >= 1 ? "anim-slide-in" : ""}`}
                style={{ animationDelay: "360ms" }}
              >
                <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white ${s >= 2 ? "bg-[#e5484d]" : "bg-muted"}`}>4</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold">Sizin restoranınız</p>
                  <p className="text-[10px] text-muted">Web sitesi yok · Menü bulunamadı</p>
                </div>
              </div>
              <p className={`pt-1 text-center text-[12px] font-semibold text-[#e5484d] transition-opacity duration-500 ${s >= 2 ? "opacity-100" : "opacity-0"}`}>
                Müşteri sizi bulamadan rakibe gidiyor
              </p>
            </div>
          </div>

          {/* Sipariş platformu */}
          <div className="h-[468px] bg-bg px-4 pt-4">
            <p className="text-[11px] font-semibold tracking-wide text-muted uppercase">Sipariş platformu</p>
            <div className="mt-2 rounded-2xl bg-white p-3 ring-1 ring-line">
              <p className="text-[10px] font-semibold text-muted">Sponsorlu</p>
              <p className="text-[13px] font-semibold">Rakip 2</p>
            </div>
            <div className="mt-2 rounded-2xl bg-white p-3 ring-1 ring-line">
              <p className="text-[13px] font-semibold">Sizin restoranınız</p>
              <p className="text-[10px] text-muted">Listede 7. sırada</p>
            </div>

            <div className={`mt-3 rounded-2xl bg-white p-4 ring-1 ring-line transition-all duration-500 ${s === 4 ? "opacity-100" : "translate-y-3 opacity-0"}`}>
              <p className="text-[12px] font-bold">Siparişinizden ne kaldı?</p>
              <div className="mt-2 space-y-1.5 text-[12px]">
                <p className="flex justify-between"><span>Sipariş tutarı</span><span className="font-semibold">500 ₺</span></p>
                <p className="flex justify-between text-[#e5484d]"><span>Platform komisyonu (%22)</span><span className="font-semibold">−110 ₺</span></p>
                <p className="flex justify-between text-[#e5484d]"><span>Öne çıkarma reklamı</span><span className="font-semibold">−35 ₺</span></p>
                <p className="flex justify-between border-t border-line pt-2 text-[14px] font-bold"><span>Size kalan</span><span>355 ₺</span></p>
              </div>
            </div>
            <div className={`mt-3 grid grid-cols-2 gap-2 transition-all delay-200 duration-500 ${s === 4 ? "opacity-100" : "translate-y-3 opacity-0"}`}>
              {[
                ["Müşteri bilgisi", "Yok"],
                ["Tekrar sipariş", "Platformun"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-[#fff1f1] p-2.5">
                  <p className="text-[10px] text-muted">{k}</p>
                  <p className="text-[12px] font-bold text-[#e5484d]">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroProblem() {
  const [ref, inView] = useInView<HTMLDivElement>(0.25);
  const s = useSteps(DUR, inView, 4);
  const googlePhase = s >= 1 && s <= 2;
  const platformPhase = s >= 3 && s <= 4;

  return (
    <div ref={ref} className="relative mx-auto flex max-w-5xl justify-center" aria-label="Restoranın Google'da rakiplerin altında kalması ve platforma yüksek komisyon ödemesini gösteren animasyon">
      {/* Sol: Google özeti */}
      <div className={`absolute top-20 left-0 hidden w-[240px] transition-all duration-500 lg:block ${googlePhase ? "opacity-100" : "translate-y-3 opacity-0"}`}>
        <div className="rounded-3xl bg-white p-5 text-ink shadow-2xl shadow-black/20">
          <p className="text-xs text-muted">Google sıralamanız</p>
          <p className="mt-1 text-5xl font-bold tracking-tight text-[#e5484d]">4.</p>
          <p className="mt-2 text-sm">3 rakip üstte. Arayanların çoğu ilk sonuçtan sipariş verir.</p>
        </div>
      </div>

      {/* Telefon: mobilde küçültülür */}
      <div className="h-[372px] sm:h-[516px]">
        <div className="origin-top scale-[0.72] sm:scale-100">
          <Phone s={s} />
        </div>
      </div>

      {/* Sağ: platform özeti */}
      <div className={`absolute top-28 right-0 hidden w-[250px] transition-all duration-500 lg:block ${platformPhase ? "opacity-100" : "translate-y-3 opacity-0"}`}>
        <div className="rounded-3xl bg-white p-5 text-ink shadow-2xl shadow-black/20">
          <p className="text-xs text-muted">Ayda 600 platform siparişinde</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-[#e5484d]">−87.000 ₺</p>
          <p className="mt-2 text-sm">komisyon ve reklam olarak platforma gider.</p>
          <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-bg">
            <div className="h-full w-[71%] bg-ink" />
            <div className="h-full w-[29%] bg-[#e5484d]" />
          </div>
          <p className="mt-1.5 flex justify-between text-[10px] text-muted"><span>Size kalan</span><span>Platform</span></p>
        </div>
      </div>
    </div>
  );
}
