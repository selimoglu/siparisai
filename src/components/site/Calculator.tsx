"use client";

import Link from "next/link";
import { useState } from "react";

const tl = (n: number) => new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(n) + " ₺";

function Field({
  label, value, onChange, min, max, step, suffix,
}: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; suffix: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm font-medium text-white/80">{label}</span>
        <span className="font-display text-lg font-bold">
          {new Intl.NumberFormat("tr-TR").format(value)} {suffix}
        </span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value} aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[#16ad38]"
      />
    </div>
  );
}

export default function Calculator() {
  const [orders, setOrders] = useState(600);
  const [basket, setBasket] = useState(350);
  const [pct, setPct] = useState(20);
  const monthly = orders * basket * (pct / 100);

  return (
    <div className="grid gap-8 rounded-3xl bg-gradient-to-br from-[#16ad38] via-[#0f8f28] to-[#094413] p-6 text-white sm:p-10 lg:grid-cols-2">
      <div className="space-y-6">
        <Field label="Aylık platform siparişin" value={orders} onChange={setOrders} min={50} max={3000} step={50} suffix="adet" />
        <Field label="Ortalama sepet" value={basket} onChange={setBasket} min={100} max={1500} step={25} suffix="₺" />
        <Field label="Platform komisyonu" value={pct} onChange={setPct} min={5} max={35} step={1} suffix="%" />
      </div>
      <div className="flex flex-col justify-center rounded-2xl bg-white/10 p-6 ring-1 ring-white/15">
        <p className="text-sm text-accent-soft">Platforma ödediğin komisyon</p>
        <p className="mt-1 font-display text-4xl font-bold sm:text-5xl">{tl(monthly)}<span className="text-xl text-white/70"> / ay</span></p>
        <p className="mt-2 text-white/80">Yılda <strong className="text-white">{tl(monthly * 12)}</strong>.</p>
        <p className="mt-4 text-sm text-white/70">
          Bu siparişlerin her biri kendi sitenden gelse, bu paranın tamamı sende kalırdı.
        </p>
        <Link href="/giris?kayit=1" className="btn mt-6 self-start rounded-full bg-white px-6 py-3 text-brand hover:bg-accent-soft">
          Komisyonu geri al
        </Link>
      </div>
    </div>
  );
}
