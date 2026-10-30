"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/client";
import type { Restaurant } from "@/lib/types";
import { uploadMedia } from "@/lib/upload";

export default function Settings({ restaurant, url }: { restaurant: Restaurant; url: string }) {
  const router = useRouter();
  const [r, setR] = useState(restaurant);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [qr, setQr] = useState("");

  useEffect(() => {
    QRCode.toDataURL(`${url}?k=qr`, { margin: 1, width: 600 }).then(setQr);
  }, [url]);

  const set = <K extends keyof Restaurant>(k: K, v: Restaurant[K]) => setR((x) => ({ ...x, [k]: v }));

  async function save(extra?: Partial<Restaurant>) {
    setBusy(true);
    setSaved(null);
    const next = { ...r, ...extra };
    const { error } = await createClient().from("restaurants").update({
      name: next.name, phone: next.phone, address: next.address, district: next.district, about: next.about,
      hours: next.hours, primary_color: next.primary_color, delivery_fee: next.delivery_fee, min_order: next.min_order,
      direct_discount_pct: next.direct_discount_pct, accepts_delivery: next.accepts_delivery,
      accepts_pickup: next.accepts_pickup, is_open: next.is_open, published: next.published,
      sms_footer: next.sms_footer, tagline: next.tagline, logo_url: next.logo_url, cover_url: next.cover_url,
      custom_domain: next.custom_domain?.trim().toLowerCase() || null,
    }).eq("id", r.id);
    setBusy(false);
    if (error) return setSaved(`Hata: ${error.message}`);
    setR(next);
    setSaved("Kaydedildi.");
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="space-y-6">
        <section className="card space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="h1">Site</h1>
              <a href={url} target="_blank" className="text-sm underline">{url}</a>
            </div>
            <button className={r.published ? "btn-ghost" : "btn-primary"} disabled={busy}
              onClick={() => save({ published: !r.published })}>
              {r.published ? "Yayından kaldır" : "Siteyi yayınla"}
            </button>
          </div>
          <Toggle label="Şu an sipariş alıyorum" checked={r.is_open} onChange={(v) => set("is_open", v)} />
        </section>

        <section className="card space-y-4">
          <h2 className="font-display font-semibold">Görünüm</h2>
          <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
            <ImagePick label="Logo" url={r.logo_url} square
              onFile={async (f) => save({ logo_url: await uploadMedia(r.id, f, "logo") })} />
            <ImagePick label="Kapak fotoğrafı (sitenin en üstü)" url={r.cover_url}
              onFile={async (f) => save({ cover_url: await uploadMedia(r.id, f, "cover") })} />
          </div>
          <Text label="Kısa tanıtım cümlesi" value={r.tagline ?? ""} onChange={(v) => set("tagline", v)}
            placeholder="1987'den beri Kadıköy'ün odun fırınında pidesi" />
        </section>

        <section className="card grid gap-4 sm:grid-cols-2">
          <h2 className="font-display font-semibold sm:col-span-2">Restoran bilgileri</h2>
          <Text label="Ad" value={r.name} onChange={(v) => set("name", v)} />
          <Text label="Telefon" value={r.phone ?? ""} onChange={(v) => set("phone", v)} />
          <Text label="Adres" value={r.address ?? ""} onChange={(v) => set("address", v)} />
          <Text label="İlçe" value={r.district ?? ""} onChange={(v) => set("district", v)} />
          <Text label="Çalışma saatleri" value={r.hours ?? ""} onChange={(v) => set("hours", v)} placeholder="Her gün 11:00–23:00" />
          <div>
            <label className="label">Renk</label>
            <input type="color" className="h-10 w-20 rounded-lg border border-line" value={r.primary_color}
              onChange={(e) => set("primary_color", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Hakkımızda</label>
            <textarea className="input" value={r.about ?? ""} onChange={(e) => set("about", e.target.value)} />
          </div>
        </section>

        <section className="card grid gap-4 sm:grid-cols-3">
          <h2 className="font-display font-semibold sm:col-span-3">Sipariş kuralları</h2>
          <Num label="Direkt sipariş indirimi (%)" value={r.direct_discount_pct} onChange={(v) => set("direct_discount_pct", v)} />
          <Num label="Paket ücreti (TL)" value={r.delivery_fee} onChange={(v) => set("delivery_fee", v)} />
          <Num label="Minimum sipariş (TL)" value={r.min_order} onChange={(v) => set("min_order", v)} />
          <Toggle label="Paket servis" checked={r.accepts_delivery} onChange={(v) => set("accepts_delivery", v)} />
          <Toggle label="Gel-al" checked={r.accepts_pickup} onChange={(v) => set("accepts_pickup", v)} />
        </section>

        <section className="card space-y-4">
          <h2 className="font-display font-semibold">SMS ve alan adı</h2>
          <Text label="SMS sonuna eklenecek ret metni (İYS)" value={r.sms_footer ?? ""}
            onChange={(v) => set("sms_footer", v)} placeholder="Ret için RET yazıp 3xxx'e gönderin. Mersis: ..." />
          <div>
            <Text label="Kendi alan adın (isteğe bağlı)" value={r.custom_domain ?? ""}
              onChange={(v) => set("custom_domain", v)} placeholder="restoraniniz.com" />
            <p className="mt-1 text-xs text-muted">
              Alan adının DNS ayarında <b>CNAME</b> kaydını <b>cname.vercel-dns.com</b> adresine yönlendir.
              Sonra bu adresi barındırma panelinde (Vercel) eklememiz gerekir; destekten iste.
            </p>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button className="btn-primary" disabled={busy} onClick={() => save()}>{busy ? "Kaydediliyor…" : "Kaydet"}</button>
          {saved && <span className="text-sm text-muted">{saved}</span>}
        </div>
      </div>

      <aside id="qr" className="card h-fit space-y-3 text-center">
        <h2 className="font-display font-semibold">Paket içi QR kart</h2>
        <p className="text-sm text-muted">Platformdan gelen her paketin içine koy. Müşteri bir dahakine sana direkt sipariş versin.</p>
        <div className="rounded-2xl border-2 p-4" style={{ borderColor: r.primary_color }}>
          <p className="font-display text-lg font-bold">{r.name}</p>
          <p className="text-sm">Bir dahaki siparişe <b>%{r.direct_discount_pct} indirim</b></p>
          {qr && <img src={qr} alt="QR kod" className="mx-auto my-2 w-40" />}
          <p className="text-xs text-muted">{url.replace(/^https?:\/\//, "")}</p>
        </div>
        {qr && <a href={qr} download={`${r.slug}-qr.png`} className="btn-ghost w-full">QR kodu indir</a>}
      </aside>
    </div>
  );
}

function ImagePick(p: { label: string; url: string | null; square?: boolean; onFile: (f: File) => Promise<void> }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  return (
    <div>
      <p className="label">{p.label}</p>
      <label className={`relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-line bg-bg text-sm text-muted hover:border-brand ${p.square ? "aspect-square" : "aspect-[16/7]"}`}>
        {p.url ? <img src={p.url} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <span>{busy ? "Yükleniyor…" : "Fotoğraf seç"}</span>}
        {busy && p.url && <span className="absolute inset-0 grid place-items-center bg-white/70">Yükleniyor…</span>}
        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setBusy(true); setErr(null);
          try { await p.onFile(f); } catch (x) { setErr(x instanceof Error ? x.message : "Yüklenemedi"); }
          setBusy(false);
        }} />
      </label>
      {err && <p className="mt-1 text-xs text-red-700">{err}</p>}
    </div>
  );
}

function Text(p: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="label">{p.label}</label>
      <input className="input" value={p.value} placeholder={p.placeholder} onChange={(e) => p.onChange(e.target.value)} />
    </div>
  );
}
function Num(p: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="label">{p.label}</label>
      <input className="input" type="number" min={0} value={p.value} onChange={(e) => p.onChange(Number(e.target.value))} />
    </div>
  );
}
function Toggle(p: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-sm font-medium">
      <input type="checkbox" className="h-4 w-4 accent-[var(--brand)]" checked={p.checked} onChange={(e) => p.onChange(e.target.checked)} />
      {p.label}
    </label>
  );
}
