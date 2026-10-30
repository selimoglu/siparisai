"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Category, MenuItem } from "@/lib/types";
import MenuImporter from "@/components/MenuImporter";
import { uploadMedia } from "@/lib/upload";

export default function MenuEditor(p: { restaurantId: string; categories: Category[]; items: MenuItem[] }) {
  const router = useRouter();
  const supabase = createClient();
  const [items, setItems] = useState(p.items);
  const [showImport, setShowImport] = useState(p.items.length === 0);
  const [error, setError] = useState<string | null>(null);

  async function patch(id: string, change: Partial<MenuItem>) {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, ...change } : i)));
    const { error } = await supabase.from("menu_items").update(change).eq("id", id);
    if (error) setError(error.message);
  }
  async function remove(id: string) {
    if (!confirm("Bu ürün silinsin mi?")) return;
    setItems((list) => list.filter((i) => i.id !== id));
    await supabase.from("menu_items").delete().eq("id", id);
  }
  async function addItem(categoryId: string) {
    const name = prompt("Ürün adı?");
    if (!name) return;
    const price = Number(prompt("Fiyat (TL)?")?.replace(",", "."));
    if (!Number.isFinite(price)) return;
    const { data, error } = await supabase.from("menu_items")
      .insert({ restaurant_id: p.restaurantId, category_id: categoryId, name, price, position: items.length })
      .select().single();
    if (error) return setError(error.message);
    setItems((l) => [...l, data as MenuItem]);
  }
  async function addCategory() {
    const name = prompt("Kategori adı?");
    if (!name) return;
    await supabase.from("menu_categories").insert({ restaurant_id: p.restaurantId, name, position: p.categories.length });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="h1 mr-auto">Menü</h1>
        <button className="btn-ghost" onClick={addCategory}>+ Kategori</button>
        <button className="btn-primary" onClick={() => setShowImport(!showImport)}>
          {showImport ? "Kapat" : "Fotoğraftan ürün ekle"}
        </button>
      </div>
      {showImport && (
        <div className="card">
          <MenuImporter restaurantId={p.restaurantId} onSaved={() => { setShowImport(false); router.refresh(); }} />
        </div>
      )}
      {error && <p className="text-sm text-red-700">{error}</p>}

      {p.categories.map((c) => (
        <section key={c.id} className="card">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">{c.name}</h2>
            <button className="text-sm underline" onClick={() => addItem(c.id)}>+ Ürün</button>
          </div>
          <ul className="divide-y divide-line">
            {items.filter((i) => i.category_id === c.id).map((i) => (
              <li key={i.id} className="flex flex-wrap items-center gap-3 py-2">
                <label title="Fotoğraf ekle" className="relative grid h-14 w-14 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-lg border border-dashed border-line bg-bg text-lg text-muted hover:border-brand">
                  {i.image_url ? <img src={i.image_url} alt="" className="h-full w-full object-cover" /> : "📷"}
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    try { await patch(i.id, { image_url: await uploadMedia(p.restaurantId, f, `item-${i.id}`) }); }
                    catch (x) { setError(x instanceof Error ? x.message : "Fotoğraf yüklenemedi"); }
                  }} />
                </label>
                <div className="min-w-0 flex-1">
                  <p className={`font-medium ${i.available ? "" : "text-muted line-through"}`}>{i.name}</p>
                  {i.description && <p className="truncate text-xs text-muted">{i.description}</p>}
                </div>
                <input type="number" min={0} step="0.5" defaultValue={i.price}
                  className="input w-24 py-1.5 text-right"
                  onBlur={(e) => Number(e.target.value) !== Number(i.price) && patch(i.id, { price: Number(e.target.value) })} />
                <label className="flex items-center gap-1 text-xs text-muted">
                  <input type="checkbox" checked={i.available} onChange={(e) => patch(i.id, { available: e.target.checked })} />
                  Satışta
                </label>
                <button className="text-muted hover:text-red-600" onClick={() => remove(i.id)}>✕</button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
