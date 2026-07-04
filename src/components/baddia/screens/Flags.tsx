import { useMemo, useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ArrowLeft, Lock, ArrowRight, Share2, Sparkles } from "lucide-react";
import { ShareGlowSheet } from "../ShareGlowSheet";

const RELATIONS = ["Crush", "Ex", "Casi algo", "Pareja", "Amistad", "Conociendo"];

const QUESTIONS: { q: string; good: boolean }[] = [
  { q: "¿Te responde rápido?", good: true },
  { q: "¿Te busca sin que insistas?", good: true },
  { q: "¿Es claro con lo que quiere?", good: true },
  { q: "¿Te hace sentir tranquila?", good: true },
  { q: "¿Aparece y desaparece?", good: false },
  { q: "¿Te da atención solo cuando quiere?", good: false },
  { q: "¿Respeta tus límites?", good: true },
  { q: "¿Evita hablar de futuro?", good: false },
];

export function Flags() {
  const { user, openPaywall, go } = useBaddia();
  const isPro = user.plan !== "Free";
  const [name, setName] = useState("");
  const [rel, setRel] = useState<string>("Crush");
  const [picks, setPicks] = useState<Record<number, boolean>>({});
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const { green, red } = useMemo(() => {
    let g = 0, r = 0;
    Object.entries(picks).forEach(([i, v]) => {
      if (!v) return;
      const good = QUESTIONS[+i].good;
      if (good) g++; else r++;
    });
    if (g + r === 0) return { green: 60, red: 40 };
    const total = g + r;
    return { green: Math.round((g / total) * 100), red: Math.round((r / total) * 100) };
  }, [picks]);

  const level =
    green >= 75 ? "Buena energía ✨" :
    green >= 55 ? "Bonita pero inestable 💫" :
    green >= 40 ? "Energía confusa 🌫️" :
    "Señal de alerta 🚨";

  const advice =
    green >= 60
      ? "Baddia dice: observa sin apurar, esa energía se está acomodando bonito."
      : "Baddia dice: observa, no persigas. Tu paz vale más que su intermitencia.";

  const shareQuote = `${level} — Green ${green}% · Red ${red}% ✨`;

  return (
    <div className="relative min-h-full bg-white pb-12 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/25" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-soft/30" style={{ animationDelay: "4s" }} />
      <SparklesDeco />

      <header className="relative z-10 px-6 pt-8 pb-2">
        <button
          onClick={() => go("daily")}
          className="w-10 h-10 rounded-full bg-white border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center mb-3 active:translate-y-[2px] transition-all"
          aria-label="Volver"
        >
          <ArrowLeft size={16} className="text-baddia-ink" />
        </button>
        <span className="inline-block rounded-full bg-baddia-hot text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider">
          🚩 red / 💚 green flags
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          ¿Qué energía <span className="gradient-text">tiene esa persona?</span>
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Cuéntale a Baddia cómo se comporta y descubre sus flags reales.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* Datos */}
        <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-4">
          <div>
            <label className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55 ml-1">
              Nombre o inicial
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. L o Lucas"
              className="mt-1.5 w-full bg-white rounded-2xl px-4 py-3 text-baddia-ink font-display font-bold placeholder:text-baddia-ink/30 border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none"
            />
          </div>
          <div>
            <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55 ml-1 mb-1.5">
              Tipo de relación
            </p>
            <div className="flex flex-wrap gap-2">
              {RELATIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setRel(r)}
                  className={`px-3 py-1.5 rounded-full border-2 border-baddia-ink text-[12px] font-display font-black transition-all ${
                    rel === r
                      ? "bg-baddia-hot text-white shadow-[2px_2px_0_hsl(260_16%_15%)]"
                      : "bg-white text-baddia-ink"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preguntas */}
        <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-3">
          <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55">
            marca lo que aplica
          </p>
          <div className="flex flex-wrap gap-2">
            {QUESTIONS.map((it, i) => {
              const active = !!picks[i];
              return (
                <button
                  key={i}
                  onClick={() => setPicks((p) => ({ ...p, [i]: !p[i] }))}
                  className={`px-3 py-2 rounded-full border-2 border-baddia-ink text-[12px] font-display font-bold transition-all ${
                    active
                      ? it.good
                        ? "bg-baddia-mint text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)]"
                        : "bg-baddia-hot text-white shadow-[2px_2px_0_hsl(260_16%_15%)]"
                      : "bg-white text-baddia-ink/70"
                  }`}
                >
                  {it.q}
                </button>
              );
            })}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Cuéntale a Baddia qué pasó…"
            rows={3}
            className="w-full bg-white rounded-2xl px-4 py-3 text-[13px] text-baddia-ink font-medium placeholder:text-baddia-ink/40 border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none resize-none"
          />
          <button
            onClick={() => setDone(true)}
            disabled={!name.trim()}
            className="btn-sticker w-full py-3.5 rounded-full bg-gradient-hot text-white text-[14px] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles size={16} /> Leer su energía
          </button>
        </div>

        {done && (
          <>
            {/* Energía general */}
            <div className="relative animate-pop-in">
              <div className="absolute -top-3 left-5 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(48_100%_59%)] rotate-1">
                  ✦ energía general
                </span>
              </div>
              <div className="rounded-3xl border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] gradient-bg-baddia text-white">
                <p className="font-display font-black text-[24px] leading-tight">
                  {level}
                </p>
                <p className="text-[13px] font-semibold opacity-90 mt-1">
                  {name || "Esa persona"} · {rel.toLowerCase()}
                </p>
                <div className="mt-4 h-4 rounded-full border-2 border-white/60 bg-white/20 overflow-hidden flex">
                  <div className="h-full bg-baddia-mint" style={{ width: `${green}%` }} />
                  <div className="h-full bg-baddia-hot" style={{ width: `${red}%` }} />
                </div>
                <div className="flex justify-between mt-2 text-[11px] font-display font-black">
                  <span>💚 {green}% green</span>
                  <span>🚩 {red}% red</span>
                </div>
              </div>
            </div>

            {/* Green flags */}
            <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)]">
              <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-mint mb-2">
                💚 green flags
              </p>
              <ul className="space-y-1.5 text-[13px] font-medium text-baddia-ink">
                <li>· Te hace sentir vista y tranquila.</li>
                {isPro && <li>· Coincide con lo que dices querer.</li>}
                {isPro && <li>· Sostiene la conversación sin desaparecer.</li>}
              </ul>
            </div>

            {/* Red flags */}
            <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)]">
              <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-hot mb-2">
                🚩 red flags
              </p>
              <ul className="space-y-1.5 text-[13px] font-medium text-baddia-ink">
                <li>· Te da atención solo cuando le conviene.</li>
                {isPro && <li>· Evita definir lo que son.</li>}
                {isPro && <li>· Reaparece cuando siente que te alejas.</li>}
              </ul>
            </div>

            {/* Consejo */}
            <div className="rounded-3xl bg-gradient-to-br from-pink-50 to-baddia-soft/30 border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)]">
              <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55 mb-2">
                💖 consejo baddia
              </p>
              <p className="font-display font-bold text-[16px] text-baddia-ink leading-snug">
                "{advice}"
              </p>
              <button
                onClick={() => setShareOpen(true)}
                className="btn-sticker mt-4 w-full py-2.5 rounded-full bg-gradient-hot text-white text-[12px] flex items-center justify-center gap-1.5"
              >
                <Share2 size={14} /> Compartir mi lectura
              </button>
            </div>

            {!isPro && (
              <button
                onClick={openPaywall}
                className="relative w-full text-left active:scale-[0.99] transition-transform"
              >
                <div className="absolute -top-3 left-5 z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-gold text-baddia-ink border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
                    <Lock size={10} /> Análisis completo
                  </span>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-baddia-gold/30 via-pink-100 to-baddia-soft/40 border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)]">
                  <p className="font-display font-black text-baddia-ink text-[17px] leading-snug">
                    Desbloquea señales mixtas, compatibilidad emocional e historial de esa persona ✨
                  </p>
                  <div className="btn-sticker w-full mt-4 py-3 rounded-full bg-gradient-hot text-white text-[13px] flex items-center justify-center gap-1.5">
                    <Lock size={13} /> Desbloquear con Baddia Pro <ArrowRight size={14} />
                  </div>
                </div>
              </button>
            )}
          </>
        )}
      </div>
      <ShareGlowSheet open={shareOpen} onClose={() => setShareOpen(false)} quote={shareQuote} />
    </div>
  );
}
