import { useEffect, useMemo, useState } from "react";
import baddiaLogo from "@/assets/baddia-logo.png.asset.json";

interface Props {
  onDone: () => void;
  duration?: number;
}

const COLORS = [
  "hsl(335 100% 65%)",
  "hsl(325 100% 74%)",
  "hsl(256 90% 68%)",
  "hsl(48 100% 59%)",
  "hsl(169 81% 55%)",
];

const STICKERS = ["✦", "✧", "♡", "★", "✿", "🌙", "💖", "✨", "🌸", "⭐"];

export function Splash({ onDone, duration = 3000 }: Props) {
  const [leaving, setLeaving] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  const confetti = useMemo(
    () =>
      Array.from({ length: 32 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: 0.6 + Math.random() * 1.2,
        dur: 2 + Math.random() * 1.6,
        size: 12 + Math.random() * 20,
        color: COLORS[i % COLORS.length],
        rot: Math.random() * 360,
        drift: -60 + Math.random() * 120,
        shape: STICKERS[i % STICKERS.length],
      })),
    []
  );

  const stickers = useMemo(
    () => [
      { emoji: "💖", top: "12%", left: "8%", delay: 0.9, rot: -18 },
      { emoji: "✨", top: "18%", right: "10%", delay: 1.05, rot: 12 },
      { emoji: "🌙", bottom: "22%", left: "6%", delay: 1.2, rot: -14 },
      { emoji: "⭐", bottom: "16%", right: "8%", delay: 1.35, rot: 18 },
      { emoji: "🌸", top: "42%", left: "3%", delay: 1.5, rot: 8 },
      { emoji: "✧", top: "44%", right: "4%", delay: 1.6, rot: -8 },
    ],
    []
  );

  useEffect(() => {
    // camera "flash" right when polaroid lands
    const flash = setTimeout(() => setFlashOn(true), 380);
    const flashOff = setTimeout(() => setFlashOn(false), 620);
    const leave = setTimeout(() => setLeaving(true), duration - 500);
    const done = setTimeout(onDone, duration);
    return () => {
      clearTimeout(flash);
      clearTimeout(flashOff);
      clearTimeout(leave);
      clearTimeout(done);
    };
  }, [onDone, duration]);

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[200] flex items-center justify-center overflow-hidden transition-all duration-500 ${
        leaving ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
      style={{
        background:
          "radial-gradient(circle at 30% 20%, hsl(325 100% 90%) 0%, hsl(256 100% 93%) 45%, hsl(48 100% 96%) 100%)",
      }}
    >
      {/* soft blobs */}
      <div
        className="absolute -top-24 -left-16 w-72 h-72 rounded-full blur-3xl opacity-70"
        style={{ background: "hsl(325 100% 78%)", animation: "splashBlob 6s ease-in-out infinite" }}
      />
      <div
        className="absolute -bottom-24 -right-16 w-80 h-80 rounded-full blur-3xl opacity-60"
        style={{ background: "hsl(256 90% 78%)", animation: "splashBlob 7s ease-in-out infinite 1s" }}
      />
      <div
        className="absolute top-1/3 -right-10 w-56 h-56 rounded-full blur-3xl opacity-50"
        style={{ background: "hsl(48 100% 75%)", animation: "splashBlob 8s ease-in-out infinite .5s" }}
      />

      {/* diagonal grid dots for cuteness */}
      <div
        className="absolute inset-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(hsl(256 60% 40%) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* floating stickers around polaroid */}
      {stickers.map((s, i) => (
        <span
          key={i}
          className="absolute text-3xl select-none"
          style={{
            top: (s as any).top,
            left: (s as any).left,
            right: (s as any).right,
            bottom: (s as any).bottom,
            opacity: 0,
            animation: `stickerIn .7s cubic-bezier(.34,1.56,.64,1) ${s.delay}s forwards, stickerFloat 3.6s ease-in-out ${s.delay + 0.7}s infinite`,
            ["--rot" as any]: `${s.rot}deg`,
            filter: "drop-shadow(0 4px 10px hsl(335 100% 60% / 0.35))",
          }}
        >
          {s.emoji}
        </span>
      ))}

      {/* confetti glitter (delayed until after polaroid snap) */}
      {confetti.map((c, i) => (
        <span
          key={i}
          className="absolute top-0 select-none"
          style={{
            left: `${c.left}%`,
            fontSize: c.size,
            color: c.color,
            animation: `splashFall ${c.dur}s cubic-bezier(.4,.1,.5,1) ${c.delay}s forwards`,
            ["--rot" as any]: `${c.rot}deg`,
            ["--drift" as any]: `${c.drift}px`,
            filter: "drop-shadow(0 0 6px hsl(48 100% 75% / 0.8))",
            opacity: 0,
          }}
        >
          {c.shape}
        </span>
      ))}

      {/* camera flash */}
      <div
        className="absolute inset-0 bg-white pointer-events-none transition-opacity duration-200"
        style={{ opacity: flashOn ? 0.85 : 0 }}
      />

      {/* Polaroid */}
      <div
        className="relative"
        style={{ animation: "polaroidDrop 1s cubic-bezier(.34,1.56,.64,1) both" }}
      >
        {/* washi tape top */}
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-24 h-6 rotate-[-6deg] rounded-[2px] shadow-[2px_2px_0_rgba(0,0,0,0.08)]"
          style={{
            background:
              "repeating-linear-gradient(45deg, hsl(325 100% 82%) 0 8px, hsl(48 100% 78%) 8px 16px)",
            opacity: 0.85,
          }}
        />
        <div
          className="absolute -top-3 left-6 z-20 w-14 h-5 rotate-[14deg] rounded-[2px] shadow-[2px_2px_0_rgba(0,0,0,0.06)]"
          style={{
            background:
              "repeating-linear-gradient(45deg, hsl(256 80% 82%) 0 6px, white 6px 12px)",
            opacity: 0.85,
          }}
        />

        <div
          className="relative bg-white rounded-[6px] p-3 pb-16"
          style={{
            boxShadow:
              "0 30px 60px -20px hsl(256 60% 30% / 0.35), 0 10px 20px -10px hsl(335 100% 55% / 0.35)",
            transform: "rotate(-3deg)",
          }}
        >
          {/* photo */}
          <div
            className="relative overflow-hidden rounded-[3px]"
            style={{ width: 240, height: 240, animation: "photoDevelop 1.4s ease-out .3s both" }}
          >
            <img
              src={baddiaLogo.url}
              alt="Baddia"
              className="w-full h-full object-cover"
              style={{ animation: "photoPulse 2.4s ease-in-out .9s infinite" }}
            />
            {/* glossy corner shine */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 40%)",
              }}
            />
            {/* sparkle overlays */}
            <span
              className="absolute top-3 right-4 text-xl"
              style={{ animation: "splashSparkle 1.6s ease-in-out .8s infinite" }}
            >
              ✦
            </span>
            <span
              className="absolute bottom-3 left-3 text-lg"
              style={{ animation: "splashSparkle 1.8s ease-in-out 1.1s infinite" }}
            >
              ✧
            </span>
          </div>

          {/* handwritten caption */}
          <div
            className="absolute left-0 right-0 bottom-3 text-center"
            style={{ animation: "captionIn .6s ease-out 1.1s both" }}
          >
            <p
              className="font-display font-black gradient-text tracking-tight"
              style={{ fontSize: 26, lineHeight: 1 }}
            >
              Baddia
            </p>
            <p
              className="mt-1 text-baddia-ink/60 text-[11px] font-semibold"
              style={{ fontFamily: "'Caveat', 'Comic Sans MS', cursive", fontSize: 13 }}
            >
              tu glow cósmico ✨
            </p>
          </div>
        </div>

      </div>

      <style>{`
        @keyframes polaroidDrop {
          0%   { transform: translateY(-120vh) rotate(-25deg) scale(.6); opacity: 0; }
          55%  { transform: translateY(20px) rotate(6deg) scale(1.05); opacity: 1; }
          72%  { transform: translateY(-8px) rotate(-4deg) scale(1); }
          85%  { transform: translateY(4px) rotate(-2deg) scale(1); }
          100% { transform: translateY(0) rotate(-3deg) scale(1); opacity: 1; }
        }
        @keyframes photoDevelop {
          0%   { filter: brightness(2.4) saturate(0) blur(6px); opacity: 0; }
          40%  { filter: brightness(1.6) saturate(.5) blur(2px); opacity: .8; }
          100% { filter: brightness(1) saturate(1) blur(0); opacity: 1; }
        }
        @keyframes photoPulse {
          0%,100% { transform: scale(1); }
          50%     { transform: scale(1.03); }
        }
        @keyframes captionIn {
          from { transform: translateY(6px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        @keyframes stickerIn {
          from { transform: scale(.2) rotate(0); opacity: 0; }
          to   { transform: scale(1) rotate(var(--rot)); opacity: 1; }
        }
        @keyframes stickerFloat {
          0%,100% { transform: translateY(0) rotate(var(--rot)); }
          50%     { transform: translateY(-8px) rotate(calc(var(--rot) + 4deg)); }
        }
        @keyframes splashFall {
          0%   { transform: translate3d(0,-15vh,0) rotate(0) scale(.6); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translate3d(var(--drift),110vh,0) rotate(var(--rot)) scale(1); opacity: 0; }
        }
        @keyframes splashSparkle {
          0%,100% { transform: rotate(0) scale(1); opacity: .9; }
          50%     { transform: rotate(180deg) scale(1.35); opacity: 1; }
        }
        @keyframes splashBlob {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(20px,-15px) scale(1.1); }
        }
        @keyframes splashDot {
          0%,100% { transform: translateY(0); opacity: .4; }
          50%     { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
