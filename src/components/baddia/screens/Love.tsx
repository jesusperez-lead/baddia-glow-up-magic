import { useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ArrowLeft, Lock, Heart, Sparkles as Sp, ArrowRight } from "lucide-react";

type SubKey = "crush" | "compat" | "signo" | "ex" | "mensaje" | "consejo";

const SUB_CARDS: {
  key: SubKey;
  label: string;
  emoji: string;
  quote: string;
  bg: string;
  accent: string;
  last?: boolean;
}[] = [
  { key: "compat",  label: "Compatibilidad",      emoji: "💞", quote: "¿Match real o solo química?",      bg: "bg-baddia-hot text-white",         accent: "bg-baddia-yellow" },
  { key: "signo",   label: "Qué signo te piensa", emoji: "🔮", quote: "Alguien te tiene en la mente.",    bg: "bg-baddia-lavender text-white",    accent: "bg-baddia-bubble" },
  { key: "ex",      label: "Energía de tu ex",    emoji: "👻", quote: "¿Te piensa o ya cerró?",           bg: "bg-baddia-ink text-white",         accent: "bg-baddia-yellow" },
  { key: "mensaje", label: "Mensaje oculto",      emoji: "💌", quote: "El universo te dejó un mensaje.",  bg: "bg-baddia-mint text-baddia-ink",   accent: "bg-baddia-hot" },
  { key: "consejo", label: "Consejo amoroso",     emoji: "💋", quote: "Magnetiza, no persigas.",          bg: "bg-baddia-yellow text-baddia-ink", accent: "bg-baddia-lavender", last: true },
];

export function Love() {
  const [sub, setSub] = useState<SubKey | null>(null);

  if (sub === "crush")   return <CrushEnergy onBack={() => setSub(null)} />;
  if (sub === "compat")  return <Compatibilidad onBack={() => setSub(null)} />;
  if (sub === "signo")   return <QueSignoTePiensa onBack={() => setSub(null)} />;
  if (sub === "ex")      return <EnergiaEx onBack={() => setSub(null)} />;
  if (sub === "mensaje") return <MensajeOculto onBack={() => setSub(null)} />;
  if (sub === "consejo") return <ConsejoAmoroso onBack={() => setSub(null)} />;

  return <LoveHome onOpen={setSub} />;
}

/* ─────────────── Helpers ─────────────── */

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

function PageShell({
  chip,
  chipBg = "bg-baddia-hot text-white",
  title,
  subtitle,
  onBack,
  children,
}: {
  chip: string;
  chipBg?: string;
  title: React.ReactNode;
  subtitle: string;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-full bg-white pb-12 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/25" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-soft/30" style={{ animationDelay: "4s" }} />
      <div className="blob top-[700px] -left-10 w-56 h-56 bg-baddia-hot/15" style={{ animationDelay: "2s" }} />
      <SparklesDeco />

      <header className="relative z-10 px-6 pt-8 pb-2">
        {onBack && (
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center mb-3 active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
            aria-label="Volver"
          >
            <ArrowLeft size={16} className="text-baddia-ink" />
          </button>
        )}
        <span className={`inline-block rounded-full ${chipBg} border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider`}>
          {chip}
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          {title}
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">{subtitle}</p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">{children}</div>
    </div>
  );
}

function ProLockCard({ label }: { label: string }) {
  const { openPaywall } = useBaddia();
  return (
    <button
      onClick={openPaywall}
      className="relative w-full text-left active:scale-[0.99] transition-transform"
    >
      <div className="absolute -top-3 left-5 z-10">
        <span className="inline-flex items-center gap-1 rounded-full bg-baddia-gold text-baddia-ink border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1">
          <Lock size={10} /> Pro
        </span>
      </div>
      <div className="rounded-3xl bg-gradient-to-br from-baddia-gold/25 via-pink-100 to-baddia-soft/40 border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] flex items-center justify-between gap-3">
        <p className="font-display font-black text-baddia-ink text-[15px] leading-snug flex-1">
          {label}
        </p>
        <ArrowRight size={18} className="text-baddia-ink shrink-0" />
      </div>
    </button>
  );
}

