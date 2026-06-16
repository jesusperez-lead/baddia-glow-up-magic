import { useMemo, useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { computeDailyVibe } from "@/lib/baddia-daily";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { SpeechBubble } from "../SpeechBubble";
import { ShareGlowSheet } from "../ShareGlowSheet";
import { Share2, Lock, ArrowRight } from "lucide-react";


export function FirstReading() {
  const { user, go, openPaywall } = useBaddia();
  const vibe = useMemo(() => computeDailyVibe(user), [user]);
  const scorePct = vibe.glowScore / 100;
  const dash = 314;
  const [shareOpen, setShareOpen] = useState(false);


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
        {/* Glow Score — sticker card, high readability */}
        <div className="relative animate-slide-up">
          {/* Floating label chip */}
          <div className="absolute -top-3 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(48_100%_59%)]">
              ✦ Glow Score
            </span>
          </div>

          <div className="relative rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden">
            {/* soft gradient halo behind ring */}
            <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-gradient-hot opacity-20 blur-2xl pointer-events-none" />
            <span className="absolute top-3 right-4 text-baddia-yellow text-lg animate-pulse">✦</span>

            <div className="flex items-center gap-5">
              {/* Ring */}
              <div className="relative shrink-0">
                <svg width="116" height="116" viewBox="0 0 120 120" className="-rotate-90">
                  <circle cx="60" cy="60" r="50" stroke="hsl(48 100% 90%)" strokeWidth="14" fill="none" />
                  <circle
                    cx="60" cy="60" r="50"
                    stroke="hsl(48 100% 59%)" strokeWidth="14" fill="none" strokeLinecap="round"
                    strokeDasharray={dash}
                    strokeDashoffset={dash - dash * scorePct}
                    style={{ transition: "stroke-dashoffset 0.8s ease", filter: "drop-shadow(0 2px 0 hsl(260 16% 15% / 0.15))" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display font-black text-[42px] leading-none text-baddia-ink drop-shadow-[1px_2px_0_hsl(48_100%_70%)]">
                    {vibe.glowScore}
                  </span>
                  <span className="mt-1 inline-flex items-center gap-0.5 rounded-full bg-baddia-ink text-white text-[8px] font-black uppercase tracking-[0.14em] px-2 py-[3px]">
                    <span className="text-baddia-yellow">✦</span> /100
                  </span>
                </div>
              </div>

              {/* Copy */}
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-[20px] leading-tight text-baddia-ink">
                  {vibe.glowLabel}
                </p>
                <p className="text-[14px] leading-snug mt-1.5 text-baddia-ink/70 font-medium">
                  {vibe.glowMsg}
                </p>
              </div>
            </div>

            {/* Bottom percent tag */}
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-baddia-yellow border-2 border-baddia-ink px-3 py-1 shadow-[2px_2px_0_hsl(260_16%_15%)]">
              <span className="text-sm">💫</span>
              <span className="text-[12px] font-display font-bold text-baddia-ink">
                Tu glow cósmico está en {vibe.glowScore}%
              </span>
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

        <p className="text-[11px] text-center text-baddia-ink/50 font-semibold px-6 pt-6 leading-relaxed">
          Esto es magia para inspirarte y mimarte ✨ disfrútalo con cariño y siempre confía en tu propia intuición 💖
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
            onClick={() => setShareOpen(true)}
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
