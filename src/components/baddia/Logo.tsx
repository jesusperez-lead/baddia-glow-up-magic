export function Logo({ size = 56 }: { size?: number }) {
  return (
    <div className="inline-flex items-center gap-3">
      <div
        className="relative flex items-center justify-center rounded-3xl bg-gradient-baddia shadow-glow"
        style={{ width: size, height: size }}
      >
        <span
          className="font-display font-black text-white"
          style={{ fontSize: size * 0.55, lineHeight: 1 }}
        >
          B
        </span>
        <span className="absolute -top-1 -right-1 text-baddia-gold text-xl drop-shadow-[0_0_8px_rgba(247,215,116,0.9)]">✦</span>
      </div>
      <span
        className="font-display font-black gradient-text tracking-tight"
        style={{ fontSize: size * 0.72 }}
      >
        Baddia
      </span>
    </div>
  );
}

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div
      className="relative inline-flex items-center justify-center rounded-2xl bg-gradient-baddia shadow-soft"
      style={{ width: size, height: size }}
    >
      <span className="font-display font-black text-white" style={{ fontSize: size * 0.55, lineHeight: 1 }}>B</span>
      <span className="absolute -top-1 -right-1 text-baddia-gold text-xs">✦</span>
    </div>
  );
}
