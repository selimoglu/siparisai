import Link from "next/link";
import Calculator from "@/components/site/Calculator";
import HeroPhone from "@/components/site/HeroPhone";
import Reveal from "@/components/site/Reveal";
import {
  AiSms, CommissionSplit, FeatureBand, LiveOrders, MenuScan, OrderToast, SearchRank,
} from "@/components/site/Animations";
import { Check, Cross, Eyebrow, FinalCta, SectionHead } from "@/components/site/Blocks";

const MENU_POINTS = [
  ["Google'da üst sıralarda çık", "Menün, saatlerin ve yorumların Google'ın anlayacağı şekilde hazırlanır. Seni arayan sana ulaşır."],
  ["Fotoğraf ve yorumla daha çok sipariş", "İştah açan fotoğraflar, gerçek müşteri yorumları ve en çok sevilenler. Sepet büyür."],
  ["Komisyonsuz doğrudan sipariş", "Müşteri senin sitenden sipariş verir. Platformun %18–22 komisyonu cebinde kalır."],
];

const STEPS = [
  { t: "Ücretsiz kaydol", d: "Restoranının adını ve adresini gir. Kart bilgisi istemiyoruz." },
  { t: "Menünün fotoğrafını çek", d: "Yapay zeka menünü okur, siten 10 dakikada yayında." },
  { t: "Müşterini sitene taşı", d: "Paketlere QR kart koy. Yapay zeka müşterini geri getirir." },
];

const COMPARE: [string, string][] = [
  ["Her siparişte %18–22 komisyon", "Sipariş başına komisyon yok"],
  ["Müşteri platformun", "Müşteri listesi senin"],
  ["Rakiplerle aynı listede", "Sadece senin menün"],
  ["Müşteriye ulaşamazsın", "Yapay zeka müşterini geri getirir"],
];

const FAQ = [
  ["Platformlardan çıkmam gerekiyor mu?", "Hayır. Platformlarda kalmaya devam et. SiparişAI, müdavimlerini komisyonsuz kendi sitene taşımana yardım eder."],
  ["Teknik bilgi gerekiyor mu?", "Hayır. Menünün fotoğrafını yüklemen yeterli. Siteyi, menüyü ve QR kartlarını biz hazırlarız."],
  ["Kuryem yoksa ne olacak?", "Gel-al siparişi açabilirsin. En iyi sonucu kendi kuryesi olan restoranlar alıyor."],
  ["Ödeme nasıl alınıyor?", "Şu an kapıda nakit veya kartla ödeme var. Online kart ödemesi yakında ekleniyor."],
  ["Kendi alan adımı kullanabilir miyim?", "Evet. Restoranının alan adını (örneğin restoraniniz.com) sitene bağlayabiliriz."],
];

