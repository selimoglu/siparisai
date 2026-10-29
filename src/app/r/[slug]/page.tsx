import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Category, MenuItem, Restaurant } from "@/lib/types";
import OrderSite from "./OrderSite";

type Params = { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

const UUID = /^[0-9a-f-]{36}$/i;

const load = cache(async (raw: string) => {
  const key = decodeURIComponent(raw);
  const supabase = await createClient();
  const q = supabase.from("restaurants").select("*").eq("published", true);
  const { data: r } = await (key.startsWith("~") ? q.eq("custom_domain", key.slice(1)) : q.eq("slug", key)).maybeSingle();
  if (!r) return null;
  const [{ data: cats }, { data: items }] = await Promise.all([
    supabase.from("menu_categories").select("*").eq("restaurant_id", r.id).order("position"),
    supabase.from("menu_items").select("*").eq("restaurant_id", r.id).eq("available", true).order("position"),
  ]);
  return { restaurant: r as Restaurant, categories: (cats ?? []) as Category[], items: (items ?? []) as MenuItem[] };
});

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const data = await load((await params).slug);
  if (!data) return { title: "Bulunamadı" };
  const r = data.restaurant;
  return {
    title: `${r.name}${r.district ? ` · ${r.district}` : ""} | Online sipariş`,
    description: r.about ?? `${r.name} menüsü ve online sipariş. Direkt siparişe %${r.direct_discount_pct} indirim.`,
  };
}

export default async function Page({ params, searchParams }: Params) {
  const data = await load((await params).slug);
  if (!data) notFound();
  const sp = await searchParams;
  const r = data.restaurant;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: r.name,
    telephone: r.phone ?? undefined,
    address: r.address ?? undefined,
    openingHours: r.hours ?? undefined,
    hasMenu: {
      "@type": "Menu",
      hasMenuSection: data.categories.map((c) => ({
        "@type": "MenuSection",
        name: c.name,
        hasMenuItem: data.items.filter((i) => i.category_id === c.id).map((i) => ({
          "@type": "MenuItem", name: i.name, description: i.description ?? undefined,
          offers: { "@type": "Offer", price: i.price, priceCurrency: "TRY" },
        })),
      })),
    },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <OrderSite {...data} source={sp.k === "qr" ? "qr" : "site"}
        campaign={typeof sp.c === "string" && UUID.test(sp.c) ? sp.c : null} />
    </>
  );
}
