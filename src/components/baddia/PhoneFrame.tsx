import { ReactNode } from "react";

export function Sparkles({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <span className="sparkle top-[8%] left-[12%] text-2xl animate-twinkle" style={{ animationDelay: "0s" }}>✦</span>
      <span className="sparkle top-[18%] right-[10%] text-lg animate-twinkle" style={{ animationDelay: "0.6s" }}>✧</span>
      <span className="sparkle top-[40%] left-[6%] text-base animate-twinkle" style={{ animationDelay: "1.2s" }}>✦</span>
      <span className="sparkle bottom-[20%] right-[14%] text-xl animate-twinkle" style={{ animationDelay: "0.3s" }}>✧</span>
      <span className="sparkle bottom-[8%] left-[20%] text-sm animate-twinkle" style={{ animationDelay: "1.6s" }}>✦</span>
      <span className="sparkle top-[60%] right-[6%] text-2xl animate-twinkle" style={{ animationDelay: "0.9s" }}>✧</span>
    </div>
  );
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen w-full gradient-bg-soft flex items-center justify-center md:p-8">
      {/* Desktop phone frame */}
      <div className="relative w-full md:w-[400px] md:h-[860px] md:rounded-[3rem] md:border-[10px] md:border-baddia-purple/90 md:shadow-[0_30px_80px_-20px_hsl(271_50%_30%/0.5)] bg-background overflow-hidden flex flex-col">
        {/* Notch */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-baddia-purple rounded-b-2xl z-50" />
        <div className="flex-1 overflow-y-auto scrollbar-hide">{children}</div>
      </div>
    </div>
  );
}
