import Link from "next/link";
import { requireRestaurant } from "@/lib/supabase/server";
import { daysAgoIso, money, siteUrl, timeAgo, STATUS_LABEL } from "@/lib/format";
import type { Order } from "@/lib/types";

const PLATFORM_COMMISSION = 0.2; // platformların ortalama komisyonu (tahmini)

export default async function Dashboard() {
  const { supabase, restaurant } = await requireRestaurant();
  const since = daysAgoIso(30);

  const [{ data: orders }, { count: customerCount }, { count: itemCount }] = await Promise.all([
    supabase.from("orders").select("*").eq("restaurant_id", restaurant.id)
      .neq("status", "cancelled").gte("created_at", since).order("created_at", { ascending: false }),
    supabase.from("customers").select("id", { count: "exact", head: true }).eq("restaurant_id", restaurant.id),
    supabase.from("menu_items").select("id", { count: "exact", head: true }).eq("restaurant_id", restaurant.id),
  ]);
  const list = (orders ?? []) as (Order & { campaign_id: string | null })[];
  const revenue = list.reduce((s, o) => s + Number(o.total), 0);
  const campaignRevenue = list.filter((o) => o.campaign_id).reduce((s, o) => s + Number(o.total), 0);

  const steps = [
    { done: (itemCount ?? 0) > 0, text: "Menünü yükle", href: "/panel/kurulum" },
    { done: restaurant.published, text: "Siteni yayınla", href: "/panel/ayarlar" },
    { done: list.length > 0, text: "İlk siparişini al (paketlere QR kart koy)", href: "/panel/ayarlar#qr" },
    { done: false, text: "İlk kampanyanı gönder", href: "/panel/kampanyalar" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="h1">Son 30 gün</h1>

      {steps.some((s) => !s.done) && (
        <div className="card">
          <h2 className="font-display font-semibold">Başlangıç adımları</h2>
          <ul className="mt-3 space-y-2">
            {steps.map((s) => (
              <li key={s.text} className="flex items-center gap-3 text-sm">
                <span className={`grid h-5 w-5 place-items-center rounded-full text-xs ${s.done ? "bg-ok text-white" : "border border-line"}`}>
                  {s.done ? "✓" : ""}
                </span>
                {s.done ? <span className="text-muted line-through">{s.text}</span>
                  : <Link href={s.href} className="font-medium underline">{s.text}</Link>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Direkt sipariş" value={String(list.length)} />
        <Kpi label="Ciro" value={money(revenue)} />
        <Kpi label="Ödenmeyen komisyon" value={money(revenue * PLATFORM_COMMISSION)} accent
          hint="Bu siparişler platformdan gelseydi ödenecek tahmini %20" />
        <Kpi label="Kampanyadan gelen" value={money(campaignRevenue)} hint={`${customerCount ?? 0} kayıtlı müşteri`} />
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-semibold">Son siparişler</h2>
          <Link href="/panel/siparisler" className="text-sm underline">Tümü</Link>
        </div>
        {list.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Henüz sipariş yok. Site adresin: <a className="underline" href={siteUrl(restaurant)} target="_blank">{siteUrl(restaurant)}</a>
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {list.slice(0, 6).map((o) => (
              <li key={o.id} className="flex items-center justify-between py-2 text-sm">
                <span>#{o.order_no} · {o.customer_name}</span>
                <span className="text-muted">{STATUS_LABEL[o.status]} · {timeAgo(o.created_at)}</span>
                <span className="font-semibold">{money(o.total)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: boolean }) {
  return (
    <div className={`card ${accent ? "border-brand/40 bg-brand/10" : ""}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1 font-display text-2xl font-bold ${accent ? "text-brand" : ""}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
