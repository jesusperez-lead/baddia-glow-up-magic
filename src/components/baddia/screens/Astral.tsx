import { useMemo, useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ArrowLeft, RotateCcw, Sparkles, Share2, Star } from "lucide-react";

type Sign = {
  name: string;
  emoji: string;
  element: "Fuego" | "Tierra" | "Aire" | "Agua";
  modality: "Cardinal" | "Fijo" | "Mutable";
  color: string;
  text: string;
  vibe: string;
};

const SIGNS: Sign[] = [
  { name: "Aries",       emoji: "♈", element: "Fuego", modality: "Cardinal", color: "bg-baddia-hot",      text: "text-white",     vibe: "fuego puro" },
  { name: "Tauro",       emoji: "♉", element: "Tierra", modality: "Fijo",     color: "bg-baddia-mint",     text: "text-white",     vibe: "lujo lento" },
  { name: "Géminis",     emoji: "♊", element: "Aire",   modality: "Mutable",  color: "bg-baddia-yellow",   text: "text-baddia-ink",vibe: "chispa social" },
  { name: "Cáncer",      emoji: "♋", element: "Agua",   modality: "Cardinal", color: "bg-baddia-bubble",   text: "text-white",     vibe: "soft & deep" },
  { name: "Leo",         emoji: "♌", element: "Fuego",  modality: "Fijo",     color: "bg-baddia-hot",      text: "text-white",     vibe: "spotlight" },
  { name: "Virgo",       emoji: "♍", element: "Tierra", modality: "Mutable",  color: "bg-baddia-mint",     text: "text-white",     vibe: "clean glow" },
  { name: "Libra",       emoji: "♎", element: "Aire",   modality: "Cardinal", color: "bg-baddia-bubble",   text: "text-white",     vibe: "pretty mind" },
  { name: "Escorpio",    emoji: "♏", element: "Agua",   modality: "Fijo",     color: "bg-baddia-lavender", text: "text-white",     vibe: "magnetic" },
  { name: "Sagitario",   emoji: "♐", element: "Fuego",  modality: "Mutable",  color: "bg-baddia-hot",      text: "text-white",     vibe: "wild trip" },
  { name: "Capricornio", emoji: "♑", element: "Tierra", modality: "Cardinal", color: "bg-baddia-ink",      text: "text-white",     vibe: "ceo era" },
  { name: "Acuario",     emoji: "♒", element: "Aire",   modality: "Fijo",     color: "bg-baddia-lavender", text: "text-white",     vibe: "alien chic" },
  { name: "Piscis",      emoji: "♓", element: "Agua",   modality: "Mutable",  color: "bg-baddia-bubble",   text: "text-white",     vibe: "dreamy" },
];

const SIGN_BY_NAME = Object.fromEntries(SIGNS.map((s) => [s.name, s]));

// Sun sign from month/day
function sunSign(month: number, day: number): Sign {
  const d = month * 100 + day;
  if (d >= 321 && d <= 419) return SIGN_BY_NAME["Aries"];
  if (d >= 420 && d <= 520) return SIGN_BY_NAME["Tauro"];
  if (d >= 521 && d <= 620) return SIGN_BY_NAME["Géminis"];
  if (d >= 621 && d <= 722) return SIGN_BY_NAME["Cáncer"];
  if (d >= 723 && d <= 822) return SIGN_BY_NAME["Leo"];
  if (d >= 823 && d <= 922) return SIGN_BY_NAME["Virgo"];
  if (d >= 923 && d <= 1022) return SIGN_BY_NAME["Libra"];
  if (d >= 1023 && d <= 1121) return SIGN_BY_NAME["Escorpio"];
  if (d >= 1122 && d <= 1221) return SIGN_BY_NAME["Sagitario"];
  if (d >= 1222 || d <= 119) return SIGN_BY_NAME["Capricornio"];
  if (d >= 120 && d <= 218) return SIGN_BY_NAME["Acuario"];
  return SIGN_BY_NAME["Piscis"];
}

// Deterministic pseudo-random sign from a seed (cute, not astronomically real)
function pseudoSign(seed: number): Sign {
  const x = Math.sin(seed) * 10000;
  const f = x - Math.floor(x);
  return SIGNS[Math.floor(f * SIGNS.length)];
}

