import { useEffect, useLayoutEffect, useState } from "react";
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
  accent: string;
  target?: string; // data-tour selector; if undefined -> centered welcome
  shape?: "rect" | "circle";
  padding?: number;
};

const STEPS: Step[] = [
  {
    emoji: "✨",
    chip: "bienvenida",
    title: "Baddia, tu bestie mística",
    desc: "Un tour cortito para que sepas todo lo que puedes hacer. Prometo que es cute 💖",
    accent: "#FF7AC8",
  },
  {
    emoji: "🌸",
    chip: "daily",
    title: "Tu Daily glow",
    desc: "Aquí ves tu frase del día, tu energía y tu racha. Es tu ritual de cada mañana.",
    accent: "#FF5EB3",
    target: "daily-hero",
    shape: "rect",
    padding: 10,
  },
  {
    emoji: "📓",
    chip: "diario",
    title: "Tu diario privado",
    desc: "Ponle contraseña y una pista secreta. Solo tú entras a leer y escribir.",
    accent: "#E38A2B",
    target: "journal-btn",
    shape: "rect",
    padding: 8,
  },
  {
    emoji: "🌙",
    chip: "manifestar",
    title: "Manifestar con voz guiada",
    desc: "Escribe tu frase, sube una foto y Baddia te acompaña con audio y racha propia.",
    accent: "#7A4CFF",
    target: "manifest-cta",
    shape: "rect",
    padding: 8,
  },
  {
    emoji: "🔮",
    chip: "lecturas ia",
    title: "Baddia lo lee todo",
    desc: "Toca la varita del centro: palma, tarot, aura, outfit, crush… tu energía leída al momento.",
    accent: "#FFB300",
    target: "fab",
    shape: "circle",
    padding: 10,
  },
  {
    emoji: "💘",
    chip: "love",
    title: "Todo sobre tu crush",
    desc: "Compatibilidad, red/green flags, la inicial de su nombre y si te va a escribir.",
    accent: "#FF3D8A",
    target: "tab-love",
    shape: "rect",
    padding: 6,
  },
  {
    emoji: "💖",
    chip: "yo",
    title: "Tu perfil, tu vibe",
    desc: "Foto polaroid, intereses, tono de Baddia y feedback para ganar tu insignia ✧ Stargirl.",
    accent: "#B85CFF",
    target: "tab-profile",
    shape: "rect",
    padding: 6,
  },
];

type Rect = { x: number; y: number; w: number; h: number };

function useTargetRect(target: string | undefined) {
  const [rect, setRect] = useState<Rect | null>(null);
  useLayoutEffect(() => {
    if (!target) { setRect(null); return; }
    let raf = 0;
    const measure = () => {
      const el = document.querySelector<HTMLElement>(`[data-tour="${target}"]`);
      if (!el) { setRect(null); return; }
      el.scrollIntoView({ block: "center", behavior: "smooth" });
      // wait a tick for scroll to settle
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        setRect({ x: r.left, y: r.top, w: r.width, h: r.height });
      });
    };
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    const t = setTimeout(measure, 380);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [target]);
  return rect;
}

