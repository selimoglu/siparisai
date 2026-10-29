"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { money } from "@/lib/format";

type Draft = { categories: { name: string; items: { name: string; description: string; price: number }[] }[] };

/** Menü fotoğrafı/metni → yapay zeka → düzenlenebilir önizleme → kaydet. */
export default function MenuImporter({ restaurantId, onSaved }: { restaurantId: string; onSaved: () => void }) {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState<"read" | "save" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);

  async function read() {
    setBusy("read");
    setError(null);
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    fd.append("text", text);
    const res = await fetch("/api/ai/menu", { method: "POST", body: fd });
    const data = await res.json();
    setBusy(null);
    if (!res.ok) return setError(data.error ?? "Bir hata oldu.");
    setDraft(data);
  }

  async function save() {
    if (!draft) return;
    setBusy("save");
    setError(null);
    const supabase = createClient();
    try {
      const { count } = await supabase.from("menu_categories").select("id", { count: "exact", head: true })
        .eq("restaurant_id", restaurantId);
      let pos = count ?? 0;
      for (const cat of draft.categories) {
        const items = cat.items.filter((i) => i.name.trim() && i.price >= 0);
        if (!items.length) continue;
        const { data: c, error: e1 } = await supabase.from("menu_categories")
          .insert({ restaurant_id: restaurantId, name: cat.name.trim(), position: pos++ }).select().single();
        if (e1) throw e1;
        const { error: e2 } = await supabase.from("menu_items").insert(
          items.map((i, idx) => ({
            restaurant_id: restaurantId, category_id: c.id, name: i.name.trim(),
            description: i.description.trim() || null, price: i.price, position: idx,
          })),
        );
        if (e2) throw e2;
      }
      setDraft(null);
      setFiles([]);
      setText("");
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kaydedilemedi.");
    } finally {
      setBusy(null);
    }
  }

  const edit = (ci: number, ii: number, patch: Partial<Draft["categories"][0]["items"][0]>) =>
    setDraft((d) => d && {
      categories: d.categories.map((c, i) => i !== ci ? c : {
        ...c, items: c.items.map((it, j) => (j === ii ? { ...it, ...patch } : it)),
      }),
    });
  const removeItem = (ci: number, ii: number) =>
    setDraft((d) => d && {
      categories: d.categories.map((c, i) => i !== ci ? c : { ...c, items: c.items.filter((_, j) => j !== ii) }),
    });

  if (draft) {
    const total = draft.categories.reduce((s, c) => s + c.items.length, 0);
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted">
          Yapay zeka {draft.categories.length} kategori, {total} ürün buldu. Kontrol edip düzelt, sonra kaydet.
        </p>
        {draft.categories.map((c, ci) => (
          <div key={ci} className="rounded-xl border border-line">
            <input className="w-full rounded-t-xl border-b border-line bg-bg px-3 py-2 font-display font-semibold outline-none"
              value={c.name}
              onChange={(e) => setDraft((d) => d && {
                categories: d.categories.map((x, i) => (i === ci ? { ...x, name: e.target.value } : x)),
              })} />
            <ul className="divide-y divide-line">
              {c.items.map((it, ii) => (
                <li key={ii} className="grid grid-cols-[1fr_6rem_2rem] gap-2 p-2">
                  <div className="space-y-1">
                    <input className="input py-1.5" value={it.name} onChange={(e) => edit(ci, ii, { name: e.target.value })} />
                    <input className="input py-1.5 text-xs text-muted" value={it.description}
                      onChange={(e) => edit(ci, ii, { description: e.target.value })} />
                  </div>
                  <input className="input py-1.5 text-right" type="number" min={0} step="0.5" value={it.price}
                    onChange={(e) => edit(ci, ii, { price: Number(e.target.value) })} />
                  <button className="text-muted hover:text-red-600" title="Sil" onClick={() => removeItem(ci, ii)}>✕</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {error && <p className="text-sm text-red-700">{error}</p>}
        <div className="flex gap-2">
          <button className="btn-primary" onClick={save} disabled={busy !== null}>
            {busy === "save" ? "Kaydediliyor…" : `${total} ürünü menüye ekle`}
          </button>
          <button className="btn-ghost" onClick={() => setDraft(null)}>Vazgeç</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-line bg-bg p-8 text-center hover:border-brand">
        <span className="text-3xl">📷</span>
        <span className="mt-2 font-semibold">Menünün fotoğrafını yükle</span>
        <span className="text-sm text-muted">En fazla 4 fotoğraf, her biri 5 MB</span>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 4))} />
      </label>
      {files.length > 0 && (
        <p className="text-sm">{files.map((f) => f.name).join(", ")}</p>
      )}
      <div>
        <label className="label">veya menüyü yapıştır</label>
        <textarea className="input min-h-28" placeholder={"Kıymalı pide 250\nLahmacun 120\nMercimek çorbası 90"}
          value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button className="btn-primary" onClick={read} disabled={busy !== null || (!files.length && !text.trim())}>
        {busy === "read" ? "Yapay zeka menüyü okuyor… (30 sn kadar)" : "Yapay zekayla menüyü oku"}
      </button>
      <p className="text-xs text-muted">Örnek fiyat biçimi: {money(185.5)}</p>
    </div>
  );
}
