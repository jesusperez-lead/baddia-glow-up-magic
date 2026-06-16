import { useBaddia } from "@/lib/baddia-state";
import { History, Pencil, Sparkles, Shield, LogOut, ChevronRight, LayoutGrid } from "lucide-react";
import { toast } from "sonner";

export function Profile() {
  const { user, openPaywall, go } = useBaddia();

  const rows = [
    { icon: History, label: "Historial", onClick: () => toast("Aquí verás tus lecturas guardadas ✨") },
    { icon: LayoutGrid, label: "Widgets para iPhone", onClick: () => go("widgets") },
    { icon: Pencil, label: "Editar perfil", onClick: () => toast("Próximamente") },
    { icon: Sparkles, label: "Baddia Pro", onClick: openPaywall, pro: true },
    { icon: Shield, label: "Privacidad", onClick: () => toast("Tu energía está protegida 🔒") },
    { icon: LogOut, label: "Cerrar sesión", onClick: () => go("welcome"), danger: true },
  ];

  return (
    <div className="relative min-h-full gradient-bg-soft pb-6">
      <header className="px-5 pt-10 pb-6 text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-gradient-glow shadow-glow flex items-center justify-center font-display font-black text-white text-4xl">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <span className="absolute -top-1 -right-1 text-2xl animate-twinkle">✨</span>
        </div>
        <h1 className="font-display font-black text-2xl text-baddia-purple mt-3">{user.name}</h1>
        <span className={`chip mt-2 ${user.plan === "Pro" ? "bg-gradient-gold text-baddia-purple" : "bg-white text-baddia-purple/70"}`}>
          {user.plan === "Pro" ? "✨ Baddia Pro" : "Plan Free"}
        </span>
      </header>

      <div className="px-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="baddia-card bg-white text-center">
            <p className="text-[10px] uppercase font-bold tracking-wider text-baddia-purple/60">Signo</p>
            <p className="font-display font-black text-2xl text-baddia-purple mt-1">{user.sign}</p>
            <span className="text-2xl">♎</span>
          </div>
          <div className="baddia-card bg-gradient-gold/40 text-center">
            <p className="text-[10px] uppercase font-bold tracking-wider text-baddia-purple/60">Número de vida</p>
            <p className="font-display font-black text-2xl text-baddia-purple mt-1">{user.lifeNumber}</p>
            <span className="text-xs text-baddia-purple/60">maestra</span>
          </div>
        </div>

        {user.savedQuotes.length > 0 && (
          <div className="baddia-card bg-white">
            <p className="text-[10px] uppercase font-bold tracking-wider text-baddia-purple/60 mb-2">Frases guardadas</p>
            {user.savedQuotes.map((q, i) => (
              <p key={i} className="font-display font-bold text-baddia-purple text-sm py-1">"{q}"</p>
            ))}
          </div>
        )}

        <div className="bg-white rounded-3xl overflow-hidden shadow-card">
          {rows.map(({ icon: Icon, label, onClick, pro, danger }, i) => (
            <button
              key={label}
              onClick={onClick}
              className={`w-full flex items-center gap-3 px-5 py-4 active:bg-pink-50 transition-colors ${
                i !== rows.length - 1 ? "border-b border-pink-100" : ""
              }`}
            >
              <span
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                  pro ? "bg-gradient-gold" : danger ? "bg-pink-100" : "bg-pink-50"
                }`}
              >
                <Icon size={16} className={danger ? "text-baddia-hot" : "text-baddia-purple"} />
              </span>
              <span className={`flex-1 text-left font-semibold ${danger ? "text-baddia-hot" : "text-baddia-purple"}`}>
                {label}
              </span>
              <ChevronRight size={16} className="text-baddia-purple/40" />
            </button>
          ))}
        </div>

        <p className="text-[10px] text-center text-muted-foreground px-6 pt-2 leading-relaxed">
          Baddia es una app de entretenimiento, inspiración y amor propio.<br />
          Las lecturas son generadas con IA. ✨
        </p>
      </div>
    </div>
  );
}