export function BaddiaTutorial({ onClose }: { onClose: () => void }) {
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const isLast = i === STEPS.length - 1;
  const rect = useTargetRect(step.target);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const finish = () => { markTutorialSeen(); onClose(); };

  // Build spotlight geometry
  const pad = step.padding ?? 8;
  const vw = typeof window !== "undefined" ? window.innerWidth : 400;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  let spotlight: null | { cx: number; cy: number; rx: number; ry: number; radius: number } = null;
  if (rect) {
    const rx = rect.w / 2 + pad;
    const ry = rect.h / 2 + pad;
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    const radius = step.shape === "circle" ? Math.max(rx, ry) : Math.min(rx, ry) + 12;
    spotlight = { cx, cy, rx, ry, radius };
  }

  // Card position: below target if target is in top half, otherwise above
  const CARD_H_EST = 200;
  const CARD_W = Math.min(vw - 24, 360);
  let cardStyle: React.CSSProperties = {
    left: 12,
    right: 12,
    top: Math.max(24, (vh - CARD_H_EST) / 2),
    maxWidth: CARD_W,
    marginLeft: "auto",
    marginRight: "auto",
  };
  if (rect) {
    const below = rect.y + rect.h / 2 < vh / 2;
    const topPos = below
      ? Math.min(vh - CARD_H_EST - 16, rect.y + rect.h + pad + 22)
      : Math.max(16, rect.y - pad - 22 - CARD_H_EST);
    cardStyle = { left: 12, right: 12, top: topPos, maxWidth: CARD_W, marginLeft: "auto", marginRight: "auto" };
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      <style>{`
        @keyframes bt-pulseRing { 0%,100% { transform: scale(1); opacity:.8 } 50% { transform: scale(1.08); opacity:.35 } }
        @keyframes bt-enter { from { opacity:0; transform: translateY(8px) scale(.98) } to { opacity:1; transform: translateY(0) scale(1) } }
        @keyframes bt-float { from { transform: translateY(-3px) } to { transform: translateY(3px) } }
        @keyframes bt-sparkle { 0%,100% { transform: rotate(0) scale(1) } 50% { transform: rotate(180deg) scale(1.2) } }
      `}</style>

      {/* Dim overlay with cutout using SVG mask */}
      <svg
        width={vw}
        height={vh}
        className="absolute inset-0 pointer-events-auto"
        onClick={finish}
        style={{ cursor: "pointer" }}
      >
        <defs>
          <mask id="bt-mask">
            <rect x="0" y="0" width={vw} height={vh} fill="white" />
            {spotlight && (
              step.shape === "circle" ? (
                <circle cx={spotlight.cx} cy={spotlight.cy} r={spotlight.radius} fill="black" />
              ) : (
                <rect
                  x={spotlight.cx - spotlight.rx}
                  y={spotlight.cy - spotlight.ry}
                  width={spotlight.rx * 2}
                  height={spotlight.ry * 2}
                  rx={18}
                  ry={18}
                  fill="black"
                />
              )
            )}
          </mask>
        </defs>
        <rect x="0" y="0" width={vw} height={vh} fill="rgba(20,10,40,0.72)" mask="url(#bt-mask)" />
      </svg>

      {/* Animated ring around the spotlight */}
      {spotlight && (
        <>
          <div
            className="absolute pointer-events-none"
            style={{
              left: step.shape === "circle" ? spotlight.cx - spotlight.radius : spotlight.cx - spotlight.rx,
              top: step.shape === "circle" ? spotlight.cy - spotlight.radius : spotlight.cy - spotlight.ry,
              width: step.shape === "circle" ? spotlight.radius * 2 : spotlight.rx * 2,
              height: step.shape === "circle" ? spotlight.radius * 2 : spotlight.ry * 2,
              borderRadius: step.shape === "circle" ? "9999px" : 18,
              boxShadow: `0 0 0 3px ${step.accent}, 0 0 0 6px rgba(255,255,255,0.55), 0 0 24px 4px ${step.accent}88`,
              animation: "bt-pulseRing 1.6s ease-in-out infinite",
            }}
          />
          {/* cute sparkle badges */}
          <span
            className="absolute pointer-events-none text-xl"
            style={{
              left: (step.shape === "circle" ? spotlight.cx + spotlight.radius : spotlight.cx + spotlight.rx) - 10,
              top: (step.shape === "circle" ? spotlight.cy - spotlight.radius : spotlight.cy - spotlight.ry) - 14,
              color: step.accent,
              animation: "bt-sparkle 2.4s ease-in-out infinite",
              textShadow: "0 2px 6px rgba(0,0,0,0.35)",
            }}
          >✦</span>
          <span
            className="absolute pointer-events-none text-lg"
            style={{
              left: (step.shape === "circle" ? spotlight.cx - spotlight.radius : spotlight.cx - spotlight.rx) - 4,
              top: (step.shape === "circle" ? spotlight.cy + spotlight.radius : spotlight.cy + spotlight.ry) - 10,
              animation: "bt-float 2s ease-in-out infinite alternate",
            }}
          >💖</span>
        </>
      )}

      {/* Info card */}
      <div
        key={i}
        className="absolute pointer-events-auto rounded-3xl border-[2.5px] border-baddia-ink bg-white shadow-[6px_8px_0_hsl(260_16%_15%)] p-4"
        style={{ ...cardStyle, animation: "bt-enter .3s ease-out both" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={finish}
          aria-label="Cerrar tutorial"
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white border-2 border-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] flex items-center justify-center active:translate-y-0.5"
        >
          <X size={16} className="text-baddia-ink" />
        </button>

        <div className="flex items-center gap-2 mb-1.5">
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
        <h3 className="font-display font-black text-[18px] text-baddia-ink leading-tight">
          {step.title}
        </h3>
        <p className="mt-1.5 text-[13px] text-baddia-ink/70 font-semibold leading-snug">
          {step.desc}
        </p>

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

        <div className="mt-3 flex items-center gap-2">
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
              className="text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink/55"
            >
              saltar
            </button>
          )}
          <button
            onClick={() => (isLast ? finish() : setI(i + 1))}
            className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-baddia-ink text-white text-[13px] font-display font-black shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-0.5"
            style={{ background: step.accent }}
          >
            {isLast ? (<>empezar <Sparkles size={14} /></>) : (<>siguiente <ArrowRight size={14} /></>)}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
