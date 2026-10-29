const tl = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 2 });
export const money = (n: number | string) => tl.format(Number(n));

export const phoneDisplay = (p: string) =>
  p.length === 10 ? `0${p.slice(0, 3)} ${p.slice(3, 6)} ${p.slice(6, 8)} ${p.slice(8)}` : p;

export const timeAgo = (iso: string | null) => {
  if (!iso) return "—";
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "şimdi";
  if (mins < 60) return `${mins} dk önce`;
  const h = Math.round(mins / 60);
  if (h < 24) return `${h} saat önce`;
  return `${Math.round(h / 24)} gün önce`;
};

export function slugify(s: string) {
  const map: Record<string, string> = { ç: "c", ğ: "g", ı: "i", İ: "i", ö: "o", ş: "s", ü: "u" };
  return s
    .toLocaleLowerCase("tr-TR")
    .replace(/[çğıİöşü]/g, (c) => map[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

export const STATUS_LABEL: Record<string, string> = {
  new: "Yeni",
  preparing: "Hazırlanıyor",
  on_the_way: "Yolda",
  ready: "Gel-al hazır",
  completed: "Tamamlandı",
  cancelled: "İptal",
};

/** Restoranın müşteriye açık site adresi. */
export function siteUrl(r: { slug: string; custom_domain: string | null }) {
  if (r.custom_domain) return `https://${r.custom_domain}`;
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  if (root.startsWith("localhost")) return `http://${root}/r/${r.slug}`;
  return `https://${r.slug}.${root}`;
}

/** n gün önceki zamanın ISO metni (sorgular için). */
export const daysAgoIso = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
