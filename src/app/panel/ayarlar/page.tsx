import { requireRestaurant } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/format";
import Settings from "./Settings";

export default async function Page() {
  const { restaurant } = await requireRestaurant();
  return <Settings restaurant={restaurant} url={siteUrl(restaurant)} />;
}
