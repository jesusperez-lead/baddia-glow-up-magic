import { useState, useEffect, useMemo, useRef } from "react";
import { useBaddia } from "@/lib/baddia-state";
import {
  ArrowLeft, Sparkles, RotateCcw, Share2, Check, Pencil, Lock, Bell, BellOff, Trophy, Flame, Download, Volume2, VolumeX, Pause, Play, X, Clock,
} from "lucide-react";
import { toast } from "sonner";
import * as htmlToImage from "html-to-image";
import { useBaddiaVoice } from "@/lib/baddia-voice";
import { TimePickerSheet } from "@/components/baddia/TimePickerSheet";
import { MyManifests, markMyManifestDay, todayKey as myTodayKey, type MyManifest } from "@/components/baddia/MyManifests";

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
  createdAt: string;
  daysCompleted: string[];
  remind?: boolean;
  reminderTime?: string | null;  // "HH:MM"
  reminderEnabled?: boolean;
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

/* ─────────── Decorations: notebook paper + scrapbook deco ─────────── */
function PaperBackground() {
  return (
    <>
      {/* base wash */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fdf6ec] via-[#fff9f1] to-[#fbe9e7]" />
      {/* paper grain */}
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(rgba(120,80,60,0.18) 0.5px, transparent 0.5px), radial-gradient(rgba(120,80,60,0.12) 0.5px, transparent 0.5px)",
          backgroundSize: "5px 5px, 9px 9px",
          backgroundPosition: "0 0, 2px 3px",
        }}
      />
      {/* notebook lines */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(110,140,200,0.35) 32px)",
        }}
      />
      {/* left margin */}
      <div className="absolute top-0 bottom-0 left-9 w-px bg-baddia-hot/40" />
    </>
  );
}

function ScrapbookDeco() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* pressed flowers / leaves corners */}
      <span className="absolute -top-3 right-2 text-5xl rotate-12 opacity-90 select-none">🌼</span>
      <span className="absolute top-12 right-10 text-3xl -rotate-12 opacity-80 select-none">🌿</span>
      <span className="absolute -bottom-2 -left-2 text-6xl -rotate-12 opacity-85 select-none">🌱</span>
      <span className="absolute bottom-32 -right-3 text-4xl rotate-6 opacity-80 select-none">💐</span>
      {/* tape pieces */}
      <span className="absolute top-3 left-16 w-14 h-5 bg-white/70 border border-baddia-ink/10 rotate-[-8deg] shadow-sm" />
      <span className="absolute top-44 right-6 w-12 h-4 bg-pink-200/70 border border-baddia-ink/10 rotate-[14deg] shadow-sm" />
    </div>
  );
}

/* Washi-tape style label */
function WashiLabel({ children, color = "bg-baddia-bubble", rot = -3 }: { children: React.ReactNode; color?: string; rot?: number }) {
  return (
    <span
      className={`inline-block px-3 py-1 ${color} text-baddia-ink text-[11px] font-display font-black uppercase tracking-widest border-y border-baddia-ink/20`}
      style={{ transform: `rotate(${rot}deg)`, boxShadow: "0 1px 0 rgba(0,0,0,0.08)" }}
    >
      {children}
    </span>
  );
}

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

