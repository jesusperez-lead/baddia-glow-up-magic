import { useBaddia } from "@/lib/baddia-state";
import { Sparkles } from "../PhoneFrame";
import { Share2, Lock } from "lucide-react";

export function FirstReading() {
  const { user, go, openPaywall } = useBaddia();
  return (
    <div className="relative min-h-full gradient-bg-soft pb-10">
      <Sparkles />
      <header className="relative px-6 pt-10 pb-4 text-center">
        <span className="chip bg-white/80 text-baddia-hot mb-3">✨ Tu primera lectura</span>
        <h1 className="font-display font-black text-2xl text-baddia-purple leading-tight">
          Baddia leyó tu energía de hoy, <span className="gradient-text">{user.name}</span>.
        </h1>
      </header>

      <div className="relative px-5 space-y-4">
        {/* Glow Score */}
        <div className="baddia-card text-center bg-gradient-glow text-white relative overflow-hidden">
          <span className="absolute top-2 right-3 text-baddia-gold animate-twinkle">✦</span>
          <p className="text-xs font-bold uppercase tracking-widest opacity-90">Glow Score</p>
          <div className="my-3 relative inline-flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
              <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.25)" strokeWidth="10" fill="none" />
              <circle cx="60" cy="60" r="50" stroke="white" strokeWidth="10" fill="none" strokeLinecap="round"
                strokeDasharray={314} strokeDashoffset={314 - (314 * 0.87)} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-black text-4xl">87%</span>
              <span className="text-[10px] uppercase tracking-wider opacity-80">cósmico</span>
            </div>
          </div>
          <p className="text-sm font-semibold opacity-95">Tu glow cósmico está en 87%</p>
        </div>

        <div className="baddia-sticker">
          <p className="chip bg-pink-100 text-baddia-hot mb-2">💬 Consejo gratis del día</p>
          <p className="font-display font-black text-xl text-baddia-purple leading-snug">
            "Tu trabajo no es tu personalidad."
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="baddia-card bg-gradient-pearl">
            <p className="text-[10px] uppercase font-bold tracking-wider text-baddia-purple/60">Color de hoy</p>
            <div className="my-2 h-12 rounded-2xl" style={{ background: "linear-gradient(135deg,#FFD6E0,#FF9BAF)" }} />
            <p className="font-display font-bold text-baddia-purple">Rosa cuarzo</p>
          </div>
          <div className="baddia-card bg-gradient-gold/40 text-baddia-purple">
            <p className="text-[10px] uppercase font-bold tracking-wider text-baddia-purple/60">Número de suerte</p>
            <p className="font-display font-black text-5xl my-2 text-baddia-purple">11</p>
            <p className="text-[10px] text-baddia-purple/60">Símbolo de tu día</p>
          </div>
        </div>

        <div className="baddia-card bg-white">
          <p className="chip bg-baddia-lavender/40 text-baddia-purple mb-2">🌙 Mood zodiacal</p>
          <p className="text-baddia-purple font-medium text-[15px] leading-relaxed">
            Hoy tu energía está conectada con <b>amor propio, límites y confianza</b>.
          </p>
        </div>
      </div>

      <div className="relative px-5 mt-6 space-y-3">
        <button className="w-full py-3.5 rounded-2xl bg-white border border-pink-100 text-baddia-purple font-semibold flex items-center justify-center gap-2">
          <Share2 size={16} /> Compartir mi energía
        </button>
        <button
          onClick={openPaywall}
          className="w-full py-4 rounded-2xl bg-gradient-glow text-white font-bold shadow-glow flex items-center justify-center gap-2"
        >
          <Lock size={16} /> Ver lectura completa
        </button>
        <button
          onClick={() => go("daily")}
          className="w-full py-3.5 rounded-2xl bg-baddia-purple text-white font-semibold"
        >
          Ir a mi Baddia Daily →
        </button>
      </div>
    </div>
  );
}
