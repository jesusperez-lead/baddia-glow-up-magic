import { useBaddia } from "@/lib/baddia-state";
import { Share2, Bookmark, Lock, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Daily() {
  const { user, setUser, openPaywall } = useBaddia();
  const [saved, setSaved] = useState(false);
  const quote = "Tu trabajo no es tu personalidad.";

  return (
    <div className="relative min-h-full gradient-bg-soft pb-6">
      <header className="px-5 pt-8 pb-2">
        <p className="text-baddia-purple/70 text-sm font-semibold">Hola,</p>
        <h1 className="font-display font-black text-3xl text-baddia-purple">
          {user.name} <span className="inline-block animate-twinkle">✨</span>
        </h1>
        <p className="text-sm text-baddia-purple/70 mt-1">Baddia leyó tu energía de hoy.</p>
      </header>

      <div className="px-5 space-y-4 mt-4">
        {/* Glow Score */}
        <div className="baddia-card bg-gradient-glow text-white relative overflow-hidden">
          <span className="absolute top-2 right-3 text-baddia-gold text-xl animate-twinkle">✦</span>
          <div className="flex items-center gap-4">
            <div className="relative">
              <svg width="84" height="84" viewBox="0 0 84 84" className="-rotate-90">
                <circle cx="42" cy="42" r="34" stroke="rgba(255,255,255,0.25)" strokeWidth="8" fill="none" />
                <circle cx="42" cy="42" r="34" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round"
                  strokeDasharray={213} strokeDashoffset={213 - (213 * 0.87)} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-display font-black text-xl">87</div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-90 font-bold">Glow Score</p>
              <p className="font-display font-black text-xl leading-tight mt-1">¡Tu glow está alto!</p>
              <p className="text-xs opacity-90 mt-1">Hoy magnetizas más de lo que crees.</p>
            </div>
          </div>
        </div>

        {/* Advice */}
        <div className="baddia-sticker relative">
          <span className="chip bg-pink-100 text-baddia-hot mb-2">💬 Consejo del día</span>
          <p className="font-display font-black text-xl text-baddia-purple leading-snug">"{quote}"</p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => {
                if (!saved) { setUser({ savedQuotes: [...user.savedQuotes, quote] }); setSaved(true); toast.success("Frase guardada ✨"); }
              }}
              className="flex-1 py-2.5 rounded-xl bg-pink-50 text-baddia-hot font-semibold text-sm flex items-center justify-center gap-1.5"
            >
              {saved ? <Check size={14} /> : <Bookmark size={14} />} {saved ? "Guardada" : "Guardar frase"}
            </button>
            <button
              onClick={() => toast("Compartido en tu energía ✨")}
              className="flex-1 py-2.5 rounded-xl bg-baddia-lavender/30 text-baddia-purple font-semibold text-sm flex items-center justify-center gap-1.5"
            >
              <Share2 size={14} /> Compartir
            </button>
          </div>
        </div>

        {/* Color */}
        <div className="baddia-card bg-white flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl shadow-soft shrink-0" style={{ background: "linear-gradient(135deg,#FFD6E0,#FF9BAF)" }} />
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-baddia-purple/60">Color de hoy</p>
            <p className="font-display font-bold text-lg text-baddia-purple">Rosa cuarzo</p>
            <p className="text-xs text-baddia-purple/70 mt-0.5">Úsalo en ropa, uñas, maquillaje o fondo de pantalla.</p>
          </div>
        </div>

        {/* Lucky numbers */}
        <div className="baddia-card bg-gradient-gold/30">
          <p className="text-[10px] uppercase font-bold tracking-wider text-baddia-purple/70">🍀 Números de suerte</p>
          <div className="flex gap-2 mt-3">
            {["7", "11", "24"].map((n) => (
              <div key={n} className="flex-1 aspect-square rounded-2xl bg-white shadow-soft flex items-center justify-center font-display font-black text-2xl text-baddia-purple">
                {n}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-baddia-purple/60 mt-3 text-center">
            Números simbólicos de entretenimiento.
          </p>
        </div>

        {/* Moon message */}
        <div className="baddia-card gradient-bg-night text-white relative overflow-hidden">
          <span className="absolute -top-4 -right-4 text-7xl opacity-30">🌙</span>
          <p className="chip bg-white/15 text-white mb-2 relative">La luna te dice</p>
          <p className="font-display font-bold text-lg leading-snug relative">
            "No bajes tu energía para encajar."
          </p>
        </div>

        {/* Pro teaser */}
        <button
          onClick={openPaywall}
          className="w-full text-left baddia-card bg-white border-2 border-baddia-gold/60 relative overflow-hidden active:scale-[0.99] transition-transform"
        >
          <span className="absolute top-3 right-3 chip bg-baddia-gold/30 text-baddia-purple"><Lock size={10} /> Pro</span>
          <p className="chip bg-pink-100 text-baddia-hot mb-2">✨ Lectura completa</p>
          <p className="font-display font-bold text-baddia-purple text-lg leading-snug">
            Tu lectura completa de amor, dinero y futuro está lista.
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-baddia-hot font-bold text-sm">
            Desbloquear con Baddia Pro →
          </div>
        </button>

        <p className="text-[10px] text-center text-muted-foreground pt-2">
          Lecturas creadas con IA para entretenimiento y amor propio.
        </p>
      </div>
    </div>
  );
}
