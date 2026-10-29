import { requireRestaurant } from "@/lib/supabase/server";
import MenuEditor from "./MenuEditor";
import type { Category, MenuItem } from "@/lib/types";

export default async function Page() {
  const { supabase, restaurant } = await requireRestaurant();
  const [{ data: cats }, { data: items }] = await Promise.all([
    supabase.from("menu_categories").select("*").eq("restaurant_id", restaurant.id).order("position"),
    supabase.from("menu_items").select("*").eq("restaurant_id", restaurant.id).order("position"),
  ]);
  return <MenuEditor restaurantId={restaurant.id} categories={(cats ?? []) as Category[]} items={(items ?? []) as MenuItem[]} />;
}
