import { useCallback, useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ArrowLeft, RotateCcw, Sparkles, Share2 } from "lucide-react";

type Card = {
  id: number;
  name: string;
  emoji: string;
  vibe: string;
  meaning: string;
  color: string; // tailwind bg class
  text: string;  // text color
};

// Mini deck — arcana mayor curada para vibras cute
const DECK: Card[] = [
  { id: 0,  name: "La Loca",          emoji: "🦋", vibe: "free spirit", meaning: "Empieza algo nuevo sin miedo. El universo te respalda.", color: "bg-baddia-bubble",   text: "text-white" },
  { id: 1,  name: "La Maga",          emoji: "✨", vibe: "manifest",    meaning: "Tienes todo lo que necesitas. Es momento de crear.",    color: "bg-baddia-lavender", text: "text-white" },
  { id: 2,  name: "La Sacerdotisa",   emoji: "🌙", vibe: "intuición",   meaning: "Escucha esa voz interna. Tu intuición no se equivoca.", color: "bg-baddia-ink",      text: "text-white" },
  { id: 3,  name: "La Emperatriz",    emoji: "🌷", vibe: "abundancia",  meaning: "Floreces en todo lo que tocas. Recibe sin culpa.",       color: "bg-baddia-hot",      text: "text-white" },
  { id: 4,  name: "Los Enamorados",   emoji: "💞", vibe: "amor",        meaning: "Una conexión real está cerca. Elige desde el corazón.", color: "bg-baddia-bubble",   text: "text-white" },
  { id: 5,  name: "El Carro",         emoji: "🏁", vibe: "victoria",    meaning: "Toma el control. Tu disciplina te lleva lejos.",         color: "bg-baddia-yellow",   text: "text-baddia-ink" },
  { id: 6,  name: "La Fuerza",        emoji: "🦁", vibe: "poder soft",  meaning: "Tu calma es tu superpoder. Domas tus emociones.",        color: "bg-baddia-hot",      text: "text-white" },
  { id: 7,  name: "La Estrella",      emoji: "⭐", vibe: "esperanza",   meaning: "Brilla más fuerte. Tu deseo se está acomodando.",        color: "bg-baddia-lavender", text: "text-white" },
  { id: 8,  name: "La Luna",          emoji: "🌕", vibe: "misterio",    meaning: "Ojo con lo que parece. Confía en lo que sientes.",       color: "bg-baddia-ink",      text: "text-white" },
  { id: 9,  name: "El Sol",           emoji: "☀️", vibe: "glow",        meaning: "Días felices, claridad y energía pa' regalar.",          color: "bg-baddia-yellow",   text: "text-baddia-ink" },
  { id: 10, name: "El Mundo",         emoji: "🌍", vibe: "cierre",      meaning: "Cierras un ciclo con éxito. Lo que sigue es expansión.", color: "bg-baddia-mint",     text: "text-white" },
  { id: 11, name: "La Rueda",         emoji: "🎡", vibe: "cambio",      meaning: "Algo gira a tu favor. Suelta el control.",               color: "bg-baddia-bubble",   text: "text-white" },
  { id: 12, name: "La Templanza",     emoji: "🍯", vibe: "balance",     meaning: "Mezcla suave entre acción y descanso. Fluye.",           color: "bg-baddia-mint",     text: "text-white" },
  { id: 13, name: "La Justicia",      emoji: "⚖️", vibe: "verdad",      meaning: "Lo que es para ti, llega. Lo que no, se va.",            color: "bg-baddia-lavender", text: "text-white" },
  { id: 14, name: "La Ermitaña",      emoji: "🕯️", vibe: "introspect",  meaning: "Tiempo a solas. Te estás reencontrando.",                color: "bg-baddia-ink",      text: "text-white" },
  { id: 15, name: "El Colgado",       emoji: "🪷", vibe: "pausa",       meaning: "Cambia el ángulo. Lo que ves ahora no es todo.",         color: "bg-baddia-mint",     text: "text-white" },
];

const POSITIONS = [
  { key: "pasado",   label: "Pasado",   emoji: "🌗", hint: "lo que dejas atrás" },
  { key: "presente", label: "Presente", emoji: "✨", hint: "tu energía hoy" },
  { key: "futuro",   label: "Futuro",   emoji: "🌙", hint: "lo que se acerca" },
] as const;

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

