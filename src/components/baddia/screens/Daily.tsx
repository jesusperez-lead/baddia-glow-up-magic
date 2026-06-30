import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ShareGlowSheet } from "../ShareGlowSheet";
import { Share2, Bookmark, Lock, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Daily() {
  const { user, setUser, openPaywall, go } = useBaddia();
  const isPro = user.plan !== "Free";
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [tarotFlipped, setTarotFlipped] = useState(false);
  const quote = "Tu trabajo no es tu personalidad.";
  const scorePct = 0.87;
  const dash = 314;


  return (
    <div className="relative min-h-full bg-white pb-10 overflow-hidden">
      {/* background blobs */}
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/20" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-soft/25" style={{ animationDelay: "4s" }} />
      <div className="blob top-[700px] -left-10 w-56 h-56 bg-baddia-gold/20" style={{ animationDelay: "2s" }} />
      <SparklesDeco />

      {/* Header */}
      <header className="relative z-10 px-6 pt-8 pb-2">
        <span className="inline-block rounded-full bg-baddia-yellow border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold text-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider">
          ✨ baddia daily
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          Hola, <span className="gradient-text">{user.name}</span> ✨
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Baddia leyó tu energía de hoy.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* ───── Section: racha glow ───── */}
        <SectionLabel emoji="🌸" text="tu racha glow" />
        <ManifestCTA onOpen={() => go("manifest")} />

        {/* ───── Section: tu energía ───── */}
        <SectionLabel emoji="✨" text="tu energía de hoy" />


        {/* Glow Score */}
        <div className="relative animate-slide-up">
          <div className="absolute -top-3 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(48_100%_59%)]">
              ✦ Glow Score
            </span>
          </div>
          <div className="relative rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden">
            <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-gradient-hot opacity-20 blur-2xl pointer-events-none" />
            <span className="absolute top-3 right-4 text-baddia-yellow text-lg animate-pulse">✦</span>
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <svg width="108" height="108" viewBox="0 0 120 120" className="-rotate-90">
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
                  <span className="font-display font-black text-[38px] leading-none text-baddia-ink drop-shadow-[1px_2px_0_hsl(48_100%_70%)]">87</span>
                  <span className="mt-1 inline-flex items-center gap-0.5 rounded-full bg-baddia-ink text-white text-[8px] font-black uppercase tracking-[0.14em] px-2 py-[3px]">
                    <span className="text-baddia-yellow">✦</span> /100
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-[18px] leading-tight text-baddia-ink">
                  Tu glow cósmico está alto
                </p>
                <p className="text-[13px] leading-snug mt-1.5 text-baddia-ink/70 font-medium">
                  Hoy tienes energía magnética. No persigas atención, atráela.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mini stats row: Color + Lucky numbers */}
        <div className="grid grid-cols-2 gap-3">
          {/* Color of the day */}
          <div className="relative">
            <div className="absolute -top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-baddia-lavender text-white px-2 py-1 text-[9px] font-display font-bold uppercase tracking-wider shadow-[2px_2px_0_hsl(260_16%_15%)] rotate-1">
                🎨 color
              </span>
            </div>
            <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-3 pt-5 shadow-[5px_6px_0_hsl(260_16%_15%)] h-full flex flex-col items-center text-center">
              <div
                className="w-14 h-14 rounded-2xl border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] mb-2"
                style={{ background: "linear-gradient(135deg,#FFD6E0,#FF9BAF)" }}
              />
              <p className="font-display font-black text-[15px] text-baddia-ink leading-tight">
                Rosa cuarzo
              </p>
              <p className="text-[10.5px] text-baddia-ink/65 font-semibold mt-1 leading-tight">
                Ropa, uñas, makeup o wallpaper.
              </p>
            </div>
          </div>

          {/* Lucky numbers */}
          <div className="relative">
            <div className="absolute -top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 rounded-full bg-baddia-mint text-white px-2 py-1 text-[9px] font-display font-bold uppercase tracking-wider shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1">
                🍀 lucky
              </span>
            </div>
            <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-3 pt-5 shadow-[5px_6px_0_hsl(260_16%_15%)] h-full flex flex-col items-center justify-between">
              <div className="flex gap-1.5 justify-center">
                {[
                  { n: "7", bg: "bg-baddia-yellow" },
                  { n: "11", bg: "bg-baddia-bubble" },
                  { n: "24", bg: "bg-baddia-lime" },
                ].map((item) => (
                  <div
                    key={item.n}
                    className={`w-10 h-12 rounded-xl ${item.bg} border-2 border-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] flex items-center justify-center font-display font-black text-lg text-baddia-ink`}
                  >
                    {item.n}
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-baddia-ink/60 font-semibold mt-2 text-center leading-tight">
                Tus números mágicos ✨
              </p>
            </div>
          </div>
        </div>

        {/* ───── Section: mini ritual ───── */}
        <SectionLabel emoji="💖" text="para mimarte hoy" />

        {/* Advice */}
        <div className="relative">
          <div className="absolute -top-3 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-hot text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1">
              💬 frase del día
            </span>
          </div>
          <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)]">
            <p className="font-display font-bold text-[20px] text-baddia-ink leading-snug">
              "{quote}"
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  if (!saved) {
                    setUser({ savedQuotes: [...user.savedQuotes, quote] });
                    setSaved(true);
                    toast.success("Frase guardada ✨");
                  }
                }}
                className="btn-sticker flex-1 py-2.5 rounded-full bg-white text-baddia-ink text-[12px] flex items-center justify-center gap-1.5"
              >
                {saved ? <Check size={14} /> : <Bookmark size={14} />} {saved ? "Guardada" : "Guardar"}
              </button>
              <button
                onClick={() => setShareOpen(true)}
                className="btn-sticker flex-1 py-2.5 rounded-full bg-gradient-hot text-white text-[12px] flex items-center justify-center gap-1.5"
              >
                <Share2 size={14} /> Compartir
              </button>
            </div>
          </div>
        </div>

        {/* Moon message */}
        <div className="relative">
          <div className="absolute -top-3 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(256_90%_68%)] rotate-1">
              🌙 mensaje de la luna
            </span>
          </div>
          <div className="relative rounded-3xl border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden gradient-bg-baddia text-white">
            <span className="absolute -top-4 -right-2 text-7xl opacity-25 select-none">🌙</span>
            <p className="font-display font-bold text-[19px] leading-snug relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              "No bajes tu energía para encajar."
            </p>
          </div>
        </div>

        {/* ───── Section: signo + cartas ───── */}
        <SectionLabel emoji="🌌" text="signos & cartas" />

        {/* Mini horóscopo */}
        <div className="relative">
          <div className="absolute -top-3 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-lavender text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1">
              ♎ mini horóscopo
            </span>
          </div>
          <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)]">
            <div className="flex items-center gap-4">
              <div className="shrink-0 w-14 h-14 rounded-2xl border-2 border-baddia-ink bg-gradient-to-br from-baddia-lavender to-baddia-bubble flex items-center justify-center text-3xl shadow-[2px_2px_0_hsl(260_16%_15%)]">
                ♎
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-display font-black text-[15px] text-baddia-ink leading-none">Libra</p>
                  <p className="text-[10px] font-semibold text-baddia-ink/55 leading-none">23 sep — 22 oct</p>
                </div>
                <p className="font-display font-bold text-[14px] text-baddia-ink leading-snug">
                  Día de equilibrio y amor propio — di que sí solo a lo que te suma.
                </p>
                <p className="text-[11px] text-baddia-yellow font-bold mt-1.5 tracking-wider">★★★★☆</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tarot diario básico */}
        <div className="relative">
          <div className="absolute -top-3 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(48_100%_59%)] rotate-1">
              🔮 tarot del día
            </span>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-pink-50 via-white to-baddia-soft/30 border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)]">
            <div className="flex items-center gap-4">
              {/* Card flip */}
              <button
                onClick={() => setTarotFlipped((v) => !v)}
                className="shrink-0 relative w-[88px] h-[128px] [perspective:900px] active:scale-95 transition-transform"
                aria-label="Voltear carta"
              >
                <div
                  className="absolute inset-0 transition-transform duration-700 [transform-style:preserve-3d]"
                  style={{ transform: tarotFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                >
                  {/* Back */}
                  <div className="absolute inset-0 rounded-xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-baddia-lavender via-baddia-hot to-baddia-yellow shadow-[3px_4px_0_hsl(260_16%_15%)] [backface-visibility:hidden] flex items-center justify-center">
                    <span className="text-3xl drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)]">✦</span>
                    <span className="absolute inset-1.5 rounded-lg border border-white/40" />
                  </div>
                  {/* Front */}
                  <div
                    className="absolute inset-0 rounded-xl border-[2.5px] border-baddia-ink bg-white shadow-[3px_4px_0_hsl(260_16%_15%)] [backface-visibility:hidden] flex flex-col items-center justify-between p-2"
                    style={{ transform: "rotateY(180deg)" }}
                  >
                    <span className="text-[8px] font-display font-black text-baddia-ink/60">XVII</span>
                    <span className="text-4xl">⭐</span>
                    <span className="text-[8px] font-display font-black uppercase tracking-wider text-baddia-ink text-center leading-tight">
                      La Estrella
                    </span>
                  </div>
                </div>
              </button>

              <div className="min-w-0 flex-1">
                {!tarotFlipped ? (
                  <>
                    <p className="font-display font-black text-[15px] text-baddia-ink leading-tight">
                      Tu carta de hoy te espera ✨
                    </p>
                    <p className="text-[12px] text-baddia-ink/65 font-semibold mt-1 leading-snug">
                      Toca la carta para revelar tu mensaje del día.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-display font-black text-[15px] text-baddia-ink leading-tight">
                      La Estrella ⭐
                    </p>
                    <p className="text-[12px] text-baddia-ink/70 font-semibold mt-1 leading-snug">
                      Esperanza, claridad y renovación. Confía en lo que estás construyendo.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* CTA Pro */}
            <button
              onClick={() => (isPro ? go("tarot") : openPaywall())}
              className={`mt-4 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-full text-[12px] font-display font-bold border-2 border-baddia-ink active:scale-[0.98] transition-transform ${
                isPro
                  ? "bg-gradient-hot text-white shadow-[3px_3px_0_hsl(260_16%_15%)]"
                  : "bg-baddia-ink text-white shadow-[3px_3px_0_hsl(48_100%_59%)]"
              }`}
            >
              {isPro ? (
                <>
                  <span className="text-base">🔮</span> Abrir tirada de 3 cartas <ArrowRight size={13} />
                </>
              ) : (
                <>
                  <Lock size={13} /> Tirada de 3 cartas · Pro <ArrowRight size={13} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* ───── Section: Pro ───── */}
        <SectionLabel emoji="🔮" text="tu lectura completa" />

        {/* Pro teaser */}
        <button
          onClick={openPaywall}
          className="relative w-full text-left active:scale-[0.99] transition-transform"
        >
          <div className="absolute -top-3 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-gold text-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
              <Lock size={10} /> Baddia Pro
            </span>
          </div>
          <div className="rounded-3xl bg-gradient-to-br from-baddia-gold/30 via-pink-100 to-baddia-soft/40 border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)]">
            <p className="font-display font-black text-baddia-ink text-[19px] leading-snug">
              Tu lectura de <span className="gradient-text">amor, dinero y futuro</span> está lista ✨
            </p>
            <div className="btn-sticker w-full mt-4 py-3 rounded-full bg-gradient-hot text-white text-[13px] flex items-center justify-center gap-1.5">
              <Lock size={13} /> Desbloquear con Baddia Pro <ArrowRight size={14} />
            </div>
          </div>
        </button>

        <p className="text-[11px] text-center text-baddia-ink/50 font-semibold px-6 pt-3 leading-relaxed">
          Hecho con IA y mucho amor ✨ úsalo para inspirarte, mimarte y confiar en tu propia intuición 💖
        </p>
      </div>
      <ShareGlowSheet open={shareOpen} onClose={() => setShareOpen(false)} quote={quote} />
    </div>
  );
}

function SectionLabel({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-2 pt-1 pl-1">
      <span className="text-base">{emoji}</span>
      <p className="font-display font-black text-[12px] uppercase tracking-[0.15em] text-baddia-ink/70">
        {text}
      </p>
      <span className="h-[2px] flex-1 bg-baddia-ink/15 rounded-full" />
    </div>
  );
}
