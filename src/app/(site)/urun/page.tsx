import type { Metadata } from "next";
import { Check, FinalCta, PageHero } from "@/components/site/Blocks";
import { PanelMockup, PhoneMockup } from "@/components/site/Mockups";

export const metadata: Metadata = { title: "Ürün · SiparişAI" };

const SECTIONS = [
  {
    id: "siparis-sitesi",
    t: "Kendi sipariş siten",
    d: "Müşterin seni Google'da arar, senin sitene gelir, senden sipariş verir. Arada kimse yok.",
    pts: ["Fotoğraflı menü ve ürün detayı", "Paket ve gel-al sipariş", "Sitene özel indirimle platformdan daha ucuz", "Kendi alan adın veya ücretsiz adres"],
    visual: "phone",
  },
  {
    id: "panel",
    t: "Canlı sipariş paneli",
    d: "Sipariş düştüğü an tablet veya telefonunda görürsün. Durumu tek dokunuşla güncellersin.",
    pts: ["Anlık sipariş bildirimi", "Hazırlanıyor, yolda, teslim edildi", "Günlük ve haftalık ciro özeti", "Komisyondan ne kadar tasarruf ettiğin"],
    visual: "panel",
  },
  {
    id: "kampanya",
    t: "Yapay zekalı kampanyalar",
    d: "Yapay zeka müşterilerini gruplar ve her gruba doğru mesajı yazar. Sen sadece onaylarsın.",
    visual: "sms",
    pts: ["Kaybolmak üzere olan müşterileri bulur", "Sadık müşteriye teşekkür, yeni müşteriye hoş geldin", "SMS metnini senin yerine yazar", "Kampanyadan gelen ciroyu gösterir"],
  },
  {
    id: "qr",
    t: "QR menü ve paket kartı",
    d: "Platformdan gelen her pakete bir kart koy. Müşteri QR'ı okutur, bir sonraki siparişi senden verir.",
    visual: "qr",
    pts: ["Baskıya hazır QR kartları", "Masaya QR menü", "Hangi kanaldan kaç sipariş geldiğini görürsün"],
  },
  {
    id: "musteriler",
    t: "Müşteri listesi",
    d: "Her sipariş müşteri listene eklenir. İzin verenlere kampanya gönderirsin. Liste her zaman senindir.",
    visual: "list",
    pts: ["Sipariş sayısı ve toplam harcama", "Her müşterinin kampanya izni kaydı", "Kaybolmak üzere, sadık, yeni: hazır gruplar"],
  },
];

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#16ad38] via-[#0f8f28] to-[#094413] p-6 sm:p-8">{children}</div>
  );
}

function SmsCard() {
  return (
    <Frame>
      <p className="text-sm text-accent-soft">Yapay zeka önerisi</p>
      <p className="mt-1 font-display text-2xl font-bold text-white">34 müşteri 30 gündür gelmedi</p>
      <div className="mt-5 rounded-2xl bg-white p-4">
        <p className="text-xs text-muted">Hazır mesaj</p>
        <p className="mt-1 text-sm">
          Ayşe Hanım, sizi özledik! Bu hafta kervanpide.com&apos;dan siparişinize %15 indirim. Kod: GERIDON
        </p>
        <span className="btn-primary mt-4 rounded-full text-xs">34 kişiye gönder</span>
      </div>
    </Frame>
  );
}

function QrCard() {
  // Dekoratif QR deseni (gerçek kod panelde üretilir)
  const cells = Array.from({ length: 121 }, (_, i) => ((i * 37) % 7 < 3 ? 1 : 0));
  return (
    <Frame>
      <div className="mx-auto max-w-xs rotate-[-2deg] rounded-2xl bg-white p-6 text-center shadow-xl">
        <p className="font-display text-lg font-bold">Kervan Pide Salonu</p>
        <p className="text-sm text-muted">Bir sonraki siparişin bizden</p>
        <div className="mx-auto mt-4 grid w-36 grid-cols-11 gap-0.5">
          {cells.map((c, i) => (
            <span key={i} className={`aspect-square ${c ? "bg-ink" : "bg-white"}`} />
          ))}
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
        {rows.map(([n, o, t, g]) => (
          <div key={n} className="grid grid-cols-[1fr_auto] gap-1 border-b border-line px-4 py-2.5 last:border-0 sm:grid-cols-4">
            <span className="font-semibold">{n}</span>
            <span className="text-muted">{o}</span>
            <span className="hidden sm:block">{t}</span>
            <span className="hidden text-xs font-semibold text-brand sm:block">{g}</span>
          </div>
        ))}
      </div>
    </Frame>
  );
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
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{s.t}</h2>
              <p className="mt-4 text-lg text-muted">{s.d}</p>
              <ul className="mt-6 space-y-3">
                {s.pts.map((p) => (
                  <li key={p} className="flex gap-3"><Check />{p}</li>
                ))}
              </ul>
            </div>
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              {s.visual === "phone" ? (
                <PhoneMockup />
              ) : s.visual === "panel" ? (
                <PanelMockup />
              ) : s.visual === "qr" ? (
                <QrCard />
              ) : s.visual === "list" ? (
                <CustomerList />
              ) : (
                <SmsCard />
              )}
            </div>
          </div>
        </section>
      ))}
      <FinalCta />
    </>
  );
}
