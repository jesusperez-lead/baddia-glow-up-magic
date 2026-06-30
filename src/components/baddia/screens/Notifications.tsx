import { useEffect, useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import {
  ArrowLeft, Bell, Sun, Moon, Heart, Sparkles, Hand, Star,
  Calendar, Clock, Check, BellOff, Volume2, Vibrate,
} from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "baddia-notifications-v1";

type Prefs = {
  master: boolean;
  sound: boolean;
  vibration: boolean;
  dailyReading: { on: boolean; time: string };
  morningQuote: { on: boolean; time: string };
  nightRitual: { on: boolean; time: string };
  loveAlerts: boolean;
  crushPing: boolean;
  manifestStreak: boolean;
  tarotWeekly: boolean;
  auraCheck: boolean;
  quietStart: string;
  quietEnd: string;
};

const DEFAULTS: Prefs = {
  master: true,
  sound: true,
  vibration: true,
  dailyReading: { on: true, time: "09:00" },
  morningQuote: { on: true, time: "08:00" },
  nightRitual: { on: false, time: "22:00" },
  loveAlerts: true,
  crushPing: true,
  manifestStreak: true,
  tarotWeekly: false,
  auraCheck: false,
  quietStart: "23:00",
  quietEnd: "07:30",
};

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export function Notifications() {
  const { user, go } = useBaddia();
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) =>
    setPrefs((p) => ({ ...p, [k]: v }));

  const setSchedule = (
    k: "dailyReading" | "morningQuote" | "nightRitual",
    patch: Partial<{ on: boolean; time: string }>
  ) => setPrefs((p) => ({ ...p, [k]: { ...p[k], ...patch } }));

  const enabledCount =
    (prefs.dailyReading.on ? 1 : 0) +
    (prefs.morningQuote.on ? 1 : 0) +
    (prefs.nightRitual.on ? 1 : 0) +
    (prefs.loveAlerts ? 1 : 0) +
    (prefs.crushPing ? 1 : 0) +
    (prefs.manifestStreak ? 1 : 0) +
    (prefs.tarotWeekly ? 1 : 0) +
    (prefs.auraCheck ? 1 : 0);

  return (
    <div className="relative min-h-full bg-white pb-16 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/25" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-soft/30" style={{ animationDelay: "4s" }} />
      <div className="blob top-[700px] -left-10 w-56 h-56 bg-baddia-yellow/20" style={{ animationDelay: "2s" }} />
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
            onClick={() => {
              const next = !prefs.master;
              set("master", next);
              toast(next ? "Notificaciones activadas ✨" : "Notificaciones en pausa 🌙");
            }}
            aria-label="Toggle maestro"
            className={`w-10 h-10 rounded-full border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all ${prefs.master ? "bg-baddia-hot text-white" : "bg-white text-baddia-ink"}`}
          >
            {prefs.master ? <Bell size={16} /> : <BellOff size={16} />}
          </button>
        </div>

        <span className="inline-block rounded-full bg-baddia-hot text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider">
          <Bell size={10} className="inline -mt-0.5 mr-1" /> notificaciones
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          Tus <span className="gradient-text">recordatorios</span> diarios ✨
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Que la magia te llegue justo cuando la necesitas, {user.name.split(" ")[0]}.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* Hero status */}
        <div className="relative animate-slide-up">
          <div className="absolute -top-3 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-yellow text-baddia-ink border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1">
              <Sparkles size={11} /> tu glow daily
            </span>
          </div>
          <div className="relative rounded-3xl border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden gradient-bg-baddia text-white">
            <span className="absolute -top-2 -right-2 text-6xl opacity-20 select-none">🔔</span>
            <p className="font-display font-black text-[20px] leading-tight">
              {prefs.master ? "Estás conectada al universo" : "Modo silencio activo"}
            </p>
            <p className="text-[13px] text-white/90 font-medium mt-1.5 leading-snug">
              {prefs.master
                ? `Tienes ${enabledCount} ${enabledCount === 1 ? "recordatorio activo" : "recordatorios activos"}. Te avisamos sin saturar tu vibra.`
                : "Activa las notificaciones para no perderte tu lectura del día."}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Pill on={prefs.dailyReading.on} icon={<Sun size={10} />} label={`Lectura ${prefs.dailyReading.time}`} />
              <Pill on={prefs.morningQuote.on} icon={<Sparkles size={10} />} label={`Frase ${prefs.morningQuote.time}`} />
              <Pill on={prefs.nightRitual.on} icon={<Moon size={10} />} label={`Ritual ${prefs.nightRitual.time}`} />
            </div>
          </div>
        </div>

        {/* Schedules */}
        <SectionLabel emoji="⏰" text="tus rituales diarios" />
        <div className="space-y-3">
          <TimeRow
            icon={<Sun size={16} className="text-baddia-hot" />} tint="bg-baddia-bubble"
            title="Tu lectura del día"
            caption="Energía, color y número del día"
            on={prefs.dailyReading.on}
            time={prefs.dailyReading.time}
            onToggle={(v) => setSchedule("dailyReading", { on: v })}
            onTime={(t) => setSchedule("dailyReading", { time: t })}
            disabled={!prefs.master}
          />
          <TimeRow
            icon={<Sparkles size={16} className="text-baddia-ink" />} tint="bg-baddia-yellow"
            title="Frase de la mañana"
            caption="Tu mantra para empezar con glow"
            on={prefs.morningQuote.on}
            time={prefs.morningQuote.time}
            onToggle={(v) => setSchedule("morningQuote", { on: v })}
            onTime={(t) => setSchedule("morningQuote", { time: t })}
            disabled={!prefs.master}
          />
          <TimeRow
            icon={<Moon size={16} className="text-white" />} tint="bg-baddia-lavender"
            title="Ritual de noche"
            caption="Manifestar antes de dormir"
            on={prefs.nightRitual.on}
            time={prefs.nightRitual.time}
            onToggle={(v) => setSchedule("nightRitual", { on: v })}
            onTime={(t) => setSchedule("nightRitual", { time: t })}
            disabled={!prefs.master}
          />
        </div>

        {/* Vibras especiales */}
        <SectionLabel emoji="💗" text="vibras especiales" />
        <div className="space-y-3">
          <ToggleRow
            icon={<Heart size={16} className="text-baddia-hot" />} tint="bg-baddia-bubble"
            title="Alertas de amor"
            caption="Cuando tu compatibilidad sube"
            on={prefs.loveAlerts}
            onChange={(v) => set("loveAlerts", v)}
            disabled={!prefs.master}
          />
          <ToggleRow
            icon={<Hand size={16} className="text-baddia-ink" />} tint="bg-baddia-mint"
            title="Crush ping"
            caption='"¿Te escribirá esta semana?"'
            on={prefs.crushPing}
            onChange={(v) => set("crushPing", v)}
            disabled={!prefs.master}
          />
          <ToggleRow
            icon={<Sparkles size={16} className="text-baddia-ink" />} tint="bg-baddia-yellow"
            title="Racha de manifestación"
            caption="No rompas tu Racha Glow ✨"
            on={prefs.manifestStreak}
            onChange={(v) => set("manifestStreak", v)}
            disabled={!prefs.master}
          />
          <ToggleRow
            icon={<Star size={16} className="text-white" />} tint="bg-baddia-lavender"
            title="Tarot semanal"
            caption="Tu tirada de los domingos"
            on={prefs.tarotWeekly}
            onChange={(v) => set("tarotWeekly", v)}
            disabled={!prefs.master}
          />
          <ToggleRow
            icon={<Sparkles size={16} className="text-baddia-hot" />} tint="bg-baddia-soft"
            title="Aura check semanal"
            caption="Revisa el color de tu energía"
            on={prefs.auraCheck}
            onChange={(v) => set("auraCheck", v)}
            disabled={!prefs.master}
          />
        </div>

        {/* Modo silencio */}
        <SectionLabel emoji="🌙" text="modo silencio" />
        <div className="relative rounded-3xl bg-white border-[2.5px] border-baddia-ink p-4 pt-5 shadow-[5px_6px_0_hsl(260_16%_15%)]">
          <p className="text-[12px] text-baddia-ink/70 font-semibold mb-3 leading-snug">
            No te molestamos entre estas horas. Tu sueño también es sagrado.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <TimeField label="Desde" value={prefs.quietStart} onChange={(t) => set("quietStart", t)} />
            <TimeField label="Hasta" value={prefs.quietEnd} onChange={(t) => set("quietEnd", t)} />
          </div>
        </div>

        {/* Sonido & vibración */}
        <SectionLabel emoji="🔊" text="cómo te avisamos" />
        <div className="space-y-3">
          <ToggleRow
            icon={<Volume2 size={16} className="text-baddia-ink" />} tint="bg-baddia-mint"
            title="Sonido cute"
            caption="Una campanita suave ✦"
            on={prefs.sound}
            onChange={(v) => set("sound", v)}
            disabled={!prefs.master}
          />
          <ToggleRow
            icon={<Vibrate size={16} className="text-baddia-ink" />} tint="bg-baddia-bubble"
            title="Vibración"
            caption="Pulsito suave en tu muñeca"
            on={prefs.vibration}
            onChange={(v) => set("vibration", v)}
            disabled={!prefs.master}
          />
        </div>

        {/* Save / reset */}
        <div className="pt-2 flex gap-2">
          <button
            onClick={() => {
              setPrefs(DEFAULTS);
              toast("Restablecimos tus avisos por defecto ✨");
            }}
            className="flex-1 py-3 rounded-full bg-white text-baddia-ink font-display font-black text-[13px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
          >
            Restablecer
          </button>
          <button
            onClick={() => {
              toast.success("Tus recordatorios están listos 💖");
              go("profile");
            }}
            className="flex-1 py-3 rounded-full bg-baddia-hot text-white font-display font-black text-[13px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all inline-flex items-center justify-center gap-1.5"
          >
            <Check size={14} strokeWidth={3} /> Guardar
          </button>
        </div>

        <p className="text-center text-[11px] text-baddia-ink/45 font-semibold pt-2">
          Tus preferencias se guardan solo en este dispositivo 🔒
        </p>
      </div>
    </div>
  );
}

