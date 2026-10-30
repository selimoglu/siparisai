"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

/** Öğe ekranda mı? Animasyonlar sadece görünürken çalışsın diye. */
export function useInView<T extends Element>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const m = window.matchMedia(motionQuery);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}
export function useReducedMotion() {
  return useSyncExternalStore(subscribe, () => window.matchMedia(motionQuery).matches, () => false);
}

/**
 * Adım adım ilerleyen döngü. durations[i] = i. adımda kalma süresi (ms).
 * Ekranda değilken veya kullanıcı hareketi azaltmışsa durur.
 */
export function useSteps(durations: readonly number[], active: boolean, still = durations.length - 1) {
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (!active || reduced) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % durations.length), durations[step]);
    return () => clearTimeout(t);
  }, [step, active, reduced, durations]);
  return reduced ? still : step;
}
