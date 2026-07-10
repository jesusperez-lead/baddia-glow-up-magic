import { useMemo, useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Sparkles, Moon, Star, X,
} from "lucide-react";

interface DayInfo {
  date: number;
  energy: string;         // "Alta" | "Suave" | "Recarga" | "Bad"
  color: { name: string; from: string; to: string };
  quote: string;
  tarot: string;
  manifested: boolean;
  mood: { emoji: string; label: string };
  astro?: string;         // "Luna llena en Aries" etc.
  isToday?: boolean;
}

const COLORS = [
  { name: "Rosa cuarzo",  from: "#FFD6E6", to: "#FF7AC8" },
  { name: "Lavanda glow", from: "#E6DAFF", to: "#8B63F7" },
  { name: "Dorado glow",  from: "#FFF0B8", to: "#FFD12E" },
  { name: "Bubble pink",  from: "#FFE0F0", to: "#FF7AC8" },
  { name: "Violeta luna", from: "#D9C8FF", to: "#6E47E8" },
  { name: "Coral baddie", from: "#FFD0C2", to: "#FF6B6B" },
  { name: "Mint aura",    from: "#C8F5E9", to: "#14C6A4" },
  { name: "Lima cósmico", from: "#EAFBA8", to: "#B7F400" },
];

const ENERGIES = ["Alta ✨", "Suave 💖", "Recarga 🌙", "Bad 🔥", "Soñadora ☁️", "Magnética 💫"];
const TAROTS = ["La Estrella", "El Sol", "La Luna", "As de Copas", "La Emperatriz", "La Rueda", "La Sacerdotisa", "El Mundo"];
const QUOTES = [
  "Confío en lo que me llega.",
  "Soy imán de cosas bonitas.",
  "Mi energía abre puertas.",
  "Hoy fluyo, no fuerzo.",
  "Merezco todo lo que deseo.",
  "El universo conspira a mi favor.",
];
const MOODS = [
  { emoji: "✨", label: "Inspirada" },
  { emoji: "💖", label: "Amorosa" },
  { emoji: "🌙", label: "Soñadora" },
  { emoji: "🔥", label: "Bad" },
  { emoji: "🫧", label: "Suave" },
  { emoji: "💫", label: "Magnética" },
  { emoji: "🥺", label: "Confundida" },
];
const ASTRO_BY_DAY: Record<number, string> = {
  5:  "Mercurio directo 💫",
  11: "Luna nueva en Libra 🌑",
  17: "Venus en Escorpio 💘",
  25: "Luna llena en Aries 🌕",
};

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

// Simple deterministic per-day pick
function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function buildMonth(year: number, month: number, todayDate: number, isCurrent: boolean): DayInfo[] {
  const days = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: days }, (_, i) => {
    const date = i + 1;
    const seed = year * 372 + month * 31 + date;
    return {
      date,
      energy: pick(ENERGIES, seed),
      color: pick(COLORS, seed >> 1),
      quote: pick(QUOTES, seed >> 2),
      tarot: pick(TAROTS, seed >> 3),
      manifested: seed % 3 === 0,
      mood: pick(MOODS, seed >> 4),
      astro: ASTRO_BY_DAY[date],
      isToday: isCurrent && date === todayDate,
    };
  });
}

