import { useEffect, useMemo, useState } from "react";

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

const STICKERS = ["✦", "✧", "♡", "★", "✿", "🌙", "💖", "✨"];

export function Splash({ onDone, duration = 2600 }: Props) {
  const [leaving, setLeaving] = useState(false);

  const confetti = useMemo(
    () =>
      Array.from({ length: 26 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 1.8 + Math.random() * 1.4,
        size: 12 + Math.random() * 18,
        color: COLORS[i % COLORS.length],
        rot: Math.random() * 360,
        drift: -40 + Math.random() * 80,
        shape: STICKERS[i % STICKERS.length],
      })),
    []
  );

  const orbits = useMemo(
    () => [
      { emoji: "✨", r: 82, dur: 6, delay: 0 },
      { emoji: "💖", r: 100, dur: 8, delay: -2, reverse: true },
      { emoji: "🌙", r: 118, dur: 10, delay: -1 },
      { emoji: "✦", r: 92, dur: 7, delay: -3, reverse: true },
    ],
    []
  );

  useEffect(() => {
    const leave = setTimeout(() => setLeaving(true), duration - 500);
    const done = setTimeout(onDone, duration);
    return () => {
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
          "radial-gradient(circle at 30% 20%, hsl(325 100% 88%) 0%, hsl(256 100% 92%) 45%, hsl(333 100% 98%) 100%)",
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
        style={{ background: "hsl(48 100% 70%)", animation: "splashBlob 8s ease-in-out infinite .5s" }}
      />

      {/* confetti glitter */}
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
          }}
        >
          {c.shape}
        </span>
      ))}

      {/* center logo w/ orbits */}
      <div className="relative" style={{ animation: "splashPop .8s cubic-bezier(.34,1.56,.64,1) both" }}>
        {/* glow halo */}
        <div
          className="absolute inset-0 rounded-full blur-2xl"
          style={{
            background: "var(--gradient-hot)",
            animation: "splashHalo 1.8s ease-in-out infinite",
          }}
        />

        {/* orbits */}
        {orbits.map((o, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 pointer-events-none"
            style={{
              width: o.r * 2,
              height: o.r * 2,
              marginLeft: -o.r,
              marginTop: -o.r,
              animation: `splashOrbit ${o.dur}s linear infinite ${o.delay}s ${o.reverse ? "reverse" : ""}`,
            }}
          >
            <span
              className="absolute left-1/2 -translate-x-1/2 -top-1 text-2xl"
              style={{ filter: "drop-shadow(0 0 8px hsl(48 100% 75% / 0.9))" }}
            >
              {o.emoji}
            </span>
          </div>
        ))}

        {/* Logo B */}
        <div
          className="relative flex items-center justify-center rounded-[36%] bg-gradient-hot shadow-[0_18px_50px_-10px_hsl(335_100%_60%/0.6)] border-4 border-white"
          style={{ width: 128, height: 128, animation: "splashPulse 1.6s ease-in-out infinite" }}
        >
          <span
            className="font-display font-black text-white leading-none"
            style={{ fontSize: 78, textShadow: "3px 4px 0 hsl(260 16% 15% / 0.15)" }}
          >
            B
          </span>
          <span
            className="absolute -top-2 -right-2 text-3xl"
            style={{ animation: "splashSparkle 1.4s ease-in-out infinite" }}
          >
            ✦
          </span>
          <span
            className="absolute -bottom-2 -left-2 text-2xl"
            style={{ animation: "splashSparkle 1.6s ease-in-out infinite .3s" }}
          >
            ✧
          </span>
        </div>

        {/* wordmark */}
        <div
          className="mt-6 text-center"
          style={{ animation: "splashSlide .8s cubic-bezier(.22,1,.36,1) .2s both" }}
        >
          <h1
            className="font-display font-black gradient-text tracking-tight"
            style={{ fontSize: 44, lineHeight: 1 }}
          >
            Baddia
          </h1>
          <p className="mt-2 text-baddia-ink/70 text-[13px] font-semibold">
            tu glow cósmico ✨
          </p>
          {/* loading dots */}
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="inline-block w-2 h-2 rounded-full bg-baddia-hot"
                style={{ animation: `splashDot 1s ease-in-out ${i * 0.15}s infinite` }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes splashFall {
          0%   { transform: translate3d(0,-15vh,0) rotate(0) scale(.6); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translate3d(var(--drift),110vh,0) rotate(var(--rot)) scale(1); opacity: 0; }
        }
        @keyframes splashPop {
          0%   { transform: scale(.5) rotate(-8deg); opacity: 0; }
          60%  { transform: scale(1.08) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes splashPulse {
          0%,100% { transform: scale(1); }
          50%     { transform: scale(1.06); }
        }
        @keyframes splashHalo {
          0%,100% { opacity: .55; transform: scale(1); }
          50%     { opacity: .85; transform: scale(1.15); }
        }
        @keyframes splashSparkle {
          0%,100% { transform: rotate(0) scale(1); opacity: .9; }
          50%     { transform: rotate(180deg) scale(1.3); opacity: 1; }
        }
        @keyframes splashOrbit {
          to { transform: rotate(360deg); }
        }
        @keyframes splashSlide {
          from { transform: translateY(14px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
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
