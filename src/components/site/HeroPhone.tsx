"use client";

import FoodArt from "./FoodArt";
import { useInView, useSteps } from "./anim";

/*
 * Ana sayfadaki hareketli telefon: bir restoranın sipariş sitesinde gezinen müşteri.
 * Adımlar: üstte kapak → en çok sevilenler → kategori seç → 2 ürün ekle → yorumlar → sepet → sipariş alındı.
 */
const DUR = [1700, 1500, 1300, 1100, 1100, 1700, 1500, 1300, 1900, 500] as const;
const SCROLL = [0, 230, 430, 430, 430, 700, 700, 700, 700, 0];
const TAP: Record<number, [number, number]> = { 2: [123, 58], 3: [262, 154], 4: [262, 238], 6: [150, 582], 7: [150, 580] };
const CHIPS = ["Popüler", "Pideler", "Yorumlar", "Tatlılar"];

const ITEMS = [
  { kind: "pide", name: "Kıymalı pide", desc: "Odun fırınında, tereyağlı", price: 250 },
  { kind: "kunefe", name: "Kaşarlı pide", desc: "Bol kaşar, ince hamur", price: 230 },
  { kind: "lahmacun", name: "Lahmacun", desc: "Yeşillik ve limonla", price: 120 },
] as const;
const POPULAR = [
  { kind: "doner", name: "Dürüm", price: "210 ₺" },
  { kind: "pide", name: "Kıymalı pide", price: "250 ₺" },
  { kind: "burger", name: "Burger", price: "290 ₺" },
  { kind: "ayran", name: "Ayran", price: "35 ₺" },
] as const;
const REVIEWS = [
  ["Elif K.", "Hamuru incecik, sıcacık geldi. Sitenizden sipariş daha ucuz!"],
  ["Murat T.", "20 dakikada kapımdaydı. Lahmacun efsane."],
];

const tl = (n: number) => `${n} ₺`;

