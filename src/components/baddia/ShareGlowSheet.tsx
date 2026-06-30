import { useState, useRef } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { computeDailyVibe } from "@/lib/baddia-daily";
import { toast } from "@/hooks/use-toast";
import { X, Copy, Share2, Download } from "lucide-react";
import { toPng } from "html-to-image";

interface AuraData {
  headline?: string;
  auraColor?: string;
  vibe?: string;
  score?: number;
  chakra?: string;
  energy?: string;
  advice?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  /** If provided, shares only this quote instead of the full glow card. */
  quote?: string;
  /** If provided, shares an aura reading card. */
  aura?: AuraData;
}

type Theme = {
  id: string;
  name: string;
  emoji: string;
  bg: string;
  ink: string;
  sub: string;
  chipBg: string;
  chipInk: string;
  accent: string;
  cardBg: string;
  cardInk: string;
  cardBorder: string;
  deco?: "stars" | "hearts" | "sparkles" | "flowers" | "butterflies" | "none";
  font?: "display" | "serif";
};

const THEMES: Theme[] = [
  {
    id: "sunset",
    name: "Sunset",
    emoji: "🌅",
    bg: "linear-gradient(160deg,#FFD3A5 0%,#FD6585 55%,#A855F7 100%)",
    ink: "#1a1024",
    sub: "rgba(26,16,36,0.7)",
    chipBg: "#1a1024",
    chipInk: "#FFD3A5",
    accent: "#FFE66D",
    cardBg: "rgba(255,255,255,0.92)",
    cardInk: "#1a1024",
    cardBorder: "#1a1024",
    deco: "sparkles",
  },
  {
    id: "bubble",
    name: "Bubblegum",
    emoji: "🫧",
    bg: "linear-gradient(160deg,#FFC6E0 0%,#FFB6E1 40%,#C7A8FF 100%)",
    ink: "#3a0f3a",
    sub: "rgba(58,15,58,0.7)",
    chipBg: "#3a0f3a",
    chipInk: "#FFC6E0",
    accent: "#FFE66D",
    cardBg: "#FFFFFF",
    cardInk: "#3a0f3a",
    cardBorder: "#3a0f3a",
    deco: "hearts",
  },
  {
    id: "noir",
    name: "Y2K Noir",
    emoji: "✦",
    bg: "linear-gradient(160deg,#0E0B1E 0%,#1B0B2E 50%,#2D0F3A 100%)",
    ink: "#FFE8F4",
    sub: "rgba(255,232,244,0.7)",
    chipBg: "#FF3DA5",
    chipInk: "#FFFFFF",
    accent: "#7BF1FF",
    cardBg: "rgba(255,255,255,0.08)",
    cardInk: "#FFE8F4",
    cardBorder: "#FF3DA5",
    deco: "stars",
  },
  {
    id: "matcha",
    name: "Matcha",
    emoji: "🍵",
    bg: "linear-gradient(160deg,#E7F0C9 0%,#BFD89B 60%,#8DB46B 100%)",
    ink: "#1E2E15",
    sub: "rgba(30,46,21,0.65)",
    chipBg: "#1E2E15",
    chipInk: "#E7F0C9",
    accent: "#FFE66D",
    cardBg: "#FFFCEC",
    cardInk: "#1E2E15",
    cardBorder: "#1E2E15",
    deco: "flowers",
  },
  {
    id: "cream",
    name: "Coquette",
    emoji: "🎀",
    bg: "linear-gradient(160deg,#FFF6EF 0%,#FFE5EC 50%,#FFC9D9 100%)",
    ink: "#5A1E36",
    sub: "rgba(90,30,54,0.7)",
    chipBg: "#5A1E36",
    chipInk: "#FFE5EC",
    accent: "#FF6FA8",
    cardBg: "#FFFFFF",
    cardInk: "#5A1E36",
    cardBorder: "#5A1E36",
    deco: "hearts",
    font: "serif",
  },
  {
    id: "ocean",
    name: "Ocean",
    emoji: "🌊",
    bg: "linear-gradient(160deg,#A8E6FF 0%,#7BB7FF 50%,#5C5FE0 100%)",
    ink: "#0B1F4D",
    sub: "rgba(11,31,77,0.7)",
    chipBg: "#0B1F4D",
    chipInk: "#A8E6FF",
    accent: "#FFE66D",
    cardBg: "#FFFFFF",
    cardInk: "#0B1F4D",
    cardBorder: "#0B1F4D",
    deco: "sparkles",
  },
  {
    id: "butterfly",
    name: "Mariposa",
    emoji: "🦋",
    bg: "linear-gradient(160deg,#E0C3FC 0%,#8EC5FC 100%)",
    ink: "#2A1454",
    sub: "rgba(42,20,84,0.7)",
    chipBg: "#2A1454",
    chipInk: "#E0C3FC",
    accent: "#FF6FA8",
    cardBg: "#FFFFFF",
    cardInk: "#2A1454",
    cardBorder: "#2A1454",
    deco: "butterflies",
  },
  {
    id: "fire",
    name: "Hot Girl",
    emoji: "🔥",
    bg: "linear-gradient(160deg,#FF4D6D 0%,#FF0F7B 50%,#7A0BC0 100%)",
    ink: "#FFFFFF",
    sub: "rgba(255,255,255,0.85)",
    chipBg: "#FFE66D",
    chipInk: "#1a1024",
    accent: "#FFE66D",
    cardBg: "rgba(255,255,255,0.95)",
    cardInk: "#3a0f3a",
    cardBorder: "#1a1024",
    deco: "sparkles",
  },
];

