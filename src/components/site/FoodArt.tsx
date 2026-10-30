// Tanıtım görsellerinde kullanılan basit yemek çizimleri (fotoğraf yerine)
type Kind = "pide" | "lahmacun" | "burger" | "ayran" | "kunefe" | "doner";

const BG: Record<Kind, string> = {
  pide: "from-[#f6d9a8] to-[#e9b872]",
  lahmacun: "from-[#f8c9a0] to-[#e7955f]",
  burger: "from-[#ffe1a6] to-[#f5b84a]",
  ayran: "from-[#e3f2ff] to-[#b9dcf5]",
  kunefe: "from-[#ffd7a1] to-[#f2a540]",
  doner: "from-[#f3d2b0] to-[#d99a63]",
};

function Art({ kind }: { kind: Kind }) {
  switch (kind) {
    case "pide":
      return (
        <g>
          <path d="M10 50 Q50 18 90 50 Q50 82 10 50Z" fill="#c9792f" />
          <path d="M20 50 Q50 30 80 50 Q50 70 20 50Z" fill="#9b3d1f" />
          <circle cx="40" cy="48" r="3" fill="#e9c46a" />
          <circle cx="55" cy="53" r="3" fill="#e9c46a" />
          <circle cx="62" cy="46" r="2.5" fill="#5a8f3a" />
        </g>
      );
    case "lahmacun":
      return (
        <g>
          <circle cx="50" cy="50" r="34" fill="#d9894a" />
          <circle cx="50" cy="50" r="28" fill="#a8402a" />
          <path d="M34 44h10M56 58h10M48 36h6" stroke="#6aa84f" strokeWidth="4" strokeLinecap="round" />
          <circle cx="62" cy="40" r="3" fill="#f3e3c3" />
        </g>
      );
    case "burger":
      return (
        <g>
          <path d="M22 46 Q50 14 78 46Z" fill="#d38a32" />
          <rect x="20" y="47" width="60" height="6" rx="3" fill="#6aa84f" />
          <rect x="21" y="54" width="58" height="9" rx="4" fill="#6b3a1f" />
          <rect x="22" y="64" width="56" height="4" rx="2" fill="#f2c94c" />
          <path d="M22 69h56v4a6 6 0 0 1-6 6H28a6 6 0 0 1-6-6Z" fill="#d38a32" />
        </g>
      );
    case "ayran":
      return (
        <g>
          <path d="M34 22h32l-4 58H38Z" fill="#ffffff" stroke="#9cc7e6" strokeWidth="2" />
          <path d="M35 30h30" stroke="#d7ecfa" strokeWidth="6" />
        </g>
      );
    case "kunefe":
      return (
        <g>
          <ellipse cx="50" cy="56" rx="34" ry="16" fill="#b85c1e" />
          <ellipse cx="50" cy="50" rx="34" ry="16" fill="#e8962e" />
          <path d="M36 48h28" stroke="#6aa84f" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 5" />
        </g>
      );
    case "doner":
      return (
        <g>
          <path d="M18 60 Q50 30 82 60 Q50 74 18 60Z" fill="#f5e6c8" />
          <path d="M28 56 Q50 38 72 56" stroke="#9b4a22" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M34 52h6M52 46h6M62 52h5" stroke="#6aa84f" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
  }
}

export default function FoodArt({ kind, className = "" }: { kind: Kind; className?: string }) {
  return (
    <div className={`bg-gradient-to-br ${BG[kind]} ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        <Art kind={kind} />
      </svg>
    </div>
  );
}
