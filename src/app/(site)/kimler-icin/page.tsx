import type { Metadata } from "next";
import FoodArt from "@/components/site/FoodArt";
import { FinalCta, PageHero } from "@/components/site/Blocks";

export const metadata: Metadata = { title: "Kimler için · SiparişAI" };

const TYPES = [
  {
    id: "pide-kebap",
    art: "pide",
    t: "Pide ve kebap salonları",
    d: "Müdavimi çok, kuryesi kendi. Platform siparişlerinin büyük kısmı zaten tanıdık müşteriler. Onları kendi sitene taşı, komisyonu sen tut.",
  },
  {
    id: "burger-pizza",
    art: "burger",
    t: "Burger ve pizza",
    d: "Akşam ve hafta sonu yoğunluğu yüksek. Yapay zeka kampanyalarıyla sakin günleri doldur, combo menüleri öne çıkar.",
  },
  {
    id: "kafe-firin",
    art: "kunefe",
    t: "Kafe, fırın ve tatlıcılar",
    d: "Sepet küçük, sipariş sık. Gel-al siparişi ve QR menü ile sırayı kısalt, sadık müşteriye özel teklif gönder.",
  },
  {
    id: "cok-subeli",
    art: "doner",
    t: "Çok şubeli restoranlar",
    d: "Her şubeye kendi sayfası, tek müşteri listesi. Hangi şubenin hangi kanaldan sipariş aldığını tek panelde gör.",
  },
] as const;

export default function KimlerIcin() {
  return (
    <>
      <PageHero
        eyebrow="Kimler için"
        title="Kendi müşterisi olan her restoran için."
        sub="En iyi sonucu kendi kuryesi olan ve platformda düzenli satan mahalle restoranları alıyor."
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-20 md:grid-cols-2">
        {TYPES.map((x) => (
          <article key={x.id} id={x.id} className="scroll-mt-20 overflow-hidden rounded-3xl ring-1 ring-line">
            <FoodArt kind={x.art} className="h-48 w-full" />
            <div className="p-6">
              <h2 className="font-display text-2xl font-bold">{x.t}</h2>
              <p className="mt-2 text-muted">{x.d}</p>
            </div>
          </article>
        ))}
      </section>
      <FinalCta />
    </>
  );
}
