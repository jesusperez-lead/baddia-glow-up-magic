import { useState, useEffect, useMemo } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { ArrowLeft, Sparkles, Heart, RotateCcw, Share2, Check, Pencil, Lock } from "lucide-react";

/* ─────────── Types & constants ─────────── */
type Category =
  | "Amor" | "Dinero" | "Trabajo" | "Amor propio"
  | "Paz mental" | "Salud emocional" | "Viajes" | "Estudios"
  | "Glow up" | "Cerrar ciclos" | "Protección" | "Suerte";

const CATEGORIES: { id: Category; emoji: string; color: string }[] = [
  { id: "Amor",            emoji: "💗", color: "bg-baddia-bubble" },
  { id: "Dinero",          emoji: "💸", color: "bg-baddia-mint" },
  { id: "Trabajo",         emoji: "💼", color: "bg-baddia-yellow" },
  { id: "Amor propio",     emoji: "🌸", color: "bg-baddia-bubble" },
  { id: "Paz mental",      emoji: "🕊️", color: "bg-baddia-lavender" },
  { id: "Salud emocional", emoji: "🫧", color: "bg-baddia-mint" },
  { id: "Viajes",          emoji: "✈️", color: "bg-baddia-lavender" },
  { id: "Estudios",        emoji: "📚", color: "bg-baddia-yellow" },
  { id: "Glow up",         emoji: "✨", color: "bg-baddia-hot" },
  { id: "Cerrar ciclos",   emoji: "🌙", color: "bg-baddia-lavender" },
  { id: "Protección",      emoji: "🛡️", color: "bg-baddia-mint" },
  { id: "Suerte",          emoji: "🍀", color: "bg-baddia-mint" },
];

const INTENTIONS: Record<Category, string[]> = {
  "Amor":            ["Estoy lista para recibir un amor que me dé paz, claridad y reciprocidad.", "Atraigo relaciones que me eligen sin esfuerzo, con respeto y ternura."],
  "Dinero":          ["El dinero llega a mí con claridad, orden y oportunidades alineadas.", "Soy un imán para la abundancia que sí me toca."],
  "Trabajo":         ["Estoy lista para recibir un trabajo que valore mi talento, mi tiempo y mi energía.", "Mi siguiente oportunidad ya viene en camino y combina conmigo."],
  "Amor propio":     ["Me elijo incluso cuando nadie me está mirando.", "Soy mi lugar seguro y eso ya es magia."],
  "Paz mental":      ["Mi mente vuelve a la calma cada vez que la necesito.", "Suelto lo que no me pertenece y respiro mi paz."],
  "Salud emocional": ["Mis emociones tienen espacio, voz y salida.", "Estoy sanando a mi ritmo y eso también cuenta."],
  "Viajes":          ["El universo me abre caminos para conocer lugares que me transforman.", "Viajo desde la abundancia, no desde el escape."],
  "Estudios":        ["Aprendo con claridad, foco y disfrute.", "Mi mente está lista para recibir el conocimiento que me toca."],
  "Glow up":         ["Mi glow es interno, externo y energético.", "Cada día me vuelvo una versión más alineada de mí misma."],
  "Cerrar ciclos":   ["Suelto lo que no me da paz y recupero mi energía.", "Cierro con amor lo que ya cumplió su función en mi vida."],
  "Protección":      ["Mi energía está protegida y solo entra lo que me suma.", "Estoy rodeada de luz, claridad y discernimiento."],
  "Suerte":          ["Coincidencias bonitas trabajan a mi favor todos los días.", "La vida conspira a mi favor incluso cuando no lo veo."],
};

