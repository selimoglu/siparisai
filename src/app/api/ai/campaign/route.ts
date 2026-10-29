import { NextResponse } from "next/server";
import { getOwnerContext } from "@/lib/supabase/server";
import { writeCampaign } from "@/lib/ai";
import { SEGMENTS, isSegmentKey } from "@/lib/segments";
import { siteUrl } from "@/lib/format";

export const maxDuration = 60;

export async function POST(req: Request) {
  const { supabase, restaurant } = await getOwnerContext();
  if (!restaurant) return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { segment?: string; offer?: string };
  const segment = body.segment ?? "";
  if (!isSegmentKey(segment)) return NextResponse.json({ error: "Geçersiz kitle." }, { status: 400 });

  // Son 200 siparişten en çok satan 5 ürün
  const { data: orders } = await supabase
    .from("orders")
    .select("items")
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false })
    .limit(200);
  const counts = new Map<string, number>();
  for (const o of orders ?? [])
    for (const l of o.items as { name: string; qty: number }[])
      counts.set(l.name, (counts.get(l.name) ?? 0) + l.qty);
  const topItems = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([n]) => n);

  try {
    const variants = await writeCampaign({
      restaurantName: restaurant.name,
      segmentLabel: SEGMENTS[segment].label,
      goal: SEGMENTS[segment].goal,
      offer: (body.offer ?? "").slice(0, 200),
      topItems,
      link: siteUrl(restaurant),
    });
    return NextResponse.json({ variants });
  } catch (e) {
    console.error("campaign ai error", e);
    return NextResponse.json({ error: "Metin yazılamadı, tekrar deneyin." }, { status: 502 });
  }
}
