import { useBaddia } from "@/lib/baddia-state";
import { Lock } from "lucide-react";

const MOOD_CARDS = [
  { label: "Amor", emoji: "💖", text: "Magnetismo alto", pro: false },
  { label: "Dinero", emoji: "💸", text: "Oportunidad cerca", pro: true },
  { label: "Trabajo", emoji: "💼", text: "Enfoque y claridad", pro: true },
  { label: "Energía", emoji: "⚡️", text: "Vibrante", pro: false },
  { label: "Suerte", emoji: "🍀", text: "A tu favor", pro: false },
];

const SECTIONS = [
  { title: "Signo solar", desc: "Libra · aire · regida por Venus", pro: false },
  { title: "Número de vida", desc: "Tu número es 11 — maestra intuitiva", pro: false },
  { title: "Horóscopo diario", desc: "Hoy se abre una puerta a relaciones más sanas.", pro: false },
  { title: "Compatibilidad", desc: "Descubre con qué signos vibras más", pro: true },
  { title: "Año personal", desc: "Tu energía anual completa", pro: true },
];

export function Zodiac() {
  const { openPaywall } = useBaddia();
  return (
    <div className="relative min-h-full gradient-bg-soft pb-6">
      <header className="px-5 pt-8 pb-4">
        <span className="chip bg-white/80 text-baddia-purple">🌙 Zodiac Mood</span>
        <h1 className="font-display font-black text-3xl text-baddia-purple mt-2">Tu Zodiac Mood</h1>
      </header>

      <div className="px-5 space-y-4">
        <div className="baddia-card gradient-bg-night text-white relative overflow-hidden">
          <span className="absolute -bottom-6 -right-2 text-8xl opacity-20">♎</span>
          <p className="text-xs opacity-80 font-semibold">SIGNO SOLAR</p>
          <p className="font-display font-black text-3xl mt-1">Eres Libra</p>
          <p className="text-sm opacity-90 mt-2 leading-relaxed relative">
            Hoy tu energía pide <b>equilibrio, belleza y límites claros</b>.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {MOOD_CARDS.map((c) => (
            <button
              key={c.label}
              onClick={() => c.pro && openPaywall()}
              className="baddia-card bg-white text-left relative active:scale-[0.98] transition-transform"
            >
              {c.pro && (
                <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-baddia-gold/30 flex items-center justify-center">
                  <Lock size={10} className="text-baddia-purple" />
                </span>
              )}
              <span className="text-2xl">{c.emoji}</span>
              <p className="font-display font-bold text-baddia-purple mt-1">{c.label}</p>
              <p className={`text-xs mt-0.5 ${c.pro ? "text-baddia-purple/40" : "text-baddia-purple/70"}`}>
                {c.pro ? "Pro" : c.text}
              </p>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {SECTIONS.map((s) => (
            <button
              key={s.title}
              onClick={() => s.pro && openPaywall()}
              className="w-full baddia-card bg-white text-left flex items-center justify-between active:scale-[0.99] transition-transform"
            >
              <div>
                <p className="font-display font-bold text-baddia-purple">{s.title}</p>
                <p className="text-xs text-baddia-purple/70 mt-0.5">{s.desc}</p>
              </div>
              {s.pro ? (
                <span className="chip bg-baddia-gold/30 text-baddia-purple"><Lock size={10} /> Pro</span>
              ) : (
                <span className="text-baddia-hot font-bold">→</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
