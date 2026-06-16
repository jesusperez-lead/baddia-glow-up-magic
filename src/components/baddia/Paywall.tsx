import { useBaddia } from "@/lib/baddia-state";
import { Check, Crown, Heart, Lock, Sparkles, Users, X } from "lucide-react";
import { useState } from "react";

type PlanKey = "monthly" | "yearly" | "girls";

const PRO_FEATURES = [
  "Lecturas ilimitadas ✨",
  "Palm Reading completo 🖐️",
  "Crush Energy completa 💘",
  "Tarot & Aura Check completos 🔮",
  "Reporte mensual de tu glow 🌙",
  "Rituales personalizados 🕯️",
];

const GIRLS_FEATURES = [
  "Hasta 4 perfiles Pro 👯‍♀️",
  "Compatibilidad entre amigas 💞",
  "Lecturas privadas por perfil 🔒",
  "Todo lo de Baddia Pro incluido ✨",
];

const PLAN_LABEL: Record<PlanKey, BaddiaUser["plan"]> = {
  monthly: "Pro",
  yearly: "Pro Anual",
  girls: "Baddia Girls",
};

import type { BaddiaUser } from "@/lib/baddia-state";

export function Paywall() {
  const { paywallOpen, closePaywall, setUser } = useBaddia();
  const [selected, setSelected] = useState<PlanKey>("yearly");
  if (!paywallOpen) return null;

  const activate = () => {
    setUser({ plan: PLAN_LABEL[selected] });
    closePaywall();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-baddia-purple/40 backdrop-blur-sm animate-fade-in">
      <div className="w-full md:max-w-[420px] bg-gradient-pearl rounded-t-[2.5rem] md:rounded-[2.5rem] max-h-[94vh] overflow-y-auto scrollbar-hide animate-scale-in relative">
        {/* Header */}
        <div className="relative gradient-bg-night text-white p-6 pt-8 rounded-t-[2.5rem] overflow-hidden">
          <button
            onClick={closePaywall}
            aria-label="Cerrar"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center z-10"
          >
            <X size={18} />
          </button>
          <span className="sparkle top-3 right-20 text-baddia-gold text-2xl animate-twinkle">✦</span>
          <span className="sparkle top-10 left-6 text-baddia-gold text-lg animate-twinkle" style={{ animationDelay: "0.4s" }}>✧</span>
          <span className="sparkle bottom-3 right-10 text-baddia-gold text-xl animate-twinkle" style={{ animationDelay: "0.9s" }}>✦</span>
          <div className="inline-flex items-center gap-1.5 chip bg-white/15 text-white mb-3">
            <Sparkles size={12} /> Baddia Pro
          </div>
          <h2 className="font-display font-black text-[26px] leading-tight">
            Desbloquea tu lectura completa
          </h2>
          <p className="mt-2 text-white/85 text-sm">
            Amor, dinero, suerte, futuro y crush energy completa. Tu glow sin límites ✨
          </p>
        </div>

        {/* Pro features */}
        <div className="px-6 pt-5 pb-2">
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {PRO_FEATURES.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-gradient-glow flex items-center justify-center shadow-soft shrink-0">
                  <Check size={11} strokeWidth={3} className="text-white" />
                </span>
                <span className="text-[12px] font-semibold text-baddia-purple leading-tight">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="px-5 pt-4 space-y-3">
          <PlanCard
            active={selected === "monthly"}
            onClick={() => setSelected("monthly")}
            title="Baddia Pro"
            subtitle="Mensual"
            priceUsd="USD $3.99"
            priceUnit="/ mes"
            priceCop="≈ $13.900 COP / mes"
            icon={<Sparkles size={16} className="text-baddia-purple" />}
          />

          <PlanCard
            active={selected === "yearly"}
            onClick={() => setSelected("yearly")}
            title="Baddia Pro Anual"
            subtitle="Ahorra 37%"
            priceUsd="USD $29.99"
            priceUnit="/ año"
            priceCop="≈ $104.900 COP / año"
            badge="✨ Mejor opción"
            badgeClass="bg-gradient-gold text-baddia-purple"
            icon={<Crown size={16} className="text-baddia-purple" />}
            highlight
          />

          <PlanCard
            active={selected === "girls"}
            onClick={() => setSelected("girls")}
            title="Baddia Girls"
            subtitle="Comparte tu glow con tus amigas 💖"
            priceUsd="USD $49.99"
            priceUnit="/ año"
            priceCop="≈ $174.900 COP / año"
            badge="👯‍♀️ Para amigas"
            badgeClass="bg-gradient-glow text-white"
            icon={<Users size={16} className="text-baddia-purple" />}
            girls
          />

          {selected === "girls" && (
            <div className="rounded-2xl bg-white/70 border border-pink-100 p-3 space-y-1.5">
              <p className="text-[11px] uppercase font-bold tracking-wider text-baddia-purple/60 flex items-center gap-1">
                <Heart size={11} className="text-baddia-hot" /> Incluye
              </p>
              {GIRLS_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <Check size={12} className="text-baddia-hot shrink-0" />
                  <span className="text-[12px] font-semibold text-baddia-purple">{f}</span>
                </div>
              ))}
              <p className="text-[10px] text-baddia-purple/60 pt-1 italic">
                Cada chica tiene su propio perfil, su energía y sus lecturas privadas.
              </p>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="px-5 pt-5 pb-7 space-y-2.5">
          <button
            onClick={activate}
            className="w-full py-4 rounded-2xl bg-gradient-glow text-white font-bold shadow-glow active:scale-[0.98] transition-transform"
          >
            {selected === "girls" ? "👯‍♀️ Crear mi Baddia Girls" : "✨ Empezar Baddia Pro"}
          </button>
          <button
            onClick={closePaywall}
            className="w-full py-3.5 rounded-2xl bg-white border border-pink-100 text-baddia-purple font-semibold"
          >
            Seguir con versión gratis
          </button>
          <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1 pt-1">
            <Lock size={10} /> Puedes seguir usando Baddia gratis todos los días.
          </p>
        </div>
      </div>
    </div>
  );
}

interface PlanCardProps {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  priceUsd: string;
  priceUnit: string;
  priceCop: string;
  badge?: string;
  badgeClass?: string;
  icon: React.ReactNode;
  highlight?: boolean;
  girls?: boolean;
}

function PlanCard({
  active, onClick, title, subtitle, priceUsd, priceUnit, priceCop, badge, badgeClass, icon, highlight, girls,
}: PlanCardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left rounded-2xl p-4 transition-all active:scale-[0.99] ${
        active
          ? highlight
            ? "bg-gradient-to-br from-baddia-gold/30 to-pink-100 border-2 border-baddia-gold shadow-glow"
            : girls
            ? "bg-gradient-to-br from-pink-100 to-purple-100 border-2 border-baddia-hot shadow-glow"
            : "bg-white border-2 border-baddia-purple shadow-card"
          : "bg-white/70 border-2 border-pink-100"
      }`}
    >
      {badge && (
        <span className={`absolute -top-2.5 right-4 chip text-[10px] font-bold ${badgeClass}`}>
          {badge}
        </span>
      )}
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-soft shrink-0">
          {icon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-display font-black text-baddia-purple text-[15px] leading-tight">{title}</p>
          <p className="text-[11px] text-baddia-purple/60 truncate">{subtitle}</p>
        </div>
        <div className="text-right">
          <p className="font-display font-black text-baddia-purple text-[15px] leading-none">{priceUsd}</p>
          <p className="text-[10px] text-baddia-purple/60">{priceUnit}</p>
        </div>
      </div>
      <p className="text-[11px] text-baddia-purple/70 mt-2 pl-13 text-right font-semibold">
        {priceCop}
      </p>
    </button>
  );
}
