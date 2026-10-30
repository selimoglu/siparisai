"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { money } from "@/lib/format";
import type { Category, MenuItem, Restaurant } from "@/lib/types";

type Cart = Record<string, number>;
type Mode = "delivery" | "pickup";

const ERR: Record<string, string> = {
  restaurant_closed: "Restoran şu an sipariş almıyor.",
  invalid_phone: "Telefon numarasını 05xx xxx xx xx şeklinde yazın.",
  invalid_name: "Adınızı yazın.",
  invalid_address: "Teslimat adresini yazın.",
  below_min_order: "Sepet minimum sipariş tutarının altında.",
  item_unavailable: "Sepetteki bir ürün artık satışta değil. Sayfayı yenileyin.",
  empty_cart: "Sepetiniz boş.",
};

type Props = {
  restaurant: Restaurant;
  categories: Category[];
  items: MenuItem[];
  popularIds: string[];
  source: string;
  campaign: string | null;
};

export default function OrderSite({ restaurant: r, categories, items, popularIds, source, campaign }: Props) {
  const [cart, setCart] = useState<Cart>({});
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<MenuItem | null>(null);
  const [mode, setMode] = useState<Mode>(r.accepts_delivery ? "delivery" : "pickup");
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "", payment: "cash", consent: true });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ order_no: number; total: number; discount: number } | null>(null);

  const byId = useMemo(() => new Map(items.map((i) => [i.id, i])), [items]);
  // En çok satanlar; sipariş geçmişi yoksa fotoğraflı ürünlerden başla.
  const popular = useMemo(() => {
    const fromOrders = popularIds.map((id) => byId.get(id)).filter((i): i is MenuItem => !!i);
    if (fromOrders.length >= 3) return fromOrders.slice(0, 8);
    const rest = [...items].sort((a, b) => Number(!!b.image_url) - Number(!!a.image_url));
    return [...fromOrders, ...rest.filter((i) => !fromOrders.includes(i))].slice(0, 8);
  }, [popularIds, byId, items]);

  const lines = Object.entries(cart).filter(([, q]) => q > 0)
    .map(([id, qty]) => ({ item: byId.get(id)!, qty })).filter((l) => l.item);
  const subtotal = lines.reduce((s, l) => s + Number(l.item.price) * l.qty, 0);
  const discount = Math.round(subtotal * r.direct_discount_pct) / 100;
  const fee = mode === "delivery" ? Number(r.delivery_fee) : 0;
  const total = subtotal - discount + fee;
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const upsell = popular.filter((i) => !cart[i.id]).slice(0, 3);

  const add = (id: string, d: number) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) + d) }));
  const startOrder = (m?: Mode) => {
    if (m) setMode(m);
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  };

  function openCart() {
    if (!form.name) {
      try {
        const saved = JSON.parse(localStorage.getItem("siparisai-customer") ?? "null");
        if (saved) setForm((f) => ({ ...f, name: saved.name ?? "", phone: saved.phone ?? "", address: saved.address ?? "" }));
      } catch {}
    }
    setOpen(true);
  }

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
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [r.name, r.address, r.district, r.city].filter(Boolean).join(" "))}`;

  if (done) {
    return (
      <main style={style} className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-green-100 text-3xl">✓</div>
        <h1 className="mt-4 font-display text-2xl font-bold">Siparişiniz alındı</h1>
        <p className="mt-2 text-muted">Sipariş no: <b>#{done.order_no}</b> · Toplam {money(done.total)}</p>
        <p className="mt-1 text-sm text-ok">Direkt sipariş verdiğiniz için {money(done.discount)} indirim kazandınız.</p>
        {r.phone && <a href={`tel:${r.phone}`} className="btn-ghost mt-6">Restoranı ara</a>}
        <button className="mt-3 text-sm underline" onClick={() => setDone(null)}>Yeni sipariş</button>
      </main>
    );
  }

  return (
    <div style={style} className="min-h-screen bg-surface pb-28">
      {/* Üst çubuk */}
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          {r.logo_url
            ? <img src={r.logo_url} alt={`${r.name} logo`} className="h-10 w-10 rounded-full object-cover" />
            : <span className="grid h-10 w-10 place-items-center rounded-full bg-brand font-display font-bold text-brand-ink">{r.name[0]}</span>}
          <span className="truncate font-display text-lg font-bold">{r.name}</span>
          <nav className="ml-auto hidden gap-5 text-sm font-medium md:flex">
            <a href="#menu">Menü</a>
            {r.about && <a href="#hakkimizda">Hakkımızda</a>}
            <a href="#konum">Konum</a>
          </nav>
          <button className="btn-primary ml-auto md:ml-4" onClick={() => startOrder()} disabled={!r.is_open}>
            Sipariş ver
          </button>
        </div>
      </header>

      {/* Kapak */}
      <section className="relative isolate overflow-hidden">
        {r.cover_url
          ? <img src={r.cover_url} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
          : <div className="absolute inset-0 -z-10 bg-brand" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />
        <div className="mx-auto flex min-h-[26rem] max-w-6xl flex-col justify-end px-4 pb-10 pt-24 text-white sm:min-h-[32rem]">
          <p className="mb-3 flex flex-wrap gap-2 text-xs font-semibold">
            <span className={`rounded-full px-3 py-1 ${r.is_open ? "bg-green-500/90" : "bg-stone-600/90"}`}>
              {r.is_open ? "● Şu an açık" : "Şu an kapalı"}
            </span>
            {r.district && <span className="rounded-full bg-white/20 px-3 py-1">{r.district}</span>}
            {r.hours && <span className="rounded-full bg-white/20 px-3 py-1">{r.hours}</span>}
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-6xl">{r.name}</h1>
          {r.tagline && <p className="mt-3 max-w-2xl text-lg text-white/90">{r.tagline}</p>}
          <div className="mt-7 flex flex-wrap gap-3">
            {r.accepts_delivery && (
              <button className="btn bg-brand px-6 py-3 text-base text-brand-ink" disabled={!r.is_open} onClick={() => startOrder("delivery")}>
                Paket sipariş ver
              </button>
            )}
            {r.accepts_pickup && (
              <button className="btn bg-white px-6 py-3 text-base text-ink" disabled={!r.is_open} onClick={() => startOrder("pickup")}>
                Gel-al sipariş ver
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Neden buradan */}
      <section className="border-b border-line bg-bg">
        <div className="mx-auto grid max-w-6xl gap-3 px-4 py-4 text-sm sm:grid-cols-3">
          <Perk icon="%" title={`Buradan siparişe %${r.direct_discount_pct} indirim`} text="Platformlardan daha ucuz, çünkü komisyon yok." />
          <Perk icon="₺" title="Kapıda nakit veya kart" text="Ödemeyi teslimatta yapın." />
          <Perk icon="★" title="Doğrudan restorana" text="Siparişiniz aracısız mutfağa düşer." />
        </div>
      </section>

      {/* En çok sevilenler */}
      {popular.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pt-10">
          <h2 className="font-display text-2xl font-bold">En çok sevilenler</h2>
          <div className="-mx-4 mt-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
            {popular.map((i) => (
              <article key={i.id} className="w-56 shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-surface">
                <button className="block w-full text-left" onClick={() => setDetail(i)}>
                  <Photo item={i} className="aspect-[4/3] w-full" />
                  <div className="p-3">
                    <p className="line-clamp-1 font-semibold">{i.name}</p>
                    <p className="text-sm text-muted">{money(i.price)}</p>
                  </div>
                </button>
                <div className="px-3 pb-3">
                  <AddButton qty={cart[i.id] ?? 0} disabled={!r.is_open} onAdd={() => add(i.id, 1)} onRemove={() => add(i.id, -1)} name={i.name} wide />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Menü */}
      <section id="menu" className="scroll-mt-16 pt-10">
        <div className="sticky top-[65px] z-20 border-y border-line bg-surface/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 py-2">
            {categories.filter((c) => items.some((i) => i.category_id === c.id)).map((c) => (
              <a key={c.id} href={`#k-${c.id}`} className="whitespace-nowrap rounded-full border border-line px-4 py-1.5 text-sm font-medium hover:border-brand">
                {c.name}
              </a>
            ))}
          </div>
        </div>
        <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
          {categories.map((c) => {
            const list = items.filter((i) => i.category_id === c.id);
            if (!list.length) return null;
            return (
              <div key={c.id} id={`k-${c.id}`} className="scroll-mt-32">
                <h2 className="mb-4 font-display text-2xl font-bold">{c.name}</h2>
                <ul className="grid gap-4 md:grid-cols-2">
                  {list.map((i) => (
                    <li key={i.id} className="flex gap-4 rounded-2xl border border-line p-4 transition hover:shadow-md">
                      <button className="min-w-0 flex-1 text-left" onClick={() => setDetail(i)}>
                        <p className="font-semibold">{i.name}</p>
                        {i.description && <p className="mt-1 line-clamp-2 text-sm text-muted">{i.description}</p>}
                        <p className="mt-2 font-semibold">{money(i.price)}</p>
                      </button>
                      <div className="relative shrink-0">
                        {i.image_url && (
                          <button onClick={() => setDetail(i)} aria-label={`${i.name} detay`}>
                            <Photo item={i} className="h-24 w-24 rounded-xl sm:h-28 sm:w-28" />
                          </button>
                        )}
                        <div className={i.image_url ? "absolute -bottom-2 -right-2" : ""}>
                          <AddButton qty={cart[i.id] ?? 0} disabled={!r.is_open} onAdd={() => add(i.id, 1)} onRemove={() => add(i.id, -1)} name={i.name} />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hakkımızda */}
      {r.about && (
        <section id="hakkimizda" className="bg-bg">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl font-bold">Hakkımızda</h2>
              <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-muted">{r.about}</p>
            </div>
            {r.cover_url && <img src={r.cover_url} alt={r.name} className="aspect-[4/3] w-full rounded-3xl object-cover" />}
          </div>
        </section>
      )}

      {/* Konum ve saatler */}
      <section id="konum" className="mx-auto grid max-w-6xl gap-6 px-4 py-14 md:grid-cols-3">
        <div className="md:col-span-1">
          <h2 className="font-display text-3xl font-bold">Konum ve saatler</h2>
        </div>
        <div className="space-y-4 md:col-span-2">
          {r.address && <Info label="Adres" value={[r.address, r.district, r.city].filter(Boolean).join(", ")} />}
          {r.hours && <Info label="Çalışma saatleri" value={r.hours} />}
          {r.phone && <Info label="Telefon" value={r.phone} />}
          <div className="flex flex-wrap gap-3">
            <a href={mapsUrl} target="_blank" rel="noopener" className="btn-ghost">Yol tarifi al</a>
            {r.phone && <a href={`tel:${r.phone}`} className="btn-ghost">Ara</a>}
          </div>
        </div>
      </section>

      {/* Sık sorulanlar (Google için de faydalı) */}
      <section className="border-t border-line bg-bg">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="font-display text-2xl font-bold">Sık sorulan sorular</h2>
          <div className="mt-4 divide-y divide-line">
            <Faq q={`${r.name} paket servis yapıyor mu?`}
              a={r.accepts_delivery ? `Evet. Bu sayfadan paket sipariş verebilirsiniz${Number(r.delivery_fee) > 0 ? `, paket ücreti ${money(r.delivery_fee)}` : ""}.` : "Şu an sadece gel-al siparişi alıyoruz."} />
            <Faq q="Minimum sipariş tutarı ne kadar?" a={Number(r.min_order) > 0 ? `Minimum sipariş ${money(r.min_order)}.` : "Minimum sipariş tutarı yok."} />
            <Faq q="Nasıl ödeme yapabilirim?" a="Kapıda nakit veya kredi kartıyla ödeyebilirsiniz." />
            <Faq q="Buradan sipariş vermenin farkı ne?" a={`Siparişiniz doğrudan restorana gelir ve %${r.direct_discount_pct} indirim kazanırsınız.`} />
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-6 text-sm text-muted">
          <span>© {r.name}</span>
          <span>SiparişAI ile hazırlandı</span>
        </div>
      </footer>

      {/* Ürün detayı */}
      {detail && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 sm:items-center" onClick={() => setDetail(null)}>
          <div onClick={(e) => e.stopPropagation()} className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-surface sm:rounded-3xl">
            {detail.image_url && <img src={detail.image_url} alt={detail.name} className="aspect-[4/3] w-full object-cover" />}
            <div className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-2xl font-bold">{detail.name}</h3>
                <button className="text-muted" onClick={() => setDetail(null)}>Kapat</button>
              </div>
              {detail.description && <p className="text-muted">{detail.description}</p>}
              <button className="btn-primary w-full py-3 text-base" disabled={!r.is_open}
                onClick={() => { add(detail.id, 1); setDetail(null); }}>
                Sepete ekle · {money(detail.price)}
              </button>
            </div>
          </div>
        </div>
      )}

      {count > 0 && !open && (
        <div className="fixed inset-x-0 bottom-0 z-30 p-4">
          <button className="btn-primary mx-auto flex w-full max-w-3xl justify-between py-4 text-base shadow-xl" onClick={openCart}>
            <span>Sepeti gör ({count})</span><span>{money(total)}</span>
          </button>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/40 sm:items-center" onClick={() => setOpen(false)}>
          <form onSubmit={order} onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-lg space-y-4 overflow-y-auto rounded-t-3xl bg-surface p-5 sm:rounded-3xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Sepetim</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-muted">Kapat</button>
            </div>
            <ul className="divide-y divide-line text-sm">
              {lines.map((l) => (
                <li key={l.item.id} className="flex items-center justify-between py-2">
                  <span>{l.qty} × {l.item.name}</span>
                  <span className="flex items-center gap-2">
                    {money(Number(l.item.price) * l.qty)}
                    <button type="button" className="h-7 w-7 rounded-full border border-line" onClick={() => add(l.item.id, -1)} aria-label="Azalt">−</button>
                    <button type="button" className="h-7 w-7 rounded-full border border-line" onClick={() => add(l.item.id, 1)} aria-label="Artır">+</button>
                  </span>
                </li>
              ))}
            </ul>
            {upsell.length > 0 && (
              <div>
                <p className="label">Bunu da ekle</p>
                <div className="flex gap-2 overflow-x-auto">
                  {upsell.map((i) => (
                    <button key={i.id} type="button" onClick={() => add(i.id, 1)}
                      className="flex shrink-0 items-center gap-2 rounded-xl border border-line p-2 pr-3 text-left text-sm hover:border-brand">
                      {i.image_url && <img src={i.image_url} alt="" className="h-10 w-10 rounded-lg object-cover" />}
                      <span><b className="block">{i.name}</b>+ {money(i.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {r.accepts_delivery && r.accepts_pickup && (
              <div className="grid grid-cols-2 gap-2">
                {(["delivery", "pickup"] as const).map((m) => (
                  <button key={m} type="button" onClick={() => setMode(m)}
                    className={`rounded-xl border p-2 text-sm font-semibold ${mode === m ? "border-brand bg-brand/10" : "border-line"}`}>
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

function Photo({ item, className }: { item: MenuItem; className: string }) {
  return item.image_url
    ? <img src={item.image_url} alt={item.name} loading="lazy" className={`${className} object-cover`} />
    : <div className={`${className} grid place-items-center bg-bg font-display text-3xl font-bold text-muted`}>{item.name[0]}</div>;
}

function AddButton(p: { qty: number; disabled: boolean; onAdd: () => void; onRemove: () => void; name: string; wide?: boolean }) {
  if (p.qty > 0) {
    return (
      <div className={`flex items-center justify-between gap-2 rounded-full bg-surface p-1 shadow ${p.wide ? "w-full" : ""}`}>
        <button className="h-8 w-8 rounded-full border border-line" onClick={p.onRemove} aria-label="Azalt">−</button>
        <span className="w-5 text-center font-semibold">{p.qty}</span>
        <button className="h-8 w-8 rounded-full bg-brand text-brand-ink" onClick={p.onAdd} aria-label="Artır">+</button>
      </div>
    );
  }
  return (
    <button disabled={p.disabled} onClick={p.onAdd} aria-label={`${p.name} ekle`}
      className={`rounded-full bg-brand font-semibold text-brand-ink shadow disabled:opacity-40 ${p.wide ? "w-full py-2 text-sm" : "h-9 w-9 text-lg"}`}>
      {p.wide ? "+ Ekle" : "+"}
    </button>
  );
}

function Perk({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand font-bold text-brand-ink">{icon}</span>
      <div><p className="font-semibold">{title}</p><p className="text-muted">{text}</p></div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="label">{label}</p><p className="text-lg">{value}</p></div>;
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="group py-3">
      <summary className="cursor-pointer list-none font-semibold">{q}<span className="float-right text-muted group-open:rotate-45">+</span></summary>
      <p className="mt-2 text-muted">{a}</p>
    </details>
  );
}

function Row({ k, v, bold, green }: { k: string; v: string; bold?: boolean; green?: boolean }) {
  return (
    <div className={`flex justify-between ${bold ? "text-base font-bold" : ""} ${green ? "text-ok" : ""}`}>
      <span>{k}</span><span>{v}</span>
    </div>
  );
}
