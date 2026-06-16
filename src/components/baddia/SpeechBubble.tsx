import { ReactNode } from "react";

type Variant = "mint" | "hot" | "lavender" | "yellow" | "lime" | "ink" | "white";

const VARIANTS: Record<Variant, { bg: string; text: string; tail: string }> = {
  mint:     { bg: "hsl(169 81% 43%)",  text: "text-white",       tail: "hsl(169 81% 43%)" },
  hot:      { bg: "hsl(335 100% 59%)", text: "text-white",       tail: "hsl(335 100% 59%)" },
  lavender: { bg: "hsl(256 90% 68%)",  text: "text-white",       tail: "hsl(256 90% 68%)" },
  yellow:   { bg: "hsl(48 100% 59%)",  text: "text-baddia-ink",  tail: "hsl(48 100% 59%)" },
  lime:     { bg: "hsl(76 100% 48%)",  text: "text-baddia-ink",  tail: "hsl(76 100% 48%)" },
  ink:      { bg: "hsl(260 16% 15%)",  text: "text-white",       tail: "hsl(260 16% 15%)" },
  white:    { bg: "#ffffff",           text: "text-baddia-ink",  tail: "#ffffff" },
};

export function SpeechBubble({
  children,
  variant = "mint",
  topSticker,
  tailSide = "right",
  className = "",
}: {
  children: ReactNode;
  variant?: Variant;
  topSticker?: ReactNode;
  tailSide?: "left" | "right";
  className?: string;
}) {
  const v = VARIANTS[variant];
  return (
    <div className={`relative ${className}`}>
      {topSticker && (
        <div className="absolute -top-7 left-6 z-10 sticker-float-fast" style={{ ['--r' as any]: '-12deg' }}>
          {topSticker}
        </div>
      )}
      <div
        className={`relative rounded-[28px] border-[2.5px] border-baddia-ink px-5 pt-5 pb-6 ${v.text}`}
        style={{ background: v.bg, boxShadow: "5px 6px 0 0 hsl(260 16% 15%)" }}
      >
        {children}
        {/* tail */}
        <svg
          aria-hidden
          className="absolute"
          width="42"
          height="36"
          viewBox="0 0 42 36"
          style={{
            bottom: -22,
            [tailSide]: 30,
            filter: "drop-shadow(4px 4px 0 hsl(260 16% 15%))",
          } as any}
        >
          <path
            d="M2 2 C 12 18, 22 26, 38 30 C 24 26, 16 18, 14 2 Z"
            fill={v.tail}
            stroke="hsl(260 16% 15%)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