function StickyInput({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55 ml-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5 w-full bg-white rounded-2xl px-4 py-3 text-baddia-ink font-display font-bold placeholder:text-baddia-ink/30 border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none focus:-translate-y-0.5 focus:shadow-[4px_5px_0_hsl(260_16%_15%)] transition-all"
      />
    </div>
  );
}

function PrimaryBtn({
  children, onClick, disabled,
}: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="btn-sticker w-full py-3.5 rounded-full bg-gradient-hot text-white text-[14px] flex items-center justify-center gap-2"
    >
      {children}
    </button>
  );
}

function ResultSticker({
  chip, children, gradient = "gradient-bg-baddia",
}: { chip: string; children: React.ReactNode; gradient?: string }) {
  return (
    <div className="relative animate-pop-in">
      <div className="absolute -top-3 left-5 z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(48_100%_59%)] rotate-1">
          ✦ {chip}
        </span>
      </div>
      <div className={`relative rounded-3xl border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden ${gradient} text-white`}>
        <span className="absolute -top-3 -right-2 text-7xl opacity-20 select-none">✦</span>
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}

/* ─────────────── Home ─────────────── */

function LoveHome({ onOpen }: { onOpen: (k: SubKey) => void }) {
  const { user, openPaywall } = useBaddia();

  return (
    <PageShell
      chip="💌 baddia love"
      chipBg="bg-baddia-hot text-white"
      title={<>Hola, <span className="gradient-text">{user.name}</span> 💖</>}
      subtitle="Tu radar amoroso del día — leído para ti."
    >
      {/* HERO Crush Energy */}
      <SectionLabel emoji="🔥" text="lectura del día" />
      <button
        onClick={() => onOpen("crush")}
        className="relative w-full text-left active:scale-[0.99] transition-transform animate-slide-up"
      >
        <div className="absolute -top-3 left-5 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-yellow text-baddia-ink border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
            ✦ crush energy
          </span>
        </div>
        <div className="relative rounded-3xl border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden gradient-bg-hot text-white">
          <span className="absolute -top-3 -right-2 text-7xl opacity-25 select-none">💌</span>
          <p className="relative font-display font-black text-[22px] leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
            Descubre qué siente sin escribirle primero.
          </p>
          <div className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white text-baddia-ink px-4 py-2 text-[12px] font-display font-black border-2 border-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)]">
            Leer mi crush <ArrowRight size={13} />
          </div>
        </div>
      </button>

      {/* Funciones */}
      <SectionLabel emoji="💞" text="tus funciones de amor" />
      <div className="grid grid-cols-2 gap-3">
        {SUB_CARDS.map((c) => (
          <button
            key={c.key}
            onClick={() => onOpen(c.key)}
            className={`relative text-left rounded-3xl border-[2.5px] border-baddia-ink ${c.bg} px-4 pt-3 pb-7 shadow-[4px_5px_0_hsl(260_16%_15%)] active:scale-[0.97] transition-transform overflow-hidden ${c.last ? "col-span-2" : ""} min-h-[150px] flex flex-col`}
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-baddia-ink/85 text-white px-2 py-0.5 text-[9px] font-display font-black uppercase tracking-widest self-start">
              {c.label}
            </span>
            <p
              className={`font-display font-black leading-[1.1] mt-3 ${c.last ? "text-[24px]" : "text-[17px]"}`}
              style={{ textWrap: "balance" as any }}
            >
              "{c.quote}"
            </p>
            <span className={`absolute -bottom-3 right-4 inline-flex items-center justify-center min-w-10 h-9 px-2 rounded-full border-[2.5px] border-baddia-ink ${c.accent} text-lg shadow-[2px_2px_0_hsl(260_16%_15%)] rotate-[-6deg]`}>
              {c.emoji}
            </span>
          </button>
        ))}
      </div>

      {/* Pro principal */}
      <SectionLabel emoji="🔒" text="lectura profunda" />
      <button
        onClick={openPaywall}
        className="relative w-full text-left active:scale-[0.99] transition-transform"
      >
        <div className="absolute -top-3 left-5 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-gold text-baddia-ink border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
            <Lock size={10} /> Baddia Pro
          </span>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-baddia-gold/30 via-pink-100 to-baddia-soft/40 border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)]">
          <p className="font-display font-black text-baddia-ink text-[19px] leading-snug">
            Desbloquea <span className="gradient-text">qué siente, qué piensa</span> y si volverá a buscarte ✨
          </p>
          <div className="btn-sticker w-full mt-4 py-3 rounded-full bg-gradient-hot text-white text-[13px] flex items-center justify-center gap-1.5">
            <Lock size={13} /> Desbloquear con Baddia Pro <ArrowRight size={14} />
          </div>
        </div>
      </button>

      <p className="text-[11px] text-center text-baddia-ink/50 font-semibold px-6 pt-3 leading-relaxed">
        Hecho con IA y mucho amor ✨ úsalo para inspirarte y confiar en tu intuición 💖
      </p>
    </PageShell>
  );
}

