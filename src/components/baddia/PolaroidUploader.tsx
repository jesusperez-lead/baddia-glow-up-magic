import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, Upload, RotateCw, Check, X, Sparkles, Trash2 } from "lucide-react";

type Filter = "vintage" | "sepia" | "polaroid70s" | "sunfade" | "noir" | "dreamy";

const FILTERS: { id: Filter; label: string; emoji: string; css: string }[] = [
  { id: "vintage",    label: "Vintage",   emoji: "📷", css: "sepia(0.35) contrast(1.05) saturate(1.15) brightness(1.02)" },
  { id: "polaroid70s",label: "70s",       emoji: "🌼", css: "sepia(0.55) contrast(0.95) saturate(1.3) hue-rotate(-8deg) brightness(1.05)" },
  { id: "sunfade",    label: "Sun fade",  emoji: "☀️", css: "sepia(0.25) saturate(1.4) brightness(1.08) contrast(0.95) hue-rotate(-4deg)" },
  { id: "sepia",      label: "Sepia",     emoji: "🍂", css: "sepia(0.85) contrast(1.05) saturate(1.1)" },
  { id: "dreamy",     label: "Dreamy",    emoji: "💗", css: "saturate(1.25) contrast(0.98) brightness(1.06) hue-rotate(6deg)" },
  { id: "noir",       label: "Noir",      emoji: "🖤", css: "grayscale(1) contrast(1.15) brightness(0.98)" },
];

const MONTHS = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

function todayStamp() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2,"0")} ${MONTHS[d.getMonth()]} · ${String(d.getFullYear()).slice(-2)}'`;
}

interface Props {
  open: boolean;
  onClose: () => void;
  initial?: string;
  initialCaption?: string;
  defaultCaption?: string;
  onSave: (avatar: string, caption: string) => void;
  onRemove?: () => void;
}

