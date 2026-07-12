import { useState } from "react";
import { Sparkles, Heart, Moon, Hand, Star, HeartHandshake, Wand2, Eye, Shirt, Dices, Lock } from "lucide-react";
import { Screen, useBaddia } from "@/lib/baddia-state";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { DailyIcon, ZodiacIcon, LoveIcon, ProfileIcon, WandIcon, CuteIconsStyles } from "./CuteIcons";

type Tab = { id: Screen; label: string; Icon: React.ComponentType<{ active?: boolean; size?: number; className?: string }> };

const leftTabs: Tab[] = [
  { id: "daily",  label: "Daily",  Icon: DailyIcon },
  { id: "zodiac", label: "Zodiac", Icon: ZodiacIcon },
];
const rightTabs: Tab[] = [
  { id: "love",    label: "Love", Icon: LoveIcon },
  { id: "profile", label: "Yo",   Icon: ProfileIcon },
];

type Reading = {
  emoji: string;
  title: string;
  desc: string;
  Icon: any;
  color: string;
  go?: Screen;
  soon?: boolean;
  pro?: boolean;
};

const readings: Reading[] = [
  { emoji: "🤚", title: "Lectura de manos", desc: "Tu palma, tu mapa, tu brillo. Baddia lo lee todo.",        Icon: Hand,          color: "bg-baddia-mint",     go: "palm" },
  { emoji: "👗", title: "Outfit Check",      desc: "¿Tu look dice lo que sientes? Baddia te lo cuenta.",          Icon: Shirt,         color: "bg-baddia-bubble",   go: "outfit", pro: true },
  { emoji: "🎲", title: "Déjalo a la suerte", desc: "Sí o No con un dado cute. El universo responde.",     Icon: Dices,         color: "bg-baddia-lavender", go: "lucky", pro: true },
  { emoji: "🔮", title: "Tarot del día",    desc: "3 cartas para tu energía hoy.",  Icon: Wand2,         color: "bg-baddia-lavender", go: "tarot", pro: true },
  { emoji: "✨", title: "Carta astral",     desc: "Tu mapa cósmico personalizado.", Icon: Star,          color: "bg-baddia-yellow",   go: "astral", pro: true },
  { emoji: "💘", title: "Compatibilidad",   desc: "Tu match con tu crush.",         Icon: HeartHandshake,color: "bg-baddia-hot",      go: "compat", pro: true },
  { emoji: "👁️", title: "Aura Check",       desc: "Detecta tu aura del momento.",   Icon: Eye,           color: "bg-baddia-bubble",   go: "aura", pro: true },
  { emoji: "💌", title: "Inicial y mensaje", desc: "La letra de su nombre + mensaje exacto.", Icon: HeartHandshake, color: "bg-baddia-hot",   go: "crush-initial", pro: true },
  { emoji: "📱", title: "¿Te escribirá esta semana?", desc: "Probabilidad, día y horario.", Icon: Heart,    color: "bg-baddia-lavender", go: "write-week", pro: true },
  { emoji: "🚩", title: "Red / Green Flags",   desc: "¿Qué energía tiene esa persona?",     Icon: HeartHandshake,color: "bg-baddia-hot",      go: "flags", pro: true },
  { emoji: "🌙", title: "Interpreta tu sueño", desc: "Baddia lee el mensaje detrás.",       Icon: Moon,          color: "bg-baddia-lavender", go: "dream", pro: true },
  { emoji: "💖", title: "Baddia Bestie",       desc: "Tu bestie energética, siempre lista.", Icon: Sparkles,     color: "bg-baddia-bubble",   go: "bestie", pro: true },
  { emoji: "✨", title: "Comparte tu glow",    desc: "Cartas cute para Stories y TikTok.",  Icon: Sparkles,      color: "bg-baddia-yellow",   go: "share", pro: true },
];