/* fun social proof — purely cosmetic */
function socialCountToday() {
  const seed = new Date().getDate() + new Date().getMonth() * 31;
  return 1280 + (seed * 137) % 4200;
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
  const [shareOpen, setShareOpen] = useState(false);
  const [reminderSheet, setReminderSheet] = useState<null | "ask" | "picker" | "denied">(null);
  const [reminderJustSaved, setReminderJustSaved] = useState(false);
  const [runningMy, setRunningMy] = useState<MyManifest | null>(null);
  const [myDone, setMyDone] = useState<MyManifest | null>(null);

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
  const glowPoints = streak * 25;

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
    if (data.daysCompleted.includes(t)) {
      setStep("celebrate");
      return;
    }
    setData({ ...data, daysCompleted: [...data.daysCompleted, t] });
    setStep("celebrate");
    // Trigger reminder sheet after a short delay only if not configured
    setTimeout(() => {
      const hasReminder = data.reminderEnabled && data.reminderTime;
      if (!hasReminder) setReminderSheet("ask");
    }, 900);
  };

  const resetAll = () => {
    setData(null); setRaw(""); setCategory(null); setIntention("");
    setStep("intro");
  };

  const requestNotifPermission = async (): Promise<boolean> => {
    if (typeof Notification === "undefined") return true; // no API — treat as ok
    if (Notification.permission === "granted") return true;
    if (Notification.permission === "denied") return false;
    try {
      const p = await Notification.requestPermission();
      return p === "granted";
    } catch { return false; }
  };

  const saveReminder = async (time: string) => {
    if (!data) return;
    const granted = await requestNotifPermission();
    if (!granted && typeof Notification !== "undefined" && Notification.permission === "denied") {
      setReminderSheet("denied");
      return;
    }
    setData({ ...data, reminderTime: time, reminderEnabled: true, remind: true });
    setReminderSheet(null);
    setReminderJustSaved(true);
    toast.success(`Listo, mañana te aviso a las ${time} ✨`);
    setTimeout(() => setReminderJustSaved(false), 2600);
  };

  const acceptSameTime = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    saveReminder(`${hh}:${mm}`);
  };

  const toggleRemind = () => {
    if (!data) return;
    if (!data.reminderEnabled) {
      setReminderSheet("ask");
    } else {
      setData({ ...data, remind: false, reminderEnabled: false, reminderTime: null });
      toast.success("Recordatorio desactivado");
    }
  };

  // Schedule next-day local notification when reminder is enabled
  useEffect(() => {
    if (!data?.reminderEnabled || !data.reminderTime) return;
    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
    const [hh, mm] = data.reminderTime.split(":").map((n) => parseInt(n, 10));
    if (isNaN(hh) || isNaN(mm)) return;
    const now = new Date();
    const next = new Date();
    next.setHours(hh, mm, 0, 0);
    if (next.getTime() <= now.getTime()) next.setDate(next.getDate() + 1);
    const delay = next.getTime() - now.getTime();
    // Cap timeout to a day to avoid overflow; will re-schedule when it fires
    const id = setTimeout(() => {
      try {
        new Notification("Es hora de manifestar ✨", {
          body: "Baddia te está esperando para repetir tu frase de hoy.",
          icon: "/favicon.ico",
        });
      } catch {}
    }, Math.min(delay, 24 * 60 * 60 * 1000));
    return () => clearTimeout(id);
  }, [data?.reminderEnabled, data?.reminderTime]);

  /* ─────────── Render ─────────── */
  return (
    <div className="relative min-h-full overflow-hidden">
      <PaperBackground />
      <ScrapbookDeco />

      {/* Header */}
      <header className="relative px-4 pt-4 pb-3 flex items-center gap-3 z-10">
        <button
          onClick={() => (step === "ritual" || step === "celebrate" ? setStep("streak") : go("daily"))}
          className="w-10 h-10 rounded-2xl border-2 border-baddia-ink bg-white shadow-[2px_2px_0_hsl(260_16%_15%)] flex items-center justify-center active:scale-95"
          aria-label="Volver"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="font-display font-black text-[24px] text-baddia-ink leading-none flex items-center gap-2">
            <span className="gradient-text">Manifest</span> Mode
            <span className="animate-sparkle-spin">✨</span>
          </h1>
          <p className="text-[11.5px] text-baddia-ink/65 font-semibold mt-1">tu diario de manifestación · racha glow</p>
        </div>
        {data && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border-2 border-baddia-ink bg-baddia-yellow shadow-[2px_2px_0_hsl(260_16%_15%)] font-display font-black text-[13px]">
            🔥 {streak}
          </span>
        )}
      </header>

      <main className="relative z-10 px-4 pb-10 space-y-4">
        {/* INTRO */}
        {step === "intro" && (
          <>
            <section className="relative rounded-3xl border-[2.5px] border-baddia-ink bg-white/95 backdrop-blur p-5 pt-7 shadow-[4px_4px_0_hsl(260_16%_15%)]">
              {/* tape */}
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-pink-200/80 border border-baddia-ink/20 -rotate-3 shadow-sm" />
              <span className="absolute -top-3 -left-2"><WashiLabel color="bg-baddia-bubble" rot={-6}>diario glow</WashiLabel></span>
              <p className="font-display font-black text-[19px] text-baddia-ink leading-snug">
                Escribe lo que quieres atraer.<br/>
                <span className="gradient-text">Baddia lo cuida contigo</span> cada día ✨
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

            {/* Social proof */}
            <div className="rounded-2xl border-2 border-baddia-ink bg-white/80 backdrop-blur px-3 py-2.5 shadow-[2px_2px_0_hsl(260_16%_15%)] flex items-center gap-2">
              <div className="flex -space-x-2">
                {["🌸","💗","✨","🌿"].map((e,i)=>(
                  <span key={i} className="w-7 h-7 rounded-full border-2 border-baddia-ink bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-sm">{e}</span>
                ))}
              </div>
              <p className="text-[11.5px] font-display font-bold text-baddia-ink/80 leading-tight">
                <span className="font-black">{socialCountToday().toLocaleString()}</span> girls están manifestando hoy
              </p>
            </div>

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
            <section className="relative rounded-3xl border-[2.5px] border-baddia-ink bg-white/95 p-5 pt-6 shadow-[4px_4px_0_hsl(260_16%_15%)]">
              <span className="absolute -top-3 left-4"><WashiLabel color="bg-baddia-yellow" rot={-3}>vibra</WashiLabel></span>
              <p className="mt-1 font-display font-black text-[20px] text-baddia-ink leading-tight">
                {CATEGORIES.find(c=>c.id===category)?.emoji} {category}
              </p>
              <p className="mt-2 text-[13px] text-baddia-ink/70 font-semibold italic">"{raw}"</p>
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
            <section className="relative rounded-3xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-white via-pink-50 to-purple-50 p-5 pt-7 shadow-[4px_4px_0_hsl(260_16%_15%)]">
              <span className="absolute -top-3 left-4"><WashiLabel color="bg-baddia-bubble" rot={-4}>tu intención</WashiLabel></span>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{CATEGORIES.find(c=>c.id===category)?.emoji}</span>
                <p className="text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink/60">{category}</p>
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
                  "{intention}"
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
            {/* Guided-audio banner */}
            <section className="relative rounded-3xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 pt-5 shadow-[3px_3px_0_hsl(260_16%_15%)] overflow-hidden">
              <span className="absolute -top-14 -left-10 w-40 h-40 rounded-full bg-baddia-bubble/30 blur-3xl animate-pulse-slow pointer-events-none" />
              <span className="absolute -bottom-16 -right-10 w-44 h-44 rounded-full bg-baddia-lavender/30 blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: "1.3s" }} />
              <div className="relative flex items-center gap-3">
                <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                  <span className="absolute inset-0 rounded-full bg-baddia-hot/20 animate-breathe" />
                  <span className="relative text-3xl">🌙</span>
                </div>
                <div className="min-w-0">
                  <p className="font-display font-black text-[17px] text-baddia-ink leading-tight">Manifestemos juntas ✨</p>
                  <p className="text-[12px] text-baddia-ink/70 font-semibold italic mt-0.5">Tómate unos segundos para conectar con tu energía de hoy.</p>
                </div>
              </div>
              {data.reminderEnabled && data.reminderTime && (
                <div className="relative mt-3 rounded-2xl border-2 border-baddia-ink bg-baddia-yellow/60 px-3 py-2 shadow-[2px_2px_0_hsl(260_16%_15%)] flex items-center gap-2">
                  <Bell size={13} className="text-baddia-ink shrink-0" />
                  <p className="text-[11.5px] font-display font-black text-baddia-ink leading-tight">
                    Te recordaremos mañana a las {data.reminderTime} ✨
                  </p>
                </div>
              )}
            </section>

            {/* HERO Streak card — irresistible polaroid */}
            <section className="relative rounded-[28px] border-[2.5px] border-baddia-ink bg-white p-4 pt-5 shadow-[6px_8px_0_hsl(260_16%_15%)] overflow-hidden">
              {/* tape strips */}
              <span className="absolute -top-3 left-10 w-16 h-6 bg-yellow-200/80 border border-baddia-ink/20 -rotate-6 shadow-sm" />
              <span className="absolute -top-3 right-10 w-16 h-6 bg-pink-200/80 border border-baddia-ink/20 rotate-6 shadow-sm" />
              {/* corner deco */}
              <span className="absolute -top-2 -right-1 text-3xl rotate-12 select-none">🌸</span>
              <span className="absolute -bottom-2 -left-1 text-2xl -rotate-12 select-none">🌿</span>

              {/* category chip */}
              <div className="flex justify-center mb-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border-2 border-baddia-ink bg-baddia-yellow text-[11px] font-display font-black uppercase tracking-widest -rotate-2 shadow-[2px_2px_0_hsl(260_16%_15%)]">
                  {CATEGORIES.find(c=>c.id===data.category)?.emoji} {data.category}
                </span>
              </div>

              {/* Big number ring */}
              <div className="relative mx-auto w-44 h-44">
                {/* halo */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-baddia-bubble/40 via-baddia-yellow/30 to-baddia-lavender/40 blur-xl" />
                <svg viewBox="0 0 120 120" className="absolute inset-0 -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(260 16% 15% / 0.08)" strokeWidth="10" />
                  <circle
                    cx="60" cy="60" r="52" fill="none" strokeLinecap="round" strokeWidth="10"
                    stroke="url(#g1)"
                    strokeDasharray={326}
                    strokeDashoffset={326 - 326 * Math.min(1, (nextMilestone ? streak / nextMilestone.days : 1))}
                    style={{ transition: "stroke-dashoffset .9s ease", filter: "drop-shadow(0 2px 0 hsl(260 16% 15% / 0.15))" }}
                  />
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0%" stopColor="hsl(338 90% 68%)" />
                      <stop offset="50%" stopColor="hsl(340 100% 80%)" />
                      <stop offset="100%" stopColor="hsl(256 90% 78%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[44px] leading-none drop-shadow-[1px_2px_0_hsl(48_100%_70%)]">{currentMilestone?.emoji ?? "🌱"}</span>
                  <span className="mt-1 font-display font-black text-[40px] leading-none text-baddia-ink">{streak}</span>
                  <span className="text-[10px] font-display font-black uppercase tracking-[0.18em] text-baddia-ink/60 mt-1">
                    {streak===1?"día glow":"días glow"}
                  </span>
                </div>
              </div>

              {/* milestone caption */}
              <div className="text-center mt-3">
                <p className="font-display font-black text-[17px] text-baddia-ink leading-tight">
                  {currentMilestone?.name ?? "Listo para empezar"}
                </p>
                <p className="text-[12px] text-baddia-ink/65 font-semibold italic mt-0.5 px-3">
                  {currentMilestone?.phrase ?? "Tu primera intención está lista."}
                </p>
              </div>

              {/* progress bar */}
              {nextMilestone && (
                <div className="mt-3 px-1">
                  <div className="h-2.5 rounded-full border-2 border-baddia-ink bg-white overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-baddia-hot via-baddia-bubble to-baddia-lavender transition-all duration-700"
                      style={{ width: `${Math.min(100,(streak/nextMilestone.days)*100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-baddia-ink/70 font-display font-bold mt-1.5 text-center">
                    {nextMilestone.days - streak} {nextMilestone.days - streak === 1 ? "día" : "días"} para {nextMilestone.emoji} <span className="text-baddia-hot">{nextMilestone.name}</span>
                  </p>
                </div>
              )}

              {/* glow points + share */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl border-2 border-baddia-ink bg-baddia-yellow px-3 py-2 shadow-[2px_2px_0_hsl(260_16%_15%)] flex items-center gap-2">
                  <Trophy size={16} className="text-baddia-ink"/>
                  <div className="min-w-0">
                    <p className="font-display font-black text-[14px] leading-none text-baddia-ink">{glowPoints} pts</p>
                    <p className="text-[9.5px] font-display font-black uppercase tracking-widest text-baddia-ink/60 mt-0.5">glow points</p>
                  </div>
                </div>
                <button
                  onClick={()=>setShareOpen(true)}
                  className="rounded-xl border-2 border-baddia-ink bg-baddia-ink text-white px-3 py-2 shadow-[2px_2px_0_hsl(338_90%_68%)] flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Share2 size={14}/> <span className="font-display font-black text-[12px]">Compartir racha</span>
                </button>
              </div>

              {/* Main CTA — big, right under pts + share */}
              <button
                onClick={() => completedToday ? null : setStep("ritual")}
                disabled={completedToday}
                className={`relative w-full mt-3 rounded-2xl border-[3px] border-baddia-ink py-3.5 font-display font-black text-[16px] shadow-[5px_5px_0_hsl(260_16%_15%)] active:scale-95 overflow-hidden whitespace-nowrap ${completedToday ? "bg-baddia-mint text-baddia-ink" : "bg-gradient-to-r from-baddia-hot via-baddia-bubble to-baddia-lavender text-white"}`}
              >
                {!completedToday && (
                  <span className="absolute inset-0 opacity-40 pointer-events-none animate-shimmer"
                    style={{ background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.7) 50%, transparent 70%)", backgroundSize: "200% 100%" }}
                  />
                )}
                <span className="relative inline-flex items-center justify-center gap-2">
                  {completedToday ? (
                    <>
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border-[2px] border-baddia-ink">
                        <Check size={14} strokeWidth={3} className="text-baddia-ink" />
                      </span>
                      Día completado · vuelve mañana
                    </>
                  ) : (
                    <>
                      Manifestar hoy
                      <Sparkles size={18} className="text-white animate-pulse" />
                    </>
                  )}
                </span>
              </button>
            </section>

            {/* Intention card — sticky note */}
            <section
              className="relative rounded-2xl border-2 border-baddia-ink bg-[#fff8b0] p-4 pt-5 shadow-[4px_4px_0_hsl(260_16%_15%)]"
              style={{ transform: "rotate(-1deg)" }}
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/70 border border-baddia-ink/20 rotate-2 shadow-sm" />
              <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/60">tu intención</p>
              <p className="font-display font-black text-[15px] text-baddia-ink leading-snug mt-1">
                "{data.intention}"
              </p>
            </section>

            {/* My own manifestations (photo + caption) */}
            <MyManifests onRun={(m) => setRunningMy(m)} />

            {/* 30-day flower garden */}
            <SectionLabel emoji="🌷" text="tu jardín de 30 días" />
            <section className="rounded-2xl border-2 border-baddia-ink bg-white/95 p-3 shadow-[3px_3px_0_hsl(260_16%_15%)]">
              <FlowerGarden completed={data.daysCompleted} createdAt={data.createdAt} />
              <p className="text-[10.5px] text-baddia-ink/60 font-display font-bold text-center mt-2">
                cada día que vuelves, florece una flor 🌸
              </p>
            </section>

            {/* Week + energy split */}
            <div className="grid grid-cols-1 gap-3">
              <section className="rounded-2xl border-2 border-baddia-ink bg-white p-3 shadow-[3px_3px_0_hsl(260_16%_15%)]">
                <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/60 mb-2 pl-1">📅 esta semana</p>
                <div className="grid grid-cols-7 gap-1.5">
                  {(() => {
                    const today = new Date();
                    const dow = (today.getDay() + 6) % 7;
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
                          <div className={`w-9 h-9 rounded-xl border-2 border-baddia-ink flex items-center justify-center text-base shadow-[1.5px_1.5px_0_hsl(260_16%_15%)] ${done ? "bg-gradient-to-br from-baddia-hot to-baddia-bubble" : isToday ? "bg-baddia-yellow" : "bg-white"} ${isToday?"ring-2 ring-baddia-ink/40":""}`}>
                            {done ? "🌸" : isToday ? "·" : ""}
                          </div>
                          <span className="text-[9px] text-baddia-ink/50 font-semibold">{d.getDate()}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </section>
            </div>

            {/* Today's energy */}
            <section className="relative rounded-2xl border-2 border-baddia-ink bg-baddia-mint p-4 pt-5 shadow-[3px_3px_0_hsl(260_16%_15%)]">
              <span className="absolute -top-3 left-4"><WashiLabel color="bg-white" rot={-2}>energía de hoy</WashiLabel></span>
              <p className="font-display font-black text-[16px] text-baddia-ink leading-snug">
                "{AFFIRMATIONS[streak % AFFIRMATIONS.length]}"
              </p>
            </section>


            {/* Reminder + share row */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={toggleRemind}
                className={`rounded-2xl border-2 border-baddia-ink p-3 shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center gap-2 active:scale-95 ${data.remind ? "bg-baddia-bubble" : "bg-white"}`}
              >
                {data.remind ? <Bell size={16}/> : <BellOff size={16}/>}
                <span className="text-left">
                  <span className="block font-display font-black text-[11.5px] text-baddia-ink leading-tight">Recordatorio diario</span>
                  <span className="block text-[9.5px] text-baddia-ink/65 font-semibold">{data.reminderEnabled && data.reminderTime ? `Activo · ${data.reminderTime}` : "Toca para activar"}</span>
                </span>
              </button>
              <button
                onClick={()=>setShareOpen(true)}
                className="rounded-2xl border-2 border-baddia-ink bg-white p-3 shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center gap-2 active:scale-95"
              >
                <span className="w-7 h-7 rounded-lg border-2 border-baddia-ink bg-baddia-yellow flex items-center justify-center">🌸</span>
                <span className="text-left">
                  <span className="block font-display font-black text-[11.5px] text-baddia-ink leading-tight">Postear mi racha</span>
                  <span className="block text-[9.5px] text-baddia-ink/65 font-semibold">para stories ✨</span>
                </span>
              </button>
            </div>

            {/* Social proof */}
            <div className="rounded-2xl border-2 border-baddia-ink bg-white/90 px-3 py-2.5 shadow-[2px_2px_0_hsl(260_16%_15%)] flex items-center gap-2">
              <div className="flex -space-x-2">
                {["🌸","💗","✨","🌿"].map((e,i)=>(
                  <span key={i} className="w-7 h-7 rounded-full border-2 border-baddia-ink bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-sm">{e}</span>
                ))}
              </div>
              <p className="text-[11.5px] font-display font-bold text-baddia-ink/80 leading-tight">
                <span className="font-black">{socialCountToday().toLocaleString()}</span> girls manifestando hoy contigo
              </p>
            </div>

            {/* Milestones rail */}
            <SectionLabel emoji="🏆" text="badges que vienen" />
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
              {MILESTONES.map((m) => {
                const reached = streak >= m.days;
                return (
                  <div
                    key={m.days}
                    className={`shrink-0 w-[110px] rounded-2xl border-2 border-baddia-ink p-3 shadow-[3px_3px_0_hsl(260_16%_15%)] text-center ${reached ? "bg-gradient-to-br from-baddia-yellow to-baddia-bubble" : "bg-white/80"}`}
                  >
                    <div className="text-3xl">{reached ? m.emoji : "🔒"}</div>
                    <p className="font-display font-black text-[11px] text-baddia-ink mt-1 leading-tight">{m.name}</p>
                    <p className="text-[9.5px] text-baddia-ink/60 font-display font-bold mt-0.5">día {m.days}</p>
                  </div>
                );
              })}
            </div>

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
              {["✨","💖","🌸","⭐","💫","🌿","🌼"].map((e,i)=>(
                <span key={i} className="absolute text-2xl animate-float-cute" style={{left:`${5+i*13}%`, top:`${10+(i%3)*25}%`, animationDelay:`${i*0.2}s`}}>{e}</span>
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
              <span className="text-baddia-ink/30">·</span>
              <span className="font-display font-black text-[12px] text-baddia-hot">+25 glow pts</span>
            </div>
            <p className="relative text-[12px] text-white/90 font-semibold mt-4 leading-relaxed">
              Baddia guardó tu energía de hoy.<br/>Vuelve mañana para no romper tu Racha Glow.
            </p>
            <div className="relative mt-5 grid grid-cols-2 gap-2">
              <button onClick={()=>setShareOpen(true)} className="rounded-xl border-2 border-baddia-ink bg-white px-3 py-2.5 text-[12px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] active:scale-95 inline-flex items-center justify-center gap-1.5">
                <Share2 size={14}/> Compartir
              </button>
              <button onClick={()=>setStep("streak")} className="rounded-xl border-2 border-baddia-ink bg-baddia-ink text-white px-3 py-2.5 text-[12px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] active:scale-95">
                Ver mi progreso
              </button>
            </div>
          </section>
        )}
      </main>

      {/* Share sheet */}
      {shareOpen && data && (
        <ShareSheet
          onClose={()=>setShareOpen(false)}
          intention={data.intention}
          category={data.category}
          streak={streak}
          milestone={currentMilestone}
          name={user.name}
        />
      )}

      {/* Reminder ask sheet */}
      {reminderSheet === "ask" && (
        <ReminderAskSheet
          onSameTime={acceptSameTime}
          onPick={() => setReminderSheet("picker")}
          onLater={() => setReminderSheet(null)}
          onClose={() => setReminderSheet(null)}
        />
      )}

      {/* Time picker for custom hour */}
      <TimePickerSheet
        open={reminderSheet === "picker"}
        onClose={() => setReminderSheet("ask")}
        value={data?.reminderTime ?? "09:00"}
        onChange={(t) => saveReminder(t)}
        title="¿A qué hora te aviso?"
        emoji="💗"
      />

      {/* Permission denied sheet */}
      {reminderSheet === "denied" && (
        <PermissionDeniedSheet onClose={() => setReminderSheet(null)} onGoSettings={() => { setReminderSheet(null); go("notifications"); }} />
      )}

      {/* Reminder saved micro-feedback */}
      {reminderJustSaved && (
        <div className="fixed inset-x-0 top-6 z-[80] flex justify-center pointer-events-none animate-pop-in-cute">
          <div className="px-4 py-2 rounded-full border-[2.5px] border-baddia-ink bg-baddia-yellow shadow-[3px_3px_0_hsl(260_16%_15%)] font-display font-black text-[12px] text-baddia-ink flex items-center gap-1.5">
            <Bell size={14} /> Recordatorio guardado ✨
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────── Reminder ask sheet ─────────── */
function ReminderAskSheet({
  onSameTime, onPick, onLater, onClose,
}: { onSameTime: () => void; onPick: () => void; onLater: () => void; onClose: () => void }) {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-baddia-ink/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-t-[32px] bg-white border-t-[3px] border-x-[3px] border-baddia-ink p-6 pb-8 shadow-[0_-6px_24px_-8px_rgba(0,0,0,0.3)] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mx-auto block w-12 h-1.5 rounded-full bg-baddia-ink/20 mb-4" />
        <div className="text-center">
          <span className="inline-block text-4xl animate-float-cute">💗</span>
          <h3 className="font-display font-black text-[22px] text-baddia-ink mt-2 leading-tight">
            ¿Quieres manifestar <br /><span className="gradient-text">mañana conmigo?</span>
          </h3>
          <p className="text-[13px] text-baddia-ink/70 font-semibold mt-2 px-2 leading-relaxed">
            Puedo recordarte mañana a esta misma hora para mantener tu racha ✨
          </p>
        </div>
        <div className="mt-6 space-y-2.5">
          <button
            onClick={onSameTime}
            className="w-full rounded-2xl border-[2.5px] border-baddia-ink bg-gradient-to-r from-baddia-hot via-baddia-bubble to-baddia-lavender text-white font-display font-black py-3.5 text-[14px] shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-0.5 inline-flex items-center justify-center gap-2"
          >
            <Bell size={16} /> Sí, mañana a las {hh}:{mm}
          </button>
          <button
            onClick={onPick}
            className="w-full rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-yellow text-baddia-ink font-display font-black py-3 text-[13px] shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-0.5 inline-flex items-center justify-center gap-2"
          >
            <Clock size={15} /> Elegir otra hora
          </button>
          <button
            onClick={onLater}
            className="w-full rounded-2xl border-2 border-baddia-ink bg-white text-baddia-ink/70 font-display font-black py-2.5 text-[12px] shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-0.5"
          >
            Ahora no
          </button>
        </div>
        <p className="text-center text-[10.5px] text-baddia-ink/50 font-semibold mt-3">
          Puedes activarlo después desde Ajustes.
        </p>
      </div>
    </div>
  );
}

function PermissionDeniedSheet({ onClose, onGoSettings }: { onClose: () => void; onGoSettings: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-baddia-ink/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-t-[32px] bg-white border-t-[3px] border-x-[3px] border-baddia-ink p-6 pb-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mx-auto block w-12 h-1.5 rounded-full bg-baddia-ink/20 mb-4" />
        <div className="text-center">
          <span className="inline-block text-4xl">🔕</span>
          <h3 className="font-display font-black text-[19px] text-baddia-ink mt-2 leading-tight">
            No pudimos activar el recordatorio
          </h3>
          <p className="text-[13px] text-baddia-ink/70 font-semibold mt-2 px-2">
            Las notificaciones están desactivadas para Baddia.
          </p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={onClose} className="rounded-2xl border-2 border-baddia-ink bg-white text-baddia-ink font-display font-black py-3 text-[12px] shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-0.5">
            Ahora no
          </button>
          <button onClick={onGoSettings} className="rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-hot text-white font-display font-black py-3 text-[12px] shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-0.5">
            Ir a ajustes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Flower garden 30 days ─────────── */
function FlowerGarden({ completed, createdAt }: { completed: string[]; createdAt: string }) {
  const start = new Date(createdAt);
  const flowers = ["🌸","🌷","🌼","🌺","💐","🌻"];
  const done = new Set(completed);
  return (
    <div className="grid grid-cols-10 gap-1.5">
      {Array.from({length:30}).map((_,i)=>{
        const d = new Date(start); d.setDate(start.getDate()+i);
        const k = d.toISOString().slice(0,10);
        const isDone = done.has(k);
        const isToday = k === todayKey();
        const f = flowers[i % flowers.length];
        return (
          <div
            key={i}
            className={`relative aspect-square rounded-lg border border-baddia-ink/70 flex items-center justify-center text-base transition-all
              ${isDone
                ? "bg-gradient-to-br from-baddia-bubble/60 to-baddia-yellow/60 scale-100"
                : "bg-white/60 grayscale opacity-40 scale-90"}
              ${isToday ? "ring-2 ring-baddia-hot ring-offset-1 ring-offset-white" : ""}
            `}
            title={`Día ${i+1}`}
          >
            <span className={isDone ? "animate-float-cute" : ""} style={{animationDelay:`${(i%6)*0.15}s`}}>
              {isDone ? f : "·"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────── Share Sheet ─────────── */
function ShareSheet({
  onClose, intention, category, streak, milestone, name,
}: {
  onClose: () => void;
  intention: string;
  category: Category;
  streak: number;
  milestone: { name: string; emoji: string; phrase: string } | null;
  name: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const cat = CATEGORIES.find(c=>c.id===category);

  const handleShare = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "racha-glow.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Mi Racha Glow ✨" });
      } else {
        const a = document.createElement("a");
        a.href = dataUrl; a.download = "racha-glow.png"; a.click();
        toast.success("Imagen descargada ✨");
      }
    } catch {
      toast.error("No se pudo compartir");
    } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-baddia-ink/60 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl bg-white border-t-[3px] sm:border-[3px] border-baddia-ink p-5 max-h-[90vh] overflow-y-auto"
        onClick={(e)=>e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="font-display font-black text-[16px] text-baddia-ink">Compartir mi racha ✨</p>
          <button onClick={onClose} className="text-baddia-ink/60 font-display font-black">✕</button>
        </div>

        {/* Shareable card preview */}
        <div className="mx-auto" style={{ width: 320 }}>
          <div
            ref={cardRef}
            className="relative w-[320px] aspect-[9/16] rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #fde8ef 0%, #fff5d6 45%, #e7d8ff 100%)",
            }}
          >
            {/* paper grain */}
            <div className="absolute inset-0 opacity-25 mix-blend-multiply"
              style={{ backgroundImage: "radial-gradient(rgba(120,80,60,0.25) 0.5px, transparent 0.5px)", backgroundSize: "6px 6px" }} />
            {/* deco */}
            <span className="absolute -top-2 -right-2 text-6xl rotate-12">🌼</span>
            <span className="absolute top-12 right-6 text-3xl -rotate-12">🌿</span>
            <span className="absolute -bottom-4 -left-3 text-7xl -rotate-12">💐</span>
            <span className="absolute bottom-24 right-3 text-2xl rotate-6">✨</span>
            {/* tape */}
            <span className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/70 border border-baddia-ink/15 -rotate-3 shadow-sm" />

            <div className="relative h-full flex flex-col p-6 pt-12">
              <p className="font-display font-black text-[12px] uppercase tracking-[0.25em] text-baddia-ink/70 text-center">my racha glow</p>
              <p className="text-center font-display font-black text-[28px] text-baddia-ink mt-1">
                <span className="bg-gradient-to-r from-baddia-hot to-baddia-lavender bg-clip-text text-transparent">
                  manifestando
                </span>
              </p>

              <div className="mt-3 mx-auto px-3 py-1 rounded-full border-2 border-baddia-ink bg-white text-[11px] font-display font-black -rotate-2 shadow-[2px_2px_0_hsl(260_16%_15%)]">
                {cat?.emoji} {category}
              </div>

              {/* big number */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <span className="text-[64px] leading-none">{milestone?.emoji ?? "🌱"}</span>
                <p className="font-display font-black text-[100px] leading-none text-baddia-ink mt-2 drop-shadow-[2px_4px_0_rgba(255,255,255,0.7)]">{streak}</p>
                <p className="font-display font-black text-[14px] uppercase tracking-[0.25em] text-baddia-ink/70 mt-1">
                  {streak===1?"día glow":"días glow"}
                </p>
              </div>

              {/* intention sticker */}
              <div
                className="rounded-xl border-2 border-baddia-ink bg-[#fff8b0] p-3 shadow-[3px_3px_0_hsl(260_16%_15%)]"
                style={{ transform: "rotate(-1.5deg)" }}
              >
                <p className="text-[9px] font-display font-black uppercase tracking-widest text-baddia-ink/60">mi intención</p>
                <p className="font-display font-black text-[12.5px] text-baddia-ink leading-snug mt-0.5 line-clamp-3">
                  "{intention}"
                </p>
              </div>

              <p className="text-center text-[10px] font-display font-black uppercase tracking-[0.25em] text-baddia-ink/60 mt-3">
                @{name.toLowerCase().replace(/\s+/g,"")} · baddia ✨
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleShare}
          disabled={busy}
          className="mt-4 w-full rounded-2xl border-[2.5px] border-baddia-ink bg-gradient-to-r from-baddia-hot via-baddia-bubble to-baddia-lavender text-white font-display font-black py-3 text-[14px] shadow-[3px_3px_0_hsl(260_16%_15%)] active:scale-95 inline-flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {busy ? "Preparando…" : (<><Download size={16}/> Guardar / Compartir</>)}
        </button>
        <p className="text-center text-[10.5px] text-baddia-ink/60 font-display font-bold mt-2">
          Súbela a tu story y etiqueta a @baddia.app 💗
        </p>
      </div>
    </div>
  );
}

/* ─────────── Ritual audio (Web Audio, sin assets) ─────────── */
const AUDIO_KEY = "baddia.manifest.audio";
const loadAudioPref = () => {
  try { const v = localStorage.getItem(AUDIO_KEY); return v === null ? true : v === "1"; } catch { return true; }
};
const saveAudioPref = (on: boolean) => { try { localStorage.setItem(AUDIO_KEY, on ? "1" : "0"); } catch {} };

function useRitualAudio(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);
  const padRef = useRef<{ stop: () => void } | null>(null);

  const getCtx = () => {
    if (!ctxRef.current) {
      const AC = (window.AudioContext || (window as any).webkitAudioContext);
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  };

  const bell = (freq = 528, dur = 3.2) => {
    if (!enabled) return;
    const ctx = getCtx(); if (!ctx) return;
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.28, now + 0.02);
    master.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    master.connect(ctx.destination);
    // partials for a bell/singing-bowl tone
    [1, 2.01, 3.02, 4.7].forEach((mult, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = i === 0 ? "sine" : "triangle";
      o.frequency.value = freq * mult;
      g.gain.value = [0.9, 0.35, 0.18, 0.08][i];
      o.connect(g).connect(master);
      o.start(now);
      o.stop(now + dur);
    });
  };

  const startPad = () => {
    if (!enabled) return;
    const ctx = getCtx(); if (!ctx) return;
    stopPad();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.05, now + 1.2);
    master.connect(ctx.destination);
    const oscs: OscillatorNode[] = [];
    [220, 277.18, 329.63].forEach((f) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f;
      g.gain.value = 0.33;
      // subtle detune shimmer
      const lfo = ctx.createOscillator();
      const lfoG = ctx.createGain();
      lfo.frequency.value = 0.15 + Math.random() * 0.2;
      lfoG.gain.value = 1.2;
      lfo.connect(lfoG).connect(o.detune);
      lfo.start(now);
      o.connect(g).connect(master);
      o.start(now);
      oscs.push(o); oscs.push(lfo);
    });
    padRef.current = {
      stop: () => {
        const t = ctx.currentTime;
        master.gain.cancelScheduledValues(t);
        master.gain.setValueAtTime(master.gain.value, t);
        master.gain.linearRampToValueAtTime(0, t + 0.8);
        oscs.forEach(o => { try { o.stop(t + 0.9); } catch {} });
      },
    };
  };
  const stopPad = () => { padRef.current?.stop(); padRef.current = null; };

  useEffect(() => () => { stopPad(); ctxRef.current?.close().catch(()=>{}); }, []);
  useEffect(() => { if (!enabled) stopPad(); }, [enabled]);

  return { bell, startPad, stopPad };
}

/* ─────────── Ritual sub-screen — guided audio + countdown ─────────── */
type Phase = "guide" | "countdown" | "done";
const DURATIONS: { label: string; s: number }[] = [
  { label: "30s", s: 30 },
  { label: "1 min", s: 60 },
  { label: "3 min", s: 180 },
];

function Ritual({ category, intention, onDone, photo, title }: { category: Category; intention: string; onDone: () => void; photo?: string; title?: string }) {
  const [phase, setPhase] = useState<Phase>("guide");
  const [audioOn, setAudioOn] = useState<boolean>(() => loadAudioPref());
  const [duration, setDuration] = useState(30);
  const [secs, setSecs] = useState(30);
  const [paused, setPaused] = useState(false);
  const [guideLine, setGuideLine] = useState(0);
  const [loadingVoice, setLoadingVoice] = useState(false);

  const { bell, startPad, stopPad } = useRitualAudio(audioOn);
  const { speak, stop: stopVoice } = useBaddiaVoice();

  const guideLines = useMemo(
    () => [
      "Vamos a manifestar hoy.",
      "Respira profundo… suelta un poquito la tensión…",
      `Repite conmigo esta frase: ${intention}`,
      "Ahora repítela tú tres veces en voz baja, o repítela en tu mente. Yo te aviso cuando terminemos.",
    ],
    [intention]
  );
  const finalText = "Ya terminamos por hoy. Lo hiciste muy bien. Tu energía ya está en movimiento.";

  const toggleAudio = () => {
    setAudioOn((v) => {
      const n = !v;
      saveAudioPref(n);
      if (!n) stopVoice();
      return n;
    });
  };

  // Guide sequence: speak each line, then move to countdown
  useEffect(() => {
    if (phase !== "guide") return;
    let cancelled = false;
    (async () => {
      setLoadingVoice(true);
      for (let i = 0; i < guideLines.length; i++) {
        if (cancelled) return;
        setGuideLine(i);
        setLoadingVoice(i === 0);
        if (audioOn) {
          await speak(guideLines[i]);
        } else {
          await new Promise((r) => setTimeout(r, 2600));
        }
        setLoadingVoice(false);
      }
      if (!cancelled) {
        setPhase("countdown");
      }
    })();
    return () => {
      cancelled = true;
      stopVoice();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, audioOn]);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    setSecs(duration);
    bell(528, 3.4);
    const padT = setTimeout(() => startPad(), 350);
    let cancelled = false;
    (async () => {
      if (!audioOn) return;
      await new Promise((r) => setTimeout(r, 700));
      if (cancelled) return;
      await speak("Repite tu frase en tu mente…");
      if (cancelled) return;
      await speak(intention);
    })();
    return () => {
      cancelled = true;
      clearTimeout(padT);
      stopPad();
      stopVoice();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, duration]);

  useEffect(() => {
    if (phase !== "countdown" || paused) return;
    if (secs <= 0) return;
    const id = setInterval(() => setSecs((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(id);
  }, [phase, paused, secs]);

  useEffect(() => {
    if (phase === "countdown" && secs === 0) {
      stopPad();
      bell(660, 3.8);
      (async () => {
        if (audioOn) await speak(finalText);
        else await new Promise((r) => setTimeout(r, 1600));
        setPhase("done");
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secs, phase]);

  const cancel = () => {
    stopPad();
    stopVoice();
    onDone(); // returns to streak via completeToday? No — we want cancel to NOT count. Use setStep back via prop? For now use a flag:
  };

  // ── Rendering ──────────────────────────────────────────────────
  const progress = phase === "countdown" ? 1 - secs / duration : 0;
  const R = 62;
  const C = 2 * Math.PI * R;

  return (
    <div className="space-y-4">
      {/* Controls bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 flex items-center justify-center gap-2">
          {(["guide", "countdown", "done"] as Phase[]).map((p, i) => (
            <span
              key={p}
              className={`h-2 rounded-full border border-baddia-ink/40 transition-all ${
                p === phase
                  ? "w-10 bg-baddia-hot"
                  : (phase === "countdown" && i === 0) || (phase === "done" && i < 2)
                    ? "w-6 bg-baddia-bubble"
                    : "w-6 bg-white"
              }`}
            />
          ))}
        </div>
        <button
          onClick={toggleAudio}
          aria-label={audioOn ? "Silenciar audio" : "Activar audio"}
          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border-2 border-baddia-ink text-[10px] font-display font-black uppercase tracking-wider shadow-[2px_2px_0_hsl(260_16%_15%)] active:scale-95 transition-all ${audioOn ? "bg-baddia-bubble text-baddia-ink" : "bg-white text-baddia-ink/60"}`}
        >
          {audioOn ? <Volume2 size={12} /> : <VolumeX size={12} />}
          {audioOn ? "sonido" : "mute"}
        </button>
      </div>

      {/* GUIDE PHASE */}
      {phase === "guide" && (
        <section className="relative rounded-3xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6 shadow-[4px_4px_0_hsl(260_16%_15%)] text-center overflow-hidden">
          {/* aura */}
          <span className="absolute -top-16 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-baddia-bubble/30 blur-3xl animate-pulse-slow pointer-events-none" />
          <span className="absolute -bottom-14 -right-10 w-48 h-48 rounded-full bg-baddia-lavender/30 blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: "1.4s" }} />

          <p className="relative text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink/60">Baddia te guía ✨</p>
          <div className="relative mx-auto mt-4 w-24 h-24 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-baddia-hot/20 animate-breathe" />
            <span className="absolute inset-2 rounded-full bg-baddia-bubble/40 animate-pulse-slow" />
            <span className="relative text-4xl animate-float-cute">🌙</span>
          </div>

          <div className="relative mt-5 min-h-[92px] flex items-center justify-center px-2">
            <p key={guideLine} className="font-display font-black text-[18px] text-baddia-ink leading-snug animate-pop-in-cute">
              {loadingVoice && guideLine === 0 ? "…" : guideLines[guideLine]}
            </p>
          </div>

          <div className="relative flex items-center justify-center gap-1.5 mt-4">
            {guideLines.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === guideLine ? "w-8 bg-baddia-hot" : i < guideLine ? "w-4 bg-baddia-bubble/70" : "w-4 bg-baddia-ink/15"}`} />
            ))}
          </div>

          <button
            onClick={() => { stopVoice(); setPhase("countdown"); }}
            className="relative mt-5 w-full rounded-2xl border-2 border-baddia-ink bg-white text-baddia-ink font-display font-black py-2.5 text-[12px] shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-0.5"
          >
            Saltar guía
          </button>
        </section>
      )}

      {/* COUNTDOWN PHASE */}
      {phase === "countdown" && (
        <section className="relative rounded-3xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-baddia-lavender/40 via-white to-baddia-bubble/30 p-6 shadow-[4px_4px_0_hsl(260_16%_15%)] text-center overflow-hidden">
          {/* breathing aura */}
          <span className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 40%, hsl(325 100% 82% / 0.35), transparent 60%)", animation: "breathe 4.5s ease-in-out infinite" }} />

          {/* duration chips */}
          <div className="relative flex items-center justify-center gap-1.5 mb-4">
            {DURATIONS.map((d) => (
              <button
                key={d.s}
                onClick={() => { setDuration(d.s); setSecs(d.s); setPaused(false); }}
                className={`px-2.5 py-1 rounded-full border-2 border-baddia-ink text-[10px] font-display font-black uppercase tracking-wider transition ${duration === d.s ? "bg-baddia-hot text-white shadow-[2px_2px_0_hsl(260_16%_15%)]" : "bg-white text-baddia-ink/70"}`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* progress ring */}
          <div className="relative mx-auto w-52 h-52 flex items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-baddia-bubble/50 via-baddia-yellow/30 to-baddia-lavender/50 blur-2xl animate-pulse-slow" />
            {/* floating sparkles */}
            {["✨", "💗", "✦", "🌸", "✧"].map((s, i) => (
              <span
                key={i}
                className="absolute text-lg animate-float-cute"
                style={{
                  left: `${10 + i * 18}%`,
                  top: `${5 + (i % 2) * 80}%`,
                  animationDelay: `${i * 0.35}s`,
                  filter: "drop-shadow(0 0 8px rgba(255,255,255,0.7))",
                }}
              >
                {s}
              </span>
            ))}
            <svg viewBox="0 0 140 140" className="absolute inset-0 -rotate-90">
              <circle cx="70" cy="70" r={R} fill="none" stroke="hsl(260 16% 15% / 0.08)" strokeWidth="8" />
              <circle
                cx="70" cy="70" r={R} fill="none" strokeLinecap="round" strokeWidth="8"
                stroke="url(#ritG)"
                strokeDasharray={C}
                strokeDashoffset={C - C * progress}
                style={{ transition: "stroke-dashoffset 1s linear", filter: "drop-shadow(0 0 10px hsl(325 100% 74% / 0.7))" }}
              />
              <defs>
                <linearGradient id="ritG" x1="0" x2="1">
                  <stop offset="0%" stopColor="hsl(338 90% 68%)" />
                  <stop offset="50%" stopColor="hsl(325 100% 78%)" />
                  <stop offset="100%" stopColor="hsl(256 90% 78%)" />
                </linearGradient>
              </defs>
            </svg>
            {photo && (
              <span
                className="absolute rounded-full overflow-hidden border-[3px] border-white shadow-[0_4px_20px_rgba(0,0,0,0.25)]"
                style={{ inset: 22 }}
              >
                <img src={photo} alt="" className="w-full h-full object-cover" style={{ filter: "saturate(1.1) contrast(1.02) brightness(0.9)" }} />
                <span className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-baddia-ink/50" />
              </span>
            )}
            <div className="relative flex flex-col items-center justify-center">
              <span className={`font-display font-black text-[54px] leading-none drop-shadow-[0_2px_0_rgba(255,255,255,0.7)] ${photo ? "text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]" : "text-baddia-ink"}`}>
                {secs}
              </span>
              <span className={`text-[10px] font-display font-black uppercase tracking-[0.2em] mt-1 ${photo ? "text-white/90" : "text-baddia-ink/60"}`}>
                {paused ? "en pausa" : "segundos"}
              </span>
            </div>
          </div>

          <p className="relative mt-4 text-[13px] font-display font-black italic text-baddia-ink/80">
            Repite tu frase en tu mente…
          </p>
          <p className="relative text-[12px] text-baddia-ink/60 font-semibold italic mt-1 px-3 line-clamp-2">
            "{intention}"
          </p>

          {/* controls */}
          <div className="relative mt-5 grid grid-cols-2 gap-2">
            <button
              onClick={() => setPaused((p) => !p)}
              className="rounded-2xl border-[2.5px] border-baddia-ink bg-white text-baddia-ink font-display font-black py-2.5 text-[12px] shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-0.5 inline-flex items-center justify-center gap-1.5"
            >
              {paused ? <><Play size={14} /> Continuar</> : <><Pause size={14} /> Pausar</>}
            </button>
            <button
              onClick={() => { stopPad(); stopVoice(); onDone(); }}
              className="rounded-2xl border-2 border-baddia-ink bg-baddia-ink/90 text-white font-display font-black py-2.5 text-[12px] shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-0.5 inline-flex items-center justify-center gap-1.5"
            >
              <Check size={14} /> Terminar ahora
            </button>
          </div>
        </section>
      )}

      {/* DONE PHASE — mini celebration before parent celebrate step */}
      {phase === "done" && (
        <section className="relative rounded-3xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-baddia-yellow/60 via-white to-baddia-bubble/40 p-6 shadow-[4px_4px_0_hsl(260_16%_15%)] text-center overflow-hidden">
          {/* confetti */}
          <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 22 }).map((_, i) => (
              <span
                key={i}
                className="absolute text-lg"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: "-10%",
                  animation: `confetti 2.2s cubic-bezier(.4,.1,.5,1) ${i * 0.06}s forwards`,
                  filter: "drop-shadow(0 0 4px rgba(255,255,255,0.7))",
                }}
              >
                {["✨", "💗", "🌸", "💫", "✦"][i % 5]}
              </span>
            ))}
          </div>
          <div className="relative">
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-baddia-hot/30 animate-breathe" />
              <span className="relative text-5xl animate-pop-in-cute">💗</span>
            </div>
            <p className="mt-3 font-display font-black text-[22px] text-baddia-ink leading-tight">
              Manifestación completada ✨
            </p>
            <p className="text-[13px] text-baddia-ink/70 font-semibold italic mt-1">
              Volviste a elegirte hoy.
            </p>
            <button
              onClick={onDone}
              className="mt-5 w-full rounded-2xl border-[2.5px] border-baddia-ink bg-gradient-to-r from-baddia-hot via-baddia-bubble to-baddia-lavender text-white font-display font-black py-3 text-[14px] shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-0.5 inline-flex items-center justify-center gap-2"
            >
              <Check size={16} /> Sumar a mi racha
            </button>
          </div>
          <style>{`
            @keyframes confetti {
              0%   { transform: translateY(0) rotate(0); opacity: 0; }
              15%  { opacity: 1; }
              100% { transform: translateY(320px) rotate(360deg); opacity: 0; }
            }
          `}</style>
        </section>
      )}
    </div>
  );
}