export function PolaroidUploader({ open, onClose, initial, initialCaption, defaultCaption = "", onSave, onRemove }: Props) {
  const [src, setSrc] = useState<string | undefined>(initial);
  const [filter, setFilter] = useState<Filter>("vintage");
  const [caption, setCaption] = useState<string>(initialCaption ?? defaultCaption ?? todayStamp());
  const [tilt, setTilt] = useState<number>(-3);
  const [dev, setDev] = useState<"developing" | "ready">(initial ? "ready" : "ready");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setSrc(initial);
      setCaption(initialCaption ?? defaultCaption ?? todayStamp());
      setFilter("vintage");
      setTilt(-3);
      setDev("ready");
    }
  }, [open, initial, initialCaption, defaultCaption]);

  if (!open) return null;

  const handleFile = (f?: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSrc(reader.result as string);
      setDev("developing");
      setTimeout(() => setDev("ready"), 1400);
    };
    reader.readAsDataURL(f);
  };

  const activeFilter = FILTERS.find((f) => f.id === filter)!;

  // Render final image with filter baked in via canvas
  const bakeAndSave = async () => {
    if (!src) return;
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      await new Promise<void>((res, rej) => {
        img.onload = () => res();
        img.onerror = () => rej();
      });
      const size = 512;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) { onSave(src, caption); return; }
      // cover crop
      const ratio = Math.max(size / img.width, size / img.height);
      const w = img.width * ratio;
      const h = img.height * ratio;
      ctx.filter = activeFilter.css;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
      // subtle grain
      ctx.filter = "none";
      ctx.globalAlpha = 0.06;
      for (let i = 0; i < 400; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? "#fff" : "#000";
        ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
      }
      ctx.globalAlpha = 1;
      onSave(canvas.toDataURL("image/jpeg", 0.9), caption);
    } catch {
      onSave(src, caption);
    }
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-baddia-ink/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] bg-gradient-to-br from-baddia-pearl via-white to-baddia-bubble/50 border-t-[2.5px] sm:border-[2.5px] border-baddia-ink shadow-[0_-8px_40px_rgba(0,0,0,0.35)] p-5 pb-6 animate-slide-up max-h-[92vh] overflow-y-auto scrollbar-hide"
      >
        {/* handle */}
        <div className="mx-auto w-12 h-1.5 rounded-full bg-baddia-ink/25 mb-3 sm:hidden" />

        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="inline-block rounded-full bg-baddia-ink text-white px-2.5 py-1 text-[9px] font-display font-black uppercase tracking-[0.15em] -rotate-2 shadow-[2px_2px_0_hsl(260_16%_15%_/_0.15)]">
              📷 instant camera
            </span>
            <h2 className="font-display font-black text-baddia-ink text-[20px] leading-tight mt-1.5">
              Tu foto <span className="gradient-text">vintage</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border-2 border-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] flex items-center justify-center active:translate-y-[1px] active:shadow-[1px_1px_0_hsl(260_16%_15%)]"
            aria-label="Cerrar"
          >
            <X size={16} className="text-baddia-ink" />
          </button>
        </div>

        {/* Polaroid preview */}
        <div className="flex justify-center py-3">
          <div
            className="relative bg-white p-3 pb-14 shadow-[6px_10px_0_hsl(260_16%_15%_/_0.25),0_20px_40px_-10px_rgba(0,0,0,0.35)] border border-baddia-ink/10 transition-transform"
            style={{ transform: `rotate(${tilt}deg)`, width: 240 }}
          >
            {/* tape */}
            <span className="absolute -top-3 left-6 w-14 h-5 bg-baddia-yellow/70 border border-baddia-ink/10 rotate-[-8deg] shadow-sm" />
            <span className="absolute -top-2 right-8 w-10 h-4 bg-baddia-bubble/80 border border-baddia-ink/10 rotate-[6deg] shadow-sm" />

            <div className="relative w-[216px] h-[216px] bg-baddia-ink/90 overflow-hidden">
              {src ? (
                <>
                  <img
                    src={src}
                    alt="preview"
                    className="w-full h-full object-cover"
                    style={{ filter: activeFilter.css }}
                  />
                  {/* vignette */}
                  <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.35)]" />
                  {/* light leak */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-baddia-yellow/25 mix-blend-screen" />
                  {dev === "developing" && (
                    <div className="absolute inset-0 bg-white animate-develop pointer-events-none" />
                  )}
                </>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center text-white/80 gap-2"
                >
                  <Camera size={40} />
                  <span className="font-display font-black text-[11px] uppercase tracking-widest">Toca para subir</span>
                </button>
              )}
            </div>

            {/* caption */}
            <div className="absolute bottom-3 left-3 right-3 text-center">
              <p
                className="text-baddia-ink text-[13px] leading-none truncate"
                style={{ fontFamily: "'Caveat', 'Fraunces', cursive", fontWeight: 700 }}
              >
                {caption || "✧ tu momento ✧"}
              </p>
            </div>
          </div>
        </div>

        {/* actions row */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-white text-baddia-ink border-2 border-baddia-ink px-3 py-2.5 text-[12px] font-display font-black shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
          >
            <Upload size={13} /> {src ? "Cambiar" : "Subir foto"}
          </button>
          <button
            onClick={() => setTilt((t) => (t >= 6 ? -6 : t + 3))}
            className="w-11 h-11 rounded-full bg-baddia-lavender text-white border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] flex items-center justify-center"
            aria-label="Rotar"
          >
            <RotateCw size={15} />
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        {/* Filters */}
        <p className="mt-5 mb-2 pl-1 font-display font-black text-[10px] uppercase tracking-[0.18em] text-baddia-ink/60">
          <Sparkles size={10} className="inline -mt-0.5 mr-1" /> filtro
        </p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {FILTERS.map((f) => {
            const active = f.id === filter;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-2xl border-2 border-baddia-ink px-3 py-2 text-[11px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all whitespace-nowrap ${
                  active ? "bg-baddia-hot text-white" : "bg-white text-baddia-ink"
                }`}
              >
                <span className="mr-1">{f.emoji}</span>{f.label}
              </button>
            );
          })}
        </div>

        {/* Caption */}
        <p className="mt-4 mb-2 pl-1 font-display font-black text-[10px] uppercase tracking-[0.18em] text-baddia-ink/60">
          ✍️ frase de la foto
        </p>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value.slice(0, 26))}
          placeholder="mi glow · verano '26"
          className="w-full rounded-2xl border-[2.5px] border-baddia-ink bg-white px-4 py-3 text-[14px] font-display font-bold text-baddia-ink placeholder:text-baddia-ink/30 shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none"
        />
        <div className="flex justify-end mt-1 pr-1">
          <span className="text-[10px] text-baddia-ink/40 font-display font-bold">{caption.length}/26</span>
        </div>

        {/* Save */}
        <div className="flex gap-2 mt-3">
          {initial && onRemove && (
            <button
              onClick={() => { onRemove(); onClose(); }}
              className="px-4 py-3 rounded-full bg-white text-baddia-hot font-display font-black text-[12px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all inline-flex items-center gap-1.5"
              aria-label="Eliminar foto"
            >
              <Trash2 size={13} />
            </button>
          )}
          <button
            disabled={!src}
            onClick={bakeAndSave}
            className="flex-1 py-3 rounded-full bg-baddia-hot text-white font-display font-black text-[13px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all inline-flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0_hsl(260_16%_15%)]"
          >
            <Check size={14} /> Guardar postal
          </button>
        </div>
      </div>

      <style>{`
        @keyframes develop {
          0% { opacity: 1; }
          60% { opacity: 0.6; }
          100% { opacity: 0; }
        }
        .animate-develop { animation: develop 1.4s ease-out forwards; }
      `}</style>
    </div>,
    document.body
  );
}