/* Card back — sticker neo-brutalist */
function CardBack({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full h-full rounded-2xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-baddia-lavender via-baddia-bubble to-baddia-hot flex items-center justify-center overflow-hidden ${className}`}>
      <span className="absolute inset-2 rounded-xl border-2 border-white/40" />
      <span className="text-3xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]">✦</span>
      <span className="absolute top-2 left-2 text-[10px] font-display font-black text-white/80">B</span>
      <span className="absolute bottom-2 right-2 text-[10px] font-display font-black text-white/80 rotate-180">B</span>
    </div>
  );
}

function CardFront({ card, className = "" }: { card: Card; className?: string }) {
  return (
    <div className={`relative w-full h-full rounded-2xl border-[2.5px] border-baddia-ink ${card.color} ${card.text} flex flex-col items-center justify-between p-2 overflow-hidden ${className}`}>
      <span className="self-start text-[9px] font-display font-black uppercase tracking-widest opacity-80">
        {String(card.id).padStart(2, "0")}
      </span>
      <span className="text-4xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]">{card.emoji}</span>
      <span className="text-[10px] font-display font-black uppercase tracking-wider text-center leading-tight">
        {card.name}
      </span>
    </div>
  );
}

export function Tarot() {
  const { go, user } = useBaddia();
  const [question, setQuestion] = useState("");
  const [drawing, setDrawing] = useState(false);
  const [cards, setCards] = useState<Card[] | null>(null);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);

  const draw = useCallback(() => {
    setDrawing(true);
    setCards(null);
    setRevealed([false, false, false]);

    // shuffle and pick 3
    setTimeout(() => {
      const shuffled = [...DECK].sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, 3);
      setCards(picked);
      setDrawing(false);
      // reveal one by one
      picked.forEach((_, i) => {
        setTimeout(() => {
          setRevealed((r) => {
            const n = [...r];
            n[i] = true;
            return n;
          });
        }, 400 + i * 700);
      });
    }, 900);
  }, []);

  const reset = useCallback(() => {
    setCards(null);
    setRevealed([false, false, false]);
    setQuestion("");
  }, []);

  const allRevealed = cards && revealed.every(Boolean);

  const overallVibe = (() => {
    if (!cards) return "";
    const vibes = cards.map((c) => c.vibe);
    return `${vibes.join(" · ")}`;
  })();

  const handleShare = async () => {
    if (!cards) return;
    const text =
      `🔮 Mi tarot del día — Baddia\n` +
      cards.map((c, i) => `${POSITIONS[i].emoji} ${POSITIONS[i].label}: ${c.name} — ${c.vibe}`).join("\n") +
      (question ? `\n\nPregunta: ${question}` : "");
    try {
      if (navigator.share) await navigator.share({ title: "Mi tarot del día", text });
      else await navigator.clipboard.writeText(text);
    } catch { /* no-op */ }
  };

  return (
    <div className="relative min-h-full gradient-bg-soft pb-12 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-lavender/25" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-bubble/25" style={{ animationDelay: "4s" }} />
      <div className="blob top-[720px] -left-10 w-56 h-56 bg-baddia-yellow/20" style={{ animationDelay: "2s" }} />
      <SparklesDeco />

      <header className="relative z-10 px-6 pt-8 pb-2">
        <button
          onClick={() => go("daily")}
          className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 bg-white border-2 border-baddia-ink rounded-full shadow-[2px_2px_0_hsl(260_16%_15%)] text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
        >
          <ArrowLeft size={12} strokeWidth={3} /> Volver
        </button>
        <span className="inline-block rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold shadow-[3px_3px_0_hsl(48_100%_59%)] -rotate-2 mb-3 uppercase tracking-wider">
          🔮 Tarot del día
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          3 cartas <span className="gradient-text">para hoy</span> ✨
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Hola {user.name}, respira hondo, piensa en tu pregunta y deja que las cartas hablen.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* Question */}
        <SectionLabel emoji="✏️" text="tu intención" />
        <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-4">
          <label className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55 ml-1">
            Pregúntale al universo (opcional)
          </label>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ej. ¿Qué energía traigo esta semana?"
            disabled={drawing || !!cards}
            className="mt-1.5 w-full bg-white rounded-2xl px-4 py-3 text-baddia-ink font-display font-bold placeholder:text-baddia-ink/30 border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none focus:-translate-y-0.5 focus:shadow-[4px_5px_0_hsl(260_16%_15%)] transition-all disabled:opacity-60"
          />
          {!cards && (
            <button
              disabled={drawing}
              onClick={draw}
              className="btn-sticker w-full py-3.5 rounded-full bg-gradient-hot text-white text-[14px] flex items-center justify-center gap-2"
            >
              {drawing ? (
                <>
                  <Sparkles size={16} className="animate-spin" />
                  Barajando…
                </>
              ) : (
                <>
                  <span className="text-lg">🔮</span> Tirar las cartas
                </>
              )}
            </button>
          )}
        </div>

        {/* Cards stage */}
        <SectionLabel emoji="🃏" text="tu tirada" />
        <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-4 shadow-[5px_6px_0_hsl(260_16%_15%)]">
          <div className="grid grid-cols-3 gap-3">
            {POSITIONS.map((pos, i) => {
              const card = cards?.[i];
              const isRevealed = revealed[i];
              return (
                <div key={pos.key} className="flex flex-col items-center gap-2">
                  <div
                    className="tarot-card"
                    style={{
                      animationDelay: drawing ? `${i * 0.12}s` : undefined,
                      animation: drawing ? "tarotShuffle 0.9s ease-in-out" : undefined,
                    }}
                  >
                    <div className={`tarot-flip ${isRevealed ? "is-flipped" : ""}`}>
                      <div className="tarot-face tarot-back">
                        <CardBack />
                      </div>
                      <div className="tarot-face tarot-front">
                        {card ? <CardFront card={card} /> : <CardBack />}
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] font-display font-black uppercase tracking-wider text-baddia-ink/70 text-center leading-tight">
                    {pos.emoji} {pos.label}
                  </p>
                  <p className="text-[9px] text-baddia-ink/50 font-semibold text-center leading-tight -mt-1">
                    {pos.hint}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Readings */}
        {cards && (
          <div className="space-y-3">
            {cards.map((c, i) =>
              revealed[i] ? (
                <div
                  key={i}
                  className="relative animate-pop-in rounded-2xl bg-white border-[2.5px] border-baddia-ink p-4 shadow-[4px_4px_0_hsl(260_16%_15%)]"
                >
                  <div className="flex items-start gap-3">
                    <span className={`shrink-0 w-12 h-12 rounded-xl border-2 border-baddia-ink ${c.color} ${c.text} flex items-center justify-center text-xl`}>
                      {c.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55">
                          {POSITIONS[i].emoji} {POSITIONS[i].label}
                        </span>
                        <span className="text-[9px] font-display font-black uppercase tracking-wider rounded-full bg-baddia-yellow border-2 border-baddia-ink px-2 py-[1px] text-baddia-ink">
                          {c.vibe}
                        </span>
                      </div>
                      <h3 className="font-display font-black text-[16px] text-baddia-ink leading-tight mt-0.5">
                        {c.name}
                      </h3>
                      <p className="text-[13px] text-baddia-ink/75 font-semibold leading-snug mt-1">
                        {c.meaning}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null
            )}
          </div>
        )}

        {/* Overall + actions */}
        {allRevealed && (
          <div className="relative animate-pop-in">
            <div className="absolute -top-3 left-5 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(48_100%_59%)] rotate-1">
                ✦ tu mensaje
              </span>
            </div>
            <div className="relative rounded-3xl border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden text-white gradient-bg-baddia">
              <span className="absolute -top-3 -right-2 text-7xl opacity-20 select-none">🔮</span>
              <p className="font-display font-black text-[20px] leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                Tu energía hoy vibra en {cards![1].vibe}.
              </p>
              <p className="mt-2 font-display font-bold text-[14px] leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] opacity-95">
                Dejas atrás {cards![0].vibe.toLowerCase()} y caminas hacia {cards![2].vibe.toLowerCase()}. Confía en el proceso ✨
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/40 px-3 py-1 text-[10px] font-display font-black uppercase tracking-wider">
                {overallVibe}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <button
                onClick={handleShare}
                className="py-3 rounded-2xl bg-baddia-yellow border-[2.5px] border-baddia-ink text-baddia-ink text-[12px] font-display font-black uppercase tracking-wider shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
              >
                <Share2 size={14} /> Compartir
              </button>
              <button
                onClick={reset}
                className="py-3 rounded-2xl bg-white border-[2.5px] border-baddia-ink text-baddia-ink text-[12px] font-display font-black uppercase tracking-wider shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
              >
                <RotateCcw size={14} /> Otra tirada
              </button>
            </div>
          </div>
        )}

        <p className="text-[11px] text-center text-baddia-ink/50 font-semibold px-6 pt-3 leading-relaxed">
          Las cartas son una guía simbólica ✨ tú escribes tu propia historia 💖
        </p>
      </div>

      <style>{`
        .tarot-card {
          width: 100%;
          aspect-ratio: 2 / 3;
          perspective: 800px;
        }
        .tarot-flip {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.7s cubic-bezier(.34,1.56,.64,1);
        }
        .tarot-flip.is-flipped { transform: rotateY(180deg); }
        .tarot-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .tarot-front { transform: rotateY(180deg); }
        @keyframes tarotShuffle {
          0%   { transform: translateY(0) rotate(0); }
          30%  { transform: translateY(-12px) rotate(-6deg); }
          60%  { transform: translateY(6px) rotate(4deg); }
          100% { transform: translateY(0) rotate(0); }
        }
      `}</style>
    </div>
  );
}
