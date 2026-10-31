"use client";

import FoodArt from "./FoodArt";
import { useInView, useSteps } from "./anim";

/*
 * Ana sayfa ilk bölüm görseli (Owner düzeni): yeşil panelin üstüne taşan telefon.
 * Telefonda önce web sitesi sağlık puanı, sonra "Google'da sizi kim geçiyor?", sonra platformda kaybedilen para.
 */
const DUR = [3200, 2400, 1400, 3600, 700] as const;
const OFFSET = [0, 388, 388, 700, 0];

const SCORES = [
  { t: "Arama sonuçları", l: "Zayıf", v: 12, max: 40 },
  { t: "Misafir deneyimi", l: "Orta", v: 18, max: 40 },
  { t: "Yerel listelemeler", l: "Zayıf", v: 6, max: 20 },
];

/** Owner'daki turuncu yarım halka puan göstergesi */
function Gauge({ on }: { on: boolean }) {
  const r = 62;
  const arc = 2 * Math.PI * r * 0.75;
  return (
    <div className="relative mx-auto h-[150px] w-[150px]">
      <svg viewBox="0 0 150 150" className="h-full w-full rotate-[135deg]" aria-hidden>
        <circle cx="75" cy="75" r={r} fill="none" stroke="#ebe7e2" strokeWidth="11" strokeLinecap="round" strokeDasharray={`${arc} 999`} />
        <circle
          cx="75" cy="75" r={r} fill="none" stroke="url(#g36)" strokeWidth="11" strokeLinecap="round"
          strokeDasharray={`${on ? arc * 0.36 : 0} 999`}
          className="transition-[stroke-dasharray] duration-[1400ms] ease-out"
        />
        <defs>
          <linearGradient id="g36" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f0a35b" />
            <stop offset="1" stopColor="#e2652a" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <p className="text-[44px] leading-none font-bold tracking-tight">36</p>
          <p className="text-[11px] text-muted">/ 100</p>
        </div>
      </div>
    </div>
  );
}

