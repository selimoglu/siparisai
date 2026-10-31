"use client";

import { useInView, useSteps } from "./anim";

/* ───────── Google'da üst sıralarda görünme ───────── */
const QUERY = "yakınımda pide sipariş";
const SEARCH_DUR = [2200, 1200, 1800, 2600, 400] as const;

export function SearchRank({ compact = false }: { compact?: boolean }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const s = useSteps(SEARCH_DUR, inView, 3);
  const ours = s >= 2; // sıralama yükseliyor
  const results = [
    { k: "a", title: "Sipariş platformu · Pide", url: "platform.com", ad: true },
    { k: "b", title: "Mahalle Pidecisi", url: "harita", ad: false },
    { k: "us", title: "Sizin restoranınız · Online sipariş", url: "restoraniniz.com", ad: false },
  ];
  const order = ours ? ["us", "a", "b"] : ["a", "b", "us"];

  return (
    <div ref={ref} className={`rounded-3xl bg-white p-4 shadow-xl shadow-black/5 ring-1 ring-line ${compact ? "w-[290px]" : ""}`}>
      <div className="flex items-center gap-2 rounded-full border border-line px-4 py-2.5">
        <span className="text-sm font-bold">
          <span className="text-[#4285f4]">G</span>
        </span>
        <span className="overflow-hidden text-[13px] whitespace-nowrap">
          <span
            key={s === 0 ? "t" : "d"}
            className="inline-block overflow-hidden align-bottom"
            style={s === 0 ? { clipPath: "inset(0 100% 0 0)", animation: "reveal-text 1.6s steps(22) forwards" } : undefined}
          >
            {QUERY}
          </span>
          {s === 0 && <span className="anim-caret ml-px inline-block h-4 w-px bg-ink align-middle" />}
        </span>
      </div>
      <div className={`relative mt-3 transition-opacity duration-500 ${s === 0 ? "opacity-0" : "opacity-100"}`} style={{ height: 3 * 62 }}>
        {results.map((r) => {
          const pos = order.indexOf(r.k);
          const isUs = r.k === "us";
          return (
            <div
              key={r.k}
              className={`absolute inset-x-0 rounded-2xl px-3 py-2 transition-all duration-700 ease-[cubic-bezier(0.3,0.7,0.2,1)] ${
                isUs && ours ? "bg-accent/10 ring-1 ring-accent/40" : ""
              }`}
              style={{ top: pos * 62 }}
            >
              <p className="text-[10px] text-muted">{r.ad ? "Sponsorlu · " : ""}{r.url}</p>
              <p className={`text-[13px] font-semibold ${isUs ? "text-brand" : "text-[#1a0dab]"}`}>{r.title}</p>
              {isUs && (
                <p className="text-[10px] text-muted">
                  ★ 4,8 · Açık · <span className={`font-semibold ${s >= 3 ? "text-accent" : ""}`}>Sipariş ver</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
      {!compact && (
        <p className={`mt-2 text-center text-xs font-semibold text-brand transition-opacity ${s >= 3 ? "opacity-100" : "opacity-0"}`}>
          Google&apos;da 1. sıra · menün, saatlerin ve yorumların hazır
        </p>
      )}
    </div>
  );
}

/* ───────── Yeni sipariş bildirimi ───────── */
const TOAST_DUR = [2600, 2600, 2600] as const;
const TOASTS = [
  ["#1043", "412 ₺", "Paket · 2 ürün"],
  ["#1044", "268 ₺", "Gel-al · 1 ürün"],
  ["#1045", "596 ₺", "Paket · 4 ürün"],
];
export function OrderToast() {
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  const s = useSteps(TOAST_DUR, inView, 0);
  const [no, total, meta] = TOASTS[s];
  return (
    <div ref={ref} className="w-[230px]">
      <div key={s} className="anim-slide-in rounded-2xl bg-white/90 p-3.5 shadow-xl shadow-black/10 ring-1 ring-line backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <p className="text-xs text-muted">Yeni sipariş · şimdi</p>
        </div>
        <p className="mt-1 font-display text-lg font-bold">{no} · {total}</p>
        <p className="text-xs text-muted">{meta}</p>
        <p className="mt-1.5 text-xs font-semibold text-accent">Komisyon: 0 ₺</p>
      </div>
    </div>
  );
}

/* ───────── Canlı sipariş paneli ───────── */
const LIVE_DUR = [2200, 2200, 2200, 2200] as const;
const ORDERS = [
  { no: 1046, name: "Ayşe Y.", total: 408, src: "QR kart" },
  { no: 1047, name: "Can D.", total: 265, src: "Google" },
  { no: 1048, name: "Zeynep A.", total: 530, src: "Site" },
  { no: 1049, name: "Mert K.", total: 192, src: "SMS kampanyası" },
];
const STATUS = ["Yeni", "Hazırlanıyor", "Yolda", "Teslim edildi"];
const STATUS_CLS = ["bg-accent text-white", "bg-[#fff3d6] text-[#8a5a00]", "bg-[#e3f0ff] text-[#1d4f91]", "bg-bg text-muted"];

export function LiveOrders() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const s = useSteps(LIVE_DUR, inView, 3);
  const visible = ORDERS.slice(0, s + 1).reverse();
  const saved = ORDERS.slice(0, s + 1).reduce((a, o) => a + o.total, 0) * 0.2;
  return (
    <div ref={ref} className="flex h-[300px] flex-col overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/5 ring-1 ring-line">
      <div className="flex items-center gap-1.5 border-b border-line bg-bg px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 rounded-md bg-white px-3 py-0.5 text-[11px] text-muted">panel · Siparişler</span>
      </div>
      <div className="grid min-h-0 flex-1 gap-3 overflow-hidden p-4 sm:grid-cols-[1fr_160px]">
        <div className="space-y-2 overflow-hidden">
          {visible.map((o, i) => (
            <div
              key={o.no}
              className={`flex items-center justify-between rounded-2xl border border-line px-3 py-2.5 text-sm ${i === 0 ? "anim-slide-in" : ""}`}
            >
              <div>
                <p className="font-semibold">#{o.no} · {o.name}</p>
                <p className="text-xs text-muted">{o.src} · {o.total} ₺</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_CLS[Math.min(i, 3)]}`}>
                {STATUS[Math.min(i, 3)]}
              </span>
            </div>
          ))}
        </div>
        <div className="hidden space-y-3 sm:block">
          <div className="rounded-2xl bg-brand p-3 text-white">
            <p className="text-[11px] text-white/70">Bu hafta cebinde kalan komisyon</p>
            <p key={s} className="anim-pop mt-1 font-display text-2xl font-bold">{Math.round(saved).toLocaleString("tr-TR")} ₺</p>
          </div>
          <div className="rounded-2xl border border-line p-3">
            <p className="text-[11px] font-semibold text-brand">Yapay zeka önerisi</p>
            <p className="mt-1 text-xs text-muted">Salı akşamları sakin. 30 gündür gelmeyen 34 müşteriye %15 indirim gönderelim mi?</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── Yapay zeka SMS kampanyası ───────── */
const SMS = "Ayşe Hanım, sizi özledik! Bu hafta sitemizden siparişinize %15 indirim. Kod: GERIDON";
const SMS_DUR = [1600, 2600, 1300, 1600, 2600, 400] as const;
export function AiSms() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const s = useSteps(SMS_DUR, inView, 4);
  return (
    <div ref={ref} className="rounded-3xl bg-gradient-to-br from-[#16ad38] via-[#0f8f28] to-[#094413] p-5 text-white sm:p-7">
      <div className="flex items-center gap-2 text-sm text-accent-soft">
        <span className={`h-2 w-2 rounded-full bg-accent-soft ${s === 0 ? "animate-ping" : ""}`} />
        {s === 0 ? "Yapay zeka müşteri listeni inceliyor…" : "Yapay zeka buldu"}
      </div>
      <p className={`mt-1 font-display text-2xl font-bold transition-opacity duration-500 ${s === 0 ? "opacity-0" : "opacity-100"}`}>
        34 müşteri 30 gündür gelmedi
      </p>
      <div className="mt-4 rounded-2xl bg-white p-4 text-ink">
        <p className="text-xs text-muted">Hazır mesaj</p>
        <p className="mt-1 min-h-[60px] text-sm">
          {s >= 1 && (
            <span
              key={s >= 1 ? "on" : "off"}
              className="block"
              style={s === 1 ? { clipPath: "inset(0 100% 0 0)", animation: "reveal-text 2.2s steps(40) forwards" } : undefined}
            >
              {SMS}
            </span>
          )}
          {s === 1 && <span className="anim-caret ml-0.5 inline-block h-4 w-px bg-ink align-middle" />}
        </p>
        <div className="mt-3 flex items-center gap-3">
          <span className={`btn rounded-full px-4 py-2 text-xs text-white transition ${s === 2 ? "scale-95 bg-ink" : "bg-brand"}`}>
            {s >= 3 ? "Gönderildi ✓" : "34 kişiye gönder"}
          </span>
          {s >= 3 && (
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-bg">
              <div className="h-full rounded-full bg-accent transition-all duration-[1400ms]" style={{ width: s >= 3 ? "100%" : "0%" }} />
            </div>
          )}
        </div>
      </div>
      <div className={`mt-4 grid grid-cols-2 gap-3 transition-all duration-500 ${s >= 4 ? "opacity-100" : "translate-y-2 opacity-0"}`}>
        <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
          <p className="text-[11px] text-white/70">Geri dönen müşteri</p>
          <p className="font-display text-xl font-bold">9 kişi</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
          <p className="text-[11px] text-white/70">Kampanyadan ciro</p>
          <p className="font-display text-xl font-bold">3.870 ₺</p>
        </div>
      </div>
    </div>
  );
}

/* ───────── Menü fotoğrafından site ───────── */
const MENU = [
  ["Lahmacun", "120"],
  ["Kıymalı pide", "250"],
  ["Kaşarlı pide", "230"],
  ["Adana dürüm", "210"],
  ["Künefe", "180"],
  ["Ayran", "35"],
];
const SCAN_DUR = [900, 700, 700, 700, 700, 700, 700, 2200, 400] as const;
export function MenuScan() {
  const [ref, inView] = useInView<HTMLDivElement>(0.3);
  const s = useSteps(SCAN_DUR, inView, 7);
  const found = Math.max(0, Math.min(MENU.length, s));
  return (
    <div ref={ref} className="grid h-[300px] grid-cols-2 gap-3 overflow-hidden rounded-3xl bg-ink p-4 text-white sm:p-5">
      <div className="relative overflow-hidden rounded-2xl bg-[#f4ecdf] p-3 text-[#3b2a1a]">
        <p className="text-center font-display text-sm font-bold">MENÜ</p>
        <div className="mt-2 space-y-1.5 text-[11px] italic">
          {MENU.map(([n, p]) => (
            <p key={n} className="flex justify-between border-b border-dotted border-[#3b2a1a]/30">
              <span>{n}</span>
              <span>{p}</span>
            </p>
          ))}
        </div>
        {s < 7 && <div className="anim-scan absolute inset-x-0 h-0.5 bg-accent shadow-[0_0_16px_4px_rgba(22,173,56,0.6)]" />}
      </div>
      <div className="overflow-hidden rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
        <p className="text-[11px] text-accent-soft">{s >= 7 ? "Menün hazır ✓" : "Yapay zeka okuyor…"}</p>
        <div className="mt-2 space-y-1.5">
          {MENU.slice(0, found).map(([n, p]) => (
            <div key={n} className="anim-slide-in flex items-center justify-between rounded-lg bg-white/10 px-2 py-1 text-[11px]">
              <span>{n}</span>
              <span className="font-semibold">{p} ₺</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────── Komisyon karşılaştırması ───────── */
const SPLIT_DUR = [900, 2600, 3200] as const;
export function CommissionSplit() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const s = useSteps(SPLIT_DUR, inView, 2);
  const cut = s >= 1;
  return (
    <div ref={ref} className="grid gap-4 sm:grid-cols-2">
      {[
        { t: "Platformdan gelen sipariş", fee: 100, cls: "bg-[#e5484d]", dark: false },
        { t: "Kendi sitenden gelen sipariş", fee: 0, cls: "bg-accent", dark: true },
      ].map((r) => (
        <div key={r.t} className={`rounded-3xl p-6 ${r.dark ? "bg-brand text-white" : "bg-white ring-1 ring-line"}`}>
          <p className={`text-sm ${r.dark ? "text-accent-soft" : "text-muted"}`}>{r.t}</p>
          <p className="mt-1 font-display text-3xl font-bold">500 ₺</p>
          <div className={`mt-4 flex h-3 overflow-hidden rounded-full ${r.dark ? "bg-white/15" : "bg-bg"}`}>
            <div className={`h-full ${r.dark ? "bg-accent" : "bg-ink"} transition-all duration-1000`} style={{ width: cut ? `${100 - r.fee / 5}%` : "100%" }} />
            <div className={`h-full ${r.cls} transition-all duration-1000`} style={{ width: cut ? `${r.fee / 5}%` : "0%" }} />
          </div>
          <div className="mt-4 space-y-1.5 text-sm">
            <p className="flex justify-between">
              <span className={r.dark ? "text-white/70" : "text-muted"}>Komisyon</span>
              <span className="font-semibold">{cut ? `−${r.fee} ₺` : "…"}</span>
            </p>
            <p className="flex justify-between text-base font-bold">
              <span>Sana kalan</span>
              <span>{cut ? `${500 - r.fee} ₺` : "…"}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ───────── Kayan özellik bandı ───────── */
const BAND = ["0 komisyon", "Google'da üst sıralar", "Yapay zekalı SMS", "Fotoğraftan menü", "QR paket kartı", "Canlı sipariş paneli", "Müşteri listesi senin", "10 dakikada kurulum"];
export function FeatureBand() {
  const list = [...BAND, ...BAND];
  return (
    <div className="overflow-hidden border-y border-line bg-white py-4">
      <div className="anim-marquee flex w-max gap-10 pr-10">
        {list.map((b, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-semibold whitespace-nowrap text-ink/80">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