/* ─────────────── Crush Energy ─────────────── */

function CrushEnergy({ onBack }: { onBack: () => void }) {
  const [crush, setCrush] = useState("");
  const [crushDate, setCrushDate] = useState("");
  const [revealed, setRevealed] = useState(false);

  return (
    <PageShell
      onBack={onBack}
      chip="💌 crush energy"
      chipBg="bg-baddia-hot text-white"
      title={<>Crush <span className="gradient-text">Energy</span> ✨</>}
      subtitle="Descubre qué siente sin escribirle primero."
    >
      <SectionLabel emoji="✏️" text="cuéntame de tu crush" />

      <div className="relative">
        <div className="absolute -top-3 left-5 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-bubble text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1">
            💖 datos del crush
          </span>
        </div>
        <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-4">
          <StickyInput
            label="Nombre o inicial de tu crush"
            value={crush}
            onChange={setCrush}
            placeholder="Ej. L o Lucas"
          />
          <StickyInput
            label="Fecha de nacimiento (opcional)"
            value={crushDate}
            onChange={setCrushDate}
            placeholder="DD / MM / AAAA"
          />
          <PrimaryBtn disabled={!crush.trim()} onClick={() => setRevealed(true)}>
            <Sp size={16} /> Revelar energía
          </PrimaryBtn>
        </div>
      </div>

      {revealed && (
        <>
          <SectionLabel emoji="✨" text="tu lectura gratis" />
          <ResultSticker chip="lectura del día" gradient="gradient-bg-baddia">
            <p className="font-display font-bold text-[18px] leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              Hay <b>curiosidad, deseo y un poquito de orgullo</b>. No escribas dos veces, deja que tu energía hable.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/40 px-3 py-1 text-[10px] font-display font-black uppercase tracking-wider">
              <Heart size={10} /> energía del crush
            </div>
          </ResultSticker>
        </>
      )}

      <SectionLabel emoji="🔒" text="lectura completa · pro" />
      <ProLockCard label="¿Qué siente realmente por ti? 💗" />
      <ProLockCard label="¿Qué está pensando ahora mismo? 🧠" />
      <ProLockCard label="¿Volverá a buscarte esta semana? 🔮" />
    </PageShell>
  );
}

/* ─────────────── Compatibilidad ─────────────── */

