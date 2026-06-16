import { useBaddia } from "@/lib/baddia-state";
import { Sparkles } from "../PhoneFrame";
import { SpeechBubble } from "../SpeechBubble";
import { Share2, Lock, ArrowRight } from "lucide-react";

export function FirstReading() {
  const { user, go, openPaywall } = useBaddia();
  return (
    <div className="relative min-h-full bg-baddia-pearl pb-10 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/40" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-soft/55" style={{ animationDelay: "4s" }} />
      <Sparkles />

      <header className="relative z-10 px-6 pt-8 pb-2 text-center">
        <span className="inline-block rounded-full bg-baddia-yellow border-2 border-baddia-ink px-3 py-1.5 text-xs font-display font-bold text-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3">
          ✨ tu primera lectura
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          Baddia leyó tu energía de hoy,<br />
          <span className="gradient-text">{user.name}</span>.
        </h1>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-4">
        {/* Glow Score */}
        <div className="relative rounded-3xl bg-gradient-hot text-white p-5 overflow-hidden shadow-glow animate-slide-up">
          <span className="absolute top-3 right-4 text-baddia-yellow animate-pulse">✦</span>
          <span className="absolute bottom-3 left-4 text-white/60">✧</span>
          <p className="text-[11px] font-display font-bold uppercase tracking-widest opacity-90">Glow Score</p>
          <div className="my-3 flex items-center gap-5">
            <div className="relative">
              <svg width="110" height="110" viewBox="0 0 120 120" className="-rotate-90">
                <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.25)" strokeWidth="12" fill="none" />
                <circle cx="60" cy="60" r="50" stroke="white" strokeWidth="12" fill="none" strokeLinecap="round"
                  strokeDasharray={314} strokeDashoffset={314 - (314 * 0.87)} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-bold text-4xl leading-none">87</span>
                <span className="text-[10px] uppercase tracking-wider opacity-80">cósmico</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-lg leading-tight">Glow alto ✨</p>
              <p className="text-[13px] opacity-90 leading-snug mt-1">
                Estás magnetizando bonito hoy. Confía en lo que sientes.
              </p>
            </div>
          </div>
        </div>

        {/* Consejo */}
        <div className="baddia-sticker animate-slide-up" style={{ animationDelay: "0.08s" }}>
          <span className="chip bg-baddia-hot text-white mb-2">💬 consejo gratis del día</span>
          <p className="font-display font-bold text-xl text-baddia-ink leading-snug">
            "Tu trabajo no es tu personalidad."
          </p>
        </div>

        {/* Two cards */}
        <div className="grid grid-cols-2 gap-3 animate-slide-up" style={{ animationDelay: "0.16s" }}>
          <div className="rounded-3xl bg-white border-2 border-baddia-ink/10 p-4 shadow-card">
            <p className="text-[10px] uppercase font-display font-bold tracking-wider text-baddia-ink/50">Color de hoy</p>
            <div className="my-2 h-14 rounded-2xl border-2 border-white shadow-inner" style={{ background: "linear-gradient(135deg,#FFD6E6,#FF7AC8)" }} />
            <p className="font-display font-bold text-baddia-ink">Rosa cuarzo</p>
          </div>
          <div className="rounded-3xl bg-baddia-lime border-2 border-baddia-ink p-4 shadow-[3px_3px_0_hsl(260_16%_15%)]">
            <p className="text-[10px] uppercase font-display font-bold tracking-wider text-baddia-ink/60">Lucky #</p>
            <p className="font-display font-bold text-6xl my-1 text-baddia-ink leading-none">11</p>
            <p className="text-[10px] text-baddia-ink/60 font-bold">símbolo de tu día</p>
          </div>
        </div>

        {/* Mood */}
        <div className="rounded-3xl bg-baddia-ink text-white p-5 animate-slide-up shadow-card" style={{ animationDelay: "0.24s" }}>
          <span className="chip bg-baddia-yellow text-baddia-ink mb-2">🌙 mood zodiacal</span>
          <p className="text-[15px] leading-relaxed mt-1">
            Hoy tu energía está conectada con{" "}
            <span className="font-display font-bold text-baddia-yellow">amor propio, límites y confianza</span>.
          </p>
        </div>

        <p className="text-[10px] text-center text-baddia-ink/40 font-semibold px-4 pt-1">
          Solo entretenimiento ✨ — los lucky numbers y lecturas no sustituyen consejo profesional.
        </p>
      </div>

      <div className="relative z-10 px-5 mt-6 space-y-3">
        <button
          onClick={openPaywall}
          className="cta-glow w-full py-[16px] rounded-full bg-gradient-hot text-white font-display font-bold flex items-center justify-center gap-2"
        >
          <Lock size={16} /> Ver lectura completa
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button className="py-3.5 rounded-full bg-white border-2 border-baddia-ink/10 text-baddia-ink font-display font-bold text-sm flex items-center justify-center gap-1.5">
            <Share2 size={14} /> Compartir
          </button>
          <button
            onClick={() => go("daily")}
            className="py-3.5 rounded-full bg-baddia-ink text-white font-display font-bold text-sm flex items-center justify-center gap-1.5"
          >
            Mi Daily <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
