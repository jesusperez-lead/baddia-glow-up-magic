import { useMemo } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { computeDailyVibe } from "@/lib/baddia-daily";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { SpeechBubble } from "../SpeechBubble";
import { Share2, Lock, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function FirstReading() {
  const { user, go, openPaywall } = useBaddia();
  const vibe = useMemo(() => computeDailyVibe(user), [user]);
  const scorePct = vibe.glowScore / 100;
  const dash = 314;

  const handleShare = async () => {
    const text = `✨ Mi energía de hoy en Baddia: Glow ${vibe.glowScore}% · Color ${vibe.color.name} · Lucky #${vibe.luckyNumber} 💖`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Mi energía Baddia", text });
        return;
      }
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        toast({ title: "Copiado ✨", description: "Tu energía está lista para compartir." });
        return;
      }
    } catch {
      /* user cancelled */
    }
    toast({ title: "Compartir tu energía", description: text });
  };

  return (
    <div className="relative min-h-full bg-white pb-10 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/20" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-soft/25" style={{ animationDelay: "4s" }} />
      <SparklesDeco />

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
                <circle
                  cx="60" cy="60" r="50"
                  stroke="white" strokeWidth="12" fill="none" strokeLinecap="round"
                  strokeDasharray={dash}
                  strokeDashoffset={dash - dash * scorePct}
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-bold text-4xl leading-none">{vibe.glowScore}</span>
                <span className="text-[10px] uppercase tracking-wider opacity-80">cósmico</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-lg leading-tight">{vibe.glowLabel}</p>
              <p className="text-[13px] opacity-90 leading-snug mt-1">
                Tu glow cósmico está en {vibe.glowScore}%. {vibe.glowMsg}
              </p>
            </div>
          </div>
        </div>

        {/* Consejo gratis del día */}
        <div className="pt-8 animate-slide-up" style={{ animationDelay: "0.08s" }}>
          <SpeechBubble
            variant="mint"
            tailSide="left"
            topSticker={<span className="text-4xl drop-shadow-[2px_2px_0_hsl(260_16%_15%)]">⚡</span>}
          >
            <p className="text-[10px] uppercase tracking-widest font-display font-bold opacity-80 mb-2">
              💬 consejo gratis del día
            </p>
            <p className="font-display font-bold text-[26px] leading-[1.15]">
              "{vibe.advice}"
            </p>
          </SpeechBubble>
        </div>

        {/* Color + Lucky */}
        <div className="grid grid-cols-2 gap-3 pt-6 animate-slide-up" style={{ animationDelay: "0.16s" }}>
          <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-4 shadow-[4px_5px_0_hsl(260_16%_15%)]">
            <p className="text-[10px] uppercase font-display font-bold tracking-wider text-baddia-ink/60">Color de hoy</p>
            <div
              className="my-2 h-14 rounded-2xl border-2 border-baddia-ink/80"
              style={{ background: `linear-gradient(135deg, ${vibe.color.from}, ${vibe.color.to})` }}
            />
            <p className="font-display font-bold text-baddia-ink">{vibe.color.name}</p>
          </div>
          <div className="rounded-3xl bg-baddia-lime border-[2.5px] border-baddia-ink p-4 shadow-[4px_5px_0_hsl(260_16%_15%)]">
            <p className="text-[10px] uppercase font-display font-bold tracking-wider text-baddia-ink/70">Lucky #</p>
            <p className="font-display font-bold text-6xl my-1 text-baddia-ink leading-none">
              {vibe.luckyNumber}
            </p>
            <p className="text-[10px] text-baddia-ink/70 font-bold">símbolo de tu día</p>
          </div>
        </div>

        {/* Mood zodiacal */}
        <div className="pt-8 animate-slide-up" style={{ animationDelay: "0.24s" }}>
          <SpeechBubble
            variant="ink"
            tailSide="right"
            topSticker={<span className="text-3xl drop-shadow-[2px_2px_0_hsl(260_16%_15%)]">🌙</span>}
          >
            <p className="text-[10px] uppercase tracking-widest font-display font-bold text-baddia-yellow mb-2">
              mood zodiacal · {user.sign}
            </p>
            <p className="text-[16px] leading-relaxed">
              Hoy tu energía está conectada con{" "}
              <span className="font-display font-bold text-baddia-yellow">
                {vibe.moodKeywords.join(", ")}
              </span>.
            </p>
          </SpeechBubble>
        </div>

        <p className="text-[10px] text-center text-baddia-ink/40 font-semibold px-4 pt-6">
          Solo entretenimiento ✨ — los lucky numbers y lecturas no sustituyen consejo profesional.
        </p>
      </div>

      <div className="relative z-10 px-5 mt-8 space-y-3">
        <button
          onClick={openPaywall}
          className="btn-sticker w-full py-[16px] rounded-full bg-gradient-hot text-white flex items-center justify-center gap-2"
        >
          <Lock size={16} /> Ver lectura completa
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleShare}
            className="btn-sticker py-3.5 rounded-full bg-white text-baddia-ink text-sm flex items-center justify-center gap-1.5"
          >
            <Share2 size={14} /> Compartir
          </button>
          <button
            onClick={() => go("daily")}
            className="btn-sticker py-3.5 rounded-full bg-baddia-ink text-white text-sm flex items-center justify-center gap-1.5"
          >
            Mi Daily <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
