import Link from "next/link";
import Calculator from "@/components/site/Calculator";
import { Check, Cross, Ctas, Eyebrow, FinalCta, SectionHead } from "@/components/site/Blocks";
import { PanelMockup, PhoneMockup } from "@/components/site/Mockups";

const TRUST = ["Sipariş başına 0 komisyon", "10 dakikada kurulum", "Taahhüt yok", "Müşteri listesi senin"];

const PROBLEMS = [
  {
    t: "Her siparişte %18–22 komisyon",
    d: "Yemeği sen yapıyorsun, kuryeyi sen gönderiyorsun. Kârın büyük kısmı yine platforma gidiyor.",
  },
  {
    t: "Müşterini tanımıyorsun",
    d: "Sana 20 kez sipariş veren müşterinin adını, numarasını bilmiyorsun. Ona tekrar ulaşamıyorsun.",
  },
  {
    t: "Görünmek için reklam parası",
    d: "Listede üstte çıkmak için ayrıca reklam ödüyorsun. Müşteri bir sonraki siparişte rakibine geçiyor.",
  },
];

const STEPS = [
  { n: "1", t: "Ücretsiz kaydol", d: "Restoranının adını, adresini ve çalışma saatlerini gir. Kart bilgisi istemiyoruz." },
  { n: "2", t: "Menünün fotoğrafını yükle", d: "Yapay zeka menünü okur, ürünleri ve fiyatları sitene dizer. Siten 10 dakikada yayında." },
  { n: "3", t: "Müşterini kendi sitene taşı", d: "Paketlere QR kart koy. Gelen her siparişte müşteri listen büyür, yapay zeka onu geri getirir." },
];

const FEATURES = [
  { id: "siparis-sitesi", t: "Kendi sipariş siten", d: "Restoranının adıyla, fotoğraflı menüyle, telefonda kusursuz açılan bir site. Google'da senin adınla çıkar." },
  { id: "panel", t: "Canlı sipariş paneli", d: "Sipariş düştüğü an ekranında. Hazırlanıyor, yolda, teslim edildi: tek dokunuşla." },
  { id: "kampanya", t: "Yapay zekalı SMS kampanyası", d: "Kime, ne zaman, ne yazılacağını yapay zeka bulur. Uzun süredir gelmeyen müşteri geri döner." },
  { id: "qr", t: "QR menü ve paket kartı", d: "Platformdan gelen müşteriye paketinde kart gider. Bir sonraki siparişi senden, indirimli verir." },
];

const COMPARE: [string, string][] = [
  ["Her siparişte %18–22 komisyon", "Sipariş başına komisyon yok"],
  ["Müşteri platformun", "Müşteri listesi senin"],
  ["Platformun markası öne çıkar", "Kendi adınla, kendi siten"],
  ["Rakiplerle aynı listede", "Sadece senin menün"],
  ["Müşteriye ulaşamazsın", "Yapay zeka müşterini geri getirir"],
];

const FAQ = [
  ["Platformlardan çıkmam gerekiyor mu?", "Hayır. Platformlarda kalmaya devam et. SiparişAI, müdavim müşterilerini komisyonsuz kendi sitene taşımana yardım eder."],
  ["Teknik bilgi gerekiyor mu?", "Hayır. Menünün fotoğrafını yüklemen yeterli. Siteyi, menüyü ve QR kartlarını biz hazırlarız."],
  ["Kuryem yoksa ne olacak?", "Gel-al siparişi açabilirsin. En iyi sonucu kendi kuryesi olan restoranlar alıyor."],
  ["Ödeme nasıl alınıyor?", "Şu an kapıda nakit veya kartla ödeme var. Online kart ödemesi yakında ekleniyor."],
  ["Kendi alan adımı kullanabilir miyim?", "Evet. Örneğin kervanpide.com adresini sitene bağlayabiliriz."],
];