function Ring({ pct }: { pct: number }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden className="shrink-0">
      <circle cx="11" cy="11" r="8" fill="none" stroke="#ebe7e2" strokeWidth="3" />
      <circle cx="11" cy="11" r="8" fill="none" stroke="#e2652a" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${50.3 * pct} 99`} transform="rotate(-90 11 11)" />
    </svg>
  );
}

const RIVALS = [
  { rank: "1.", n: "Rakip 1", r: "4,8" },
  { rank: "2.", n: "Rakip 2", r: "4,0" },
  { rank: "3.", n: "Rakip 3", r: "3,1" },
];

const ISSUES = [
  ["Her siparişte %22 komisyon", "Platform ücretleri kârınızı eritiyor"],
  ["Müşteri bilgisi sizde değil", "Tekrar sipariş platforma gidiyor"],
  ["Öne çıkmak için reklam ödüyorsunuz", "Listede 7. sıradasınız"],
];

function Warn() {
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white shadow-sm">
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
        <path d="M7 1 13 12H1Z" fill="#e5484d" />
        <path d="M7 5v3.2M7 9.8v.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function Star() {
  return <span className="text-[#f5b400]">★</span>;
}

export default function HeroProblem() {
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  const s = useSteps(DUR, inView, 0);
  

  return (
    <div ref={ref} className="relative mx-auto max-w-[1280px] pb-8 sm:pb-14" aria-label="Restoranın Google'da rakiplerin altında kalmasını ve platformlarda para kaybetmesini gösteren animasyon">
      {/* Yeşil panel */}
      <div className="absolute inset-x-0 top-16 bottom-0 overflow-hidden rounded-[28px] bg-gradient-to-r from-[#0b8a25] via-[#16ad38] to-[#c4f5cc] sm:top-20 sm:rounded-[36px]">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1400 600" preserveAspectRatio="none" aria-hidden>
          {Array.from({ length: 14 }, (_, i) => (
            <path key={i} d={`M${-200 + i * 120} 620 Q ${300 + i * 60} 300 ${700 + i * 90} -20`} fill="none" stroke="white" strokeOpacity="0.14" strokeWidth="1.2" />
          ))}
        </svg>
      </div>

      {/* Telefon (mobilde küçültülür) */}
      <div className="relative flex justify-center">
        <div className="h-[462px] w-[268px] sm:h-[640px] sm:w-auto">
          <div className="origin-top-left scale-[0.72] sm:scale-100">
            <div className="w-[372px] rounded-[52px] bg-[#1b1b1b] p-[10px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]">
              <div className="relative h-[620px] overflow-hidden rounded-[42px] bg-[#f5f5f2] text-ink">
                <div className="absolute inset-x-0 top-0 z-10 flex h-12 items-center justify-between bg-[#f5f5f2] px-8 text-[15px] font-semibold">
                  <span>9:41</span>
                  <span className="h-7 w-[104px] rounded-full bg-[#1b1b1b]" />
                  <span className="flex gap-1">
                    <span className="h-2.5 w-4 rounded-sm bg-ink" />
                  </span>
                </div>

                <div
                  className="absolute inset-x-0 top-12 space-y-3 px-3 pt-2 transition-transform duration-[900ms] ease-[cubic-bezier(0.3,0.7,0.2,1)]"
                  style={{ transform: `translateY(-${OFFSET[s]}px)` }}
                >
                  {/* Web sitesi sağlığı */}
                  <div className="rounded-3xl bg-gradient-to-b from-white to-[#fbf1e8] p-4">
                    <div className="flex items-center gap-2.5">
                      <FoodArt kind="pide" className="h-9 w-9 overflow-hidden rounded-full" />
                      <p className="text-[17px] font-bold tracking-tight">Sizin restoranınız</p>
                    </div>
                    <div className="mt-2">
                      <Gauge on={inView} />
                    </div>
                    <p className="-mt-3 text-center text-[12px] text-muted">Web sitesi sağlığı</p>
                    <p className="text-center text-[17px] font-bold text-[#e2652a]">Zayıf</p>
                    <div className="mt-2 space-y-1.5">
                      {SCORES.map((x) => (
                        <div key={x.t} className="flex items-center gap-2.5">
                          <Ring pct={inView ? x.v / x.max : 0} />
                          <div className="flex-1">
                            <p className="text-[12px] leading-tight font-semibold">{x.t}</p>
                            <p className={`text-[11px] ${x.l === "Orta" ? "text-[#d98a1c]" : "text-[#e2652a]"}`}>{x.l}</p>
                          </div>
                          <span className="text-[11px] text-muted">{x.v}/{x.max}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Google sıralaması */}
                  <div className="rounded-3xl bg-white p-4">
                    <p className="text-[17px] font-bold tracking-tight">Google&apos;da sizi kim geçiyor?</p>
                    <div className="mt-3 space-y-1">
                      {RIVALS.map((r, i) => (
                        <div
                          key={r.n}
                          className={`flex items-center gap-3 py-1.5 ${s >= 1 ? "anim-slide-in" : ""}`}
                          style={{ animationDelay: `${i * 150}ms` }}
                        >
                          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#f2f2ef] text-[13px] text-muted">{r.rank}</span>
                          <div className="flex-1">
                            <p className="text-[15px] font-medium">{r.n}</p>
                            <p className="text-[13px] text-muted">{r.r} <Star /></p>
                          </div>
                          <span className="text-[11px] font-semibold text-accent">Online sipariş ✓</span>
                        </div>
                      ))}
                      <p className="pl-[18px] text-muted">⋮</p>
                      <div className={`flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors duration-500 ${s >= 2 && s <= 3 ? "bg-[#fff0f0]" : "bg-[#f2f2ef]"}`}>
                        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[13px] text-muted">10.</span>
                        <div className="flex-1">
                          <p className="text-[15px] font-medium">Sizin restoranınız</p>
                          <p className="text-[13px] text-muted">4,9 <Star /></p>
                        </div>
                        <span className="text-[11px] font-semibold text-[#e5484d]">Sipariş sitesi yok</span>
                      </div>
                    </div>
                  </div>

                  {/* Platform kaybı */}
                  <div className="rounded-3xl bg-white p-4">
                    <p className="text-[17px] leading-snug font-bold tracking-tight">
                      Bu sorunları çözene kadar platformlara her ay <span className="text-[#e5484d]">87.000 ₺</span> kaptırıyorsunuz:
                    </p>
                    <div className="mt-3 space-y-2">
                      {ISSUES.map(([t, d]) => (
                        <div key={t} className="flex gap-3 rounded-2xl bg-[#f5f5f2] p-3">
                          <Warn />
                          <div>
                            <p className="text-[14px] font-medium">{t}</p>
                            <p className="text-[12px] text-muted">{d}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-[10px] text-muted">Ayda 600 sipariş, 500 ₺ ortalama sepet ile örnek hesap.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
