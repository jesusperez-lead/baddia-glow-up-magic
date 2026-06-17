import { useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { ArrowLeft, Heart, Lock, Sparkles as Sp } from "lucide-react";

type SubKey = "crush" | "compat" | "signo" | "ex" | "mensaje" | "consejo";

const SUB_CARDS: { key: SubKey; label: string; emoji: string; tint: string }[] = [
  { key: "compat",  label: "Compatibilidad",   emoji: "💞", tint: "from-pink-100 to-rose-100" },
  { key: "signo",   label: "Qué signo te piensa", emoji: "🔮", tint: "from-purple-100 to-pink-100" },
  { key: "ex",      label: "Energía de tu ex", emoji: "👻", tint: "from-indigo-100 to-purple-100" },
  { key: "mensaje", label: "Mensaje oculto",   emoji: "💌", tint: "from-rose-100 to-pink-100" },
  { key: "consejo", label: "Consejo amoroso",  emoji: "💋", tint: "from-pink-100 to-fuchsia-100" },
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

/* ───────────────── Home ───────────────── */
function LoveHome({ onOpen }: { onOpen: (k: SubKey) => void }) {
  const { openPaywall } = useBaddia();
  return (
    <div className="relative min-h-full gradient-bg-soft pb-6">
      <header className="px-5 pt-8 pb-4">
        <span className="chip bg-white/80 text-baddia-hot">💌 Love</span>
        <h1 className="font-display font-black text-3xl text-baddia-purple mt-2">Love</h1>
        <p className="text-sm text-baddia-purple/70 mt-1">Tu radar amoroso del día. ✨</p>
      </header>

      <div className="px-5 space-y-4">
        {/* Crush Energy destacada */}
        <button
          onClick={() => onOpen("crush")}
          className="w-full text-left baddia-card bg-gradient-glow text-white relative overflow-hidden active:scale-[0.99] transition-transform"
        >
          <span className="absolute top-2 right-3 text-baddia-gold text-xl animate-twinkle">✦</span>
          <p className="chip bg-white/20 text-white mb-2">🔥 Lectura del día</p>
          <p className="font-display font-black text-xl leading-tight">Crush Energy</p>
          <p className="text-sm text-white/85 mt-1">Descubre qué siente sin escribirle primero.</p>
        </button>

        {/* Pro principal */}
        <button
          onClick={openPaywall}
          className="w-full text-left baddia-card bg-white border-2 border-baddia-gold/60 relative active:scale-[0.99] transition-transform"
        >
          <span className="absolute top-3 right-3 chip bg-baddia-gold/30 text-baddia-purple"><Lock size={10} /> Pro</span>
          <p className="chip bg-pink-100 text-baddia-hot mb-2">🔥 Lectura profunda</p>
          <p className="font-display font-bold text-baddia-purple text-base leading-snug">
            Desbloquea para ver qué siente, qué piensa y si volverá a buscarte.
          </p>
        </button>

        <div className="grid grid-cols-2 gap-3">
          {SUB_CARDS.map((c) => (
            <button
              key={c.key}
              onClick={() => onOpen(c.key)}
              className={`baddia-card bg-gradient-to-br ${c.tint} text-left relative active:scale-[0.98] transition-transform`}
            >
              <span className="text-2xl">{c.emoji}</span>
              <p className="font-display font-bold text-baddia-purple text-sm mt-1 leading-tight">{c.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────── Shared sub-screen shell ───────────────── */
function SubShell({
  onBack, chip, title, subtitle, children,
}: { onBack: () => void; chip: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="relative min-h-full gradient-bg-soft pb-6">
      <header className="px-5 pt-8 pb-4">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border-2 border-baddia-ink flex items-center justify-center mb-3"
          style={{ boxShadow: "3px 3px 0 0 hsl(var(--ink))" }}
        >
          <ArrowLeft size={16} className="text-baddia-ink" />
        </button>
        <span className="chip bg-white/80 text-baddia-hot">{chip}</span>
        <h1 className="font-display font-black text-3xl text-baddia-purple mt-2">{title}</h1>
        <p className="text-sm text-baddia-purple/70 mt-1">{subtitle}</p>
      </header>
      <div className="px-5 space-y-4">{children}</div>
    </div>
  );
}

function ProLockCard({ label }: { label: string }) {
  const { openPaywall } = useBaddia();
  return (
    <button
      onClick={openPaywall}
      className="w-full text-left baddia-card bg-white border-2 border-baddia-gold/60 relative active:scale-[0.99] transition-transform"
    >
      <span className="absolute top-3 right-3 chip bg-baddia-gold/30 text-baddia-purple"><Lock size={10} /> Pro</span>
      <p className="font-display font-bold text-baddia-purple text-base leading-snug pr-16">{label}</p>
    </button>
  );
}

function InputField({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="text-xs font-bold text-baddia-purple/60 ml-2">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full bg-pink-50 rounded-2xl px-4 py-3 text-baddia-purple font-semibold placeholder:text-baddia-purple/30 focus:outline-none focus:ring-2 focus:ring-baddia-pink"
      />
    </div>
  );
}

/* ───────────────── Crush Energy ───────────────── */
function CrushEnergy({ onBack }: { onBack: () => void }) {
  const [crush, setCrush] = useState("");
  const [crushDate, setCrushDate] = useState("");
  const [revealed, setRevealed] = useState(false);

  return (
    <SubShell
      onBack={onBack}
      chip="💌 Crush Energy"
      title="Crush Energy"
      subtitle="Descubre qué siente sin escribirle primero. ✨"
    >
      <div className="baddia-card bg-white space-y-3">
        <InputField
          label="Nombre o inicial de tu crush"
          value={crush}
          onChange={setCrush}
          placeholder="Ej. L o Lucas"
        />
        <InputField
          label="Fecha de nacimiento (opcional)"
          value={crushDate}
          onChange={setCrushDate}
          placeholder="DD / MM / AAAA"
        />
        <button
          disabled={!crush.trim()}
          onClick={() => setRevealed(true)}
          className="w-full py-3.5 rounded-2xl bg-gradient-glow text-white font-bold shadow-glow disabled:opacity-50 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
        >
          <Sp size={16} /> Revelar energía
        </button>
      </div>

      {revealed && (
        <div className="baddia-sticker bg-gradient-baddia text-white relative overflow-hidden animate-scale-in">
          <span className="absolute top-2 right-3 text-baddia-gold text-xl animate-twinkle">✦</span>
          <p className="chip bg-white/20 text-white mb-2">
            <Heart size={10} /> Lectura gratis
          </p>
          <p className="font-display font-bold text-lg leading-snug">
            Hay <b>curiosidad, deseo y un poquito de orgullo</b>. No escribas dos veces, deja que tu energía hable.
          </p>
        </div>
      )}

      <ProLockCard label="¿Qué siente realmente por ti? 💗" />
      <ProLockCard label="¿Qué está pensando ahora mismo? 🧠" />
      <ProLockCard label="¿Volverá a buscarte esta semana? 🔮" />
    </SubShell>
  );
}

/* ───────────────── Compatibilidad ───────────────── */
function Compatibilidad({ onBack }: { onBack: () => void }) {
  const { user } = useBaddia();
  const [otherName, setOtherName] = useState("");
  const [otherSign, setOtherSign] = useState("");
  const [done, setDone] = useState(false);
  const score = 87;

  return (
    <SubShell onBack={onBack} chip="💞 Compatibilidad" title="Compatibilidad" subtitle="Tu energía + la suya. ¿Match real o solo química?">
      <div className="baddia-card bg-white space-y-3">
        <InputField label="Su nombre o inicial" value={otherName} onChange={setOtherName} placeholder="Ej. M" />
        <InputField label="Su signo (opcional)" value={otherSign} onChange={setOtherSign} placeholder="Ej. Escorpio" />
        <button
          disabled={!otherName.trim()}
          onClick={() => setDone(true)}
          className="w-full py-3.5 rounded-2xl bg-gradient-glow text-white font-bold shadow-glow disabled:opacity-50 active:scale-[0.98] transition-transform"
        >
          Calcular match 💘
        </button>
      </div>

      {done && (
        <div className="baddia-sticker bg-gradient-baddia text-white animate-scale-in">
          <p className="chip bg-white/20 text-white mb-2">{user.sign} × {otherSign || "?"}</p>
          <p className="font-display font-black text-4xl">{score}% 💖</p>
          <p className="font-display font-bold text-base mt-2 leading-snug">
            Hay <b>chispa real</b>. Energías que se atraen sin esfuerzo, pero con egos parecidos.
          </p>
        </div>
      )}

      <ProLockCard label="Compatibilidad detallada: amor, sexo y futuro 🔥" />
      <ProLockCard label="Carta completa de pareja con consejos 💌" />
    </SubShell>
  );
}

/* ───────────────── Qué signo te piensa ───────────────── */
function QueSignoTePiensa({ onBack }: { onBack: () => void }) {
  const [revealed, setRevealed] = useState(false);
  return (
    <SubShell onBack={onBack} chip="🔮 Qué signo te piensa" title="Qué signo te piensa" subtitle="Alguien tiene tu nombre en la mente hoy. ✨">
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-4 rounded-2xl bg-gradient-glow text-white font-display font-black text-lg shadow-glow active:scale-[0.98] transition-transform"
        >
          Revelar signo 🔮
        </button>
      ) : (
        <div className="baddia-sticker bg-gradient-baddia text-white animate-scale-in text-center">
          <p className="text-6xl">♏</p>
          <p className="font-display font-black text-2xl mt-2">Escorpio</p>
          <p className="font-display font-bold text-base mt-2 leading-snug">
            Un <b>Escorpio</b> piensa en ti con intensidad. No te lo dirá, pero te observa.
          </p>
        </div>
      )}

      <ProLockCard label="Ver inicial del nombre y mensaje exacto 💌" />
      <ProLockCard label="¿Te escribirá esta semana? 📲" />
    </SubShell>
  );
}

/* ───────────────── Energía de tu ex ───────────────── */
function EnergiaEx({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState("");
  const [done, setDone] = useState(false);
  return (
    <SubShell onBack={onBack} chip="👻 Energía de tu ex" title="Energía de tu ex" subtitle="¿Te piensa, te extraña o ya cerró el ciclo? 👀">
      <div className="baddia-card bg-white space-y-3">
        <InputField label="Inicial de tu ex" value={name} onChange={setName} placeholder="Ej. J" />
        <button
          disabled={!name.trim()}
          onClick={() => setDone(true)}
          className="w-full py-3.5 rounded-2xl bg-gradient-glow text-white font-bold shadow-glow disabled:opacity-50 active:scale-[0.98] transition-transform"
        >
          Leer su energía 👻
        </button>
      </div>

      {done && (
        <div className="baddia-sticker bg-gradient-baddia text-white animate-scale-in">
          <p className="chip bg-white/20 text-white mb-2">Lectura gratis</p>
          <p className="font-display font-bold text-lg leading-snug">
            Su energía está <b>inquieta</b>. Te recuerda en silencio, pero el orgullo le pesa más que el cariño.
          </p>
        </div>
      )}

      <ProLockCard label="¿Volverá a escribirte? 📲" />
      <ProLockCard label="¿Está con alguien más? 💔" />
      <ProLockCard label="Ritual para cerrar el ciclo 🕯️" />
    </SubShell>
  );
}

/* ───────────────── Mensaje oculto ───────────────── */
function MensajeOculto({ onBack }: { onBack: () => void }) {
  const [opened, setOpened] = useState(false);
  return (
    <SubShell onBack={onBack} chip="💌 Mensaje oculto" title="Mensaje oculto" subtitle="El universo te dejó un mensaje. Ábrelo. 💖">
      {!opened ? (
        <button
          onClick={() => setOpened(true)}
          className="w-full py-10 rounded-3xl bg-gradient-glow text-white font-display font-black text-2xl shadow-glow active:scale-[0.98] transition-transform"
        >
          💌 Abrir mensaje
        </button>
      ) : (
        <div className="baddia-sticker bg-gradient-baddia text-white animate-scale-in">
          <p className="chip bg-white/20 text-white mb-2">Para ti, hoy</p>
          <p className="font-display font-bold text-lg leading-snug">
            "Lo que es para ti, <b>te va a buscar</b>. No fuerces lo que ya está vibrando hacia ti."
          </p>
        </div>
      )}

      <ProLockCard label="Mensaje personalizado con tu nombre y signo 💌" />
      <ProLockCard label="Mensaje secreto de tu crush 🔒" />
    </SubShell>
  );
}

/* ───────────────── Consejo amoroso ───────────────── */
function ConsejoAmoroso({ onBack }: { onBack: () => void }) {
  return (
    <SubShell onBack={onBack} chip="💋 Consejo amoroso" title="Consejo amoroso" subtitle="Tu mentora baddie te lo dice clarito hoy.">
      <div className="baddia-sticker bg-gradient-baddia text-white">
        <p className="chip bg-white/20 text-white mb-2">Tu consejo del día</p>
        <p className="font-display font-bold text-lg leading-snug">
          No bajes tu energía para encajar en alguien. <b>Magnetiza, no persigas.</b> 💖
        </p>
      </div>

      <div className="baddia-card bg-white">
        <p className="text-xs font-bold text-baddia-purple/60 uppercase tracking-wider">Mantra</p>
        <p className="font-display font-black text-baddia-purple text-lg mt-1">
          "Mi amor propio es mi mejor hechizo." ✨
        </p>
      </div>

      <ProLockCard label="Consejo personalizado según tu situación 💞" />
      <ProLockCard label="Ritual de amor propio (3 días) 🕯️" />
    </SubShell>
  );
}
