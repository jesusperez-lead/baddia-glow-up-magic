import { useState, useCallback } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ArrowLeft, RotateCcw, Sparkles, MessageCircleHeart } from "lucide-react";

const DAYS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const TIME_WINDOWS = [
  "por la mañana ☀️",
  "a media tarde 🌤️",
  "al caer la noche 🌙",
  "muy tarde, casi madrugada 🌌",
  "a la hora del café ☕",
];

const HIGH_QUOTES = [
  "Sí, te va a escribir — la energía está más que activa 💌",
  "Está pensando en ti más de lo que crees. Prepara tu mejor respuesta ✨",
  "Sí: el universo ya está empujando ese mensaje hacia tu pantalla 💫",
];
const MID_QUOTES = [
  "Hay chispa, pero necesita un empujón. Publica algo bonito y verás 📱",
  "Está dudando — su energía te busca pero su orgullo lo frena 💭",
  "Probable: una señal tuya y se anima a escribirte 💖",
];
const LOW_QUOTES = [
  "Esta semana no — y eso es protección, no rechazo 🌙",
  "Su energía está dispersa. No esperes, ocupa tu mente en ti 💅",
  "Aún no es el momento. Lo que es para ti, llega sin forzar ✨",
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

type Result = {
  probability: number;
  day: string;
  when: string;
  quote: string;
  band: "high" | "mid" | "low";
};

function weekKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const start = new Date(y, 0, 1);
  const diff = Math.floor((d.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  const week = Math.floor((diff + start.getDay()) / 7);
  return `${y}-W${week}`;
}

export function WriteWeek() {
  const { go, user } = useBaddia();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [progress, setProgress] = useState(0);

  const compute = useCallback(() => {
    if (!name.trim()) return;
    setLoading(true);
    setResult(null);
    setProgress(0);

    const seedStr = `${user.name}|${name.trim().toLowerCase()}|${weekKey()}`;
    const seed = hash(seedStr);
    const probability = 35 + (seed % 61); // 35–95
    const dayIdx = (seed >>> 5) % 7;
    const when = TIME_WINDOWS[(seed >>> 9) % TIME_WINDOWS.length];
    const band: Result["band"] =
      probability >= 75 ? "high" : probability >= 55 ? "mid" : "low";
    const pool = band === "high" ? HIGH_QUOTES : band === "mid" ? MID_QUOTES : LOW_QUOTES;
    const quote = pool[(seed >>> 13) % pool.length];

    let p = 0;
    const interval = setInterval(() => {
      p += 4 + Math.floor(Math.random() * 6);
      if (p >= probability) {
        clearInterval(interval);
        setProgress(probability);
        setResult({ probability, day: DAYS[dayIdx], when, quote, band });
        setLoading(false);
      } else {
        setProgress(p);
      }
    }, 70);
  }, [name, user]);

  const reset = useCallback(() => {
    setName("");
    setResult(null);
    setProgress(0);
    setLoading(false);
  }, []);

  const bandColor =
    result?.band === "high"
      ? "from-baddia-hot via-baddia-bubble to-baddia-lavender"
      : result?.band === "mid"
      ? "from-baddia-yellow via-baddia-bubble to-baddia-lavender"
      : "from-baddia-lavender via-baddia-ink to-baddia-hot/70";

  return (
    <div className="relative min-h-full gradient-bg-soft pb-12 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/25" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-lavender/25" style={{ animationDelay: "4s" }} />
      <div className="blob top-[700px] -left-10 w-56 h-56 bg-baddia-hot/20" style={{ animationDelay: "2s" }} />
      <SparklesDeco />

      <header className="relative z-10 px-6 pt-8 pb-2">
        <button
          onClick={() => go("daily")}
          className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 bg-white border-2 border-baddia-ink rounded-full shadow-[2px_2px_0_hsl(260_16%_15%)] text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
        >
          <ArrowLeft size={12} strokeWidth={3} /> Volver
        </button>
        <span className="inline-block rounded-full bg-baddia-lavender border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold text-white shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider">
          📱 ¿te escribirá?
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          ¿Te escribirá <span className="gradient-text">esta semana?</span> 💌
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Pon su nombre y la IA lee la energía entre ustedes esta semana.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* Input */}
        <SectionLabel emoji="💭" text="¿de quién hablamos?" />
        <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-4">
          <label className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55 ml-1">
            Su nombre (o apodo)
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Alex, Mati, el del gym…"
            disabled={loading || !!result}
            className="mt-1.5 w-full bg-white rounded-2xl px-4 py-3 text-baddia-ink font-display font-bold placeholder:text-baddia-ink/30 border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none focus:-translate-y-0.5 focus:shadow-[4px_5px_0_hsl(260_16%_15%)] transition-all disabled:opacity-60"
          />
          <button
            disabled={loading || !name.trim() || !!result}
            onClick={compute}
            className="btn-sticker w-full py-3.5 rounded-full bg-gradient-hot text-white text-[14px] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Sparkles size={16} className="animate-spin" />
                Leyendo su energía…
              </>
            ) : (
              <>
                <span className="text-lg">📱</span> Ver predicción
              </>
            )}
          </button>
        </div>

        {/* Phone mockup with bubble */}
        <div className="relative flex flex-col items-center py-4">
          <div className="relative w-56">
            <div className="absolute inset-0 bg-baddia-ink rounded-[36px] translate-x-2 translate-y-2" />
            <div className="relative rounded-[36px] border-[2.5px] border-baddia-ink bg-white shadow-[4px_5px_0_hsl(260_16%_15%)] p-4 pt-5 overflow-hidden min-h-[200px]">
              {/* Top bar */}
              <div className="flex items-center justify-between text-[9px] font-display font-black text-baddia-ink/60 mb-3">
                <span>9:41</span>
                <span className="flex items-center gap-1">📶 100%</span>
              </div>
              {/* Bubbles */}
              <div className="space-y-2">
                <div className="self-start max-w-[80%] rounded-2xl rounded-bl-md bg-baddia-bubble/40 border-2 border-baddia-ink/80 px-3 py-2 text-[12px] font-display font-bold text-baddia-ink">
                  Hola tú… 💭
                </div>
                <div className="flex justify-end">
                  <div
                    className={`max-w-[80%] rounded-2xl rounded-br-md border-2 border-baddia-ink/80 px-3 py-2 text-[12px] font-display font-bold ${
                      result ? "bg-baddia-hot text-white animate-pop-in" : "bg-white text-baddia-ink/30"
                    }`}
                  >
                    {result
                      ? `${result.day} ${result.when}`
                      : loading
                      ? "escribiendo…"
                      : "···"}
                  </div>
                </div>
                {loading && (
                  <div className="flex justify-end">
                    <div className="bg-white border-2 border-baddia-ink/30 rounded-2xl px-3 py-2 flex gap-1">
                      <span className="w-1.5 h-1.5 bg-baddia-ink/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-baddia-ink/60 rounded-full animate-bounce" style={{ animationDelay: "120ms" }} />
                      <span className="w-1.5 h-1.5 bg-baddia-ink/60 rounded-full animate-bounce" style={{ animationDelay: "240ms" }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* floating heart sticker */}
            <span className="absolute -top-3 -right-3 w-10 h-10 rounded-full border-[2.5px] border-baddia-ink bg-baddia-yellow flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] text-base rotate-12">
              💌
            </span>
          </div>
        </div>

        {/* Probability bar */}
        {(loading || result) && (
          <div className="rounded-2xl border-[2.5px] border-baddia-ink bg-white p-4 shadow-[3px_3px_0_hsl(260_16%_15%)] space-y-2">
            <div className="flex items-baseline justify-between">
              <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55">
                Probabilidad esta semana
              </p>
              <p className="font-display font-black text-[22px] text-baddia-hot leading-none">
                {progress}%
              </p>
            </div>
            <div className="relative h-3 rounded-full bg-baddia-ink/10 overflow-hidden border-2 border-baddia-ink">
              <div
                className="h-full rounded-full bg-gradient-to-r from-baddia-bubble via-baddia-hot to-baddia-lavender transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Result card */}
        {result && (
          <div className="space-y-4 animate-pop-in">
            <div className="relative">
              <div className="absolute -top-3 left-5 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(48_100%_59%)] rotate-1">
                  ✦ tu predicción
                </span>
              </div>
              <div className={`relative rounded-3xl border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden text-white bg-gradient-to-br ${bandColor}`}>
                <span className="absolute -top-3 -right-2 text-7xl opacity-20 select-none">💌</span>
                <p className="font-display font-black text-[34px] leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {result.day}<br />
                  <span className="text-[20px]">{result.when}</span>
                </p>
                <p className="mt-3 font-display font-bold text-[15px] leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {result.quote}
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/40 px-3 py-1 text-[10px] font-display font-black uppercase tracking-wider">
                  <MessageCircleHeart size={12} /> {result.probability}% de chance
                </div>
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full py-3 rounded-2xl bg-white border-[2.5px] border-baddia-ink text-baddia-ink text-sm font-display font-black uppercase tracking-wider shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
            >
              <RotateCcw size={14} /> Probar con otro nombre
            </button>
          </div>
        )}

        <p className="text-[11px] text-center text-baddia-ink/50 font-semibold px-6 pt-3 leading-relaxed">
          Lectura simbólica solo para entretenimiento ✨ tu poder está en ti, no en su mensaje 💖
        </p>
      </div>
    </div>
  );
}
