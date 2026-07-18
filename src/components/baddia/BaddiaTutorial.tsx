import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, ArrowRight, Sparkles } from "lucide-react";

export const TUTORIAL_KEY = "baddia.tutorial.v1";

export const hasSeenTutorial = () => {
  try { return localStorage.getItem(TUTORIAL_KEY) === "1"; } catch { return false; }
};
export const markTutorialSeen = () => {
  try { localStorage.setItem(TUTORIAL_KEY, "1"); } catch {}
};

type Step = {
  emoji: string;
  chip: string;
  title: string;
  desc: string;
  bg: string;
  accent: string;
  scene: "daily" | "reading" | "manifest" | "love" | "journal" | "profile";
};

const STEPS: Step[] = [
  {
    emoji: "✨",
    chip: "bienvenida",
    title: "Baddia, tu bestie mística",
    desc: "Un tour cortito para que sepas todo lo que puedes hacer aquí. Prometo que es cute 💖",
    bg: "linear-gradient(135deg,#FFE9F3 0%,#F5E6FF 50%,#FFF7D6 100%)",
    accent: "#FF7AC8",
    scene: "daily",
  },
  {
    emoji: "🌸",
    chip: "daily",
    title: "Tu Daily glow",
    desc: "Cada día una frase, tu energía y una racha que crece contigo. Aquí empieza tu ritual.",
    bg: "linear-gradient(135deg,#FFF1F7 0%,#FFE0EE 60%,#FFD1E7 100%)",
    accent: "#FF5EB3",
    scene: "daily",
  },
  {
    emoji: "🔮",
    chip: "lecturas ia",
    title: "Baddia lo lee todo",
    desc: "Toca la varita del centro y se abre el modal: palma, tarot, aura, outfit, crush… tu energía leída al momento.",
    bg: "linear-gradient(135deg,#2E1A47 0%,#8B63F7 55%,#FF7AC8 100%)",
    accent: "#FFE066",
    scene: "reading",
  },
  {
    emoji: "🌙",
    chip: "manifestar",
    title: "Manifestar con voz guiada",
    desc: "Escribe tu frase, sube una foto y Baddia te acompaña con audio y contador. Cada manifestación tiene su propia racha.",
    bg: "linear-gradient(135deg,#EDE4FF 0%,#D9C7FF 60%,#B79BFF 100%)",
    accent: "#7A4CFF",
    scene: "manifest",
  },
  {
    emoji: "💘",
    chip: "love",
    title: "Todo sobre tu crush",
    desc: "Compatibilidad, red/green flags, la inicial de su nombre y si te va a escribir esta semana. Spoiler: sí.",
    bg: "linear-gradient(135deg,#FFD6E7 0%,#FFB3D1 60%,#FF7AC8 100%)",
    accent: "#FF3D8A",
    scene: "love",
  },
  {
    emoji: "📓",
    chip: "diario",
    title: "Tu diario privado",
    desc: "Ponle contraseña y una pista secreta. Solo tú entras. Además: calendario de estados y tu historial energético.",
    bg: "linear-gradient(135deg,#FFF9E0 0%,#FFECC2 60%,#FFD48A 100%)",
    accent: "#E38A2B",
    scene: "journal",
  },
  {
    emoji: "💖",
    chip: "yo",
    title: "Tu perfil, tu vibe",
    desc: "Foto polaroid, tus intereses, tono de Baddia y feedback para ganar tu insignia ✧ Stargirl.",
    bg: "linear-gradient(135deg,#FFE0F0 0%,#F0D6FF 60%,#D6E4FF 100%)",
    accent: "#B85CFF",
    scene: "profile",
  },
];

