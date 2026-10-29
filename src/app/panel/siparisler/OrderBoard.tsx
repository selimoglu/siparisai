"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { money, phoneDisplay, timeAgo, STATUS_LABEL } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";

const NEXT: Record<OrderStatus, { to: OrderStatus; label: string }[]> = {
  new: [{ to: "preparing", label: "Onayla, hazırla" }, { to: "cancelled", label: "İptal" }],
  preparing: [{ to: "on_the_way", label: "Yola çıktı" }, { to: "ready", label: "Gel-al hazır" }],
  on_the_way: [{ to: "completed", label: "Teslim edildi" }],
  ready: [{ to: "completed", label: "Teslim edildi" }],
  completed: [],
  cancelled: [],
};

function beep() {
  try {
    const ctx = new AudioContext();
    [0, 0.25].forEach((t) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = 880;
      g.gain.value = 0.2;
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + 0.15);
    });
  } catch {}
}

export default function OrderBoard({ restaurantId, initial }: { restaurantId: string; initial: Order[] }) {
  const supabase = useMemo(() => createClient(), []);
  const [orders, setOrders] = useState(initial);
  const [live, setLive] = useState(false);
  const [showDone, setShowDone] = useState(false);

  useEffect(() => {
    let ch: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;
    (async () => {
      // Canlı bağlantı, satır yetkisi (RLS) için kullanıcının oturum anahtarıyla açılmalı.
      const { data } = await supabase.auth.getSession();
      if (cancelled) return;
      if (data.session) await supabase.realtime.setAuth(data.session.access_token);
      ch = supabase
        .channel(`orders-${restaurantId}`)
        .on("postgres_changes",
          { event: "*", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurantId}` },
          (payload) => {
            const o = payload.new as Order;
            if (payload.eventType === "INSERT") {
              setOrders((l) => (l.some((x) => x.id === o.id) ? l : [o, ...l]));
              beep();
            } else if (payload.eventType === "UPDATE") {
              setOrders((l) => l.map((x) => (x.id === o.id ? o : x)));
            }
          })
        .subscribe((s) => setLive(s === "SUBSCRIBED"));
    })();
    return () => {
      cancelled = true;
      if (ch) supabase.removeChannel(ch);
    };
  }, [supabase, restaurantId]);

  async function move(id: string, to: OrderStatus) {
    setOrders((l) => l.map((x) => (x.id === id ? { ...x, status: to } : x)));
    await supabase.from("orders").update({ status: to }).eq("id", id);
  }

  const open = orders.filter((o) => !["completed", "cancelled"].includes(o.status));
  const done = orders.filter((o) => ["completed", "cancelled"].includes(o.status));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="h1">Siparişler</h1>
        <span className={`rounded-full px-2 py-0.5 text-xs ${live ? "bg-green-100 text-green-800" : "bg-stone-100 text-muted"}`}>
          {live ? "● Canlı" : "Bağlanıyor…"}
        </span>
      </div>
      {open.length === 0 && <p className="card text-sm text-muted">Açık sipariş yok. Yeni sipariş gelince burada sesli uyarı ile görünür.</p>}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {open.map((o) => <Slip key={o.id} o={o} onMove={move} />)}
      </div>
      {done.length > 0 && (
        <button className="text-sm underline" onClick={() => setShowDone(!showDone)}>
          {showDone ? "Biten siparişleri gizle" : `Biten siparişler (${done.length})`}
        </button>
      )}
      {showDone && <div className="grid gap-3 opacity-70 md:grid-cols-2 lg:grid-cols-3">{done.map((o) => <Slip key={o.id} o={o} onMove={move} />)}</div>}
    </div>
  );
}

function Slip({ o, onMove }: { o: Order; onMove: (id: string, to: OrderStatus) => void }) {
  return (
    <article className={`card space-y-3 ${o.status === "new" ? "border-brand ring-2 ring-brand/20" : ""}`}>
      <header className="flex items-start justify-between">
        <div>
          <p className="font-display text-lg font-bold">#{o.order_no} · {o.customer_name}</p>
          <p className="text-xs text-muted">{timeAgo(o.created_at)} · {o.fulfillment === "delivery" ? "Paket" : "Gel-al"} ·{" "}
            {o.payment_method === "cash" ? "Nakit" : "Kapıda kart"}</p>
        </div>
        <span className="rounded-full bg-bg px-2 py-0.5 text-xs font-semibold">{STATUS_LABEL[o.status]}</span>
      </header>
      <ul className="text-sm">
        {o.items.map((l) => <li key={l.id}>{l.qty} × {l.name}</li>)}
      </ul>
      {o.note && <p className="rounded-lg bg-yellow-50 p-2 text-sm">Not: {o.note}</p>}
      <div className="text-sm">
        <a href={`tel:0${o.phone}`} className="underline">{phoneDisplay(o.phone)}</a>
        {o.address && <p className="text-muted">{o.address}</p>}
      </div>
      <footer className="flex items-center justify-between border-t border-line pt-3">
        <span className="font-display text-lg font-bold">{money(o.total)}</span>
        <div className="flex gap-2">
          {NEXT[o.status].map((n) => (
            <button key={n.to} onClick={() => onMove(o.id, n.to)}
              className={n.to === "cancelled" ? "btn-ghost py-1.5 text-xs" : "btn-primary py-1.5 text-xs"}>
              {n.label}
            </button>
          ))}
        </div>
      </footer>
    </article>
  );
}
