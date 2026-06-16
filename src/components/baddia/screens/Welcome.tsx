import { useBaddia } from "@/lib/baddia-state";
import { Logo } from "../Logo";
import { Sparkles } from "../PhoneFrame";

export function Welcome() {
  const { go } = useBaddia();
  return (
    <div className="relative min-h-full flex flex-col gradient-bg-soft overflow-hidden">
      <Sparkles />
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-16 w-72 h-72 rounded-full bg-baddia-pink/40 blur-3xl" />
      <div className="absolute top-32 -right-20 w-64 h-64 rounded-full bg-baddia-lavender/50 blur-3xl" />
      <div className="absolute bottom-0 left-10 w-48 h-48 rounded-full bg-baddia-gold/30 blur-3xl" />

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 text-center pt-20 pb-10">
        <div className="animate-float mb-8">
          <Logo size={88} />
        </div>
        <h1 className="font-display font-black text-3xl leading-tight text-baddia-purple mb-3 animate-fade-in">
          Descubre tu energía,<br />tu suerte y tu poder.
        </h1>
        <p className="text-baddia-purple/70 max-w-[280px] text-sm font-medium">
          Tu app diaria de glow up, zodiac mood y crush energy. ✨
        </p>
      </div>

      <div className="relative px-6 pb-10 space-y-3">
        <button
          onClick={() => go("onboarding")}
          className="w-full py-4 rounded-2xl bg-gradient-glow text-white font-bold text-lg shadow-glow active:scale-[0.98] transition-transform"
        >
          Empezar ✨
        </button>
        <button
          onClick={() => go("daily")}
          className="w-full py-3.5 rounded-2xl bg-white border border-pink-100 text-baddia-purple font-semibold"
        >
          Ya tengo cuenta
        </button>
        <p className="text-[11px] text-center text-muted-foreground px-4 pt-2 leading-relaxed">
          Lecturas creadas con IA para entretenimiento, inspiración y amor propio.
        </p>
      </div>
    </div>
  );
}