function Deco({ kind }: { kind: Theme["deco"] }) {
  if (!kind || kind === "none") return null;
  const items: { c: string; top: string; left?: string; right?: string; size: string; delay: string; rot?: string }[] = [
    { c: "", top: "8%", left: "8%", size: "22px", delay: "0s", rot: "-8deg" },
    { c: "", top: "18%", right: "10%", size: "16px", delay: "0.4s", rot: "12deg" },
    { c: "", top: "44%", left: "6%", size: "14px", delay: "0.8s" },
    { c: "", top: "62%", right: "8%", size: "20px", delay: "1.1s", rot: "-6deg" },
    { c: "", top: "78%", left: "14%", size: "12px", delay: "1.4s" },
    { c: "", top: "30%", right: "18%", size: "10px", delay: "1.7s" },
  ];
  const glyph =
    kind === "stars" ? "✦" :
    kind === "hearts" ? "♡" :
    kind === "flowers" ? "✿" :
    kind === "butterflies" ? "🦋" :
    "✧";
  return (
    <>
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute pointer-events-none select-none animate-twinkle opacity-90"
          style={{
            top: it.top,
            left: it.left,
            right: it.right,
            fontSize: it.size,
            transform: `rotate(${it.rot || "0deg"})`,
            animationDelay: it.delay,
          }}
        >
          {glyph}
        </span>
      ))}
    </>
  );
}

