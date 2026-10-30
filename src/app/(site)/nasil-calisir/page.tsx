import type { Metadata } from "next";
import { FinalCta, PageHero } from "@/components/site/Blocks";
import Reveal from "@/components/site/Reveal";
import { MenuScan, AiSms } from "@/components/site/Animations";

export const metadata: Metadata = { title: "Nasıl çalışır · SiparişAI" };

const STEPS = [
  {
    t: "Ücretsiz kaydol",
    d: "E-posta ve şifreyle hesabını aç. Restoranının adını, semtini ve çalışma saatlerini gir.",
    time: "2 dakika",
  },
  {
    t: "Menünün fotoğrafını yükle",
    d: "Yapay zeka menünü okur, kategorileri, ürünleri ve fiyatları çıkarır. Ürün fotoğraflarını, logonu ve kapak görselini ekle.",
    time: "5 dakika",
  },
  {
    t: "Siteni yayınla",
    d: "Tek tuşla siten yayında. Ücretsiz adresini kullan veya kendi alan adını bağla.",
    time: "1 dakika",
  },
  {
    t: "Müşterini sitene taşı",
    d: "QR kartlarını bastır, platformdan gelen her pakete koy. Instagram ve Google profiline sitenin linkini ekle.",
    time: "İlk hafta",
  },
  {
    t: "Yapay zeka geri getirsin",
    d: "Müşteri listen büyüdükçe yapay zeka kimin uzun süredir gelmediğini bulur ve ona özel mesajı hazırlar. Sen onaylarsın.",
    time: "Her hafta",
  },
];

export default function NasilCalisir() {
  return (
    <>
      <PageHero
        eyebrow="Nasıl çalışır"
        title="10 dakikada kur, ilk haftada sipariş al."
        sub="Teknik bilgi gerekmez. Platformlardan çıkmana da gerek yok."
      />
      <section className="mx-auto max-w-3xl px-4 pb-20">
        <ol className="relative space-y-6 border-l-2 border-accent/30 pl-8">
          {STEPS.map((s, i) => (
            <li key={s.t} className="relative">
              <span className="absolute -left-[49px] grid h-8 w-8 place-items-center rounded-full bg-accent font-display font-bold text-white">
                {i + 1}
              </span>
              <Reveal delay={i * 80}>
              <div className="rounded-2xl p-6 ring-1 ring-line">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-display text-xl font-semibold">{s.t}</h2>
                  <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-brand">{s.time}</span>
                </div>
                <p className="mt-2 text-muted">{s.d}</p>
                {i === 1 && <div className="mt-5"><MenuScan /></div>}
                {i === 4 && <div className="mt-5"><AiSms /></div>}
              </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>
      <FinalCta />
    </>
  );
}
