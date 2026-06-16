import { useBaddia } from "@/lib/baddia-state";
import { Check, Lock, Sparkles, X } from "lucide-react";

const FEATURES = [
  "Lecturas ilimitadas",
  "Palm Reading completo",
  "Crush Energy completa",
  "Compatibilidad amorosa",
  "Tarot completo",
  "Aura Check completo",
  "Numerología completa",
  "Reporte mensual",
  "Rituales personalizados",
  "Historial completo",
];

export function Paywall() {
  const { paywallOpen, closePaywall, setUser } = useBaddia();
  if (!paywallOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-baddia-purple/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full md:max-w-[400px] bg-gradient-pearl rounded-t-[2.5rem] md:rounded-[2.5rem] max-h-[92vh] overflow-y-auto scrollbar-hide animate-scale-in relative">
        {/* glow header */}
        <div className="relative gradient-bg-night text-white p-6 pt-8 rounded-t-[2.5rem] overflow-hidden">
          <button
            onClick={closePaywall}
            aria-label="Cerrar"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center"
          >
            <X size={18} />
          </button>
          <span className="sparkle top-2 right-16 text-baddia-gold text-2xl animate-twinkle">✦</span>
          <span className="sparkle bottom-3 left-8 text-baddia-gold text-xl animate-twinkle" style={{ animationDelay: "0.7s" }}>✧</span>
          <div className="inline-flex items-center gap-1.5 chip bg-white/15 text-white mb-3">
            <Sparkles size={12} /> Baddia Pro
          </div>
          <h2 className="font-display font-black text-3xl leading-tight">
            Desbloquea tu lectura completa
          </h2>
          <p className="mt-2 text-white/85 text-sm">
            Baddia Pro incluye amor, dinero, suerte, futuro y crush energy completa.
          </p>
        </div>

        <div className="p-6 space-y-2">
          {FEATURES.map((f) => (
            <div key={f} className="flex items-center gap-3 py-1.5">
              <span className="w-6 h-6 rounded-full bg-gradient-glow flex items-center justify-center shadow-soft">
                <Check size={14} strokeWidth={3} className="text-white" />
              </span>
              <span className="text-sm font-semibold text-baddia-purple">{f}</span>
            </div>
          ))}
        </div>

        <div className="px-6 pb-8 space-y-3">
          <button
            onClick={() => { setUser({ plan: "Pro" }); closePaywall(); }}
            className="w-full py-4 rounded-2xl bg-gradient-glow text-white font-bold shadow-glow active:scale-[0.98] transition-transform"
          >
            ✨ Empezar Baddia Pro
          </button>
          <button
            onClick={closePaywall}
            className="w-full py-3.5 rounded-2xl bg-white border border-pink-100 text-baddia-purple font-semibold"
          >
            Seguir con versión gratis
          </button>
          <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1 pt-1">
            <Lock size={10} /> Puedes seguir usando Baddia gratis todos los días.
          </p>
        </div>
      </div>
    </div>
  );
}
