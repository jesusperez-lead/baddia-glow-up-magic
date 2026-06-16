import { Sparkles, Heart, Hand, HeartHandshake, User, Moon } from "lucide-react";
import { Screen, useBaddia } from "@/lib/baddia-state";

const tabs: { id: Screen; label: string; Icon: any }[] = [
  { id: "daily", label: "Daily", Icon: Sparkles },
  { id: "zodiac", label: "Zodiac", Icon: Moon },
  { id: "palm", label: "Palm", Icon: Hand },
  { id: "love", label: "Love", Icon: Heart },
  { id: "profile", label: "Yo", Icon: User },
];

export function BottomNav() {
  const { screen, go } = useBaddia();
  return (
    <nav className="sticky bottom-0 z-40 glass border-t border-pink-100/70 px-2 pt-2 pb-3">
      <ul className="flex items-end justify-between">
        {tabs.map(({ id, label, Icon }) => {
          const active = screen === id;
          return (
            <li key={id} className="flex-1">
              <button
                onClick={() => go(id)}
                className="w-full flex flex-col items-center gap-1 py-1.5 transition-transform active:scale-95"
              >
                <span
                  className={`flex items-center justify-center w-11 h-11 rounded-2xl transition-all ${
                    active
                      ? "bg-gradient-glow text-white shadow-glow scale-105"
                      : "text-baddia-purple/60"
                  }`}
                >
                  <Icon size={20} strokeWidth={2.4} />
                </span>
                <span className={`text-[10px] font-semibold ${active ? "text-baddia-hot" : "text-baddia-purple/60"}`}>
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