function Scene({ scene, accent }: { scene: Step["scene"]; accent: string }) {
  // Cute animated illustration per scene using pure divs + emoji
  if (scene === "reading") {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="absolute w-24 h-36 rounded-2xl border-[2.5px] border-baddia-ink bg-white shadow-[4px_5px_0_hsl(260_16%_15%)] flex items-center justify-center text-3xl"
            style={{
              transform: `rotate(${(i - 1) * 12}deg) translateX(${(i - 1) * 34}px) translateY(${Math.abs(i - 1) * 6}px)`,
              animation: `bt-cardFloat 2.4s ease-in-out ${i * 0.25}s infinite alternate`,
              background: i === 1 ? "linear-gradient(160deg,#fff,#ffe9f3)" : "#fff",
            }}
          >
            {["🌙", "✨", "💫"][i]}
          </span>
        ))}
        <span className="absolute -top-2 text-2xl animate-sparkle-spin" style={{ color: accent }}>✦</span>
      </div>
    );
  }
  if (scene === "manifest") {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="relative w-40 h-40 rounded-full border-[3px] border-baddia-ink bg-white shadow-[4px_5px_0_hsl(260_16%_15%)] flex items-center justify-center"
          style={{ animation: "bt-pulse 2s ease-in-out infinite" }}
        >
          <span className="text-4xl">🌙</span>
          <span className="absolute inset-2 rounded-full border-2 border-dashed" style={{ borderColor: accent, animation: "bt-spin 6s linear infinite" }} />
        </div>
        {["💖", "✨", "🌟", "💫"].map((e, i) => (
          <span
            key={i}
            className="absolute text-xl"
            style={{
              left: `${20 + i * 18}%`,
              top: `${10 + (i % 2) * 60}%`,
              animation: `bt-float ${2 + i * 0.3}s ease-in-out ${i * 0.2}s infinite alternate`,
            }}
          >
            {e}
          </span>
        ))}
      </div>
    );
  }
  if (scene === "love") {
    return (
      <div className="relative w-full h-full flex items-center justify-center gap-3">
        <span className="w-24 h-28 rounded-2xl border-[2.5px] border-baddia-ink bg-white shadow-[3px_4px_0_hsl(260_16%_15%)] flex items-center justify-center text-4xl rotate-[-8deg]" style={{ animation: "bt-heartL 2.4s ease-in-out infinite" }}>👩🏻</span>
        <span className="text-4xl" style={{ animation: "bt-pulse 1.2s ease-in-out infinite", color: accent }}>💘</span>
        <span className="w-24 h-28 rounded-2xl border-[2.5px] border-baddia-ink bg-white shadow-[3px_4px_0_hsl(260_16%_15%)] flex items-center justify-center text-4xl rotate-[8deg]" style={{ animation: "bt-heartR 2.4s ease-in-out infinite" }}>🧑🏽</span>
      </div>
    );
  }
  if (scene === "journal") {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="relative w-40 h-48 rounded-xl border-[2.5px] border-baddia-ink shadow-[4px_5px_0_hsl(260_16%_15%)] rotate-[-6deg]"
          style={{
            background: "repeating-linear-gradient(to bottom,#fffdf7 0px,#fffdf7 12px,hsl(335 60% 85% / 0.55) 13px)",
            animation: "bt-float 2.4s ease-in-out infinite alternate",
          }}
        >
          <span className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-baddia-yellow border-2 border-baddia-ink flex items-center justify-center text-lg shadow-[2px_2px_0_hsl(260_16%_15%)] rotate-6">🔒</span>
          <span className="absolute inset-0 flex items-center justify-center text-4xl">📓</span>
        </div>
      </div>
    );
  }
  if (scene === "profile") {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div
          className="relative bg-white border-[2.5px] border-baddia-ink shadow-[4px_5px_0_hsl(260_16%_15%)] p-2 pb-6 rotate-[-6deg]"
          style={{ animation: "bt-float 2.4s ease-in-out infinite alternate" }}
        >
          <div className="w-32 h-36 rounded-[2px] bg-gradient-to-br from-baddia-bubble via-baddia-lavender to-baddia-hot flex items-center justify-center text-5xl">💖</div>
          <span className="absolute bottom-1 left-0 right-0 text-center font-display font-black text-[11px] text-baddia-ink">stargirl ✧</span>
        </div>
      </div>
    );
  }
  // daily
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div
        className="relative w-52 h-32 rounded-2xl border-[2.5px] border-baddia-ink bg-white shadow-[4px_5px_0_hsl(260_16%_15%)] flex items-center justify-center px-4 rotate-[-3deg]"
        style={{ animation: "bt-float 2.4s ease-in-out infinite alternate" }}
      >
        <p className="font-display italic text-center text-[13px] text-baddia-ink leading-snug">
          "Lo que es para mí, me encuentra con paz y abundancia."
        </p>
        <span className="absolute -top-3 -right-3 text-xl animate-sparkle-spin" style={{ color: accent }}>✦</span>
        <span className="absolute -bottom-3 -left-3 text-lg" style={{ animation: "bt-pulse 1.6s ease-in-out infinite" }}>💖</span>
      </div>
    </div>
  );
}

