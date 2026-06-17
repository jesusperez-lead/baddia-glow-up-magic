import { useRef, useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import {
  ArrowLeft, Upload, RotateCcw, Sparkles, Share2, Heart, X, Plus,
} from "lucide-react";

type Relationship = "crush" | "amistad" | "pareja" | "match";

type CompatReading = {
  valid: boolean;
  reason?: string;
  score?: number;
  label?: string;
  headline?: string;
  vibeA?: string;
  vibeB?: string;
  colorsA?: string[];
  colorsB?: string[];
  elementMatch?: string;
  strengths?: string[];
  watchOuts?: string[];
  advice?: string;
  dateIdea?: string;
};

const REL_OPTIONS: { id: Relationship; emoji: string; label: string }[] = [
  { id: "crush",    emoji: "💘", label: "Crush" },
  { id: "match",    emoji: "✨", label: "Match" },
  { id: "amistad",  emoji: "🦋", label: "Amig@" },
  { id: "pareja",   emoji: "💞", label: "Pareja" },
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

async function compressImage(file: File, maxDim = 1024, quality = 0.82): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", quality));
  return new File([blob], "compat.jpg", { type: "image/jpeg" });
}

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

function PhotoSlot({
  preview, label, emoji, color, onPick, onClear,
}: {
  preview: string | null;
  label: string;
  emoji: string;
  color: string;
  onPick: (file: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => inputRef.current?.click()}
        className={`relative w-full aspect-square rounded-3xl border-[2.5px] border-baddia-ink shadow-[4px_5px_0_hsl(260_16%_15%)] overflow-hidden ${color} flex items-center justify-center active:translate-y-0.5 active:shadow-[2px_3px_0_hsl(260_16%_15%)] transition-all`}
      >
        {preview ? (
          <>
            <img src={preview} alt={label} className="absolute inset-0 w-full h-full object-cover" />
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] cursor-pointer"
            >
              <X size={14} strokeWidth={3} className="text-baddia-ink" />
            </span>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-baddia-ink">
            <span className="text-4xl drop-shadow-[0_2px_3px_rgba(0,0,0,0.25)]">{emoji}</span>
            <span className="w-9 h-9 rounded-full bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)]">
              <Plus size={16} strokeWidth={3} />
            </span>
          </div>
        )}
        <span className="absolute bottom-1.5 left-1.5 rounded-full bg-baddia-ink text-white px-2 py-0.5 text-[9px] font-display font-black uppercase tracking-widest">
          {label}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
            e.currentTarget.value = "";
          }}
        />
      </button>
    </div>
  );
}

const SCORE_COLOR = (s: number) => {
  if (s >= 85) return "from-baddia-hot via-baddia-bubble to-baddia-lavender";
  if (s >= 65) return "from-baddia-bubble via-baddia-lavender to-baddia-mint";
  if (s >= 45) return "from-baddia-yellow via-baddia-bubble to-baddia-lavender";
  return "from-baddia-ink via-baddia-lavender to-baddia-bubble";
};

