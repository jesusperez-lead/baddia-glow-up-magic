import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { Lock, ChevronDown, Heart, DollarSign, Briefcase, Zap, Clover, Calendar, Hash, Users, ArrowRight } from "lucide-react";
import { useState } from "react";

/* ─────────────── data ─────────────── */

type MoodCard = {
  key: string;
  label: string;
  emoji: string;
  Icon: any;
  quote: string;         // ⭐ mensaje protagonista
  detail: string;        // texto largo al expandir
  color: string;         // bg + texto
  accent: string;        // color del sticker emoji (esquina)
  pro: boolean;
};

const MOOD_CARDS: MoodCard[] = [
  { key: "amor",    label: "Amor",    emoji: "💖", Icon: Heart,     quote: "No persigas. Magnetiza.",          detail: "Tu energía atrae sin esfuerzo. Hoy se abre una puerta a relaciones más sanas.", color: "bg-baddia-hot text-white",          accent: "bg-baddia-yellow", pro: false },
  { key: "dinero",  label: "Dinero",  emoji: "💸", Icon: DollarSign,quote: "El dinero te busca a ti.",         detail: "Una conversación de hoy puede abrir flujo de dinero en los próximos 7 días.",  color: "bg-baddia-lime text-baddia-ink",    accent: "bg-baddia-hot",    pro: true  },
  { key: "trabajo", label: "Trabajo", emoji: "💼", Icon: Briefcase, quote: "It's just work. Don't take it personally.", detail: "Tu mente está afilada. Día perfecto para cerrar ciclos y mostrar tu valor.",   color: "bg-baddia-ink text-white",          accent: "bg-baddia-yellow", pro: true  },
  { key: "energia", label: "Energía", emoji: "⚡️", Icon: Zap,       quote: "Hoy brillas en alta definición.",  detail: "Tu aura está al 87%. Cuida tu agua, descanso y tiempo lejos del scroll.",      color: "bg-baddia-yellow text-baddia-ink",  accent: "bg-baddia-hot",    pro: false },
  { key: "suerte",  label: "Suerte",  emoji: "🍀", Icon: Clover,    quote: "El universo te debe una, y la cobra hoy.", detail: "Tus números mágicos: 3, 7, 21. El color que te potencia: rosa cuarzo.",        color: "bg-baddia-mint text-baddia-ink",    accent: "bg-baddia-lavender", pro: false },
];

const SIGN_INFO = {
  name: "Libra",
  glyph: "♎",
  element: "Aire",
  ruler: "Venus",
  range: "23 sep — 22 oct",
};

const DAILY_TEXT = "Eres Libra. Hoy tu energía pide equilibrio, belleza y límites claros. Di que sí solo a lo que te suma.";
const WEEKLY_TEASER = "Una semana de cierres y nuevas alianzas. Tus relaciones se reordenan…";
const COMPAT_TOP = [
  { sign: "Géminis",     glyph: "♊", pct: 94 },
  { sign: "Acuario",     glyph: "♒", pct: 91 },
  { sign: "Leo",         glyph: "♌", pct: 86 },
];

/* ─────────────── screen ─────────────── */