function Compatibilidad({ onBack }: { onBack: () => void }) {
  const { user } = useBaddia();
  const [otherName, setOtherName] = useState("");
  const [otherSign, setOtherSign] = useState("");
  const [done, setDone] = useState(false);
  const score = 87;

  return (
    <PageShell
      onBack={onBack}
      chip="💞 compatibilidad"
      chipBg="bg-baddia-hot text-white"
      title={<>¿<span className="gradient-text">Match real</span> o solo química?</>}
      subtitle="Tu energía + la suya, leídas juntas."
    >
      <SectionLabel emoji="✏️" text="cuéntame de ustedes" />
      <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-4">
        <StickyInput label="Su nombre o inicial" value={otherName} onChange={setOtherName} placeholder="Ej. M" />
        <StickyInput label="Su signo (opcional)" value={otherSign} onChange={setOtherSign} placeholder="Ej. Escorpio" />
        <PrimaryBtn disabled={!otherName.trim()} onClick={() => setDone(true)}>
          💘 Calcular match
        </PrimaryBtn>
      </div>

      {done && (
        <>
          <SectionLabel emoji="✨" text="su compatibilidad" />
          <ResultSticker chip={`${user.sign} × ${otherSign || "?"}`} gradient="gradient-bg-hot">
            <p className="font-display font-black text-[44px] leading-none">{score}% 💖</p>
            <div className="mt-3 h-2 rounded-full border-2 border-white/60 bg-white/20 overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${score}%` }} />
            </div>
            <p className="font-display font-bold text-[15px] mt-3 leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              Hay <b>chispa real</b>. Energías que se atraen sin esfuerzo, pero con egos parecidos.
            </p>
          </ResultSticker>
        </>
      )}

      <SectionLabel emoji="🔒" text="análisis completo · pro" />
      <ProLockCard label="Compatibilidad detallada: amor, sexo y futuro 🔥" />
      <ProLockCard label="Carta completa de pareja con consejos 💌" />
    </PageShell>
  );
}

/* ─────────────── Qué signo te piensa ─────────────── */

function QueSignoTePiensa({ onBack }: { onBack: () => void }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <PageShell
      onBack={onBack}
      chip="🔮 qué signo te piensa"
      chipBg="bg-baddia-lavender text-white"
      title={<>Alguien <span className="gradient-text">te piensa</span> hoy ✨</>}
      subtitle="El universo te susurra una inicial."
    >
      <SectionLabel emoji="🌙" text="revela el signo" />
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="relative w-full active:scale-[0.98] transition-transform"
        >
          <div className="rounded-3xl border-[2.5px] border-baddia-ink p-8 shadow-[5px_6px_0_hsl(260_16%_15%)] gradient-bg-baddia text-white text-center">
            <p className="text-6xl animate-breathe">🔮</p>
            <p className="font-display font-black text-[20px] mt-3">Toca la bola</p>
            <p className="text-[12px] font-semibold opacity-85 mt-1">Revelar el signo que te piensa</p>
          </div>
        </button>
      ) : (
        <ResultSticker chip="signo revelado" gradient="gradient-bg-baddia">
          <p className="text-6xl text-center">♏</p>
          <p className="font-display font-black text-[24px] mt-2 text-center">Escorpio</p>
          <p className="font-display font-bold text-[15px] mt-3 leading-snug text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            Un <b>Escorpio</b> piensa en ti con intensidad. No te lo dirá, pero te observa.
          </p>
        </ResultSticker>
      )}

      <SectionLabel emoji="🔒" text="lectura completa · pro" />
      <ProLockCard label="Ver inicial del nombre y mensaje exacto 💌" />
      <ProLockCard label="¿Te escribirá esta semana? 📲" />
    </PageShell>
  );
}

/* ─────────────── Energía de tu ex ─────────────── */

function EnergiaEx({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);

  return (
    <PageShell
      onBack={onBack}
      chip="👻 energía de tu ex"
      chipBg="bg-baddia-ink text-white"
      title={<>¿Te piensa o <span className="gradient-text">ya cerró</span>? 👀</>}
      subtitle="Lee su energía sin escribirle."
    >
      <SectionLabel emoji="✏️" text="solo necesito una pista" />
      <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-4">
        <StickyInput label="Inicial de tu ex" value={name} onChange={setName} placeholder="Ej. J" />
        <PrimaryBtn disabled={!name.trim()} onClick={() => setDone(true)}>
          👻 Leer su energía
        </PrimaryBtn>
      </div>

      {done && (
        <>
          <SectionLabel emoji="✨" text="su energía hoy" />
          <ResultSticker chip="lectura gratis" gradient="gradient-bg-baddia">
            <p className="font-display font-bold text-[18px] leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              Su energía está <b>inquieta</b>. Te recuerda en silencio, pero el orgullo le pesa más que el cariño.
            </p>
          </ResultSticker>
        </>
      )}

      <SectionLabel emoji="🔒" text="lectura completa · pro" />
      <ProLockCard label="¿Volverá a escribirte? 📲" />
      <ProLockCard label="¿Está con alguien más? 💔" />
      <ProLockCard label="Ritual para cerrar el ciclo 🕯️" />
    </PageShell>
  );
}

