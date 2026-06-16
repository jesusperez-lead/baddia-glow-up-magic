import { useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { computeDailyVibe } from "@/lib/baddia-daily";
import { toast } from "@/hooks/use-toast";
import { X, Copy, Share2, Download } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  /** If provided, shares only this quote instead of the full glow card. */
  quote?: string;
}

export function ShareGlowSheet({ open, onClose, quote }: Props) {
  const { user } = useBaddia();
  const vibe = computeDailyVibe(user);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const scorePct = vibe.glowScore / 100;
  const dash = 314;
  const quoteMode = !!quote;

  const shareText = quoteMode
    ? `"${quote}" ✨\n— Baddia`
    : `✨ Mi energía de hoy en Baddia\nGlow ${vibe.glowScore}/100 · ${vibe.color.name} · Lucky #${vibe.luckyNumber}\n"${vibe.advice}" 💖`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({ title: "Copiado ✨", description: "Pégalo donde quieras compartirlo." });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({ title: "Ups", description: "No pudimos copiar tu glow." });
    }
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const handleInstagram = async () => {
    await handleCopy();
    toast({
      title: "Listo para Instagram 💖",
      description: "Tu glow está copiado — pégalo en tu historia o post.",
    });
  };

  const handleNativeShare = async () => {
    try {
      if (typeof navigator !== "undefined" && (navigator as any).share) {
        await (navigator as any).share({ title: "Mi energía Baddia", text: shareText });
      } else {
        handleCopy();
      }
    } catch {
      /* user cancelled */
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end md:items-center justify-center bg-baddia-ink/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-[420px] bg-baddia-soft rounded-t-[2.5rem] md:rounded-[2.5rem] max-h-[94vh] overflow-y-auto scrollbar-hide animate-scale-in relative border-t-[3px] md:border-[3px] border-baddia-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 pt-5 pb-3 bg-baddia-soft/95 backdrop-blur-md">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] font-display font-bold text-baddia-ink/60">
              Compartir
            </p>
            <h2 className="font-display font-bold text-[20px] text-baddia-ink leading-tight">
              {quoteMode ? "Tu frase del día ✨" : "Tu glow card de hoy ✨"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-9 h-9 rounded-full bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-none transition"
          >
            <X size={16} className="text-baddia-ink" />
          </button>
        </div>

        {/* Story card preview (9:16 vibes) */}
        <div className="px-5 pb-4">
          <div
            id="baddia-share-card"
            className="relative mx-auto rounded-[28px] overflow-hidden border-[3px] border-baddia-ink shadow-[6px_8px_0_hsl(260_16%_15%)]"
            style={{
              aspectRatio: "9 / 16",
              maxWidth: "300px",
              background:
                "linear-gradient(160deg, hsl(48 100% 88%) 0%, hsl(333 100% 92%) 45%, hsl(260 90% 92%) 100%)",
            }}
          >
            {/* deco blobs */}
            <div className="absolute -top-10 -left-8 w-40 h-40 rounded-full bg-baddia-bubble/50 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-10 w-44 h-44 rounded-full bg-baddia-hot/30 blur-2xl pointer-events-none" />
            <span className="absolute top-6 right-6 text-baddia-yellow text-xl animate-twinkle">✦</span>
            <span className="absolute top-1/3 left-5 text-baddia-hot text-base animate-twinkle" style={{ animationDelay: "0.6s" }}>✧</span>
            <span className="absolute bottom-24 right-8 text-baddia-purple text-sm animate-twinkle" style={{ animationDelay: "1.2s" }}>·</span>

            <div className="relative h-full flex flex-col justify-between p-5 text-baddia-ink">
              {/* top */}
              <div className="flex items-start justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-baddia-ink text-white px-2.5 py-1 text-[9px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(48_100%_59%)]">
                  ✦ Baddia
                </span>
                <span className="inline-block rounded-full bg-white border-2 border-baddia-ink px-2.5 py-1 text-[9px] font-display font-bold text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-3">
                  {user.sign || "tu signo"}
                </span>
              </div>

              {quoteMode ? (
                <>
                  {/* quote only — big center */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
                    <span className="font-serif-display text-baddia-hot text-[64px] leading-none -mb-2 select-none">"</span>
                    <p className="font-display font-black text-[22px] leading-[1.15] text-baddia-ink">
                      {quote}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-baddia-yellow border-2 border-baddia-ink px-2.5 py-1 text-[9px] font-display font-bold text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2 uppercase tracking-widest">
                      💬 frase del día
                    </span>
                  </div>
                </>
              ) : (
                <>
                  {/* center — score ring */}
                  <div className="flex flex-col items-center text-center -mt-2">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-display font-bold text-baddia-ink/60 mb-1">
                      mi glow de hoy
                    </p>
                    <div className="relative">
                      <svg width="140" height="140" viewBox="0 0 120 120" className="-rotate-90">
                        <circle cx="60" cy="60" r="50" stroke="hsl(48 100% 82%)" strokeWidth="12" fill="none" />
                        <circle
                          cx="60" cy="60" r="50"
                          stroke="hsl(48 100% 59%)" strokeWidth="12" fill="none" strokeLinecap="round"
                          strokeDasharray={dash}
                          strokeDashoffset={dash - dash * scorePct}
                          style={{ filter: "drop-shadow(0 2px 0 hsl(260 16% 15% / 0.2))" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="font-display font-black text-[44px] leading-none text-baddia-ink">
                          {vibe.glowScore}
                        </span>
                        <span className="mt-1 inline-flex items-center gap-0.5 rounded-full bg-baddia-ink text-white text-[8px] font-black uppercase tracking-[0.14em] px-2 py-[2px]">
                          <span className="text-baddia-yellow">✦</span> /100
                        </span>
                      </div>
                    </div>
                    <p className="font-display font-bold text-[16px] mt-2 leading-tight">
                      {vibe.glowLabel}
                    </p>
                  </div>

                  {/* advice bubble */}
                  <div className="relative rounded-2xl bg-white border-[2.5px] border-baddia-ink px-3 py-2.5 shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-1">
                    <p className="text-[9px] uppercase tracking-widest font-display font-bold text-baddia-hot mb-0.5">
                      💬 mood del día
                    </p>
                    <p className="font-display font-bold text-[12px] leading-snug text-baddia-ink">
                      "{vibe.advice}"
                    </p>
                  </div>

                  {/* bottom row — color + lucky */}
                  <div className="flex items-stretch gap-2">
                    <div className="flex-1 rounded-2xl bg-white border-2 border-baddia-ink p-2 shadow-[2px_2px_0_hsl(260_16%_15%)]">
                      <p className="text-[8px] uppercase font-display font-bold tracking-wider text-baddia-ink/60">color</p>
                      <div
                        className="my-1 h-5 rounded-md border border-baddia-ink/70"
                        style={{ background: `linear-gradient(135deg, ${vibe.color.from}, ${vibe.color.to})` }}
                      />
                      <p className="font-display font-bold text-[10px] text-baddia-ink leading-tight truncate">{vibe.color.name}</p>
                    </div>
                    <div className="w-[72px] rounded-2xl bg-baddia-lime border-2 border-baddia-ink p-2 shadow-[2px_2px_0_hsl(260_16%_15%)] flex flex-col items-center justify-center">
                      <p className="text-[8px] uppercase font-display font-bold tracking-wider text-baddia-ink/70">lucky</p>
                      <p className="font-display font-black text-[26px] text-baddia-ink leading-none">
                        {vibe.luckyNumber}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* footer brand */}
              <div className="flex items-center justify-center pt-1">
                <span className="text-[9px] font-display font-bold uppercase tracking-[0.22em] text-baddia-ink/70">
                  baddia.app · {user.name || "babe"}
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-baddia-ink/70 font-display font-bold mt-3">
            Toma una captura 📸 y súbela a tus historias ✨
          </p>
        </div>

        {/* Share actions */}
        <div className="px-5 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleInstagram}
              className="relative py-3 rounded-2xl border-[2.5px] border-baddia-ink shadow-[3px_4px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[2px_2px_0_hsl(260_16%_15%)] transition flex items-center justify-center gap-2 text-white font-display font-bold text-sm"
              style={{ background: "linear-gradient(135deg,#feda75,#fa7e1e 30%,#d62976 60%,#962fbf 85%,#4f5bd5)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              Instagram
            </button>
            <button
              onClick={handleWhatsApp}
              className="py-3 rounded-2xl border-[2.5px] border-baddia-ink shadow-[3px_4px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[2px_2px_0_hsl(260_16%_15%)] transition flex items-center justify-center gap-2 bg-[#25D366] text-white font-display font-bold text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479c0 1.462 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.04 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.002-5.45 4.436-9.884 9.889-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.886 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.488-8.413z" />
              </svg>
              WhatsApp
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="py-3 rounded-2xl border-[2.5px] border-baddia-ink shadow-[3px_4px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[2px_2px_0_hsl(260_16%_15%)] transition flex items-center justify-center gap-2 bg-white text-baddia-ink font-display font-bold text-sm"
            >
              <Copy size={14} /> {copied ? "Copiado ✓" : "Copiar"}
            </button>
            <button
              onClick={handleNativeShare}
              className="py-3 rounded-2xl border-[2.5px] border-baddia-ink shadow-[3px_4px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[2px_2px_0_hsl(260_16%_15%)] transition flex items-center justify-center gap-2 bg-baddia-ink text-white font-display font-bold text-sm"
            >
              <Share2 size={14} /> Más opciones
            </button>
          </div>

          <p className="text-center text-[10px] text-baddia-ink/55 font-semibold pt-1 leading-relaxed">
            Hecho con cariño para inspirarte 💖 confía siempre en tu intuición.
          </p>
        </div>
      </div>
    </div>
  );
}
