import { useRef, useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { computeDailyVibe } from "@/lib/baddia-daily";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import {
  Camera, Upload, Sparkles, RotateCcw, Shirt, Palette, Wand2,
  Share2, ArrowLeft, Sun, Eye, X, Download, Heart,
} from "lucide-react";

type OutfitReading = {
  headline: string;
  vibe: string;
  colors: string[];
  style: string;
  energy: string;
  matchToday: string;
  improvements: string[];
};

const MOCK_READINGS: OutfitReading[] = [
  {
    headline: "Tu outfit de hoy vibra en energía magnética.",
    vibe: "magnética",
    colors: ["rosa empolvado", "blanco hueso", "dorado suave"],
    style: "baddie casual",
    energy: "Proyectas calma con un toque de poder. Hoy las miradas te buscan sin que lo notes.",
    matchToday: "Combina perfecto con el color de hoy: suma un detalle y multiplicas tu aura.",
    improvements: [
      "Suma un accesorio dorado pequeño para reforzar tu glow.",
      "Un labial mate eleva todo el look al instante.",
      "Recoge el cabello a un lado para un toque editorial.",
    ],
  },
  {
    headline: "Energía soft girl con un guiño rebelde.",
    vibe: "soft",
    colors: ["lila", "crema", "negro"],
    style: "streetwear soft",
    energy: "Tu vibra dice 'cercana pero inalcanzable'. Hoy atraes conversaciones bonitas.",
    matchToday: "El color del día le da chispa a tu outfit, úsalo como acento.",
    improvements: [
      "Cambia los tenis por unos blancos limpios.",
      "Un clip de perlas en el cabello suma magia.",
      "Capas finas en lugar de un abrigo grueso.",
    ],
  },
  {
    headline: "Tu look hoy grita confianza silenciosa.",
    vibe: "powerful",
    colors: ["negro", "plateado", "blanco"],
    style: "old money",
    energy: "Hoy proyectas seguridad sin esfuerzo. Las decisiones te salen claras.",
    matchToday: "Tu paleta es neutra: el color de hoy suma como detalle estrella.",
    improvements: [
      "Sube una manga para mostrar reloj o pulsera.",
      "Cinturón delgado para marcar silueta.",
      "Un toque de gloss y listo, energía CEO.",
    ],
  },
];

const TIPS = [
  { icon: Shirt, text: "Outfit completo" },
  { icon: Sun, text: "Usa buena luz" },
  { icon: Eye, text: "Sin filtros raros" },
  { icon: Camera, text: "Mirror selfie ok" },
];

const STICKER_POS = [
  "absolute top-3 left-3 -rotate-6 bg-baddia-hot text-white",
  "absolute top-10 right-3 rotate-[4deg] bg-baddia-purple text-white",
  "absolute bottom-20 right-5 -rotate-3 bg-white text-baddia-ink",
  "absolute bottom-24 left-5 rotate-[8deg] bg-baddia-yellow text-baddia-ink",
];

/* ===== AESTHETIC THEMES for share card ===== */
type Theme = {
  id: string;
  name: string;
  emoji: string;
  swatch: string[];
  bg: string;            // background of full card
  frame: string;         // photo frame color
  caption: string;       // caption block bg
  textColor: string;
  font: "display" | "serif";
  filter: string;        // CSS filter for photo
  decor: "polaroid" | "hearts" | "stars" | "flowers" | "butterfly" | "ribbon" | "tape" | "noir";
};

const THEMES: Theme[] = [
  {
    id: "polaroid",
    name: "Polaroid",
    emoji: "📸",
    swatch: ["#FFFFFF", "#F5F0E6", "#24202B"],
    bg: "#F5F0E6",
    frame: "#FFFFFF",
    caption: "#FFFFFF",
    textColor: "#24202B",
    font: "serif",
    filter: "saturate(0.9) contrast(1.05)",
    decor: "polaroid",
  },
  {
    id: "y2k",
    name: "Y2K Noir",
    emoji: "💿",
    swatch: ["#0B0B14", "#FF2E75", "#8B63F7"],
    bg: "#0B0B14",
    frame: "#FF2E75",
    caption: "#15101F",
    textColor: "#FFFFFF",
    font: "display",
    filter: "saturate(1.2) contrast(1.1) hue-rotate(-6deg)",
    decor: "stars",
  },
  {
    id: "coquette",
    name: "Coquette",
    emoji: "🎀",
    swatch: ["#FFE9F0", "#F7C8D8", "#D14A78"],
    bg: "#FFE9F0",
    frame: "#FFFFFF",
    caption: "#FFF7FB",
    textColor: "#5A2440",
    font: "serif",
    filter: "saturate(0.95) brightness(1.04)",
    decor: "ribbon",
  },
  {
    id: "bubblegum",
    name: "Bubblegum",
    emoji: "🩷",
    swatch: ["#FF7AC8", "#FFD1E6", "#FFFFFF"],
    bg: "linear-gradient(160deg,#FF7AC8 0%,#FFD1E6 100%)",
    frame: "#FFFFFF",
    caption: "#FFFFFF",
    textColor: "#24202B",
    font: "display",
    filter: "saturate(1.15)",
    decor: "hearts",
  },
  {
    id: "matcha",
    name: "Matcha",
    emoji: "🍵",
    swatch: ["#D8E8C9", "#7BA86A", "#FFFFFF"],
    bg: "linear-gradient(160deg,#E5EFD6 0%,#C7DCB1 100%)",
    frame: "#FFFFFF",
    caption: "#FFFFFF",
    textColor: "#2F3E27",
    font: "serif",
    filter: "saturate(0.95)",
    decor: "flowers",
  },
  {
    id: "sunset",
    name: "Sunset",
    emoji: "🌅",
    swatch: ["#FFB36B", "#FF6E8A", "#8B4FC9"],
    bg: "linear-gradient(160deg,#FFB36B 0%,#FF6E8A 55%,#8B4FC9 100%)",
    frame: "#FFFFFF",
    caption: "rgba(255,255,255,0.92)",
    textColor: "#24202B",
    font: "display",
    filter: "saturate(1.1) brightness(1.05)",
    decor: "stars",
  },
  {
    id: "mariposa",
    name: "Mariposa",
    emoji: "🦋",
    swatch: ["#C9B6FF", "#A6D8FF", "#FFFFFF"],
    bg: "linear-gradient(160deg,#C9B6FF 0%,#A6D8FF 100%)",
    frame: "#FFFFFF",
    caption: "#FFFFFF",
    textColor: "#24202B",
    font: "display",
    filter: "saturate(1.05) hue-rotate(4deg)",
    decor: "butterfly",
  },
  {
    id: "hotgirl",
    name: "Hot Girl",
    emoji: "🔥",
    swatch: ["#FF2E75", "#24202B", "#FFD12E"],
    bg: "linear-gradient(160deg,#FF2E75 0%,#8B1B45 100%)",
    frame: "#FFD12E",
    caption: "#24202B",
    textColor: "#FFFFFF",
    font: "display",
    filter: "saturate(1.2) contrast(1.1)",
    decor: "tape",
  },
];

function Deco({ theme }: { theme: Theme }) {
  switch (theme.decor) {
    case "hearts":
      return (
        <>
          <span className="absolute top-3 right-3 text-2xl rotate-12">💗</span>
          <span className="absolute bottom-3 left-3 text-xl -rotate-12">💖</span>
          <span className="absolute top-1/2 left-2 text-base">✿</span>
        </>
      );
    case "stars":
      return (
        <>
          <span className="absolute top-3 right-3 text-xl" style={{ color: theme.frame }}>✦</span>
          <span className="absolute bottom-4 left-4 text-sm" style={{ color: theme.frame }}>✧</span>
          <span className="absolute top-1/3 left-3 text-xs" style={{ color: theme.frame }}>✦</span>
        </>
      );
    case "flowers":
      return (
        <>
          <span className="absolute top-3 right-3 text-2xl">🌸</span>
          <span className="absolute bottom-3 left-3 text-xl">🌿</span>
        </>
      );
    case "butterfly":
      return (
        <>
          <span className="absolute top-3 right-3 text-2xl">🦋</span>
          <span className="absolute bottom-4 left-4 text-lg -rotate-12">🦋</span>
        </>
      );
    case "ribbon":
      return (
        <>
          <span className="absolute top-2 left-3 text-2xl -rotate-12">🎀</span>
          <span className="absolute bottom-3 right-3 text-base">♡</span>
        </>
      );
    case "tape":
      return (
        <>
          <span
            className="absolute -top-2 left-6 w-16 h-5 rotate-[-8deg] opacity-90"
            style={{ background: "rgba(255,209,46,0.85)", border: "1.5px dashed rgba(36,32,43,0.5)" }}
          />
          <span
            className="absolute -top-2 right-6 w-14 h-5 rotate-[6deg] opacity-90"
            style={{ background: "rgba(255,209,46,0.85)", border: "1.5px dashed rgba(36,32,43,0.5)" }}
          />
        </>
      );
    case "noir":
      return <span className="absolute top-3 right-3 text-xl text-baddia-hot">✦</span>;
    case "polaroid":
    default:
      return null;
  }
}

function ShareCardArt({
  theme, photo, headline, vibe, style, colors, userName,
}: {
  theme: Theme; photo: string; headline: string; vibe: string;
  style: string; colors: string[]; userName: string;
}) {
  const fontClass = theme.font === "serif" ? "font-serif-display" : "font-display";
  const isPolaroid = theme.decor === "polaroid";

  return (
    <div
      className="relative w-[340px] overflow-hidden"
      style={{
        background: theme.bg,
        borderRadius: 28,
        border: "3px solid #24202B",
        boxShadow: "8px 10px 0 rgb(36,32,43)",
      }}
    >
      {/* photo block */}
      <div className="relative p-5 pb-3 flex justify-center">
        <div
          className="relative"
          style={{
            background: theme.frame,
            padding: isPolaroid ? "12px 12px 56px 12px" : "10px",
            border: "2.5px solid #24202B",
            borderRadius: isPolaroid ? 6 : 18,
            boxShadow: "4px 5px 0 rgb(36,32,43)",
            transform: isPolaroid ? "rotate(-2deg)" : "rotate(0)",
          }}
        >
          <div
            style={{
              width: 250,
              height: 290,
              overflow: "hidden",
              borderRadius: isPolaroid ? 2 : 12,
            }}
          >
            <img
              src={photo}
              alt="outfit"
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                filter: theme.filter,
              }}
            />
          </div>
          {isPolaroid && (
            <p
              className="font-serif-display italic absolute left-0 right-0 bottom-2 text-center"
              style={{ color: "#24202B", fontSize: 13 }}
            >
              {userName} · outfit ✦
            </p>
          )}
          <Deco theme={theme} />
        </div>
      </div>

      {/* caption */}
      <div
        className="mx-5 mb-5 p-4"
        style={{
          background: theme.caption,
          border: "2.5px solid #24202B",
          borderRadius: 18,
          boxShadow: "3px 4px 0 rgb(36,32,43)",
        }}
      >
        <p
          className={`${fontClass} italic font-black leading-tight`}
          style={{ color: theme.textColor, fontSize: 18 }}
        >
          "{headline}"
        </p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          <span
            className="inline-flex px-2 py-0.5 text-[9px] font-display font-black uppercase tracking-widest"
            style={{ background: "#24202B", color: "#fff", borderRadius: 999 }}
          >
            Vibe · {vibe}
          </span>
          <span
            className="inline-flex px-2 py-0.5 text-[9px] font-display font-black uppercase tracking-widest"
            style={{
              background: theme.frame, color: theme.textColor,
              borderRadius: 999, border: "1.5px solid #24202B",
            }}
          >
            {style}
          </span>
        </div>
        <p
          className="mt-2 text-[10px] font-semibold"
          style={{ color: theme.textColor, opacity: 0.7 }}
        >
          {colors.slice(0, 3).join(" · ")}
        </p>
        <div className="flex items-center justify-between mt-3">
          <span
            className="font-display font-black text-[10px] uppercase tracking-widest"
            style={{ color: theme.textColor, opacity: 0.55 }}
          >
            baddia.app
          </span>
          <span style={{ color: theme.textColor, fontSize: 14 }}>✦</span>
        </div>
      </div>
    </div>
  );
}

