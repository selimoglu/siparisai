// Blog yazıları. Yeni yazı eklemek için bu listeye bir öğe eklemek yeterli.
export type Post = { slug: string; title: string; excerpt: string; date: string; minutes: number; body: string[] };

export const POSTS: Post[] = [
  {
    slug: "platform-komisyonu-gercek-maliyet",
    title: "Platform komisyonu restoranına gerçekte ne kadara mal oluyor?",
    excerpt: "Yüzde 20 küçük görünür. Ama kâr marjının yanına koyunca tablo değişir.",
    date: "2026-10-30",
    minutes: 4,
    body: [
      "Bir restoranın net kâr marjı çoğu zaman yüzde 10 ile 15 arasındadır. Platform her siparişte yüzde 18 ile 22 arasında komisyon aldığında, o siparişten kâr etmek neredeyse imkânsız hale gelir.",
      "Örnek: 500 liralık bir siparişte platforma 100 lira gider. Malzeme, kurye, ambalaj ve personel çıktıktan sonra elinde kalan çoğu zaman bu 100 liradan azdır. Yani bazı siparişlerde platform, restorandan daha çok kazanır.",
      "Komisyonun görünmeyen maliyeti ise müşteridir. Platformdan gelen müşterinin adını ve numarasını bilmezsin. Bir dahaki sefere listede rakibini görür ve oradan sipariş verir.",
      "Çözüm platformu bırakmak değil. Platform yeni müşteri bulmak için iyi bir vitrin. Asıl kazanç, müdavimlerini kendi siparişine taşımakta. Kendi sitenden gelen her sipariş, komisyon kadar ek kâr demek.",
      "Kendi hesabını yapmak için ana sayfamızdaki komisyon hesaplayıcısını kullanabilirsin.",
    ],
  },
  {
    slug: "mudavimi-kendi-sitene-tasimanin-5-yolu",
    title: "Müdavim müşteriyi kendi sitene taşımanın 5 yolu",
    excerpt: "Platformdan gelen müşteriyi kızdırmadan, indirimle ve iyi hizmetle kendi kanalına çek.",
    date: "2026-10-30",
    minutes: 5,
    body: [
      "1. Paket kartı: Platformdan giden her pakete küçük bir kart koy. Üzerinde QR kod ve 'Bir sonraki siparişin sitemizden yüzde 10 indirimli' yazsın.",
      "2. Sitene özel fiyat: Komisyon ödemediğin için kendi sitende biraz daha ucuz olabilirsin. Müşteri farkı görünce kendiliğinden geçer.",
      "3. Google profili: Google İşletme profilindeki sipariş bağlantısını kendi sitene yönlendir. Seni arayan müşteri doğrudan sana gelsin.",
      "4. Instagram ve WhatsApp durumları: Biyografi bağlantını ve paylaşımlarını kendi sipariş sitene yönlendir.",
      "5. Hatırlatma mesajı: Kendi sitenden sipariş veren ve izin veren müşteriye, bir süre gelmediğinde kısa bir 'sizi özledik' mesajı gönder. SiparişAI bu mesajı yapay zekayla hazırlar.",
    ],
  },
  {
    slug: "google-da-ust-siralarda-cikmak",
    title: "Restoranın Google'da üst sıralarda nasıl çıkar?",
    excerpt: "Pahalı reklam vermeden, yakınındaki müşteriye görünmenin temel adımları.",
    date: "2026-10-30",
    minutes: 4,
    body: [
      "Google İşletme profilini eksiksiz doldur: doğru adres, telefon, çalışma saatleri, menü ve en az 10 kaliteli fotoğraf.",
      "Yorum iste ve yorumlara cevap ver. Düzenli gelen ve cevaplanan yorumlar, yakındaki aramalarda öne çıkmanın en güçlü sinyallerinden biridir.",
      "Kendi siten olsun. Menünün, adresinin ve saatlerinin Google'ın anlayacağı şekilde yazıldığı hızlı bir site, profilini güçlendirir.",
      "Bilgilerin her yerde aynı olsun. Adres ve telefonun sitede, Google'da ve sosyal medyada birebir aynı yazılmalı.",
      "Profiline 'Sipariş ver' bağlantısı ekle ve bunu kendi sitene yönlendir. Böylece Google'dan gelen sipariş komisyonsuz olur.",
    ],
  },
];