export function BaddiaTutorial({ onClose }: { onClose: () => void }) {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const isLast = i === STEPS.length - 1;

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const finish = () => { markTutorialSeen(); onClose(); };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <style>{`
        @keyframes bt-float { from { transform: translateY(-4px) } to { transform: translateY(4px) } }
        @keyframes bt-pulse { 0%,100% { transform: scale(1) } 50% { transform: scale(1.12) } }
        @keyframes bt-spin { to { transform: rotate(360deg) } }
        @keyframes bt-cardFloat { from { transform: rotate(var(--r,0deg)) translateY(-3px) } to { transform: rotate(var(--r,0deg)) translateY(3px) } }
        @keyframes bt-heartL { 0%,100% { transform: rotate(-8deg) translateX(0) } 50% { transform: rotate(-4deg) translateX(4px) } }
        @keyframes bt-heartR { 0%,100% { transform: rotate(8deg) translateX(0) } 50% { transform: rotate(4deg) translateX(-4px) } }
        @keyframes bt-enter { from { opacity:0; transform: translateY(14px) scale(.98) } to { opacity:1; transform: translateY(0) scale(1) } }
      `}</style>

      <div
        key={i}
        className="relative w-[min(92vw,420px)] rounded-[28px] border-[2.5px] border-baddia-ink shadow-[6px_8px_0_hsl(260_16%_15%)] overflow-hidden"
        style={{ background: step.bg, animation: "bt-enter .35s ease-out both" }}
      >
        {/* floating stickers */}
        <span className="pointer-events-none absolute top-4 left-4 text-lg" style={{ animation: "bt-float 2.2s ease-in-out infinite alternate" }}>✨</span>
        <span className="pointer-events-none absolute top-8 right-6 text-base" style={{ animation: "bt-float 2.6s ease-in-out .3s infinite alternate" }}>💫</span>
        <span className="pointer-events-none absolute bottom-24 left-6 text-base" style={{ animation: "bt-float 2.4s ease-in-out .5s infinite alternate" }}>⭐</span>

        {/* skip */}
        <button
          onClick={finish}
          aria-label="Cerrar tutorial"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white border-2 border-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] flex items-center justify-center active:translate-y-0.5"
        >
          <X size={16} className="text-baddia-ink" />
        </button>

        {/* scene */}
        <div className="relative h-56 flex items-center justify-center">
          <Scene scene={step.scene} accent={step.accent} />
        </div>

        {/* content card */}
        <div className="relative mx-4 mb-4 rounded-2xl bg-white border-[2.5px] border-baddia-ink p-4 shadow-[3px_3px_0_hsl(260_16%_15%)]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{step.emoji}</span>
            <span
              className="inline-block px-2 py-0.5 rounded-full border border-baddia-ink text-[9px] font-display font-black uppercase tracking-widest text-white"
              style={{ background: step.accent }}
            >
              {step.chip}
            </span>
            <span className="ml-auto text-[10px] font-display font-black text-baddia-ink/60">
              {i + 1}/{STEPS.length}
            </span>
          </div>
          <h3 className="font-display font-black text-[19px] text-baddia-ink leading-tight">
            {step.title}
          </h3>
          <p className="mt-1.5 text-[13px] text-baddia-ink/70 font-semibold leading-snug">
            {step.desc}
          </p>

          {/* progress dots */}
          <div className="mt-3 flex items-center gap-1.5">
            {STEPS.map((_, idx) => (
              <span
                key={idx}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: idx === i ? 22 : 8,
                  background: idx <= i ? step.accent : "hsl(260 16% 15% / 0.15)",
                }}
              />
            ))}
          </div>

          {/* actions */}
          <div className="mt-4 flex items-center gap-2">
            {i > 0 && (
              <button
                onClick={() => setI(i - 1)}
                className="px-3 py-2 rounded-full border-2 border-baddia-ink bg-white text-[12px] font-display font-black text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-0.5"
              >
                atrás
              </button>
            )}
            {!isLast && (
              <button
                onClick={finish}
                className="ml-auto text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink/55"
              >
                saltar
              </button>
            )}
            <button
              onClick={() => (isLast ? finish() : setI(i + 1))}
              className={`${i > 0 && isLast ? "ml-auto" : ""} inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-baddia-ink text-white text-[13px] font-display font-black shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-0.5`}
              style={{ background: step.accent, marginLeft: isLast || i === 0 ? "auto" : undefined }}
            >
              {isLast ? (<>empezar <Sparkles size={14} /></>) : (<>siguiente <ArrowRight size={14} /></>)}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
