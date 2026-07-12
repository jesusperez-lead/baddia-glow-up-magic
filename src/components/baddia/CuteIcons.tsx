// Cute animated sticker-style icons for the Baddia app bar.
// Inline SVG (no deps, tiny) with hard ink outlines, glossy shine,
// and micro-animations when active. Girly, popy, on-brand.

import { CSSProperties } from "react";

type IconProps = {
  active?: boolean;
  size?: number;
  className?: string;
};

const INK = "hsl(260 16% 15%)";
const HOT = "hsl(335 100% 59%)";
const BUBBLE = "hsl(325 100% 74%)";
const LAV = "hsl(256 90% 68%)";
const YELLOW = "hsl(48 100% 59%)";
const MINT = "hsl(169 81% 55%)";
const WHITE = "#fff";

function Shine() {
  return (
    <ellipse cx="9" cy="8" rx="3" ry="1.6" fill="white" opacity="0.7" />
  );
}

function Sparkle({ x, y, size = 3, delay = 0 }: { x: number; y: number; size?: number; delay?: number }) {
  const style: CSSProperties = {
    transformOrigin: `${x}px ${y}px`,
    animation: `cuteSparkle 1.6s ease-in-out ${delay}s infinite`,
  };
  return (
    <g style={style}>
      <path
        d={`M${x} ${y - size} L${x + size * 0.3} ${y - size * 0.3} L${x + size} ${y} L${x + size * 0.3} ${y + size * 0.3} L${x} ${y + size} L${x - size * 0.3} ${y + size * 0.3} L${x - size} ${y} L${x - size * 0.3} ${y - size * 0.3} Z`}
        fill={YELLOW}
        stroke={INK}
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
    </g>
  );
}

const wrapStyle = (active?: boolean): CSSProperties => ({
  animation: active ? "cuteBounce 1.4s ease-in-out infinite" : undefined,
  transformOrigin: "50% 90%",
});

/* ---------- DAILY: sun/star with a cute face ---------- */
export function DailyIcon({ active, size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} style={wrapStyle(active)}>
      {/* rays */}
      <g stroke={INK} strokeWidth="1.6" strokeLinecap="round">
        <line x1="16" y1="2" x2="16" y2="5" />
        <line x1="16" y1="27" x2="16" y2="30" />
        <line x1="2" y1="16" x2="5" y2="16" />
        <line x1="27" y1="16" x2="30" y2="16" />
        <line x1="6" y1="6" x2="8" y2="8" />
        <line x1="24" y1="24" x2="26" y2="26" />
        <line x1="26" y1="6" x2="24" y2="8" />
        <line x1="8" y1="24" x2="6" y2="26" />
      </g>
      <circle cx="16" cy="16" r="8.5" fill={active ? YELLOW : WHITE} stroke={INK} strokeWidth="1.8" />
      <Shine />
      {/* face */}
      <circle cx="13.2" cy="15.5" r="0.9" fill={INK} />
      <circle cx="18.8" cy="15.5" r="0.9" fill={INK} />
      <path d="M13.5 18.3 Q16 20.3 18.5 18.3" stroke={INK} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      {/* cheeks */}
      <circle cx="12" cy="18" r="0.9" fill={HOT} opacity="0.55" />
      <circle cx="20" cy="18" r="0.9" fill={HOT} opacity="0.55" />
      {active && <Sparkle x={26} y={6} size={2.2} />}
    </svg>
  );
}

/* ---------- ZODIAC: moon + star ---------- */
export function ZodiacIcon({ active, size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} style={wrapStyle(active)}>
      <path
        d="M22 6.5 A11 11 0 1 0 25.5 22 A8.5 8.5 0 0 1 22 6.5 Z"
        fill={active ? LAV : WHITE}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* moon face */}
      <circle cx="14.5" cy="14.5" r="0.9" fill={INK} />
      <circle cx="19" cy="16" r="0.9" fill={INK} />
      <path d="M14.5 18.5 Q16.5 20 18.5 18.5" stroke={INK} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <circle cx="13" cy="17.5" r="0.8" fill={HOT} opacity="0.5" />
      <circle cx="20" cy="18.5" r="0.8" fill={HOT} opacity="0.5" />
      {/* stars */}
      <Sparkle x={7} y={9} size={2} />
      <Sparkle x={26} y={26} size={1.8} delay={0.5} />
      <circle cx="8" cy="22" r="0.9" fill={YELLOW} stroke={INK} strokeWidth="0.7" />
    </svg>
  );
}

