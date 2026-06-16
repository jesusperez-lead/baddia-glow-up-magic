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

  return (
    <div className="relative min-h-full gradient-bg-soft pb-6">
      <header className="px-5 pt-8 pb-4">
        <span className="chip bg-white/80 text-baddia-purple">🤲 Lectura de mano</span>
        <h1 className="font-display font-black text-3xl text-baddia-purple mt-2">Palm Reading</h1>
        <p className="text-sm text-baddia-purple/70 mt-1">Tu palma, leída por Baddia ✨</p>
      </header>

      <div className="px-5 space-y-4">
        {/* INSTRUCCIONES */}
        {!reading && (
          <div className="baddia-card bg-white">
            <p className="font-display font-bold text-baddia-purple">
              Toma una foto clara de tu palma con buena luz 📸
            </p>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {TIPS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 rounded-2xl bg-pink-50 px-3 py-2.5">
                  <Icon size={16} className="text-baddia-hot shrink-0" />
                  <span className="text-xs font-semibold text-baddia-purple">{text}</span>
                </div>
              ))}
            </div>
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
              className="w-full py-4 rounded-2xl bg-gradient-glow text-white font-bold shadow-glow flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Sparkles size={18} className="animate-spin" />
                  Leyendo tu palma…
                </>
              ) : (
                <>
                  <Upload size={18} /> Subir foto de mi mano
                </>
              )}
            </button>
          </>
        )}

        {/* RESULTADO */}
        {reading?.valid && reading.summary && (
          <>
            <div className="baddia-sticker bg-gradient-baddia text-white relative overflow-hidden">
              <span className="absolute top-2 right-3 text-baddia-gold text-xl animate-twinkle">✦</span>
              <p className="chip bg-white/20 text-white mb-2">Lectura gratis</p>
              <p className="font-display font-bold text-lg leading-snug">
                {reading.summary}
              </p>
            </div>

            <button
              onClick={reset}
              className="w-full py-2.5 rounded-2xl bg-white border-2 border-baddia-ink text-baddia-ink text-sm font-display font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <RotateCcw size={14} /> Nueva lectura
            </button>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-baddia-purple/60 mb-2 px-1">
                {isPro ? "✨ Tu lectura completa" : "🔒 Lectura completa Pro"}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {PRO_META.map(({ key, label, Icon, color }) => {
                  const text = reading.sections?.[key] ?? "";
                  return (
                    <button
                      key={key}
                      onClick={() => !isPro && openPaywall()}
                      className="baddia-card bg-white relative text-left active:scale-[0.98] transition-transform overflow-hidden"
                    >
                      {!isPro && (
                        <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gradient-glow flex items-center justify-center shadow-soft z-10">
                          <Lock size={12} className="text-white" />
                        </span>
                      )}
                      <span className={`inline-flex w-8 h-8 rounded-xl ${color} items-center justify-center mb-2`}>
                        <Icon size={16} className="text-baddia-hot" />
                      </span>
                      <p className="font-display font-bold text-baddia-purple text-sm">{label}</p>
                      <p
                        className={`text-[11px] leading-snug mt-1 text-baddia-purple/75 ${
                          isPro ? "" : "blur-[5px] select-none"
                        }`}
                      >
                        {isPro ? text : "Mensaje completo personalizado de Baddia para ti, basado en las líneas de tu palma."}
                      </p>
                      {!isPro && (
                        <p className="text-[10px] font-bold uppercase tracking-wider text-baddia-hot mt-1.5">
                          Desbloquear con Pro
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {!isPro && (
                <button
                  onClick={openPaywall}
                  className="mt-3 w-full rounded-full bg-baddia-ink text-white py-3 text-[12px] font-display font-black uppercase tracking-widest shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
                >
                  ✨ Ver mi lectura completa con Pro
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
