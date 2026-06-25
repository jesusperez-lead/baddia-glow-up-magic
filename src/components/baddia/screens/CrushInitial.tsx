import { useState, useCallback } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ArrowLeft, RotateCcw, Sparkles, Copy, Heart } from "lucide-react";
import { toast } from "sonner";

const MESSAGES = [
  "“Hey, soñé contigo anoche y tenía que contártelo 👀”",
  "“Tengo una pregunta random, pero solo tú me la puedes responder ✨”",
  "“Estaba escuchando una canción y me acordé de ti 💭”",
  "“¿Estás libre esta semana? Tengo un plan que te va a encantar 💌”",
  "“No vas a creer lo que me pasó hoy, te tengo que contar 💕”",
  "“Hola tú… solo quería decirte que pienso en ti más de lo normal 🙈”",
  "“Te vi en mis recuerdos y sonreí, ¿cómo has estado? 🌙”",
  "“Necesito tu opinión en algo importante, ¿tienes 5 minutos? ✨”",
  "“Adivina en quién pensé apenas desperté 💖”",
  "“Tengo ganas de verte. Sin filtros. Sin excusas. 💫”",
];

const VIBES = [
  "energía cálida y juguetona",
  "vibra magnética e intensa",
  "aura dulce y misteriosa",
  "energía protectora y leal",
  "vibra creativa y soñadora",
  "presencia firme y elegante",
];

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

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

