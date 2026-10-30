import Link from "next/link";
import { Logo } from "./Header";
import { NAV } from "./nav";

export default function Footer() {
  const cols = NAV.filter((n) => n.children);
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-3 max-w-xs text-sm text-white/60">
            Restoranlar için komisyonsuz sipariş sitesi ve yapay zekalı pazarlama.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.label}>
            <p className="mb-3 text-sm font-semibold">{c.label}</p>
            <ul className="space-y-2 text-sm text-white/60">
              {c.children!.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="mb-3 text-sm font-semibold">Şirket</p>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/nasil-calisir" className="hover:text-white">Nasıl çalışır</Link></li>
            <li><Link href="/fiyatlar" className="hover:text-white">Fiyatlar</Link></li>
            <li><Link href="/giris" className="hover:text-white">Giriş yap</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/40">
          © {new Date().getFullYear()} SiparişAI · Türkiye&apos;deki restoranlar için yapıldı.
        </p>
      </div>
    </footer>
  );
}
