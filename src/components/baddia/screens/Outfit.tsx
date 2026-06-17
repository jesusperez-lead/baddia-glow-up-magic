import { useRef, useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { computeDailyVibe } from "@/lib/baddia-daily";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Camera, Upload, Sparkles, RotateCcw, Shirt, Palette, Wand2,
  Share2, Copy, ArrowLeft, Sun, Eye,
} from "lucide-react";

type OutfitReading = {
  valid: boolean;
  reason?: string;
  headline?: string;
  vibe?: string;
  colors?: string[];
  style?: string;
  energy?: string;
  matchToday?: string;
  improvements?: string[];
};

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

function fileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const result = r.result as string;
      const [meta, data] = result.split(",");
      const mime = /data:(.*?);base64/.exec(meta)?.[1] ?? file.type ?? "image/jpeg";
      resolve({ base64: data, mimeType: mime });
    };
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

async function compressImage(file: File, maxDim = 1280, quality = 0.82): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", quality));
  return new File([blob], "outfit.jpg", { type: "image/jpeg" });
}

export function Outfit() {
  const { user, go } = useBaddia();
  const vibe = computeDailyVibe(user);
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<OutfitReading | null>(null);

  const reset = () => {
    setPreview(null);
    setReading(null);
    setLoading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onPick = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Sube una imagen 📸");
      return;
    }
    setReading(null);
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      setPreview(URL.createObjectURL(compressed));
      const { base64, mimeType } = await fileToBase64(compressed);

      const { data, error } = await supabase.functions.invoke("outfit-read", {
        body: { imageBase64: base64, mimeType, todayColor: vibe.color.name },
      });
      if (error) throw error;

      const r = data as OutfitReading;
      if (!r?.valid) {
        toast.error("No vi tu outfit 👗 Prueba con una foto más clara.");
        setReading(null);
      } else {
        setReading(r);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Algo salió mal con la lectura ✨");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!reading?.headline) return;
    const text = `${reading.headline} ✨\nVibe: ${reading.vibe ?? "magnética"} · Estilo: ${reading.style ?? "único"}\n— Baddia`;
    try {
      if (navigator.share) {
        await navigator.share({ text, title: "Mi outfit hoy ✨" });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Copiado ✨ pégalo donde quieras");
      }
    } catch {
      try {
        await navigator.clipboard.writeText(text);
        toast.success("Copiado ✨");
      } catch {
        toast.error("No pudimos compartir");
      }
    }
  };

  return (
    <div className="relative min-h-full gradient-bg-soft pb-6 overflow-hidden">
      <div className="pointer-events-none absolute -top-10 -right-10 w-64 h-64 rounded-full bg-baddia-hot/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-32 -left-10 w-64 h-64 rounded-full bg-baddia-purple/20 blur-3xl" />

      <header className="relative z-10 px-5 pt-6 pb-4">
        <button
          onClick={() => go("daily")}
          className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 bg-white border-2 border-baddia-ink rounded-full shadow-[2px_2px_0_hsl(260_16%_15%)] text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
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
          Sube tu look y Baddia lee su energía ✨
        </p>

        {/* color del día chip */}
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
        {/* RITUAL CHAMBER (pre-upload) */}
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

        {!reading && !preview && (
          <div className="p-4 bg-white border-[2.5px] border-baddia-ink rounded-2xl shadow-[5px_5px_0_hsl(260_16%_15%)] -rotate-1">
            <p className="text-[12px] leading-relaxed font-semibold text-baddia-ink">
              Tu outfit cuenta tu energía. Baddia lee color, vibra, estilo y combinación con el color de hoy ✨
            </p>
          </div>
        )}

        {/* PREVIEW */}
        {preview && (
          <div className="rounded-3xl overflow-hidden border-[2.5px] border-baddia-ink shadow-[5px_6px_0_hsl(260_16%_15%)] bg-white">
            <img src={preview} alt="Tu outfit" className="w-full h-72 object-cover" />
          </div>
        )}

        {/* UPLOAD */}
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

        {/* RESULTADO */}
        {reading?.valid && (
          <>
            {/* Headline sticker */}
            <div className="relative">
              <div className="absolute inset-0 bg-baddia-ink rounded-3xl translate-x-1.5 translate-y-1.5" />
              <div className="relative bg-gradient-glow text-white border-[2.5px] border-baddia-ink rounded-3xl p-5 overflow-hidden">
                <span className="absolute top-3 right-4 text-baddia-yellow text-xl animate-twinkle">✦</span>
                <span className="inline-block px-2.5 py-1 bg-baddia-yellow border-2 border-baddia-ink rounded-full text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink mb-3 shadow-[2px_2px_0_hsl(260_16%_15%)]">
                  ✨ Outfit del día
                </span>
                <p className="font-display font-black italic text-[22px] leading-tight">
                  {reading.headline}
                </p>
                {reading.vibe && (
                  <p className="mt-2 text-[12px] font-display font-black uppercase tracking-widest text-white/85">
                    Vibe · {reading.vibe}
                  </p>
                )}
              </div>
            </div>

            {/* Botones acción */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={reset}
                className="py-2.5 rounded-2xl bg-white border-[2.5px] border-baddia-ink text-baddia-ink text-sm font-display font-black uppercase tracking-wider shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
              >
                <RotateCcw size={14} /> Otro
              </button>
              <button
                onClick={handleShare}
                className="py-2.5 rounded-2xl bg-baddia-ink text-white text-sm font-display font-black uppercase tracking-wider shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
              >
                <Share2 size={14} /> Compartir
              </button>
            </div>

            {/* Colores + estilo */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative -rotate-1">
                <span className="absolute inset-0 bg-baddia-ink rounded-2xl translate-x-1 translate-y-1" />
                <div className="relative bg-white border-[2.5px] border-baddia-ink rounded-2xl p-3 min-h-[110px]">
                  <span className="inline-flex w-9 h-9 rounded-xl bg-pink-100 border-2 border-baddia-ink items-center justify-center mb-2 shadow-[2px_2px_0_hsl(260_16%_15%)]">
                    <Palette size={16} className="text-baddia-ink" strokeWidth={2.5} />
                  </span>
                  <p className="font-display font-black italic text-baddia-ink text-[15px] leading-none">Colores</p>
                  <p className="text-[11px] leading-snug mt-1.5 text-baddia-ink/75 font-semibold">
                    {reading.colors?.join(" · ") || "—"}
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
                    {reading.style || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Energía */}
            {reading.energy && (
              <div className="relative">
                <span className="absolute inset-0 bg-baddia-ink rounded-2xl translate-x-1 translate-y-1" />
                <div className="relative bg-white border-[2.5px] border-baddia-ink rounded-2xl p-4">
                  <span className="inline-block px-2 py-0.5 bg-baddia-lavender border-2 border-baddia-ink rounded-full text-[9px] font-display font-black uppercase tracking-widest text-baddia-ink mb-2">
                    Energía
                  </span>
                  <p className="text-[13px] font-semibold text-baddia-ink leading-snug">{reading.energy}</p>
                </div>
              </div>
            )}

            {/* Match con color del día */}
            {reading.matchToday && (
              <div className="relative -rotate-1">
                <span className="absolute inset-0 bg-baddia-ink rounded-2xl translate-x-1 translate-y-1" />
                <div
                  className="relative border-[2.5px] border-baddia-ink rounded-2xl p-4"
                  style={{ background: `linear-gradient(135deg, ${vibe.color.from}, ${vibe.color.to})` }}
                >
                  <span className="inline-block px-2 py-0.5 bg-white border-2 border-baddia-ink rounded-full text-[9px] font-display font-black uppercase tracking-widest text-baddia-ink mb-2">
                    Color de hoy · {vibe.color.name}
                  </span>
                  <p className="text-[13px] font-display font-black italic text-baddia-ink leading-snug">
                    {reading.matchToday}
                  </p>
                </div>
              </div>
            )}

            {/* Mejoras cute */}
            {reading.improvements && reading.improvements.length > 0 && (
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
            )}

            <p className="text-[11px] text-center text-baddia-ink/55 font-semibold pt-1 leading-relaxed">
              Powered by IA · solo para entretenimiento 💖
            </p>
          </>
        )}
      </div>
    </div>
  );
}
