import { useBaddia } from "@/lib/baddia-state";
import { Camera, Lock, Sun, Hand as HandIcon, Eye, Upload, RotateCcw, Sparkles, Heart, Coins, Briefcase, Compass, Activity, Brain } from "lucide-react";
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TIPS = [
  { icon: HandIcon, text: "Abre bien la mano" },
  { icon: Sun, text: "Usa fondo claro" },
  { icon: Eye, text: "Evita sombras" },
  { icon: Camera, text: "Solo una mano por foto" },
];

type Sections = {
  amor: string;
  dinero: string;
  trabajo: string;
  futuro: string;
  lineaVida: string;
  lineaCorazon: string;
  consejo: string;
};

type Reading = {
  valid: boolean;
  reason?: string;
  summary?: string;
  sections?: Sections;
};

const PRO_META: { key: keyof Sections; label: string; Icon: any; color: string }[] = [
  { key: "amor",         label: "Amor",              Icon: Heart,    color: "bg-pink-100" },
  { key: "dinero",       label: "Dinero",            Icon: Coins,    color: "bg-amber-100" },
  { key: "trabajo",      label: "Trabajo",           Icon: Briefcase, color: "bg-violet-100" },
  { key: "futuro",       label: "Futuro",            Icon: Compass,  color: "bg-sky-100" },
  { key: "lineaVida",    label: "Línea de vida",     Icon: Activity, color: "bg-emerald-100" },
  { key: "lineaCorazon", label: "Línea del corazón", Icon: Heart,    color: "bg-rose-100" },
  { key: "consejo",      label: "Consejo profundo",  Icon: Brain,    color: "bg-fuchsia-100" },
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

// Downscale to keep payload small + faster AI
async function compressImage(file: File, maxDim = 1280, quality = 0.82): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, w, h);
  const blob: Blob = await new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", quality));
  return new File([blob], "palm.jpg", { type: "image/jpeg" });
}

