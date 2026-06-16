import { useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { computeDailyVibe } from "@/lib/baddia-daily";
import { toast } from "@/hooks/use-toast";
import { X, Copy, Share2, Download } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ShareGlowSheet({ open, onClose }: Props) {
  const { user } = useBaddia();
  const vibe = computeDailyVibe(user);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const scorePct = vibe.glowScore / 100;
  const dash = 314;

  const shareText = `✨ Mi energía de hoy en Baddia\nGlow ${vibe.glowScore}/100 · ${vibe.color.name} · Lucky #${vibe.luckyNumber}\n"${vibe.advice}" 💖`;

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
              Tu glow card de hoy ✨
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

              {/* footer brand */}
              <div className="flex items-center justify-center pt-1">
                <span className="text-[9px] font-display font-bold uppercase tracking-[0.22em] text-baddia-ink/70">
                  baddia.app · {user.name || "babe"}
                </span>
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-baddia-ink/60 font-semibold mt-3">
            Captura esta tarjeta 📸 o usa los botones de abajo
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
              <span className="text-base">📸</span> Instagram
            </button>
            <button
              onClick={handleWhatsApp}
              className="py-3 rounded-2xl border-[2.5px] border-baddia-ink shadow-[3px_4px_0_hsl(260_16%_15%)] active:translate-y-[1px] active:shadow-[2px_2px_0_hsl(260_16%_15%)] transition flex items-center justify-center gap-2 bg-[#25D366] text-white font-display font-bold text-sm"
            >
              <span className="text-base">💚</span> WhatsApp
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

          <p className="text-center text-[10px] text-baddia-ink/50 font-semibold pt-1">
            Solo entretenimiento ✨ tu energía manda siempre.
          </p>
        </div>
      </div>
    </div>
  );
}
