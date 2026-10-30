// Tanıtım sitesindeki telefon ve panel görüntüleri (gerçek ürünün sadeleştirilmiş hali)
import FoodArt from "./FoodArt";

const ITEMS = [
  { kind: "pide", name: "Kıymalı pide", price: "250 ₺" },
  { kind: "lahmacun", name: "Lahmacun", price: "120 ₺" },
  { kind: "kunefe", name: "Künefe", price: "180 ₺" },
  { kind: "ayran", name: "Ayran", price: "35 ₺" },
] as const;

export function PhoneMockup({ className = "" }: { className?: string }) {
  return (
    <div className={`relative mx-auto w-[280px] ${className}`}>
      <div className="rounded-[44px] bg-[#1d1d1d] p-2.5 shadow-2xl shadow-black/30">
        <div className="relative h-[560px] overflow-hidden rounded-[36px] bg-white">
          <div className="absolute top-2 left-1/2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[#1d1d1d]" />
          {/* Kapak */}
          <div className="relative h-40">
            <FoodArt kind="doner" className="h-full w-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-3 left-4 text-white">
              <p className="font-display text-lg leading-tight font-bold">Kervan Pide Salonu</p>
              <p className="text-[11px] text-white/80">Kadıköy · Açık · 25–35 dk</p>
            </div>
          </div>
          <div className="flex gap-2 px-4 pt-3">
            <span className="rounded-full bg-[#9b3d1f] px-3 py-1.5 text-[11px] font-semibold text-white">Paket sipariş</span>
            <span className="rounded-full border border-line px-3 py-1.5 text-[11px] font-semibold">Gel-al</span>
          </div>
          <div className="mx-4 mt-3 rounded-xl bg-[#fdf1e7] px-3 py-2 text-[11px] font-semibold text-[#9b3d1f]">
            Sitemizden siparişe %10 indirim
          </div>
          <p className="px-4 pt-3 text-xs font-bold">En çok sevilenler</p>
          <div className="grid grid-cols-2 gap-2.5 px-4 pt-2">
            {ITEMS.map((i) => (
              <div key={i.name} className="overflow-hidden rounded-xl border border-line">
                <FoodArt kind={i.kind} className="h-16 w-full" />
                <div className="flex items-center justify-between px-2 py-1.5">
                  <div>
                    <p className="text-[11px] leading-tight font-semibold">{i.name}</p>
                    <p className="text-[10px] text-muted">{i.price}</p>
                  </div>
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[#9b3d1f] text-xs text-white">+</span>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute inset-x-3 bottom-4 flex items-center justify-between rounded-2xl bg-[#9b3d1f] px-4 py-3 text-white shadow-lg">
            <span className="text-xs font-semibold">Sepeti gör · 2 ürün</span>
            <span className="text-xs font-bold">333 ₺</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const BARS = [38, 52, 46, 61, 58, 74, 82];
const DAYS = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export function PanelMockup({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-line bg-white shadow-2xl shadow-black/10 ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-line bg-bg px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 rounded-md bg-white px-3 py-0.5 text-[11px] text-muted">siparisai.com/panel</span>
      </div>
      <div className="grid grid-cols-[120px_1fr] text-[11px] sm:grid-cols-[150px_1fr]">
        <aside className="space-y-1 bg-ink p-3 text-white/70">
          <p className="mb-3 font-display text-sm font-bold text-white">
            Sipariş<span className="text-accent">AI</span>
          </p>
          {["Özet", "Siparişler", "Menü", "Müşteriler", "Kampanyalar", "Ayarlar"].map((x, i) => (
            <p key={x} className={`rounded-md px-2 py-1.5 ${i === 0 ? "bg-white/10 font-semibold text-white" : ""}`}>{x}</p>
          ))}
        </aside>
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-bold">Bu hafta</p>
            <span className="rounded-full bg-accent/15 px-2 py-0.5 font-semibold text-brand">Canlı</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ["Doğrudan sipariş", "142"],
              ["Ciro", "48.300 ₺"],
              ["Ödenmeyen komisyon", "9.660 ₺"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-lg border border-line p-2">
                <p className="text-muted">{k}</p>
                <p className="mt-0.5 font-display text-sm font-bold">{v}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-line p-3">
            <p className="mb-2 text-muted">Günlük sipariş</p>
            <div className="flex h-20 items-end gap-2">
              {BARS.map((h, i) => (
                <div key={DAYS[i]} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <div className="w-full rounded-t bg-accent" style={{ height: `${h}%` }} />
                  <span className="text-[9px] text-muted">{DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg bg-brand p-3 text-white">
            <p className="font-semibold">Yapay zeka önerisi</p>
            <p className="mt-0.5 text-white/75">
              34 müşterin 30 gündür sipariş vermedi. &quot;Seni özledik, %15 indirim&quot; mesajı hazır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