const ACTIONS: Record<Category, string[]> = {
  "Amor":            ["Hoy no escribas desde la ansiedad. Escribe desde tu valor.", "Hoy elige una cosa que harías si ya tuvieras el amor que pides."],
  "Dinero":          ["Hoy revisa un gasto pequeño y decide si combina con tu glow.", "Hoy guarda una moneda como señal simbólica de abundancia."],
  "Trabajo":         ["Hoy actualiza una línea de tu CV o guarda una oferta que te guste.", "Hoy escríbele a una persona que pueda abrirte una puerta."],
  "Amor propio":     ["Hoy mírate al espejo y dite algo que no dependa de nadie más.", "Hoy haz una cosa por ti antes de hacerla por alguien más."],
  "Paz mental":      ["Hoy silencia una notificación que te está robando paz.", "Hoy respira profundo 4 veces antes de reaccionar."],
  "Salud emocional": ["Hoy escribe en una nota cómo te sentiste hoy, sin filtros.", "Hoy permítete sentir sin justificarte."],
  "Viajes":          ["Hoy guarda en una carpeta un lugar al que quieres ir.", "Hoy ahorra simbólicamente algo para ese viaje."],
  "Estudios":        ["Hoy estudia o lee 10 minutos sin distracciones.", "Hoy organiza tu próxima sesión de estudio."],
  "Glow up":         ["Hoy haz una cosa que te haga sentir más tú.", "Hoy toma agua, estírate y mira tu progreso."],
  "Cerrar ciclos":   ["Hoy no revises eso que ya sabes que te baja la energía.", "Hoy bloquea, archiva o silencia lo que cerró ciclo."],
  "Protección":      ["Hoy no compartas tus planes con quien no te suma.", "Hoy haz una pausa antes de responder algo dudoso."],
  "Suerte":          ["Hoy haz una cosa que te haga sentir afortunada en pequeñito.", "Hoy agradece 3 coincidencias del día por mínimas que sean."],
};

const AFFIRMATIONS = [
  "Lo que es para mí, me encuentra con claridad, paz y abundancia.",
  "No persigo, alineo. No suplico, recibo.",
  "Estoy en el momento exacto donde mi energía empieza a florecer.",
  "Mi intención ya está en camino, yo solo sostengo la frecuencia.",
  "Soy un imán para lo que me toca y un escudo para lo que no.",
];

const MILESTONES = [
  { days: 1, name: "Semilla",          emoji: "🌱", phrase: "Tu energía está tomando forma." },
  { days: 3, name: "Brote",            emoji: "🌿", phrase: "Estás sosteniendo tu intención." },
  { days: 7, name: "Flor",             emoji: "🌸", phrase: "Tu intención está floreciendo." },
  { days: 14,name: "Aura brillante",   emoji: "💫", phrase: "Tu aura ya se nota a distancia." },
  { days: 21,name: "Portal glow",      emoji: "🪞", phrase: "Estás en modo recibir." },
  { days: 30,name: "Manifest Queen",   emoji: "👑", phrase: "Tu manifestación tiene corona." },
];

/* ─────────── Persistence ─────────── */
type Manifest = {
  raw: string;
  category: Category;
  intention: string;
  createdAt: string; // ISO date
  daysCompleted: string[]; // YYYY-MM-DD
};

const KEY = "baddia.manifest.v1";
const todayKey = () => new Date().toISOString().slice(0, 10);
const loadManifest = (): Manifest | null => {
  try { const v = localStorage.getItem(KEY); return v ? JSON.parse(v) : null; } catch { return null; }
};
const saveManifest = (m: Manifest | null) => {
  if (!m) localStorage.removeItem(KEY);
  else localStorage.setItem(KEY, JSON.stringify(m));
};

/* ─────────── Helpers ─────────── */
function SectionLabel({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-2 pt-1 pl-1">
      <span className="text-base">{emoji}</span>
      <p className="font-display font-black text-[12px] uppercase tracking-[0.15em] text-baddia-ink/70">{text}</p>
      <span className="h-[2px] flex-1 bg-baddia-ink/15 rounded-full" />
    </div>
  );
}

