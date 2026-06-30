import { useEffect, useMemo, useState } from "react";
import {
  Crown,
  Heart,
  Sparkles,
  Star,
  ArrowRight,
  Gift,
  Check,
  Wand2,
  Eye,
  Hand,
  Moon,
  Users,
  Flame,
  Shirt,
  X,
} from "lucide-react";
import type { BaddiaUser } from "@/lib/baddia-state";

interface Props {
  plan: BaddiaUser["plan"];
  onDone: () => void;
}

type Step = "celebration" | "unlocked";
type ConfettiShape = "rect" | "circle" | "diamond";

interface Piece {
  left: number;
  delay: number;
  duration: number;
  rotate: number;
  size: number;
  color: string;
  shape: ConfettiShape;
}

const COLORS = [
  "hsl(335 100% 59%)", // hot
  "hsl(325 100% 74%)", // bubble
  "hsl(48 100% 59%)",  // yellow
  "hsl(256 90% 68%)", // lavender
  "hsl(169 81% 43%)", // mint
  "hsl(76 100% 48%)", // lime
];

const PLAN_FEATURES = [
  { icon: Wand2, label: "Tarot del día" },
  { icon: Eye, label: "Aura Check" },
  { icon: Hand, label: "Palm Reading" },
  { icon: Moon, label: "Carta astral" },
  { icon: Heart, label: "Crush Energy" },
  { icon: Shirt, label: "Outfit Check" },
];

const GIRLS_FEATURES = [
  { icon: Users, label: "4 perfiles Baddia" },
  { icon: Heart, label: "Compatibilidad entre amigas" },
  { icon: Flame, label: "Rituales grupales" },
  { icon: Sparkles, label: "Todo lo de Baddia Pro" },
];

