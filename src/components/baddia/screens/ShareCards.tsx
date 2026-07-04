import { useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ArrowLeft, Lock, Share2, ArrowRight } from "lucide-react";
import { ShareGlowSheet } from "../ShareGlowSheet";

type Item = {
  key: string;
  emoji: string;
  title: string;
  quote: string;
  bg: string;
  pro?: boolean;
};

const ITEMS: Item[] = [
  { key: "glow",   emoji: "✨", title: "Glow Score",       quote: "Mi Glow Score de hoy es 87% ✨", bg: "bg-baddia-hot text-white" },
  { key: "color",  emoji: "🎨", title: "Color del día",    quote: "Color de hoy: Rosa cuarzo · Baddia dice: no persigas, atrae.", bg: "bg-baddia-bubble text-white" },
  { key: "lucky",  emoji: "🍀", title: "Lucky Number",     quote: "Mi número de suerte: 11 · Lucky Girl Energy 💖", bg: "bg-baddia-mint text-baddia-ink" },
  { key: "phrase", emoji: "💬", title: "Frase diaria",     quote: "Lo que es para mí, me encuentra con claridad, paz y abundancia.", bg: "bg-baddia-yellow text-baddia-ink" },
  { key: "aura",   emoji: "👁️", title: "Aura",             quote: "Mi aura hoy: Rosa cuarzo · alta vibra 💗", bg: "bg-baddia-lavender text-white", pro: true },
  { key: "tarot",  emoji: "🔮", title: "Tarot",            quote: "Mi carta de hoy: La Estrella ⭐ · esperanza y claridad.", bg: "bg-baddia-ink text-white", pro: true },
  { key: "crush",  emoji: "💌", title: "Crush Energy",     quote: "Su energía por mí: curiosidad + deseo 💖", bg: "bg-baddia-hot text-white", pro: true },
  { key: "flags",  emoji: "🚩", title: "Red / Green Flags", quote: "Su energía: 72% green · 28% red ✨", bg: "bg-baddia-bubble text-white", pro: true },
  { key: "dream",  emoji: "🌙", title: "Sueño",            quote: "Mi sueño de hoy: transición emocional 🌙", bg: "bg-baddia-lavender text-white", pro: true },
];

export function ShareCards() {
  const { user, openPaywall, go } = useBaddia();
  const isPro = user.plan !== "Free";
  const [openQuote, setOpenQuote] = useState<string | null>(null);

  return (
    <div className="relative min-h-full bg-white pb-12 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/25" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-soft/30" style={{ animationDelay: "4s" }} />
      <SparklesDeco />

      <header className="relative z-10 px-6 pt-8 pb-2">
        <button
          onClick={() => go("daily")}
          className="w-10 h-10 rounded-full bg-white border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center mb-3 active:translate-y-[2px] transition-all"
          aria-label="Volver"
        >
          <ArrowLeft size={16} className="text-baddia-ink" />
        </button>
        <span className="inline-block rounded-full bg-baddia-yellow text-baddia-ink border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider">
          ✨ share cards
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          Comparte tu <span className="gradient-text">glow</span>
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Cartas cute 9:16 y 4:5 listas para Stories, TikTok y WhatsApp.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 grid grid-cols-2 gap-3">
        {ITEMS.map((it) => {
          const locked = it.pro && !isPro;
          return (
            <button
              key={it.key}
              onClick={() => (locked ? openPaywall() : setOpenQuote(it.quote))}
              className={`relative text-left rounded-3xl border-[2.5px] border-baddia-ink ${it.bg} px-4 pt-3 pb-6 shadow-[4px_5px_0_hsl(260_16%_15%)] active:scale-[0.97] transition-transform overflow-hidden min-h-[160px] flex flex-col`}
            >
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full bg-baddia-ink/85 text-white px-2 py-0.5 text-[9px] font-display font-black uppercase tracking-widest">
                  {it.title}
                </span>
                {locked && (
                  <span className="inline-flex items-center rounded-full bg-baddia-gold text-baddia-ink border border-baddia-ink px-1.5 py-0.5 text-[8px] font-display font-black">
                    <Lock size={8} />
                  </span>
                )}
              </div>
              <p className="font-display font-black leading-[1.15] mt-3 text-[14px]">
                "{it.quote}"
              </p>
              <span className="absolute -bottom-3 right-4 inline-flex items-center justify-center min-w-10 h-9 px-2 rounded-full border-[2.5px] border-baddia-ink bg-white text-lg shadow-[2px_2px_0_hsl(260_16%_15%)] rotate-[-6deg]">
                {it.emoji}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative z-10 px-5 mt-6 space-y-3">
        <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-4 shadow-[5px_6px_0_hsl(260_16%_15%)] flex items-center gap-3">
          <span className="text-2xl">📐</span>
          <div className="flex-1 min-w-0">
            <p className="font-display font-black text-[13px] text-baddia-ink">Formatos listos</p>
            <p className="text-[11px] text-baddia-ink/65 font-semibold">Story 9:16 · Feed 4:5 · WhatsApp</p>
          </div>
          <Share2 size={16} className="text-baddia-hot" />
        </div>

        {!isPro && (
          <button
            onClick={openPaywall}
            className="relative w-full text-left active:scale-[0.99] transition-transform"
          >
            <div className="absolute -top-3 left-5 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-gold text-baddia-ink border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
                <Lock size={10} /> Más plantillas
              </span>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-baddia-gold/30 via-pink-100 to-baddia-soft/40 border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)]">
              <p className="font-display font-black text-baddia-ink text-[17px] leading-snug">
                Desbloquea Mystic Girl, Moon Message, Tarot Cute, Main Character y más ✨
              </p>
              <div className="btn-sticker w-full mt-4 py-3 rounded-full bg-gradient-hot text-white text-[13px] flex items-center justify-center gap-1.5">
                <Lock size={13} /> Desbloquear con Baddia Pro <ArrowRight size={14} />
              </div>
            </div>
          </button>
        )}
      </div>

      <ShareGlowSheet
        open={!!openQuote}
        onClose={() => setOpenQuote(null)}
        quote={openQuote ?? undefined}
      />
    </div>
  );
}