function pickFor(text: string): Category {
  const t = text.toLowerCase();
  const map: [string, Category][] = [
    ["amor propio","Amor propio"],["amor","Amor"],["pareja","Amor"],["crush","Amor"],
    ["dinero","Dinero"],["plata","Dinero"],["abundancia","Dinero"],["ahorr","Dinero"],
    ["trabajo","Trabajo"],["empleo","Trabajo"],["job","Trabajo"],["oficio","Trabajo"],
    ["paz","Paz mental"],["calma","Paz mental"],["ansiedad","Paz mental"],
    ["sanar","Salud emocional"],["terap","Salud emocional"],
    ["viaj","Viajes"],["mudar","Viajes"],
    ["estud","Estudios"],["examen","Estudios"],["univers","Estudios"],
    ["glow","Glow up"],["cuerp","Glow up"],["pelo","Glow up"],
    ["cerrar","Cerrar ciclos"],["soltar","Cerrar ciclos"],["ex","Cerrar ciclos"],
    ["proteg","Protección"],["envid","Protección"],
    ["suerte","Suerte"],
  ];
  for (const [k,c] of map) if (t.includes(k)) return c;
  return "Glow up";
}

/* ─────────── Main ─────────── */
type Step = "intro" | "category" | "intention" | "streak" | "ritual" | "celebrate";

