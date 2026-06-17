import { useState } from "react";
import { Sparkles, Heart, User, Moon, Hand, Star, HeartHandshake, Wand2, Eye, Shirt } from "lucide-react";
import { Screen, useBaddia } from "@/lib/baddia-state";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

type Tab = { id: Screen; label: string; Icon: any };

const leftTabs: Tab[] = [
  { id: "daily",  label: "Daily",  Icon: Sparkles },
  { id: "zodiac", label: "Zodiac", Icon: Moon },
];
const rightTabs: Tab[] = [
  { id: "love",    label: "Love", Icon: Heart },
  { id: "profile", label: "Yo",   Icon: User },
];

type Reading = {
  emoji: string;
  title: string;
  desc: string;
  Icon: any;
  color: string;
  go?: Screen;
  soon?: boolean;
};

const readings: Reading[] = [
  { emoji: "🤚", title: "Lectura de manos", desc: "Tu palma, leída por IA.",        Icon: Hand,          color: "bg-baddia-mint",     go: "palm" },
  { emoji: "👗", title: "Outfit Check",      desc: "Tu look leído por IA.",          Icon: Shirt,         color: "bg-baddia-bubble",   go: "outfit" },
  { emoji: "🔮", title: "Tarot del día",    desc: "3 cartas para tu energía hoy.",  Icon: Wand2,         color: "bg-baddia-lavender", soon: true },
  { emoji: "✨", title: "Carta astral",     desc: "Tu mapa cósmico personalizado.", Icon: Star,          color: "bg-baddia-yellow",   soon: true },
  { emoji: "💘", title: "Compatibilidad",   desc: "Tu match con tu crush.",         Icon: HeartHandshake,color: "bg-baddia-hot",      soon: true },
  { emoji: "👁️", title: "Aura Check",       desc: "Detecta tu aura del momento.",   Icon: Eye,           color: "bg-baddia-bubble",   soon: true },
];

export function BottomNav() {
  const { screen, go } = useBaddia();
  const [open, setOpen] = useState(false);

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
            size={20}
            strokeWidth={active ? 2.6 : 2}
            className={`transition-all duration-300 ${
              active ? "text-baddia-hot -translate-y-0.5" : "text-baddia-ink/55 group-hover:text-baddia-ink/80"
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
                <Sparkles size={24} strokeWidth={2.6} className="relative drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]" />
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
        <SheetContent side="bottom" className="rounded-t-3xl border-t-[2.5px] border-baddia-ink bg-gradient-to-b from-white via-pink-50/40 to-white p-0 max-h-[85vh]">
          <div className="px-5 pt-5 pb-2">
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-baddia-ink/15" />
            <SheetHeader className="text-left space-y-1">
              <SheetTitle className="font-display font-black text-[22px] text-baddia-ink leading-tight">
                Lecturas con IA ✨
              </SheetTitle>
              <SheetDescription className="text-[13px] text-baddia-ink/65 font-semibold">
                Tu energía, tus cartas, tu palma — leídas por IA.
              </SheetDescription>
            </SheetHeader>
          </div>

          <div className="px-4 pb-6 space-y-2.5 overflow-y-auto">
            {readings.map((r) => (
              <button
                key={r.title}
                disabled={r.soon}
                onClick={() => {
                  if (r.go) {
                    go(r.go);
                    setOpen(false);
                  }
                }}
                className="w-full flex items-center gap-3 rounded-2xl border-[2px] border-baddia-ink bg-white p-3 shadow-[3px_3px_0_hsl(260_16%_15%)] text-left transition-transform active:scale-[0.98] disabled:opacity-70"
              >
                <span className={`shrink-0 w-12 h-12 rounded-xl border-2 border-baddia-ink ${r.color} flex items-center justify-center text-2xl`}>
                  {r.emoji}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-display font-black text-[15px] text-baddia-ink leading-tight">{r.title}</span>
                    {r.soon && (
                      <span className="text-[9px] font-display font-black uppercase tracking-widest text-baddia-ink/55 border border-baddia-ink/30 rounded-full px-1.5 py-[1px]">
                        pronto
                      </span>
                    )}
                  </span>
                  <span className="block text-[12px] text-baddia-ink/65 font-semibold leading-snug mt-0.5">
                    {r.desc}
                  </span>
                </span>
              </button>
            ))}

            <p className="text-[11px] text-center text-baddia-ink/55 font-semibold pt-2 leading-relaxed">
              Powered by IA · resultados solo para entretenimiento 💖
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
