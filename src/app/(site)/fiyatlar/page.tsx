import type { Metadata } from "next";
import Link from "next/link";
import { Check, FinalCta, PageHero } from "@/components/site/Blocks";

export const metadata: Metadata = { title: "Fiyatlar · SiparişAI" };

const INCLUDED = [
  "Kendi sipariş siten ve alan adı bağlama",
  "Yapay zeka ile menü kurulumu",
  "Canlı sipariş paneli",
  "Müşteri listesi ve kampanya izni kaydı",
  "Yapay zekalı SMS kampanyaları",
  "QR menü ve paket kartları",
  "Sipariş başına 0 komisyon",
];

export default function Fiyatlar() {
  return (
    <>
      <PageHero
        eyebrow="Fiyatlar"
        title="Sabit ücret. Sipariş başına komisyon yok."
        sub="Ne kadar çok sipariş alırsan, o kadar çok kazanırsın. Platformların tersine."
      />
      <section className="mx-auto grid max-w-5xl gap-6 px-4 pb-20 md:grid-cols-2">
        <div className="rounded-3xl bg-brand p-8 text-white">
          <p className="text-sm font-semibold text-accent-soft">Pilot programı</p>
          <p className="mt-2 font-display text-5xl font-bold">Ücretsiz</p>
          <p className="mt-3 text-white/75">
            İlk pilot restoranlarımızla birlikte büyüyoruz. Kurulumu biz yapıyoruz, sen sadece sipariş alıyorsun.
          </p>
          <Link href="/giris?kayit=1" className="btn mt-6 rounded-full bg-accent px-6 py-3 text-white hover:brightness-110">
            Pilot restoran ol
          </Link>
        </div>
        <div className="rounded-3xl p-8 ring-1 ring-line">
          <p className="text-sm font-semibold text-muted">Pakete dahil</p>
          <ul className="mt-4 space-y-3">
            {INCLUDED.map((x) => (
              <li key={x} className="flex gap-3"><Check />{x}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">Taahhüt yok. İstediğin an ayrılırsın, müşteri listen seninle gelir.</p>
        </div>
      </section>
      <FinalCta />
    </>
  );
}
