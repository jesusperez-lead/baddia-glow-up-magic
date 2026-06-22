import { useEffect, useMemo } from "react";
import { Crown, Sparkles, Users } from "lucide-react";
import type { BaddiaUser } from "@/lib/baddia-state";

interface Props {
  plan: BaddiaUser["plan"];
  onDone: () => void;
}

/* Pequeña pieza de confeti generada en HTML — sin libs externas */
interface Piece {
  left: number;
  delay: number;
  duration: number;
  rotate: number;
  size: number;
  color: string;
  shape: "rect" | "circle" | "star";
}

const COLORS = [
  "hsl(335 100% 59%)", // hot pink
  "hsl(325 100% 74%)", // bubble
  "hsl(48 100% 59%)",  // yellow
  "hsl(256 90% 68%)",  // lavender
  "hsl(169 81% 43%)",  // mint
  "hsl(76 100% 48%)",  // lime
];

export function PlanCelebration({ plan, onDone }: Props) {
  const isGirls = plan === "Baddia Girls";
  const pieces = useMemo<Piece[]>(() => {
    const n = 70;
    return Array.from({ length: n }, (_, i) => {
      const shapes: Piece["shape"][] = ["rect", "circle", "star"];
      return {
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.8 + Math.random() * 1.6,
        rotate: Math.random() * 720 - 360,
        size: 8 + Math.random() * 10,
        color: COLORS[i % COLORS.length],
        shape: shapes[i % shapes.length],
      };
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, [onDone]);

  const title = isGirls ? "¡Bienvenidas, Baddia Girls!" : `¡Bienvenida a Baddia ${plan}!`;
  const sub = isGirls
    ? "Tu círculo brilla más fuerte juntas 💞"
    : "Tu glow está oficialmente desbloqueado ✨";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
      {/* Fondo radial suave */}
      <div className="absolute inset-0 bg-baddia-purple/30 backdrop-blur-[6px] animate-fade-in" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, hsl(335 100% 70% / 0.45), transparent 60%)",
        }}
      />

      {/* Confeti */}
      <div className="absolute inset-0 overflow-hidden">
        {pieces.map((p, i) => (
          <span
            key={i}
            className="absolute top-[-20px] block"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.shape === "rect" ? p.size * 0.5 : p.size,
              background: p.shape === "star" ? "transparent" : p.color,
              color: p.color,
              borderRadius: p.shape === "circle" ? "50%" : p.shape === "rect" ? 2 : 0,
              animation: `confettiFall ${p.duration}s cubic-bezier(.4,.7,.6,1) ${p.delay}s forwards`,
              transform: `rotate(${p.rotate}deg)`,
              fontSize: p.size + 6,
              lineHeight: 1,
              textAlign: "center",
            }}
          >
            {p.shape === "star" ? "✦" : ""}
          </span>
        ))}
      </div>

      {/* Sticker central */}
      <div
        className="relative animate-pop-in bg-white border-[3px] border-baddia-ink rounded-[32px] px-7 py-7 mx-6 max-w-[340px] text-center"
        style={{ boxShadow: "8px 9px 0 0 hsl(var(--ink))" }}
      >
        {/* halo */}
        <div className="absolute inset-0 -z-10 rounded-[32px] animate-pulse"
          style={{ boxShadow: "0 0 60px 10px hsl(335 100% 65% / 0.55)" }} />

        {/* Sparkles flotando */}
        <span className="absolute -top-4 -left-3 text-3xl animate-twinkle">✨</span>
        <span className="absolute -top-3 -right-4 text-2xl animate-twinkle" style={{ animationDelay: "0.3s" }}>💖</span>
        <span className="absolute -bottom-3 -left-4 text-2xl animate-twinkle" style={{ animationDelay: "0.6s" }}>✦</span>
        <span className="absolute -bottom-4 -right-3 text-3xl animate-twinkle" style={{ animationDelay: "0.9s" }}>🌟</span>

        {/* Icono central */}
        <div
          className="mx-auto mb-3 w-20 h-20 rounded-full border-[3px] border-baddia-ink flex items-center justify-center gradient-bg-hot text-white animate-breathe"
          style={{ boxShadow: "4px 4px 0 0 hsl(var(--ink))" }}
        >
          {isGirls ? <Users size={36} strokeWidth={2.5} /> : <Crown size={36} strokeWidth={2.5} />}
        </div>

        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-baddia-gold border-2 border-baddia-ink text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink mb-3"
          style={{ boxShadow: "2px 2px 0 0 hsl(var(--ink))" }}>
          <Sparkles size={11} /> Plan activado
        </span>

        <h2 className="font-display font-black text-[22px] leading-tight text-baddia-ink">
          {title}
        </h2>
        <p className="text-[13px] font-semibold text-baddia-ink/70 mt-2 leading-snug">
          {sub}
        </p>

        {isGirls && (
          <div className="mt-4 flex justify-center gap-1.5">
            {["👯‍♀️", "💖", "🔮", "✨"].map((e, i) => (
              <span
                key={i}
                className="inline-block text-2xl"
                style={{ animation: `girlsBounce 0.9s ${i * 0.12}s ease-out both` }}
              >
                {e}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Keyframes locales */}
      <style>{`
        @keyframes confettiFall {
          0%   { transform: translateY(-10vh) rotate(0deg);   opacity: 0; }
          10%  { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 1; }
        }
        @keyframes twinkle {
          0%, 100% { transform: scale(1) rotate(0deg);   opacity: 1; }
          50%      { transform: scale(1.25) rotate(15deg); opacity: 0.7; }
        }
        .animate-twinkle { animation: twinkle 1.4s ease-in-out infinite; }
        @keyframes girlsBounce {
          0%   { transform: translateY(20px) scale(0.4); opacity: 0; }
          60%  { transform: translateY(-8px) scale(1.2); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
