import type { Metadata } from "next";
import Reveal from "@/components/site/Reveal";
import { FinalCta, PageHero } from "@/components/site/Blocks";

export const metadata: Metadata = { title: "Liderlik · SiparişAI" };

// Ekip üyeleri. Fotoğraf eklemek için photo alanına /public altındaki dosya yolu yazılır.
const TEAM: { name: string; role: string; bio: string; photo?: string }[] = [
  {
    name: "Bora",
    role: "Kurucu",
    bio: "Endüstri mühendisi. Restoranların platform komisyonuna mahkum kalmadan büyümesi için SiparişAI'ı kurdu.",
  },
];

export default function Liderlik() {
  return (
    <>
      <PageHero
        eyebrow="Liderlik"
        title="Restoranlarla birlikte büyüyen küçük bir ekip."
        sub="Her pilot restoranla birebir çalışıyoruz. Ürünü sahada, mutfağın yanında geliştiriyoruz."
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {TEAM.map((m) => (
          <Reveal key={m.name}>
            <div className="rounded-3xl p-6 ring-1 ring-line">
              {m.photo ? (
                <img src={m.photo} alt={m.name} className="h-20 w-20 rounded-full object-cover" />
              ) : (
                <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[#16ad38] to-[#094413] font-display text-3xl font-bold text-white">
                  {m.name[0]}
                </span>
              )}
              <h2 className="mt-5 font-display text-xl font-semibold">{m.name}</h2>
              <p className="text-sm font-semibold text-accent">{m.role}</p>
              <p className="mt-3 text-muted">{m.bio}</p>
            </div>
          </Reveal>
        ))}
      </section>
      <FinalCta />
    </>
  );
}
