# SiparişAI

Restoranlara kendi adlarıyla komisyonsuz sipariş sitesi ve yapay zekalı pazarlama sunan SaaS.

## Neler çalışıyor

- **Kayıt ve giriş:** restoran sahibi e-posta ve şifreyle hesap açar.
- **Kurulum:** restoran bilgileri girilir, menü fotoğrafı yüklenir veya yapıştırılır. Yapay zeka (Claude) menüyü okur, sahibi düzeltip kaydeder.
- **Sipariş sitesi:** her restoran `restoran.siparisai.com` adresinde ya da kendi alan adında açılır.
  - Kategori menüsü, sepet, paket veya gel-al seçimi, kapıda ödeme.
  - Direkt sipariş indirimi ve SMS kampanya izni (İYS) kutusu.
  - Google için yapılandırılmış menü verisi (schema.org).
- **Sipariş ekranı:** yeni sipariş sesli uyarıyla anında düşer. Durum akışı: yeni → hazırlanıyor → yolda / gel-al hazır → teslim.
- **Müşteri listesi:** her siparişte müşteri kaydı otomatik oluşur. Müşteriler kitlelere ayrılır: kaybolmak üzere, sadık, yeni, doğum günü.
- **Kampanyalar:**
  - Yapay zeka seçilen kitleye SMS metni yazar.
  - SMS sadece izinli müşterilere gider.
  - Kampanya linkinden gelen siparişler sayılır ve ciro olarak gösterilir.
  - SMS hesabı bağlı değilse kampanyalar "deneme modu"nda çalışır ve SMS gönderilmez.
- **Özet:** direkt sipariş, ciro, ödenmeyen platform komisyonu ve kampanyadan gelen ciro.
- **QR kart:** platform paketlerine konacak, indirimli ve takipli QR kod.

Fiyatlar her zaman veritabanındaki menüden yeniden hesaplanır (`place_order` fonksiyonu). Tarayıcıdan gelen fiyata güvenilmez. Her restoran yalnızca kendi verisini görür (Supabase RLS).

## Teknoloji

- **Uygulama:** Next.js 16 (App Router) ve Tailwind 4
- **Veritabanı, giriş ve canlı bağlantı:** Supabase (Postgres, Auth, Realtime)
- **Yapay zeka:** Anthropic Claude API
- **SMS:** Netgsm (boşsa deneme modu)
- **Yayın:** Vercel

## Yerelde çalıştırma

```bash
npm install
npx supabase start        # Docker gerekir; şemayı otomatik kurar
cp .env.example .env.local # supabase start çıktısındaki URL ve anon key'i yaz
npm run dev
```

## Canlıya alma (adım adım)

1. **Supabase:** supabase.com'da proje aç. SQL Editor'de `supabase/migrations/0001_init.sql` dosyasını çalıştır. Authentication → URL Configuration bölümünde Site URL'yi `https://siparisai.com` yap.
2. **Vercel:** Bu repoyu Vercel'e bağla. Environment Variables bölümüne `.env.example` içindeki değerleri gir.
3. **Alan adı:** Vercel'de `siparisai.com` ve `*.siparisai.com` (wildcard) ekle. Wildcard için alan adının DNS'i Vercel'e yönlendirilmeli (nameserver).
4. **Yapay zeka:** console.anthropic.com'dan API anahtarı al, `ANTHROPIC_API_KEY` olarak gir.
5. **SMS:** Netgsm hesabı, onaylı SMS başlığı ve İYS kaydı hazır olunca `NETGSM_*` değişkenlerini gir. Netgsm API alanlarını canlıdan önce güncel dokümanla doğrula (`src/lib/sms.ts`).

## Bilinen eksikler (sıradaki işler)

- Online kartla ödeme (iyzico/PayTR, şirket başvurusu gerekiyor)
- Sipariş formuna hız sınırı ve bot koruması (ör. Cloudflare Turnstile)
- Otomatik kampanyalar (şu an kampanyayı sahibi başlatıyor; zamanlayıcı eklenecek)
- Ürün fotoğrafı yükleme, Google İşletme Profili bağlantısı
- KVKK aydınlatma metni ve kullanım şartları sayfaları
