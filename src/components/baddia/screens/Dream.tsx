import { useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ArrowLeft, Lock, ArrowRight, Moon, Share2 } from "lucide-react";
import { ShareGlowSheet } from "../ShareGlowSheet";

const CHIPS = ["Amor", "Ex", "Familia", "Agua", "Casa", "Dinero", "Miedo", "Viaje", "Bebé", "Animales", "Caída", "Luna", "Oscuridad", "Escuela", "Trabajo"];

export function Dream() {
  const { user, openPaywall, go } = useBaddia();
  const isPro = user.plan !== "Free";
  const [dream, setDream] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const toggle = (t: string) =>
    setTags((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const emotion = tags.includes("Ex") || tags.includes("Amor") ? "Nostalgia suave" : tags.includes("Miedo") ? "Ansiedad" : "Transición";
  const shareQuote = `Mi sueño de hoy: ${emotion} ✨ — Baddia lo interpretó por mí`;

  return (
    <div className="relative min-h-full bg-white pb-12 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-lavender/25" />
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
        <span className="inline-block rounded-full bg-baddia-lavender text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider">
          🌙 dream interpretation
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          Interpreta tu <span className="gradient-text">sueño</span>
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Cuéntale a Baddia qué soñaste y descubre el mensaje detrás.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-4">
          <textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="Soñé con agua, mi ex y una casa vieja…"
            rows={5}
            className="w-full bg-white rounded-2xl px-4 py-3 text-[14px] text-baddia-ink font-medium placeholder:text-baddia-ink/40 border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none resize-none"
          />
          <div>
            <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55 mb-2">
              símbolos que aparecieron
            </p>
            <div className="flex flex-wrap gap-2">
              {CHIPS.map((t) => {
                const active = tags.includes(t);
                return (
                  <button
                    key={t}
                    onClick={() => toggle(t)}
                    className={`px-3 py-1.5 rounded-full border-2 border-baddia-ink text-[12px] font-display font-black transition-all ${
                      active
                        ? "bg-baddia-lavender text-white shadow-[2px_2px_0_hsl(260_16%_15%)]"
                        : "bg-white text-baddia-ink"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => setDone(true)}
            disabled={!dream.trim()}
            className="btn-sticker w-full py-3.5 rounded-full bg-gradient-hot text-white text-[14px] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Moon size={16} /> Interpretar mi sueño
          </button>
        </div>

        {done && (
          <>
            <div className="relative animate-pop-in">
              <div className="absolute -top-3 left-5 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(48_100%_59%)] rotate-1">
                  ✦ significado simbólico
                </span>
              </div>
              <div className="rounded-3xl border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] gradient-bg-baddia text-white">
                <p className="font-display font-bold text-[18px] leading-snug">
                  Este sueño habla de <b>cambios emocionales</b> y de una parte de tu corazón que busca cerrar un ciclo suave.
                </p>
              </div>
            </div>

            <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)]">
              <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-hot mb-2">
                💗 emoción principal
              </p>
              <p className="font-display font-black text-[22px] text-baddia-ink">{emotion}</p>
            </div>

            <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)]">
              <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55 mb-2">
                💭 lo que estás procesando
              </p>
              <p className="text-[14px] font-medium text-baddia-ink leading-snug">
                Recuerdos que aún se mueven contigo y decisiones que estás soltando en silencio.
              </p>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-pink-50 to-baddia-soft/30 border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)]">
              <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55 mb-2">
                ✨ frase final
              </p>
              <p className="font-display font-bold text-[16px] text-baddia-ink leading-snug">
                "Lo que sueltas hoy te devuelve el espacio para lo que sí es tuyo."
              </p>
              <button
                onClick={() => setShareOpen(true)}
                className="btn-sticker mt-4 w-full py-2.5 rounded-full bg-gradient-hot text-white text-[12px] flex items-center justify-center gap-1.5"
              >
                <Share2 size={14} /> Compartir
              </button>
            </div>

            {!isPro && (
              <button
                onClick={openPaywall}
                className="relative w-full text-left active:scale-[0.99] transition-transform"
              >
                <div className="absolute -top-3 left-5 z-10">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-gold text-baddia-ink border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
                    <Lock size={10} /> Interpretación completa
                  </span>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-baddia-gold/30 via-pink-100 to-baddia-soft/40 border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)]">
                  <p className="font-display font-black text-baddia-ink text-[17px] leading-snug">
                    Símbolos detectados + conexión con tu signo, mood e historial de sueños ✨
                  </p>
                  <div className="btn-sticker w-full mt-4 py-3 rounded-full bg-gradient-hot text-white text-[13px] flex items-center justify-center gap-1.5">
                    <Lock size={13} /> Desbloquear con Baddia Pro <ArrowRight size={14} />
                  </div>
                </div>
              </button>
            )}
          </>
        )}
      </div>
      <ShareGlowSheet open={shareOpen} onClose={() => setShareOpen(false)} quote={shareQuote} />
    </div>
  );
}