export default function Home() {
  return (
    <>
      {/* 1. Hero: kahraman ve istediği */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-16 sm:pt-20 lg:grid-cols-[1.1fr_1fr] lg:pb-24">
          <div>
            <Eyebrow>Restoranlar için</Eyebrow>
            <h1 className="font-display text-5xl leading-[1.02] font-bold tracking-tight sm:text-7xl">
              Komisyonsuz sipariş, sadık müşteri.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted sm:text-xl">
              Kendi sipariş siten 10 dakikada hazır. Yapay zeka müşterini geri getirir, kazandığın para cebinde kalır.
            </p>
            <div className="mt-8">
              <Ctas />
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {TRUST.map((t) => (
                <li key={t} className="flex items-center gap-2"><Check />{t}</li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-x-6 top-10 bottom-0 rounded-[48px] bg-gradient-to-br from-[#16ad38] via-[#0f8f28] to-[#094413]" />
            <div className="absolute bottom-24 -left-2 z-10 hidden -rotate-3 rounded-2xl bg-white px-4 py-3 shadow-xl sm:block">
              <p className="text-xs text-muted">Yeni sipariş</p>
              <p className="font-display text-lg font-bold">#1042 · 333 ₺</p>
              <p className="text-xs font-semibold text-accent">Komisyon: 0 ₺</p>
            </div>
            <PhoneMockup className="relative pt-4" />
          </div>
        </div>
      </section>

      {/* 2. Problem */}
      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <SectionHead
            eyebrow="Sorun"
            title="Sen çalışıyorsun, platform kazanıyor."
            sub="Müşteriyi sen kazandın. Ama her siparişte ona ulaşmak için birine para ödüyorsun."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {PROBLEMS.map((p) => (
              <div key={p.t} className="rounded-2xl bg-white p-6 ring-1 ring-line">
                <h3 className="font-display text-xl font-bold">{p.t}</h3>
                <p className="mt-2 text-muted">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Rehber: empati + otorite */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 lg:grid-cols-2">
        <div>
          <Eyebrow>Neden buradayız</Eyebrow>
          <h2 className="font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
            Emeğinle kazandığın müşteri, senin olmalı.
          </h2>
          <p className="mt-5 text-lg text-muted">
            Bir restoranın kârının komisyona gitmesini haksız buluyoruz. SiparişAI&apos;ı, ABD&apos;de binlerce restoranın
            kullandığı doğrudan sipariş modelini Türkiye&apos;deki esnafa getirmek için kurduk.
          </p>
          <p className="mt-4 text-lg text-muted">
            Sen yemeğine odaklan. Siteyi, menüyü, kampanyaları ve müşteri listesini biz yönetelim.
          </p>
        </div>
        <PanelMockup />
      </section>

      {/* 4. Plan */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <p className="mb-3 text-sm font-semibold tracking-wide text-accent-soft uppercase">Nasıl çalışır</p>
          <h2 className="max-w-2xl font-display text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
            Üç adımda kendi siparişini almaya başla.
          </h2>
          <ol className="mt-12 grid gap-4 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-accent font-display text-lg font-bold">{s.n}</span>
                <h3 className="mt-4 font-display text-xl font-bold">{s.t}</h3>
                <p className="mt-2 text-white/70">{s.d}</p>
              </li>
            ))}
          </ol>
          <Link href="/giris?kayit=1" className="btn mt-10 rounded-full bg-accent px-7 py-3.5 text-base text-white hover:brightness-110">
            Ücretsiz başla
          </Link>
        </div>
      </section>

      {/* 5. Ürün */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHead
          eyebrow="Ürün"
          title="Doğrudan sipariş için ihtiyacın olan her şey."
          sub="Tek panel. Site, sipariş, müşteri ve kampanya bir arada."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <Link
              key={f.id}
              href={`/urun#${f.id}`}
              className="group rounded-2xl p-6 ring-1 ring-line transition hover:bg-bg hover:ring-accent"
            >
              <h3 className="font-display text-xl font-bold">{f.t}</h3>
              <p className="mt-2 text-muted">{f.d}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-brand group-hover:underline">Daha fazla →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Hesaplayıcı (geçiş eylemi) */}
      <section id="hesapla" className="scroll-mt-20 bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <SectionHead
            eyebrow="Komisyon hesapla"
            title="Platforma ne kadar ödüyorsun?"
            sub="Rakamlarını gir, bir yılda komisyona giden parayı gör."
          />
          <div className="mt-10">
            <Calculator />
          </div>
        </div>
      </section>

      {/* 7. Başarı ve başarısızlık */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionHead center eyebrow="Farkı gör" title="Platformda kalmak mı, kendi müşterine sahip olmak mı?" />
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-bg p-6 sm:p-8">
            <p className="font-display text-xl font-bold text-muted">Sadece platformla</p>
            <ul className="mt-5 space-y-3">
              {COMPARE.map(([a]) => (
                <li key={a} className="flex gap-3 text-muted"><Cross />{a}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-brand p-6 text-white sm:p-8">
            <p className="font-display text-xl font-bold">SiparişAI ile</p>
            <ul className="mt-5 space-y-3">
              {COMPARE.map(([, b]) => (
                <li key={b} className="flex gap-3"><Check />{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 8. SSS */}
      <section className="bg-bg">
        <div className="mx-auto max-w-3xl px-4 py-20">
          <SectionHead center eyebrow="Sık sorulanlar" title="Aklındaki sorular" />
          <div className="mt-10 divide-y divide-line rounded-2xl bg-white ring-1 ring-line">
            {FAQ.map(([q, a]) => (
              <details key={q} className="group px-6 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                  {q}
                  <span className="text-xl text-muted transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Dönüşüm + eylem çağrısı */}
      <FinalCta />
    </>
  );
}
