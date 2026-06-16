import { useBaddia } from "@/lib/baddia-state";
import { Logo } from "../Logo";
import { Sparkles } from "../PhoneFrame";

export function Welcome() {
  const { go } = useBaddia();
  return (
    <div className="relative min-h-full flex flex-col overflow-hidden bg-baddia-pearl">
      {/* Background blobs */}
      <div className="blob -top-24 -left-20 w-80 h-80 bg-baddia-bubble/55" style={{ animationDelay: "0s" }} />
      <div className="blob top-40 -right-24 w-72 h-72 bg-baddia-soft/70" style={{ animationDelay: "3s" }} />
      <div className="blob bottom-0 left-1/4 w-72 h-72 bg-baddia-yellow/45" style={{ animationDelay: "6s" }} />
      <div className="blob bottom-32 -right-10 w-48 h-48 bg-baddia-mint/40" style={{ animationDelay: "9s" }} />

      <Sparkles />

      {/* Top header */}
      <header className="relative z-10 flex items-center justify-end px-6 pt-6">
        <span className="chip bg-baddia-ink text-white">ES 🇪🇸</span>
      </header>

      {/* Collage zone */}
      <div className="relative z-10 flex-1 px-6 pt-4 pb-6 flex flex-col">
        <div className="relative h-[340px] mx-auto w-full max-w-[340px]">
          {/* Center logo card */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pop-in">
              <div className="relative">
                <div className="absolute inset-0 rounded-[40%] bg-gradient-glow blur-2xl opacity-70" />
                <div className="relative">
                  <Logo size={84} />
                </div>
              </div>
            </div>
          </div>

          {/* Floating stickers */}
          <div className="absolute top-2 left-2 sticker-float" style={{ ['--r' as any]: '-8deg' }}>
            <div className="baddia-pop px-3 py-2 text-xs font-display font-bold text-baddia-ink flex items-center gap-1">
              <span className="text-base">🌙</span> zodiac mood
            </div>
          </div>
          <div className="absolute top-0 right-0 sticker-float-slow" style={{ ['--r' as any]: '10deg' }}>
            <div className="rounded-2xl bg-baddia-lime border-2 border-baddia-ink px-3 py-2 text-xs font-display font-bold text-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)]">
              glow score 87
            </div>
          </div>
          <div className="absolute bottom-16 -left-2 sticker-float" style={{ ['--r' as any]: '6deg', animationDelay: '1s' }}>
            <div className="rounded-2xl bg-white border-2 border-baddia-ink px-3 py-2 text-xs font-display font-bold text-baddia-hot shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center gap-1">
              <span>💌</span> crush energy
            </div>
          </div>
          <div className="absolute bottom-0 right-2 sticker-float-fast" style={{ ['--r' as any]: '-6deg' }}>
            <div className="rounded-2xl bg-baddia-yellow border-2 border-baddia-ink px-3 py-2 text-xs font-display font-bold text-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center gap-1">
              <span>🍀</span> lucky #11
            </div>
          </div>
          <div className="absolute top-24 right-4 text-3xl sticker-float-slow">💖</div>
          <div className="absolute bottom-28 right-12 text-2xl sticker-float">✨</div>

          {/* Doodle arrow */}
          <svg className="absolute bottom-6 left-10 sticker-float-slow" width="60" height="40" viewBox="0 0 60 40" fill="none">
            <path d="M2 30 C 15 5, 35 5, 55 18" stroke="hsl(335 100% 59%)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 4" />
            <path d="M48 12 L55 18 L48 24" stroke="hsl(335 100% 59%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        {/* Headline */}
        <div className="text-center mt-2 animate-slide-up" style={{ animationDelay: "0.15s" }}>
          <h1 className="font-display font-bold text-[34px] leading-[1.05] text-baddia-ink">
            Descubre tu <span className="gradient-text">energía</span>,<br />
            tu <span className="text-baddia-lavender">suerte</span> y tu <span className="text-baddia-hot">poder</span>.
          </h1>
          <p className="mt-4 text-baddia-ink/70 text-[15px] font-semibold max-w-[300px] mx-auto">
            Tu glow cósmico diario empieza aquí. ✨
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="relative z-10 px-6 pb-8 space-y-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
        <button
          onClick={() => go("onboarding")}
          className="btn-sticker w-full py-[18px] rounded-full bg-gradient-hot text-white text-lg"
        >
          Empezar mi glow ✨
        </button>
        <button
          onClick={() => go("daily")}
          className="btn-sticker w-full py-4 rounded-full bg-white text-baddia-ink"
        >
          Ya tengo cuenta
        </button>
        <p className="text-[11px] text-center text-baddia-ink/50 pt-1 leading-relaxed px-4">
          Hecho con magia ✨ e IA para inspirarte, mimarte y recordarte lo bad que eres 💖
        </p>
      </div>

    </div>
  );
}