export default function HeroPhone() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const s = useSteps(DUR, inView, 0);
  const y = SCROLL[s];
  const chip = s < 2 ? 0 : s < 5 ? 1 : 2;
  const cart = s >= 4 && s < 9 ? 2 : s === 3 ? 1 : 0;
  const total = cart === 2 ? 480 : cart === 1 ? 250 : 0;
  const sheet = s >= 6 && s <= 8;
  const done = s === 8;
  const tap = TAP[s];

  return (
    <div ref={ref} className="relative mx-auto w-[320px] select-none" aria-label="Müşterinin telefondan sipariş vermesini gösteren animasyon">
      <div className="rounded-[48px] bg-[#151515] p-2.5 shadow-[0_40px_80px_-20px_rgba(9,68,19,0.45)] ring-1 ring-white/10">
        <div className="relative h-[620px] w-[300px] overflow-hidden rounded-[40px] bg-white">
          {/* Durum çubuğu */}
          <div className="absolute inset-x-0 top-0 z-30 flex h-9 items-center justify-between bg-white/90 px-6 text-[11px] font-semibold backdrop-blur">
            <span>12:30</span>
            <span className="h-5 w-20 rounded-full bg-[#151515]" />
            <span>5G</span>
          </div>

          {/* Kaydırılan içerik */}
          <div
            className="absolute inset-x-0 top-9 transition-transform duration-700 ease-[cubic-bezier(0.3,0.7,0.2,1)]"
            style={{ transform: `translateY(-${y}px)` }}
          >
            {/* Kapak */}
            <div className="relative h-[200px]">
              <FoodArt kind="doner" className="h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-lg font-bold text-[#9b3d1f]">R</span>
                <div>
                  <p className="font-display text-lg leading-tight font-bold">Sizin restoranınız</p>
                  <p className="text-[11px] text-white/85">★ 4,8 · 1.240 yorum · 25–35 dk</p>
                </div>
              </div>
            </div>
            {/* Sipariş tipi + indirim */}
            <div className="h-[100px] px-4 pt-3">
              <div className="flex gap-2">
                <span className="rounded-full bg-[#9b3d1f] px-3.5 py-2 text-[11px] font-semibold text-white">Paket sipariş</span>
                <span className="rounded-full border border-line px-3.5 py-2 text-[11px] font-semibold">Gel-al</span>
              </div>
              <div className={`mt-2.5 flex items-center justify-between rounded-xl bg-[#fdf1e7] px-3 py-2.5 transition ${s === 0 ? "ring-2 ring-[#9b3d1f]/40" : ""}`}>
                <span className="text-[11px] font-bold text-[#9b3d1f]">Sitemize özel %15 indirim</span>
                <span className="rounded-md bg-white px-1.5 py-0.5 text-[10px] font-bold text-[#9b3d1f]">HOSGELDIN</span>
              </div>
            </div>
            {/* En çok sevilenler */}
            <div className="h-[170px] overflow-hidden">
              <p className="px-4 text-sm font-bold">En çok sevilenler</p>
              <div
                className="mt-2 flex gap-2.5 px-4 transition-transform duration-1000"
                style={{ transform: `translateX(${s === 1 ? -70 : 0}px)` }}
              >
                {POPULAR.map((p) => (
                  <div key={p.name} className="w-[118px] shrink-0 overflow-hidden rounded-2xl border border-line">
                    <FoodArt kind={p.kind} className="h-[78px] w-full" />
                    <div className="px-2.5 py-2">
                      <p className="text-[11px] font-semibold">{p.name}</p>
                      <p className="text-[10px] text-muted">{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Pideler */}
            <div className="h-[290px]">
              <p className="h-9 px-4 pt-2 text-sm font-bold">Pideler</p>
              {ITEMS.map((it, i) => (
                <div key={it.name} className="flex h-[84px] items-center gap-3 border-b border-line px-4">
                  <FoodArt kind={it.kind} className="h-14 w-14 shrink-0 rounded-xl" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold">{it.name}</p>
                    <p className="truncate text-[10px] text-muted">{it.desc}</p>
                    <p className="text-[11px] font-semibold">{tl(it.price)}</p>
                  </div>
                  <span
                    key={i === 0 && s === 3 ? "a" : i === 1 && s === 4 ? "b" : "x"}
                    className={`grid h-7 w-7 place-items-center rounded-full text-sm text-white ${
                      (i === 0 && s >= 3 && s < 9) || (i === 1 && s >= 4 && s < 9) ? "anim-pop bg-accent" : "bg-[#9b3d1f]"
                    }`}
                  >
                    {(i === 0 && s >= 3 && s < 9) || (i === 1 && s >= 4 && s < 9) ? "✓" : "+"}
                  </span>
                </div>
              ))}
            </div>
            {/* Yorumlar */}
            <div className="h-[200px] px-4">
              <p className="pt-2 text-sm font-bold">Yorumlar <span className="font-normal text-muted">★ 4,8</span></p>
              {REVIEWS.map(([n, t]) => (
                <div key={n} className="mt-2.5 rounded-2xl bg-bg p-3">
                  <p className="text-[11px] text-[#e0a100]">★★★★★</p>
                  <p className="mt-0.5 text-[11px]">{t}</p>
                  <p className="mt-1 text-[10px] text-muted">{n}</p>
                </div>
              ))}
            </div>
            {/* Tatlılar */}
            <div className="h-[200px]">
              <p className="h-9 px-4 pt-2 text-sm font-bold">Tatlılar</p>
              <div className="flex h-[84px] items-center gap-3 px-4">
                <FoodArt kind="kunefe" className="h-14 w-14 rounded-xl" />
                <div>
                  <p className="text-[12px] font-semibold">Künefe</p>
                  <p className="text-[11px] font-semibold">180 ₺</p>
                </div>
              </div>
            </div>
          </div>

          {/* Yapışkan kategori çubuğu */}
          <div
            className={`absolute inset-x-0 top-9 z-20 flex h-11 items-center gap-2 border-b border-line bg-white/95 px-3 backdrop-blur transition-opacity duration-300 ${
              y >= 180 ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {CHIPS.map((c, i) => (
              <span
                key={c}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition ${i === chip ? "bg-ink text-white" : "text-muted"}`}
              >
                {c}
              </span>
            ))}
          </div>

          {/* Sepet çubuğu */}
          <div
            className={`absolute inset-x-3 bottom-3.5 z-20 flex h-12 items-center justify-between rounded-2xl bg-[#9b3d1f] px-4 text-white shadow-lg transition duration-500 ${
              cart > 0 && !sheet ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
            }`}
          >
            <span className="flex items-center gap-2 text-xs font-semibold">
              <span key={cart} className="anim-pop grid h-5 w-5 place-items-center rounded-full bg-white text-[10px] text-[#9b3d1f]">{cart}</span>
              Sepeti gör
            </span>
            <span className="text-xs font-bold">{tl(total)}</span>
          </div>

          {/* Sepet sayfası */}
          <div className={`absolute inset-0 z-30 bg-black/30 transition-opacity duration-300 ${sheet ? "opacity-100" : "pointer-events-none opacity-0"}`} />
          <div
            className={`absolute inset-x-0 bottom-0 z-40 h-[310px] rounded-t-3xl bg-white px-5 pt-4 transition-transform duration-500 ease-[cubic-bezier(0.3,0.7,0.2,1)] ${
              sheet ? "translate-y-0" : "translate-y-full"
            }`}
          >
            {done ? (
              <div className="anim-rise flex h-full flex-col items-center pt-10 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-accent text-3xl text-white">✓</span>
                <p className="mt-4 font-display text-lg font-bold">Siparişiniz alındı</p>
                <p className="mt-1 text-xs text-muted">Tahmini teslim 25–35 dk</p>
                <p className="mt-4 rounded-full bg-accent/10 px-3 py-1.5 text-[11px] font-semibold text-brand">Restorana 0 ₺ komisyon</p>
              </div>
            ) : (
              <>
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
                <p className="font-display text-base font-bold">Sepetin</p>
                <div className="mt-3 space-y-2 text-[12px]">
                  <p className="flex justify-between"><span>1 × Kıymalı pide</span><span>250 ₺</span></p>
                  <p className="flex justify-between"><span>1 × Kaşarlı pide</span><span>230 ₺</span></p>
                  <p className="flex justify-between font-semibold text-accent"><span>Sitemize özel %15 indirim</span><span>−72 ₺</span></p>
                  <p className="flex justify-between border-t border-line pt-2 text-sm font-bold"><span>Toplam</span><span>408 ₺</span></p>
                </div>
                <div className="absolute inset-x-4 bottom-4 flex h-12 items-center justify-center rounded-2xl bg-ink text-sm font-semibold text-white">
                  Siparişi ver · 408 ₺
                </div>
              </>
            )}
          </div>

          {/* Dokunma izi */}
          {tap && (
            <span
              key={s}
              className="anim-tap pointer-events-none absolute z-50 h-12 w-12 rounded-full bg-ink/40"
              style={{ left: tap[0], top: tap[1] }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