export function Outfit() {
  const { user, go } = useBaddia();
  const vibe = computeDailyVibe(user);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<OutfitReading | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [themeId, setThemeId] = useState<string>(THEMES[0].id);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];

  const reset = () => {
    setPreview(null);
    setReading(null);
    setLoading(false);
    setShowShareCard(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onPick = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Sube una imagen 📸");
      return;
    }
    setReading(null);
    setLoading(true);
    setPreview(URL.createObjectURL(file));
    // Mock reading — sin IA, valores de ejemplo
    setTimeout(() => {
      const pick = MOCK_READINGS[Math.floor(Math.random() * MOCK_READINGS.length)];
      const personalized = {
        ...pick,
        matchToday: `Combina perfecto con el color de hoy (${vibe.color.name}). ` +
          `Suma un detalle de ese tono y multiplicas tu aura ✨`,
      };
      setReading(personalized);
      setLoading(false);
    }, 900);
  };

  const captureAndShare = async () => {
    if (!shareCardRef.current || !reading) return;
    setIsCapturing(true);
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#FFF7FB",
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "baddia-outfit.png", { type: "image/png" });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Mi outfit hoy ✨",
          text: reading.headline,
        });
      } else {
        const link = document.createElement("a");
        link.download = "baddia-outfit.png";
        link.href = dataUrl;
        link.click();
        toast.success("Card descargada ✨");
      }
    } catch (e) {
      console.error(e);
      toast.error("No se pudo generar la card");
    } finally {
      setIsCapturing(false);
    }
  };

  const handleShare = () => setShowShareCard(true);

  return (
    <div className="relative min-h-full gradient-bg-soft pb-6 overflow-hidden">
      <div className="pointer-events-none absolute -top-10 -right-10 w-64 h-64 rounded-full bg-baddia-hot/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-32 -left-10 w-64 h-64 rounded-full bg-baddia-purple/20 blur-3xl" />

      <header className="relative z-10 px-5 pt-6 pb-4">
        <button
          onClick={() => go("daily")}
          className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 bg-white border-2 border-baddia-ink rounded-full shadow-[2px_2px_0_hsl(260_16%_15%)] text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink active:translate-y-0.5 transition-all"
        >
          <ArrowLeft size={12} strokeWidth={3} /> Volver
        </button>
        <span className="inline-block px-3 py-1 bg-baddia-yellow border-[2.5px] border-baddia-ink rounded-full shadow-[3px_3px_0_hsl(260_16%_15%)] text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink">
          👗 Análisis de outfit
        </span>
        <h1 className="font-display font-black italic text-[44px] leading-[0.95] tracking-tight text-baddia-ink mt-3">
          Outfit<br />Check
        </h1>
        <p className="text-[15px] font-medium italic text-baddia-ink/70 mt-2">
          Sube tu look y léelo en modo aesthetic ✨
        </p>

        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white border-2 border-baddia-ink rounded-full shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-1">
          <span
            className="w-4 h-4 rounded-full border-2 border-baddia-ink"
            style={{ background: `linear-gradient(135deg, ${vibe.color.from}, ${vibe.color.to})` }}
          />
          <span className="text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink">
            Color de hoy · {vibe.color.name}
          </span>
        </div>
      </header>

      <div className="relative z-10 px-5 space-y-5">
        {!reading && !preview && (
          <div className="relative w-full aspect-[4/5] bg-white border-[2.5px] border-baddia-ink rounded-3xl shadow-[6px_8px_0_hsl(260_16%_15%)] overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "radial-gradient(hsl(260 16% 15%) 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-60">
              <Shirt size={88} strokeWidth={1.5} className="text-baddia-ink animate-pulse" />
              <span className="mt-3 font-display font-black text-[11px] tracking-[0.2em] uppercase text-baddia-ink">
                Sube tu outfit
              </span>
            </div>
            {TIPS.map(({ icon: Icon, text }, i) => (
              <div
                key={text}
                className={`${STICKER_POS[i]} px-2.5 py-1.5 border-2 border-baddia-ink rounded-xl shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center gap-1.5`}
              >
                <Icon size={12} />
                <span className="font-display font-black text-[10px] uppercase tracking-wider">{text}</span>
              </div>
            ))}
          </div>
        )}

        {preview && (
          <div className="rounded-3xl overflow-hidden border-[2.5px] border-baddia-ink shadow-[5px_6px_0_hsl(260_16%_15%)] bg-white">
            <img src={preview} alt="Tu outfit" className="w-full h-72 object-cover" />
          </div>
        )}

        {!reading && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPick(f);
              }}
            />
            <button
              disabled={loading}
              onClick={() => inputRef.current?.click()}
              className="relative w-full active:translate-x-[2px] active:translate-y-[2px] transition-transform disabled:opacity-70 group"
            >
              <span className="absolute inset-0 bg-baddia-ink rounded-2xl translate-x-1.5 translate-y-1.5 group-active:translate-x-0 group-active:translate-y-0 transition-transform" />
              <span className="relative flex items-center justify-center gap-2.5 bg-gradient-glow text-white py-4 px-6 rounded-2xl border-[2.5px] border-baddia-ink">
                {loading ? (
                  <>
                    <Sparkles size={18} className="animate-spin" />
                    <span className="font-display font-black text-base uppercase tracking-wider">Leyendo tu outfit…</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} strokeWidth={3} />
                    <span className="font-display font-black text-base uppercase tracking-wider">Subir foto del outfit</span>
                  </>
                )}
              </span>
            </button>
          </>
        )}

        {reading && (
          <>
            <div className="relative">
              <div className="absolute inset-0 bg-baddia-ink rounded-3xl translate-x-1.5 translate-y-1.5" />
              <div className="relative bg-gradient-glow text-white border-[2.5px] border-baddia-ink rounded-3xl p-5 overflow-hidden">
                <span className="absolute top-3 right-4 text-baddia-yellow text-xl">✦</span>
                <span className="inline-block px-2.5 py-1 bg-baddia-yellow border-2 border-baddia-ink rounded-full text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink mb-3 shadow-[2px_2px_0_hsl(260_16%_15%)]">
                  ✨ Outfit del día
                </span>
                <p className="font-display font-black italic text-[22px] leading-tight">
                  {reading.headline}
                </p>
                <p className="mt-2 text-[12px] font-display font-black uppercase tracking-widest text-white/85">
                  Vibe · {reading.vibe}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={reset}
                className="py-2.5 rounded-2xl bg-white border-[2.5px] border-baddia-ink text-baddia-ink text-sm font-display font-black uppercase tracking-wider shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center gap-2 active:translate-y-0.5 transition-all"
              >
                <RotateCcw size={14} /> Otro
              </button>
              <button
                onClick={handleShare}
                className="py-2.5 rounded-2xl bg-baddia-ink text-white text-sm font-display font-black uppercase tracking-wider shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center gap-2 active:translate-y-0.5 transition-all"
              >
                <Share2 size={14} /> Compartir
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="relative -rotate-1">
                <span className="absolute inset-0 bg-baddia-ink rounded-2xl translate-x-1 translate-y-1" />
                <div className="relative bg-white border-[2.5px] border-baddia-ink rounded-2xl p-3 min-h-[110px]">
                  <span className="inline-flex w-9 h-9 rounded-xl bg-pink-100 border-2 border-baddia-ink items-center justify-center mb-2 shadow-[2px_2px_0_hsl(260_16%_15%)]">
                    <Palette size={16} className="text-baddia-ink" strokeWidth={2.5} />
                  </span>
                  <p className="font-display font-black italic text-baddia-ink text-[15px] leading-none">Colores</p>
                  <p className="text-[11px] leading-snug mt-1.5 text-baddia-ink/75 font-semibold">
                    {reading.colors.join(" · ")}
                  </p>
                </div>
              </div>
              <div className="relative rotate-1">
                <span className="absolute inset-0 bg-baddia-ink rounded-2xl translate-x-1 translate-y-1" />
                <div className="relative bg-white border-[2.5px] border-baddia-ink rounded-2xl p-3 min-h-[110px]">
                  <span className="inline-flex w-9 h-9 rounded-xl bg-violet-100 border-2 border-baddia-ink items-center justify-center mb-2 shadow-[2px_2px_0_hsl(260_16%_15%)]">
                    <Shirt size={16} className="text-baddia-ink" strokeWidth={2.5} />
                  </span>
                  <p className="font-display font-black italic text-baddia-ink text-[15px] leading-none">Estilo</p>
                  <p className="text-[11px] leading-snug mt-1.5 text-baddia-ink/75 font-semibold">
                    {reading.style}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <span className="absolute inset-0 bg-baddia-ink rounded-2xl translate-x-1 translate-y-1" />
              <div className="relative bg-white border-[2.5px] border-baddia-ink rounded-2xl p-4">
                <span className="inline-block px-2 py-0.5 bg-baddia-lavender border-2 border-baddia-ink rounded-full text-[9px] font-display font-black uppercase tracking-widest text-baddia-ink mb-2">
                  Energía
                </span>
                <p className="text-[13px] font-semibold text-baddia-ink leading-snug">{reading.energy}</p>
              </div>
            </div>

            <div className="relative -rotate-1">
              <span className="absolute inset-0 bg-baddia-ink rounded-2xl translate-x-1 translate-y-1" />
              <div
                className="relative border-[2.5px] border-baddia-ink rounded-2xl p-4"
                style={{ background: `linear-gradient(135deg, ${vibe.color.from}, ${vibe.color.to})` }}
              >
                <span className="inline-block px-2 py-0.5 bg-white border-2 text-[9px] font-display font-black uppercase tracking-widest text-baddia-ink mb-2">
                  Color de hoy · {vibe.color.name}
                </span>
                <p className="text-[13px] font-display font-black italic text-baddia-ink leading-snug">
                  {reading.matchToday}
                </p>
              </div>
            </div>

            <div className="relative">
              <span className="absolute inset-0 bg-baddia-ink rounded-2xl translate-x-1 translate-y-1" />
              <div className="relative bg-white border-[2.5px] border-baddia-ink rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex w-7 h-7 rounded-lg bg-baddia-yellow border-2 border-baddia-ink items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)]">
                    <Wand2 size={13} className="text-baddia-ink" strokeWidth={2.5} />
                  </span>
                  <p className="font-display font-black italic text-baddia-ink text-[16px]">
                    Mejoras cute ✨
                  </p>
                </div>
                <ul className="space-y-2">
                  {reading.improvements.map((tip, i) => (
                    <li key={i} className="flex gap-2 text-[12.5px] text-baddia-ink font-semibold leading-snug">
                      <span className="shrink-0 text-baddia-hot font-black">{i + 1}.</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-[11px] text-center text-baddia-ink/55 font-semibold pt-1 leading-relaxed">
              Solo para entretenimiento 💖
            </p>
          </>
        )}
      </div>

      {/* SHARE CARD MODAL */}
      {showShareCard && reading && preview && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/70 backdrop-blur-sm">
          {/* header */}
          <div className="flex items-center justify-between px-5 pt-6 pb-3">
            <span className="text-white font-display font-black uppercase tracking-widest text-[12px]">
              ✨ Elige tu vibe
            </span>
            <button
              onClick={() => setShowShareCard(false)}
              className="p-2 bg-white border-2 border-baddia-ink rounded-full shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-0.5"
            >
              <X size={16} strokeWidth={3} className="text-baddia-ink" />
            </button>
          </div>

          {/* preview card scroll area */}
          <div className="flex-1 overflow-y-auto flex items-start justify-center px-4 py-2">
            <div ref={shareCardRef}>
              <ShareCardArt
                theme={theme}
                photo={preview}
                headline={reading.headline}
                vibe={reading.vibe}
                style={reading.style}
                colors={reading.colors}
                userName={user.name}
              />
            </div>
          </div>

          {/* theme picker */}
          <div className="px-3 py-3 bg-baddia-ink/40 backdrop-blur">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {THEMES.map((t) => {
                const active = t.id === themeId;
                return (
                  <button
                    key={t.id}
                    onClick={() => setThemeId(t.id)}
                    className={`shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-2xl border-[2.5px] transition-all ${
                      active
                        ? "border-baddia-yellow shadow-[3px_3px_0_hsl(48_100%_59%)] -translate-y-0.5"
                        : "border-white/30"
                    }`}
                    style={{ background: t.bg, minWidth: 78 }}
                  >
                    <span className="text-lg">{t.emoji}</span>
                    <span
                      className="font-display font-black text-[9px] uppercase tracking-widest"
                      style={{ color: t.textColor }}
                    >
                      {t.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={captureAndShare}
              disabled={isCapturing}
              className="relative w-full active:translate-x-[2px] active:translate-y-[2px] transition-transform disabled:opacity-70 group mt-1"
            >
              <span className="absolute inset-0 bg-black rounded-2xl translate-x-1.5 translate-y-1.5 group-active:translate-x-0 group-active:translate-y-0 transition-transform" />
              <span className="relative flex items-center justify-center gap-2.5 bg-gradient-glow text-white py-3.5 px-6 rounded-2xl border-[2.5px] border-baddia-ink">
                {isCapturing ? (
                  <>
                    <Sparkles size={18} className="animate-spin" />
                    <span className="font-display font-black text-base uppercase tracking-wider">Creando…</span>
                  </>
                ) : (
                  <>
                    <Download size={18} strokeWidth={3} />
                    <span className="font-display font-black text-base uppercase tracking-wider">Guardar / Compartir</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
