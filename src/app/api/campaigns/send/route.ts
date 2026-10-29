import { NextResponse } from "next/server";
import { getOwnerContext } from "@/lib/supabase/server";
import { inSegment, isSegmentKey } from "@/lib/segments";
import { sendSms } from "@/lib/sms";
import { siteUrl } from "@/lib/format";
import type { Customer } from "@/lib/types";

export async function POST(req: Request) {
  const { supabase, restaurant } = await getOwnerContext();
  if (!restaurant) return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { segment?: string; message?: string };
  const segment = body.segment ?? "";
  const message = (body.message ?? "").trim();
  if (!isSegmentKey(segment)) return NextResponse.json({ error: "Geçersiz kitle." }, { status: 400 });
  if (message.length < 10 || message.length > 600)
    return NextResponse.json({ error: "Mesaj 10–600 karakter olmalı." }, { status: 400 });

  // Sadece kampanya izni olan müşteriler
  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .eq("restaurant_id", restaurant.id)
    .eq("marketing_consent", true);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const targets = (customers as Customer[]).filter((c) => inSegment(c, segment));
  if (!targets.length) return NextResponse.json({ error: "Bu kitlede izinli müşteri yok." }, { status: 400 });

  const { data: campaign, error: cErr } = await supabase
    .from("campaigns")
    .insert({ restaurant_id: restaurant.id, segment, message, channel: "sms" })
    .select()
    .single();
  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 });

  // Kampanyadan gelen siparişleri saymak için linke kampanya kodu eklenir.
  const base = siteUrl(restaurant);
  const tracked = `${base}${base.includes("?") ? "&" : "?"}c=${campaign.id}`;
  const footer = restaurant.sms_footer?.trim() ? `\n${restaurant.sms_footer.trim()}` : "";
  const msgs = targets.map((c) => ({
    phone: c.phone,
    text:
      message
        .replaceAll("{AD}", c.name.split(" ")[0])
        .replaceAll(base, tracked) + footer,
  }));

  try {
    const result = await sendSms(msgs);
    await supabase
      .from("campaigns")
      .update({ status: "sent", recipients: result.sent, dry_run: result.dryRun, sent_at: new Date().toISOString() })
      .eq("id", campaign.id);
    return NextResponse.json({ sent: result.sent, dryRun: result.dryRun });
  } catch (e) {
    await supabase.from("campaigns").update({ status: "failed" }).eq("id", campaign.id);
    console.error(e);
    return NextResponse.json({ error: "SMS gönderilemedi." }, { status: 502 });
  }
}
