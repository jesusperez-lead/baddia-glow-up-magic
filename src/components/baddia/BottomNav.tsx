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
    <nav className="sticky bottom-0 z-40 bg-white/85 backdrop-blur-xl border-t border-baddia-ink/10 px-2 pt-1.5 pb-2">
      <ul className="flex items-stretch justify-between">
        {tabs.map(({ id, label, Icon }) => {
          const active = screen === id;
          return (
            <li key={id} className="flex-1">
              <button
                onClick={() => go(id)}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                className="group w-full flex flex-col items-center gap-1 py-1.5 transition-opacity active:opacity-70"
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.4 : 1.8}
                  className={active ? "text-baddia-hot" : "text-baddia-ink/45"}
                />
                <span
                  className={`text-[10px] font-semibold leading-none tracking-wide transition-colors ${
                    active ? "text-baddia-ink" : "text-baddia-ink/45"
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`h-[3px] w-1 rounded-full transition-all ${
                    active ? "bg-baddia-hot w-5" : "bg-transparent"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
