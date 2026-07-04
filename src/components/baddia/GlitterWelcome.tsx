import { useEffect, useMemo, useState } from "react";

interface Props {
  name: string;
  onDone: () => void;
}

const COLORS = [
  "hsl(335 100% 65%)",  // hot
  "hsl(325 100% 74%)",  // bubble
  "hsl(256 90% 68%)",   // lavender
  "hsl(48 100% 59%)",   // yellow
  "hsl(169 81% 55%)",   // mint
  "#ffffff",
];

interface Piece {
  left: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  rot: number;
  shape: "star" | "dot" | "sparkle" | "heart";
  drift: number;
}

export function GlitterWelcome({ name, onDone }: Props) {
  const [leaving, setLeaving] = useState(false);

  const pieces = useMemo<Piece[]>(() => {
    const shapes: Piece["shape"][] = ["star", "dot", "sparkle", "heart"];
    return Array.from({ length: 70 }).map(() => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.9,
      duration: 2.2 + Math.random() * 1.8,
      size: 8 + Math.random() * 18,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rot: Math.random() * 360,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      drift: -40 + Math.random() * 80,
    }));
  }, []);

  useEffect(() => {
    const leave = setTimeout(() => setLeaving(true), 2200);
    const done = setTimeout(onDone, 2800);
    return () => { clearTimeout(leave); clearTimeout(done); };
  }, [onDone]);

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none overflow-hidden transition-opacity duration-500 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      style={{
        background:
          "radial-gradient(circle at 50% 40%, hsl(325 100% 88% / 0.85) 0%, hsl(256 100% 92% / 0.75) 45%, hsl(333 100% 98% / 0.6) 100%)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {/* glitter pieces */}
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            color: p.color,
            animation: `glitterFall ${p.duration}s cubic-bezier(.4,.1,.5,1) ${p.delay}s forwards`,
            // custom props consumed by keyframes
            ["--rot" as any]: `${p.rot}deg`,
            ["--drift" as any]: `${p.drift}px`,
            filter: "drop-shadow(0 0 6px hsl(48 100% 75% / 0.7))",
          }}
        >
          {p.shape === "star" && "✦"}
          {p.shape === "sparkle" && "✧"}
          {p.shape === "heart" && "♡"}
          {p.shape === "dot" && (
            <span
              style={{
                display: "inline-block",
                width: p.size * 0.4,
                height: p.size * 0.4,
                borderRadius: "9999px",
                background: p.color,
              }}
            />
          )}
        </span>
      ))}

      {/* center greeting */}
      <div
        className="relative text-center px-6"
        style={{ animation: "welcomePop .7s cubic-bezier(.34,1.56,.64,1) both" }}
      >
        <span className="inline-block rounded-full bg-baddia-yellow border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3">
          ✨ bienvenida
        </span>
        <h2 className="font-display font-black text-[34px] leading-[1.05] text-baddia-ink drop-shadow-[0_2px_0_rgba(255,255,255,0.6)]">
          Hola, <span className="gradient-text">{name}</span> ✨
        </h2>
        <p className="mt-2 text-[14px] font-semibold text-baddia-ink/75">
          Tu glow de hoy te está esperando 💖
        </p>
      </div>

      <style>{`
        @keyframes glitterFall {
          0%   { transform: translate3d(0, -20vh, 0) rotate(0deg) scale(.6); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translate3d(var(--drift), 110vh, 0) rotate(var(--rot)) scale(1); opacity: 0; }
        }
        @keyframes welcomePop {
          0%   { transform: scale(.7) rotate(-4deg); opacity: 0; }
          60%  { transform: scale(1.06) rotate(1deg); opacity: 1; }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