/* ─────────── helpers ─────────── */

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

function Pill({ on, icon, label }: { on: boolean; icon: React.ReactNode; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border-2 border-white px-2 py-0.5 text-[10px] font-display font-bold shadow-[1.5px_1.5px_0_rgba(0,0,0,0.2)] ${on ? "bg-white/95 text-baddia-ink" : "bg-white/20 text-white/70 line-through"}`}>
      {icon} {label}
    </span>
  );
}

function Switch({ on, onChange, disabled }: { on: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!on)}
      aria-pressed={on}
      className={`relative w-12 h-7 rounded-full border-2 border-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] transition-colors ${disabled ? "opacity-40" : ""} ${on ? "bg-baddia-hot" : "bg-baddia-pearl"}`}
    >
      <span
        className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white border-2 border-baddia-ink transition-transform ${on ? "translate-x-[20px]" : ""}`}
      />
    </button>
  );
}

function ToggleRow({
  icon, tint, title, caption, on, onChange, disabled,
}: {
  icon: React.ReactNode; tint: string; title: string; caption: string;
  on: boolean; onChange: (v: boolean) => void; disabled?: boolean;
}) {
  return (
    <div className={`rounded-3xl bg-white border-[2.5px] border-baddia-ink p-3.5 shadow-[5px_6px_0_hsl(260_16%_15%)] flex items-center gap-3 ${disabled ? "opacity-60" : ""}`}>
      <span className={`shrink-0 w-10 h-10 rounded-2xl border-2 border-baddia-ink ${tint} flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)]`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-display font-black text-baddia-ink text-[14px] leading-tight">{title}</p>
        <p className="text-[11.5px] text-baddia-ink/60 font-semibold leading-snug">{caption}</p>
      </div>
      <Switch on={on} onChange={onChange} disabled={disabled} />
    </div>
  );
}

function TimeRow({
  icon, tint, title, caption, on, time, onToggle, onTime, disabled,
}: {
  icon: React.ReactNode; tint: string; title: string; caption: string;
  on: boolean; time: string;
  onToggle: (v: boolean) => void; onTime: (t: string) => void; disabled?: boolean;
}) {
  return (
    <div className={`rounded-3xl bg-white border-[2.5px] border-baddia-ink p-3.5 shadow-[5px_6px_0_hsl(260_16%_15%)] ${disabled ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-3">
        <span className={`shrink-0 w-10 h-10 rounded-2xl border-2 border-baddia-ink ${tint} flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)]`}>
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-display font-black text-baddia-ink text-[14px] leading-tight">{title}</p>
          <p className="text-[11.5px] text-baddia-ink/60 font-semibold leading-snug">{caption}</p>
        </div>
        <Switch on={on} onChange={onToggle} disabled={disabled} />
      </div>
      {on && (
        <div className="mt-3 flex items-center gap-2 pl-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-baddia-pearl text-baddia-ink border-2 border-baddia-ink px-2 py-0.5 text-[10px] font-display font-black uppercase tracking-wider shadow-[1.5px_1.5px_0_hsl(260_16%_15%)]">
            <Clock size={10} /> hora
          </span>
          <input
            type="time"
            value={time}
            disabled={disabled}
            onChange={(e) => onTime(e.target.value)}
            className="flex-1 rounded-2xl border-2 border-baddia-ink bg-baddia-pearl px-3 py-2 text-[13px] font-display font-black text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] focus:outline-none focus:bg-white"
          />
          <span className="inline-flex items-center gap-1 rounded-full bg-baddia-yellow text-baddia-ink border-2 border-baddia-ink px-2 py-0.5 text-[10px] font-display font-black shadow-[1.5px_1.5px_0_hsl(260_16%_15%)]">
            <Calendar size={10} /> cada día
          </span>
        </div>
      )}
    </div>
  );
}

function TimeField({ label, value, onChange }: { label: string; value: string; onChange: (t: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] font-display font-black text-baddia-ink/70 uppercase tracking-wider mb-1.5 pl-1">
        {label}
      </label>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-pearl px-3 py-2.5 text-[14px] font-display font-black text-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none focus:bg-white"
      />
    </div>
  );
}
