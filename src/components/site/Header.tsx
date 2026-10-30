"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV } from "./nav";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className={`font-display text-xl font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}>
      Sipariş<span className="text-accent">AI</span>
    </Link>
  );
}

function Chevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="mt-0.5">
      <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setDrop(null)}>
          {NAV.map((item) =>
            item.children ? (
              <div key={item.label} className="relative" onMouseEnter={() => setDrop(item.label)}>
                <button
                  type="button"
                  aria-expanded={drop === item.label}
                  onClick={() => setDrop(drop === item.label ? null : item.label)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[15px] font-bold text-ink hover:bg-bg"
                >
                  {item.label}
                  <Chevron />
                </button>
                {drop === item.label && (
                  <div className="absolute top-full left-0 pt-2">
                    <div className="w-72 rounded-2xl border border-line bg-white p-2 shadow-xl shadow-black/5">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setDrop(null)}
                          className="block rounded-xl px-3 py-2.5 hover:bg-bg"
                        >
                          <span className="block text-sm font-semibold text-ink">{c.label}</span>
                          {c.desc && <span className="block text-xs text-muted">{c.desc}</span>}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className="rounded-lg px-3 py-2 text-[15px] font-bold text-ink hover:bg-bg"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/giris" className="rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-bg">
            Giriş yap
          </Link>
          <Link href="/giris?kayit=1" className="btn-dark rounded-full px-5 py-3">
            Ücretsiz başla
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 lg:hidden"
          aria-label="Menüyü aç"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden>
            {open ? (
              <path d="M5 5l12 12M17 5 5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-white px-4 pb-6 lg:hidden">
          {NAV.map((item) => (
            <div key={item.label} className="border-b border-line/70 py-3">
              {item.children ? (
                <>
                  <p className="mb-1 text-xs font-semibold tracking-wide text-muted uppercase">{item.label}</p>
                  {item.children.map((c) => (
                    <Link key={c.href} href={c.href} onClick={() => setOpen(false)} className="block py-1.5 font-bold">
                      {c.label}
                    </Link>
                  ))}
                </>
              ) : (
                <Link href={item.href!} onClick={() => setOpen(false)} className="block font-bold">
                  {item.label}
                </Link>
              )}
            </div>
          ))}
          <div className="mt-4 grid gap-2">
            <Link href="/giris?kayit=1" className="btn-primary py-3">Ücretsiz başla</Link>
            <Link href="/giris" className="btn-ghost py-3">Giriş yap</Link>
          </div>
        </div>
      )}
    </header>
  );
}