export function Palm() {
  const { user, openPaywall } = useBaddia();
  const isPro = user.plan !== "Free";
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<Reading | null>(null);

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

      const { data, error } = await supabase.functions.invoke("palm-read", {
        body: { imageBase64: base64, mimeType },
      });
      if (error) throw error;

      const r = data as Reading;
      if (!r?.valid) {
        toast.error("No pude ver tu palma 🤲 Prueba con más luz y la mano abierta.");
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

  // sticker positions for ritual chamber (matches selected design v3)
  const STICKER_POS = [
    "absolute top-3 left-3 -rotate-6 bg-baddia-hot text-white",
    "absolute top-10 right-3 rotate-[4deg] bg-baddia-purple text-white",
    "absolute bottom-20 right-5 -rotate-3 bg-white text-baddia-ink",
    "absolute bottom-24 left-5 rotate-[8deg] bg-baddia-yellow text-baddia-ink",
  ];

  return (
    <div className="relative min-h-full gradient-bg-soft pb-6 overflow-hidden">
      {/* glow blobs */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-64 h-64 rounded-full bg-baddia-hot/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-32 -left-10 w-64 h-64 rounded-full bg-baddia-purple/20 blur-3xl" />

      <header className="relative z-10 px-5 pt-8 pb-4">
        <span className="inline-block px-3 py-1 bg-baddia-yellow border-[2.5px] border-baddia-ink rounded-full shadow-[3px_3px_0_hsl(260_16%_15%)] text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink">
          ✨ Lectura de mano
        </span>
        <h1 className="font-display font-black italic text-[44px] leading-[0.95] tracking-tight text-baddia-ink mt-3">
          Palm<br />Reading
        </h1>
        <p className="text-[15px] font-medium italic text-baddia-ink/70 mt-2">
          Tu palma, leída por Baddia ✨
        </p>
      </header>

      <div className="relative z-10 px-5 space-y-5">
        {/* RITUAL CHAMBER (pre-upload) */}
        {!reading && !preview && (
          <div className="relative w-full aspect-[4/5] bg-white border-[2.5px] border-baddia-ink rounded-3xl shadow-[6px_8px_0_hsl(260_16%_15%)] overflow-hidden">
            {/* dotted pattern */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: "radial-gradient(hsl(260 16% 15%) 1px, transparent 1px)",
                backgroundSize: "12px 12px",
              }}
            />
            {/* hand silhouette guide */}
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-50">
              <svg
                className="w-40 h-56 stroke-baddia-ink fill-none animate-pulse"
                strokeWidth={2}
                strokeDasharray="8 8"
                viewBox="0 0 24 32"
              >
                <path d="M12 32C12 32 4 28 4 20C4 16 2 15 2 12C2 9 4 7 6 7C7 7 8 8 8 10C8 7 10 5 12 5C14 5 16 7 16 10C16 8 17 7 18 7C20 7 22 9 22 12C22 15 20 16 20 20C20 28 12 32 12 32Z" />
              </svg>
              <span className="mt-3 font-display font-black text-[11px] tracking-[0.2em] uppercase text-baddia-ink">
                Coloca tu palma aquí
              </span>
            </div>
            {/* scattered sticker tips */}
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

        {/* RITUAL CONTEXT */}
        {!reading && !preview && (
          <div className="p-4 bg-white border-[2.5px] border-baddia-ink rounded-2xl shadow-[5px_5px_0_hsl(260_16%_15%)] -rotate-1">
            <p className="text-[12px] leading-relaxed font-semibold text-baddia-ink">
              Las líneas de tu mano revelan tu energía. Captura cada detalle para una lectura precisa ✨
            </p>
          </div>
        )}

        {/* PREVIEW */}
        {preview && (
          <div className="rounded-3xl overflow-hidden border-[2.5px] border-baddia-ink shadow-[5px_6px_0_hsl(260_16%_15%)] bg-white">
            <img src={preview} alt="Tu palma" className="w-full h-56 object-cover" />
          </div>
        )}

        {/* UPLOAD / LOADING */}
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
                    <span className="font-display font-black text-base uppercase tracking-wider">Leyendo tu palma…</span>
                  </>
                ) : (
                  <>
                    <Upload size={18} strokeWidth={3} />
                    <span className="font-display font-black text-base uppercase tracking-wider">Subir foto de mi mano</span>
                  </>
                )}
              </span>
            </button>
          </>
        )}



        {/* RESULTADO */}
        {reading?.valid && reading.summary && (
          <>
            {/* Hero summary — sticker */}
            <div className="relative">
              <div className="absolute inset-0 bg-baddia-ink rounded-3xl translate-x-1.5 translate-y-1.5" />
              <div className="relative bg-gradient-glow text-white border-[2.5px] border-baddia-ink rounded-3xl p-5 overflow-hidden">
                <span className="absolute top-3 right-4 text-baddia-yellow text-xl animate-twinkle">✦</span>
                <span className="inline-block px-2.5 py-1 bg-baddia-yellow border-2 border-baddia-ink rounded-full text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink mb-3 shadow-[2px_2px_0_hsl(260_16%_15%)]">
                  ✨ Lectura gratis
                </span>
                <p className="font-display font-black italic text-[20px] leading-tight">
                  {reading.summary}
                </p>
              </div>
            </div>

            <button
              onClick={reset}
              className="w-full py-2.5 rounded-2xl bg-white border-[2.5px] border-baddia-ink text-baddia-ink text-sm font-display font-black uppercase tracking-wider shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
            >
              <RotateCcw size={14} /> Nueva lectura
            </button>

            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-baddia-ink text-white rounded-full text-[10px] font-display font-black uppercase tracking-widest">
                  {isPro ? "✨ Lectura completa" : "🔒 Pro · 7 secciones"}
                </span>
                {!isPro && (
                  <span className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-hot">
                    bloqueado
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {PRO_META.map(({ key, label, Icon, color }, i) => {
                  const text = reading.sections?.[key] ?? "";
                  const tilt = i % 2 === 0 ? "-rotate-[1deg]" : "rotate-[1deg]";
                  return (
                    <button
                      key={key}
                      onClick={() => !isPro && openPaywall()}
                      className={`relative text-left group ${!isPro ? tilt : ""} active:translate-x-[2px] active:translate-y-[2px] transition-transform`}
                    >
                      <span className="absolute inset-0 bg-baddia-ink rounded-2xl translate-x-1 translate-y-1 group-active:translate-x-0 group-active:translate-y-0 transition-transform" />
                      <div className="relative bg-white border-[2.5px] border-baddia-ink rounded-2xl p-3 overflow-hidden min-h-[130px]">
                        {/* corner accent */}
                        <span className={`absolute -top-6 -right-6 w-16 h-16 rounded-full ${color} opacity-70`} />

                        {/* lock badge */}
                        {!isPro && (
                          <span className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-baddia-ink border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)]">
                            <Lock size={11} className="text-baddia-yellow" />
                          </span>
                        )}

                        <span className={`relative inline-flex w-9 h-9 rounded-xl ${color} border-2 border-baddia-ink items-center justify-center mb-2 shadow-[2px_2px_0_hsl(260_16%_15%)]`}>
                          <Icon size={16} className="text-baddia-ink" strokeWidth={2.5} />
                        </span>

                        <p className="relative font-display font-black italic text-baddia-ink text-[15px] leading-none">
                          {label}
                        </p>

                        <p
                          className={`relative text-[11px] leading-snug mt-1.5 text-baddia-ink/75 font-medium ${
                            isPro ? "" : "blur-[4px] select-none"
                          }`}
                        >
                          {isPro
                            ? text
                            : "Mensaje completo de Baddia, basado en las líneas de tu palma ✨"}
                        </p>

                        {!isPro && (
                          <p className="relative mt-2 text-[9px] font-display font-black uppercase tracking-[0.15em] text-baddia-hot">
                            ✦ Desbloquear
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {!isPro && (
                <button
                  onClick={openPaywall}
                  className="relative w-full mt-4 group active:translate-x-[2px] active:translate-y-[2px] transition-transform"
                >
                  <span className="absolute inset-0 bg-baddia-ink rounded-2xl translate-x-1.5 translate-y-1.5 group-active:translate-x-0 group-active:translate-y-0 transition-transform" />
                  <span className="relative flex items-center justify-center gap-2 bg-gradient-glow text-white py-4 px-6 rounded-2xl border-[2.5px] border-baddia-ink">
                    <span className="font-display font-black text-[13px] uppercase tracking-widest">
                      ✨ Ver mi lectura completa
                    </span>
                  </span>
                </button>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
}
