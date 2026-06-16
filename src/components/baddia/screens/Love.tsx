import { useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Heart, Lock, Sparkles as Sp } from "lucide-react";

const SUB_CARDS = [
  { label: "Compatibilidad", emoji: "💞" },
  { label: "Qué signo te piensa", emoji: "🔮" },
  { label: "Energía de tu ex", emoji: "👻" },
  { label: "Mensaje oculto", emoji: "💌" },
  { label: "Consejo amoroso", emoji: "💋" },
];

export function Love() {
  const { openPaywall } = useBaddia();
  const [crush, setCrush] = useState("");
  const [crushDate, setCrushDate] = useState("");
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="relative min-h-full gradient-bg-soft pb-6">
      <header className="px-5 pt-8 pb-4">
        <span className="chip bg-white/80 text-baddia-hot">💌 Crush Energy</span>
        <h1 className="font-display font-black text-3xl text-baddia-purple mt-2">Crush Energy</h1>
        <p className="text-sm text-baddia-purple/70 mt-1">Descubre qué siente sin escribirle primero. ✨</p>
      </header>

      <div className="px-5 space-y-4">
        <div className="baddia-card bg-white space-y-3">
          <div>
            <label className="text-xs font-bold text-baddia-purple/60 ml-2">Nombre o inicial de tu crush</label>
            <input
              value={crush}
              onChange={(e) => setCrush(e.target.value)}
              placeholder="Ej. L o Lucas"
              className="mt-1 w-full bg-pink-50 rounded-2xl px-4 py-3 text-baddia-purple font-semibold placeholder:text-baddia-purple/30 focus:outline-none focus:ring-2 focus:ring-baddia-pink"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-baddia-purple/60 ml-2">Fecha de nacimiento (opcional)</label>
            <input
              value={crushDate}
              onChange={(e) => setCrushDate(e.target.value)}
              placeholder="DD / MM / AAAA"
              className="mt-1 w-full bg-pink-50 rounded-2xl px-4 py-3 text-baddia-purple font-semibold placeholder:text-baddia-purple/30 focus:outline-none focus:ring-2 focus:ring-baddia-pink"
            />
          </div>
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
              key={c.label}
              onClick={openPaywall}
              className="baddia-card bg-white text-left relative active:scale-[0.98] transition-transform"
            >
              <span className="absolute top-2 right-2 w-6 h-6 rounded-full bg-baddia-gold/30 flex items-center justify-center">
                <Lock size={10} className="text-baddia-purple" />
              </span>
              <span className="text-2xl">{c.emoji}</span>
              <p className="font-display font-bold text-baddia-purple text-sm mt-1 leading-tight">{c.label}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