export function Compat() {
  const { go, user } = useBaddia();
  const [rel, setRel] = useState<Relationship>("crush");
  const [photoA, setPhotoA] = useState<{ preview: string; base64: string; mime: string } | null>(null);
  const [photoB, setPhotoB] = useState<{ preview: string; base64: string; mime: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<CompatReading | null>(null);

  const handlePick = async (which: "A" | "B", file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Sube una imagen 📸");
      return;
    }
    try {
      const compressed = await compressImage(file);
      const { base64, mimeType } = await fileToBase64(compressed);
      const preview = URL.createObjectURL(compressed);
      if (which === "A") setPhotoA({ preview, base64, mime: mimeType });
      else setPhotoB({ preview, base64, mime: mimeType });
      setReading(null);
    } catch {
      toast.error("No pude leer la imagen");
    }
  };

  const analyze = async () => {
    if (!photoA || !photoB) {
      toast.error("Sube las dos fotos 💕");
      return;
    }
    setLoading(true);
    setReading(null);
    try {
      const { data, error } = await supabase.functions.invoke("compat-read", {
        body: {
          imageABase64: photoA.base64,
          mimeTypeA: photoA.mime,
          imageBBase64: photoB.base64,
          mimeTypeB: photoB.mime,
          relationship: rel,
        },
      });
      if (error) throw error;
      const r = data as CompatReading;
      if (!r?.valid) {
        toast.error(r?.reason || "No pude leer la energía. Prueba con otras fotos ✨");
      }
      setReading(r);
    } catch (e: any) {
      toast.error(e?.message || "Algo pasó con la lectura");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPhotoA(null);
    setPhotoB(null);
    setReading(null);
    setLoading(false);
  };

  const handleShare = async () => {
    if (!reading?.valid) return;
    const text =
      `💞 Compatibilidad — Baddia\n` +
      `${reading.score}% · ${reading.label}\n` +
      `${reading.headline}\n\n` +
      `${user.name} (${reading.vibeA}) × tu ${rel} (${reading.vibeB})\n` +
      `${reading.elementMatch || ""}`;
    try {
      if (navigator.share) await navigator.share({ title: "Mi compatibilidad", text });
      else { await navigator.clipboard.writeText(text); toast.success("Copiado ✨"); }
    } catch { /* no-op */ }
  };

  const canAnalyze = !!photoA && !!photoB && !loading;

  return (
    <div className="relative min-h-full gradient-bg-soft pb-12 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-hot/25" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-bubble/25" style={{ animationDelay: "4s" }} />
      <div className="blob top-[720px] -left-10 w-56 h-56 bg-baddia-lavender/20" style={{ animationDelay: "2s" }} />
      <SparklesDeco />

      <header className="relative z-10 px-6 pt-8 pb-2">
        <button
          onClick={() => go("daily")}
          className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 bg-white border-2 border-baddia-ink rounded-full shadow-[2px_2px_0_hsl(260_16%_15%)] text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
        >
          <ArrowLeft size={12} strokeWidth={3} /> Volver
        </button>
        <span className="inline-block rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold shadow-[3px_3px_0_hsl(335_100%_59%)] -rotate-2 mb-3 uppercase tracking-wider">
          💘 Compatibilidad
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          Tu match <span className="gradient-text">cósmico</span> 💞
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Sube tu foto y la de tu crush, amig@ o pareja. La IA lee la vibra entre los dos.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* Relationship */}
        <SectionLabel emoji="🔗" text="¿quién es?" />
        <div className="grid grid-cols-4 gap-2">
          {REL_OPTIONS.map((r) => {
            const active = rel === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRel(r.id)}
                className={`rounded-2xl border-[2.5px] border-baddia-ink py-2.5 px-1 flex flex-col items-center gap-0.5 transition-all ${
                  active
                    ? "bg-baddia-hot text-white shadow-[3px_3px_0_hsl(260_16%_15%)] -translate-y-0.5"
                    : "bg-white text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)]"
                }`}
              >
                <span className="text-lg">{r.emoji}</span>
                <span className="text-[10px] font-display font-black uppercase tracking-wider">{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Photos */}
        <SectionLabel emoji="📸" text="las dos fotos" />
        <div className="relative grid grid-cols-2 gap-3">
          <PhotoSlot
            preview={photoA?.preview ?? null}
            label="Tú"
            emoji="🧚"
            color="bg-gradient-to-br from-baddia-bubble/40 to-baddia-hot/30"
            onPick={(f) => handlePick("A", f)}
            onClear={() => setPhotoA(null)}
          />
          <PhotoSlot
            preview={photoB?.preview ?? null}
            label="Tu match"
            emoji="💫"
            color="bg-gradient-to-br from-baddia-lavender/40 to-baddia-mint/30"
            onPick={(f) => handlePick("B", f)}
            onClear={() => setPhotoB(null)}
          />
          {/* center heart sticker */}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border-[2.5px] border-baddia-ink bg-white flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] pointer-events-none">
            <Heart size={20} className="text-baddia-hot fill-baddia-hot" />
          </span>
        </div>

        <p className="text-[11px] text-baddia-ink/55 font-semibold text-center px-4 leading-relaxed">
          Usa fotos claras del rostro o cuerpo. Solo se lee la energía, no datos biométricos 🤍
        </p>

        {!reading?.valid && (
          <button
            disabled={!canAnalyze}
            onClick={analyze}
            className="btn-sticker w-full py-3.5 rounded-full bg-gradient-hot text-white text-[14px] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Sparkles size={16} className="animate-spin" />
                Leyendo la vibra…
              </>
            ) : (
              <>
                <span className="text-lg">💞</span> Calcular compatibilidad
              </>
            )}
          </button>
        )}

        {/* Result */}
        {reading?.valid && (
          <div className="space-y-4 animate-pop-in">
            {/* Score sticker */}
            <div className={`relative rounded-3xl border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden text-white bg-gradient-to-br ${SCORE_COLOR(reading.score ?? 0)}`}>
              <div className="absolute -top-3 left-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(48_100%_59%)] rotate-1">
                  ✦ tu match
                </span>
              </div>
              <span className="absolute -top-4 -right-2 text-8xl opacity-20 select-none">💞</span>
              <div className="flex items-end gap-2">
                <p className="font-display font-black text-[64px] leading-none drop-shadow-[0_3px_4px_rgba(0,0,0,0.3)]">
                  {reading.score ?? 0}
                </p>
                <p className="font-display font-black text-[20px] leading-none pb-2 drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]">
                  %
                </p>
              </div>
              <p className="font-display font-black text-[14px] uppercase tracking-widest mt-1 drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)]">
                {reading.label}
              </p>
              <p className="mt-2 font-display font-bold text-[15px] leading-snug drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] opacity-95">
                {reading.headline}
              </p>
            </div>

            {/* Vibes per person */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white border-[2.5px] border-baddia-ink p-3 shadow-[4px_4px_0_hsl(260_16%_15%)]">
                <p className="text-[9px] font-display font-black uppercase tracking-widest text-baddia-ink/55">Tu energía</p>
                <p className="font-display font-black text-[15px] text-baddia-ink leading-tight mt-0.5">
                  🧚 {reading.vibeA}
                </p>
                {reading.colorsA && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {reading.colorsA.map((c) => (
                      <span key={c} className="text-[9px] font-display font-black uppercase tracking-wider rounded-full bg-baddia-bubble/30 border border-baddia-ink/30 px-2 py-[1px] text-baddia-ink/75">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="rounded-2xl bg-white border-[2.5px] border-baddia-ink p-3 shadow-[4px_4px_0_hsl(260_16%_15%)]">
                <p className="text-[9px] font-display font-black uppercase tracking-widest text-baddia-ink/55">Su energía</p>
                <p className="font-display font-black text-[15px] text-baddia-ink leading-tight mt-0.5">
                  💫 {reading.vibeB}
                </p>
                {reading.colorsB && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {reading.colorsB.map((c) => (
                      <span key={c} className="text-[9px] font-display font-black uppercase tracking-wider rounded-full bg-baddia-lavender/30 border border-baddia-ink/30 px-2 py-[1px] text-baddia-ink/75">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {reading.elementMatch && (
              <div className="rounded-2xl bg-baddia-yellow/40 border-[2.5px] border-baddia-ink p-4 shadow-[4px_4px_0_hsl(260_16%_15%)]">
                <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/65">⚡ combinación</p>
                <p className="text-[13px] text-baddia-ink font-semibold leading-snug mt-1">
                  {reading.elementMatch}
                </p>
              </div>
            )}

            {/* Strengths */}
            {reading.strengths && reading.strengths.length > 0 && (
              <div className="rounded-2xl bg-white border-[2.5px] border-baddia-ink p-4 shadow-[4px_4px_0_hsl(260_16%_15%)]">
                <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55 mb-2">💖 fuerzas</p>
                <ul className="space-y-1.5">
                  {reading.strengths.map((s, i) => (
                    <li key={i} className="text-[13px] text-baddia-ink/80 font-semibold leading-snug flex gap-2">
                      <span className="text-baddia-hot">✦</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Watch outs */}
            {reading.watchOuts && reading.watchOuts.length > 0 && (
              <div className="rounded-2xl bg-baddia-lavender/20 border-[2.5px] border-baddia-ink p-4 shadow-[4px_4px_0_hsl(260_16%_15%)]">
                <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55 mb-2">🌙 a cuidar</p>
                <ul className="space-y-1.5">
                  {reading.watchOuts.map((s, i) => (
                    <li key={i} className="text-[13px] text-baddia-ink/80 font-semibold leading-snug flex gap-2">
                      <span className="text-baddia-lavender">✧</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Advice + date idea */}
            {(reading.advice || reading.dateIdea) && (
              <div className="grid grid-cols-1 gap-3">
                {reading.advice && (
                  <div className="rounded-2xl bg-white border-[2.5px] border-baddia-ink p-4 shadow-[4px_4px_0_hsl(260_16%_15%)]">
                    <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55">💌 consejo</p>
                    <p className="text-[13px] text-baddia-ink font-semibold leading-snug mt-1">{reading.advice}</p>
                  </div>
                )}
                {reading.dateIdea && (
                  <div className="rounded-2xl bg-baddia-bubble/25 border-[2.5px] border-baddia-ink p-4 shadow-[4px_4px_0_hsl(260_16%_15%)]">
                    <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55">🍓 plan juntos</p>
                    <p className="text-[13px] text-baddia-ink font-semibold leading-snug mt-1">{reading.dateIdea}</p>
                  </div>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={handleShare}
                className="py-3 rounded-2xl bg-baddia-yellow border-[2.5px] border-baddia-ink text-baddia-ink text-[12px] font-display font-black uppercase tracking-wider shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
              >
                <Share2 size={14} /> Compartir
              </button>
              <button
                onClick={reset}
                className="py-3 rounded-2xl bg-white border-[2.5px] border-baddia-ink text-baddia-ink text-[12px] font-display font-black uppercase tracking-wider shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
              >
                <RotateCcw size={14} /> Otro match
              </button>
            </div>
          </div>
        )}

        <p className="text-[11px] text-center text-baddia-ink/50 font-semibold px-6 pt-3 leading-relaxed">
          Lectura energética ✨ solo entretenimiento, tú decides tu corazón 💖
        </p>
      </div>
    </div>
  );
}
