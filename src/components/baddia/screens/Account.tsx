import { useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ArrowLeft, Settings, ChevronRight, Check, User as UserIcon, Cake, Star, Hash } from "lucide-react";
import { toast } from "sonner";
import { computeZodiac, computeLifeNumber } from "@/lib/baddia-numerology";

const MONTH_NAMES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

const SIGN_GLYPH: Record<string, string> = {
  Aries: "♈", Tauro: "♉", Géminis: "♊", Cáncer: "♋", Leo: "♌", Virgo: "♍",
  Libra: "♎", Escorpio: "♏", Sagitario: "♐", Capricornio: "♑", Acuario: "♒", Piscis: "♓",
};

export function Account() {
  const { user, setUser, go } = useBaddia();

  const [name, setName] = useState(user.name);
  const [day, setDay] = useState(user.day);
  const [month, setMonth] = useState(user.month);
  const [year, setYear] = useState(user.year);
  const [monthOpen, setMonthOpen] = useState(false);

  const trimmed = name.trim();
  const dayN = Number(day);
  const monthN = Number(month);
  const yearN = Number(year);
  const currentYear = new Date().getFullYear();
  const valid =
    trimmed.length >= 2 && trimmed.length <= 30 &&
    dayN >= 1 && dayN <= 31 &&
    monthN >= 1 && monthN <= 12 &&
    yearN >= 1920 && yearN <= currentYear;

  const monthLabel = monthN >= 1 && monthN <= 12 ? MONTH_NAMES[monthN - 1] : "Mes";

  // Live preview values
  const previewSign = valid ? computeZodiac(day, month) : user.sign;
  const previewLife = valid ? computeLifeNumber(day, month, year) : user.lifeNumber;
  const previewGlyph = SIGN_GLYPH[previewSign] ?? "✦";

  const handleSave = () => {
    if (!valid) return;
    const sign = computeZodiac(day, month);
    const lifeNumber = computeLifeNumber(day, month, year);
    setUser({ name: trimmed, day, month, year, sign, lifeNumber });
    toast.success("Tu glow se actualizó ✨");
    go("profile");
  };

  return (
    <div className="relative min-h-full bg-white pb-16 overflow-hidden">
      {/* background blobs */}
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/25" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-soft/30" style={{ animationDelay: "4s" }} />
      <SparklesDeco />

      {/* AppBar */}
      <header className="relative z-10 px-6 pt-8 pb-2">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => go("profile")}
            aria-label="Volver"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border-2 border-baddia-ink rounded-full shadow-[2px_2px_0_hsl(260_16%_15%)] text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
          >
            <ArrowLeft size={12} strokeWidth={3} /> Volver
          </button>
          <button
            onClick={() => go("delete-account")}
            aria-label="Ajustes avanzados"
            className="w-10 h-10 rounded-full bg-white border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
          >
            <Settings size={16} className="text-baddia-ink" />
          </button>
        </div>

        <span className="inline-block rounded-full bg-baddia-lavender text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider">
          <UserIcon size={10} className="inline -mt-0.5 mr-1" /> ajustes de cuenta
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          Edita tu <span className="gradient-text">identidad</span> ✨
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Tu signo y número de vida se recalculan automáticamente.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* Preview chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-baddia-bubble text-baddia-ink border-2 border-baddia-ink px-2.5 py-1 text-[11px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)]">
            <Star size={11} /> {previewGlyph} {previewSign}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-baddia-yellow text-baddia-ink border-2 border-baddia-ink px-2.5 py-1 text-[11px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)]">
            <Hash size={11} /> número {previewLife}
          </span>
        </div>

        {/* Form card */}
        <div className="relative rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 pt-6 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-[11px] font-display font-black text-baddia-ink/70 uppercase tracking-wider mb-1.5 pl-1">
              Tu nombre
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              placeholder="Sofi"
              className="w-full rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-pearl px-4 py-3 text-[15px] font-display font-bold text-baddia-ink placeholder:text-baddia-ink/30 shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none focus:bg-white"
            />
          </div>

          {/* Fecha */}
          <div>
            <label className="block text-[11px] font-display font-black text-baddia-ink/70 uppercase tracking-wider mb-1.5 pl-1">
              <Cake size={11} className="inline -mt-0.5 mr-1" /> Fecha de nacimiento
            </label>
            <div className="grid grid-cols-[1fr_1.4fr_1.1fr] gap-2">
              <input
                inputMode="numeric"
                value={day}
                onChange={(e) => setDay(e.target.value.replace(/\D/g, "").slice(0, 2))}
                placeholder="DD"
                className="rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-pearl px-3 py-3 text-center text-[15px] font-display font-black text-baddia-ink placeholder:text-baddia-ink/30 shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setMonthOpen(true)}
                className="rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-pearl px-3 py-3 text-[14px] font-display font-black text-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all inline-flex items-center justify-between gap-1"
              >
                <span className={monthN ? "" : "text-baddia-ink/30"}>{monthLabel}</span>
                <ChevronRight size={14} className="rotate-90 text-baddia-ink/50" />
              </button>
              <input
                inputMode="numeric"
                value={year}
                onChange={(e) => setYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="AAAA"
                className="rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-pearl px-3 py-3 text-center text-[15px] font-display font-black text-baddia-ink placeholder:text-baddia-ink/30 shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none focus:bg-white"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="pt-1 flex gap-2">
            <button
              onClick={() => go("profile")}
              className="flex-1 py-3 rounded-full bg-white text-baddia-ink font-display font-black text-[13px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
            >
              Cancelar
            </button>
            <button
              disabled={!valid}
              onClick={handleSave}
              className="flex-1 py-3 rounded-full bg-baddia-hot text-white font-display font-black text-[13px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all inline-flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0_hsl(260_16%_15%)]"
            >
              <Check size={13} /> Guardar
            </button>
          </div>
        </div>
      </div>

      {/* Month picker overlay */}
      {monthOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-baddia-ink/60 backdrop-blur-sm animate-fade-in p-6"
          onClick={() => setMonthOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white border-[2.5px] border-baddia-ink p-4 shadow-[6px_8px_0_hsl(260_16%_15%)] animate-pop-in"
          >
            <p className="font-display font-black text-baddia-ink text-[13px] uppercase tracking-wider px-2 pt-1 pb-2">
              Elige el mes
            </p>
            <div className="grid grid-cols-3 gap-2">
              {MONTH_NAMES.map((m, i) => {
                const idx = String(i + 1);
                const active = idx === month;
                return (
                  <button
                    key={m}
                    onClick={() => { setMonth(idx); setMonthOpen(false); }}
                    className={`rounded-2xl border-2 border-baddia-ink py-2 text-[12px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all ${
                      active ? "bg-baddia-hot text-white" : "bg-baddia-pearl text-baddia-ink"
                    }`}
                  >
                    {m.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