/* ---------- LOVE: heart with face ---------- */
export function LoveIcon({ active, size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} style={wrapStyle(active)}>
      <path
        d="M16 27 C 5 20, 4 11, 10 8 C 13 6.5, 15.5 8.5, 16 10.5 C 16.5 8.5, 19 6.5, 22 8 C 28 11, 27 20, 16 27 Z"
        fill={active ? HOT : WHITE}
        stroke={INK}
        strokeWidth="1.9"
        strokeLinejoin="round"
      />
      {/* shine */}
      <path d="M10.5 12 Q9.5 14 10.8 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.85" />
      <circle cx="12" cy="11.5" r="1.1" fill="white" opacity="0.85" />
      {/* face */}
      <circle cx="13" cy="16" r="0.9" fill={INK} />
      <circle cx="19" cy="16" r="0.9" fill={INK} />
      <path d="M13.5 18.7 Q16 20.5 18.5 18.7" stroke={INK} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <circle cx="11.8" cy="18.2" r="0.9" fill={active ? YELLOW : HOT} opacity={active ? 0.9 : 0.55} />
      <circle cx="20.2" cy="18.2" r="0.9" fill={active ? YELLOW : HOT} opacity={active ? 0.9 : 0.55} />
      {active && <Sparkle x={26} y={7} size={2.2} />}
    </svg>
  );
}

/* ---------- PROFILE: cute girl bust with bow ---------- */
export function ProfileIcon({ active, size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} style={wrapStyle(active)}>
      {/* shoulders */}
      <path
        d="M5 28 C 6 22, 10 20, 16 20 C 22 20, 26 22, 27 28 Z"
        fill={active ? BUBBLE : WHITE}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      {/* head */}
      <circle cx="16" cy="12" r="6.5" fill={active ? YELLOW : WHITE} stroke={INK} strokeWidth="1.8" />
      {/* hair fringe */}
      <path d="M10.2 10 Q13 6.5 16 7 Q19 6 22 10" stroke={INK} strokeWidth="1.6" fill={INK} strokeLinejoin="round" />
      {/* face */}
      <circle cx="13.6" cy="12.8" r="0.9" fill={INK} />
      <circle cx="18.4" cy="12.8" r="0.9" fill={INK} />
      <path d="M14.2 15 Q16 16.4 17.8 15" stroke={INK} strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <circle cx="12.4" cy="14.3" r="0.8" fill={HOT} opacity="0.55" />
      <circle cx="19.6" cy="14.3" r="0.8" fill={HOT} opacity="0.55" />
      {/* bow */}
      <path
        d="M8 8 L11 6.5 L11 10 Z M8 8 L5 6.5 L5 10 Z"
        fill={HOT}
        stroke={INK}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="8" r="0.9" fill={INK} />
      {active && <Sparkle x={25} y={7} size={2} />}
    </svg>
  );
}

/* ---------- Wand for center FAB ---------- */
export function WandIcon({ size = 26, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
      <g style={{ transformOrigin: "16px 16px", animation: "cuteWiggle 2.2s ease-in-out infinite" }}>
        {/* stick */}
        <rect x="14.5" y="12" width="3" height="17" rx="1.5" fill={WHITE} stroke={INK} strokeWidth="1.8" transform="rotate(20 16 20)" />
        {/* star */}
        <path
          d="M16 3 L18.2 10 L25.5 10 L19.6 14.2 L21.8 21 L16 16.8 L10.2 21 L12.4 14.2 L6.5 10 L13.8 10 Z"
          fill={YELLOW}
          stroke={INK}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <circle cx="14.5" cy="9.5" r="0.7" fill="white" opacity="0.85" />
      </g>
      {/* sparkles around */}
      <Sparkle x={5} y={20} size={1.6} />
      <Sparkle x={27} y={22} size={1.6} delay={0.6} />
    </svg>
  );
}

/* keyframes injected once */
export function CuteIconsStyles() {
  return (
    <style>{`
      @keyframes cuteBounce {
        0%, 100% { transform: translateY(0) rotate(0); }
        50%      { transform: translateY(-2px) rotate(-4deg); }
      }
      @keyframes cuteSparkle {
        0%, 100% { transform: scale(0.6); opacity: 0.4; }
        50%      { transform: scale(1.2); opacity: 1; }
      }
      @keyframes cuteWiggle {
        0%, 100% { transform: rotate(-6deg); }
        50%      { transform: rotate(8deg); }
      }
    `}</style>
  );
}
