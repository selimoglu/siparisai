import Link from "next/link";
import { redirect } from "next/navigation";
import { getOwnerContext } from "@/lib/supabase/server";
import { siteUrl } from "@/lib/format";
import PanelNav from "./PanelNav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { userId, restaurant } = await getOwnerContext();
  if (!userId) redirect("/giris");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link href="/panel" className="font-display text-lg font-bold">
            Sipariş<span className="text-brand">AI</span>
          </Link>
          {restaurant && <span className="hidden truncate text-sm text-muted sm:inline">{restaurant.name}</span>}
          <div className="ml-auto flex items-center gap-2">
            {restaurant?.published && (
              <a href={siteUrl(restaurant)} target="_blank" className="btn-ghost py-1.5 text-xs">Siteyi aç ↗</a>
            )}
            <form action="/auth/cikis" method="post">
              <button className="btn-ghost py-1.5 text-xs">Çıkış</button>
            </form>
          </div>
        </div>
        {restaurant && <PanelNav />}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
