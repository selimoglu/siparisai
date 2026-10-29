import type { Customer } from "./types";

export type SegmentKey = "lapsed" | "loyal" | "new" | "birthday" | "all";

export const SEGMENTS: Record<SegmentKey, { label: string; hint: string; goal: string }> = {
  lapsed: {
    label: "Kaybolmak üzere",
    hint: "30 günden uzun süredir sipariş vermeyenler",
    goal: "Müşteriyi geri getirmek; özlediğimizi söyleyip küçük bir teklif sunmak.",
  },
  loyal: {
    label: "Sadık müşteriler",
    hint: "3 veya daha fazla sipariş verenler",
    goal: "Teşekkür etmek ve ayrıcalıklı hissettirmek; yeni ürünü ilk onlara duyurmak.",
  },
  new: {
    label: "Yeni müşteriler",
    hint: "Son 14 günde ilk siparişini verenler",
    goal: "İkinci siparişi vermesini sağlamak.",
  },
  birthday: {
    label: "Doğum günü yaklaşanlar",
    hint: "Önümüzdeki 7 gün içinde doğum günü olanlar",
    goal: "Doğum gününü kutlamak ve hediye sunmak.",
  },
  all: {
    label: "Tüm izinli müşteriler",
    hint: "Kampanya izni veren herkes",
    goal: "Genel duyuru veya kampanya.",
  },
};

const DAY = 86_400_000;

export function inSegment(c: Customer, seg: SegmentKey, now = new Date()): boolean {
  const last = c.last_order_at ? new Date(c.last_order_at).getTime() : 0;
  const first = c.first_order_at ? new Date(c.first_order_at).getTime() : 0;
  switch (seg) {
    case "lapsed":
      return last > 0 && now.getTime() - last > 30 * DAY;
    case "loyal":
      return c.order_count >= 3;
    case "new":
      return c.order_count === 1 && now.getTime() - first <= 14 * DAY;
    case "birthday": {
      if (!c.birthday) return false;
      const b = new Date(c.birthday);
      for (let i = 0; i <= 7; i++) {
        const d = new Date(now.getTime() + i * DAY);
        if (d.getMonth() === b.getMonth() && d.getDate() === b.getDate()) return true;
      }
      return false;
    }
    case "all":
      return true;
  }
}

export const isSegmentKey = (s: string): s is SegmentKey => s in SEGMENTS;
