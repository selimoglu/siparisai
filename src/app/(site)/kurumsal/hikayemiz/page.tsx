import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import { FinalCta, PageHero } from "@/components/site/Blocks";

export const metadata: Metadata = { title: "Hikayemiz · SiparişAI" };

const VALUES = [
  ["Restoran önce gelir", "Her kararı tek bir soruyla veriyoruz: Bu, restoranın kazancını artırıyor mu?"],
  ["Müşteri, restoranındır", "Emekle kazanılan müşterinin bilgisi ve ilişkisi restorana aittir. Listeyi kimse elinden alamaz."],
  ["Sade ve hızlı", "Teknik bilgi gerektirmeyen, 10 dakikada kurulan, telefondan yönetilen bir ürün yapıyoruz."],
];

export default function Hikayemiz() {
  return (
    <>
      <PageHero
        eyebrow="Hikayemiz"
        title="Restoranın kazancı restoranda kalsın diye kurduk."
        sub="SiparişAI, Türkiye'deki restoranların kendi müşterisine komisyonsuz ulaşması için var."
      />
      <section className="mx-auto max-w-3xl space-y-6 px-4 pb-20 text-lg leading-relaxed text-ink/85">
        <Reveal>
          <p>
            Mahallenin pidecisi, burgercisi, kafesi yıllarca emek verip müşteri kazanıyor. Sonra o müşteri bir
            uygulamadan sipariş verdiğinde her siparişin %18–22&apos;si platforma gidiyor. Müşterinin adını bile bilmiyor,
            ona bir daha ulaşamıyor.
          </p>
        </Reveal>
        <Reveal>
          <p>
            ABD&apos;de restoranlar bu sorunu kendi sipariş siteleri ve yapay zekalı pazarlama ile çözmeye başladı.
            Biz de aynı modeli Türkiye&apos;ye, Türk restoranlarının ihtiyacına göre getiriyoruz.
          </p>
        </Reveal>
        <Reveal>
          <p>
            Hedefimiz basit: Her restoranın kendi adıyla bir sipariş sitesi, kendi müşteri listesi ve o müşteriyi
            geri getiren bir yapay zeka asistanı olsun.
          </p>
        </Reveal>
      </section>
      <section className="bg-bg">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-20 md:grid-cols-3">
          {VALUES.map(([t, d], i) => (
            <Reveal key={t} delay={i * 120}>
              <div className="h-full rounded-3xl bg-white p-6 ring-1 ring-line">
                <h2 className="font-display text-xl font-semibold">{t}</h2>
                <p className="mt-2 text-muted">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <FinalCta />
    </>
  );
}
