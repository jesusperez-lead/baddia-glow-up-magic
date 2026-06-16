import { useState, useEffect } from "react";
import { useBaddia, Interest } from "@/lib/baddia-state";
import { Sparkles } from "../PhoneFrame";
import { LogoMark } from "../Logo";
import { ChevronLeft } from "lucide-react";

const INTERESTS: { label: Interest; emoji: string }[] = [
  { label: "Amor", emoji: "💖" },
  { label: "Dinero", emoji: "💸" },
  { label: "Suerte", emoji: "🍀" },
  { label: "Crush Energy", emoji: "💌" },
  { label: "Horóscopo", emoji: "🌙" },
  { label: "Lectura de mano", emoji: "🤲" },
  { label: "Tarot", emoji: "🔮" },
  { label: "Aura", emoji: "🌈" },
  { label: "Amor propio", emoji: "🌸" },
];

const LOADING_MESSAGES = [
  "Baddia está leyendo tu energía…",
  "Calculando tu glow cósmico…",
  "La luna tiene un mensaje para ti…",
  "Preparando tu color de hoy…",
];

export function Onboarding() {
  const { go, user, setUser } = useBaddia();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user.name === "Sofi" ? "" : user.name);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [selected, setSelected] = useState<Interest[]>([]);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    if (step !== 4) return;
    const interval = setInterval(() => setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length), 900);
    const timeout = setTimeout(() => go("first-reading"), 4200);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [step, go]);

  const back = () => (step > 1 ? setStep(step - 1) : go("welcome"));

  return (
    <div className="relative min-h-full flex flex-col gradient-bg-soft">
      <Sparkles />
      <header className="relative flex items-center justify-between p-5">
        <button onClick={back} className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-soft">
          <ChevronLeft size={20} className="text-baddia-purple" />
        </button>
        <LogoMark size={36} />
        <div className="text-xs font-bold text-baddia-purple/60">{step}/4</div>
      </header>

      {/* Progress */}
      <div className="px-5">
        <div className="h-1.5 bg-white/70 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-glow transition-all duration-500" style={{ width: `${(step / 4) * 100}%` }} />
        </div>
      </div>

      <div className="relative flex-1 px-6 py-8 flex flex-col">
        {step === 1 && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <h2 className="font-display font-black text-2xl text-baddia-purple leading-tight">
              ¿Cómo quieres que <span className="gradient-text">Baddia</span> te llame?
            </h2>
            <p className="text-sm text-baddia-purple/70 mt-2">Será tu nombre cósmico ✨</p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre o nickname"
              className="mt-8 w-full bg-white rounded-2xl px-5 py-4 border border-pink-100 text-baddia-purple font-semibold placeholder:text-baddia-purple/30 focus:outline-none focus:ring-2 focus:ring-baddia-pink"
            />
            <div className="flex-1" />
            <button
              disabled={!name.trim()}
              onClick={() => { setUser({ name: name.trim() }); setStep(2); }}
              className="w-full py-4 rounded-2xl bg-gradient-glow text-white font-bold shadow-glow disabled:opacity-50 active:scale-[0.98] transition-transform"
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <h2 className="font-display font-black text-2xl text-baddia-purple leading-tight">
              Dinos tu fecha de nacimiento para descubrir tu energía zodiacal. 🌙
            </h2>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { label: "Día", val: day, set: setDay, ph: "12", max: 2 },
                { label: "Mes", val: month, set: setMonth, ph: "10", max: 2 },
                { label: "Año", val: year, set: setYear, ph: "2002", max: 4 },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-xs font-bold text-baddia-purple/60 ml-2">{f.label}</label>
                  <input
                    inputMode="numeric"
                    maxLength={f.max}
                    value={f.val}
                    onChange={(e) => f.set(e.target.value.replace(/\D/g, ""))}
                    placeholder={f.ph}
                    className="mt-1 w-full text-center bg-white rounded-2xl px-2 py-4 border border-pink-100 text-baddia-purple font-bold text-lg focus:outline-none focus:ring-2 focus:ring-baddia-pink"
                  />
                </div>
              ))}
            </div>
            <div className="flex-1" />
            <button
              disabled={!day || !month || !year}
              onClick={() => { setUser({ day, month, year }); setStep(3); }}
              className="w-full py-4 rounded-2xl bg-gradient-glow text-white font-bold shadow-glow disabled:opacity-50 active:scale-[0.98] transition-transform"
            >
              Ver mi energía ✨
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="flex-1 flex flex-col animate-fade-in">
            <h2 className="font-display font-black text-2xl text-baddia-purple leading-tight">
              ¿Qué quieres que <span className="gradient-text">Baddia</span> lea para ti?
            </h2>
            <p className="text-sm text-baddia-purple/70 mt-2">Elige las que vibren contigo 💫</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {INTERESTS.map((i) => {
                const active = selected.includes(i.label);
                return (
                  <button
                    key={i.label}
                    onClick={() =>
                      setSelected((s) =>
                        s.includes(i.label) ? s.filter((x) => x !== i.label) : [...s, i.label]
                      )
                    }
                    className={`relative rounded-2xl p-4 text-left font-semibold text-sm transition-all active:scale-95 ${
                      active
                        ? "bg-gradient-glow text-white shadow-glow"
                        : "bg-white text-baddia-purple border border-pink-100"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{i.emoji}</span>
                    {i.label}
                  </button>
                );
              })}
            </div>
            <div className="flex-1" />
            <button
              disabled={selected.length === 0}
              onClick={() => { setUser({ interests: selected }); setStep(4); }}
              className="mt-6 w-full py-4 rounded-2xl bg-gradient-glow text-white font-bold shadow-glow disabled:opacity-50 active:scale-[0.98] transition-transform"
            >
              Crear mi perfil cósmico
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 rounded-full bg-gradient-glow blur-2xl opacity-60 animate-twinkle" />
              <div className="relative w-full h-full rounded-full bg-gradient-glow flex items-center justify-center shadow-glow animate-spin-slow">
                <span className="text-5xl">✨</span>
              </div>
            </div>
            <div className="space-y-3 min-h-[120px]">
              {LOADING_MESSAGES.map((m, i) => (
                <p
                  key={m}
                  className={`text-baddia-purple font-display font-bold text-lg transition-all duration-500 ${
                    i === msgIdx ? "opacity-100 scale-100" : "opacity-40 scale-95"
                  }`}
                >
                  {m}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
