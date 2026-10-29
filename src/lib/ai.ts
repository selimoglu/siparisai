import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";

// Model ortam değişkeniyle değiştirilebilir (ör. maliyet için).
const MODEL = process.env.AI_MODEL ?? "claude-opus-5-5";

let client: Anthropic | null = null;
const ai = () => (client ??= new Anthropic());

/** Ortak çağrı: yapılandırılmış JSON çıktısı + reddedilirse sunucu tarafı yedek model. */
async function parseJson<T extends z.ZodType>(
  schema: T,
  content: Anthropic.Beta.Messages.BetaContentBlockParam[],
  system: string,
  effort: "low" | "medium" | "high",
): Promise<z.infer<T>> {
  const res = await ai().beta.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system,
    output_config: { effort, format: betaZodOutputFormat(schema) },
    messages: [{ role: "user", content }],
  });
  if (res.stop_reason === "refusal") throw new Error("ai_refused");
  if (!res.parsed_output) throw new Error("ai_bad_output");
  return res.parsed_output;
}

// ───────────── Menü okuma ─────────────

export const MenuSchema = z.object({
  categories: z.array(
    z.object({
      name: z.string(),
      items: z.array(
        z.object({
          name: z.string(),
          description: z.string(),
          price: z.number(),
        }),
      ),
    }),
  ),
});
export type ParsedMenu = z.infer<typeof MenuSchema>;

const MENU_SYSTEM = `Sen bir Türk restoranı için menü okuyan asistansın.
Verilen menü fotoğraflarını veya metni okuyup kategorilere ayrılmış ürün listesi çıkar.
- Fiyatları Türk lirası olarak sayı yaz (ör. "185,50 TL" → 185.5). Fiyatı okunamayan ürünü atla.
- Menüde kategori yoksa mantıklı kategoriler oluştur (Ana yemekler, Çorbalar, İçecekler, Tatlılar gibi).
- Her ürüne, menüde açıklama yoksa, iştah açan ama abartısız, en fazla 12 kelimelik Türkçe bir açıklama yaz.
- Ürün adlarını menüdeki gibi koru, sadece yazım hatalarını düzelt.`;

export async function readMenu(input: {
  images?: { mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif"; base64: string }[];
  text?: string;
}): Promise<ParsedMenu> {
  const content: Anthropic.Beta.Messages.BetaContentBlockParam[] = [];
  for (const img of input.images ?? []) {
    content.push({ type: "image", source: { type: "base64", media_type: img.mediaType, data: img.base64 } });
  }
  content.push({
    type: "text",
    text: input.text?.trim()
      ? `Menü metni:\n${input.text.trim()}`
      : "Yukarıdaki menü fotoğraflarını oku.",
  });
  return parseJson(MenuSchema, content, MENU_SYSTEM, "medium");
}

// ───────────── Kampanya mesajı ─────────────

const CampaignSchema = z.object({
  variants: z.array(z.string()).describe("3 farklı SMS metni"),
});

export async function writeCampaign(input: {
  restaurantName: string;
  segmentLabel: string;
  goal: string;
  offer: string;
  topItems: string[];
  link: string;
}): Promise<string[]> {
  const system = `Türk mahalle restoranları için SMS kampanya metni yazan bir pazarlamacısın.
Kurallar:
- Her metin en fazla 150 karakter olsun (link hariç). Samimi, kısa, Türkçe.
- Restoran adını başta kullan. Teklif varsa net yaz. Sonuna {LINK} yaz; link oraya eklenecek.
- Emoji en fazla bir tane. Büyük harfle bağırma, abartılı vaat yok.
- Müşterinin adı yerine {AD} kullanabilirsin.`;
  const user = `Restoran: ${input.restaurantName}
Hedef kitle: ${input.segmentLabel}
Amaç: ${input.goal}
Teklif: ${input.offer || "teklif yok, sadece hatırlatma"}
Çok satanlar: ${input.topItems.join(", ") || "bilinmiyor"}
3 farklı metin yaz.`;
  const out = await parseJson(CampaignSchema, [{ type: "text", text: user }], system, "low");
  return out.variants.slice(0, 3).map((v) => v.replaceAll("{LINK}", input.link));
}
