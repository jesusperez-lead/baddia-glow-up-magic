import { useState } from "react";
import { useBaddia, FeedbackKind } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ArrowLeft, Bug, Lightbulb, Heart, Send, Sparkles, Check } from "lucide-react";
import { toast } from "sonner";

const KINDS: { id: FeedbackKind; label: string; caption: string; icon: any; tint: string; chip: string }[] = [
  { id: "bug",     label: "Reportar un bug",   caption: "Algo no funciona bien 🐛",       icon: Bug,       tint: "bg-baddia-hot/15",     chip: "bg-baddia-hot text-white" },
  { id: "feature", label: "Nueva función",     caption: "Se me ocurrió algo mágico ✨",   icon: Lightbulb, tint: "bg-baddia-yellow/50",  chip: "bg-baddia-yellow text-baddia-ink" },
  { id: "wish",    label: "Wishlist para Baddia", caption: "Me encantaría que Baddia... 💌", icon: Heart,   tint: "bg-baddia-bubble",     chip: "bg-baddia-lavender text-white" },
];

export function Feedback() {
  const { user, setUser, go } = useBaddia();
  const [kind, setKind] = useState<FeedbackKind>("feature");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const active = KINDS.find((k) => k.id === kind)!;
  const canSend = title.trim().length >= 3 && description.trim().length >= 6 && !sending;

  const onSend = () => {
    if (!canSend) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setUser({ feedbackCount: (user.feedbackCount ?? 0) + 1 });
      setTimeout(() => {
        toast.success("¡Gracias! Ganaste la insignia Baddia Contributor ✨");
        setSent(false);
        setTitle("");
        setDescription("");
        go("profile");
      }, 2400);
    }, 700);
  };

  return (
    <div className="relative min-h-full bg-white pb-16 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/25" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-soft/30" style={{ animationDelay: "4s" }} />
      <SparklesDeco />

      <header className="relative z-10 px-6 pt-8 pb-2">
        <button
          onClick={() => go("profile")}
          className="inline-flex items-center gap-1.5 text-baddia-ink/70 font-display font-bold text-[12px] mb-3"
        >
          <ArrowLeft size={14} /> volver
        </button>
        <span className="inline-block rounded-full bg-baddia-hot text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider">
          ✦ tu voz importa
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          Ayuda a que <span className="gradient-text">Baddia crezca</span> ✨
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Tus ideas, bugs y wishlist dan forma a la app. Sos parte del glow.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* Kind selector */}
        <div className="space-y-2">
          {KINDS.map(({ id, label, caption, icon: Icon, tint, chip }) => {
            const on = kind === id;
            return (
              <button
                key={id}
                onClick={() => setKind(id)}
                className={`w-full rounded-3xl bg-white border-[2.5px] p-3.5 flex items-center gap-3 transition-all ${
                  on
                    ? "border-baddia-ink shadow-[5px_6px_0_hsl(260_16%_15%)] -translate-y-[1px]"
                    : "border-baddia-ink/25 shadow-[2px_3px_0_hsl(260_16%_15%_/_0.25)]"
                }`}
              >
                <span className={`w-11 h-11 rounded-2xl border-2 border-baddia-ink ${tint} flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] shrink-0`}>
                  <Icon size={17} className="text-baddia-ink" />
                </span>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-display font-black text-baddia-ink text-[14px] leading-tight">{label}</p>
                  <p className="text-[11px] text-baddia-ink/60 font-semibold mt-0.5">{caption}</p>
                </div>
                {on && (
                  <span className={`inline-flex items-center gap-1 rounded-full ${chip} border-2 border-baddia-ink px-2 py-0.5 text-[9px] font-display font-black uppercase tracking-wider shadow-[1.5px_1.5px_0_hsl(260_16%_15%)]`}>
                    <Check size={9} /> elegido
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Form */}
        <div className="relative">
          <div className="absolute -top-3 left-5 z-10">
            <span className={`inline-flex items-center gap-1.5 rounded-full ${active.chip} border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1`}>
              <active.icon size={11} /> {active.label}
            </span>
          </div>
          <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-4">
            <label className="block">
              <span className="text-[11px] font-display font-black uppercase tracking-wider text-baddia-ink/70">título</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 80))}
                placeholder="Ej: quiero un tarot para la amistad"
                className="mt-1.5 w-full rounded-2xl border-2 border-baddia-ink px-3.5 py-2.5 text-[14px] font-display font-bold text-baddia-ink placeholder:text-baddia-ink/30 focus:outline-none focus:shadow-[3px_3px_0_hsl(260_16%_15%)] transition-shadow"
                maxLength={80}
              />
              <span className="mt-1 block text-[10px] text-baddia-ink/40 font-semibold text-right">{title.length}/80</span>
            </label>
            <label className="block">
              <span className="text-[11px] font-display font-black uppercase tracking-wider text-baddia-ink/70">descripción</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                placeholder="Contame más… qué esperás sentir con esto ✨"
                rows={5}
                className="mt-1.5 w-full rounded-2xl border-2 border-baddia-ink px-3.5 py-2.5 text-[13px] font-medium text-baddia-ink placeholder:text-baddia-ink/30 resize-none focus:outline-none focus:shadow-[3px_3px_0_hsl(260_16%_15%)] transition-shadow"
                maxLength={500}
              />
              <span className="mt-1 block text-[10px] text-baddia-ink/40 font-semibold text-right">{description.length}/500</span>
            </label>
          </div>
        </div>

        <button
          onClick={onSend}
          disabled={!canSend}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-baddia-ink text-white border-2 border-baddia-ink px-4 py-3.5 text-[14px] font-display font-black shadow-[4px_5px_0_hsl(260_16%_15%_/_0.35)] active:translate-y-[2px] active:shadow-[2px_2px_0_hsl(260_16%_15%_/_0.35)] transition-all disabled:opacity-40 disabled:active:translate-y-0"
        >
          {sending ? (
            <>
              <Sparkles size={15} className="animate-spin" /> Enviando magia…
            </>
          ) : (
            <>
              <Send size={15} /> Enviar feedback
            </>
          )}
        </button>

        <p className="text-[11px] text-baddia-ink/45 font-semibold text-center leading-relaxed px-4">
          Al enviar tu primer feedback ganás la insignia <b className="text-baddia-ink/70">✧ Baddia Contributor</b> en tu perfil.
        </p>
      </div>

      {/* Celebration overlay */}
      {sent && <FeedbackCelebration />}
    </div>
  );
}

