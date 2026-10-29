import { requireRestaurant } from "@/lib/supabase/server";
import { daysAgoIso } from "@/lib/format";
import OrderBoard from "./OrderBoard";
import type { Order } from "@/lib/types";

export default async function Page() {
  const { supabase, restaurant } = await requireRestaurant();
  const since = daysAgoIso(2);
  const { data } = await supabase.from("orders").select("*").eq("restaurant_id", restaurant.id)
    .gte("created_at", since).order("created_at", { ascending: false });
  return <OrderBoard restaurantId={restaurant.id} initial={(data ?? []) as Order[]} />;
}
