import { useEffect, useMemo, useState, useCallback } from "react";
import { X, Sparkles, Share2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MatchShareSheet } from "./MatchShareSheet";

const CUTE_FACTS = [
  "El corazón late más rápido cuando piensas en tu crush 💓 ¡es la dopamina!",
  "Mirar a alguien a los ojos 4 minutos puede aumentar la conexión ✨",
  "Los abrazos de 20s liberan oxitocina, la hormona del amor 🫂",
  "Las mariposas en la panza son adrenalina puliendo tu vibra 🦋",
  "Reírte con alguien sincroniza sus ondas cerebrales 🧠💖",
  "La energía que das es la que atraes — glow first, love después 🌙",
  "Compartir playlist es lenguaje del amor moderno 🎧💕",
  "Un match cósmico se siente ligero, no ansioso ✨",
  "Tu aura brilla más cuando estás en paz contigo misma 💫",
  "El amor propio multiplica tu magnetismo x1000 🌷",
];

export function MatchAnimation({
  photoA,
  photoB,
  score,
  label,
  onClose,
}: {
  photoA: string;
  photoB: string;
  score: number;
  label?: string;
  onClose: () => void;
}) {
  const fact = useMemo(
    () => CUTE_FACTS[Math.floor(Math.random() * CUTE_FACTS.length)],
    []
  );
  const [phase, setPhase] = useState<"enter" | "hold">("enter");
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase("hold"), 1400);
    return () => clearTimeout(t);
  }, []);

  const shareText = useMemo(() => {
    return `💖 IT'S A MATCH ${score}% en Baddia ✨\n${label || "vibes que combinan"}\n${fact}\n🔮 Descubre tu compatibilidad en baddia.app`;
  }, [score, label, fact]);

  const handleShare = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({
          title: "💖 It's a match en Baddia",
          text: shareText,
        });
        toast({ title: "Compartido ✨", description: "Tu match vuela por el mundo." });
      } else {
        await navigator.clipboard.writeText(shareText);
        setShared(true);
        toast({ title: "Copiado ✨", description: "Pégalo donde quieras compartirlo." });
        setTimeout(() => setShared(false), 1800);
      }
    } catch {
      // user cancelled or error
    }
  }, [shareText]);

  // sparkle positions
  const sparkles = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 1.5}s`,
        size: 10 + Math.random() * 18,
        rot: Math.random() * 360,
        char: ["✦", "✧", "★", "✨", "💗", "💖"][i % 6],
      })),
    []
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-baddia-ink/70 backdrop-blur-md animate-fade-in overflow-hidden"
      onClick={onClose}
    >
      {/* glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-baddia-hot/40 via-baddia-bubble/30 to-baddia-lavender/40 animate-pulse-slow pointer-events-none" />

      {/* sparkle rain */}
      {sparkles.map((s, i) => (
        <span
          key={i}
          className="absolute pointer-events-none select-none animate-float-cute text-white drop-shadow-[0_0_10px_hsl(48_100%_75%)]"
          style={{
            left: s.left,
            top: s.top,
            fontSize: s.size,
            transform: `rotate(${s.rot}deg)`,
            animationDelay: s.delay,
          }}
        >
          {s.char}
        </span>
      ))}

      {/* share */}
      <button
        onClick={handleShare}
        className="absolute top-6 left-5 w-10 h-10 rounded-full bg-gradient-hot border-2 border-white flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] z-20 animate-pop-in-cute"
        aria-label="Compartir match"
      >
        {shared ? (
          <Check size={16} strokeWidth={3} className="text-white" />
        ) : (
          <Share2 size={16} strokeWidth={3} className="text-white" />
        )}
      </button>

      {/* close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-5 w-10 h-10 rounded-full bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] z-20"
        aria-label="Cerrar"
      >
        <X size={16} strokeWidth={3} className="text-baddia-ink" />
      </button>

      <div
        className="relative w-full max-w-sm px-6 flex flex-col items-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Photos crash */}
        <div className="relative w-full h-52 flex items-center justify-center">
          {/* burst behind */}
          <span
            className={`absolute w-56 h-56 rounded-full bg-gradient-hot opacity-70 blur-xl ${
              phase === "hold" ? "animate-pulse-slow" : ""
            }`}
          />
          <div
            className="absolute left-1/2 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full overflow-hidden border-[3px] border-baddia-ink shadow-[5px_6px_0_hsl(260_16%_15%)] bg-white"
            style={{
              animation:
                phase === "enter"
                  ? "matchInLeft 1.2s cubic-bezier(.34,1.56,.64,1) both"
                  : "matchWiggleLeft 3s ease-in-out infinite",
              transformOrigin: "center",
            }}
          >
            <img src={photoA} alt="Tú" className="w-full h-full object-cover" />
          </div>
          <div
            className="absolute left-1/2 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full overflow-hidden border-[3px] border-baddia-ink shadow-[5px_6px_0_hsl(260_16%_15%)] bg-white"
            style={{
              animation:
                phase === "enter"
                  ? "matchInRight 1.2s cubic-bezier(.34,1.56,.64,1) both"
                  : "matchWiggleRight 3s ease-in-out infinite",
              transformOrigin: "center",
            }}
          >
            <img src={photoB} alt="Tu match" className="w-full h-full object-cover" />
          </div>

          {/* Center heart */}
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 text-5xl animate-breathe drop-shadow-[0_4px_8px_rgba(255,46,117,0.7)]"
            style={{
              animation:
                phase === "enter"
                  ? "matchHeart 1.4s cubic-bezier(.34,1.56,.64,1) both"
                  : "heartBeat 1.4s ease-in-out infinite",
            }}
          >
            💖
          </span>
        </div>

        {/* IT'S A MATCH title */}
        <div className="text-center animate-pop-in-cute">
          <span className="inline-block rounded-full bg-baddia-ink text-white px-4 py-1.5 text-[10px] font-display font-black uppercase tracking-[0.25em] shadow-[3px_3px_0_hsl(48_100%_59%)] -rotate-2 mb-2">
            ✦ es un match ✦
          </span>
          <h2 className="font-display font-black text-white text-[42px] leading-[0.95] drop-shadow-[0_4px_0_hsl(260_16%_15%)]">
            IT'S A <span className="text-baddia-yellow">MATCH</span> 💞
          </h2>
          <p className="mt-2 font-display font-black text-white text-[18px] drop-shadow-[0_2px_0_hsl(260_16%_15%)]">
            {score}% · {label || "vibes que combinan"}
          </p>
        </div>

        {/* Cute fact card */}
        <div className="w-full rounded-3xl bg-white border-[2.5px] border-baddia-ink p-4 shadow-[5px_6px_0_hsl(260_16%_15%)] animate-pop-in-cute">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles size={14} className="text-baddia-hot" strokeWidth={2.5} />
            <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/60">
              dato cute
            </p>
          </div>
          <p className="text-[13.5px] text-baddia-ink font-semibold leading-snug">
            {fact}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="btn-sticker w-full py-3 rounded-full bg-gradient-hot text-white text-[13px] uppercase tracking-widest"
        >
          Ver mi lectura ✨
        </button>
      </div>

      <style>{`
        @keyframes matchInLeft {
          0%   { transform: translate(-160%, -50%) rotate(-25deg) scale(.6); opacity: 0; }
          60%  { transform: translate(-70%, -50%) rotate(-8deg) scale(1.05); opacity: 1; }
          100% { transform: translate(-58%, -50%) rotate(-6deg) scale(1); opacity: 1; }
        }
        @keyframes matchInRight {
          0%   { transform: translate(60%, -50%) rotate(25deg) scale(.6); opacity: 0; }
          60%  { transform: translate(-30%, -50%) rotate(8deg) scale(1.05); opacity: 1; }
          100% { transform: translate(-42%, -50%) rotate(6deg) scale(1); opacity: 1; }
        }
        @keyframes matchWiggleLeft {
          0%,100% { transform: translate(-58%, -50%) rotate(-6deg); }
          50%     { transform: translate(-60%, -52%) rotate(-9deg); }
        }
        @keyframes matchWiggleRight {
          0%,100% { transform: translate(-42%, -50%) rotate(6deg); }
          50%     { transform: translate(-40%, -48%) rotate(9deg); }
        }
        @keyframes matchHeart {
          0%   { transform: translate(-50%, -50%) scale(0) rotate(-30deg); opacity: 0; }
          70%  { transform: translate(-50%, -50%) scale(1.4) rotate(10deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1) rotate(0); opacity: 1; }
        }
        @keyframes heartBeat {
          0%,100% { transform: translate(-50%, -50%) scale(1); }
          25%     { transform: translate(-50%, -50%) scale(1.18); }
          50%     { transform: translate(-50%, -50%) scale(1); }
          75%     { transform: translate(-50%, -50%) scale(1.12); }
        }
      `}</style>
    </div>
  );
}
