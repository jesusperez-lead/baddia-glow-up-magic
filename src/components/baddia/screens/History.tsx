import { useMemo, useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import {
  ArrowLeft, Search, Bookmark, Share2, Trash2, ChevronRight, History as HistoryIcon,
} from "lucide-react";
import { toast } from "sonner";

type ReadingType = "daily" | "tarot" | "love" | "palm" | "aura" | "compat" | "lucky";

interface ReadingEntry {
  id: string;
  type: ReadingType;
  title: string;
  snippet: string;
  date: Date;
  saved?: boolean;
}

const TYPE_META: Record<ReadingType, { label: string; emoji: string; tint: string; chip: string }> = {
  daily:  { label: "Diaria",        emoji: "🌙", tint: "bg-baddia-bubble",   chip: "bg-baddia-lavender text-white" },
  tarot:  { label: "Tarot",         emoji: "🔮", tint: "bg-baddia-soft",     chip: "bg-baddia-purple text-white" },
  love:   { label: "Crush Energy",  emoji: "💘", tint: "bg-baddia-hot/15",   chip: "bg-baddia-hot text-white" },
  palm:   { label: "Palm Reading",  emoji: "🖐️", tint: "bg-baddia-mint/20",  chip: "bg-baddia-mint text-white" },
  aura:   { label: "Aura Check",    emoji: "🌈", tint: "bg-baddia-yellow/40",chip: "bg-baddia-gold text-baddia-ink" },
  compat: { label: "Compatibilidad",emoji: "💞", tint: "bg-baddia-bubble/60",chip: "bg-baddia-hot text-white" },
  lucky:  { label: "Lucky",         emoji: "🍀", tint: "bg-baddia-lime/40",  chip: "bg-baddia-mint text-white" },
};

const FILTERS: ({ key: "all" | ReadingType; label: string; emoji: string })[] = [
  { key: "all",    label: "Todas",      emoji: "✨" },
  { key: "daily",  label: "Diaria",     emoji: "🌙" },
  { key: "tarot",  label: "Tarot",      emoji: "🔮" },
  { key: "love",   label: "Crush",      emoji: "💘" },
  { key: "palm",   label: "Palm",       emoji: "🖐️" },
  { key: "aura",   label: "Aura",       emoji: "🌈" },
  { key: "compat", label: "Compat",     emoji: "💞" },
  { key: "lucky",  label: "Lucky",      emoji: "🍀" },
];

const MOCK: ReadingEntry[] = [
  { id: "1", type: "daily",  title: "Tu lectura diaria",
    snippet: "Hoy el universo te empuja a confiar en tu intuición. Un mensaje llega antes del atardecer ✨",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), saved: true },
  { id: "2", type: "tarot",  title: "Tirada de 3 cartas",
    snippet: "La Estrella · El Sol · As de Copas. Renacimiento emocional en camino 🌟",
    date: new Date(Date.now() - 1000 * 60 * 60 * 20) },
  { id: "3", type: "love",   title: "Crush Energy de Mateo",
    snippet: "Compatibilidad 87% · Está pensando en ti más de lo que admite 💘",
    date: new Date(Date.now() - 1000 * 60 * 60 * 26), saved: true },
  { id: "4", type: "palm",   title: "Lectura de tu mano izq.",
    snippet: "Línea de la vida fuerte · Línea del corazón curva: amor intenso pero protegido 🖐️",
    date: new Date(Date.now() - 1000 * 60 * 60 * 48) },
  { id: "5", type: "aura",   title: "Aura Check",
    snippet: "Tu aura es rosa-violeta · Energía creativa y magnética hoy 🌈",
    date: new Date(Date.now() - 1000 * 60 * 60 * 72) },
  { id: "6", type: "compat", title: "Tú + Valentina",
    snippet: "Libra + Géminis = 94% besties cósmicas 💞",
    date: new Date(Date.now() - 1000 * 60 * 60 * 96) },
  { id: "7", type: "lucky",  title: "Tus números de la suerte",
    snippet: "11 · 23 · 7 — Color del día: dorado ✨",
    date: new Date(Date.now() - 1000 * 60 * 60 * 120) },
  { id: "8", type: "daily",  title: "Tu lectura diaria",
    snippet: "Día de cerrar ciclos. Suelta lo que ya no vibra contigo 🌙",
    date: new Date(Date.now() - 1000 * 60 * 60 * 144) },
];

function formatDate(d: Date) {
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "ahora";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
  if (diff < 86400 * 7) return `hace ${Math.floor(diff / 86400)} d`;
  return d.toLocaleDateString("es", { day: "numeric", month: "short" });
}