/* ─────────────── Mensaje oculto ─────────────── */

function MensajeOculto({ onBack }: { onBack: () => void }) {
  const [opened, setOpened] = useState(false);

  return (
    <PageShell
      onBack={onBack}
      chip="💌 mensaje oculto"
      chipBg="bg-baddia-mint text-white"
      title={<>El universo te dejó un <span className="gradient-text">mensaje</span></>}
      subtitle="Ábrelo. Es para ti, hoy. 💖"
    >
      <SectionLabel emoji="💌" text="abre tu sobre" />
      {!opened ? (
        <button
          onClick={() => setOpened(true)}
          className="relative w-full active:scale-[0.97] transition-transform"
        >
          <div className="rounded-3xl border-[2.5px] border-baddia-ink p-10 shadow-[5px_6px_0_hsl(260_16%_15%)] bg-gradient-to-br from-baddia-hot/20 via-pink-100 to-baddia-soft/50 text-center">
            <p className="text-7xl animate-pulse">💌</p>
            <p className="font-display font-black text-[20px] text-baddia-ink mt-4">Abrir mensaje</p>
            <p className="text-[12px] font-semibold text-baddia-ink/65 mt-1">Toca para revelar</p>
          </div>
        </button>
      ) : (
        <ResultSticker chip="para ti, hoy" gradient="gradient-bg-hot">
          <p className="font-display font-bold text-[19px] leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            "Lo que es para ti, <b>te va a buscar</b>. No fuerces lo que ya está vibrando hacia ti."
          </p>
        </ResultSticker>
      )}

      <SectionLabel emoji="🔒" text="mensajes especiales · pro" />
      <ProLockCard label="Mensaje personalizado con tu nombre y signo 💌" />
      <ProLockCard label="Mensaje secreto de tu crush 🔒" />
    </PageShell>
  );
}

/* ─────────────── Consejo amoroso ─────────────── */

function ConsejoAmoroso({ onBack }: { onBack: () => void }) {
  return (
    <PageShell
      onBack={onBack}
      chip="💋 consejo amoroso"
      chipBg="bg-baddia-yellow text-baddia-ink"
      title={<>Tu <span className="gradient-text">consejo</span> de hoy 💖</>}
      subtitle="Tu mentora baddie te lo dice clarito."
    >
      <SectionLabel emoji="💋" text="tu consejo del día" />
      <ResultSticker chip="frase del día" gradient="gradient-bg-baddia">
        <p className="font-display font-bold text-[20px] leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
          No bajes tu energía para encajar en alguien. <b>Magnetiza, no persigas.</b> 💖
        </p>
      </ResultSticker>

      <SectionLabel emoji="✨" text="tu mantra" />
      <div className="relative">
        <div className="absolute -top-3 left-5 z-10">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-lavender text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] rotate-1">
            ✦ mantra
          </span>
        </div>
        <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)]">
          <p className="font-display font-black text-baddia-ink text-[20px] leading-snug">
            "Mi amor propio es mi mejor hechizo." ✨
          </p>
        </div>
      </div>

      <SectionLabel emoji="🔒" text="ritual completo · pro" />
      <ProLockCard label="Consejo personalizado según tu situación 💞" />
      <ProLockCard label="Ritual de amor propio (3 días) 🕯️" />
    </PageShell>
  );
}