function FeedbackCelebration() {
  const items = Array.from({ length: 22 });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-baddia-ink/50 backdrop-blur-sm animate-fade-in overflow-hidden">
      <style>{`
        @keyframes fbConfetti { 0%{transform:translateY(-40vh) rotate(0);opacity:0} 15%{opacity:1} 100%{transform:translateY(90vh) rotate(720deg);opacity:0} }
        @keyframes fbPop { 0%{transform:scale(.4) rotate(-12deg);opacity:0} 60%{transform:scale(1.08) rotate(2deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
        @keyframes fbHalo { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.15);opacity:.85} }
        @keyframes fbOrbit { from{transform:rotate(0) translateX(70px) rotate(0)} to{transform:rotate(360deg) translateX(70px) rotate(-360deg)} }
      `}</style>
      {items.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.6;
        const dur = 2 + Math.random() * 1.2;
        const emoji = ["✨","💖","🎀","⋆","✦","🌙","💌"][i % 7];
        return (
          <span
            key={i}
            className="absolute text-2xl select-none"
            style={{ left: `${left}%`, top: "-10vh", animation: `fbConfetti ${dur}s ${delay}s ease-in forwards` }}
          >
            {emoji}
          </span>
        );
      })}
      <div className="relative">
        <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-baddia-bubble via-baddia-lavender to-baddia-yellow blur-2xl" style={{ animation: "fbHalo 2.4s ease-in-out infinite" }} />
        <div className="relative rounded-[32px] bg-white border-[2.5px] border-baddia-ink p-7 shadow-[6px_8px_0_hsl(260_16%_15%)] max-w-[300px] text-center" style={{ animation: "fbPop .6s cubic-bezier(.34,1.56,.64,1) forwards" }}>
          <div className="relative mx-auto w-20 h-20 mb-3">
            <div className="absolute inset-0 rounded-full bg-baddia-yellow/60 blur-md" style={{ animation: "fbHalo 1.6s ease-in-out infinite" }} />
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-baddia-hot to-baddia-lavender border-[2.5px] border-baddia-ink flex items-center justify-center shadow-[3px_4px_0_hsl(260_16%_15%)]">
              <Sparkles size={30} className="text-white" />
            </div>
            <span className="absolute -top-1 -right-1 text-xl" style={{ animation: "fbOrbit 3s linear infinite", transformOrigin: "0 0" }}>✦</span>
          </div>
          <p className="font-display font-black text-baddia-ink text-[20px] leading-tight">
            ¡Feedback enviado! 💌
          </p>
          <p className="text-[13px] text-baddia-ink/70 font-semibold mt-2 leading-snug">
            Sos parte del glow de Baddia. Cada idea nos hace más mágicas ✨
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-baddia-gold text-baddia-ink border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] rotate-[-2deg]">
            ✧ Baddia Contributor
          </span>
        </div>
      </div>
    </div>
  );
}