export function History() {
  const { go } = useBaddia();
  const [filter, setFilter] = useState<"all" | ReadingType>("all");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<ReadingEntry[]>(MOCK);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (filter !== "all" && it.type !== filter) return false;
      if (!q) return true;
      return (
        it.title.toLowerCase().includes(q) ||
        it.snippet.toLowerCase().includes(q) ||
        TYPE_META[it.type].label.toLowerCase().includes(q)
      );
    });
  }, [items, filter, query]);

  const toggleSave = (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, saved: !it.saved } : it)));
  };
  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    toast.success("Lectura eliminada del historial");
  };

  return (
    <div className="relative min-h-full bg-white pb-16 overflow-hidden">
      {/* blobs */}
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
            ✦ tu historial
          </span>
          <h1 className="font-display font-black text-[22px] text-baddia-ink leading-tight">
            Tus <span className="gradient-text">lecturas</span> ✨
          </h1>
        </div>
      </header>

      <div className="relative z-10 px-5 space-y-4">
        <p className="text-[13px] text-baddia-ink/70 font-medium leading-snug">
          Revisa, guarda o elimina tus lecturas pasadas. Tu glow tiene memoria 💫
        </p>

        {/* Buscador */}
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-baddia-ink/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar en tu historial…"
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white border-[2.5px] border-baddia-ink text-[13px] font-semibold text-baddia-ink placeholder:text-baddia-ink/40 shadow-[4px_4px_0_hsl(260_16%_15%)] focus:outline-none focus:translate-y-[1px] focus:shadow-[3px_3px_0_hsl(260_16%_15%)] transition-all"
          />
        </div>

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

        {/* Lista */}
        <div className="space-y-3 pt-1">
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            filtered.map((entry, i) => (
              <ReadingCard
                key={entry.id}
                entry={entry}
                onToggleSave={() => toggleSave(entry.id)}
                onRemove={() => removeItem(entry.id)}
                onOpen={() => toast(`Abriendo ${TYPE_META[entry.type].label} ✨`)}
                style={{ animationDelay: `${i * 40}ms` }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ReadingCard({
  entry, onToggleSave, onRemove, onOpen, style,
}: {
  entry: ReadingEntry;
  onToggleSave: () => void;
  onRemove: () => void;
  onOpen: () => void;
  style?: React.CSSProperties;
}) {
  const meta = TYPE_META[entry.type];
  return (
    <div
      className="relative animate-slide-up"
      style={style}
    >
      <div className="absolute -top-3 left-4 z-10">
        <span className={`inline-flex items-center gap-1 rounded-full ${meta.chip} border-2 border-baddia-ink px-2.5 py-1 text-[10px] font-display font-black uppercase tracking-wider shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1`}>
          {meta.emoji} {meta.label}
        </span>
      </div>
      <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-4 pt-6 shadow-[5px_6px_0_hsl(260_16%_15%)]">
        <button onClick={onOpen} className="w-full text-left flex items-start gap-3">
          <span className={`shrink-0 w-12 h-12 rounded-2xl border-2 border-baddia-ink ${meta.tint} flex items-center justify-center text-2xl shadow-[2px_2px_0_hsl(260_16%_15%)]`}>
            {meta.emoji}
          </span>
          <div className="flex-1 min-w-0">
            <p className="font-display font-black text-baddia-ink text-[14px] leading-tight">
              {entry.title}
            </p>
            <p className="text-[12px] text-baddia-ink/70 font-medium mt-1 line-clamp-2 leading-snug">
              {entry.snippet}
            </p>
            <p className="text-[10px] text-baddia-ink/45 font-display font-bold uppercase tracking-wider mt-1.5">
              {formatDate(entry.date)}
            </p>
          </div>
        </button>

        {/* Acciones */}
        <div className="mt-3 pt-3 border-t-2 border-baddia-ink/10 flex items-center gap-2">
          <button
            onClick={onToggleSave}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-baddia-ink py-2 text-[11px] font-display font-black transition-all active:translate-y-[1px] ${
              entry.saved
                ? "bg-baddia-gold text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)]"
                : "bg-white text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%/0.55)]"
            }`}
          >
            <Bookmark size={12} className={entry.saved ? "fill-baddia-ink" : ""} />
            {entry.saved ? "Guardada" : "Guardar"}
          </button>
          <button
            onClick={() => toast("Compartiendo tu glow ✨")}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-baddia-lavender text-white border-2 border-baddia-ink px-3 py-2 text-[11px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
            aria-label="Compartir"
          >
            <Share2 size={12} />
          </button>
          <button
            onClick={onRemove}
            className="inline-flex items-center justify-center rounded-full bg-white text-baddia-hot border-2 border-baddia-ink px-3 py-2 text-[11px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%/0.55)] active:translate-y-[1px] active:shadow-[1px_1px_0_hsl(260_16%_15%/0.55)] transition-all"
            aria-label="Eliminar"
          >
            <Trash2 size={12} />
          </button>
          <button
            onClick={onOpen}
            className="inline-flex items-center justify-center rounded-full bg-baddia-ink text-white border-2 border-baddia-ink px-3 py-2 shadow-[2px_2px_0_hsl(260_16%_15%/0.4)] active:translate-y-[1px] transition-all"
            aria-label="Abrir lectura"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="relative mt-2">
      <div className="rounded-3xl bg-gradient-pearl border-[2.5px] border-baddia-ink p-7 text-center shadow-[5px_6px_0_hsl(260_16%_15%)]">
        <div className="mx-auto w-16 h-16 rounded-full border-2 border-baddia-ink bg-white flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] mb-3">
          <HistoryIcon size={26} className="text-baddia-ink" />
        </div>
        <p className="font-display font-black text-baddia-ink text-[16px]">
          Aún no hay nada por aquí ✨
        </p>
        <p className="text-[12px] text-baddia-ink/70 font-medium mt-1.5 leading-snug">
          Cuando hagas lecturas, tu historial vivirá aquí, listo para revivir tu glow.
        </p>
      </div>
    </div>
  );
}
