import { Sparkles, Hand, Heart, User, Moon } from "lucide-react";
import { Screen, useBaddia } from "@/lib/baddia-state";

type Tab = {
  id: Screen;
  label: string;
  emoji: string;
  Icon: any;
  color: string; // bg color for active pill
  text: string;  // text color for active label
};

const tabs: Tab[] = [
  { id: "daily",   label: "Daily",  emoji: "✨", Icon: Sparkles, color: "bg-baddia-yellow",   text: "text-baddia-hot"  },
  { id: "zodiac",  label: "Zodiac", emoji: "🌙", Icon: Moon,     color: "bg-baddia-lavender", text: "text-baddia-lavender" },
  { id: "palm",    label: "Palm",   emoji: "🤚", Icon: Hand,     color: "bg-baddia-mint",     text: "text-baddia-ink"  },
  { id: "love",    label: "Love",   emoji: "💘", Icon: Heart,    color: "bg-baddia-hot",      text: "text-baddia-hot"  },
  { id: "profile", label: "Yo",     emoji: "💖", Icon: User,     color: "bg-baddia-bubble",   text: "text-baddia-ink"  },
];

export function BottomNav() {
  const { screen, go } = useBaddia();

  return (
    <nav className="sticky bottom-0 z-40 px-3 pb-3 pt-2 bg-gradient-to-t from-white via-white/95 to-white/0">
      <ul
        className="relative flex items-stretch justify-between gap-1 rounded-[26px] border-[2.5px] border-baddia-ink bg-white px-2 py-2 shadow-[4px_5px_0_hsl(260_16%_15%)]"
      >
        {tabs.map(({ id, label, emoji, Icon, color, text }) => {
          const active = screen === id;
          return (
            <li key={id} className="flex-1">
              <button
                onClick={() => go(id)}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className="group relative w-full flex flex-col items-center justify-end gap-1 py-1 transition-transform active:scale-95"
              >
                {/* active pill */}
                <span
                  className={`relative flex items-center justify-center w-12 h-12 rounded-2xl border-[2.5px] border-baddia-ink transition-all ${
                    active
                      ? `${color} shadow-[2px_3px_0_hsl(260_16%_15%)] -translate-y-1 rotate-[-3deg]`
                      : "bg-white text-baddia-ink/55 shadow-[2px_2px_0_hsl(260_16%_15%)] group-hover:-translate-y-0.5"
                  }`}
                >
                  {active ? (
                    <span className="text-[20px] leading-none drop-shadow-sm">{emoji}</span>
                  ) : (
                    <Icon size={20} strokeWidth={2.4} />
                  )}
                  {active && (
                    <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-baddia-hot border-2 border-baddia-ink" />
                  )}
                </span>

                <span
                  className={`text-[10px] font-display font-black uppercase tracking-[0.08em] leading-none transition-colors ${
                    active ? text : "text-baddia-ink/55"
                  }`}
                >
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
