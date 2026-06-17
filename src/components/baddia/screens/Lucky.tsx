import { useState, useEffect, useCallback } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";

type Result = "si" | "no" | null;

const YES_QUOTES = [
  "La energía dice que sí, pero hazlo con confianza.",
  "El universo asiente. Ve con todo ✨",
  "Sí, y será mejor de lo que imaginas.",
  "Las estrellas aprueban. Tú decide cuándo.",
  "Sí, pero no lo fuerces — deja que fluya.",
];

const NO_QUOTES = [
  "Hoy la vibra dice que mejor esperes.",
  "No ahora… pero el universo tiene algo mejor preparado.",
  "La respuesta es no, y eso es protección, no rechazo.",
  "Espera un poco. Tu momento llega pronto ✨",
  "No hoy. Usa esa energía para ti misma.",
];

function SectionLabel({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-2 pt-1 pl-1">
      <span className="text-base">{emoji}</span>
      <p className="font-display font-black text-[12px] uppercase tracking-[0.15em] text-baddia-ink/70">
        {text}
      </p>
      <span className="h-[2px] flex-1 bg-baddia-ink/15 rounded-full" />
    </div>
  );
}

/* ─────────────── Dice Faces (SVG) ─────────────── */
function DiceFace({ face, className }: { face: Result; className?: string }) {
  if (face === "si") {
    return (
      <svg viewBox="0 0 80 80" className={className}>
        <rect x="4" y="4" width="72" height="72" rx="16" fill="#FF7AC8" stroke="#24202B" strokeWidth="3" />
        <text x="40" y="48" textAnchor="middle" fontSize="26" fontWeight="800" fill="#24202B" fontFamily="Fredoka, sans-serif">SÍ</text>
        <circle cx="22" cy="22" r="3" fill="#FFD12E" />
        <circle cx="58" cy="22" r="3" fill="#FFD12E" />
        <circle cx="22" cy="58" r="3" fill="#FFD12E" />
        <circle cx="58" cy="58" r="3" fill="#FFD12E" />
      </svg>
    );
  }
  if (face === "no") {
    return (
      <svg viewBox="0 0 80 80" className={className}>
        <rect x="4" y="4" width="72" height="72" rx="16" fill="#8B63F7" stroke="#24202B" strokeWidth="3" />
        <text x="40" y="48" textAnchor="middle" fontSize="22" fontWeight="800" fill="#fff" fontFamily="Fredoka, sans-serif">NO</text>
        <circle cx="20" cy="20" r="2.5" fill="#24202B" />
        <circle cx="40" cy="20" r="2.5" fill="#24202B" />
        <circle cx="60" cy="20" r="2.5" fill="#24202B" />
        <circle cx="20" cy="60" r="2.5" fill="#24202B" />
        <circle cx="40" cy="60" r="2.5" fill="#24202B" />
        <circle cx="60" cy="60" r="2.5" fill="#24202B" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <rect x="4" y="4" width="72" height="72" rx="16" fill="#FFF7FB" stroke="#24202B" strokeWidth="3" />
      <circle cx="22" cy="22" r="3.5" fill="#24202B" />
      <circle cx="58" cy="22" r="3.5" fill="#24202B" />
      <circle cx="40" cy="40" r="3.5" fill="#24202B" />
      <circle cx="22" cy="58" r="3.5" fill="#24202B" />
      <circle cx="58" cy="58" r="3.5" fill="#24202B" />
    </svg>
  );
}

/* ─────────────── Sparkles overlay ─────────────── */
function SparkleField() {
  const positions = [
    { top: "12%", left: "8%", delay: "0s", size: 14 },
    { top: "8%", left: "75%", delay: "0.4s", size: 10 },
    { top: "30%", left: "85%", delay: "0.8s", size: 12 },
    { top: "55%", left: "5%", delay: "1.2s", size: 16 },
    { top: "70%", left: "80%", delay: "0.6s", size: 11 },
    { top: "85%", left: "15%", delay: "1.0s", size: 13 },
  ];
  return (
    <>
      {positions.map((p, i) => (
        <span
          key={i}
          className="absolute text-baddia-yellow animate-twinkle pointer-events-none select-none"
          style={{
            top: p.top,
            left: p.left,
            fontSize: p.size,
            animationDelay: p.delay,
          }}
        >
          ✦
        </span>
      ))}
    </>
  );
}

export function Lucky() {
  const { go } = useBaddia();
  const [question, setQuestion] = useState("");
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [face, setFace] = useState<Result>(null);
  const [quote, setQuote] = useState("");

  const roll = useCallback(() => {
    if (!question.trim()) return;
    setRolling(true);
    setResult(null);
    setQuote("");

    let count = 0;
    const interval = setInterval(() => {
      setFace(Math.random() > 0.5 ? "si" : "no");
      count++;
      if (count >= 14) {
        clearInterval(interval);
        const final: Result = Math.random() > 0.5 ? "si" : "no";
        setFace(final);
        setResult(final);
        setQuote(
          final === "si"
            ? YES_QUOTES[Math.floor(Math.random() * YES_QUOTES.length)]
            : NO_QUOTES[Math.floor(Math.random() * NO_QUOTES.length)]
        );
        setRolling(false);
      }
    }, 120);
  }, [question]);

  const reset = useCallback(() => {
    setQuestion("");
    setRolling(false);
    setResult(null);
    setFace(null);
    setQuote("");
  }, []);

  return (
    <div className="relative min-h-full gradient-bg-soft pb-12 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/20" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-soft/25" style={{ animationDelay: "4s" }} />
      <div className="blob top-[700px] -left-10 w-56 h-56 bg-baddia-gold/20" style={{ animationDelay: "2s" }} />
      <SparklesDeco />
      <SparkleField />

      <header className="relative z-10 px-6 pt-8 pb-2">
        <button
          onClick={() => go("daily")}
          className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 bg-white border-2 border-baddia-ink rounded-full shadow-[2px_2px_0_hsl(260_16%_15%)] text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
        >
          <ArrowLeft size={12} strokeWidth={3} /> Volver
        </button>
        <span className="inline-block rounded-full bg-baddia-lavender border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold text-white shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider">
          🎲 Déjalo a la suerte
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          El universo <span className="gradient-text">responde</span> ✨
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Haz tu pregunta, lanza el dado y descubre tu destino.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* Question Input */}
        <SectionLabel emoji="✏️" text="tu pregunta" />
        <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-4">
          <label className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55 ml-1">
            Escribe lo que quieres saber
          </label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ej. ¿Debería mandarle mensaje hoy?"
            disabled={rolling || !!result}
            className="mt-1.5 w-full bg-white rounded-2xl px-4 py-3 text-baddia-ink font-display font-bold placeholder:text-baddia-ink/30 border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none focus:-translate-y-0.5 focus:shadow-[4px_5px_0_hsl(260_16%_15%)] transition-all disabled:opacity-60"
          />
          <button
            disabled={rolling || !question.trim() || !!result}
            onClick={roll}
            className="btn-sticker w-full py-3.5 rounded-full bg-gradient-hot text-white text-[14px] flex items-center justify-center gap-2"
          >
            {rolling ? (
              <>
                <Sparkles size={16} className="animate-spin" />
                Tirando el dado…
              </>
            ) : (
              <>
                <span className="text-lg">🎲</span> Lanzar dado
              </>
            )}
          </button>
        </div>

        {/* Dice Stage */}
        <div className="relative flex flex-col items-center py-6">
          <div
            className={`transition-transform duration-150 ${rolling ? "scale-110" : "scale-100"}`}
            style={rolling ? { animation: "diceShake 0.18s ease-in-out infinite" } : {}}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-baddia-ink rounded-3xl translate-x-2 translate-y-2" />
              <div className="relative w-36 h-36 bg-white border-[2.5px] border-baddia-ink rounded-3xl shadow-[4px_5px_0_hsl(260_16%_15%)] flex items-center justify-center">
                <DiceFace face={face} className="w-24 h-24" />
              </div>
            </div>
          </div>

          {rolling && (
            <p className="mt-4 font-display font-black text-[12px] uppercase tracking-widest text-baddia-ink/60 animate-pulse">
              El universo está pensando…
            </p>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="relative animate-pop-in">
            <div className="absolute -top-3 left-5 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(48_100%_59%)] rotate-1">
                ✦ resultado
              </span>
            </div>
            <div
              className={`relative rounded-3xl border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden text-white ${
                result === "si" ? "gradient-bg-baddia" : "bg-gradient-to-br from-baddia-lavender to-baddia-hot"
              }`}
            >
              <span className="absolute -top-3 -right-2 text-7xl opacity-20 select-none">
                {result === "si" ? "✨" : "🌙"}
              </span>
              <p className="font-display font-black text-[52px] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                {result === "si" ? "SÍ ✨" : "NO 🌙"}
              </p>
              <p className="mt-3 font-display font-bold text-[16px] leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                {quote}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/40 px-3 py-1 text-[10px] font-display font-black uppercase tracking-wider">
                🎲 Déjalo a la suerte
              </div>
            </div>
          </div>
        )}

        {/* Repeat */}
        {result && (
          <button
            onClick={reset}
            className="w-full py-3 rounded-2xl bg-white border-[2.5px] border-baddia-ink text-baddia-ink text-sm font-display font-black uppercase tracking-wider shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
          >
            <RotateCcw size={14} /> Volver a tirar
          </button>
        )}

        <p className="text-[11px] text-center text-baddia-ink/50 font-semibold px-6 pt-3 leading-relaxed">
          Resultados aleatorios solo para entretenimiento ✨ no tomes decisiones importantes basadas en un dado 🎲
        </p>
      </div>

      <style>{`
        @keyframes diceShake {
          0% { transform: rotate(0deg) translate(0, 0); }
          25% { transform: rotate(-8deg) translate(-4px, 2px); }
          50% { transform: rotate(6deg) translate(4px, -2px); }
          75% { transform: rotate(-4deg) translate(-2px, 4px); }
          100% { transform: rotate(0deg) translate(0, 0); }
        }
      `}</style>
    </div>
  );
}