export function Manifest() {
  const { go, user, openPaywall } = useBaddia();
  const isPro = user.plan !== "Free";

  const [data, setData] = useState<Manifest | null>(() => loadManifest());
  const [step, setStep] = useState<Step>(() => (loadManifest() ? "streak" : "intro"));

  const [raw, setRaw] = useState("");
  const [category, setCategory] = useState<Category | null>(null);
  const [intention, setIntention] = useState("");
  const [intentionIdx, setIntentionIdx] = useState(0);
  const [editing, setEditing] = useState(false);

  useEffect(() => { saveManifest(data); }, [data]);

  const completedToday = !!data && data.daysCompleted.includes(todayKey());
  const streak = data?.daysCompleted.length ?? 0;
  const currentMilestone = useMemo(
    () => [...MILESTONES].reverse().find((m) => streak >= m.days) ?? null,
    [streak]
  );
  const nextMilestone = useMemo(
    () => MILESTONES.find((m) => streak < m.days) ?? null,
    [streak]
  );

  /* Step transitions */
  const handleCreate = () => {
    if (!raw.trim()) return;
    const c = pickFor(raw);
    setCategory(c);
    setIntention(INTENTIONS[c][0]);
    setIntentionIdx(0);
    setStep("category");
  };

  const handleConfirmCategory = (c: Category) => {
    setCategory(c);
    setIntention(INTENTIONS[c][0]);
    setIntentionIdx(0);
    setStep("intention");
  };

  const regenIntention = () => {
    if (!category) return;
    const list = INTENTIONS[category];
    const next = (intentionIdx + 1) % list.length;
    setIntentionIdx(next);
    setIntention(list[next]);
  };

  const acceptIntention = () => {
    if (!category) return;
    const m: Manifest = {
      raw,
      category,
      intention: intention.trim() || INTENTIONS[category][0],
      createdAt: new Date().toISOString(),
      daysCompleted: [],
    };
    setData(m);
    setStep("streak");
  };

  const completeToday = () => {
    if (!data) return;
    const t = todayKey();
    if (data.daysCompleted.includes(t)) return;
    setData({ ...data, daysCompleted: [...data.daysCompleted, t] });
    setStep("celebrate");
  };

  const resetAll = () => {
    setData(null); setRaw(""); setCategory(null); setIntention("");
    setStep("intro");
  };

  /* ─────────── Render ─────────── */
  return (
    <div className="relative min-h-full bg-gradient-to-b from-pink-50/70 via-white to-purple-50/60 overflow-hidden">
      {/* floating deco */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute top-10 left-4 text-xl animate-float-cute">✨</span>
        <span className="absolute top-24 right-6 text-lg animate-float-cute" style={{animationDelay:"0.6s"}}>🌸</span>
        <span className="absolute top-1/2 left-3 text-base animate-float-cute" style={{animationDelay:"1.2s"}}>💫</span>
        <span className="absolute -top-8 -right-10 w-40 h-40 rounded-full bg-baddia-bubble/30 blur-3xl" />
        <span className="absolute top-40 -left-12 w-44 h-44 rounded-full bg-baddia-lavender/30 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative px-4 pt-4 pb-3 flex items-center gap-3">
        <button
          onClick={() => (step === "ritual" || step === "celebrate" ? setStep("streak") : go("daily"))}
          className="w-10 h-10 rounded-2xl border-2 border-baddia-ink bg-white shadow-[2px_2px_0_hsl(260_16%_15%)] flex items-center justify-center active:scale-95"
          aria-label="Volver"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="font-display font-black text-[22px] text-baddia-ink leading-none flex items-center gap-2">
            Manifest Mode <span className="animate-sparkle-spin">✨</span>
          </h1>
          <p className="text-[12px] text-baddia-ink/65 font-semibold mt-0.5">Racha Glow · tu intención, cada día</p>
        </div>
        {data && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border-2 border-baddia-ink bg-baddia-yellow shadow-[2px_2px_0_hsl(260_16%_15%)] font-display font-black text-[12px]">
            🔥 {streak}
          </span>
        )}
      </header>

      <main className="relative px-4 pb-8 space-y-4">
        {/* INTRO */}
        {step === "intro" && (
          <>
            <section className="relative rounded-3xl border-[2.5px] border-baddia-ink bg-white p-5 shadow-[4px_4px_0_hsl(260_16%_15%)]">
              <span className="absolute -top-3 -left-2 px-2.5 py-1 rounded-full border-2 border-baddia-ink bg-baddia-bubble text-[11px] font-display font-black -rotate-3 shadow-[2px_2px_0_hsl(260_16%_15%)]">
                ¿qué quieres atraer?
              </span>
              <p className="font-display font-black text-[18px] text-baddia-ink leading-snug mt-2">
                Dile a Baddia qué quieres manifestar y vuelve cada día para mantener tu Racha Glow.
              </p>
              <textarea
                value={raw}
                onChange={(e) => setRaw(e.target.value.slice(0, 140))}
                placeholder="Ej: un trabajo que valore mi talento, amor propio, paz mental, mudarme…"
                rows={3}
                className="mt-3 w-full rounded-2xl border-2 border-baddia-ink bg-pink-50/50 p-3 text-[14px] font-semibold text-baddia-ink placeholder:text-baddia-ink/40 focus:outline-none focus:ring-4 focus:ring-baddia-bubble/40 resize-none"
              />
              <p className="text-right text-[10px] text-baddia-ink/50 mt-1">{raw.length}/140</p>
              <button
                onClick={handleCreate}
                disabled={!raw.trim()}
                className="mt-2 w-full rounded-2xl border-[2.5px] border-baddia-ink bg-gradient-to-r from-baddia-hot via-baddia-bubble to-baddia-lavender text-white font-display font-black py-3 text-[15px] shadow-[3px_3px_0_hsl(260_16%_15%)] active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                Crear mi manifestación ✨
              </button>
            </section>

            <SectionLabel emoji="🌷" text="ideas para empezar" />
            <div className="grid grid-cols-2 gap-2">
              {["amor propio","nuevo trabajo","más dinero","paz mental","cerrar un ciclo","mudarme","sanar","confianza"].map((t,i) => (
                <button
                  key={t}
                  onClick={() => setRaw(t)}
                  className="rounded-2xl border-2 border-baddia-ink bg-white px-3 py-2.5 text-left text-[12px] font-semibold text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] active:scale-95"
                  style={{ transform: `rotate(${i%2?1:-1}deg)` }}
                >
                  ✨ {t}
                </button>
              ))}
            </div>
          </>
        )}

        {/* CATEGORY */}
        {step === "category" && category && (
          <>
            <section className="rounded-3xl border-[2.5px] border-baddia-ink bg-white p-5 shadow-[4px_4px_0_hsl(260_16%_15%)]">
              <p className="text-[12px] font-display font-black uppercase tracking-widest text-baddia-ink/60">Tu manifestación vibra con</p>
              <p className="mt-1 font-display font-black text-[20px] text-baddia-ink leading-tight">
                {CATEGORIES.find(c=>c.id===category)?.emoji} {category}
              </p>
              <p className="mt-2 text-[13px] text-baddia-ink/70 font-semibold italic">“{raw}”</p>
            </section>

            <SectionLabel emoji="🌈" text="¿prefieres otra categoría?" />
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((c) => {
                const active = c.id === category;
                return (
                  <button
                    key={c.id}
                    onClick={() => handleConfirmCategory(c.id)}
                    className={`rounded-2xl border-2 border-baddia-ink ${c.color} p-2.5 flex flex-col items-center gap-1 shadow-[2px_2px_0_hsl(260_16%_15%)] active:scale-95 ${active ? "ring-4 ring-baddia-ink/20" : ""}`}
                  >
                    <span className="text-xl">{c.emoji}</span>
                    <span className="font-display font-black text-[10px] text-baddia-ink leading-tight text-center">{c.id}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handleConfirmCategory(category)}
              className="w-full rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-ink text-white font-display font-black py-3 text-[15px] shadow-[3px_3px_0_hsl(260_16%_15%)] active:scale-95"
            >
              Continuar →
            </button>
          </>
        )}

        {/* INTENTION */}
        {step === "intention" && category && (
          <>
            <section className="rounded-3xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-white via-pink-50 to-purple-50 p-5 shadow-[4px_4px_0_hsl(260_16%_15%)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{CATEGORIES.find(c=>c.id===category)?.emoji}</span>
                <p className="text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink/60">Tu intención poderosa</p>
              </div>
              {editing ? (
                <textarea
                  value={intention}
                  onChange={(e) => setIntention(e.target.value.slice(0, 200))}
                  rows={4}
                  className="w-full rounded-2xl border-2 border-baddia-ink bg-white p-3 text-[14px] font-semibold text-baddia-ink focus:outline-none focus:ring-4 focus:ring-baddia-bubble/40 resize-none"
                />
              ) : (
                <p className="font-display font-black text-[17px] text-baddia-ink leading-snug">
                  “{intention}”
                </p>
              )}
              <div className="mt-3 flex gap-2">
                <button onClick={regenIntention} className="flex-1 rounded-xl border-2 border-baddia-ink bg-white px-2 py-2 text-[12px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] active:scale-95 inline-flex items-center justify-center gap-1">
                  <RotateCcw size={14}/> Otra
                </button>
                <button onClick={() => setEditing(v=>!v)} className="flex-1 rounded-xl border-2 border-baddia-ink bg-white px-2 py-2 text-[12px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] active:scale-95 inline-flex items-center justify-center gap-1">
                  <Pencil size={14}/> {editing ? "Listo" : "Editar"}
                </button>
              </div>
            </section>

            <button
              onClick={acceptIntention}
              className="w-full rounded-2xl border-[2.5px] border-baddia-ink bg-gradient-to-r from-baddia-hot via-baddia-bubble to-baddia-lavender text-white font-display font-black py-3 text-[15px] shadow-[3px_3px_0_hsl(260_16%_15%)] active:scale-95"
            >
              Usar esta intención ✨
            </button>
          </>
        )}

        {/* STREAK (home) */}
        {step === "streak" && data && (
          <>
            {/* Intention card */}
            <section className="relative rounded-3xl border-[2.5px] border-baddia-ink bg-white p-5 shadow-[4px_4px_0_hsl(260_16%_15%)]">
              <span className="absolute -top-3 left-4 px-2.5 py-1 rounded-full border-2 border-baddia-ink bg-baddia-yellow text-[10px] font-display font-black -rotate-2 shadow-[2px_2px_0_hsl(260_16%_15%)] uppercase tracking-widest">
                {CATEGORIES.find(c=>c.id===data.category)?.emoji} {data.category}
              </span>
              <p className="font-display font-black text-[16px] text-baddia-ink leading-snug mt-1">
                “{data.intention}”
              </p>
            </section>

            {/* Streak ring */}
            <section className="rounded-3xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-baddia-bubble/30 via-white to-baddia-lavender/30 p-5 shadow-[4px_4px_0_hsl(260_16%_15%)]">
              <div className="flex items-center gap-4">
                <div className="relative w-24 h-24 shrink-0">
                  <div className="absolute inset-0 rounded-full border-[3px] border-baddia-ink bg-white flex flex-col items-center justify-center">
                    <span className="text-3xl">{currentMilestone?.emoji ?? "🌱"}</span>
                  </div>
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full border-2 border-baddia-ink bg-baddia-hot text-white text-[10px] font-display font-black shadow-[1px_1px_0_hsl(260_16%_15%)]">
                    {streak} {streak===1?"día":"días"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-black text-[14px] text-baddia-ink leading-tight">
                    {currentMilestone?.name ?? "Listo para empezar"}
                  </p>
                  <p className="text-[12px] text-baddia-ink/70 font-semibold mt-0.5">
                    {currentMilestone?.phrase ?? "Tu primera intención está lista."}
                  </p>
                  {nextMilestone && (
                    <div className="mt-2">
                      <div className="h-2 rounded-full border border-baddia-ink/30 bg-white overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-baddia-hot via-baddia-bubble to-baddia-lavender"
                          style={{ width: `${Math.min(100,(streak/nextMilestone.days)*100)}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-baddia-ink/60 font-semibold mt-1">
                        {nextMilestone.days - streak} días para {nextMilestone.emoji} {nextMilestone.name}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Week calendar */}
            <SectionLabel emoji="📅" text="esta semana" />
            <section className="rounded-2xl border-2 border-baddia-ink bg-white p-3 shadow-[3px_3px_0_hsl(260_16%_15%)]">
              <div className="grid grid-cols-7 gap-1.5">
                {(() => {
                  const today = new Date();
                  const dow = (today.getDay() + 6) % 7; // Mon=0
                  const monday = new Date(today); monday.setDate(today.getDate() - dow);
                  const labels = ["L","M","M","J","V","S","D"];
                  return Array.from({length:7}).map((_,i) => {
                    const d = new Date(monday); d.setDate(monday.getDate()+i);
                    const k = d.toISOString().slice(0,10);
                    const done = data.daysCompleted.includes(k);
                    const isToday = k === todayKey();
                    return (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-display font-black text-baddia-ink/60">{labels[i]}</span>
                        <div className={`w-9 h-9 rounded-xl border-2 border-baddia-ink flex items-center justify-center text-base ${done ? "bg-gradient-to-br from-baddia-hot to-baddia-bubble" : isToday ? "bg-baddia-yellow" : "bg-white"} ${isToday?"ring-2 ring-baddia-ink/40":""}`}>
                          {done ? "✨" : isToday ? "·" : ""}
                        </div>
                        <span className="text-[9px] text-baddia-ink/50 font-semibold">{d.getDate()}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            </section>

            {/* Today's energy */}
            <section className="rounded-2xl border-2 border-baddia-ink bg-baddia-mint p-4 shadow-[3px_3px_0_hsl(260_16%_15%)]">
              <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/70">Tu energía de hoy</p>
              <p className="mt-1 font-display font-black text-[16px] text-baddia-ink leading-snug">
                “{AFFIRMATIONS[streak % AFFIRMATIONS.length]}”
              </p>
            </section>

            {/* Main CTA */}
            <button
              onClick={() => completedToday ? null : setStep("ritual")}
              disabled={completedToday}
              className={`w-full rounded-2xl border-[2.5px] border-baddia-ink py-4 font-display font-black text-[16px] shadow-[3px_3px_0_hsl(260_16%_15%)] active:scale-95 ${completedToday ? "bg-baddia-mint text-baddia-ink" : "bg-gradient-to-r from-baddia-hot via-baddia-bubble to-baddia-lavender text-white"}`}
            >
              {completedToday ? "✅ Día completado · vuelve mañana" : "Manifestar hoy ✨"}
            </button>

            {/* Pro hint */}
            {!isPro && (
              <button
                onClick={openPaywall}
                className="w-full rounded-2xl border-2 border-baddia-ink bg-white p-3 shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center gap-3 active:scale-95"
              >
                <span className="w-9 h-9 rounded-xl border-2 border-baddia-ink bg-baddia-yellow flex items-center justify-center"><Lock size={16}/></span>
                <span className="flex-1 text-left">
                  <span className="block font-display font-black text-[13px] text-baddia-ink">Desbloquea energía bloqueada</span>
                  <span className="block text-[11px] text-baddia-ink/65 font-semibold">Baddia detecta qué frena tu intención</span>
                </span>
                <span className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-hot">Pro</span>
              </button>
            )}

            <button
              onClick={resetAll}
              className="w-full text-center text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink/50 underline-offset-4 hover:underline py-2"
            >
              cambiar manifestación
            </button>
          </>
        )}

        {/* RITUAL */}
        {step === "ritual" && data && (
          <Ritual
            category={data.category}
            intention={data.intention}
            onDone={completeToday}
          />
        )}

        {/* CELEBRATE */}
        {step === "celebrate" && data && (
          <section className="relative rounded-3xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-baddia-yellow via-baddia-bubble to-baddia-lavender p-6 shadow-[4px_4px_0_hsl(260_16%_15%)] text-center overflow-hidden">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              {["✨","💖","🌸","⭐","💫"].map((e,i)=>(
                <span key={i} className="absolute text-2xl animate-float-cute" style={{left:`${10+i*18}%`, top:`${10+(i%3)*25}%`, animationDelay:`${i*0.2}s`}}>{e}</span>
              ))}
            </div>
            <p className="relative font-display font-black text-[28px] text-white drop-shadow-[2px_2px_0_hsl(260_16%_15%)]">
              Día {streak} ✨
            </p>
            <p className="relative font-display font-black text-[16px] text-white mt-1">
              {currentMilestone?.phrase ?? "Tu manifestación sigue creciendo."}
            </p>
            <div className="relative mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border-2 border-baddia-ink bg-white shadow-[2px_2px_0_hsl(260_16%_15%)]">
              <span className="text-xl">{currentMilestone?.emoji ?? "🌱"}</span>
              <span className="font-display font-black text-[13px] text-baddia-ink">{currentMilestone?.name ?? "Semilla"}</span>
            </div>
            <p className="relative text-[12px] text-white/90 font-semibold mt-4 leading-relaxed">
              Baddia guardó tu energía de hoy.<br/>Vuelve mañana para no romper tu Racha Glow.
            </p>
            <div className="relative mt-5 grid grid-cols-2 gap-2">
              <button onClick={()=>setStep("streak")} className="rounded-xl border-2 border-baddia-ink bg-white px-3 py-2.5 text-[12px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] active:scale-95">
                Ver mi progreso
              </button>
              <button onClick={()=>go("daily")} className="rounded-xl border-2 border-baddia-ink bg-baddia-ink text-white px-3 py-2.5 text-[12px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] active:scale-95">
                Ir a Daily
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

/* ─────────── Ritual sub-screen ─────────── */
function Ritual({ category, intention, onDone }: { category: Category; intention: string; onDone: () => void }) {
  const [s, setS] = useState<1|2|3>(1);
  const [secs, setSecs] = useState(30);
  const affirmation = useMemo(() => AFFIRMATIONS[Math.floor(Math.random()*AFFIRMATIONS.length)], []);
  const action = useMemo(() => ACTIONS[category][Math.floor(Math.random()*ACTIONS[category].length)], [category]);

  useEffect(() => {
    if (s !== 2) return;
    setSecs(30);
    const id = setInterval(() => setSecs((v) => (v <= 1 ? 0 : v - 1)), 1000);
    return () => clearInterval(id);
  }, [s]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        {[1,2,3].map((n) => (
          <span key={n} className={`h-2 rounded-full border border-baddia-ink/40 transition-all ${n===s ? "w-10 bg-baddia-hot" : n<s ? "w-6 bg-baddia-bubble" : "w-6 bg-white"}`}/>
        ))}
      </div>

      {s === 1 && (
        <section className="rounded-3xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-pink-50 to-purple-50 p-6 shadow-[4px_4px_0_hsl(260_16%_15%)] text-center">
          <p className="text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink/60">Paso 1 · Afirmación</p>
          <p className="mt-3 text-[14px] text-baddia-ink/70 font-semibold">Repite 3 veces, despacito:</p>
          <p className="mt-3 font-display font-black text-[18px] text-baddia-ink leading-snug animate-pulse-slow">
            “{affirmation}”
          </p>
          <button onClick={()=>setS(2)} className="mt-5 w-full rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-hot text-white font-display font-black py-3 text-[14px] shadow-[3px_3px_0_hsl(260_16%_15%)] active:scale-95">
            Ya la repetí ✨
          </button>
        </section>
      )}

      {s === 2 && (
        <section className="rounded-3xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-baddia-lavender/40 to-baddia-bubble/30 p-6 shadow-[4px_4px_0_hsl(260_16%_15%)] text-center">
          <p className="text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink/60">Paso 2 · Visualización</p>
          <p className="mt-2 text-[13px] text-baddia-ink/70 font-semibold">Cierra los ojos e imagina que ya lo recibiste.</p>
          <div className="relative mx-auto mt-5 w-40 h-40 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-baddia-bubble/40 animate-ping" />
            <span className="absolute inset-3 rounded-full bg-baddia-lavender/50 animate-pulse-slow" />
            <div className="relative w-28 h-28 rounded-full border-[3px] border-baddia-ink bg-white flex items-center justify-center font-display font-black text-[28px] text-baddia-ink">
              {secs}s
            </div>
          </div>
          <p className="mt-4 text-[12px] text-baddia-ink/70 font-semibold italic">“{intention}”</p>
          <button
            onClick={()=>setS(3)}
            disabled={secs>0}
            className="mt-5 w-full rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-ink text-white font-display font-black py-3 text-[14px] shadow-[3px_3px_0_hsl(260_16%_15%)] active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {secs>0 ? `Visualizando… ${secs}s` : "Ya lo visualicé"}
          </button>
        </section>
      )}

      {s === 3 && (
        <section className="rounded-3xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-baddia-yellow/60 to-baddia-mint/40 p-6 shadow-[4px_4px_0_hsl(260_16%_15%)] text-center">
          <p className="text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink/60">Paso 3 · Acción alineada</p>
          <span className="inline-block mt-3 text-3xl animate-wiggle">🌟</span>
          <p className="mt-2 font-display font-black text-[17px] text-baddia-ink leading-snug">
            {action}
          </p>
          <p className="mt-2 text-[11px] text-baddia-ink/60 font-semibold">Una acción pequeña, pero alineada con tu intención.</p>
          <button onClick={onDone} className="mt-5 w-full rounded-2xl border-[2.5px] border-baddia-ink bg-gradient-to-r from-baddia-hot via-baddia-bubble to-baddia-lavender text-white font-display font-black py-3 text-[14px] shadow-[3px_3px_0_hsl(260_16%_15%)] active:scale-95 inline-flex items-center justify-center gap-2">
            <Check size={16}/> Lo hice — sumar a mi racha
          </button>
        </section>
      )}
    </div>
  );
}
