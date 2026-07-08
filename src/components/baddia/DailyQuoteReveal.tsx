import { useEffect, useMemo, useState } from "react";
import { Share2, X } from "lucide-react";

interface Props {
  quote: string;
  name?: string;
  onClose: () => void;
  onShare?: () => void;
}

const EMOJIS = ["✨", "💖", "🌸", "⭐", "🦋", "💫", "🌷", "💗", "🪩", "🍬"];

interface Float {
  left: number;
  top: number;
  delay: number;
  duration: number;
  size: number;
  emoji: string;
  drift: number;
}

export function DailyQuoteReveal({ quote, name, onClose, onShare }: Props) {
  const [phase, setPhase] = useState<"in" | "show" | "out">("in");

  const floats = useMemo<Float[]>(
    () =>
      Array.from({ length: 22 }).map(() => ({
        left: Math.random() * 100,
        top: 30 + Math.random() * 70,
        delay: Math.random() * 1.2,
        duration: 4 + Math.random() * 3,
        size: 18 + Math.random() * 22,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        drift: -30 + Math.random() * 60,
      })),
    []
  );

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("show"), 60);
    return () => clearTimeout(t1);
  }, []);

  const close = () => {
    setPhase("out");
    setTimeout(onClose, 380);
  };

  return (
    <div
      role="dialog"
      aria-label="Frase del día"
      onClick={close}
      className={`fixed inset-0 z-[120] flex flex-col items-center justify-center px-7 overflow-hidden cursor-pointer transition-opacity duration-300 ${
        phase === "out" ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(circle at 30% 20%, hsl(325 100% 82%) 0%, hsl(335 100% 70%) 40%, hsl(256 90% 68%) 100%)",
      }}
    >
      {/* soft glow orbs */}
      <div className="absolute -top-24 -left-16 w-80 h-80 rounded-full bg-baddia-yellow/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-10 w-96 h-96 rounded-full bg-baddia-bubble/50 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-16 w-56 h-56 rounded-full bg-white/30 blur-3xl pointer-events-none" />

      {/* floating cute emojis */}
      {floats.map((f, i) => (
        <span
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${f.left}%`,
            top: `${f.top}%`,
            fontSize: `${f.size}px`,
            animation: `quoteFloat ${f.duration}s ease-in-out ${f.delay}s infinite`,
            ["--drift" as any]: `${f.drift}px`,
            filter: "drop-shadow(0 2px 6px rgba(255,255,255,0.5))",
          }}
        >
          {f.emoji}
        </span>
      ))}

      {/* close button */}
      <button
        onClick={(e) => { e.stopPropagation(); close(); }}
        aria-label="Cerrar"
        className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/90 border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
      >
        <X size={18} className="text-baddia-ink" strokeWidth={3} />
      </button>

      {/* top chip */}
      <div
        className="relative z-10 mb-6"
        style={{ animation: "quoteChipIn .6s cubic-bezier(.34,1.56,.64,1) both .1s" }}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-4 py-2 text-[11px] font-display font-black uppercase tracking-[0.2em] shadow-[3px_3px_0_hsl(48_100%_59%)] -rotate-2">
          💬 frase del día
        </span>
      </div>

      {/* greeting */}
      {name && (
        <p
          className="relative z-10 text-white/95 text-[15px] font-display font-bold mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
          style={{ animation: "quoteChipIn .6s cubic-bezier(.34,1.56,.64,1) both .18s" }}
        >
          para ti, {name} 💗
        </p>
      )}

      {/* quote card */}
      <div
        className="relative z-10 max-w-[340px] w-full"
        style={{ animation: "quoteCardIn .8s cubic-bezier(.34,1.56,.64,1) both .28s" }}
      >
        <div className="absolute -inset-2 rounded-[36px] bg-white/30 blur-xl" />
        <div className="relative rounded-[32px] bg-white border-[3px] border-baddia-ink px-6 py-8 shadow-[6px_8px_0_hsl(260_16%_15%)] rotate-[-1.5deg]">
          <span className="absolute -top-4 -left-3 text-4xl rotate-[-14deg]">💗</span>
          <span className="absolute -top-3 -right-3 text-3xl rotate-[16deg]">✨</span>
          <span className="absolute -bottom-4 -right-4 text-3xl rotate-[10deg]">🌸</span>

          <span className="block font-serif italic text-[64px] leading-none text-baddia-hot mb-1 select-none">
            &ldquo;
          </span>
          <p className="font-display font-black text-[24px] leading-[1.15] text-baddia-ink text-center px-2">
            {quote}
          </p>
          <div className="flex justify-center mt-5">
            <span className="inline-flex items-center gap-1 rounded-full bg-baddia-yellow border-2 border-baddia-ink px-3 py-1 text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)]">
              ✦ baddia glow
            </span>
          </div>
        </div>
      </div>

      {/* actions */}
      <div
        className="relative z-10 mt-8 flex items-center gap-3"
        style={{ animation: "quoteChipIn .6s cubic-bezier(.34,1.56,.64,1) both .5s" }}
      >
        {onShare && (
          <button
            onClick={(e) => { e.stopPropagation(); onShare(); close(); }}
            className="btn-sticker px-5 py-3 rounded-full bg-white text-baddia-ink text-[13px] flex items-center gap-1.5"
          >
            <Share2 size={14} strokeWidth={2.5} /> Compartir
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); close(); }}
          className="btn-sticker px-6 py-3 rounded-full bg-baddia-ink text-white text-[13px]"
        >
          ver mi glow ✨
        </button>
      </div>

      <p
        className="relative z-10 mt-5 text-[11px] font-semibold text-white/80"
        style={{ animation: "quoteChipIn .6s ease both .7s" }}
      >
        toca en cualquier lado para continuar
      </p>

      <style>{`
        @keyframes quoteFloat {
          0%,100% { transform: translate3d(0,0,0) rotate(0deg); opacity: .85; }
          50%     { transform: translate3d(var(--drift), -40px, 0) rotate(12deg); opacity: 1; }
        }
        @keyframes quoteCardIn {
          0%   { transform: scale(.6) rotate(-8deg); opacity: 0; }
          70%  { transform: scale(1.04) rotate(-1.5deg); opacity: 1; }
          100% { transform: scale(1) rotate(-1.5deg); opacity: 1; }
        }
        @keyframes quoteChipIn {
          0%   { transform: translateY(14px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
