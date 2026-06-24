import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X, Check } from "lucide-react";
import { computeZodiac, ZODIAC_EMOJI } from "@/lib/baddia-numerology";

type Props = {
  open: boolean;
  value: Date | null;
  onClose: () => void;
  onSelect: (d: Date) => void;
};

const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const WEEK_ES = ["L", "M", "X", "J", "V", "S", "D"];

const STICKER_COLORS = [
  "bg-baddia-hot",
  "bg-baddia-bubble",
  "bg-baddia-lavender",
  "bg-baddia-mint",
  "bg-baddia-yellow",
];

function startOfMonthWeekdayMon(year: number, month: number) {
  // JS: getDay() 0=Sun..6=Sat → convert to 0=Mon..6=Sun
  const js = new Date(year, month, 1).getDay();
  return (js + 6) % 7;
}

export function CrushBirthdayPicker({ open, value, onClose, onSelect }: Props) {
  const today = new Date();
  const initial = value ?? new Date(today.getFullYear() - 20, today.getMonth(), 15);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [selected, setSelected] = useState<Date | null>(value);

  const grid = useMemo(() => {
    const offset = startOfMonthWeekdayMon(viewYear, viewMonth);
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewYear, viewMonth]);

  const goPrev = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const goNext = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const zodiac = selected
    ? computeZodiac(selected.getDate(), selected.getMonth() + 1)
    : null;

  const isSameDay = (d: number) =>
    selected &&
    selected.getFullYear() === viewYear &&
    selected.getMonth() === viewMonth &&
    selected.getDate() === d;

  const isToday = (d: number) =>
    today.getFullYear() === viewYear &&
    today.getMonth() === viewMonth &&
    today.getDate() === d;

  const confirm = () => {
    if (selected) onSelect(selected);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-baddia-ink/60 backdrop-blur-sm animate-fade-in p-3"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-[28px] bg-white border-[2.5px] border-baddia-ink p-5 shadow-[6px_8px_0_hsl(260_16%_15%)] animate-pop-in max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* sticker */}
        <div className="absolute -top-3 left-5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-hot text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
            🎂 cumple de tu crush
          </span>
        </div>
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)]"
        >
          <X size={14} strokeWidth={3} className="text-baddia-ink" />
        </button>

        {/* floating cute deco */}
        <span className="absolute top-2 right-14 text-base animate-float-cute select-none">✨</span>
        <span className="absolute top-10 left-3 text-base animate-float-cute select-none" style={{ animationDelay: "0.6s" }}>💗</span>

        <p className="font-display font-black text-baddia-ink text-[18px] leading-tight mt-3">
          Elige su fecha de nacimiento 💞
        </p>
        <p className="text-[12px] text-baddia-ink/65 font-medium mt-1 leading-snug">
          Calculamos su signo automáticamente para una lectura más precisa.
        </p>

        {/* month/year nav */}
        <div className="mt-4 rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-lavender/15 p-3 shadow-[3px_3px_0_hsl(260_16%_15%)]">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={goPrev}
              className="w-9 h-9 rounded-full bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
              aria-label="Mes anterior"
            >
              <ChevronLeft size={16} strokeWidth={3} className="text-baddia-ink" />
            </button>
            <div className="flex-1 flex items-center justify-center gap-2">
              <span className="font-display font-black text-baddia-ink text-[15px] uppercase tracking-wider">
                {MONTHS_ES[viewMonth]}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewYear((y) => y - 1)}
                  className="w-5 h-5 rounded-full bg-baddia-ink text-white flex items-center justify-center text-[10px] font-display font-black"
                  aria-label="Año anterior"
                >−</button>
                <span className="font-display font-black text-baddia-ink text-[15px] min-w-[3ch] text-center">
                  {viewYear}
                </span>
                <button
                  onClick={() => setViewYear((y) => y + 1)}
                  className="w-5 h-5 rounded-full bg-baddia-ink text-white flex items-center justify-center text-[10px] font-display font-black"
                  aria-label="Año siguiente"
                >+</button>
              </div>
            </div>
            <button
              onClick={goNext}
              className="w-9 h-9 rounded-full bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
              aria-label="Mes siguiente"
            >
              <ChevronRight size={16} strokeWidth={3} className="text-baddia-ink" />
            </button>
          </div>

          {/* weekdays */}
          <div className="grid grid-cols-7 gap-1 mt-3 mb-1">
            {WEEK_ES.map((w, i) => (
              <span
                key={i}
                className="text-center text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55"
              >
                {w}
              </span>
            ))}
          </div>

          {/* days grid */}
          <div className="grid grid-cols-7 gap-1">
            {grid.map((d, i) => {
              if (d === null) return <span key={i} className="aspect-square" />;
              const sel = isSameDay(d);
              const td = isToday(d);
              const color = STICKER_COLORS[d % STICKER_COLORS.length];
              return (
                <button
                  key={i}
                  onClick={() => setSelected(new Date(viewYear, viewMonth, d))}
                  className={`relative aspect-square rounded-xl border-2 flex items-center justify-center text-[13px] font-display font-black transition-all ${
                    sel
                      ? `${color} text-white border-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] -translate-y-0.5`
                      : td
                      ? "bg-white text-baddia-ink border-baddia-ink shadow-[1.5px_1.5px_0_hsl(260_16%_15%)]"
                      : "bg-white/70 text-baddia-ink border-baddia-ink/15 hover:border-baddia-ink/40 active:translate-y-0.5"
                  }`}
                >
                  {d}
                  {td && !sel && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-baddia-hot border border-baddia-ink" />
                  )}
                  {sel && (
                    <span className="absolute -top-1.5 -right-1.5 text-[10px] select-none">💖</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* zodiac preview */}
        <div className="mt-4 rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-yellow/30 p-3 shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl border-2 border-baddia-ink bg-white flex items-center justify-center text-2xl shrink-0">
            {zodiac ? ZODIAC_EMOJI[zodiac] : "💫"}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-display font-black uppercase tracking-widest text-baddia-ink/55">
              Su signo
            </p>
            <p className="font-display font-black text-[15px] text-baddia-ink leading-tight">
              {zodiac ?? "Elige un día"}
            </p>
            {selected && (
              <p className="text-[11px] text-baddia-ink/60 font-semibold mt-0.5">
                {selected.getDate()} de {MONTHS_ES[selected.getMonth()].toLowerCase()} · {selected.getFullYear()}
              </p>
            )}
          </div>
        </div>

        {/* actions */}
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
          <button
            onClick={confirm}
            disabled={!selected}
            className="py-3 rounded-full bg-gradient-hot text-white text-[13px] font-display font-black uppercase tracking-wider border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] disabled:opacity-50 disabled:shadow-[2px_2px_0_hsl(260_16%_15%)] flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
          >
            <Check size={14} strokeWidth={3} /> Guardar fecha
          </button>
          <button
            onClick={onClose}
            className="px-4 py-3 rounded-full bg-white text-baddia-ink text-[12px] font-display font-black uppercase tracking-wider border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
