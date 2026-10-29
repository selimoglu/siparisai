"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SEGMENTS, type SegmentKey } from "@/lib/segments";

export default function Composer({ counts, smsFooter }: { counts: Record<SegmentKey, number>; smsFooter: string | null }) {
  const router = useRouter();
  const [segment, setSegment] = useState<SegmentKey>("lapsed");
  const [offer, setOffer] = useState("");
  const [variants, setVariants] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState<"ai" | "send" | null>(null);
  const [note, setNote] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function write() {
    setBusy("ai");
    setNote(null);
    const res = await fetch("/api/ai/campaign", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ segment, offer }),
    });
    const data = await res.json();
    setBusy(null);
    if (!res.ok) return setNote({ kind: "err", text: data.error });
    setVariants(data.variants);
    setMessage(data.variants[0] ?? "");
  }

  async function send() {
    if (!confirm(`${counts[segment]} kişiye SMS gönderilsin mi?`)) return;
    setBusy("send");
    setNote(null);
    const res = await fetch("/api/campaigns/send", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ segment, message }),
    });
    const data = await res.json();
    setBusy(null);
    if (!res.ok) return setNote({ kind: "err", text: data.error });
    setNote({
      kind: "ok",
      text: data.dryRun
        ? `Deneme modu: ${data.sent} kişiye gidecekti. Gerçek gönderim için SMS hesabı bağlanmalı.`
        : `${data.sent} kişiye gönderildi.`,
    });
    setVariants([]);
    setMessage("");
    router.refresh();
  }

  return (
    <div className="card space-y-5">
      <h1 className="h1">Kampanya gönder</h1>
      <div>
        <p className="label">1. Kime?</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(SEGMENTS) as SegmentKey[]).map((k) => (
            <button key={k} onClick={() => setSegment(k)}
              className={`rounded-xl border p-3 text-left ${segment === k ? "border-brand bg-orange-50" : "border-line"}`}>
              <p className="font-semibold">{SEGMENTS[k].label} <span className="text-muted">({counts[k]})</span></p>
              <p className="text-xs text-muted">{SEGMENTS[k].hint}</p>
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="label">2. Teklif (isteğe bağlı)</label>
        <input className="input" placeholder="ör. Bu hafta pidelerde %15 indirim" value={offer} onChange={(e) => setOffer(e.target.value)} />
      </div>
      <button className="btn-primary" onClick={write} disabled={busy !== null}>
        {busy === "ai" ? "Yapay zeka yazıyor…" : variants.length ? "Yeniden yazdır" : "Yapay zekaya yazdır"}
      </button>

      <div className="space-y-3">
          <p className="label">3. Mesaj {variants.length > 0 ? "(seç ve düzenle)" : "(yapay zekaya yazdır veya kendin yaz)"}</p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v, i) => (
              <button key={i} onClick={() => setMessage(v)}
                className={`rounded-lg border px-3 py-1 text-xs ${message === v ? "border-brand bg-orange-50" : "border-line"}`}>
                Seçenek {i + 1}
              </button>
            ))}
          </div>
          <textarea className="input min-h-28" value={message} onChange={(e) => setMessage(e.target.value)} />
          <p className="text-xs text-muted">
            {message.length} karakter. {"{AD}"} müşterinin adıyla değişir.
            {smsFooter ? ` Sonuna eklenecek: “${smsFooter}”` : " Ayarlar'dan İYS/ret metnini eklemeyi unutma."}
          </p>
          <button className="btn-primary" onClick={send} disabled={busy !== null || counts[segment] === 0 || message.length < 10}>
            {busy === "send" ? "Gönderiliyor…" : `${counts[segment]} kişiye gönder`}
          </button>
      </div>
      {note && (
        <p className={`rounded-xl p-3 text-sm ${note.kind === "err" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"}`}>{note.text}</p>
      )}
    </div>
  );
}
