import { requireRestaurant } from "@/lib/supabase/server";
import { money, phoneDisplay, timeAgo } from "@/lib/format";
import { SEGMENTS, inSegment, type SegmentKey } from "@/lib/segments";
import type { Customer } from "@/lib/types";

export default async function Page() {
  const { supabase, restaurant } = await requireRestaurant();
  const { data } = await supabase.from("customers").select("*").eq("restaurant_id", restaurant.id)
    .order("last_order_at", { ascending: false }).limit(1000);
  const customers = (data ?? []) as Customer[];
  const consented = customers.filter((c) => c.marketing_consent);

  return (
    <div className="space-y-6">
      <h1 className="h1">Müşteriler</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {(Object.keys(SEGMENTS) as SegmentKey[]).map((k) => (
          <div key={k} className="card">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{SEGMENTS[k].label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{consented.filter((c) => inSegment(c, k)).length}</p>
            <p className="text-xs text-muted">{SEGMENTS[k].hint}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-muted">
        {customers.length} müşteri, {consented.length} tanesi kampanya izni verdi. Kampanya sadece izin verenlere gider.
      </p>
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-bg text-left text-xs uppercase text-muted">
            <tr>{["Ad", "Telefon", "Sipariş", "Toplam", "Son sipariş", "İzin"].map((h) => <th key={h} className="px-4 py-2">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-line">
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2 font-medium">{c.name}</td>
                <td className="px-4 py-2">{phoneDisplay(c.phone)}</td>
                <td className="px-4 py-2">{c.order_count}</td>
                <td className="px-4 py-2">{money(c.total_spent)}</td>
                <td className="px-4 py-2 text-muted">{timeAgo(c.last_order_at)}</td>
                <td className="px-4 py-2">{c.marketing_consent ? "✓" : "—"}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-muted">İlk siparişle birlikte müşteriler burada görünür.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
