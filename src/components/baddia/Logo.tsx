import { useId } from "react";

type LogoVariant = "full" | "icon" | "mono";

interface LogoProps {
  size?: number;
  variant?: LogoVariant;
  /** Mono color (CSS color). Defaults to currentColor. */
  monoColor?: string;
}

/**
 * Baddia wordmark — playful Y2K-ish lettering built with SVG.
 * - "full"  : horizontal icon + wordmark
 * - "icon"  : square app icon (rounded squircle with B + sparkle)
 * - "mono"  : one-tone version (uses currentColor or monoColor)
 */
export function Logo({ size = 64, variant = "full", monoColor }: LogoProps) {
  if (variant === "icon") return <LogoIcon size={size} />;
  if (variant === "mono") return <LogoMono size={size} color={monoColor} />;
  return <LogoFull size={size} />;
}

/* ------------------------------------------------------------------ */
/* FULL — icon + wordmark                                             */
/* ------------------------------------------------------------------ */
function LogoFull({ size = 64 }: { size?: number }) {
  // Height-driven sizing. Width auto-scales via the SVG viewBox.
  const h = size;
  return (
    <div className="inline-flex items-center gap-3" style={{ height: h }}>
      <LogoIcon size={h} />
      <Wordmark height={h * 0.78} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ICON — squircle with B + sparkle (good for app icon / favicon)     */
/* ------------------------------------------------------------------ */
export function LogoIcon({ size = 64 }: { size?: number }) {
  const id = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Baddia"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(335 100% 62%)" />
          <stop offset="55%" stopColor="hsl(325 100% 70%)" />
          <stop offset="100%" stopColor="hsl(256 90% 72%)" />
        </linearGradient>
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" stopOpacity="0.55" />
          <stop offset="55%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Squircle */}
      <rect
        x="4"
        y="4"
        width="112"
        height="112"
        rx="34"
        fill={`url(#${id}-bg)`}
        stroke="hsl(260 16% 15%)"
        strokeWidth="4"
      />
      {/* Glossy top shine */}
      <rect x="10" y="10" width="100" height="54" rx="28" fill={`url(#${id}-shine)`} />

      {/* B letter — Fredoka, bold, slightly tilted */}
      <text
        x="60"
        y="86"
        textAnchor="middle"
        fontFamily="Fredoka, Nunito, sans-serif"
        fontWeight="700"
        fontSize="78"
        fill="white"
        style={{ letterSpacing: "-0.04em" }}
      >
        B
      </text>

      {/* Sparkle top-right */}
      <g transform="translate(92 22)">
        <path
          d="M0 -10 L2.4 -2.4 L10 0 L2.4 2.4 L0 10 L-2.4 2.4 L-10 0 L-2.4 -2.4 Z"
          fill="hsl(48 100% 62%)"
          stroke="hsl(260 16% 15%)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
      {/* Tiny sparkle bottom-left */}
      <g transform="translate(24 96)">
        <path
          d="M0 -5 L1.2 -1.2 L5 0 L1.2 1.2 L0 5 L-1.2 1.2 L-5 0 L-1.2 -1.2 Z"
          fill="white"
        />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* WORDMARK — "Baddia" in Fredoka with gradient + ink stroke           */
/* dotless i with a sparkle on top                                    */
/* ------------------------------------------------------------------ */
function Wordmark({ height = 50, mono = false, color }: { height?: number; mono?: boolean; color?: string }) {
  const id = useId();
  // Intrinsic viewBox tuned for "Baddia" rendered in Fredoka 700.
  const vbW = 360;
  const vbH = 120;
  const width = (height / vbH) * vbW;

  const fill = mono ? (color ?? "currentColor") : `url(#${id}-grad)`;
  const stroke = mono ? (color ?? "currentColor") : "hsl(260 16% 15%)";

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${vbW} ${vbH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Baddia"
    >
      {!mono && (
        <defs>
          <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(335 100% 59%)" />
            <stop offset="60%" stopColor="hsl(325 100% 68%)" />
            <stop offset="100%" stopColor="hsl(256 90% 68%)" />
          </linearGradient>
        </defs>
      )}

      {/* Drop shadow ghost behind text (only color variant) */}
      {!mono && (
        <text
          x="6"
          y="92"
          fontFamily="Fredoka, Nunito, sans-serif"
          fontWeight="700"
          fontSize="104"
          fill="hsl(260 16% 15%)"
          style={{ letterSpacing: "-0.05em" }}
          transform="translate(3 4)"
          opacity="0.18"
        >
          Baddıa
        </text>
      )}

      {/* Main wordmark — note dotless "ı" so we can place a sparkle */}
      <text
        x="6"
        y="92"
        fontFamily="Fredoka, Nunito, sans-serif"
        fontWeight="700"
        fontSize="104"
        fill={fill}
        stroke={mono ? "none" : stroke}
        strokeWidth={mono ? 0 : 3}
        paintOrder="stroke fill"
        style={{ letterSpacing: "-0.05em" }}
      >
        Baddıa
      </text>

      {/* Sparkle replacing the dot on the "i" */}
      <g transform="translate(258 28)">
        <path
          d="M0 -14 L3.2 -3.2 L14 0 L3.2 3.2 L0 14 L-3.2 3.2 L-14 0 L-3.2 -3.2 Z"
          fill={mono ? (color ?? "currentColor") : "hsl(48 100% 60%)"}
          stroke={mono ? "none" : "hsl(260 16% 15%)"}
          strokeWidth={mono ? 0 : 2.5}
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* MONO — single-color horizontal version                              */
/* ------------------------------------------------------------------ */
function LogoMono({ size = 64, color }: { size?: number; color?: string }) {
  const h = size;
  const c = color ?? "currentColor";
  return (
    <div className="inline-flex items-center gap-3" style={{ height: h, color: c }}>
      <svg width={h} height={h} viewBox="0 0 120 120" fill="none" aria-label="Baddia">
        <rect x="4" y="4" width="112" height="112" rx="34" fill="none" stroke={c} strokeWidth="6" />
        <text
          x="60"
          y="86"
          textAnchor="middle"
          fontFamily="Fredoka, Nunito, sans-serif"
          fontWeight="700"
          fontSize="78"
          fill={c}
          style={{ letterSpacing: "-0.04em" }}
        >
          B
        </text>
        <g transform="translate(92 22)">
          <path d="M0 -10 L2.4 -2.4 L10 0 L2.4 2.4 L0 10 L-2.4 2.4 L-10 0 L-2.4 -2.4 Z" fill={c} />
        </g>
      </svg>
      <Wordmark height={h * 0.78} mono color={c} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Back-compat: keep <LogoMark /> import working in existing files.    */
/* ------------------------------------------------------------------ */
export function LogoMark({ size = 44 }: { size?: number }) {
  return <LogoIcon size={size} />;
}

