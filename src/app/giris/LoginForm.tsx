"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [signup, setSignup] = useState(params.get("kayit") === "1");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "err" | "ok"; text: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const supabase = createClient();
    if (signup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      setBusy(false);
      if (error) return setMsg({ kind: "err", text: trError(error.message) });
      if (!data.session)
        return setMsg({ kind: "ok", text: "E-postana bir onay linki gönderdik. Linke tıklayınca panel açılacak." });
      router.push("/panel");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg({ kind: "err", text: trError(error.message) });
      router.push("/panel");
    }
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card space-y-4">
      <div>
        <p className="font-display text-xl font-bold">
          Sipariş<span className="text-brand">AI</span>
        </p>
        <h1 className="mt-4 font-display text-2xl font-bold">{signup ? "Restoranını ekle" : "Giriş yap"}</h1>
      </div>
      <div>
        <label className="label" htmlFor="email">E-posta</label>
        <input id="email" type="email" required autoComplete="email" className="input"
          value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="label" htmlFor="pw">Şifre</label>
        <input id="pw" type="password" required minLength={8} className="input"
          autoComplete={signup ? "new-password" : "current-password"}
          value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {msg && (
        <p className={`rounded-xl p-3 text-sm ${msg.kind === "err" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-800"}`}>
          {msg.text}
        </p>
      )}
      <button className="btn-primary w-full" disabled={busy}>
        {busy ? "Bekleyin…" : signup ? "Hesap oluştur" : "Giriş yap"}
      </button>
      <button type="button" className="w-full text-sm text-muted underline" onClick={() => setSignup(!signup)}>
        {signup ? "Zaten hesabım var" : "Hesabım yok, kayıt olacağım"}
      </button>
    </form>
  );
}

function trError(m: string) {
  if (/invalid login/i.test(m)) return "E-posta veya şifre hatalı.";
  if (/already registered/i.test(m)) return "Bu e-posta zaten kayıtlı. Giriş yapmayı deneyin.";
  if (/password/i.test(m)) return "Şifre en az 8 karakter olmalı.";
  if (/email not confirmed/i.test(m)) return "Önce e-postandaki onay linkine tıkla.";
  return m;
}
