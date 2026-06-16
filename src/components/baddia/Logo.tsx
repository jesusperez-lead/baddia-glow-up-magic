export function Logo({ size = 64 }: { size?: number }) {
  return (
    <div className="inline-flex items-center gap-3">
      <LogoMark size={size} />
      <span
        className="font-display font-bold tracking-tight text-baddia-ink"
        style={{ fontSize: size * 0.78, lineHeight: 1 }}
      >
        Baddia
      </span>
    </div>
  );
}

export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <div
      className="relative inline-flex items-center justify-center rounded-[28%] bg-gradient-hot shadow-glow"
      style={{ width: size, height: size }}
    >
      <span
        className="font-display font-bold text-white"
        style={{ fontSize: size * 0.62, lineHeight: 1, marginTop: -2 }}
      >
        B
      </span>
      <span
        className="absolute text-baddia-yellow drop-shadow-[0_0_8px_rgba(255,209,46,0.9)]"
        style={{ top: -size * 0.12, right: -size * 0.12, fontSize: size * 0.32 }}
      >
        ✦
      </span>
    </div>
  );
}