export function Zodiac() {
  const { user, openPaywall } = useBaddia();
  const isFree = user.plan === "Free";
  const [openCard, setOpenCard] = useState<string | null>("amor");
  const [openDaily, setOpenDaily] = useState(true);

  const handleCardClick = (c: MoodCard) => {
    if (c.pro && isFree) return openPaywall();
    setOpenCard((k) => (k === c.key ? null : c.key));
  };

  return (
    <div className="relative min-h-full bg-white pb-12 overflow-hidden">
      {/* background blobs */}
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-lavender/20" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-bubble/25" style={{ animationDelay: "4s" }} />
      <div className="blob top-[760px] -left-10 w-56 h-56 bg-baddia-soft/30" style={{ animationDelay: "2s" }} />
      <SparklesDeco />

      {/* Header */}
      <header className="relative z-10 px-6 pt-8 pb-2">
        <span className="inline-block rounded-full bg-baddia-lavender text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider">
          🌙 zodiac mood
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          Tu <span className="gradient-text">Zodiac Mood</span> ✨
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Tu signo, tu mood, tu semana — leído para ti.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* ───── HERO: Signo solar + mood ───── */}
        <SectionLabel emoji="☀️" text="signo solar" />
        <div className="relative animate-slide-up">
          <div className="absolute -top-3 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(260_60%_75%)]">
              ✦ tu signo
            </span>
          </div>
          <div className="relative rounded-3xl border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden gradient-bg-baddia text-white">
            <span className="absolute -bottom-6 -right-2 text-[140px] leading-none opacity-20 select-none">{SIGN_INFO.glyph}</span>
            <div className="relative flex items-center gap-4">
              <div className="shrink-0 w-16 h-16 rounded-2xl border-2 border-white/60 bg-white/15 backdrop-blur-md flex items-center justify-center text-4xl shadow-[2px_2px_0_rgba(0,0,0,0.25)]">
                {SIGN_INFO.glyph}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">signo solar</p>
                <p className="font-display font-black text-[26px] leading-none mt-0.5">Eres {SIGN_INFO.name}</p>
                <p className="text-[11px] font-semibold opacity-85 mt-1">
                  {SIGN_INFO.element} · regida por {SIGN_INFO.ruler} · {SIGN_INFO.range}
                </p>
              </div>
            </div>
            <p className="relative font-display font-bold text-[16px] leading-snug mt-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              Hoy tu energía pide <b>equilibrio, belleza y límites claros</b>.
            </p>
            {/* mood zodiacal */}
            <div className="relative flex items-center gap-2 mt-4">
              <span className="text-[10px] font-display font-black uppercase tracking-widest opacity-80">Mood zodiacal:</span>
              <span className="rounded-full bg-baddia-yellow text-baddia-ink border-2 border-baddia-ink px-2.5 py-1 text-[11px] font-display font-black uppercase shadow-[2px_2px_0_hsl(260_16%_15%)]">
                ✨ Equilibrio
              </span>
              <span className="rounded-full bg-white/15 border border-white/40 px-2 py-0.5 text-[10px] font-bold">
                87% glow
              </span>
            </div>
          </div>
        </div>

        {/* ───── MOOD CARDS ───── */}
        <SectionLabel emoji="🪄" text="tu mood por área" />
        <div className="grid grid-cols-2 gap-3">
          {MOOD_CARDS.map((c, i) => {
            const isOpen = openCard === c.key;
            const locked = c.pro && isFree;
            const last = i === MOOD_CARDS.length - 1;
            return (
              <button
                key={c.key}
                onClick={() => handleCardClick(c)}
                className={`relative text-left rounded-2xl border-[2.5px] border-baddia-ink ${c.color} p-3 shadow-[3px_4px_0_hsl(260_16%_15%)] active:scale-[0.97] transition-transform overflow-hidden ${last ? "col-span-2" : ""}`}
              >
                {locked && (
                  <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-baddia-ink/85 text-white px-1.5 py-0.5 text-[8px] font-display font-black uppercase tracking-wider">
                    <Lock size={8} /> Pro
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-2xl leading-none">{c.emoji}</span>
                  <span className="font-display font-black text-[14px] uppercase tracking-wide">{c.label}</span>
                </div>
                <p className="text-[11px] font-semibold opacity-85 mt-1 leading-snug">
                  {locked ? "Desbloquéalo con Pro" : c.vibe}
                </p>
                {isOpen && !locked && (
                  <p className="text-[11px] font-semibold mt-2 pt-2 border-t border-baddia-ink/20 leading-snug animate-fade-in">
                    {c.detail}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* ───── HORÓSCOPOS ───── */}
        <SectionLabel emoji="🔮" text="tu horóscopo" />

        {/* Diario (free) — collapsible */}
        <button
          onClick={() => setOpenDaily((v) => !v)}
          className="relative w-full text-left active:scale-[0.99] transition-transform"
        >
          <div className="absolute -top-3 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-hot text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1">
              ☀️ diario · hoy
            </span>
          </div>
          <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)]">
            <div className="flex items-start justify-between gap-3">
              <p className="font-display font-bold text-[16px] text-baddia-ink leading-snug flex-1">
                {openDaily ? DAILY_TEXT : "Toca para leer tu día completo ✨"}
              </p>
              <ChevronDown
                size={20}
                className={`shrink-0 text-baddia-ink/60 transition-transform ${openDaily ? "rotate-180" : ""}`}
              />
            </div>
            {openDaily && (
              <div className="flex gap-2 mt-3 animate-fade-in">
                <span className="rounded-full bg-baddia-yellow/40 text-baddia-ink border border-baddia-ink/20 px-2 py-0.5 text-[10px] font-bold">⭐⭐⭐⭐☆</span>
                <span className="rounded-full bg-baddia-bubble/40 text-baddia-ink border border-baddia-ink/20 px-2 py-0.5 text-[10px] font-bold">color: rosa cuarzo</span>
                <span className="rounded-full bg-baddia-mint/60 text-baddia-ink border border-baddia-ink/20 px-2 py-0.5 text-[10px] font-bold">🍀 3·7·21</span>
              </div>
            )}
          </div>
        </button>

        {/* Semanal (Pro) */}
        <ProRow
          chip="📅 semanal · pro"
          chipBg="bg-baddia-gold text-baddia-ink"
          Icon={Calendar}
          title="Tu horóscopo semanal"
          desc={WEEKLY_TEASER}
          isFree={isFree}
          onClick={openPaywall}
        />

        {/* ───── COMPATIBILIDAD ───── */}
        <SectionLabel emoji="💘" text="compatibilidad" />
        <div className="relative">
          <div className="absolute -top-3 left-5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-bubble text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] rotate-1">
              <Users size={11} /> tu match del día
            </span>
          </div>
          <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)]">
            <p className="text-[12px] font-display font-bold text-baddia-ink/65 mb-3">Top signos contigo hoy:</p>
            <div className="space-y-2">
              {COMPAT_TOP.map((m, i) => {
                const locked = isFree && i > 0;
                return (
                  <button
                    key={m.sign}
                    onClick={() => locked && openPaywall()}
                    className="w-full flex items-center gap-3 rounded-2xl border-2 border-baddia-ink bg-baddia-soft/40 px-3 py-2 active:scale-[0.98] transition-transform"
                  >
                    <span className="w-9 h-9 rounded-xl border-2 border-baddia-ink bg-white flex items-center justify-center text-xl">
                      {m.glyph}
                    </span>
                    <span className="flex-1 text-left">
                      <p className="font-display font-black text-[13px] text-baddia-ink leading-none">{m.sign}</p>
                      <p className="text-[10px] text-baddia-ink/60 font-bold uppercase tracking-wider mt-0.5">
                        {locked ? "desbloquea con pro" : "alta vibra"}
                      </p>
                    </span>
                    {locked ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-baddia-ink text-white px-2 py-1 text-[9px] font-display font-black uppercase">
                        <Lock size={9} /> Pro
                      </span>
                    ) : (
                      <span className="rounded-full bg-baddia-hot text-white px-2.5 py-1 text-[11px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)]">
                        {m.pct}%
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ───── NUMEROLOGÍA + AÑO PERSONAL ───── */}
        <SectionLabel emoji="🔢" text="numerología" />
        <div className="grid grid-cols-2 gap-3">
          {/* Número de vida (free) */}
          <div className="rounded-2xl bg-white border-[2.5px] border-baddia-ink p-4 shadow-[3px_4px_0_hsl(260_16%_15%)] flex flex-col">
            <div className="flex items-center gap-2">
              <Hash size={14} className="text-baddia-hot" />
              <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/65">Nº de vida</p>
            </div>
            <p className="font-display font-black text-[44px] leading-none mt-1 text-baddia-ink">{user.lifeNumber}</p>
            <p className="text-[11px] font-semibold text-baddia-ink/70 leading-snug mt-1">
              Maestra intuitiva — sensibilidad y guía espiritual.
            </p>
          </div>

          {/* Año personal (Pro) */}
          <button
            onClick={() => isFree && openPaywall()}
            className="relative text-left rounded-2xl bg-gradient-to-br from-baddia-gold/40 via-pink-100 to-baddia-soft border-[2.5px] border-baddia-ink p-4 shadow-[3px_4px_0_hsl(260_16%_15%)] flex flex-col active:scale-[0.97] transition-transform"
          >
            {isFree && (
              <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-baddia-ink text-white px-1.5 py-0.5 text-[8px] font-display font-black uppercase tracking-wider">
                <Lock size={8} /> Pro
              </span>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-baddia-hot" />
              <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/65">Año personal</p>
            </div>
            <p className="font-display font-black text-[44px] leading-none mt-1 text-baddia-ink">
              {isFree ? "?" : "5"}
            </p>
            <p className="text-[11px] font-semibold text-baddia-ink/70 leading-snug mt-1">
              {isFree ? "Desbloquea tu año completo." : "Año de cambios, libertad y aventuras."}
            </p>
          </button>
        </div>

        {/* CTA Pro final */}
        {isFree && (
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
              <p className="font-display font-black text-baddia-ink text-[18px] leading-snug">
                Desbloquea tu <span className="gradient-text">carta astral completa</span> ✨
              </p>
              <div className="btn-sticker w-full mt-3 py-3 rounded-full bg-gradient-hot text-white text-[13px] flex items-center justify-center gap-1.5">
                <Lock size={13} /> Activar Baddia Pro <ArrowRight size={14} />
              </div>
            </div>
          </button>
        )}

        <p className="text-[11px] text-center text-baddia-ink/55 font-semibold px-6 pt-2 leading-relaxed">
          Hecho con IA y mucho amor ✨ úsalo para inspirarte y confiar en tu intuición 💖
        </p>
      </div>
    </div>
  );
}

/* ─────────────── helpers ─────────────── */

function SectionLabel({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-2 pl-1 pt-1">
      <span className="text-base">{emoji}</span>
      <p className="font-display font-black text-[12px] uppercase tracking-[0.15em] text-baddia-ink/70">
        {text}
      </p>
      <span className="h-[2px] flex-1 bg-baddia-ink/15 rounded-full" />
    </div>
  );
}

function ProRow({
  chip, chipBg, Icon, title, desc, isFree, onClick,
}: {
  chip: string; chipBg: string; Icon: any; title: string; desc: string;
  isFree: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={() => isFree && onClick()}
      className="relative w-full text-left active:scale-[0.99] transition-transform"
    >
      <div className="absolute -top-3 left-5 z-10">
        <span className={`inline-flex items-center gap-1.5 rounded-full ${chipBg} px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1`}>
          {chip}
        </span>
      </div>
      <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)]">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-2xl border-2 border-baddia-ink bg-baddia-gold/40 flex items-center justify-center shrink-0">
            <Icon size={20} className="text-baddia-ink" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-display font-black text-[15px] text-baddia-ink leading-tight">{title}</p>
            <p className="text-[12px] text-baddia-ink/65 font-semibold leading-snug mt-0.5 line-clamp-2">{desc}</p>
          </div>
          {isFree ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-baddia-ink text-white px-2 py-1 text-[9px] font-display font-black uppercase shrink-0">
              <Lock size={9} /> Pro
            </span>
          ) : (
            <ArrowRight size={18} className="text-baddia-hot shrink-0" />
          )}
        </div>
      </div>
    </button>
  );
}
