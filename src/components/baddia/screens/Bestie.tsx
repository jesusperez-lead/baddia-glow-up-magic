import { useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ArrowLeft, Lock, ArrowRight, Sparkles, Send, Share2 } from "lucide-react";
import { ShareGlowSheet } from "../ShareGlowSheet";

const PROMPTS = [
  "Necesito un consejo",
  "Estoy confundida con alguien",
  "Quiero motivación",
  "Quiero soltar algo",
  "Dame una frase",
  "¿Qué hago hoy?",
  "Necesito amor propio",
  "Quiero saber mi energía",
  "Ayúdame con mi crush",
  "Estoy en mi healing era",
];

const FREE_LIMIT = 3;

type Msg = {
  prompt: string;
  extra: string;
  feels: string;
  advice: string;
  action: string;
  phrase: string;
};

function generate(prompt: string, extra: string): Msg {
  return {
    prompt,
    extra,
    feels: "Bestie, Baddia siente que estás cargando algo que ya no es tuyo, y también un brillo bonito que quiere salir.",
    advice: "No tienes que perseguir una energía que te confunde. Hoy observa más y explica menos.",
    action: "Escríbete a ti misma un mensaje bonito y guárdalo en tu diario.",
    phrase: "Tu paz también es una respuesta. ✨",
  };
}

export function Bestie() {
  const { user, openPaywall, go } = useBaddia();
  const isPro = user.plan !== "Free";
  const [selected, setSelected] = useState<string | null>(null);
  const [extra, setExtra] = useState("");
  const [replies, setReplies] = useState<Msg[]>([]);
  const [shareQuote, setShareQuote] = useState<string | null>(null);

  const canSend = !!selected && (isPro || replies.length < FREE_LIMIT);
  const limitReached = !isPro && replies.length >= FREE_LIMIT;

  const send = () => {
    if (!canSend) return;
    setReplies((p) => [...p, generate(selected!, extra)]);
    setSelected(null);
    setExtra("");
  };

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
        <span className="inline-block rounded-full bg-baddia-hot text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider">
          💖 baddia bestie
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          Tu <span className="gradient-text">bestie energética</span>
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Cuéntale a Baddia qué necesitas hoy. Claridad, calma y glow.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {replies.length === 0 && (
          <div className="rounded-3xl bg-gradient-to-br from-pink-50 to-baddia-soft/30 border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)] text-center">
            <p className="text-3xl">💌</p>
            <p className="font-display font-black text-[16px] text-baddia-ink mt-2">
              Tu bestie está lista para escucharte.
            </p>
            <p className="text-[12px] text-baddia-ink/65 font-semibold mt-1">
              Elige por dónde empezar 👇
            </p>
          </div>
        )}

        {/* Respuestas */}
        {replies.map((m, i) => (
          <div key={i} className="space-y-3 animate-pop-in">
            <div className="ml-auto max-w-[85%] rounded-3xl bg-baddia-hot text-white border-[2.5px] border-baddia-ink px-4 py-3 shadow-[3px_3px_0_hsl(260_16%_15%)]">
              <p className="font-display font-black text-[13px]">{m.prompt}</p>
              {m.extra && <p className="text-[12px] mt-1 opacity-90">{m.extra}</p>}
            </div>

            <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-3">
              <Block emoji="💗" label="lo que baddia siente" text={m.feels} />
              <Block emoji="✨" label="consejo de bestie" text={m.advice} />
              <Block emoji="🌸" label="mini acción" text={m.action} />
              <div className="rounded-2xl bg-gradient-to-br from-pink-50 to-baddia-lavender/20 border-2 border-baddia-ink p-3">
                <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55">
                  frase para ti
                </p>
                <p className="font-display font-bold text-[15px] text-baddia-ink leading-snug mt-1">
                  "{m.phrase}"
                </p>
                <button
                  onClick={() => setShareQuote(m.phrase)}
                  className="btn-sticker mt-3 w-full py-2 rounded-full bg-gradient-hot text-white text-[11px] flex items-center justify-center gap-1.5"
                >
                  <Share2 size={12} /> Compartir
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Composer */}
        {limitReached ? (
          <button
            onClick={openPaywall}
            className="relative w-full text-left active:scale-[0.99] transition-transform"
          >
            <div className="absolute -top-3 left-5 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-gold text-baddia-ink border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
                <Lock size={10} /> Bestie ilimitada
              </span>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-baddia-gold/30 via-pink-100 to-baddia-soft/40 border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)]">
              <p className="font-display font-black text-baddia-ink text-[17px] leading-snug">
                Tu bestie puede seguir contigo en <span className="gradient-text">Baddia Pro</span> ✨
              </p>
              <p className="text-[12px] text-baddia-ink/65 font-semibold mt-1.5">
                Más mensajes, modo crush, modo healing y modo glow up.
              </p>
              <div className="btn-sticker w-full mt-4 py-3 rounded-full bg-gradient-hot text-white text-[13px] flex items-center justify-center gap-1.5">
                <Lock size={13} /> Desbloquear <ArrowRight size={14} />
              </div>
            </div>
          </button>
        ) : (
          <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-3">
            <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55">
              ¿qué necesitas hoy?
            </p>
            <div className="flex flex-wrap gap-2">
              {PROMPTS.map((p) => {
                const active = selected === p;
                return (
                  <button
                    key={p}
                    onClick={() => setSelected(p)}
                    className={`px-3 py-1.5 rounded-full border-2 border-baddia-ink text-[12px] font-display font-black transition-all ${
                      active
                        ? "bg-baddia-hot text-white shadow-[2px_2px_0_hsl(260_16%_15%)]"
                        : "bg-white text-baddia-ink"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
            {selected && (
              <>
                <textarea
                  value={extra}
                  onChange={(e) => setExtra(e.target.value)}
                  placeholder="Cuéntame un poquito más…"
                  rows={2}
                  className="w-full bg-white rounded-2xl px-4 py-3 text-[13px] text-baddia-ink font-medium placeholder:text-baddia-ink/40 border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none resize-none"
                />
                <button
                  onClick={send}
                  className="btn-sticker w-full py-3 rounded-full bg-gradient-hot text-white text-[13px] flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Enviar a mi bestie
                </button>
              </>
            )}
            {!isPro && (
              <p className="text-[11px] text-center text-baddia-ink/55 font-semibold">
                <Sparkles size={10} className="inline mr-1" />
                {FREE_LIMIT - replies.length} mensajes gratis restantes hoy
              </p>
            )}
          </div>
        )}
      </div>

      <ShareGlowSheet
        open={!!shareQuote}
        onClose={() => setShareQuote(null)}
        quote={shareQuote ?? undefined}
      />
    </div>
  );
}

function Block({ emoji, label, text }: { emoji: string; label: string; text: string }) {
  return (
    <div>
      <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/55">
        {emoji} {label}
      </p>
      <p className="text-[13.5px] font-medium text-baddia-ink leading-snug mt-1">{text}</p>
    </div>
  );
}
