import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component'ten çağrıldığında yazılamaz; oturumu proxy yeniler.
          }
        },
      },
    },
  );
}

/** Giriş yapmış kullanıcıyı ve (varsa) restoranını döndürür. */
export async function getOwnerContext() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub as string | undefined;
  if (!userId) return { supabase, userId: null, restaurant: null } as const;
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("owner_id", userId)
    .maybeSingle();
  return { supabase, userId, restaurant } as const;
}

/** Panel sayfaları için: giriş yoksa /giris'e, restoran yoksa kuruluma gönderir. */
export async function requireRestaurant() {
  const { redirect } = await import("next/navigation");
  const ctx = await getOwnerContext();
  if (!ctx.userId) redirect("/giris");
  if (!ctx.restaurant) redirect("/panel/kurulum");
  return { supabase: ctx.supabase, restaurant: ctx.restaurant as import("@/lib/types").Restaurant };
}