export function ShareGlowSheet({ open, onClose, quote, aura }: Props) {
  const { user } = useBaddia();
  const vibe = computeDailyVibe(user);
  const [copied, setCopied] = useState(false);
  const [themeId, setThemeId] = useState<string>(THEMES[0].id);
  const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
  const cardRef = useRef<HTMLDivElement>(null);

  if (!open) return null;

  const scorePct = vibe.glowScore / 100;
  const dash = 314;
  const quoteMode = !!quote && !aura;
  const auraMode = !!aura;

  const shareText = auraMode
    ? `✨ Mi aura hoy en Baddia\n${aura!.auraColor || "Aura"} · ${aura!.headline || ""}\nBrillo ${aura!.score ?? "—"}/100 · Chakra ${aura!.chakra || "—"}\n${aura!.advice || ""} 💖`
    : quoteMode
      ? `"${quote}" ✨\n— Baddia`
      : `✨ Mi energía de hoy en Baddia\nGlow ${vibe.glowScore}/100 · ${vibe.color.name} · Lucky #${vibe.luckyNumber}\n"${vibe.advice}" 💖`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({ title: "Copiado ✨", description: "Pégalo donde quieras compartirlo." });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({ title: "Ups", description: "No pudimos copiar tu glow." });
    }
  };

  const handleNativeShare = async () => {
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title: "Mi energía Baddia", text: shareText });
      } else {
        handleCopy();
      }
    } catch {
      /* user cancelled */
    }
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `baddia-${auraMode ? "aura" : "glow"}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast({ title: "Guardado ✨", description: "La imagen se descargó para que la compartas." });
    } catch {
      toast({ title: "Ups", description: "No pudimos generar la imagen." });
    }
  };

  const handleShareImage = async () => {
    if (!cardRef.current) return handleNativeShare();
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `baddia-${auraMode ? "aura" : "glow"}.png`, { type: "image/png" });
      if (typeof navigator !== "undefined" && (navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
        await (navigator as any).share({ files: [file], title: "Mi energía Baddia", text: shareText });
      } else {
        await handleDownloadImage();
      }
    } catch {
      handleNativeShare();
    }
  };

  const fontClass = theme.font === "serif" ? "font-serif-display" : "font-display";

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end md:items-center justify-center bg-baddia-ink/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-[420px] bg-baddia-soft rounded-t-[2.5rem] md:rounded-[2.5rem] max-h-[94vh] overflow-y-auto scrollbar-hide animate-scale-in relative border-t-[3px] md:border-[3px] border-baddia-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 pt-5 pb-3 bg-baddia-soft/95 backdrop-blur-md">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-display font-bold text-baddia-ink/60">
              Compartir
            </p>
            <h2 className="font-display font-bold text-[20px] text-baddia-ink leading-tight">
              {auraMode ? "Tu aura card ✨" : quoteMode ? "Tu frase del día ✨" : "Tu glow card ✨"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-9 h-9 rounded-full bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-none transition"
          >
            <X size={16} className="text-baddia-ink" />
          </button>
        </div>

        {/* Theme picker */}
        <div className="px-5 pb-3">
          <p className="text-[10px] uppercase tracking-widest font-display font-bold text-baddia-ink/60 mb-2">
            🎨 Elige tu vibe
          </p>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1">
            {THEMES.map((t) => {
              const active = t.id === themeId;
              return (
                <button
                  key={t.id}
                  onClick={() => setThemeId(t.id)}
                  className={`shrink-0 rounded-2xl px-1 pt-1 pb-1.5 border-2 transition active:translate-y-[1px] ${
                    active
                      ? "border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] -translate-y-[1px]"
                      : "border-baddia-ink/30"
                  }`}
                  style={{ background: active ? "#FFF" : "rgba(255,255,255,0.5)" }}
                  aria-pressed={active}
                >
                  <div
                    className="w-14 h-14 rounded-xl border-2 border-baddia-ink/80 flex items-center justify-center text-lg overflow-hidden"
                    style={{ background: t.bg }}
                  >
                    <span className="drop-shadow-[1px_1px_0_rgba(0,0,0,0.25)]">{t.emoji}</span>
                  </div>
                  <p className="mt-1 text-[9px] font-display font-bold text-center text-baddia-ink uppercase tracking-wider">
                    {t.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Story card preview (9:16) */}
        <div className="px-5 pb-4">
          <div
            key={themeId}
            id="baddia-share-card"
            ref={cardRef}
            className="relative mx-auto rounded-[28px] overflow-hidden border-[3px] shadow-[6px_8px_0_hsl(260_16%_15%)] animate-scale-in"
            style={{
              aspectRatio: "9 / 16",
              maxWidth: "300px",
              background: theme.bg,
              borderColor: theme.id === "noir" ? "#FF3DA5" : "#1a1024",
              color: theme.ink,
            }}
          >
            <Deco kind={theme.deco} />
            <div className="absolute -top-10 -left-8 w-40 h-40 rounded-full opacity-30 blur-2xl pointer-events-none" style={{ background: theme.accent }} />
            <div className="absolute -bottom-12 -right-10 w-44 h-44 rounded-full opacity-25 blur-2xl pointer-events-none" style={{ background: theme.chipBg }} />

            <div className="relative h-full flex flex-col justify-between p-5">
              {/* top */}
              <div className="flex items-start justify-between">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
                  style={{ background: theme.chipBg, color: theme.chipInk }}
                >
                  ✦ Baddia
                </span>
                <span
                  className="inline-block rounded-full border-2 px-2.5 py-1 text-[9px] font-display font-bold shadow-[2px_2px_0_rgba(0,0,0,0.25)] -rotate-3"
                  style={{ background: theme.cardBg, color: theme.cardInk, borderColor: theme.cardBorder }}
                >
                  {user.sign || "tu signo"}
                </span>
              </div>

              {auraMode ? (
                <div className="flex-1 flex flex-col justify-center gap-3 px-1 -mt-2">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-display font-bold mb-1" style={{ color: theme.sub }}>
                      mi aura de hoy
                    </p>
                    <p className={`${fontClass} font-black text-[32px] leading-tight`} style={{ color: theme.ink }}>
                      {aura!.auraColor}
                    </p>
                    <p className={`${fontClass} font-bold text-[14px] mt-1 leading-tight`} style={{ color: theme.ink }}>
                      {aura!.headline}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className="rounded-2xl border-2 p-2 shadow-[2px_2px_0_rgba(0,0,0,0.25)]"
                      style={{ background: theme.cardBg, borderColor: theme.cardBorder, color: theme.cardInk }}
                    >
                      <p className="text-[8px] uppercase font-display font-bold tracking-wider opacity-70">brillo</p>
                      <p className={`${fontClass} font-black text-[26px] leading-none`}>
                        {aura!.score ?? "—"}<span className="text-[12px]">/100</span>
                      </p>
                    </div>
                    <div
                      className="rounded-2xl border-2 p-2 shadow-[2px_2px_0_rgba(0,0,0,0.25)] flex flex-col justify-center"
                      style={{ background: theme.accent, borderColor: theme.cardBorder, color: "#1a1024" }}
                    >
                      <p className="text-[8px] uppercase font-display font-bold tracking-wider opacity-70">chakra</p>
                      <p className={`${fontClass} font-black text-[14px] leading-tight capitalize`}>
                        {aura!.chakra || "—"}
                      </p>
                    </div>
                  </div>

                  {aura!.energy && (
                    <div
                      className="relative rounded-2xl border-[2.5px] px-3 py-2.5 shadow-[3px_3px_0_rgba(0,0,0,0.25)] -rotate-1"
                      style={{ background: theme.cardBg, borderColor: theme.cardBorder, color: theme.cardInk }}
                    >
                      <p className="text-[9px] uppercase tracking-widest font-display font-bold mb-0.5" style={{ color: theme.chipBg }}>
                        ✦ energía
                      </p>
                      <p className={`${fontClass} font-bold text-[12px] leading-snug`}>
                        {aura!.energy}
                      </p>
                    </div>
                  )}

                  {aura!.advice && (
                    <div
                      className="relative rounded-2xl border-[2.5px] px-3 py-2.5 shadow-[3px_3px_0_rgba(0,0,0,0.25)] rotate-1"
                      style={{ background: theme.cardBg, borderColor: theme.cardBorder, color: theme.cardInk }}
                    >
                      <p className="text-[9px] uppercase tracking-widest font-display font-bold mb-0.5" style={{ color: theme.chipBg }}>
                        ✦ consejo
                      </p>
                      <p className={`${fontClass} font-bold text-[12px] leading-snug`}>
                        "{aura!.advice}"
                      </p>
                    </div>
                  )}
                </div>
              ) : quoteMode ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
                  <span className={`${fontClass} text-[64px] leading-none -mb-2 select-none`} style={{ color: theme.accent }}>"</span>
                  <p className={`${fontClass} font-black text-[22px] leading-[1.15]`} style={{ color: theme.ink }}>
                    {quote}
                  </p>
                  <span
                    className="mt-3 inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-1 text-[9px] font-display font-bold shadow-[2px_2px_0_rgba(0,0,0,0.25)] -rotate-2 uppercase tracking-widest"
                    style={{ background: theme.accent, color: "#1a1024", borderColor: theme.cardBorder }}
                  >
                    ✦ frase del día
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center text-center -mt-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-display font-bold mb-1" style={{ color: theme.sub }}>
                      mi glow de hoy
                    </p>
                    <div className="relative">
                      <svg width="140" height="140" viewBox="0 0 120 120" className="-rotate-90">
                        <circle cx="60" cy="60" r="50" stroke={theme.cardBg} strokeOpacity="0.4" strokeWidth="12" fill="none" />
                        <circle
                          cx="60" cy="60" r="50"
                          stroke={theme.accent} strokeWidth="12" fill="none" strokeLinecap="round"
                          strokeDasharray={dash}
                          strokeDashoffset={dash - dash * scorePct}
                          style={{ filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.2))" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`${fontClass} font-black text-[44px] leading-none`} style={{ color: theme.ink }}>
                          {vibe.glowScore}
                        </span>
                        <span
                          className="mt-1 inline-flex items-center gap-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.14em] px-2 py-[2px]"
                          style={{ background: theme.chipBg, color: theme.chipInk }}
                        >
                          <span style={{ color: theme.accent }}>✦</span> /100
                        </span>
                      </div>
                    </div>
                    <p className={`${fontClass} font-bold text-[16px] mt-2 leading-tight`} style={{ color: theme.ink }}>
                      {vibe.glowLabel}
                    </p>
                  </div>

                  <div
                    className="relative rounded-2xl border-[2.5px] px-3 py-2.5 shadow-[3px_3px_0_rgba(0,0,0,0.25)] -rotate-1"
                    style={{ background: theme.cardBg, borderColor: theme.cardBorder, color: theme.cardInk }}
                  >
                    <p className="text-[9px] uppercase tracking-widest font-display font-bold mb-0.5" style={{ color: theme.chipBg }}>
                      ✦ mood del día
                    </p>
                    <p className={`${fontClass} font-bold text-[12px] leading-snug`}>
                      "{vibe.advice}"
                    </p>
                  </div>

                  <div className="flex items-stretch gap-2">
                    <div
                      className="flex-1 rounded-2xl border-2 p-2 shadow-[2px_2px_0_rgba(0,0,0,0.25)]"
                      style={{ background: theme.cardBg, borderColor: theme.cardBorder, color: theme.cardInk }}
                    >
                      <p className="text-[8px] uppercase font-display font-bold tracking-wider opacity-70">color</p>
                      <div
                        className="my-1 h-5 rounded-md border"
                        style={{ background: `linear-gradient(135deg, ${vibe.color.from}, ${vibe.color.to})`, borderColor: theme.cardBorder }}
                      />
                      <p className="font-display font-bold text-[10px] leading-tight truncate">{vibe.color.name}</p>
                    </div>
                    <div
                      className="w-[72px] rounded-2xl border-2 p-2 shadow-[2px_2px_0_rgba(0,0,0,0.25)] flex flex-col items-center justify-center"
                      style={{ background: theme.accent, borderColor: theme.cardBorder, color: "#1a1024" }}
                    >
                      <p className="text-[8px] uppercase font-display font-bold tracking-wider opacity-70">lucky</p>
                      <p className={`${fontClass} font-black text-[26px] leading-none`}>
                        {vibe.luckyNumber}
                      </p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-center pt-1">
                <span className="text-[9px] font-display font-bold uppercase tracking-[0.22em]" style={{ color: theme.sub }}>
                  baddia.app · {user.name || "babe"}
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-baddia-ink/70 font-display font-bold mt-3">
            Toma una captura y súbela a tus historias ✨
          </p>
        </div>

        {/* Share actions */}
        <div className="px-5 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleShareImage}
              className="relative py-3 rounded-2xl border-[2.5px] border-baddia-ink shadow-[3px_4px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[2px_2px_0_hsl(260_16%_15%)] transition flex items-center justify-center gap-2 text-white font-display font-bold text-sm"
              style={{ background: "linear-gradient(135deg,#feda75,#fa7e1e 30%,#d62976 60%,#962fbf 85%,#4f5bd5)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              Instagram
            </button>
            <button
              onClick={handleDownloadImage}
              className="py-3 rounded-2xl border-[2.5px] border-baddia-ink shadow-[3px_4px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[2px_2px_0_hsl(260_16%_15%)] transition flex items-center justify-center gap-2 bg-baddia-lavender text-baddia-ink font-display font-bold text-sm"
            >
              <Download size={18} /> Guardar
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="py-3 rounded-2xl border-[2.5px] border-baddia-ink shadow-[3px_4px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[2px_2px_0_hsl(260_16%_15%)] transition flex items-center justify-center gap-2 bg-white text-baddia-ink font-display font-bold text-sm"
            >
              <Copy size={14} /> {copied ? "Copiado" : "Copiar"}
            </button>
            <button
              onClick={handleNativeShare}
              className="py-3 rounded-2xl border-[2.5px] border-baddia-ink shadow-[3px_4px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[2px_2px_0_hsl(260_16%_15%)] transition flex items-center justify-center gap-2 bg-baddia-ink text-white font-display font-bold text-sm"
            >
              <Share2 size={14} /> Más opciones
            </button>
          </div>

          <p className="text-center text-[10px] text-baddia-ink/55 font-semibold pt-1 leading-relaxed">
            Hecho con cariño para inspirarte 💖 confía siempre en tu intuición.
          </p>
        </div>
      </div>
    </div>
  );
}
