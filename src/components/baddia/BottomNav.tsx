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

  return (
    <nav className="sticky bottom-0 z-40 px-3 pb-3 pt-2 bg-gradient-to-t from-white via-white/90 to-transparent">
      <ul className="flex items-stretch justify-between gap-1 rounded-2xl border-[2px] border-baddia-ink bg-white px-1.5 py-1.5 shadow-[3px_3px_0_hsl(260_16%_15%)]">
        {tabs.map(({ id, label, Icon }) => {
          const active = screen === id;
          return (
            <li key={id} className="flex-1">
              <button
                onClick={() => go(id)}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className="w-full flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-xl transition-colors active:scale-95"
                style={active ? { backgroundColor: "hsl(340 90% 95%)" } : undefined}
              >
                <Icon
                  size={20}
                  strokeWidth={active ? 2.6 : 2}
                  className={active ? "text-baddia-hot" : "text-baddia-ink/50"}
                />
                <span
                  className={`text-[10px] font-display font-bold leading-none tracking-wide ${
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
