import "server-only";

export type SmsMessage = { phone: string; text: string };
export type SmsResult = { sent: number; dryRun: boolean; providerRef?: string };

/**
 * SMS gönderimi. NETGSM_* değişkenleri yoksa "deneme modu"nda çalışır:
 * hiçbir şey göndermez, sadece kaç kişiye gideceğini döndürür.
 *
 * DİKKAT: Ticari SMS'ler İYS'ye kayıtlı izinli numaralara gitmeli.
 * Netgsm'in iysfilter alanı bu kontrolü sağlayıcı tarafında da yapar.
 * Canlıya almadan önce Netgsm'in güncel API dokümanıyla alanları doğrulayın.
 */
export async function sendSms(messages: SmsMessage[]): Promise<SmsResult> {
  const user = process.env.NETGSM_USERCODE;
  const pass = process.env.NETGSM_PASSWORD;
  const header = process.env.NETGSM_HEADER;
  if (!user || !pass || !header) return { sent: messages.length, dryRun: true };
  if (messages.length === 0) return { sent: 0, dryRun: false };

  const res = await fetch("https://api.netgsm.com.tr/sms/rest/v2/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${user}:${pass}`).toString("base64")}`,
    },
    body: JSON.stringify({
      msgheader: header,
      encoding: "TR",
      iysfilter: process.env.NETGSM_IYS_FILTER ?? "11", // 11: bireysel alıcıya ticari ileti
      messages: messages.map((m) => ({ msg: m.text, no: m.phone })),
    }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`sms_failed: ${res.status} ${body.slice(0, 200)}`);
  return { sent: messages.length, dryRun: false, providerRef: body.slice(0, 100) };
}
