// Pazarlama sitesinin üst menüsü ve alt bilgi linkleri
export type NavLink = { label: string; href: string; desc?: string };
export type NavItem = { label: string; href?: string; children?: NavLink[] };

export const NAV: NavItem[] = [
  {
    label: "Ürün",
    children: [
      { label: "Sipariş sitesi", href: "/urun#siparis-sitesi", desc: "Kendi adınla, komisyonsuz sipariş" },
      { label: "Canlı sipariş paneli", href: "/urun#panel", desc: "Siparişler anında ekranında" },
      { label: "Yapay zeka kampanyalar", href: "/urun#kampanya", desc: "Gelmeyen müşteriyi geri getirir" },
      { label: "QR menü ve kartlar", href: "/urun#qr", desc: "Paketteki müşteriyi sitene taşı" },
      { label: "Müşteri listesi", href: "/urun#musteriler", desc: "Her sipariş, senin müşterin" },
    ],
  },
  {
    label: "Kimler için",
    children: [
      { label: "Pide ve kebap", href: "/kimler-icin#pide-kebap" },
      { label: "Burger ve pizza", href: "/kimler-icin#burger-pizza" },
      { label: "Kafe ve fırın", href: "/kimler-icin#kafe-firin" },
      { label: "Çok şubeli restoranlar", href: "/kimler-icin#cok-subeli" },
    ],
  },
  { label: "Nasıl çalışır", href: "/nasil-calisir" },
  { label: "Fiyatlar", href: "/fiyatlar" },
  { label: "Komisyon hesapla", href: "/#hesapla" },
];
