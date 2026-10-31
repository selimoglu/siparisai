"use client";

import { useState } from "react";

const TOPICS: { cat: string; items: [string, string][] }[] = [
  {
    cat: "Başlarken",
    items: [
      ["Hesabımı nasıl açarım?", "Ana sayfadaki 'Ücretsiz başla' butonuna bas, e-posta ve şifreni gir. Ardından kurulum sihirbazı restoranının bilgilerini sorar."],
      ["Menümü nasıl eklerim?", "Panelde Menü sayfasından menünün fotoğrafını yükle. Yapay zeka ürünleri ve fiyatları okur, sen kontrol edip kaydedersin. İstersen elle de ekleyebilirsin."],
      ["Sitemi nasıl yayınlarım?", "Ayarlar sayfasında 'Siteyi yayınla' butonuna bas. Siten hemen açılır, adresini müşterilerinle paylaşabilirsin."],
    ],
  },
  {
    cat: "Siparişler",
    items: [
      ["Yeni sipariş geldiğini nasıl anlarım?", "Panelde Siparişler sayfası açıkken yeni siparişler anında ekrana düşer. Sayfayı tablet veya telefonda açık bırakman yeterli."],
      ["Sipariş durumunu nasıl değiştiririm?", "Siparişin üzerindeki butonlarla Hazırlanıyor, Yolda veya Teslim edildi olarak işaretleyebilirsin."],
      ["Restoranı geçici olarak kapatabilir miyim?", "Evet. Ayarlar'dan 'Şu an sipariş alıyorum' seçeneğini kapattığında site açık kalır ama sipariş alınmaz."],
    ],
  },
  {
    cat: "Kampanyalar",
    items: [
      ["Kimlere SMS gönderebilirim?", "Sadece sipariş verirken kampanya iznini onaylayan müşterilere. Panel bunu otomatik takip eder."],
      ["Mesajı kim yazıyor?", "İstersen yapay zeka yazar, istersen sen yazarsın. Göndermeden önce her zaman sen onaylarsın."],
    ],
  },
  {
    cat: "Hesap ve ödeme",
    items: [
      ["Ücret ne kadar?", "Pilot programındaki restoranlar için ücretsiz. Sipariş başına komisyon hiçbir zaman yok."],
      ["Kendi alan adımı bağlayabilir miyim?", "Evet. Ayarlar'da alan adını yaz, ardından alan adı firmanda bir yönlendirme kaydı eklemen yeterli. Biz yardımcı oluruz."],
      ["Müşteri listem kime ait?", "Sana. Liste senin restoranına aittir ve başka hiçbir restoranla paylaşılmaz."],
    ],
  },
];

export default function HelpCenter() {
  const [q, setQ] = useState("");
  const query = q.trim().toLocaleLowerCase("tr-TR");
  const filtered = TOPICS.map((t) => ({
    ...t,
    items: t.items.filter(([a, b]) => !query || (a + " " + b).toLocaleLowerCase("tr-TR").includes(query)),
  })).filter((t) => t.items.length);

  return (
    <div className="mt-10">
      <div className="mx-auto flex max-w-xl items-center gap-3 rounded-full border border-line bg-white px-5 py-3.5 shadow-lg shadow-black/5">
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
          <circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12.5 12.5 16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Bir soru ara: menü, sipariş, SMS…"
          aria-label="Destek makalelerinde ara"
          className="w-full bg-transparent outline-none"
        />
      </div>

      <div className="mt-12 space-y-10">
        {filtered.map((t) => (
          <div key={t.cat}>
            <h2 className="font-display text-xl font-bold">{t.cat}</h2>
            <div className="mt-4 divide-y divide-line rounded-3xl bg-white ring-1 ring-line">
              {t.items.map(([a, b]) => (
                <details key={a} className="group px-6 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                    {a}
                    <span className="text-xl text-muted transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 text-muted">{b}</p>
                </details>
              ))}
            </div>
          </div>
        ))}
        {!filtered.length && <p className="text-center text-muted">Sonuç bulunamadı. Başka bir kelime dene.</p>}
      </div>
    </div>
  );
}
