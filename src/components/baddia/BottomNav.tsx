import { Sparkles, Hand, Heart, User, Moon } from "lucide-react";
import { Screen, useBaddia } from "@/lib/baddia-state";

type Tab = { id: Screen; label: string; Icon: any };

const tabs: Tab[] = [
  { id: "daily",   label: "Daily",  Icon: Sparkles },
  { id: "zodiac",  label: "Zodiac", Icon: Moon },
  { id: "palm",    label: "Palm",   Icon: Hand },
  { id: "love",    label: "Love",   Icon: Heart },
  { id: "profile", label: "Yo",     Icon: User },
];

export function BottomNav() {
  const { screen, go } = useBaddia();
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === screen));
  const widthPct = 100 / tabs.length;

  return (
    <nav className="sticky bottom-0 z-40 px-3 pb-3 pt-3 bg-gradient-to-t from-white/80 via-white/40 to-transparent">
      <ul
        className="relative flex items-stretch justify-between gap-1 rounded-2xl border-[2px] border-baddia-ink/90 px-1.5 py-1.5 shadow-[3px_3px_0_hsl(260_16%_15%)] overflow-hidden bg-white/55 backdrop-blur-xl backdrop-saturate-150"
      >
        {/* liquid-glass sliding highlight */}
        <span
          aria-hidden
          className="absolute top-1.5 bottom-1.5 rounded-xl bg-gradient-to-br from-white/90 via-pink-100/80 to-white/60 border border-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_-2px_rgba(255,90,140,0.35)] backdrop-blur-md transition-[left] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            width: `calc(${widthPct}% - 6px)`,
            left: `calc(${activeIndex * widthPct}% + 3px)`,
          }}
        />
        {/* soft glossy sheen */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-2xl"
        />

        {tabs.map(({ id, label, Icon }, i) => {
          const active = i === activeIndex;
          return (
            <li key={id} className="flex-1 relative z-10">
              <button
                onClick={() => go(id)}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className="group w-full flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-transform duration-300 active:scale-90"
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.6 : 2}
                  className={`transition-all duration-300 ${
                    active
                      ? "text-baddia-hot scale-110 drop-shadow-[0_1px_4px_rgba(255,90,140,0.45)]"
                      : "text-baddia-ink/55 group-hover:text-baddia-ink/80"
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
        })}
      </ul>
    </nav>
  );
}
