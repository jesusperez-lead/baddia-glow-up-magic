import { useBaddia } from "@/lib/baddia-state";
import { Camera, Lock, Sun, Hand as HandIcon, Eye } from "lucide-react";

const TIPS = [
  { icon: HandIcon, text: "Abre bien la mano" },
  { icon: Sun, text: "Usa fondo claro" },
  { icon: Eye, text: "Evita sombras" },
  { icon: Camera, text: "Solo una mano por foto" },
];

const PRO_CARDS = ["Amor", "Dinero", "Trabajo", "Futuro", "Línea de vida", "Línea del corazón", "Consejo profundo"];

export function Palm() {
  const { openPaywall } = useBaddia();
  return (
    <div className="relative min-h-full gradient-bg-soft pb-6">
      <header className="px-5 pt-8 pb-4">
        <span className="chip bg-white/80 text-baddia-purple">🤲 Palm Reading</span>
        <h1 className="font-display font-black text-3xl text-baddia-purple mt-2">Palm Reading</h1>
      </header>

      <div className="px-5 space-y-4">
        <div className="baddia-card bg-white">
          <p className="font-display font-bold text-baddia-purple">
            Toma una foto clara de tu palma con buena luz. 📸
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

        <button className="w-full py-4 rounded-2xl bg-gradient-glow text-white font-bold shadow-glow flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <Camera size={18} /> Subir foto de mi mano
        </button>

        <div className="baddia-sticker bg-gradient-baddia text-white relative overflow-hidden">
          <span className="absolute top-2 right-3 text-baddia-gold text-xl animate-twinkle">✦</span>
          <p className="chip bg-white/20 text-white mb-2">Lectura gratis</p>
          <p className="font-display font-bold text-lg leading-snug">
            Baddia vio una energía fuerte de <b>transformación</b> en tu mano.
          </p>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-baddia-purple/60 mb-2 px-1">
            🔒 Lectura completa Pro
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PRO_CARDS.map((c) => (
              <button
                key={c}
                onClick={openPaywall}
                className="baddia-card bg-white relative text-left active:scale-[0.98] transition-transform"
              >
                <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-gradient-glow flex items-center justify-center shadow-soft">
                  <Lock size={12} className="text-white" />
                </span>
                <p className="font-display font-bold text-baddia-purple">{c}</p>
                <p className="text-xs text-baddia-purple/50 mt-1">Desbloquear con Pro</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
