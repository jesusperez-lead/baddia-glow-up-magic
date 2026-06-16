import { useState, useEffect } from "react";
import { useBaddia, Interest } from "@/lib/baddia-state";
import { Sparkles } from "../PhoneFrame";
import { LogoMark } from "../Logo";
import { ChevronLeft } from "lucide-react";

const INTERESTS: { label: Interest; emoji: string; color: string; text: string }[] = [
  { label: "Amor",            emoji: "💖", color: "bg-baddia-bubble",  text: "text-white" },
  { label: "Dinero",          emoji: "💸", color: "bg-baddia-lime",    text: "text-baddia-ink" },
  { label: "Suerte",          emoji: "🍀", color: "bg-baddia-mint",    text: "text-white" },
  { label: "Crush Energy",    emoji: "💌", color: "bg-baddia-hot",     text: "text-white" },
  { label: "Horóscopo",       emoji: "🌙", color: "bg-baddia-lavender",text: "text-white" },
  { label: "Lectura de mano", emoji: "🤲", color: "bg-baddia-soft",    text: "text-baddia-ink" },
  { label: "Tarot",           emoji: "🔮", color: "bg-baddia-ink",     text: "text-white" },
  { label: "Aura",            emoji: "🌈", color: "bg-baddia-yellow",  text: "text-baddia-ink" },
  { label: "Amor propio",     emoji: "🌸", color: "bg-baddia-pink",    text: "text-baddia-ink" },
];

const LOADING_MESSAGES = [
  "Baddia está leyendo tu energía…",
  "Calculando tu glow cósmico…",
  "La luna tiene un mensaje para ti…",
  "Preparando tu color de hoy…",
];

function BackgroundDeco() {
  return (
    <>
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/40" />
      <div className="blob top-40 -right-20 w-64 h-64 bg-baddia-soft/55" style={{ animationDelay: "4s" }} />
      <div className="blob bottom-20 -left-10 w-72 h-72 bg-baddia-yellow/40" style={{ animationDelay: "8s" }} />
      <div className="blob -bottom-16 right-0 w-80 h-80 bg-baddia-bubble/45" style={{ animationDelay: "6s" }} />
      <div className="blob -bottom-24 left-1/3 w-72 h-72 bg-baddia-soft/45" style={{ animationDelay: "10s" }} />
    </>
  );
}