export function Calendar() {
  const { go } = useBaddia();
  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState<DayInfo | null>(null);

  const isCurrentMonth = cursor.y === now.getFullYear() && cursor.m === now.getMonth();
  const days = useMemo(
    () => buildMonth(cursor.y, cursor.m, now.getDate(), isCurrentMonth),
    [cursor.y, cursor.m, isCurrentMonth]
  );

  // Empty cells before day 1 (week starts on Monday)
  const firstDow = (new Date(cursor.y, cursor.m, 1).getDay() + 6) % 7;
  const leading = Array.from({ length: firstDow }, (_, i) => i);

  const prevMonth = () => {
    setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { ...c, m: c.m - 1 }));
  };
  const nextMonth = () => {
    setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { ...c, m: c.m + 1 }));
  };

  const manifestedCount = days.filter((d) => d.manifested).length;

  return (
    <div className="relative min-h-full bg-white pb-16 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/25" />
      <div className="blob top-80 -right-16 w-60 h-60 bg-baddia-lavender/20" style={{ animationDelay: "3s" }} />
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
          <span className="inline-block rounded-full bg-baddia-hot text-white border-2 border-baddia-ink px-2.5 py-1 text-[10px] font-display font-bold shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2 mb-1.5 uppercase tracking-wider">
            ✦ baddia calendar
          </span>
          <h1 className="font-display font-black text-[22px] text-baddia-ink leading-tight">
            Tu <span className="gradient-text">mes cósmico</span> ✨
          </h1>
        </div>
      </header>

      <div className="relative z-10 px-5 space-y-4">
        {/* Month nav */}
        <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-3 shadow-[5px_6px_0_hsl(260_16%_15%)] flex items-center justify-between">
          <button
            onClick={prevMonth}
            aria-label="Mes anterior"
            className="w-9 h-9 rounded-xl bg-baddia-bubble border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
          >
            <ChevronLeft size={16} className="text-baddia-ink" />
          </button>
          <div className="text-center">
            <p className="font-display font-black text-baddia-ink text-[16px] leading-tight">
              {MONTHS[cursor.m]}
            </p>
            <p className="text-[10px] text-baddia-ink/60 font-display font-bold uppercase tracking-wider">
              {cursor.y}
            </p>
          </div>
          <button
            onClick={nextMonth}
            aria-label="Mes siguiente"
            className="w-9 h-9 rounded-xl bg-baddia-lavender text-white border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Resumen */}
        <div className="grid grid-cols-3 gap-2">
          <StatChip emoji="🌙" label="Manifestadas" value={`${manifestedCount}`} tint="bg-baddia-lavender/25" />
          <StatChip emoji="🔮" label="Tarots" value={`${days.length}`} tint="bg-baddia-soft" />
          <StatChip emoji="✨" label="Días glow" value={`${days.length}`} tint="bg-baddia-yellow/40" />
        </div>

        {/* Grid */}
        <div className="rounded-3xl bg-gradient-pearl border-[2.5px] border-baddia-ink p-3 shadow-[5px_6px_0_hsl(260_16%_15%)]">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-display font-black text-baddia-ink/60 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {leading.map((i) => <div key={`e${i}`} />)}
            {days.map((d) => (
              <button
                key={d.date}
                onClick={() => setSelected(d)}
                className={`relative aspect-square rounded-xl border-2 border-baddia-ink flex flex-col items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all ${d.isToday ? "ring-2 ring-baddia-hot ring-offset-1" : ""}`}
                style={{ background: `linear-gradient(135deg, ${d.color.from}, ${d.color.to})` }}
                aria-label={`Día ${d.date}`}
              >
                <span className="font-display font-black text-[11px] text-baddia-ink leading-none">
                  {d.date}
                </span>
                <span className="text-[11px] leading-none mt-0.5">{d.mood.emoji}</span>
                {d.manifested && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-baddia-ink text-white text-[8px] font-black flex items-center justify-center border border-white">
                    ✓
                  </span>
                )}
                {d.astro && (
                  <span className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-white border border-baddia-ink flex items-center justify-center">
                    <Moon size={7} className="text-baddia-ink" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Leyenda */}
        <div className="rounded-2xl bg-white border-2 border-baddia-ink p-3 shadow-[3px_4px_0_hsl(260_16%_15%)]">
          <p className="text-[10px] font-display font-black text-baddia-ink/60 uppercase tracking-wider mb-2">
            Leyenda
          </p>
          <div className="flex flex-wrap gap-2 text-[11px] font-medium text-baddia-ink/80">
            <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-baddia-ink text-white text-[7px] flex items-center justify-center">✓</span> Manifestada</span>
            <span className="inline-flex items-center gap-1"><Moon size={10} className="text-baddia-ink" /> Evento astral</span>
            <span className="inline-flex items-center gap-1"><Star size={10} className="text-baddia-hot" /> Hoy</span>
          </div>
        </div>

        <p className="text-[11px] text-baddia-ink/60 font-medium text-center leading-snug">
          Toca cualquier día para ver su energía, color, frase y tarot ✨
        </p>
      </div>

      {/* Day sheet */}
      {selected && (
        <DaySheet day={selected} month={MONTHS[cursor.m]} year={cursor.y} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function StatChip({ emoji, label, value, tint }: { emoji: string; label: string; value: string; tint: string }) {
  return (
    <div className={`rounded-2xl ${tint} border-2 border-baddia-ink p-2.5 shadow-[3px_3px_0_hsl(260_16%_15%)] text-center`}>
      <p className="text-[16px] leading-none">{emoji}</p>
      <p className="font-display font-black text-baddia-ink text-[15px] mt-1 leading-none">{value}</p>
      <p className="text-[9px] font-display font-black text-baddia-ink/70 uppercase tracking-wider mt-0.5">
        {label}
      </p>
    </div>
  );
}

function DaySheet({ day, month, year, onClose }: { day: DayInfo; month: string; year: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-baddia-ink/40 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-md rounded-t-[32px] bg-white border-t-[3px] border-x-[3px] border-baddia-ink shadow-[0_-8px_0_hsl(260_16%_15%/0.15)] p-5 animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="inline-block rounded-full bg-baddia-lavender text-white border-2 border-baddia-ink px-2.5 py-1 text-[10px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2 uppercase tracking-wider">
              {day.date} {month.slice(0,3).toLowerCase()} {year}
            </span>
            <h2 className="font-display font-black text-[20px] text-baddia-ink mt-2 leading-tight">
              Energía del <span className="gradient-text">día</span> ✨
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-9 h-9 rounded-2xl bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[1px] transition-all"
          >
            <X size={14} className="text-baddia-ink" />
          </button>
        </div>

        {/* Hero color */}
        <div
          className="rounded-3xl border-[2.5px] border-baddia-ink p-4 shadow-[4px_5px_0_hsl(260_16%_15%)] flex items-center gap-3 mb-3"
          style={{ background: `linear-gradient(135deg, ${day.color.from}, ${day.color.to})` }}
        >
          <span className="text-3xl">{day.mood.emoji}</span>
          <div className="flex-1">
            <p className="font-display font-black text-baddia-ink text-[15px] leading-tight">
              {day.mood.label}
            </p>
            <p className="text-[11px] font-display font-black text-baddia-ink/80 uppercase tracking-wider mt-0.5">
              {day.energy} · {day.color.name}
            </p>
          </div>
          <Sparkles size={18} className="text-white" />
        </div>

        {/* Detalles */}
        <div className="space-y-2.5">
          <DetailRow emoji="💬" label="Frase del día" value={`"${day.quote}"`} tint="bg-baddia-bubble" />
          <DetailRow emoji="🔮" label="Tarot" value={day.tarot} tint="bg-baddia-soft" />
          <DetailRow
            emoji="🌙"
            label="Manifestación"
            value={day.manifested ? "Completada ✓" : "Pendiente"}
            tint={day.manifested ? "bg-baddia-lavender/25" : "bg-white"}
          />
          <DetailRow emoji="🫧" label="Mood registrado" value={day.mood.label} tint="bg-baddia-lime/30" />
          {day.astro && (
            <DetailRow emoji="✨" label="Evento astral" value={day.astro} tint="bg-baddia-yellow/40" />
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ emoji, label, value, tint }: { emoji: string; label: string; value: string; tint: string }) {
  return (
    <div className={`rounded-2xl ${tint} border-2 border-baddia-ink p-3 shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-start gap-3`}>
      <span className="text-xl leading-none">{emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-display font-black text-baddia-ink/60 uppercase tracking-wider">
          {label}
        </p>
        <p className="font-display font-black text-baddia-ink text-[13px] leading-snug mt-0.5">
          {value}
        </p>
      </div>
    </div>
  );
}