const PLANET_DEFS = [
  { key: "sun",     name: "Sol",         emoji: "☀️", hint: "tu esencia" },
  { key: "moon",    name: "Luna",        emoji: "🌙", hint: "tus emociones" },
  { key: "rising",  name: "Ascendente",  emoji: "⬆️", hint: "cómo te ven" },
  { key: "venus",   name: "Venus",       emoji: "💗", hint: "cómo amas" },
  { key: "mars",    name: "Marte",       emoji: "🔥", hint: "tu deseo" },
  { key: "mercury", name: "Mercurio",    emoji: "💬", hint: "cómo piensas" },
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

/* Natal wheel — sticker circle with 12 signs around */
function NatalWheel({ chart }: { chart: Record<string, Sign> }) {
  const radius = 110;
  const center = 130;
  const planetEntries = PLANET_DEFS.map((p, i) => ({
    ...p,
    sign: chart[p.key],
    angle: (i / PLANET_DEFS.length) * 360 + 15,
  }));

  return (
    <div className="relative mx-auto" style={{ width: 260, height: 260 }}>
      {/* outer ring */}
      <div className="absolute inset-0 rounded-full border-[2.5px] border-baddia-ink bg-gradient-to-br from-baddia-soft-purple/40 via-white to-baddia-bubble/30 shadow-[5px_6px_0_hsl(260_16%_15%)]" />
      {/* inner ring */}
      <div className="absolute inset-6 rounded-full border-2 border-baddia-ink/30 bg-white/60" />
      {/* zodiac slices */}
      {SIGNS.map((s, i) => {
        const angle = (i / 12) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = center + Math.cos(rad) * (radius - 2);
        const y = center + Math.sin(rad) * (radius - 2);
        return (
          <span
            key={s.name}
            className="absolute text-[14px] font-display font-black text-baddia-ink/70 select-none"
            style={{
              left: x,
              top: y,
              transform: "translate(-50%, -50%)",
            }}
          >
            {s.emoji}
          </span>
        );
      })}
      {/* center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 border-baddia-ink bg-baddia-ink text-white flex flex-col items-center justify-center shadow-[3px_3px_0_hsl(48_100%_59%)]">
        <Star size={16} className="text-baddia-yellow fill-baddia-yellow" />
        <span className="text-[8px] font-display font-black uppercase tracking-widest mt-0.5">natal</span>
      </div>
      {/* planet stickers */}
      {planetEntries.map((p) => {
        const rad = ((p.angle - 90) * Math.PI) / 180;
        const r = radius - 38;
        const x = center + Math.cos(rad) * r;
        const y = center + Math.sin(rad) * r;
        return (
          <span
            key={p.key}
            className={`absolute w-9 h-9 rounded-full border-2 border-baddia-ink ${p.sign.color} ${p.sign.text} flex items-center justify-center text-base shadow-[2px_2px_0_hsl(260_16%_15%)]`}
            style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
            title={`${p.name} en ${p.sign.name}`}
          >
            {p.emoji}
          </span>
        );
      })}
    </div>
  );
}

export function Astral() {
  const { go, user } = useBaddia();
  const [time, setTime] = useState("12:00");
  const [city, setCity] = useState("");
  const [computing, setComputing] = useState(false);
  const [done, setDone] = useState(false);

  const chart = useMemo(() => {
    const m = parseInt(user.month || "1", 10);
    const d = parseInt(user.day || "1", 10);
    const y = parseInt(user.year || "2000", 10);
    const [hh, mm] = time.split(":").map((n) => parseInt(n || "0", 10));
    const sun = sunSign(m, d);
    const baseSeed = y * 10000 + m * 100 + d + (hh || 0) * 7 + (mm || 0);
    const moon = pseudoSign(baseSeed + 13.37);
    const rising = pseudoSign(baseSeed + (hh || 0) * 31 + 91.7);
    const venus = pseudoSign(baseSeed + 211.5);
    const mars = pseudoSign(baseSeed + 333.9);
    const mercury = pseudoSign(baseSeed + 77.1);
    return { sun, moon, rising, venus, mars, mercury } as Record<string, Sign>;
  }, [user.day, user.month, user.year, time]);

  const dominantElement = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(chart).forEach((s) => { counts[s.element] = (counts[s.element] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  }, [chart]);

  const elementEmoji: Record<string, string> = { Fuego: "🔥", Tierra: "🌿", Aire: "🌬️", Agua: "🌊" };
  const elementVibe: Record<string, string> = {
    Fuego: "pasión, acción y magnetismo natural",
    Tierra: "estabilidad, lujo y manifestación real",
    Aire: "mente brillante, conexión y palabra mágica",
    Agua: "sensibilidad, intuición y profundidad emocional",
  };

  const compute = () => {
    setComputing(true);
    setDone(false);
    setTimeout(() => {
      setComputing(false);
      setDone(true);
    }, 1400);
  };

  const reset = () => {
    setDone(false);
    setTime("12:00");
    setCity("");
  };

  const handleShare = async () => {
    const text =
      `✨ Mi carta astral — Baddia\n` +
      `☀️ Sol: ${chart.sun.name}\n` +
      `🌙 Luna: ${chart.moon.name}\n` +
      `⬆️ Ascendente: ${chart.rising.name}\n` +
      `💗 Venus: ${chart.venus.name}\n` +
      `🔥 Marte: ${chart.mars.name}\n` +
      `Elemento dominante: ${dominantElement} ${elementEmoji[dominantElement]}`;
    try {
      if (navigator.share) await navigator.share({ title: "Mi carta astral", text });
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
          ✨ Carta astral
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          Tu mapa <span className="gradient-text">cósmico</span> 🌌
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Hola {user.name}, dime tu hora y lugar para activar tu carta natal.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* Input */}
        <SectionLabel emoji="🪐" text="tus datos cósmicos" />
        <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-baddia-yellow/40 border-2 border-baddia-ink p-3">
              <p className="text-[9px] font-display font-black uppercase tracking-widest text-baddia-ink/55">Nacimiento</p>
              <p className="font-display font-black text-[15px] text-baddia-ink leading-tight mt-0.5">
                {user.day}/{user.month}/{user.year}
              </p>
            </div>
            <div className="rounded-2xl bg-baddia-bubble/30 border-2 border-baddia-ink p-3">
              <p className="text-[9px] font-display font-black uppercase tracking-widest text-baddia-ink/55">Signo solar</p>
              <p className="font-display font-black text-[15px] text-baddia-ink leading-tight mt-0.5">
                {chart.sun.emoji} {chart.sun.name}
              </p>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55 ml-1">
              Hora de nacimiento
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={computing || done}
              className="mt-1.5 w-full bg-white rounded-2xl px-4 py-3 text-baddia-ink font-display font-bold border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none focus:-translate-y-0.5 focus:shadow-[4px_5px_0_hsl(260_16%_15%)] transition-all disabled:opacity-60"
            />
          </div>

          <div>
            <label className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55 ml-1">
              Lugar (opcional)
            </label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Ej. Ciudad de México"
              disabled={computing || done}
              className="mt-1.5 w-full bg-white rounded-2xl px-4 py-3 text-baddia-ink font-display font-bold placeholder:text-baddia-ink/30 border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none focus:-translate-y-0.5 focus:shadow-[4px_5px_0_hsl(260_16%_15%)] transition-all disabled:opacity-60"
            />
          </div>

          {!done && (
            <button
              disabled={computing}
              onClick={compute}
              className="btn-sticker w-full py-3.5 rounded-full bg-gradient-hot text-white text-[14px] flex items-center justify-center gap-2"
            >
              {computing ? (
                <>
                  <Sparkles size={16} className="animate-spin" />
                  Alineando planetas…
                </>
              ) : (
                <>
                  <span className="text-lg">🌠</span> Calcular mi carta
                </>
              )}
            </button>
          )}
        </div>

        {/* Wheel */}
        {done && (
          <>
            <SectionLabel emoji="🌌" text="tu rueda natal" />
            <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)] animate-pop-in">
              <NatalWheel chart={chart} />
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(48_100%_59%)]">
                {elementEmoji[dominantElement]} dominante: {dominantElement}
              </div>
              <p className="text-[13px] text-baddia-ink/75 font-semibold leading-snug mt-2">
                Tu energía vibra en {elementVibe[dominantElement]}.
              </p>
            </div>

            {/* Planet readings */}
            <SectionLabel emoji="🪐" text="tus posiciones" />
            <div className="space-y-2.5">
              {PLANET_DEFS.map((p) => {
                const s = chart[p.key];
                return (
                  <div
                    key={p.key}
                    className="rounded-2xl bg-white border-[2.5px] border-baddia-ink p-3 shadow-[4px_4px_0_hsl(260_16%_15%)] flex items-center gap-3"
                  >
                    <span className={`shrink-0 w-12 h-12 rounded-xl border-2 border-baddia-ink ${s.color} ${s.text} flex items-center justify-center text-xl`}>
                      {p.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55">
                          {p.name}
                        </span>
                        <span className="text-[9px] font-display font-black uppercase tracking-wider rounded-full bg-baddia-yellow border-2 border-baddia-ink px-2 py-[1px] text-baddia-ink">
                          {s.element}
                        </span>
                      </div>
                      <h3 className="font-display font-black text-[15px] text-baddia-ink leading-tight mt-0.5">
                        {s.emoji} en {s.name}
                      </h3>
                      <p className="text-[12px] text-baddia-ink/70 font-semibold leading-snug mt-0.5">
                        {p.hint} · vibra {s.vibe}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Trinity highlight */}
            <div className="relative animate-pop-in">
              <div className="absolute -top-3 left-5 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(48_100%_59%)] rotate-1">
                  ✦ tu trinidad
                </span>
              </div>
              <div className="relative rounded-3xl border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden text-white gradient-bg-baddia">
                <span className="absolute -top-3 -right-2 text-7xl opacity-20 select-none">🌙</span>
                <p className="font-display font-black text-[20px] leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  Sol en {chart.sun.name}, Luna en {chart.moon.name}, Asc en {chart.rising.name}.
                </p>
                <p className="mt-2 font-display font-bold text-[13px] leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] opacity-95">
                  Brillas con {chart.sun.vibe}, sientes en {chart.moon.vibe} y te muestras con {chart.rising.vibe}. Esa es tu firma cósmica ✨
                </p>
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
                  <RotateCcw size={14} /> Recalcular
                </button>
              </div>
            </div>
          </>
        )}

        <p className="text-[11px] text-center text-baddia-ink/50 font-semibold px-6 pt-3 leading-relaxed">
          Tu carta es tu mapa ✨ pero tú eres quien camina el cielo 💖
        </p>
      </div>
    </div>
  );
}