export function Onboarding() {
  const { go, user, setUser } = useBaddia();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(user.name === "Sofi" ? "" : user.name);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [selected, setSelected] = useState<Interest[]>([]);
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step !== 5) return;
    setProgress(0);
    const msgInt = setInterval(() => setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length), 900);
    const progInt = setInterval(() => setProgress((p) => Math.min(100, p + 2.5)), 100);
    const timeout = setTimeout(() => go("first-reading"), 4200);
    return () => { clearInterval(msgInt); clearInterval(progInt); clearTimeout(timeout); };
  }, [step, go]);

  const back = () => (step > 1 ? setStep(step - 1) : go("welcome"));

  return (
    <div
      key={step}
      className="relative min-h-full flex flex-col overflow-hidden isolate"
      style={{
        background:
          "linear-gradient(160deg, hsl(335 100% 94%) 0%, hsl(333 100% 97%) 30%, hsl(257 100% 94%) 65%, hsl(48 100% 92%) 100%)",
      }}
    >
      <BackgroundDeco />
      <Sparkles />

      <header className="relative z-10 flex items-center justify-between px-5 pt-6 pb-2">
        <button
          onClick={back}
          className="w-11 h-11 rounded-full bg-white border-2 border-baddia-ink/10 flex items-center justify-center shadow-soft active:scale-95 transition-transform"
        >
          <ChevronLeft size={20} className="text-baddia-ink" />
        </button>
        <LogoMark size={40} />
        <div className="text-xs font-display font-bold text-baddia-ink/60 bg-white rounded-full px-3 py-1.5 border border-baddia-ink/10">
          {step}/5
        </div>
      </header>

      {/* Progress */}
      <div className="relative z-10 px-5 mt-1">
        <div className="h-2 bg-white rounded-full overflow-hidden border border-baddia-ink/5">
          <div
            className="h-full bg-gradient-hot transition-all duration-500 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="relative z-10 flex-1 px-6 py-6 flex flex-col">
        {/* STEP 1 — Name */}
        {step === 1 && (
          <div className="flex-1 flex flex-col animate-slide-up">
            <div className="inline-flex self-start mb-4">
              <span className="rounded-full bg-baddia-yellow border-2 border-baddia-ink px-3 py-1.5 text-xs font-display font-bold text-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-3">
                hello baddie! 👋
              </span>
            </div>
            <h2 className="font-display font-bold text-[30px] leading-[1.1] text-baddia-ink">
              ¿Cómo quieres que <span className="gradient-text">Baddia</span> te llame?
            </h2>
            <p className="text-[15px] text-baddia-ink/60 mt-3 font-semibold">
              Tu energía se siente más tuya cuando tiene nombre. ✨
            </p>

            <div className="relative mt-8">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre o nickname"
                className="w-full bg-white rounded-2xl px-5 py-5 border-2 border-baddia-ink/10 text-baddia-ink font-display font-bold text-lg placeholder:text-baddia-ink/30 placeholder:font-normal focus:outline-none focus:border-baddia-hot transition-colors"
              />
              {name && (
                <span className="absolute -top-3 -right-2 text-2xl sticker-float-fast">💖</span>
              )}
            </div>

            <div className="flex-1" />
            <PrimaryButton disabled={!name.trim()} onClick={() => { setUser({ name: name.trim() }); setStep(2); }}>
              Continuar
            </PrimaryButton>
          </div>
        )}

        {/* STEP 2 — Birthday */}
        {step === 2 && (
          <div className="flex-1 flex flex-col animate-slide-up">
            <div className="inline-flex self-start mb-4">
              <span className="rounded-full bg-baddia-soft border-2 border-baddia-ink px-3 py-1.5 text-xs font-display font-bold text-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2">
                🌙 zodiac time
              </span>
            </div>
            <h2 className="font-display font-bold text-[28px] leading-[1.1] text-baddia-ink">
              Dinos tu cumple y <span className="text-baddia-lavender">Baddia</span> lee tu zodiac mood.
            </h2>
            <p className="text-[14px] text-baddia-ink/60 mt-3 font-semibold leading-relaxed">
              Con esto personalizamos tu signo, número de vida, suerte diaria y color de hoy.
            </p>

            <div className="mt-7 grid grid-cols-3 gap-3">
              {[
                { label: "Día",  val: day,   set: setDay,   ph: "12",   max: 2 },
                { label: "Mes",  val: month, set: setMonth, ph: "10",   max: 2 },
                { label: "Año",  val: year,  set: setYear,  ph: "2002", max: 4 },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-[11px] font-display font-bold uppercase tracking-wider text-baddia-ink/50 ml-2">
                    {f.label}
                  </label>
                  <input
                    inputMode="numeric"
                    maxLength={f.max}
                    value={f.val}
                    onChange={(e) => f.set(e.target.value.replace(/\D/g, ""))}
                    placeholder={f.ph}
                    className="mt-1 w-full text-center bg-white rounded-2xl px-2 py-4 border-2 border-baddia-ink/10 text-baddia-ink font-display font-bold text-xl focus:outline-none focus:border-baddia-hot transition-colors"
                  />
                </div>
              ))}
            </div>

            {/* Doodles */}
            <div className="relative mt-8 h-32">
              <div className="absolute left-2 top-0 sticker-float" style={{ ['--r' as any]: '-6deg' }}>
                <div className="rounded-2xl bg-baddia-ink text-white px-4 py-3 shadow-[3px_3px_0_hsl(48_100%_59%)] flex items-center gap-2">
                  <span className="text-2xl">🌙</span>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider opacity-70 font-bold">Luna</p>
                    <p className="font-display font-bold text-sm">Creciente</p>
                  </div>
                </div>
              </div>
              <div className="absolute right-2 top-4 sticker-float-slow" style={{ ['--r' as any]: '8deg' }}>
                <div className="rounded-2xl bg-baddia-lime border-2 border-baddia-ink px-4 py-3 shadow-[3px_3px_0_hsl(260_16%_15%)]">
                  <p className="text-[10px] uppercase tracking-wider text-baddia-ink/60 font-bold">Glow</p>
                  <p className="font-display font-bold text-lg text-baddia-ink">87 ✦</p>
                </div>
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 sticker-float-fast">
                <div className="text-4xl">⭐</div>
              </div>
            </div>

            <div className="flex-1" />
            <PrimaryButton
              disabled={!day || !month || !year}
              onClick={() => { setUser({ day, month, year }); setStep(3); }}
            >
              Ver mi energía ✨
            </PrimaryButton>
          </div>
        )}

        {/* STEP 3 — Interests */}
        {step === 3 && (
          <div className="flex-1 flex flex-col animate-slide-up">
            <div className="inline-flex self-start mb-3">
              <span className="rounded-full bg-baddia-hot text-white px-3 py-1.5 text-xs font-display font-bold shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2">
                ✨ tu vibe
              </span>
            </div>
            <h2 className="font-display font-bold text-[30px] leading-[1.1] text-baddia-ink">
              Elige tu <span className="gradient-text">vibe</span>
            </h2>
            <p className="text-[14px] text-baddia-ink/60 mt-2 font-semibold">
              Selecciona lo que quieres que Baddia lea para ti. 💫
            </p>

            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {INTERESTS.map((i, idx) => {
                const active = selected.includes(i.label);
                return (
                  <button
                    key={i.label}
                    onClick={() =>
                      setSelected((s) =>
                        s.includes(i.label) ? s.filter((x) => x !== i.label) : [...s, i.label]
                      )
                    }
                    style={{ animationDelay: `${idx * 40}ms` }}
                    className={`animate-pop-in relative rounded-2xl p-3 text-center font-display font-bold text-[12px] transition-all active:scale-90 border-2 ${
                      active
                        ? `${i.color} ${i.text} border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 scale-[1.03]`
                        : "bg-white text-baddia-ink border-baddia-ink/10 hover:border-baddia-ink/30"
                    }`}
                  >
                    {active && (
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-baddia-yellow border-2 border-baddia-ink flex items-center justify-center text-[10px] font-bold text-baddia-ink">
                        ✓
                      </span>
                    )}
                    <span className="text-2xl block mb-1 leading-none">{i.emoji}</span>
                    <span className="leading-tight block">{i.label}</span>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-xs text-baddia-ink/40 mt-4 font-semibold">
              {selected.length === 0 ? "Elige al menos 1" : `${selected.length} seleccionado${selected.length > 1 ? "s" : ""}`}
            </p>

            <div className="flex-1" />
            <PrimaryButton
              disabled={selected.length === 0}
              onClick={() => { setUser({ interests: selected }); setStep(4); }}
            >
              Crear mi perfil cósmico
            </PrimaryButton>
          </div>
        )}

        {/* STEP 4 — Plan teaser (free) */}
        {step === 4 && (
          <div className="flex-1 flex flex-col animate-slide-up">
            <div className="inline-flex self-start mb-3">
              <span className="rounded-full bg-baddia-lime border-2 border-baddia-ink px-3 py-1.5 text-xs font-display font-bold text-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2">
                100% gratis para empezar
              </span>
            </div>
            <h2 className="font-display font-bold text-[28px] leading-[1.1] text-baddia-ink">
              Tu plan <span className="gradient-text">Baddia Free</span> incluye:
            </h2>
            <div className="mt-5 space-y-3">
              {[
                { e: "🌙", t: "Glow score y mood diario" },
                { e: "🍀", t: "Lucky number y color del día" },
                { e: "💌", t: "1 crush energy reading semanal" },
                { e: "✨", t: "Frases de amor propio" },
              ].map((f, i) => (
                <div
                  key={i}
                  style={{ animationDelay: `${i * 80}ms` }}
                  className="animate-slide-up baddia-sticker flex items-center gap-3 py-3"
                >
                  <span className="text-2xl">{f.e}</span>
                  <p className="font-display font-bold text-baddia-ink text-[15px]">{f.t}</p>
                </div>
              ))}
              <div className="rounded-2xl bg-gradient-hot text-white p-4 flex items-center gap-3 shadow-glow">
                <span className="text-2xl">👑</span>
                <div className="flex-1">
                  <p className="font-display font-bold text-sm">Baddia Pro</p>
                  <p className="text-[12px] opacity-90">Tarot diario, palm reading completo y más.</p>
                </div>
              </div>
            </div>

            <div className="flex-1" />
            <PrimaryButton onClick={() => setStep(5)}>Activar mi Baddia ✨</PrimaryButton>
          </div>
        )}

        {/* STEP 5 — Loading */}
        {step === 5 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-fade-in">
            <div className="relative w-40 h-40 mb-8">
              {/* glow halo */}
              <div className="absolute inset-0 rounded-full bg-gradient-glow blur-2xl opacity-70" />
              {/* orbit sparkles */}
              <div className="absolute inset-0 animate-orbit">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl text-baddia-yellow">✦</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xl text-baddia-mint">✧</span>
                <span className="absolute top-1/2 left-0 -translate-y-1/2 text-lg text-baddia-hot">✦</span>
                <span className="absolute top-1/2 right-0 -translate-y-1/2 text-lg text-baddia-lavender">✧</span>
              </div>
              {/* breathing B */}
              <div className="absolute inset-4 rounded-full bg-gradient-hot flex items-center justify-center shadow-glow animate-breathe">
                <span className="font-display font-bold text-white text-7xl leading-none">B</span>
              </div>
            </div>

            <div className="min-h-[60px] flex items-center justify-center">
              <p key={msgIdx} className="font-display font-bold text-[18px] text-baddia-ink animate-fade-in">
                {LOADING_MESSAGES[msgIdx]}
              </p>
            </div>

            <div className="w-full max-w-[260px] mt-6">
              <div className="h-2.5 bg-white rounded-full overflow-hidden border border-baddia-ink/10">
                <div
                  className="h-full bg-gradient-hot rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] text-baddia-ink/50 mt-2 font-semibold">
                {Math.round(progress)}% cósmico
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PrimaryButton({
  children, onClick, disabled,
}: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <div className="pt-6 mt-2">
      <button
        disabled={disabled}
        onClick={onClick}
        className="btn-sticker w-full py-[18px] rounded-full bg-gradient-hot text-white text-lg disabled:cursor-not-allowed"
      >
        <span className="relative z-10">{children}</span>
      </button>
    </div>
  );
}