export function CrushInitial() {
  const { go, user } = useBaddia();
  const [intent, setIntent] = useState("");
  const [revealing, setRevealing] = useState(false);
  const [letter, setLetter] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [vibe, setVibe] = useState<string>("");
  const [flicker, setFlicker] = useState("?");

  const reveal = useCallback(() => {
    if (!intent.trim()) return;
    setRevealing(true);
    setLetter(null);
    setMessage("");

    const today = new Date();
    const seedStr = `${user.name}|${user.day}-${user.month}-${user.year}|${intent.trim().toLowerCase()}|${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const seed = hash(seedStr);

    const finalLetter = String.fromCharCode(65 + (seed % 26));
    const finalMsg = MESSAGES[(seed >>> 5) % MESSAGES.length];
    const finalVibe = VIBES[(seed >>> 9) % VIBES.length];

    let count = 0;
    const interval = setInterval(() => {
      setFlicker(String.fromCharCode(65 + Math.floor(Math.random() * 26)));
      count++;
      if (count >= 16) {
        clearInterval(interval);
        setLetter(finalLetter);
        setMessage(finalMsg);
        setVibe(finalVibe);
        setRevealing(false);
      }
    }, 90);
  }, [intent, user]);

  const reset = useCallback(() => {
    setIntent("");
    setLetter(null);
    setMessage("");
    setVibe("");
    setRevealing(false);
    setFlicker("?");
  }, []);

  const copyMsg = async () => {
    try {
      await navigator.clipboard.writeText(message.replace(/[“”]/g, ""));
      toast.success("Mensaje copiado ✨");
    } catch {
      toast.error("No pude copiar");
    }
  };

  return (
    <div className="relative min-h-full gradient-bg-soft pb-12 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/25" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-hot/20" style={{ animationDelay: "4s" }} />
      <div className="blob top-[700px] -left-10 w-56 h-56 bg-baddia-lavender/25" style={{ animationDelay: "2s" }} />
      <SparklesDeco />

      <header className="relative z-10 px-6 pt-8 pb-2">
        <button
          onClick={() => go("daily")}
          className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 bg-white border-2 border-baddia-ink rounded-full shadow-[2px_2px_0_hsl(260_16%_15%)] text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
        >
          <ArrowLeft size={12} strokeWidth={3} /> Volver
        </button>
        <span className="inline-block rounded-full bg-baddia-hot border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold text-white shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider">
          💌 Inicial y mensaje
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          La inicial de <span className="gradient-text">su nombre</span> 💖
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Concéntrate en esa persona. La IA te revela la inicial y el mensaje exacto.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* Intent input */}
        <SectionLabel emoji="✏️" text="¿qué quieres saber?" />
        <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-4">
          <label className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55 ml-1">
            Tu intención (en una línea)
          </label>
          <input
            value={intent}
            onChange={(e) => setIntent(e.target.value)}
            placeholder="Ej. Quiero saber quién pensará en mí hoy"
            disabled={revealing || !!letter}
            className="mt-1.5 w-full bg-white rounded-2xl px-4 py-3 text-baddia-ink font-display font-bold placeholder:text-baddia-ink/30 border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none focus:-translate-y-0.5 focus:shadow-[4px_5px_0_hsl(260_16%_15%)] transition-all disabled:opacity-60"
          />
          <button
            disabled={revealing || !intent.trim() || !!letter}
            onClick={reveal}
            className="btn-sticker w-full py-3.5 rounded-full bg-gradient-hot text-white text-[14px] flex items-center justify-center gap-2"
          >
            {revealing ? (
              <>
                <Sparkles size={16} className="animate-spin" />
                Leyendo la energía…
              </>
            ) : (
              <>
                <span className="text-lg">💘</span> Revelar inicial
              </>
            )}
          </button>
        </div>

        {/* Letter stage */}
        <div className="relative flex flex-col items-center py-6">
          <div className="relative">
            <div className="absolute inset-0 bg-baddia-ink rounded-[40px] translate-x-2 translate-y-2" />
            <div
              className={`relative w-40 h-40 rounded-[40px] border-[2.5px] border-baddia-ink bg-gradient-to-br from-baddia-bubble via-white to-baddia-lavender/40 shadow-[4px_5px_0_hsl(260_16%_15%)] flex items-center justify-center overflow-hidden ${
                revealing ? "" : letter ? "animate-pop-in" : ""
              }`}
              style={revealing ? { animation: "letterShake 0.18s ease-in-out infinite" } : {}}
            >
              <span className="absolute -top-2 -right-2 text-5xl opacity-25 select-none">💖</span>
              <span className="absolute -bottom-3 -left-2 text-4xl opacity-20 select-none">✨</span>
              <span className="font-display font-black text-[96px] leading-none text-baddia-ink drop-shadow-[0_3px_0_rgba(255,122,200,0.5)]">
                {letter ?? (revealing ? flicker : "?")}
              </span>
            </div>
          </div>
          {revealing && (
            <p className="mt-4 font-display font-black text-[12px] uppercase tracking-widest text-baddia-ink/60 animate-pulse">
              El universo está afinando…
            </p>
          )}
        </div>

        {/* Result */}
        {letter && (
          <div className="space-y-4 animate-pop-in">
            <div className="relative">
              <div className="absolute -top-3 left-5 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(48_100%_59%)] rotate-1">
                  ✦ su inicial
                </span>
              </div>
              <div className="relative rounded-3xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-baddia-hot via-baddia-bubble to-baddia-lavender p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] text-white overflow-hidden">
                <span className="absolute -top-3 -right-2 text-7xl opacity-20 select-none">💌</span>
                <p className="font-display font-black text-[44px] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  Empieza con {letter}…
                </p>
                <p className="mt-3 font-display font-bold text-[15px] leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  Esa persona tiene una {vibe} y su nombre comienza por la letra <b>{letter}</b>.
                </p>
              </div>
            </div>

            {/* Exact message */}
            <div className="relative">
              <div className="absolute -top-3 left-5 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-yellow border-2 border-baddia-ink text-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
                  💬 mensaje exacto
                </span>
              </div>
              <div className="relative rounded-3xl border-[2.5px] border-baddia-ink bg-white p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)]">
                <p className="font-display font-bold text-[17px] text-baddia-ink leading-snug">
                  {message}
                </p>
                <button
                  onClick={copyMsg}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-baddia-ink text-white px-4 py-2 text-[11px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(335_100%_59%)] active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(335_100%_59%)] transition-all"
                >
                  <Copy size={12} strokeWidth={3} /> Copiar mensaje
                </button>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-baddia-ink/15 bg-white/60 p-3 flex items-start gap-2">
              <Heart size={14} className="text-baddia-hot mt-0.5 shrink-0 fill-baddia-hot" />
              <p className="text-[11px] text-baddia-ink/70 font-semibold leading-relaxed">
                Tip: envíalo solo si lo sientes. La energía funciona mejor con intención auténtica ✨
              </p>
            </div>

            <button
              onClick={reset}
              className="w-full py-3 rounded-2xl bg-white border-[2.5px] border-baddia-ink text-baddia-ink text-sm font-display font-black uppercase tracking-wider shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
            >
              <RotateCcw size={14} /> Hacer otra lectura
            </button>
          </div>
        )}

        <p className="text-[11px] text-center text-baddia-ink/50 font-semibold px-6 pt-3 leading-relaxed">
          Lectura simbólica solo para entretenimiento 💖 confía en tu intuición.
        </p>
      </div>

      <style>{`
        @keyframes letterShake {
          0% { transform: rotate(0deg) translate(0, 0); }
          25% { transform: rotate(-4deg) translate(-3px, 1px); }
          50% { transform: rotate(3deg) translate(3px, -1px); }
          75% { transform: rotate(-2deg) translate(-1px, 2px); }
          100% { transform: rotate(0deg) translate(0, 0); }
        }
      `}</style>
    </div>
  );
}
