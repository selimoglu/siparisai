import { requireRestaurant } from "@/lib/supabase/server";
import { inSegment, SEGMENTS, type SegmentKey } from "@/lib/segments";
import { money } from "@/lib/format";
import type { Customer } from "@/lib/types";
import Composer from "./Composer";

export default async function Page() {
  const { supabase, restaurant } = await requireRestaurant();
  const [{ data: customers }, { data: campaigns }, { data: attributed }] = await Promise.all([
    supabase.from("customers").select("*").eq("restaurant_id", restaurant.id).eq("marketing_consent", true),
    supabase.from("campaigns").select("*").eq("restaurant_id", restaurant.id).order("created_at", { ascending: false }).limit(30),
    supabase.from("orders").select("campaign_id,total").eq("restaurant_id", restaurant.id).not("campaign_id", "is", null),
  ]);
  const counts = Object.fromEntries(
    (Object.keys(SEGMENTS) as SegmentKey[]).map((k) => [k, ((customers ?? []) as Customer[]).filter((c) => inSegment(c, k)).length]),
  ) as Record<SegmentKey, number>;
  const results = new Map<string, { n: number; sum: number }>();
  for (const o of attributed ?? []) {
    const r = results.get(o.campaign_id) ?? { n: 0, sum: 0 };
    results.set(o.campaign_id, { n: r.n + 1, sum: r.sum + Number(o.total) });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <Composer counts={counts} smsFooter={restaurant.sms_footer} />
      <aside className="card h-fit">
        <h2 className="font-display font-semibold">Gönderilen kampanyalar</h2>
        <ul className="mt-3 divide-y divide-line text-sm">
          {(campaigns ?? []).map((c) => {
            const r = results.get(c.id);
            return (
              <li key={c.id} className="py-2">
                <p className="font-medium">{SEGMENTS[c.segment as SegmentKey]?.label ?? c.segment}</p>
                <p className="line-clamp-2 text-xs text-muted">{c.message}</p>
                <p className="mt-1 text-xs">
                  {c.recipients} kişi{c.dry_run ? " (deneme modu)" : ""} ·{" "}
                  <b>{r ? `${r.n} sipariş, ${money(r.sum)}` : "henüz sipariş yok"}</b>
                </p>
              </li>
            );
          })}
          {!campaigns?.length && <li className="py-2 text-muted">Henüz kampanya yok.</li>}
        </ul>
      </aside>
    </div>
  );
}
