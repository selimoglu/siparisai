"use client";

import { useRef } from "react";
import FoodArt from "./FoodArt";
import { useInView, useSteps } from "./anim";

/* ───────── 2. bölüm: dört fayda ───────── */

function RankViz({ on }: { on: boolean }) {
  // Senin sıran 4'ten 1'e çıkar
  const rows = on ? ["Sizin restoranınız", "Rakip 1", "Rakip 2", "Rakip 3"] : ["Rakip 1", "Rakip 2", "Rakip 3", "Sizin restoranınız"];
  return (
    <div className="relative h-[168px]">
      {["Sizin restoranınız", "Rakip 1", "Rakip 2", "Rakip 3"].map((n) => {
        const pos = rows.indexOf(n);
        const us = n === "Sizin restoranınız";
        return (
          <div
            key={n}
            className={`absolute inset-x-0 flex h-9 items-center gap-2 rounded-xl px-3 text-sm transition-all duration-1000 ease-[cubic-bezier(0.3,0.7,0.2,1)] ${
              us ? "bg-accent font-semibold text-white" : "bg-white/70 text-ink/60"
            }`}
            style={{ top: pos * 42 }}
          >
            <span className="w-4 text-xs">{pos + 1}</span>
            {n}
          </div>
        );
      })}
    </div>
  );
}

function BarsViz({ on }: { on: boolean }) {
  const h = [22, 30, 28, 42, 50, 61, 74, 90];
  return (
    <div className="flex h-[168px] items-end gap-2">
      {h.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-lg bg-gradient-to-t from-[#0f8f28] to-[#16ad38] transition-all duration-700"
          style={{ height: on ? `${v}%` : "6%", transitionDelay: `${i * 70}ms` }}
        />
      ))}
    </div>
  );
}

function RepeatViz({ on }: { on: boolean }) {
  const s = useSteps([1400, 1400, 1400, 1400] as const, on, 3);
  const msgs = ["Sizi özledik! Bu hafta %15 indirim", "Doğum gününüze özel tatlı bizden", "Yeni menümüz yayında"];
  return (
    <div className="flex h-[168px] flex-col justify-center gap-2">
      {msgs.slice(0, Math.min(s + 1, 3)).map((m, i) => (
        <div key={m} className={`max-w-[85%] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-sm shadow-sm ${i === s ? "anim-slide-in" : ""}`}>
          {m}
        </div>
      ))}
      <p className={`self-end rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white transition-opacity ${s >= 3 ? "opacity-100" : "opacity-0"}`}>
        ↺ Tekrar sipariş geldi
      </p>
    </div>
  );
}

function ProfitViz({ on }: { on: boolean }) {
  return (
    <div className="flex h-[168px] flex-col justify-center">
      <p className="text-7xl font-medium tracking-tighter text-white">%0</p>
      <p className="text-sm text-white/70">sipariş başına komisyon</p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/15">
        <div className="h-full rounded-full bg-accent-soft transition-all duration-[1400ms]" style={{ width: on ? "100%" : "0%" }} />
      </div>
      <p className="mt-1.5 text-xs text-white/70">Kazancın tamamı sizde</p>
    </div>
  );
}

const BENEFITS = [
  { tag: "Daha fazla Google trafiği", t: "Arayan müşteri sizi bulsun", d: "Siteniz Google'ın anlayacağı şekilde kurulur. Yakınınızda arayan müşteri rakibe değil size gelir.", Viz: RankViz, cls: "bg-[#eaf7ea]" },
  { tag: "Daha fazla çevrimiçi sipariş", t: "Siteniz satış yapsın", d: "Fotoğraflı menü, yorumlar ve sitenize özel indirimle ziyaretçi siparişe dönüşür.", Viz: BarsViz, cls: "bg-[#f3f3ef]" },
  { tag: "Daha fazla tekrarlayan sipariş", t: "Müdavimleriniz geri gelsin", d: "Yapay zeka gelmeyen müşteriyi bulur, ona doğru zamanda doğru mesajı gönderir.", Viz: RepeatViz, cls: "bg-[#f3f3ef]" },
  { tag: "Daha fazla kâr", t: "Komisyon cebinizde kalsın", d: "Kendi sitenizden gelen siparişte platform payı yok. Kazancın tamamı sizin.", Viz: ProfitViz, cls: "bg-brand text-white" },
];

export function BenefitGrid() {
  const [ref, on] = useInView<HTMLDivElement>(0.25);
  return (
    <div
      ref={ref}
      className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden"
    >
      {BENEFITS.map(({ tag, t, d, Viz, cls }) => (
        <div key={tag} className={`flex w-[84%] shrink-0 snap-center flex-col rounded-[28px] p-6 sm:p-8 md:w-auto ${cls}`}>
          <span className={`self-start rounded-full px-3 py-1 text-xs font-bold ${cls.includes("brand") ? "bg-white/15 text-accent-soft" : "bg-white text-brand"}`}>
            {tag}
          </span>
          <div className="my-6">
            <Viz on={on} />
          </div>
          <h3 className="text-[22px] font-bold tracking-tight">{t}</h3>
          <p className={`mt-2 ${cls.includes("brand") ? "text-white/75" : "text-muted"}`}>{d}</p>
        </div>
      ))}
    </div>
  );
}

