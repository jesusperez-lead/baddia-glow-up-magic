import { ReactNode } from "react";

export function Sparkles({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <span className="sparkle top-[8%] left-[12%] text-2xl text-baddia-yellow sticker-float" style={{ animationDelay: "0s" }}>✦</span>
      <span className="sparkle top-[18%] right-[10%] text-lg text-baddia-hot sticker-float-fast" style={{ animationDelay: "0.6s" }}>✧</span>
      <span className="sparkle top-[42%] left-[6%] text-base text-baddia-lavender sticker-float" style={{ animationDelay: "1.2s" }}>✦</span>
      <span className="sparkle bottom-[22%] right-[14%] text-xl text-baddia-mint sticker-float-slow" style={{ animationDelay: "0.3s" }}>✧</span>
      <span className="sparkle bottom-[8%] left-[20%] text-sm text-baddia-bubble sticker-float-fast" style={{ animationDelay: "1.6s" }}>✦</span>
      <span className="sparkle top-[60%] right-[6%] text-2xl text-baddia-yellow sticker-float" style={{ animationDelay: "0.9s" }}>✧</span>
    </div>
  );
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full gradient-bg-soft flex items-center justify-center md:p-8">
      <div className="relative w-full md:w-[400px] md:h-[860px] md:rounded-[3rem] md:border-[10px] md:border-baddia-ink/90 md:shadow-[0_30px_80px_-20px_hsl(260_30%_20%/0.5)] bg-background overflow-hidden flex flex-col">
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-baddia-ink rounded-b-2xl z-50" />
        <div className="flex-1 overflow-y-auto scrollbar-hide">{children}</div>
      </div>
    </div>
  );
}
