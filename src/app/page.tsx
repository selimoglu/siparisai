import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:py-16">
      <nav className="mb-16 flex items-center justify-between">
        <span className="font-display text-xl font-bold">
          Sipariş<span className="text-accent">AI</span>
        </span>
        <Link href="/giris" className="btn-ghost">Giriş yap</Link>
      </nav>
      <section className="max-w-2xl">
        <p className="mb-3 text-sm font-semibold text-brand">Restoranlar için</p>
        <h1 className="font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Platforma komisyon ödemeden kendi müşterinden sipariş al.
        </h1>
        <p className="mt-5 text-lg text-muted">
          Menünün fotoğrafını çek, 10 dakikada sipariş siten hazır. Yapay zeka gelmeyen müşterine
          kendisi mesaj atar, onu geri getirir.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/giris?kayit=1" className="btn-dark px-6 py-3 text-base">Ücretsiz başla</Link>
          <Link href="/giris" className="btn-primary px-6 py-3 text-base">Panele gir</Link>
        </div>
      </section>
      <section className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-[#16ad38] via-[#0f8f28] to-[#094413] p-8 text-white sm:p-12">
        <p className="text-sm font-semibold text-accent-soft">Platform siparişlerinde</p>
        <p className="mt-2 font-display text-4xl font-bold sm:text-5xl">Her siparişte %18–22 komisyon</p>
        <p className="mt-3 max-w-xl text-white/80">
          Müşterini kendi sitene taşı, bu para cebinde kalsın. Doğrudan gelen her sipariş senin.
        </p>
      </section>
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          ["Komisyonsuz sipariş", "Kendi adınla site. Müşteri sana sipariş verir, %20 komisyon cebinde kalır."],
          ["Müşteri listesi", "Her siparişte müşteri ve kampanya izni kaydedilir. Liste senin olur."],
          ["Yapay zekalı kampanya", "Kime, ne zaman, ne yazılacağını yapay zeka bulur. Sonucu liraya çevirip gösterir."],
        ].map(([t, d]) => (
          <div key={t} className="card">
            <h3 className="font-display text-lg font-semibold">{t}</h3>
            <p className="mt-2 text-sm text-muted">{d}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