/* ───────── 3. bölüm: kayan örnek hesap kartları ───────── */

type Scenario = { kind: "pide" | "burger" | "kunefe" | "doner" | "lahmacun" | "ayran"; type: string; orders: number; share: number; basket: number };
const SCENARIOS: Scenario[] = [
  { kind: "pide", type: "Pide salonu", orders: 600, share: 30, basket: 350 },
  { kind: "burger", type: "Burgerci", orders: 900, share: 25, basket: 420 },
  { kind: "doner", type: "Kebapçı", orders: 750, share: 30, basket: 480 },
  { kind: "kunefe", type: "Tatlıcı", orders: 300, share: 40, basket: 300 },
  { kind: "lahmacun", type: "Lahmacuncu", orders: 800, share: 25, basket: 260 },
  { kind: "ayran", type: "Kafe", orders: 400, share: 35, basket: 220 },
  { kind: "doner", type: "Dönerci", orders: 1000, share: 20, basket: 260 },
  { kind: "burger", type: "Pizzacı", orders: 800, share: 25, basket: 450 },
];
const yearly = (x: Scenario) => Math.round(x.orders * (x.share / 100) * x.basket * 0.2 * 12);
const tl = (n: number) => new Intl.NumberFormat("tr-TR").format(n) + " ₺";

function ProofCard({ x }: { x: Scenario }) {
  return (
    <div className="w-[260px] shrink-0 overflow-hidden rounded-[24px] bg-white ring-1 ring-line sm:w-[300px]">
      <FoodArt kind={x.kind} className="h-28 w-full" />
      <div className="p-5">
        <p className="text-3xl font-bold tracking-tight text-brand">+{tl(yearly(x))}</p>
        <p className="text-sm font-semibold">yıllık ek kâr</p>
        <p className="mt-3 text-sm text-muted">
          {x.type} · ayda {x.orders} platform siparişinin %{x.share}&apos;i kendi sitesine geçerse
        </p>
      </div>
    </div>
  );
}

export function ProofMarquee() {
  const a = [...SCENARIOS.slice(0, 4), ...SCENARIOS.slice(0, 4)];
  const b = [...SCENARIOS.slice(4), ...SCENARIOS.slice(4)];
  return (
    <div className="space-y-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="anim-marquee flex w-max gap-4 pr-4">
        {a.map((x, i) => <ProofCard key={i} x={x} />)}
      </div>
      <div className="anim-marquee flex w-max gap-4 pr-4 [animation-direction:reverse]">
        {b.map((x, i) => <ProofCard key={i} x={x} />)}
      </div>
    </div>
  );
}

/* ───────── 4. bölüm: yayına alma kontrol listesi ───────── */
const LAUNCH = [
  ["Siteniz yayında", "restoraniniz.com"],
  ["Google'da görünür", "Menü, saat ve adres hazır"],
  ["QR kodunuz hazır", "Masa ve paket kartları"],
  ["Sipariş paneliniz hazır", "Telefon ve tablette"],
];
const LAUNCH_DUR = [700, 700, 700, 700, 2600] as const;
export function LaunchChecklist() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const s = useSteps(LAUNCH_DUR, inView, 4);
  return (
    <div ref={ref} className="rounded-3xl bg-white p-5 text-ink shadow-xl shadow-black/5 ring-1 ring-line sm:p-6">
      <div className="flex items-center justify-between">
        <p className="font-bold">Yayına alma</p>
        <span className={`rounded-full px-3 py-1 text-xs font-bold transition ${s >= 4 ? "bg-accent text-white" : "bg-bg text-muted"}`}>
          {s >= 4 ? "Yayında ✓" : "Hazırlanıyor…"}
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {LAUNCH.map(([t, d], i) => {
          const done = s > i || s >= 4;
          return (
            <div key={t} className="flex items-center gap-3">
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm transition-all duration-300 ${done ? "anim-pop bg-accent text-white" : "bg-bg text-muted"}`}>
                {done ? "✓" : i + 1}
              </span>
              <div>
                <p className={`font-semibold transition-colors ${done ? "text-ink" : "text-muted"}`}>{t}</p>
                <p className="text-xs text-muted">{d}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── 5. bölüm: inandıklarımız, yana kaydırmalı kartlar (Popmenu tarzı) ───────── */
export function BeliefCarousel({ items }: { items: { t: string; d: string }[] }) {
  const track = useRef<HTMLDivElement>(null);
  const go = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="mx-auto max-w-6xl">
      <div
        ref={track}
        className="flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((b, i) => (
          <div key={b.t} className="w-[80%] shrink-0 snap-start rounded-2xl border border-line bg-white p-6 sm:w-[calc((100%-2rem)/3)] sm:min-w-[300px]">
            <p className="text-[32px] leading-none font-bold text-accent">{i + 1}</p>
            <h3 className="mt-4 text-[17px] leading-snug font-bold tracking-tight">{b.t}</h3>
            <p className="mt-2 text-[14px] leading-relaxed text-muted">{b.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex justify-end gap-2 px-4 sm:hidden">
        {[-1, 1].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => go(d)}
            aria-label={d < 0 ? "Önceki" : "Sonraki"}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white text-ink"
          >
            {d < 0 ? "←" : "→"}
          </button>
        ))}
      </div>
    </div>
  );
}
