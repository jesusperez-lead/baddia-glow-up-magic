import { useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ArrowLeft, Heart, Trash2, Lock, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

export function DeleteAccount() {
  const { user, go } = useBaddia();
  const [confirmation, setConfirmation] = useState("");
  const [showFinal, setShowFinal] = useState(false);

  const expected = [user.name.trim().toLowerCase(), user.sign.toLowerCase()];
  const matches = expected.includes(confirmation.trim().toLowerCase());

  const handleContinue = () => {
    if (!matches) {
      toast.error("Eso no coincide ✨ Escribe tu nombre o tu signo.");
      return;
    }
    setShowFinal(true);
  };

  const handleConfirmDelete = () => {
    setShowFinal(false);
    toast.success("Cuenta marcada para eliminación 💔");
    go("welcome");
  };

  return (
    <div className="relative min-h-full bg-white pb-16 overflow-hidden">
      {/* background blobs */}
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-hot/15" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-bubble/30" style={{ animationDelay: "4s" }} />
      <SparklesDeco />

      {/* AppBar */}
      <header className="relative z-10 px-6 pt-8 pb-2">
        <button
          onClick={() => go("account")}
          className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 bg-white border-2 border-baddia-ink rounded-full shadow-[2px_2px_0_hsl(260_16%_15%)] text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
        >
          <ArrowLeft size={12} strokeWidth={3} /> Volver
        </button>

        <span className="inline-block rounded-full bg-baddia-hot text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider">
          <Lock size={10} className="inline -mt-0.5 mr-1" /> zona peligrosa
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          ¿En serio te <span className="gradient-text">vas</span>, bestie? 💔
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Te vamos a extrañar un montón. El universo no es el mismo sin tu glow.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* Emotional card */}
        <div className="relative rounded-3xl bg-baddia-bubble border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)]">
          <div className="absolute -top-3 left-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white text-baddia-ink border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
              <Heart size={10} className="text-baddia-hot" /> antes de irte
            </span>
          </div>
          <ul className="space-y-2.5 text-[13px] font-display font-bold text-baddia-ink leading-snug">
            <li className="flex gap-2"><span>🌙</span><span>Vas a perder tus lecturas guardadas y tu historial cósmico.</span></li>
            <li className="flex gap-2"><span>✨</span><span>Tu glow score y tus números de la suerte se borran para siempre.</span></li>
            <li className="flex gap-2"><span>💌</span><span>No podremos seguir recordándote lo bad que eres cada mañana.</span></li>
            <li className="flex gap-2"><span>🪐</span><span>Esta acción no se puede deshacer.</span></li>
          </ul>
        </div>

        {/* Alt: stay */}
        <button
          onClick={() => go("profile")}
          className="w-full rounded-3xl bg-baddia-yellow border-[2.5px] border-baddia-ink p-4 shadow-[5px_6px_0_hsl(260_16%_15%)] flex items-center gap-3 active:translate-y-[2px] active:shadow-[2px_3px_0_hsl(260_16%_15%)] transition-all"
        >
          <span className="w-10 h-10 rounded-2xl border-2 border-baddia-ink bg-white flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] shrink-0">
            <Sparkles size={16} className="text-baddia-ink" />
          </span>
          <div className="flex-1 text-left">
            <p className="font-display font-black text-baddia-ink text-[14px] leading-tight">Mejor me quedo ✨</p>
            <p className="text-[11px] text-baddia-ink/60 font-semibold mt-0.5 leading-tight">Volver a mi perfil</p>
          </div>
        </button>

        {/* Confirmation input */}
        <div className="relative rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 pt-6 shadow-[5px_6px_0_hsl(260_16%_15%)]">
          <p className="font-display font-black text-baddia-ink text-[14px] leading-snug">
            Para continuar, escribe tu <span className="text-baddia-hot">nombre</span> o tu <span className="text-baddia-hot">signo zodiacal</span>.
          </p>
          <p className="text-[11px] text-baddia-ink/55 font-semibold mt-1">
            Pista: <span className="font-black text-baddia-ink/80">{user.name}</span> · <span className="font-black text-baddia-ink/80">{user.sign}</span>
          </p>

          <input
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="Escribe aquí..."
            className="mt-3 w-full rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-pearl px-4 py-3 text-[15px] font-display font-bold text-baddia-ink placeholder:text-baddia-ink/30 shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none focus:bg-white"
          />

          <button
            disabled={!matches}
            onClick={handleContinue}
            className="mt-4 w-full py-3 rounded-full bg-baddia-hot text-white font-display font-black text-[13px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all inline-flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[3px_3px_0_hsl(260_16%_15%)]"
          >
            <Trash2 size={13} /> Continuar
          </button>
        </div>
      </div>

      {/* Final confirmation popup */}
      {showFinal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-baddia-ink/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="relative w-full max-w-sm rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[6px_8px_0_hsl(260_16%_15%)] animate-pop-in">
            <div className="absolute -top-3 left-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-hot text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
                <Lock size={10} /> última confirmación
              </span>
            </div>
            <button
              onClick={() => setShowFinal(false)}
              aria-label="Cerrar"
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white border-[2.5px] border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
            >
              <X size={16} className="text-baddia-ink" />
            </button>

            <p className="font-display font-black text-baddia-ink text-[20px] leading-tight mt-3">
              ¿Eliminar tu cuenta de verdad? 💔
            </p>
            <p className="text-[13px] text-baddia-ink/70 font-medium mt-2 leading-snug">
              Tu perfil, historial y lecturas se borrarán. Esto no se puede deshacer, bestie.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setShowFinal(false)}
                className="flex-1 py-3 rounded-full bg-white text-baddia-ink font-display font-black text-[13px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-full bg-baddia-hot text-white font-display font-black text-[13px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all inline-flex items-center justify-center gap-1.5"
              >
                <Trash2 size={13} /> Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
