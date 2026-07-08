import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Clock, Check, X, Sun, Coffee, Moon, Sparkles, Sunrise } from "lucide-react";

type Preset = { label: string; time: string; icon: React.ReactNode; tint: string };

const PRESETS: Preset[] = [
  { label: "Amanecer",   time: "06:30", icon: <Sunrise size={12} />, tint: "bg-baddia-yellow" },
  { label: "Mañana",     time: "08:00", icon: <Coffee size={12} />,  tint: "bg-baddia-bubble" },
  { label: "Mediodía",   time: "12:00", icon: <Sun size={12} />,     tint: "bg-baddia-lime" },
  { label: "Tarde cute", time: "17:00", icon: <Sparkles size={12} />,tint: "bg-baddia-soft" },
  { label: "Noche glow", time: "21:00", icon: <Moon size={12} />,    tint: "bg-baddia-lavender text-white" },
  { label: "Antes de dormir", time: "23:00", icon: <Moon size={12} />, tint: "bg-baddia-mint" },
];

const ITEM_H = 44; // px per row

function Wheel({
  values, value, onChange, pad = 2,
}: { values: number[]; value: number; onChange: (v: number) => void; pad?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const suppress = useRef(false);

  // Scroll to value when it changes externally
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const idx = values.indexOf(value);
    if (idx < 0) return;
    suppress.current = true;
    el.scrollTo({ top: idx * ITEM_H, behavior: "smooth" });
    window.setTimeout(() => (suppress.current = false), 250);
  }, [value, values]);

  const onScroll = () => {
    if (suppress.current) return;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const el = ref.current; if (!el) return;
      const idx = Math.round(el.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(values.length - 1, idx));
      const v = values[clamped];
      if (v !== value) onChange(v);
      // snap perfectly
      el.scrollTo({ top: clamped * ITEM_H, behavior: "smooth" });
    }, 90);
  };

  return (
    <div className="relative h-[132px] w-full overflow-hidden">
      {/* highlight band */}
      <div className="pointer-events-none absolute inset-x-2 top-1/2 -translate-y-1/2 h-[44px] rounded-2xl border-2 border-baddia-ink bg-baddia-pearl/70 shadow-[2px_2px_0_hsl(260_16%_15%)]" />
      {/* fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[44px] bg-gradient-to-b from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[44px] bg-gradient-to-t from-white to-transparent z-10" />
      <div
        ref={ref}
        onScroll={onScroll}
        className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        style={{ scrollPaddingTop: ITEM_H }}
      >
        <div style={{ height: ITEM_H }} />
        {values.map((v) => {
          const active = v === value;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={`snap-center w-full flex items-center justify-center transition-all ${
                active ? "text-baddia-ink scale-110" : "text-baddia-ink/35"
              }`}
              style={{ height: ITEM_H }}
            >
              <span className="font-display font-black text-[26px] tabular-nums leading-none">
                {String(v).padStart(pad, "0")}
              </span>
            </button>
          );
        })}
        <div style={{ height: ITEM_H }} />
      </div>
    </div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  value: string; // "HH:MM"
  onChange: (v: string) => void;
  title?: string;
  emoji?: string;
}

export function TimePickerSheet({ open, onClose, value, onChange, title = "¿A qué hora?", emoji = "⏰" }: Props) {
  const parsed = useMemo(() => {
    const [h = "9", m = "0"] = (value || "09:00").split(":");
    return { h: Math.min(23, Math.max(0, Number(h) || 0)), m: Math.min(59, Math.max(0, Number(m) || 0)) };
  }, [value]);

  const [hour, setHour] = useState(parsed.h);
  const [minute, setMinute] = useState(Math.round(parsed.m / 5) * 5); // snap to 5

  useEffect(() => {
    if (open) {
      setHour(parsed.h);
      setMinute(Math.round(parsed.m / 5) * 5);
    }
  }, [open, parsed.h, parsed.m]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  if (!open) return null;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);
  const preview = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  const ampm = hour < 12 ? "AM" : "PM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;

  const commit = () => {
    onChange(preview);
    onClose();
  };

  const applyPreset = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    setHour(h); setMinute(Math.round(m / 5) * 5);
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center">
      {/* backdrop */}
      <button
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-baddia-ink/60 backdrop-blur-sm animate-fade-in"
      />
      {/* sheet */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white border-[2.5px] border-baddia-ink rounded-t-[32px] shadow-[0_-8px_0_hsl(260_16%_15%)] animate-slide-up overflow-hidden"
      >
        {/* deco blobs */}
        <div className="absolute -top-10 -left-8 w-40 h-40 rounded-full bg-baddia-bubble/40 blur-2xl pointer-events-none" />
        <div className="absolute -top-4 -right-6 w-32 h-32 rounded-full bg-baddia-yellow/40 blur-2xl pointer-events-none" />

        {/* grabber */}
        <div className="relative flex justify-center pt-2.5 pb-1">
          <span className="w-12 h-1.5 rounded-full bg-baddia-ink/20" />
        </div>

        {/* header */}
        <div className="relative px-5 pt-1 pb-3 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-baddia-hot text-white border-2 border-baddia-ink px-2.5 py-1 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2 mb-1.5">
              <Clock size={10} /> hora cute
            </span>
            <h3 className="font-display font-black text-baddia-ink text-[20px] leading-tight">
              {emoji} {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="shrink-0 w-9 h-9 rounded-full bg-white border-2 border-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] flex items-center justify-center active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
          >
            <X size={14} strokeWidth={3} className="text-baddia-ink" />
          </button>
        </div>

        {/* preview */}
        <div className="relative px-5 pb-3">
          <div className="rounded-3xl border-[2.5px] border-baddia-ink gradient-bg-baddia text-white p-3 flex items-center justify-center gap-2 shadow-[4px_4px_0_hsl(260_16%_15%)]">
            <span className="font-display font-black text-[38px] tabular-nums leading-none tracking-tight">
              {String(h12).padStart(2, "0")}:{String(minute).padStart(2, "0")}
            </span>
            <span className="font-display font-black text-[13px] bg-white/25 border-2 border-white rounded-full px-2 py-0.5">
              {ampm}
            </span>
          </div>
        </div>

        {/* wheels */}
        <div className="relative px-5">
          <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-3 shadow-[4px_4px_0_hsl(260_16%_15%)]">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1">
              <div>
                <p className="text-center text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/50 mb-1">Hora</p>
                <Wheel values={hours} value={hour} onChange={setHour} />
              </div>
              <span className="font-display font-black text-[28px] text-baddia-ink/40 pt-4">:</span>
              <div>
                <p className="text-center text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/50 mb-1">Min</p>
                <Wheel values={minutes} value={minute} onChange={setMinute} />
              </div>
            </div>
          </div>
        </div>

        {/* presets */}
        <div className="relative px-5 pt-4">
          <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/60 mb-2 pl-1">
            ✨ atajos rápidos
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
            {PRESETS.map((p) => {
              const active = preview === p.time;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p.time)}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border-2 border-baddia-ink px-3 py-1.5 text-[11px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all ${
                    active ? "bg-baddia-hot text-white" : p.tint + " text-baddia-ink"
                  }`}
                >
                  {p.icon}
                  <span>{p.label}</span>
                  <span className="opacity-70 tabular-nums">{p.time}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* actions */}
        <div className="relative px-5 pt-4 pb-6 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full bg-white text-baddia-ink font-display font-black text-[13px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={commit}
            className="flex-[1.4] py-3 rounded-full bg-baddia-hot text-white font-display font-black text-[13px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all inline-flex items-center justify-center gap-1.5"
          >
            <Check size={14} strokeWidth={3} /> Guardar hora
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
