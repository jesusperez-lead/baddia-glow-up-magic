import { useMemo, useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import {
  ArrowLeft, Bookmark, Share2, ChevronRight, CalendarDays, Sparkles,
} from "lucide-react";
import { toast } from "sonner";

type EntryKind =
  | "glow" | "quote" | "tarot" | "manifest"
  | "dream" | "crush" | "outfit" | "aura" | "mood";

interface TimelineEntry {
  id: string;
  kind: EntryKind;
  title: string;
  detail: string;
  hour: string;
  saved?: boolean;
}

interface DayGroup {
  key: string;
  label: string;    // "Lunes"
  dateLabel: string; // "14 oct"
  mood: { emoji: string; label: string; tint: string };
  glow: number;
  color: { name: string; from: string; to: string };
  entries: TimelineEntry[];
}

const KIND_META: Record<EntryKind, { emoji: string; label: string; tint: string; chip: string }> = {
  glow:     { emoji: "✨", label: "Glow Score",   tint: "bg-baddia-yellow/40", chip: "bg-baddia-gold text-baddia-ink" },
  quote:    { emoji: "💬", label: "Frase",        tint: "bg-baddia-bubble",    chip: "bg-baddia-hot text-white" },
  tarot:    { emoji: "🔮", label: "Tarot",        tint: "bg-baddia-soft",      chip: "bg-baddia-purple text-white" },
  manifest: { emoji: "🌙", label: "Manifestación", tint: "bg-baddia-lavender/25", chip: "bg-baddia-lavender text-white" },
  dream:    { emoji: "☁️", label: "Sueño",        tint: "bg-baddia-soft/70",   chip: "bg-baddia-purple text-white" },
  crush:    { emoji: "💘", label: "Crush Energy", tint: "bg-baddia-hot/15",    chip: "bg-baddia-hot text-white" },
  outfit:   { emoji: "👗", label: "Outfit",       tint: "bg-baddia-mint/25",   chip: "bg-baddia-mint text-white" },
  aura:     { emoji: "🌈", label: "Aura",         tint: "bg-baddia-bubble/60", chip: "bg-baddia-hot text-white" },
  mood:     { emoji: "🫧", label: "Mood",         tint: "bg-baddia-lime/40",   chip: "bg-baddia-mint text-white" },
};

const WEEK: DayGroup[] = [
  {
    key: "lun", label: "Lunes", dateLabel: "14 oct",
    mood: { emoji: "🥺", label: "Confundida", tint: "bg-baddia-soft" },
    glow: 82,
    color: { name: "Rosa cuarzo", from: "#FFD6E6", to: "#FF7AC8" },
    entries: [
      { id: "l1", kind: "glow",  title: "Glow Score 82%", detail: "Magnética pero un poquito dispersa hoy ✨", hour: "08:12" },
      { id: "l2", kind: "mood",  title: "Mood: confundida", detail: "Registraste tu energía por la mañana 🫧", hour: "08:30" },
      { id: "l3", kind: "quote", title: "Frase guardada", detail: "\"Lo que es para mí, llega sin forzar.\"", hour: "10:04", saved: true },
    ],
  },
  {
    key: "mar", label: "Martes", dateLabel: "15 oct",
    mood: { emoji: "🌟", label: "Inspirada", tint: "bg-baddia-yellow/50" },
    glow: 91,
    color: { name: "Dorado glow", from: "#FFF0B8", to: "#FFD12E" },
    entries: [
      { id: "m1", kind: "tarot",    title: "La Estrella", detail: "Fe, esperanza y renacimiento emocional 🌟", hour: "09:20", saved: true },
      { id: "m2", kind: "manifest", title: "Manifestación completada", detail: "\"El dinero llega a mí con claridad y orden.\"", hour: "21:00" },
    ],
  },
  {
    key: "mie", label: "Miércoles", dateLabel: "16 oct",
    mood: { emoji: "☁️", label: "Soñadora", tint: "bg-baddia-lavender/25" },
    glow: 74,
    color: { name: "Violeta luna", from: "#D9C8FF", to: "#6E47E8" },
    entries: [
      { id: "w1", kind: "dream", title: "Interpretación de sueño", detail: "Soñaste con agua clara: emociones limpiándose 💧", hour: "07:45" },
      { id: "w2", kind: "quote", title: "Frase guardada", detail: "\"Mi intuición nunca me miente.\"", hour: "13:10", saved: true },
    ],
  },
  {
    key: "jue", label: "Jueves", dateLabel: "17 oct",
    mood: { emoji: "💘", label: "Enamorada", tint: "bg-baddia-hot/15" },
    glow: 88,
    color: { name: "Bubble pink", from: "#FFE0F0", to: "#FF7AC8" },
    entries: [
      { id: "j1", kind: "crush", title: "Crush Energy · Mateo", detail: "87% de compatibilidad · te está pensando 💘", hour: "16:22" },
      { id: "j2", kind: "mood",  title: "Mood: mariposas", detail: "Energía alta y magnética toda la tarde", hour: "18:00" },
    ],
  },
  {
    key: "vie", label: "Viernes", dateLabel: "18 oct",
    mood: { emoji: "🔥", label: "Bad", tint: "bg-baddia-hot/20" },
    glow: 95,
    color: { name: "Coral baddie", from: "#FFD0C2", to: "#FF6B6B" },
    entries: [
      { id: "v1", kind: "outfit",   title: "Outfit Check", detail: "Coral + dorado · magnetismo activado 🔥", hour: "19:30" },
      { id: "v2", kind: "manifest", title: "Manifestación completada", detail: "\"Atraigo noches divertidas y bonitas.\"", hour: "22:00" },
    ],
  },
];

const FILTERS: { key: "all" | EntryKind; label: string; emoji: string }[] = [
  { key: "all",      label: "Todo",       emoji: "✨" },
  { key: "glow",     label: "Glow",       emoji: "✨" },
  { key: "quote",    label: "Frases",     emoji: "💬" },
  { key: "tarot",    label: "Tarot",      emoji: "🔮" },
  { key: "manifest", label: "Manifest",   emoji: "🌙" },
  { key: "dream",    label: "Sueños",     emoji: "☁️" },
  { key: "crush",    label: "Crush",      emoji: "💘" },
  { key: "outfit",   label: "Outfit",     emoji: "👗" },
  { key: "mood",     label: "Mood",       emoji: "🫧" },
];

export function History() {
  const { go } = useBaddia();
  const [filter, setFilter] = useState<"all" | EntryKind>("all");
  const [days, setDays] = useState<DayGroup[]>(WEEK);

  const filtered = useMemo(() => {
    if (filter === "all") return days;
    return days
      .map((d) => ({ ...d, entries: d.entries.filter((e) => e.kind === filter) }))
      .filter((d) => d.entries.length > 0);
  }, [days, filter]);

  const toggleSave = (dayKey: string, id: string) => {
    setDays((prev) =>
      prev.map((d) =>
        d.key !== dayKey
          ? d
          : { ...d, entries: d.entries.map((e) => (e.id === id ? { ...e, saved: !e.saved } : e)) }
      )
    );
  };

  return (
    <div className="relative min-h-full bg-white pb-16 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/25" />
      <div className="blob top-72 -right-16 w-60 h-60 bg-baddia-soft/30" style={{ animationDelay: "3s" }} />
      <SparklesDeco />

      {/* App bar */}
      <header className="relative z-10 px-5 pt-6 pb-3 flex items-center gap-3">
        <button
          onClick={() => go("profile")}
          aria-label="Volver"
          className="w-10 h-10 rounded-2xl bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
        >
          <ArrowLeft size={16} className="text-baddia-ink" />
        </button>
        <div className="flex-1 min-w-0">
          <span className="inline-block rounded-full bg-baddia-lavender text-white border-2 border-baddia-ink px-2.5 py-1 text-[10px] font-display font-bold shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2 mb-1.5 uppercase tracking-wider">
            ✦ tu diario energético
          </span>
          <h1 className="font-display font-black text-[22px] text-baddia-ink leading-tight">
            Tu <span className="gradient-text">timeline</span> ✨
          </h1>
        </div>
        <button
          onClick={() => go("calendar")}
          aria-label="Abrir calendario"
          className="w-10 h-10 rounded-2xl bg-baddia-lavender text-white border-2 border-baddia-ink flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
        >
          <CalendarDays size={16} />
        </button>
      </header>

      <div className="relative z-10 px-5 space-y-4">
        <p className="text-[13px] text-baddia-ink/70 font-medium leading-snug">
          Un diario visual de tu energía: mood, tarot, frases y manifestaciones día a día 💫
        </p>

        {/* Filtros */}
        <div className="-mx-5 px-5 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-1 w-max">
            {FILTERS.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-display font-black border-2 border-baddia-ink transition-all ${
                    active
                      ? "bg-baddia-ink text-white shadow-[3px_3px_0_hsl(260_16%_15%/0.4)] -translate-y-[1px]"
                      : "bg-white text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%/0.55)] active:translate-y-[1px] active:shadow-[1px_1px_0_hsl(260_16%_15%/0.55)]"
                  }`}
                >
                  <span className="text-[13px] leading-none">{f.emoji}</span> {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="relative pl-6 pt-2">
            {/* Línea vertical del timeline */}
            <div className="absolute left-[10px] top-3 bottom-3 w-[3px] bg-gradient-to-b from-baddia-bubble via-baddia-lavender to-baddia-soft rounded-full" />

            <div className="space-y-5">
              {filtered.map((day, di) => (
                <DayBlock
                  key={day.key}
                  day={day}
                  onToggleSave={(id) => toggleSave(day.key, id)}
                  style={{ animationDelay: `${di * 60}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DayBlock({
  day, onToggleSave, style,
}: {
  day: DayGroup;
  onToggleSave: (id: string) => void;
  style?: React.CSSProperties;
}) {
  return (
    <div className="relative animate-slide-up" style={style}>
      {/* Dot del timeline */}
      <div
        className="absolute -left-[22px] top-1 w-5 h-5 rounded-full border-2 border-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)]"
        style={{ background: `linear-gradient(135deg, ${day.color.from}, ${day.color.to})` }}
      />

      {/* Header del día */}
      <div className="flex items-center gap-2 mb-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white text-baddia-ink border-2 border-baddia-ink px-2.5 py-1 text-[11px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] uppercase tracking-wider">
          {day.label} <span className="text-baddia-ink/50">·</span> {day.dateLabel}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-full ${day.mood.tint} text-baddia-ink border-2 border-baddia-ink px-2.5 py-1 text-[10px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1`}>
          {day.mood.emoji} {day.mood.label}
        </span>
      </div>

      {/* Card de resumen del día */}
      <div className="rounded-2xl bg-white border-[2.5px] border-baddia-ink p-3 mb-3 shadow-[4px_5px_0_hsl(260_16%_15%)] flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-2xl border-2 border-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] flex items-center justify-center text-white font-display font-black text-[13px]"
          style={{ background: `linear-gradient(135deg, ${day.color.from}, ${day.color.to})` }}
        >
          {day.glow}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-black text-baddia-ink text-[12px] leading-tight">
            Glow del día · {day.glow}%
          </p>
          <p className="text-[11px] text-baddia-ink/70 font-medium leading-snug truncate">
            Color: {day.color.name}
          </p>
        </div>
        <Sparkles size={16} className="text-baddia-lavender shrink-0" />
      </div>

      {/* Entradas */}
      <div className="space-y-2.5">
        {day.entries.map((e) => (
          <EntryCard key={e.id} entry={e} onToggleSave={() => onToggleSave(e.id)} />
        ))}
      </div>
    </div>
  );
}

function EntryCard({
  entry, onToggleSave,
}: {
  entry: TimelineEntry;
  onToggleSave: () => void;
}) {
  const meta = KIND_META[entry.kind];
  return (
    <div className="relative">
      <div className="absolute -top-2.5 left-3 z-10">
        <span className={`inline-flex items-center gap-1 rounded-full ${meta.chip} border-2 border-baddia-ink px-2 py-0.5 text-[9px] font-display font-black uppercase tracking-wider shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1`}>
          {meta.emoji} {meta.label}
        </span>
      </div>
      <div className="rounded-2xl bg-white border-2 border-baddia-ink p-3 pt-4 pl-3 shadow-[3px_4px_0_hsl(260_16%_15%)]">
        <div className="flex items-start gap-2.5">
          <span className={`shrink-0 w-9 h-9 rounded-xl border-2 border-baddia-ink ${meta.tint} flex items-center justify-center text-lg shadow-[2px_2px_0_hsl(260_16%_15%)]`}>
            {meta.emoji}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-display font-black text-baddia-ink text-[13px] leading-tight truncate">
                {entry.title}
              </p>
              <span className="text-[10px] text-baddia-ink/45 font-display font-bold uppercase tracking-wider shrink-0">
                {entry.hour}
              </span>
            </div>
            <p className="text-[12px] text-baddia-ink/75 font-medium mt-0.5 line-clamp-2 leading-snug">
              {entry.detail}
            </p>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <button
            onClick={onToggleSave}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-baddia-ink py-1.5 text-[10px] font-display font-black transition-all active:translate-y-[1px] ${
              entry.saved
                ? "bg-baddia-gold text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)]"
                : "bg-white text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%/0.55)]"
            }`}
          >
            <Bookmark size={11} className={entry.saved ? "fill-baddia-ink" : ""} />
            {entry.saved ? "Guardada" : "Guardar"}
          </button>
          <button
            onClick={() => toast("Compartiendo tu glow ✨")}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-baddia-lavender text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
            aria-label="Compartir"
          >
            <Share2 size={11} />
          </button>
          <button
            onClick={() => toast(`Abriendo ${meta.label} ✨`)}
            className="inline-flex items-center justify-center rounded-full bg-baddia-ink text-white border-2 border-baddia-ink px-2.5 py-1.5 shadow-[2px_2px_0_hsl(260_16%_15%/0.4)] active:translate-y-[1px] transition-all"
            aria-label="Abrir"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl bg-gradient-pearl border-[2.5px] border-baddia-ink p-7 text-center shadow-[5px_6px_0_hsl(260_16%_15%)]">
      <p className="font-display font-black text-baddia-ink text-[16px]">
        Nada aquí todavía ✨
      </p>
      <p className="text-[12px] text-baddia-ink/70 font-medium mt-1.5 leading-snug">
        Cuando registres tu energía, aparecerá en tu diario visual.
      </p>
    </div>
  );
}
