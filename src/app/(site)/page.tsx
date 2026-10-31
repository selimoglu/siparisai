import HeroProblem from "@/components/site/HeroProblem";
import Reveal from "@/components/site/Reveal";
import { BeliefCarousel, BenefitGrid, LaunchChecklist, ProofMarquee } from "@/components/site/HomeVisuals";
import { LiveOrders, MenuScan } from "@/components/site/Animations";
import { FinalCta } from "@/components/site/Blocks";

const STEPS = [
  {
    t: "Menünüzün fotoğrafını çekin.",
    d: "Yapay zeka ürünleri ve fiyatları otomatik ekler.",
    V: MenuScan,
  },
  {
    t: "Sitenizi yayına alın.",
    d: "Google'da görünür, QR kodunuz ve sipariş paneliniz hazır olur.",
    V: LaunchChecklist,
  },
  {
    t: "Komisyonsuz sipariş alın.",
    d: "Kazancın tamamı sizde kalır, kampanyalar müşterilerinize otomatik gider.",
    V: LiveOrders,
  },
];

const BELIEFS = [
  {
    t: "Rekabet ortamı adil değil.",
    d: "Büyük zincirlerin kendi uygulaması, reklam bütçesi ve yazılım ekibi var. Mahalle restoranı ise aynı müşteri için platforma komisyon ödüyor. Bu farkı kapatmak için buradayız.",
  },
  {
    t: "Bütün işletmeler yapay zekadan yararlanmalı.",
    d: "Yapay zeka sadece büyük şirketlerin işi değil. Menüyü okuyan, siteyi kuran, müşteriye mesajı yazan bir asistan her restoranın hakkı.",
  },
  {
    t: "Önceliğimiz her şeyden önce sizin kârınızı artırmak.",
    d: "Gösterişli özellikler değil, sonuç. Yaptığımız her şeyi tek soruyla ölçüyoruz: Bu, restoranın cebine daha fazla para bırakıyor mu?",
  },
];

function SearchPill({ className = "" }: { className?: string }) {
  return (
    <form
      action="/giris"
      className={`items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-[0_12px_32px_-12px_rgba(0,0,0,0.25)] ring-1 ring-line ${className}`}
    >
      <input type="hidden" name="kayit" value="1" />
      <input
        name="restoran"
        placeholder="Restoranınızın adı"
        aria-label="Restoranınızın adı"
        className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted"
      />
      <button
        type="submit"
        aria-label="Sitemi kur"
        className="flex shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 py-3 text-[15px] font-bold text-white transition hover:bg-[#0b5a19] sm:px-5"
      >
        <span className="hidden sm:inline">Sitemi kur</span>
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
          <path d="M9 15V3M4 8l5-5 5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </form>
  );
}

export default function Home() {
  return (
    <>
      {/* 1. Owner düzeni: beyaz zemin, ortalı başlık, yeşil panele taşan telefon. Mobilde arama kutusu telefonun altında yapışık. */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-4xl px-4 pt-8 text-center sm:pt-16">
          <p className="anim-rise text-[15px] text-muted">
            <span className="font-bold text-ink">%0</span> komisyon · Yapay zeka destekli
          </p>
          <h1 className="anim-rise mx-auto mt-3 max-w-3xl text-[34px] leading-[1.08] font-bold tracking-tight text-balance text-ink sm:text-[54px]">
            Restoranınıza sıfır komisyonlu kendi sipariş sitenizi kurun.
          </h1>
          <p
            className="anim-rise mx-auto mt-5 hidden max-w-2xl text-lg leading-relaxed text-muted sm:block"
            style={{ animationDelay: "100ms" }}
          >
            Aracı platformlara devasa komisyonlar vermekten kurtulun. Yapay zeka destekli akıllı web siteniz ve otopilot
            pazarlama sisteminizle kendi müdavimlerinizi yaratın.
          </p>
          <SearchPill className="anim-rise mx-auto mt-8 hidden max-w-[460px] sm:flex" />
        </div>
        <div className="anim-rise mt-8 px-3 sm:mt-14 sm:px-6" style={{ animationDelay: "200ms" }}>
          <HeroProblem />
        </div>
        <div className="sticky bottom-3 z-20 -mt-24 px-4 pb-2 sm:hidden">
          <SearchPill className="flex" />
        </div>
      </section>

      {/* 2. Dört fayda (mobilde yana kaydırmalı) */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-[28px] leading-[1.1] font-bold tracking-tight text-balance sm:text-[44px]">
              Daha fazla Google trafiği, daha fazla çevrimiçi sipariş, daha fazla tekrarlayan müşteri.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={120} className="mt-10 sm:mt-12">
          <BenefitGrid />
        </Reveal>
      </section>

      {/* 3. Empati + örnek hesaplar */}
      <section className="overflow-hidden bg-white pb-16 sm:pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-6">
              <h2 className="text-[28px] leading-[1.1] font-bold tracking-tight text-balance sm:text-[44px]">
                Bir restoran işletmenin ne kadar zor olduğunu biliyoruz.
              </h2>
              <p className="text-[16px] text-muted sm:text-lg">
                Siz de komisyon ödemeden satışlarını artıran firmalardan biri olun.
              </p>
            </div>
          </Reveal>
        </div>
        <div className="mt-10 sm:mt-12">
          <ProofMarquee />
        </div>
        <p className="mx-auto mt-6 max-w-6xl px-4 text-xs text-muted">
          Örnek hesaplar %20 platform komisyonu ve belirtilen ortalama sepetle yapılmıştır. Pilot restoranlarımızın sonuçlarını burada paylaşacağız.
        </p>
      </section>

      {/* 4. Büyük markaların sistemi, 3 adım alt alta (beyaz zemin, eşit boyutlu görseller) */}
      <section className="border-t border-line bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <Reveal>
            <h2 className="max-w-2xl text-[26px] leading-[1.1] font-bold tracking-tight text-balance sm:text-[36px]">
              Büyük markaların kurduğu çevrimiçi sipariş sistemiyle satışlarınızı artırın.
            </h2>
          </Reveal>
          <ol className="relative mt-10 space-y-12 sm:mt-12 sm:space-y-14">
            <div className="absolute top-2 bottom-2 left-[17px] w-px bg-gradient-to-b from-accent via-accent/30 to-transparent" />
            {STEPS.map(({ t, d, V }, i) => (
              <li key={t} className="relative grid gap-6 pl-12 sm:pl-16 lg:grid-cols-[1fr_440px] lg:items-center lg:gap-10">
                <span className="absolute top-0 left-0 grid h-9 w-9 place-items-center rounded-full bg-accent text-base font-bold text-white shadow-[0_0_0_6px_rgba(22,173,56,0.12)] lg:top-1/2 lg:-translate-y-1/2">
                  {i + 1}
                </span>
                <Reveal>
                  <h3 className="text-[20px] font-bold tracking-tight sm:text-2xl">{t}</h3>
                  <p className="mt-2 max-w-sm text-[15px] text-muted">{d}</p>
                </Reveal>
                <Reveal delay={120}>
                  <div className="h-[300px] w-full max-w-[440px] [&>*]:h-full">
                    <V />
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Üç ilke: krem zemin, beyaz çerçeveli kartlar, yana kaydırmalı */}
      <section className="bg-[#f8f4ee] py-12 sm:py-16">
        <BeliefCarousel items={BELIEFS} />
      </section>

      {/* 6. Kapanış */}
      <FinalCta />
    </>
  );
}
