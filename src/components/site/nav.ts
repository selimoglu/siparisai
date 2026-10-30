// Tanıtım sitesinin üst menüsü
export type NavLink = { label: string; href: string; desc?: string };
export type NavItem = { label: string; href?: string; children?: NavLink[] };

export const NAV: NavItem[] = [
  { label: "Ürün", href: "/urun" },
  { label: "Fiyatlar", href: "/fiyatlar" },
  { label: "Nasıl çalışır?", href: "/nasil-calisir" },
  {
    label: "Kurumsal",
    children: [
      { label: "Hikayemiz", href: "/kurumsal/hikayemiz", desc: "Neden SiparişAI'ı kurduk" },
      { label: "Liderlik", href: "/kurumsal/liderlik", desc: "Ekibimiz" },
      { label: "Kariyer", href: "/kurumsal/kariyer", desc: "Bize katıl" },
      { label: "Blog", href: "/blog", desc: "Restoranlar için büyüme rehberleri" },
    ],
  },
  { label: "Destek Merkezi", href: "/destek" },
];

/** İletişim e-postası. Boşken sitede iletişim kutusu gösterilmez. */
export const CONTACT_EMAIL = "";