export default function Home() {
  return (
    <>
      {/* 1. Hero: üstte tek cümle vaat ve buton, altında hareketli telefon */}
      <section className="relative overflow-hidden bg-white">
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
        <div className="anim-glow pointer-events-none absolute top-[420px] left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(22,173,56,0.35),transparent)] blur-2xl" />
        <div className="relative mx-auto max-w-6xl px-4 pt-14 text-center sm:pt-20">
          <p className="anim-rise mx-auto inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-ink backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Restoranlar için yapay zekalı sipariş platformu
          </p>
          <h1
            className="anim-rise mx-auto mt-6 max-w-5xl text-balance font-display text-[2.6rem] leading-[1.02] font-bold tracking-tight sm:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            Komisyon ödemeden <span className="bg-gradient-to-r from-[#16ad38] to-[#094413] bg-clip-text text-transparent">kendi müşterinden</span> sipariş al.
          </h1>
          <div className="anim-rise mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: "160ms" }}>
            <Link href="/giris?kayit=1" className="btn-primary rounded-full px-8 py-4 text-base">Ücretsiz başla</Link>
            <Link href="/#hesapla" className="btn-ghost rounded-full px-8 py-4 text-base">Komisyonunu hesapla</Link>
          </div>
        </div>

        <div className="relative mx-auto mt-14 max-w-6xl px-4 pb-20">
          <div className="anim-rise relative flex justify-center" style={{ animationDelay: "240ms" }}>
            <div className="absolute top-24 left-0 hidden lg:block">
              <div className="anim-floaty">
                <SearchRank compact />
              </div>
            </div>
            <HeroPhone />
            <div className="absolute top-16 right-4 hidden lg:block">
              <OrderToast />
            </div>
            <div className="absolute right-0 bottom-24 hidden w-[250px] lg:block">
              <div className="anim-floaty rounded-2xl bg-ink p-4 text-white shadow-xl" style={{ animationDelay: "1.2s" }}>
                <p className="text-[11px] text-accent-soft">Yapay zeka</p>
                <p className="mt-1 text-sm">12 müşterin 30 gündür gelmedi. Onlara %15 indirim gönderelim mi?</p>
              </div>
            </div>
          </div>
          {/* Telefonda Google kartı telefonun altında */}
          <div className="mt-8 flex justify-center lg:hidden">
            <SearchRank compact />
          </div>
        </div>
      </section>

      <FeatureBand />

      {/* 2. Sorun */}
      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <Reveal>
            <SectionHead
              eyebrow="Sorun"
              title="Sen çalışıyorsun, platform kazanıyor."
              sub="Yemeği sen yapıyorsun, kuryeyi sen gönderiyorsun. Ama 500 liralık siparişin 100 lirası platforma gidiyor."
            />
          </Reveal>
          <Reveal delay={100} className="mt-12">
            <CommissionSplit />
          </Reveal>
        </div>
      </section>

      {/* 3. Etkileşimli menü (Popmenu tarzı) */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 lg:grid-cols-2">
        <Reveal>
          <Eyebrow>Sipariş sitesi</Eyebrow>
          <h2 className="font-display text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
            Müşteri seni arar, seni bulur, senden sipariş verir.
          </h2>
          <ul className="mt-8 space-y-5">
            {MENU_POINTS.map(([t, d]) => (
              <li key={t} className="flex gap-3">
                <Check />
                <div>
                  <p className="font-display text-lg font-bold">{t}</p>
                  <p className="text-muted">{d}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <div className="rounded-[32px] bg-gradient-to-br from-[#eafbe9] to-white p-6 ring-1 ring-line sm:p-10">
            <SearchRank />
          </div>
        </Reveal>
      </section>

      {/* 4. Yapay zeka */}
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative mx-auto max-w-6xl px-4 py-24">
          <Reveal>
            <p className="mb-3 text-sm font-semibold tracking-wide text-accent-soft uppercase">Yapay zeka</p>
            <h2 className="max-w-2xl font-display text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
              Yapay zeka çalışır, müşterin geri gelir.
            </h2>
            <p className="mt-4 max-w-xl text-lg text-white/70">
              Menünü fotoğraftan okur, siteni kurar. Gelmeyen müşteriyi bulur, ona ne yazacağını bilir.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <Reveal>
              <p className="mb-3 text-sm font-semibold text-white/70">Menünün fotoğrafından 10 dakikada site</p>
              <MenuScan />
            </Reveal>
            <Reveal delay={120}>
              <p className="mb-3 text-sm font-semibold text-white/70">Kendi kendine çalışan SMS kampanyası</p>
              <AiSms />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. Panel */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <Eyebrow>Canlı panel</Eyebrow>
          <h2 className="font-display text-3xl leading-tight font-bold tracking-tight sm:text-5xl">
            Neyin işe yaradığını anında gör.
          </h2>
          <p className="mt-4 text-lg text-muted">
            Siparişler düştüğü an ekranında. Hangi müşterinin QR karttan, Google&apos;dan ya da kampanyadan geldiğini, cebinde ne kadar komisyon kaldığını görürsün.
          </p>
        </Reveal>
        <Reveal delay={120}>
          <LiveOrders />
        </Reveal>
      </section>

      {/* 6. Plan */}
      <section className="bg-bg">
        <div className="mx-auto max-w-6xl px-4 py-24">
          <Reveal>
            <SectionHead center eyebrow="Nasıl çalışır?" title="Üç adımda kendi siparişini almaya başla." />
          </Reveal>
          <ol className="relative mt-14 grid gap-6 md:grid-cols-3">
            <div className="absolute top-6 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-accent/0 via-accent to-accent/0 md:block" />
            {STEPS.map((s, i) => (
              <Reveal key={s.t} delay={i * 150}>
                <li className="relative text-center">
                  <span className="relative mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand font-display text-lg font-bold text-white ring-8 ring-bg">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold">{s.t}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-muted">{s.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <div className="mt-12 text-center">
            <Link href="/giris?kayit=1" className="btn-primary rounded-full px-8 py-4 text-base">Ücretsiz başla</Link>
          </div>
        </div>
      </section>

      {/* 7. Hesaplayıcı */}
      <section id="hesapla" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24">
        <Reveal>
          <SectionHead eyebrow="Komisyon hesapla" title="Platforma ne kadar ödüyorsun?" sub="Rakamlarını gir, bir yılda komisyona giden parayı gör." />
        </Reveal>
        <Reveal delay={100} className="mt-10">
          <Calculator />
        </Reveal>
      </section>

      {/* 8. Fark */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <Reveal>
          <SectionHead center eyebrow="Farkı gör" title="Platformda kalmak mı, kendi müşterine sahip olmak mı?" />
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl bg-bg p-6 sm:p-8">
              <p className="font-display text-xl font-bold text-muted">Sadece platformla</p>
              <ul className="mt-5 space-y-3">
                {COMPARE.map(([a]) => (
                  <li key={a} className="flex gap-3 text-muted"><Cross />{a}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="h-full rounded-3xl bg-brand p-6 text-white sm:p-8">
              <p className="font-display text-xl font-bold">SiparişAI ile</p>
              <ul className="mt-5 space-y-3">
                {COMPARE.map(([, b]) => (
                  <li key={b} className="flex gap-3"><Check />{b}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9. SSS */}
      <section className="bg-bg">
        <div className="mx-auto max-w-3xl px-4 py-24">
          <SectionHead center eyebrow="Sık sorulanlar" title="Aklındaki sorular" />
          <div className="mt-10 divide-y divide-line rounded-3xl bg-white ring-1 ring-line">
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
          <p className="mt-6 text-center text-sm text-muted">
            Daha fazlası için <Link href="/destek" className="font-semibold text-brand underline">Destek Merkezi</Link>
          </p>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
