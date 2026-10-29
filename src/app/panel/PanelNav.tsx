"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  ["/panel", "Özet"],
  ["/panel/siparisler", "Siparişler"],
  ["/panel/menu", "Menü"],
  ["/panel/musteriler", "Müşteriler"],
  ["/panel/kampanyalar", "Kampanyalar"],
  ["/panel/ayarlar", "Ayarlar"],
] as const;

export default function PanelNav() {
  const path = usePathname();
  return (
    <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2">
      {TABS.map(([href, label]) => {
        const active = href === "/panel" ? path === "/panel" : path.startsWith(href);
        return (
          <Link key={href} href={href}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium ${
              active ? "bg-brand text-brand-ink" : "text-muted hover:bg-bg"}`}>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