export function BottomNav() {
  const { screen, go, user, openPaywall } = useBaddia();
  const [open, setOpen] = useState(false);
  const isPro = user.plan !== "Free";

  const renderTab = ({ id, label, Icon }: Tab) => {
    const active = screen === id;
    return (
      <li key={id} className="flex-1">
        <button
          onClick={() => go(id)}
          aria-label={label}
          aria-current={active ? "page" : undefined}
          className="group w-full flex flex-col items-center justify-center gap-1 py-1.5 transition-transform duration-300 active:scale-90"
        >
          <Icon
            size={26}
            active={active}
            className={`transition-all duration-300 ${
              active ? "-translate-y-0.5 drop-shadow-[0_2px_0_hsl(260_16%_15%/0.3)]" : "opacity-70 group-hover:opacity-100"
            }`}
          />
          <span
            className={`text-[10px] font-display font-bold leading-none tracking-wide transition-colors duration-300 ${
              active ? "text-baddia-hot" : "text-baddia-ink/55"
            }`}
          >
            {label}
          </span>
        </button>
      </li>
    );
  };

  return (
    <>
      <nav className="sticky bottom-0 z-40 px-3 pb-3 pt-6 bg-gradient-to-t from-white/85 via-white/45 to-transparent">
        <ul className="relative flex items-stretch justify-between rounded-2xl border-[2px] border-baddia-ink/90 px-1 py-1.5 shadow-[3px_3px_0_hsl(260_16%_15%)] bg-white/55 backdrop-blur-xl backdrop-saturate-150">
          {/* glossy top sheen */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/45 to-transparent rounded-t-2xl"
          />

          {leftTabs.map(renderTab)}

          {/* central FAB slot */}
          <li className="flex-1 relative">
            <button
              onClick={() => setOpen(true)}
              aria-label="Lecturas IA"
              className="group absolute left-1/2 -translate-x-1/2 -top-7 flex flex-col items-center"
            >
              <span className="relative w-14 h-14 rounded-full border-[2.5px] border-baddia-ink bg-gradient-to-br from-baddia-yellow via-baddia-hot to-baddia-lavender shadow-[3px_4px_0_hsl(260_16%_15%)] flex items-center justify-center text-white transition-transform duration-300 group-hover:-translate-y-0.5 group-active:scale-90">
                {/* glossy sheen */}
                <span className="absolute inset-x-1.5 top-1 h-3 rounded-full bg-white/45 blur-[1px]" />
                {/* subtle shimmer dot */}
                <span className="pointer-events-none absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-baddia-yellow border-2 border-baddia-ink animate-pulse" />
                <WandIcon size={30} className="relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
              </span>
              <span className="mt-1 text-[10px] font-display font-black uppercase tracking-wide text-baddia-hot leading-none">
                Lectura
              </span>
            </button>
          </li>

          {rightTabs.map(renderTab)}
        </ul>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-3xl border-t-[2.5px] border-baddia-ink bg-gradient-to-b from-white via-pink-50/40 to-white p-0 max-h-[85vh] overflow-hidden">
          {/* floating cute background stickers */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <span className="absolute -top-2 left-6 text-2xl animate-float-cute" style={{ animationDelay: "0s" }}>✨</span>
            <span className="absolute top-4 right-8 text-xl animate-float-cute" style={{ animationDelay: "0.6s" }}>💖</span>
            <span className="absolute top-16 left-10 text-lg animate-float-cute" style={{ animationDelay: "1.2s" }}>⭐</span>
            <span className="absolute top-2 right-20 text-base animate-float-cute" style={{ animationDelay: "0.3s" }}>🌙</span>
            <span className="absolute top-20 right-4 text-lg animate-float-cute" style={{ animationDelay: "0.9s" }}>🔮</span>
            {/* gradient blobs */}
            <span className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-baddia-bubble/30 blur-3xl animate-pulse-slow" />
            <span className="absolute -top-8 -right-12 w-44 h-44 rounded-full bg-baddia-lavender/30 blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
          </div>

          <div className="relative px-5 pt-5 pb-2">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-baddia-ink/15" />
            <SheetHeader className="text-left space-y-1">
              <SheetTitle className="font-display font-black text-[22px] text-baddia-ink leading-tight flex items-center gap-2">
                <span className="inline-block animate-wiggle">Baddia lo lee todo</span>
                <span className="inline-block animate-sparkle-spin">✨</span>
              </SheetTitle>
              <SheetDescription className="text-[13px] text-baddia-ink/65 font-semibold">
                Palma, outfit, tarot, crush… tu energía, leída por Baddia.
              </SheetDescription>
            </SheetHeader>
          </div>

          <div className="relative px-4 pb-6 space-y-2.5 overflow-y-auto">
            {readings.map((r, i) => {
              const locked = !!r.pro && !isPro;
              return (
              <button
                key={r.title}
                disabled={r.soon}
                onClick={() => {
                  if (r.soon) return;
                  if (locked) {
                    setOpen(false);
                    openPaywall();
                    return;
                  }
                  if (r.go) {
                    go(r.go);
                    setOpen(false);
                  }
                }}
                style={{ animationDelay: `${i * 60}ms` }}
                className="group relative overflow-hidden animate-pop-in-cute w-full flex items-center gap-3 rounded-2xl border-[2px] border-baddia-ink bg-white p-3 shadow-[3px_3px_0_hsl(260_16%_15%)] text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_hsl(260_16%_15%)] active:scale-[0.98] disabled:opacity-70"
              >
                <span className={`relative shrink-0 w-12 h-12 rounded-xl border-2 border-baddia-ink ${r.color} flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-6deg]`}>
                  {r.emoji}
                  {locked && (
                    <span className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-baddia-ink border-2 border-white flex items-center justify-center shadow-[1.5px_1.5px_0_hsl(260_16%_15%)]">
                      <Lock size={11} className="text-baddia-yellow" strokeWidth={3} />
                    </span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 flex-wrap">
                    <span className={`font-display font-black text-[15px] leading-tight ${locked ? "text-baddia-ink/70" : "text-baddia-ink"}`}>{r.title}</span>
                    {locked && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-display font-black uppercase tracking-widest text-white bg-gradient-to-r from-baddia-hot to-baddia-lavender border border-baddia-ink rounded-full px-1.5 py-[1px] shadow-[1.5px_1.5px_0_hsl(260_16%_15%)]">
                        ✨ Pro
                      </span>
                    )}
                    {r.soon && (
                      <span className="text-[9px] font-display font-black uppercase tracking-widest text-baddia-ink/55 border border-baddia-ink/30 rounded-full px-1.5 py-[1px]">
                        pronto
                      </span>
                    )}
                  </span>
                  <span className="block text-[12px] text-baddia-ink/65 font-semibold leading-snug mt-0.5">
                    {locked ? "Desbloquea con Baddia Pro y léelo todo 💖" : r.desc}
                  </span>
                </span>
                {/* shimmer sweep on hover */}
                <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                  <span className="absolute -inset-y-4 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                </span>
              </button>
              );
            })}

            <p className="text-[11px] text-center text-baddia-ink/55 font-semibold pt-2 leading-relaxed">
              Powered by IA · resultados solo para entretenimiento 💖
            </p>
          </div>
        </SheetContent>
      </Sheet>

    </>
  );
}
