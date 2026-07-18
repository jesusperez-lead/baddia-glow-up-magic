import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ShareGlowSheet } from "../ShareGlowSheet";
import { GlitterWelcome } from "../GlitterWelcome";
import { DailyQuoteReveal } from "../DailyQuoteReveal";
import { BaddiaTutorial, hasSeenTutorial } from "../BaddiaTutorial";
import { Share2, Bookmark, Lock, Check, ArrowRight, Flame, Sparkles, Phone, X, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";


export function Daily() {
  const { user, setUser, openPaywall, go } = useBaddia();
  const isPro = user.plan !== "Free";
  const [saved, setSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [tarotFlipped, setTarotFlipped] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showQuoteReveal, setShowQuoteReveal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const quote = "Lo que es para mí, me encuentra con claridad, paz y abundancia.";
  const scorePct = 0.87;
  const dash = 314;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromWelcome = sessionStorage.getItem("baddia_welcome_glitter") === "1";
    if (fromWelcome) {
      sessionStorage.removeItem("baddia_welcome_glitter");
      setShowWelcome(true);
    }
    if (sessionStorage.getItem("baddia_quote_shown") !== "1") {
      sessionStorage.setItem("baddia_quote_shown", "1");
      // let the glitter welcome breathe first if it's playing
      const delay = fromWelcome ? 2900 : 350;
      const t = setTimeout(() => setShowQuoteReveal(true), delay);
      return () => clearTimeout(t);
    }
    if (!hasSeenTutorial()) {
      const t2 = setTimeout(() => setShowTutorial(true), fromWelcome ? 3400 : 1600);
      return () => clearTimeout(t2);
    }
  }, []);


  return (
    <div className="relative min-h-full bg-white pb-10 overflow-hidden">
      {showWelcome && <GlitterWelcome name={user.name} onDone={() => setShowWelcome(false)} /> }
      {showQuoteReveal && (
        <DailyQuoteReveal
          quote={quote}
          name={user.name}
          onClose={() => setShowQuoteReveal(false)}
          onShare={() => setShareOpen(true)}
        />
      )}
      {showTutorial && <BaddiaTutorial onClose={() => setShowTutorial(false)} />}
      {/* background blobs */}
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/20" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-soft/25" style={{ animationDelay: "4s" }} />
      <div className="blob top-[700px] -left-10 w-56 h-56 bg-baddia-gold/20" style={{ animationDelay: "2s" }} />
      <SparklesDeco />

      {/* Header */}
      <header className="relative z-10 px-6 pt-8 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block rounded-full bg-baddia-yellow border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold text-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 uppercase tracking-wider">
            ✨ baddia daily
          </span>
          <button
            onClick={() => setShowTutorial(true)}
            aria-label="Ver tutorial"
            className="ml-auto inline-flex items-center gap-1 rounded-full bg-white border-2 border-baddia-ink px-2.5 py-1 text-[10px] font-display font-black text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-0.5"
          >
            <HelpCircle size={12} /> tour
          </button>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
              Hola, <span className="gradient-text">{user.name}</span> ✨
            </h1>
            <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
              Baddia leyó tu energía de hoy.
            </p>
          </div>
          <button
            onClick={() => (isPro ? go("journal") : openPaywall())}
            aria-label="Abrir mi diario"
            className="shrink-0 relative group"
          >
            <span className="absolute -top-2 -right-2 z-10 inline-flex items-center justify-center rounded-full bg-baddia-hot text-white border-2 border-baddia-ink w-6 h-6 text-[9px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] rotate-[8deg]">
              {isPro ? "✎" : <Lock size={9} />}
            </span>
            <div
              className="w-[62px] h-[68px] rounded-xl border-[2.5px] border-baddia-ink shadow-[4px_5px_0_hsl(260_16%_15%)] flex flex-col items-center justify-center gap-0.5 -rotate-[6deg] active:translate-y-[2px] active:shadow-[2px_2px_0_hsl(260_16%_15%)] transition-all"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, #fffdf7 0px, #fffdf7 9px, hsl(335 60% 85% / 0.55) 10px)",
              }}
            >
              <span className="text-[22px] leading-none">📓</span>
              <span className="font-display font-black text-[8px] uppercase tracking-wider text-baddia-ink">
                diario
              </span>
            </div>
          </button>
        </div>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* ───── Section: racha glow ───── */}
        <SectionLabel emoji="🌸" text="tu racha glow" />
        <PhoneVerifyWidget />
        <ManifestCTA onOpen={() => go("manifest")} />

        {/* Cómo atraer — mazo mágico */}
        <button
          onClick={() => go("attract")}
          className="relative w-full text-left rounded-3xl border-[2.5px] border-baddia-ink p-4 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden active:translate-y-0.5 transition"
          style={{ background: "linear-gradient(135deg,#2E1A47 0%,#8B63F7 50%,#FF7AC8 100%)" }}
        >
          <span className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-baddia-yellow/40 blur-2xl" />
          <span className="absolute top-2 right-3 text-baddia-yellow text-lg animate-sparkle-spin">✦</span>
          <span className="absolute bottom-2 left-3 text-white/70 text-sm animate-sparkle-spin" style={{ animationDelay: "1s" }}>✧</span>
          <div className="relative flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-2xl border-2 border-baddia-ink bg-white/95 flex items-center justify-center rotate-[-6deg] shadow-[3px_3px_0_hsl(48_100%_59%)] animate-float-cute">
              <span className="text-2xl">🔮</span>
              <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 border-baddia-ink bg-baddia-yellow text-baddia-ink text-[9px] font-display font-black flex items-center justify-center rotate-6">
                ✨
              </span>
            </div>
            <div className="flex-1 min-w-0 text-white">
              <span className="inline-block px-2 py-0.5 rounded-full bg-white/25 border border-white/40 text-[9px] font-display font-black uppercase tracking-widest">
                nuevo · mazo mágico
              </span>
              <p className="font-serif-display italic font-black text-[19px] leading-tight mt-1">
                Cómo atraer ✦
              </p>
              <p className="text-[11px] font-medium italic opacity-90 mt-0.5">
                Amor, dinero, paz, glow… toca una carta y revela tu mensaje.
              </p>
            </div>
          </div>
        </button>

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
                className="w-14 h-14 rounded-2xl border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] mb-2 relative overflow-hidden animate-pulse-slow"
                style={{ background: "linear-gradient(135deg, hsl(335 100% 59%), hsl(325 100% 74%))" }}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-white/10" />
                <div className="absolute -inset-3 rounded-full bg-baddia-hot/40 blur-xl pointer-events-none" />
              </div>
              <p className="font-display font-black text-[15px] text-baddia-ink leading-tight">
                Rosa neon
              </p>
              <p className="text-[10.5px] text-baddia-ink/65 font-semibold mt-1 leading-tight">
                Viste tu energía: ropa, uñas, makeup o wallpaper.
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

        {/* ───── Section: comparte ───── */}
        <SectionLabel emoji="💌" text="para ti hoy" />
        <button
          onClick={() => go("share")}
          className="relative w-full text-left active:scale-[0.99] transition-transform"
        >
          <div className="rounded-3xl bg-gradient-to-br from-baddia-yellow/40 via-pink-50 to-baddia-lavender/30 border-[2.5px] border-baddia-ink p-4 shadow-[5px_6px_0_hsl(260_16%_15%)] flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-black text-[14px] text-baddia-ink leading-tight">Comparte tu glow</p>
              <p className="text-[11px] text-baddia-ink/65 font-semibold">Cartas cute 9:16 y 4:5 para Stories</p>
            </div>
            <ArrowRight size={16} className="text-baddia-ink" />
          </div>
        </button>

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