export function PlanCelebration({ plan, onDone }: Props) {
  const isGirls = plan === "Baddia Girls";
  const [step, setStep] = useState<Step>("celebration");
  const [showContinueHint, setShowContinueHint] = useState(false);

  const pieces = useMemo<Piece[]>(() => {
    return Array.from({ length: 70 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2.2 + Math.random() * 1.6,
      rotate: Math.random() * 720 - 360,
      size: 6 + Math.random() * 10,
      color: COLORS[i % COLORS.length],
      shape: ["rect", "circle", "diamond"][i % 3] as ConfettiShape,
    }));
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setShowContinueHint(true), 1200);
    const t2 = setTimeout(() => setStep("unlocked"), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleDone = () => {
    onDone();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden animate-fade-in">
      {/* Blurred background */}
      <div className="absolute inset-0 bg-baddia-ink/35 backdrop-blur-md" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, hsl(325 100% 74% / 0.45), hsl(256 90% 68% / 0.22) 45%, transparent 75%)",
        }}
      />

      {/* Confetti */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {pieces.map((p, i) => (
          <span
            key={i}
            className="absolute -top-5 block"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.shape === "rect" ? p.size * 0.55 : p.size,
              background: p.color,
              borderRadius: p.shape === "circle" ? "50%" : "2px",
              transform: `rotate(${p.rotate}deg)`,
              animation: `confettiFall ${p.duration}s cubic-bezier(.4,.7,.6,1) ${p.delay}s forwards`,
            }}
          />
        ))}
      </div>

      {/* Floating stickers */}
      <FloatingSticker
        Icon={Heart}
        className="top-[14%] left-[8%] -rotate-12"
        color="bg-baddia-hot"
        delay="0s"
      />
      <FloatingSticker
        Icon={Star}
        className="top-[20%] right-[7%] rotate-14"
        color="bg-baddia-yellow"
        delay="0.4s"
      />
      <FloatingSticker
        Icon={Sparkles}
        className="bottom-[20%] left-[7%] rotate-10"
        color="bg-baddia-lavender"
        delay="0.8s"
      />
      <FloatingSticker
        Icon={Crown}
        className="bottom-[14%] right-[8%] -rotate-8"
        color="bg-baddia-bubble"
        delay="1.2s"
      />
      <FloatingSticker
        Icon={Gift}
        className="top-[38%] right-[4%] rotate-18"
        color="bg-baddia-mint"
        delay="1.6s"
      />

      {step === "celebration" ? (
        <CelebrationCard
          plan={plan}
          isGirls={isGirls}
          showContinueHint={showContinueHint}
          onContinue={() => setStep("unlocked")}
        />
      ) : (
        <UnlockedCard
          plan={plan}
          isGirls={isGirls}
          onDone={handleDone}
        />
      )}

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          12% { opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function CelebrationCard({
  plan,
  isGirls,
  showContinueHint,
  onContinue,
}: {
  plan: BaddiaUser["plan"];
  isGirls: boolean;
  showContinueHint: boolean;
  onContinue: () => void;
}) {
  return (
    <div className="relative z-10 mx-6 w-full max-w-[360px] animate-pop-in">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-gold text-baddia-ink border-[2.5px] border-baddia-ink px-3.5 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
          <Sparkles size={11} strokeWidth={2.5} /> Plan activado
        </span>
      </div>

      <div className="relative rounded-[32px] border-[3px] border-baddia-ink bg-white p-7 pt-9 text-center shadow-[6px_7px_0_hsl(260_16%_15%)] overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-baddia-bubble/25 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-baddia-lavender/25 blur-3xl" />

        {/* Central icon */}
        <div
          className="relative mx-auto mb-4 w-[92px] h-[92px] rounded-full border-[3px] border-baddia-ink gradient-bg-hot flex items-center justify-center text-white shadow-[4px_4px_0_hsl(260_16%_15%)] animate-breathe"
        >
          <span className="absolute inset-x-3 top-2 h-5 rounded-full bg-white/35 blur-[2px]" />
          {isGirls ? (
            <Users size={40} strokeWidth={2.5} className="relative" />
          ) : (
            <Crown size={40} strokeWidth={2.5} className="relative" />
          )}
        </div>

        <h2 className="font-display font-black text-[24px] leading-[1.05] text-baddia-ink">
          {isGirls ? "Bienvenidas, Baddia Girls" : `Bienvenida a Baddia ${plan}`}
        </h2>

        <p className="text-[13px] font-semibold text-baddia-ink/70 mt-2.5 leading-snug">
          {isGirls
            ? "Tu círculo de brujas digitales ya está listo. Juntas brillan más fuerte."
            : "Gracias por confiar tu glow a Baddia. Esto es solo el comienzo de tu era más mágica."}
        </p>

        <div className="mt-5 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-baddia-bubble/20 text-baddia-ink border-[2px] border-baddia-ink px-2.5 py-1 text-[10px] font-display font-bold shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1">
            <Heart size={10} className="fill-baddia-hot text-baddia-hot" /> Baddia Girl
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-baddia-yellow/90 text-baddia-ink border-[2px] border-baddia-ink px-2.5 py-1 text-[10px] font-display font-bold shadow-[2px_2px_0_hsl(260_16%_15%)] rotate-1">
            <Star size={10} className="fill-baddia-ink" /> Premium
          </span>
        </div>

        {/* Continue hint */}
        {showContinueHint && (
          <button
            onClick={onContinue}
            className="mt-6 w-full py-3.5 rounded-full bg-baddia-ink text-white font-display font-black text-[13px] border-[2.5px] border-baddia-ink shadow-[4px_4px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all inline-flex items-center justify-center gap-2"
          >
            Ver mi desbloqueo <ArrowRight size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

function UnlockedCard({
  plan,
  isGirls,
  onDone,
}: {
  plan: BaddiaUser["plan"];
  isGirls: boolean;
  onDone: () => void;
}) {
  const features = isGirls ? GIRLS_FEATURES : PLAN_FEATURES;

  return (
    <div className="relative z-10 mx-6 w-full max-w-[360px] animate-pop-in">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-lavender text-white border-[2.5px] border-baddia-ink px-3.5 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] rotate-2">
          <Gift size={11} strokeWidth={2.5} /> Tu regalo de bienvenida
        </span>
      </div>

      <div className="relative rounded-[32px] border-[3px] border-baddia-ink bg-white p-6 pt-9 shadow-[6px_7px_0_hsl(260_16%_15%)] overflow-hidden">
        {/* Close */}
        <button
          onClick={onDone}
          aria-label="Cerrar"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-baddia-ink/5 border-2 border-baddia-ink/10 flex items-center justify-center text-baddia-ink/60 hover:bg-baddia-ink/10 transition-colors"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        <div className="text-center">
          <p className="font-display font-black text-[13px] uppercase tracking-widest text-baddia-ink/50">
            Ahora tienes acceso a
          </p>
          <h3 className="font-display font-black text-[22px] leading-tight text-baddia-ink mt-1">
            {isGirls ? "Todo Baddia Girls" : "Todo Baddia Pro"}
          </h3>
        </div>

        {/* Feature grid */}
        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {features.map((f, i) => (
            <div
              key={i}
              className="relative rounded-2xl border-[2.5px] border-baddia-ink bg-white p-3 shadow-[3px_3px_0_hsl(260_16%_15%)] flex flex-col items-center text-center gap-1.5"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="w-9 h-9 rounded-xl bg-baddia-bubble/20 border-2 border-baddia-ink flex items-center justify-center text-baddia-ink">
                <f.icon size={17} strokeWidth={2.5} />
              </span>
              <span className="font-display font-bold text-baddia-ink text-[11px] leading-tight">
                {f.label}
              </span>
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-baddia-mint border border-baddia-ink flex items-center justify-center">
                <Check size={9} strokeWidth={4} className="text-baddia-ink" />
              </span>
            </div>
          ))}
        </div>

        {/* Appreciation note */}
        <div className="mt-5 rounded-2xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-baddia-bubble/20 to-baddia-lavender/20 p-4 shadow-[3px_3px_0_hsl(260_16%_15%)]">
          <p className="text-[12.5px] font-semibold text-baddia-ink/80 leading-relaxed text-center">
            Cada lectura que hagas ahora es una invitación a conectar con tu energía. Gracias por dejarnos acompañar tu glow.
          </p>
        </div>

        <button
          onClick={onDone}
          className="mt-5 w-full py-3.5 rounded-full bg-gradient-hot text-white font-display font-black text-[14px] border-[2.5px] border-baddia-ink shadow-[4px_4px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all inline-flex items-center justify-center gap-2"
        >
          <Sparkles size={15} strokeWidth={2.5} /> Ir a mi glow
        </button>
      </div>
    </div>
  );
}

function FloatingSticker({
  Icon,
  className,
  color,
  delay,
}: {
  Icon: typeof Heart;
  className: string;
  color: string;
  delay: string;
}) {
  return (
    <span
      className={`absolute hidden sm:flex w-11 h-11 rounded-full border-[2.5px] border-baddia-ink ${color} items-center justify-center text-white shadow-[2px_2px_0_hsl(260_16%_15%)] animate-float-cute ${className}`}
      style={{ animationDelay: delay }}
    >
      <Icon size={20} strokeWidth={2.5} />
    </span>
  );
}
