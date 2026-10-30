import type { Metadata } from "next";
import HeroPhone from "@/components/site/HeroPhone";
import Reveal from "@/components/site/Reveal";
import { AiSms, LiveOrders, MenuScan, SearchRank } from "@/components/site/Animations";
import { Check, FinalCta, PageHero } from "@/components/site/Blocks";

export const metadata: Metadata = { title: "Ürün · SiparişAI" };

type Visual = "phone" | "search" | "panel" | "sms" | "scan" | "qr" | "list";

const SECTIONS: { id: string; t: string; d: string; pts: string[]; visual: Visual }[] = [
  {
    id: "siparis-sitesi",
    t: "Kendi sipariş siten",
    d: "Müşterin menünde gezer, yorumları okur, indirimi görür, sepetini doldurur. Arada platform yok.",
    pts: ["Fotoğraflı menü, kategoriler ve ürün detayı", "Gerçek müşteri yorumları ve en çok sevilenler", "Sitene özel indirim ile platformdan daha ucuz", "Paket ve gel-al sipariş"],
    visual: "phone",
  },
  {
    id: "google",
    t: "Google'da üst sıralarda",
    d: "Siten, Google'ın restoranları anlamak için okuduğu bilgilerle hazırlanır. Seni arayan doğrudan sana gelir.",
    pts: ["Menü, saat ve adres Google'a hazır", "Google profilinde 'Sipariş ver' bağlantısı", "Mobilde hızlı açılan sayfalar"],
    visual: "search",
  },
  {
    id: "menu",
    t: "Fotoğraftan menü",
    d: "Kâğıt menünün fotoğrafını çek. Yapay zeka ürünleri ve fiyatları okur, siteni kurar.",
    pts: ["Kategori, ürün ve fiyatları otomatik çıkarır", "Dilediğin gibi düzenlersin", "10 dakikada yayında"],
    visual: "scan",
  },
  {
    id: "panel",
    t: "Canlı sipariş paneli",
    d: "Sipariş düştüğü an tablet veya telefonunda. Durumu tek dokunuşla güncellersin.",
    pts: ["Anlık sipariş bildirimi", "Hazırlanıyor, yolda, teslim edildi", "Siparişin nereden geldiği: QR, Google, kampanya", "Cebinde kalan komisyon"],
    visual: "panel",
  },
  {
    id: "kampanya",
    t: "Yapay zekalı kampanyalar",
    d: "Yapay zeka müşterilerini gruplar ve her gruba doğru mesajı yazar. Sen sadece onaylarsın.",
    pts: ["Kaybolmak üzere olan müşterileri bulur", "SMS metnini senin yerine yazar", "Kampanyadan gelen ciroyu gösterir"],
    visual: "sms",
  },
  {
    id: "qr",
    t: "QR menü ve paket kartı",
    d: "Platformdan gelen her pakete bir kart koy. Müşteri QR'ı okutur, bir sonraki siparişi senden verir.",
    pts: ["Baskıya hazır QR kartları", "Masaya QR menü", "Hangi kanaldan kaç sipariş geldiğini görürsün"],
    visual: "qr",
  },
  {
    id: "musteriler",
    t: "Müşteri listesi",
    d: "Her sipariş müşteri listene eklenir. İzin verenlere kampanya gönderirsin. Liste her zaman senindir.",
    pts: ["Sipariş sayısı ve toplam harcama", "Her müşterinin kampanya izni kaydı", "Kaybolmak üzere, sadık, yeni: hazır gruplar"],
    visual: "list",
  },
];

function Frame({ children }: { children: React.ReactNode }) {
  return <div className="rounded-3xl bg-gradient-to-br from-[#16ad38] via-[#0f8f28] to-[#094413] p-6 sm:p-8">{children}</div>;
}

function QrCard() {
  // Dekoratif QR deseni (gerçek kod panelde üretilir)
  const cells = Array.from({ length: 121 }, (_, i) => ((i * 37) % 7 < 3 ? 1 : 0));
  return (
    <Frame>
      <div className="anim-floaty mx-auto max-w-xs rounded-2xl bg-white p-6 text-center shadow-xl">
        <p className="font-display text-lg font-bold">Bir sonraki siparişin bizden</p>
        <p className="text-sm text-muted">Kendi sitemizden sipariş ver, daha az öde</p>
        <div className="relative mx-auto mt-4 grid w-36 grid-cols-11 gap-0.5">
          {cells.map((c, i) => (
            <span key={i} className={`aspect-square ${c ? "bg-ink" : "bg-white"}`} />
          ))}
          <div className="anim-scan absolute inset-x-0 h-0.5 bg-accent shadow-[0_0_14px_3px_rgba(22,173,56,0.6)]" />
        </div>
        <p className="mt-4 rounded-full bg-accent/15 py-2 text-sm font-bold text-brand">QR&apos;ı okut, %10 indirim</p>
      </div>
    </Frame>
  );
}

function CustomerList() {
  const rows = [
    ["Ayşe Y.", "14 sipariş", "4.120 ₺", "Sadık"],
    ["Mehmet K.", "6 sipariş", "1.890 ₺", "Kaybolmak üzere"],
    ["Zeynep A.", "1 sipariş", "310 ₺", "Yeni"],
    ["Can D.", "9 sipariş", "2.760 ₺", "Sadık"],
  ];
  return (
    <Frame>
      <div className="overflow-hidden rounded-2xl bg-white text-sm">
        <p className="border-b border-line px-4 py-3 font-display font-bold">Müşteriler · 412</p>
        {rows.map(([n, o, t, g], i) => (
          <Reveal key={n} delay={i * 120}>
            <div className="grid grid-cols-[1fr_auto] gap-1 border-b border-line px-4 py-2.5 sm:grid-cols-4">
              <span className="font-semibold">{n}</span>
              <span className="text-muted">{o}</span>
              <span className="hidden sm:block">{t}</span>
              <span className="hidden text-xs font-semibold text-brand sm:block">{g}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </Frame>
  );
}

function VisualFor({ v }: { v: Visual }) {
  switch (v) {
    case "phone": return <HeroPhone />;
    case "search": return <div className="rounded-3xl bg-gradient-to-br from-[#eafbe9] to-white p-6 ring-1 ring-line sm:p-10"><SearchRank /></div>;
    case "scan": return <MenuScan />;
    case "panel": return <LiveOrders />;
    case "sms": return <AiSms />;
    case "qr": return <QrCard />;
    case "list": return <CustomerList />;
  }
}

export default function Urun() {
  return (
    <>
      <PageHero
        eyebrow="Ürün"
        title="Doğrudan sipariş için tek panel."
        sub="Site, sipariş, müşteri ve kampanya. Hepsi bir arada, hepsi senin adınla."
      />
      {SECTIONS.map((s, i) => (
        <section key={s.id} id={s.id} className={`scroll-mt-16 ${i % 2 === 0 ? "bg-bg" : "bg-white"}`}>
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 lg:grid-cols-2">
            <Reveal className={i % 2 === 1 ? "lg:order-2" : ""}>
              <h2 className="font-display text-[28px] leading-[1.1] font-medium tracking-[-0.03em] sm:text-[40px]">{s.t}</h2>
              <p className="mt-4 text-lg text-muted">{s.d}</p>
              <ul className="mt-6 space-y-3">
                {s.pts.map((p) => (
                  <li key={p} className="flex gap-3"><Check />{p}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120} className={i % 2 === 1 ? "lg:order-1" : ""}>
              <VisualFor v={s.visual} />
            </Reveal>
          </div>
        </section>
      ))}
      <FinalCta />
    </>
  );
}