function PhoneVerifyWidget() {
  const { go, user } = useBaddia();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem("baddia_dismiss_phone_verify") === "1") {
      setDismissed(true);
    }
  }, []);

  if (user.phoneVerified || dismissed) return null;

  return (
    <div className="relative animate-slide-up">
      <button
        onClick={() => {
          window.localStorage.setItem("baddia_dismiss_phone_verify", "1");
          setDismissed(true);
        }}
        aria-label="Cerrar"
        className="absolute -top-2 -right-2 z-20 w-7 h-7 rounded-full bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] active:scale-95 transition-transform"
      >
        <X size={14} className="text-baddia-ink" />
      </button>
      <div className="rounded-3xl border-[2.5px] border-baddia-ink p-4 pt-5 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden bg-gradient-to-br from-baddia-lavender via-baddia-bubble to-baddia-soft text-white">
        <span className="absolute top-3 right-8 text-lg animate-pulse">✨</span>
        <span className="absolute bottom-2 right-4 text-xl opacity-30">💖</span>
        <div className="flex items-start gap-3 relative">
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-white border-[2.5px] border-baddia-ink flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)]">
            <Phone size={20} className="text-baddia-lavender" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display font-black text-[16px] leading-tight">
              Protege tu cuenta ✨
            </p>
            <p className="text-[12px] font-semibold leading-snug mt-1 opacity-90">
              Verifica tu número para guardar tu glow y acceder desde cualquier lado.
            </p>
            <button
              onClick={() => go("phone-verify")}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white text-baddia-ink border-2 border-baddia-ink px-3 py-1.5 text-[11px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
            >
              <Sparkles size={12} className="text-baddia-hot" /> Verificar ahora
            </button>
          </div>
        </div>
      </div>
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

function MiniCard({ emoji, label, bg, onClick }: { emoji: string; label: string; bg: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl border-[2.5px] border-baddia-ink ${bg} px-2 py-3 shadow-[3px_4px_0_hsl(260_16%_15%)] active:scale-[0.97] transition-transform flex flex-col items-center text-center gap-1 min-h-[92px]`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="font-display font-black text-[10.5px] leading-tight">{label}</span>
    </button>
  );
}


/* ─────────── Manifest CTA card (Racha Glow) ─────────── */
const MANIFEST_KEY = "baddia.manifest.v1";
const todayKey = () => new Date().toISOString().slice(0, 10);

function ManifestCTA({ onOpen }: { onOpen: () => void }) {
  const [state, setState] = useState<{
    intention?: string;
    streak: number;
    doneToday: boolean;
  }>({ streak: 0, doneToday: false });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MANIFEST_KEY);
      if (!raw) return;
      const m = JSON.parse(raw);
      const days: string[] = m?.daysCompleted ?? [];
      const today = todayKey();
      // streak = consecutive days ending today/yesterday
      const set = new Set(days);
      let streak = 0;
      const d = new Date();
      if (!set.has(today)) d.setDate(d.getDate() - 1);
      while (set.has(d.toISOString().slice(0, 10))) {
        streak++;
        d.setDate(d.getDate() - 1);
      }
      setState({
        intention: m?.intention,
        streak,
        doneToday: set.has(today),
      });
    } catch {}
  }, []);

  const hasIntention = !!state.intention;

  return (
    <button
      onClick={onOpen}
      className="relative w-full text-left active:scale-[0.99] transition-transform animate-slide-up"
    >
      <div className="absolute -top-3 left-5 z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-bubble text-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2 border-2 border-baddia-ink">
          🌸 racha glow
        </span>
      </div>
      {/* floating sticker */}
      <span className="absolute -top-4 right-4 z-10 text-2xl rotate-12 animate-float-cute select-none">✨</span>

      <div className="relative rounded-3xl border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden bg-gradient-to-br from-pink-100 via-white to-baddia-lavender/30">
        <span className="absolute -bottom-10 -right-8 w-44 h-44 rounded-full bg-baddia-hot/15 blur-2xl pointer-events-none" />

        {hasIntention ? (
          <>
            <div className="flex items-start gap-3 relative">
              <div className="shrink-0 relative w-14 h-14 rounded-2xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-baddia-yellow to-baddia-hot shadow-[3px_3px_0_hsl(260_16%_15%)] flex flex-col items-center justify-center">
                <Flame size={18} className="text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.3)]" />
                <span className="font-display font-black text-[14px] text-white leading-none mt-0.5">
                  {state.streak}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-display font-black uppercase tracking-wider text-baddia-ink/55">
                  tu intención
                </p>
                <p className="font-display font-bold text-[14px] text-baddia-ink leading-snug mt-0.5 line-clamp-2">
                  "{state.intention}"
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2">
              <p className="text-[12px] font-display font-bold text-baddia-ink/70 inline-flex items-center gap-1.5">
                {state.doneToday ? (
                  <>
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-baddia-mint border-[1.5px] border-baddia-ink">
                      <Check size={10} strokeWidth={3} className="text-baddia-ink" />
                    </span>
                    Ritual de hoy completo
                  </>
                ) : (
                  <>
                    <Sparkles size={12} className="text-baddia-hot" />
                    Tu ritual de hoy te espera
                  </>
                )}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[11px] font-display font-bold shadow-[2px_2px_0_hsl(48_100%_59%)]">
                Abrir <ArrowRight size={12} />
              </span>
            </div>
          </>
        ) : (
          <>
            <p className="font-display font-black text-[20px] text-baddia-ink leading-tight">
              Manifiesta tu <span className="gradient-text">glow</span> ✨
            </p>
            <p className="text-[12.5px] text-baddia-ink/70 font-semibold mt-1.5 leading-snug">
              Escribe lo que quieres atraer y arma una racha diaria de afirmaciones, visualización y rituales cute.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="btn-sticker py-2.5 px-4 rounded-full bg-gradient-hot text-white text-[12px] flex items-center gap-1.5">
                <Sparkles size={13} /> Empezar mi racha <ArrowRight size={13} />
              </span>
              <span className="text-[11px] font-display font-bold text-baddia-ink/55">
                3 pasos · 2 min al día
              </span>
            </div>
          </>
        )}
      </div>
    </button>
  );
}

