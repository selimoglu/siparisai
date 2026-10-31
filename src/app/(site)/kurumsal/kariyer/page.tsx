import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import { CONTACT_EMAIL } from "@/components/site/nav";
import { FinalCta, PageHero } from "@/components/site/Blocks";

export const metadata: Metadata = { title: "Kariyer · SiparişAI" };

const WHY = [
  ["Gerçek etki", "Yazdığın her satır bir restoranın kazancını doğrudan artırır."],
  ["Erken ekip", "Şirketin ilk günlerinde, kararların içinde olursun."],
  ["Sahada öğrenme", "Restoran sahipleriyle konuşur, ürünü mutfağın yanında test ederiz."],
];

export default function Kariyer() {
  return (
    <>
      <PageHero
        eyebrow="Kariyer"
        title="Restoranların geleceğini birlikte kuralım."
        sub="Şu an açık ilanımız yok. Ama restoran teknolojisine meraklıysan seni tanımak isteriz."
      />
      <section className="mx-auto grid max-w-6xl gap-4 px-4 pb-16 md:grid-cols-3">
        {WHY.map(([t, d], i) => (
          <Reveal key={t} delay={i * 120}>
            <div className="h-full rounded-3xl bg-bg p-6">
              <h2 className="font-display text-xl font-bold">{t}</h2>
              <p className="mt-2 text-muted">{d}</p>
            </div>
          </Reveal>
        ))}
      </section>
      {CONTACT_EMAIL && (
        <section className="mx-auto max-w-6xl px-4 pb-16">
          <p className="text-lg">
            Özgeçmişini ve kısa bir notunu{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-brand underline">{CONTACT_EMAIL}</a>{" "}
            adresine gönder.
          </p>
        </section>
      )}
      <FinalCta />
    </>
  );
}
