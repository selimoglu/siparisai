import Link from "next/link";
import HeroProblem from "@/components/site/HeroProblem";
import Reveal from "@/components/site/Reveal";
import { BenefitGrid, LaunchChecklist, ProofMarquee } from "@/components/site/HomeVisuals";
import { LiveOrders, MenuScan } from "@/components/site/Animations";
import { FinalCta } from "@/components/site/Blocks";

const STEPS = [
  { t: "Menünüzün fotoğrafını çekin.", d: "Yapay zeka ürünleri ve fiyatları otomatik ekler.", V: MenuScan },
  { t: "Sitenizi yayına alın.", d: "Google'da görünür, QR kodunuz ve sipariş paneliniz hazır olur.", V: LaunchChecklist },
  { t: "Komisyonsuz sipariş alın.", d: "Kazancın tamamı sizde kalır, kampanyalar müşterilerinize otomatik gider.", V: LiveOrders },
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

function Curves({ className = "" }: { className?: string }) {
  return (
    <svg className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <path
          key={i}
          d={`M-80 ${180 + i * 70} C 420 ${-40 + i * 80}, 980 ${620 + i * 30}, 1520 ${260 + i * 70}`}
          fill="none"
          stroke="white"
          strokeOpacity={0.09}
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* 1. Başlık, alt başlık, altında görsel */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#062e0d] via-[#094413] to-[#16ad38] text-white">
        <Curves />
        <div className="anim-glow pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(136,238,158,0.35),transparent)] blur-2xl" />
        <div className="relative mx-auto max-w-6xl px-4 pt-14 text-center sm:pt-20">
          <h1 className="anim-rise mx-auto max-w-4xl text-[2.35rem] leading-[1.04] font-bold tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Restoranınıza sıfır komisyonlu kendi sipariş sitenizi kurun.
          </h1>
          <p className="anim-rise mx-auto mt-6 max-w-2xl text-base text-white/80 sm:text-xl" style={{ animationDelay: "100ms" }}>
            Aracı platformlara devasa komisyonlar vermekten kurtulun. Yapay zeka destekli akıllı web siteniz ve otopilot
            pazarlama sisteminizle kendi müdavimlerinizi yaratın.
          </p>
          <div className="anim-rise mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: "180ms" }}>
            <Link href="/giris?kayit=1" className="btn rounded-full bg-white px-7 py-3.5 text-base text-brand hover:bg-accent-soft">
              Ücretsiz başla
            </Link>
            <Link href="/nasil-calisir" className="btn rounded-full px-7 py-3.5 text-base text-white ring-1 ring-white/40 hover:bg-white/10">
              Nasıl çalışır?
            </Link>
          </div>
        </div>
        <div className="anim-rise relative mt-12 px-4 pb-12 sm:mt-16 sm:pb-16" style={{ animationDelay: "260ms" }}>
          <HeroProblem />
        </div>
      </section>

      {/* 2. Dört fayda */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl">
              Daha fazla Google trafiği, daha fazla çevrimiçi sipariş, daha fazla tekrarlayan müşteri.
            </h2>
          </div>
        </Reveal>
        <Reveal delay={120} className="mt-12">
          <BenefitGrid />
        </Reveal>
      </section>

      {/* 3. Empati + örnek hesaplar */}
      <section className="overflow-hidden bg-[#f3f3ef] py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal>
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
              <h2 className="text-3xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl">
                Bir restoran işletmenin ne kadar zor olduğunu biliyoruz.
              </h2>
              <p className="text-lg text-muted">
                Yemek kalitesine ve operasyona odaklanırken komisyon ve satışlar arasında boğulmamalısınız.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="mt-16 flex flex-wrap items-end justify-between gap-3">
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">Birçok restoran satışlarını artırdı.</h3>
              <p className="text-sm text-muted">Kendi sitesine geçen her sipariş, komisyon kadar kâr demek.</p>
            </div>
          </Reveal>
        </div>
        <div className="mt-8">
          <ProofMarquee />
        </div>
        <p className="mx-auto mt-6 max-w-6xl px-4 text-xs text-muted">
          Örnek hesaplar %20 platform komisyonu ve belirtilen ortalama sepetle yapılmıştır. Pilot restoranlarımızın sonuçlarını burada paylaşacağız.
        </p>
      </section>

      {/* 4. Büyük markaların sistemi, 3 adım alt alta */}
      <section className="relative overflow-hidden bg-[#062e0d] text-white">
        <Curves />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:py-28">
          <Reveal>
            <h2 className="max-w-3xl text-3xl leading-[1.08] font-bold tracking-tight text-balance sm:text-5xl">
              Büyük markaların kurduğu çevrimiçi sipariş sistemiyle satışlarınızı artırın.
            </h2>
          </Reveal>
          <ol className="relative mt-14 space-y-14 sm:space-y-20">
            <div className="absolute top-2 bottom-2 left-[19px] w-px bg-gradient-to-b from-accent via-accent/40 to-transparent sm:left-[23px]" />
            {STEPS.map(({ t, d, V }, i) => (
              <li key={t} className="relative grid gap-8 pl-14 sm:pl-20 lg:grid-cols-2 lg:items-start">
                <span className="absolute top-0 left-0 grid h-10 w-10 place-items-center rounded-full bg-accent text-lg font-bold shadow-[0_0_0_8px_rgba(22,173,56,0.15)] sm:h-12 sm:w-12">
                  {i + 1}
                </span>
                <Reveal className="sm:pt-1">
                  <h3 className="text-2xl font-bold tracking-tight sm:text-4xl">{t}</h3>
                  <p className="mt-3 max-w-md text-lg text-white/70">{d}</p>
                </Reveal>
                <Reveal delay={120}>
                  <V />
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Üç ilke */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <p className="text-sm font-bold tracking-wide text-accent uppercase">İnandıklarımız</p>
              <div className="mt-6 flex items-center gap-4">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#16ad38] to-[#094413] text-2xl font-bold text-white">B</span>
                <div>
                  <p className="font-bold">Bora</p>
                  <p className="text-sm text-muted">Kurucu, SiparişAI</p>
                </div>
              </div>
            </div>
          </Reveal>
          <ol className="divide-y divide-line">
            {BELIEFS.map((b, i) => (
              <Reveal key={b.t} delay={i * 100}>
                <li className="grid gap-4 py-8 first:pt-0 sm:grid-cols-[80px_1fr]">
                  <span className="bg-gradient-to-b from-[#16ad38] to-[#094413] bg-clip-text text-6xl leading-none font-bold text-transparent">{i + 1}</span>
                  <div>
                    <h3 className="text-2xl leading-tight font-bold tracking-tight sm:text-4xl">{b.t}</h3>
                    <p className="mt-3 max-w-2xl text-lg text-muted">{b.d}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* 6. Kapanış */}
      <FinalCta />
    </>
  );
}
