import { redirect } from "next/navigation";
import { getOwnerContext } from "@/lib/supabase/server";
import Wizard from "./Wizard";

export default async function Page() {
  const { userId, restaurant } = await getOwnerContext();
  if (!userId) redirect("/giris");
  return <Wizard userId={userId} restaurant={restaurant} />;
}
