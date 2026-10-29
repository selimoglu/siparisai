"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { money } from "@/lib/format";
import type { Category, MenuItem, Restaurant } from "@/lib/types";

type Cart = Record<string, number>;
const ERR: Record<string, string> = {
  restaurant_closed: "Restoran şu an sipariş almıyor.",
  invalid_phone: "Telefon numarasını 05xx xxx xx xx şeklinde yazın.",
  invalid_name: "Adınızı yazın.",
  invalid_address: "Teslimat adresini yazın.",
  below_min_order: "Sepet minimum sipariş tutarının altında.",
  item_unavailable: "Sepetteki bir ürün artık satışta değil. Sayfayı yenileyin.",
  empty_cart: "Sepetiniz boş.",
};

export default function OrderSite({ restaurant: r, categories, items, source, campaign }:
  { restaurant: Restaurant; categories: Category[]; items: MenuItem[]; source: string; campaign: string | null }) {
  const [cart, setCart] = useState<Cart>({});
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"delivery" | "pickup">(r.accepts_delivery ? "delivery" : "pickup");
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "", payment: "cash", consent: true });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ order_no: number; total: number; discount: number } | null>(null);

  function openCart() {
    // Daha önce sipariş verdiyse bilgilerini doldur
    if (!form.name) {
      try {
        const saved = JSON.parse(localStorage.getItem("siparisai-customer") ?? "null");
        if (saved) setForm((f) => ({ ...f, name: saved.name ?? "", phone: saved.phone ?? "", address: saved.address ?? "" }));
      } catch {}
    }
    setOpen(true);
  }

  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  const lines = Object.entries(cart).filter(([, q]) => q > 0).map(([id, qty]) => ({ item: byId.get(id)!, qty })).filter((l) => l.item);
  const subtotal = lines.reduce((s, l) => s + Number(l.item.price) * l.qty, 0);
  const discount = Math.round(subtotal * r.direct_discount_pct) / 100;
  const fee = mode === "delivery" ? Number(r.delivery_fee) : 0;
  const total = subtotal - discount + fee;
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const add = (id: string, d: number) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + d) }));

  async function order(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { data, error } = await createClient().rpc("place_order", {
      p_slug: r.slug,
      p_items: lines.map((l) => ({ id: l.item.id, qty: l.qty })),
      p_name: form.name, p_phone: form.phone, p_fulfillment: mode, p_payment: form.payment,
      p_address: form.address, p_note: form.note, p_consent: form.consent,
      p_source: source, p_campaign: campaign,
    });
    setBusy(false);
    if (error) {
      const code = Object.keys(ERR).find((k) => error.message.includes(k));
      return setError(code ? ERR[code] : "Sipariş verilemedi, tekrar deneyin.");
    }
    try {
      localStorage.setItem("siparisai-customer", JSON.stringify({ name: form.name, phone: form.phone, address: form.address }));
    } catch {}
    setDone(data);
    setCart({});
  }

  const style = { "--brand": r.primary_color } as React.CSSProperties;

  if (done) {
    return (
      <main style={style} className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl">✅</div>
        <h1 className="mt-4 font-display text-2xl font-bold">Siparişiniz alındı</h1>
        <p className="mt-2 text-muted">Sipariş no: <b>#{done.order_no}</b> · Toplam {money(done.total)}</p>
        <p className="mt-1 text-sm text-ok">Direkt sipariş verdiğiniz için {money(done.discount)} indirim kazandınız.</p>
        {r.phone && <a href={`tel:${r.phone}`} className="btn-ghost mt-6">Restoranı ara</a>}
        <button className="mt-3 text-sm underline" onClick={() => setDone(null)}>Yeni sipariş</button>
      </main>
    );
  }

  return (
    <div style={style} className="min-h-screen pb-28">
      <header className="bg-brand px-4 pb-8 pt-10 text-brand-ink">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-bold">{r.name}</h1>
          <p className="mt-1 opacity-90">{[r.district, r.hours].filter(Boolean).join(" · ")}</p>
          {r.about && <p className="mt-3 max-w-xl text-sm opacity-90">{r.about}</p>}
          <p className="mt-4 inline-block rounded-full bg-white/20 px-3 py-1 text-sm font-semibold">
            Buradan siparişe %{r.direct_discount_pct} indirim
          </p>
          {!r.is_open && <p className="mt-3 rounded-lg bg-black/30 p-2 text-sm">Şu an sipariş almıyoruz.</p>}
        </div>
      </header>

      <nav className="sticky top-0 z-10 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 py-2">
          {categories.map((c) => (
            <a key={c.id} href={`#k-${c.id}`} className="whitespace-nowrap rounded-full border border-line px-3 py-1 text-sm">{c.name}</a>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-3xl space-y-8 px-4 py-6">
        {categories.map((c) => {
          const list = items.filter((i) => i.category_id === c.id);
          if (!list.length) return null;
          return (
            <section key={c.id} id={`k-${c.id}`} className="scroll-mt-16">
              <h2 className="mb-3 font-display text-xl font-bold">{c.name}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {list.map((i) => (
                  <li key={i.id} className="card flex items-start justify-between gap-3 p-4">
                    <div>
                      <p className="font-semibold">{i.name}</p>
                      {i.description && <p className="mt-1 text-sm text-muted">{i.description}</p>}
                      <p className="mt-2 font-semibold">{money(i.price)}</p>
                    </div>
                    {cart[i.id] ? (
                      <div className="flex items-center gap-2">
                        <button className="h-8 w-8 rounded-full border border-line" onClick={() => add(i.id, -1)} aria-label="Azalt">−</button>
                        <span className="w-4 text-center font-semibold">{cart[i.id]}</span>
                        <button className="h-8 w-8 rounded-full bg-brand text-brand-ink" onClick={() => add(i.id, 1)} aria-label="Artır">+</button>
                      </div>
                    ) : (
                      <button disabled={!r.is_open} className="h-9 w-9 shrink-0 rounded-full bg-brand text-lg text-brand-ink disabled:opacity-40"
                        onClick={() => add(i.id, 1)} aria-label={`${i.name} ekle`}>+</button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </main>

      {count > 0 && !open && (
        <div className="fixed inset-x-0 bottom-0 z-20 p-4">
          <button className="btn-primary mx-auto flex w-full max-w-3xl justify-between py-4 text-base shadow-xl" onClick={openCart}>
            <span>Sepet ({count})</span><span>{money(total)}</span>
          </button>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 sm:items-center" onClick={() => setOpen(false)}>
          <form onSubmit={order} onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-t-3xl bg-surface p-5 sm:rounded-3xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">Sepetim</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-muted">Kapat</button>
            </div>
            <ul className="divide-y divide-line text-sm">
              {lines.map((l) => (
                <li key={l.item.id} className="flex items-center justify-between py-2">
                  <span>{l.qty} × {l.item.name}</span>
                  <span className="flex items-center gap-2">
                    {money(Number(l.item.price) * l.qty)}
                    <button type="button" className="text-muted" onClick={() => add(l.item.id, -1)}>−</button>
                  </span>
                </li>
              ))}
            </ul>
            {r.accepts_delivery && r.accepts_pickup && (
              <div className="grid grid-cols-2 gap-2">
                {(["delivery", "pickup"] as const).map((m) => (
                  <button key={m} type="button" onClick={() => setMode(m)}
                    className={`rounded-xl border p-2 text-sm font-semibold ${mode === m ? "border-brand bg-orange-50" : "border-line"}`}>
                    {m === "delivery" ? "Paket servis" : "Gel-al"}
                  </button>
                ))}
              </div>
            )}
            <input className="input" required placeholder="Adınız" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="input" required type="tel" inputMode="tel" placeholder="Telefon (05xx xxx xx xx)" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            {mode === "delivery" && (
              <textarea className="input" required placeholder="Açık adres" value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })} />
            )}
            <input className="input" placeholder="Not (isteğe bağlı)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            <select className="input" value={form.payment} onChange={(e) => setForm({ ...form, payment: e.target.value })}>
              <option value="cash">Kapıda nakit</option>
              <option value="card_on_delivery">Kapıda kredi kartı</option>
            </select>
            <label className="flex items-start gap-2 text-xs text-muted">
              <input type="checkbox" className="mt-0.5" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
              {r.name} bana kampanya ve indirimleri SMS ile gönderebilir. (İstediğim zaman ret edebilirim.)
            </label>
            <div className="space-y-1 border-t border-line pt-3 text-sm">
              <Row k="Ara toplam" v={money(subtotal)} />
              <Row k={`Direkt sipariş indirimi (%${r.direct_discount_pct})`} v={`−${money(discount)}`} green />
              {fee > 0 && <Row k="Paket ücreti" v={money(fee)} />}
              <Row k="Toplam" v={money(total)} bold />
              {subtotal < Number(r.min_order) && <p className="text-xs text-warn">Minimum sipariş {money(r.min_order)}</p>}
            </div>
            {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button className="btn-primary w-full py-3 text-base" disabled={busy || !r.is_open || subtotal < Number(r.min_order)}>
              {busy ? "Gönderiliyor…" : `Siparişi ver · ${money(total)}`}
            </button>
            <p className="text-center text-[11px] text-muted">Kişisel verileriniz yalnızca siparişiniz ve izin verdiyseniz kampanyalar için kullanılır.</p>
          </form>
        </div>
      )}
    </div>
  );
}

function Row({ k, v, bold, green }: { k: string; v: string; bold?: boolean; green?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-bold" : ""} ${green ? "text-ok" : ""}`}>
      <span>{k}</span><span>{v}</span>
    </div>
  );
}
