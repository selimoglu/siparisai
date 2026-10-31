import type { Metadata } from "next";
import HelpCenter from "./HelpCenter";
import { CONTACT_EMAIL } from "@/components/site/nav";

export const metadata: Metadata = { title: "Destek Merkezi · SiparişAI" };

export default function Destek() {
  return (
    <section className="relative overflow-hidden">
      <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div className="relative mx-auto max-w-4xl px-4 py-16 sm:py-24">
        <p className="mb-3 text-center text-sm font-semibold tracking-wide text-accent uppercase">Destek Merkezi</p>
        <h1 className="text-center font-display text-[34px] font-bold tracking-tight sm:text-[52px]">Nasıl yardımcı olabiliriz?</h1>
        <HelpCenter />
        {CONTACT_EMAIL && (
          <p className="mt-12 text-center text-muted">
            Cevabını bulamadın mı? <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-brand underline">{CONTACT_EMAIL}</a>
          </p>
        )}
      </div>
    </section>
  );
}
