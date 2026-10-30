"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/format";
import type { Restaurant } from "@/lib/types";
import MenuImporter from "@/components/MenuImporter";

const ROOT = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "siparisai.com";
const PATH_MODE = ROOT.startsWith("localhost") || ROOT.endsWith(".vercel.app");

export default function Wizard({ userId, restaurant }: { userId: string; restaurant: Restaurant | null }) {
  const router = useRouter();
  const [r, setR] = useState<Restaurant | null>(restaurant);
  const [form, setForm] = useState({ name: "", phone: "", address: "", district: "", slug: "" });
  const [slugTouched, setSlugTouched] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form, v: string) =>
    setForm((f) => ({ ...f, [k]: v, ...(k === "name" && !slugTouched ? { slug: slugify(v) } : {}) }));

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { data, error } = await createClient().from("restaurants").insert({
      owner_id: userId, name: form.name.trim(), phone: form.phone.trim() || null,
      address: form.address.trim() || null, district: form.district.trim() || null, slug: form.slug,
    }).select().single();
    setBusy(false);
    if (error) {
      setError(error.code === "23505" ? "Bu adres alınmış, başka bir adres dene." :
        error.code === "23514" ? "Adres sadece küçük harf, rakam ve tire içerebilir (3–40 karakter)." : error.message);
      return;
    }
    setR(data as Restaurant);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <ol className="flex gap-2 text-sm">
        <Step n={1} label="Restoran bilgileri" active={!r} done={!!r} />
        <Step n={2} label="Menü" active={!!r} done={false} />
      </ol>

      {!r ? (
        <form onSubmit={create} className="card space-y-4">
          <h1 className="h1">Restoranını tanıt</h1>
          <Field label="Restoran adı" required value={form.name} onChange={(v) => set("name", v)} placeholder="Restoranınızın adı" />
          <div>
            <label className="label">Site adresin</label>
            <div className="flex items-center gap-1 text-sm">
              {PATH_MODE && <span className="whitespace-nowrap text-muted">{ROOT}/r/</span>}
              <input className="input" required value={form.slug}
                onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} />
              {!PATH_MODE && <span className="whitespace-nowrap text-muted">.{ROOT}</span>}
            </div>
          </div>
          <Field label="Telefon" value={form.phone} onChange={(v) => set("phone", v)} placeholder="0216 000 00 00" />
          <Field label="Adres" value={form.address} onChange={(v) => set("address", v)} />
          <Field label="İlçe" value={form.district} onChange={(v) => set("district", v)} placeholder="Kadıköy" />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button className="btn-primary" disabled={busy}>{busy ? "Kaydediliyor…" : "Devam et"}</button>
        </form>
      ) : (
        <div className="card space-y-4">
          <h1 className="h1">Menünü ekle</h1>
          <MenuImporter restaurantId={r.id} onSaved={() => router.push("/panel/menu?yeni=1")} />
          <button className="text-sm text-muted underline" onClick={() => router.push("/panel/menu")}>
            Menüyü elle gireceğim
          </button>
        </div>
      )}
    </div>
  );
}

function Step({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <li className={`flex items-center gap-2 rounded-full px-3 py-1 ${active ? "bg-brand text-brand-ink" : "bg-surface text-muted"}`}>
      <span>{done ? "✓" : n}</span> {label}
    </li>
  );
}

function Field(p: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="label">{p.label}</label>
      <input className="input" required={p.required} value={p.value} placeholder={p.placeholder}
        onChange={(e) => p.onChange(e.target.value)} />
    </div>
  );
}
