import { useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { PolaroidUploader } from "../PolaroidUploader";
import {
  History, Sparkles, Shield, LogOut, ChevronRight, LayoutGrid,
  Settings, Trash2, Cake, Hash, Lock, ArrowRight, Bookmark, Bell, Globe,
  User as UserIcon, Heart, Gift, Star, Phone, Check, Camera, CalendarDays,
  MessageCircleHeart,
} from "lucide-react";
import { toast } from "sonner";

const APP_VERSION = "1.0.0";


const SIGN_GLYPH: Record<string, string> = {
  Aries: "♈", Tauro: "♉", Géminis: "♊", Cáncer: "♋", Leo: "♌", Virgo: "♍",
  Libra: "♎", Escorpio: "♏", Sagitario: "♐", Capricornio: "♑", Acuario: "♒", Piscis: "♓",
};

const MONTHS = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];

export function Profile() {
  const { user, setUser, openPaywall, go, triggerCelebration } = useBaddia();
  const [tapCount, setTapCount] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [polaroidOpen, setPolaroidOpen] = useState(false);

  const isPro = user.plan !== "Free";
  const glyph = SIGN_GLYPH[user.sign] ?? "✦";

  const mIdx = Number(user.month);
  const monthLabel = mIdx >= 1 && mIdx <= 12 ? MONTHS[mIdx - 1] : null;
  const birthParts = [user.day, monthLabel, user.year].filter(Boolean) as string[];
  const birth = birthParts.length ? birthParts.join(" · ") : "Fecha no disponible";

  // 🎂 Detectar si hoy es su cumpleaños (forzado true para preview)
  const isBirthday = true;

  const onVersionTap = () => {
    const n = tapCount + 1;
    setTapCount(n);
    if (n === 7) {
      setConfirmDelete(true);
      setTapCount(0);
    }
  };

  return (
    <div className="relative min-h-full bg-white pb-12 overflow-hidden">
      {/* background blobs */}
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/25" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-soft/30" style={{ animationDelay: "4s" }} />
      <div className="blob top-[700px] -left-10 w-56 h-56 bg-baddia-yellow/20" style={{ animationDelay: "2s" }} />
      <SparklesDeco />

      {/* Header */}
      <header className="relative z-10 px-6 pt-8 pb-2">
        <span className="inline-block rounded-full bg-baddia-lavender text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider">
          ✦ tu perfil
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          Hey, <span className="gradient-text">{user.name}</span> ✨
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          Tu identidad cósmica, tus datos, tu glow.
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* ───── 🎂 HAPPY BIRTHDAY CARD ───── */}
        {isBirthday && (
          <div className="relative animate-pop-in">
            <div className="absolute -top-3 left-5 z-20">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-hot text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
                <Gift size={11} /> es tu día
              </span>
            </div>
            <div className="absolute -top-2 -right-2 z-20 rotate-12">
              <span className="inline-block rounded-full bg-baddia-yellow text-baddia-ink border-2 border-baddia-ink px-2.5 py-1 text-[10px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)]">
                ✨ +1 año glow
              </span>
            </div>
            <div className="relative rounded-[28px] border-[2.5px] border-baddia-ink p-5 pt-8 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden bg-gradient-to-br from-baddia-bubble via-baddia-soft to-baddia-lavender/70">
              {/* confetti dots */}
              <span className="absolute top-3 right-10 text-2xl animate-pulse">🎀</span>
              <span className="absolute bottom-4 right-6 text-3xl">🧁</span>
              <span className="absolute top-10 left-2 text-xl opacity-70">✦</span>
              <span className="absolute bottom-2 left-6 text-lg opacity-60">⋆</span>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-baddia-yellow/40 blur-2xl" />

              <div className="relative flex items-start gap-3">
                <div className="shrink-0 w-14 h-14 rounded-2xl bg-white border-[2.5px] border-baddia-ink flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] rotate-[-6deg]">
                  <Cake size={26} className="text-baddia-hot" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-black text-baddia-ink text-[22px] leading-[1.05] drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]">
                    ¡Feliz cumple,<br/>
                    <span className="gradient-text">{user.name}</span>! 🎂
                  </p>
                  <p className="text-[13px] text-baddia-ink/80 font-semibold mt-2 leading-snug">
                    Hoy el universo brilla por ti. Que este año te traiga magia, amor propio y muchas bendiciones ✨
                  </p>
                </div>
              </div>

              <div className="relative mt-4 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-full bg-white text-baddia-ink border-2 border-baddia-ink px-2.5 py-1 text-[10px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)]">
                  <Heart size={10} className="text-baddia-hot fill-baddia-hot" /> birthday glow
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-baddia-yellow text-baddia-ink border-2 border-baddia-ink px-2.5 py-1 text-[10px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] rotate-1">
                  <Star size={10} className="fill-baddia-ink" /> tu día sagrado
                </span>
              </div>
            </div>
          </div>
        )}


        {/* ───── HERO: avatar + plan ───── */}
        <div className="relative animate-slide-up">
          <div className="absolute -top-3 left-5 z-10 flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full ${isPro ? "bg-baddia-gold text-baddia-ink" : "bg-baddia-ink text-white"} border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1`}>
              {isPro ? <>✨ Baddia {user.plan}</> : <>● Plan Free</>}
            </span>
            {isPro && (
              <button
                onClick={() => triggerCelebration(user.plan)}
                className="inline-flex items-center gap-1 rounded-full bg-white text-baddia-ink border-2 border-baddia-ink px-2.5 py-1 text-[9.5px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] rotate-2 active:translate-y-[1px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
              >
                <Gift size={10} /> Ver celebración
              </button>
            )}
            {(user.feedbackCount ?? 0) > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-baddia-hot text-white border-2 border-baddia-ink px-2.5 py-1 text-[9.5px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
                ✧ contributor
              </span>
            )}
          </div>
          <div className="relative rounded-3xl border-[2.5px] border-baddia-ink p-5 pt-8 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden gradient-bg-baddia text-white">
            <span className="absolute -top-3 -right-2 text-7xl opacity-20 select-none">{glyph}</span>
            <div className="relative flex items-center gap-4">
              <button
                onClick={() => setPolaroidOpen(true)}
                aria-label="Editar foto de perfil"
                className="shrink-0 relative bg-white p-1.5 pb-6 shadow-[3px_4px_0_rgba(0,0,0,0.35)] border border-baddia-ink/10 -rotate-[6deg] active:translate-y-[1px] transition-transform"
                style={{ width: 78 }}
              >
                <span className="absolute -top-1.5 left-2 w-8 h-2.5 bg-baddia-yellow/80 border border-baddia-ink/10 rotate-[-8deg]" />
                <div className="relative w-[64px] h-[64px] bg-baddia-ink/90 overflow-hidden">
                  {user.avatar ? (
                    <>
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.4)]" />
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-white/80 gap-0.5">
                      <Camera size={20} />
                      <span className="text-[7px] font-display font-black uppercase tracking-wider">tocá</span>
                    </div>
                  )}
                </div>
                <p
                  className="absolute bottom-1 left-1.5 right-1.5 text-center text-baddia-ink text-[10px] leading-none truncate"
                  style={{ fontFamily: "'Caveat', cursive", fontWeight: 700 }}
                >
                  {user.avatarCaption || user.name.toLowerCase()}
                </p>
              </button>
              <div className="min-w-0 flex-1">
                <p className="font-display font-black text-[22px] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
                  {user.name}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/90 text-baddia-ink border-2 border-white px-2.5 py-0.5 text-[10px] font-display font-bold shadow-[1.5px_1.5px_0_rgba(0,0,0,0.2)]">
                    <Cake size={10} /> {birth}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/90 text-baddia-ink border-2 border-white px-2.5 py-0.5 text-[10px] font-display font-bold shadow-[1.5px_1.5px_0_rgba(0,0,0,0.2)]">
                    {glyph} {user.sign}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-baddia-yellow/90 text-baddia-ink border-2 border-white px-2.5 py-0.5 text-[10px] font-display font-bold shadow-[1.5px_1.5px_0_rgba(0,0,0,0.2)]">
                    <Hash size={10} /> {user.lifeNumber}
                  </span>
                </div>
              </div>
            </div>

            {!isPro && (
              <button
                onClick={openPaywall}
                className="relative mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-baddia-yellow text-baddia-ink border-2 border-baddia-ink px-3 py-2 text-[12px] font-display font-black shadow-[3px_3px_0_rgba(0,0,0,0.25)] active:translate-y-[2px] active:shadow-[1px_1px_0_rgba(0,0,0,0.25)] transition-all"
              >
                <Sparkles size={13} /> Hazte Pro y desbloquea todo <ArrowRight size={13} />
              </button>
            )}
          </div>
        </div>

        {/* ───── STATS GRID: signo + número ───── */}
        <SectionLabel emoji="🌟" text="tu identidad cósmica" />
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            chip="signo" chipBg="bg-baddia-lavender text-white"
            value={user.sign} caption="solar" bigEmoji={glyph}
            cardBg="bg-white"
          />
          <StatCard
            chip="número de vida" chipBg="bg-baddia-hot text-white"
            value={String(user.lifeNumber)} caption="maestra"
            cardBg="bg-baddia-yellow"
          />
        </div>

        {/* ───── Frases guardadas ───── */}
        {user.savedQuotes.length > 0 && (
          <>
            <SectionLabel emoji="📖" text="tus frases guardadas" />
            <div className="relative">
              <div className="absolute -top-3 left-5 z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-hot text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1">
                  <Bookmark size={10} /> guardadas
                </span>
              </div>
              <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-2">
                {user.savedQuotes.map((q, i) => (
                  <p key={i} className="font-display font-bold text-baddia-ink text-[14px] leading-snug border-l-[3px] border-baddia-hot pl-3">
                    "{q}"
                  </p>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ───── Historial ───── */}
        <SectionLabel emoji="🕰️" text="actividad" />
        <RowGroup
          rows={[
            { icon: History,    label: "Diario energético", caption: "Tu timeline visual día a día",
              onClick: () => go("history"), tint: "bg-baddia-bubble" },
            { icon: CalendarDays, label: "Baddia Calendar", caption: "Tu mes cósmico completo",
              onClick: () => go("calendar"), tint: "bg-baddia-lavender/40" },
            { icon: LayoutGrid, label: "Widgets para iPhone",   caption: "Glow Score en tu home",
              onClick: () => go("widgets"), tint: "bg-baddia-mint" },
          ]}
        />

        {/* ───── Ajustes ───── */}
        <SectionLabel emoji="⚙️" text="ajustes" />
        <RowGroup
          rows={[
            { icon: UserIcon, label: "Cuenta",        caption: "Nombre, fecha · eliminar cuenta",
              onClick: () => go("account"), tint: "bg-baddia-bubble" },
            { icon: user.phoneVerified ? Check : Phone,
              label: user.phoneVerified ? "Número verificado" : "Verificar número",
              caption: user.phoneVerified ? (user.phone ?? "Tu número está a salvo ✨") : "Protege tu cuenta con SMS",
              onClick: () => go("phone-verify"),
              tint: user.phoneVerified ? "bg-baddia-mint" : "bg-baddia-lavender" },
            { icon: Settings, label: "Preferencias",  caption: "Tema, sonidos, idioma",
              onClick: () => toast("Próximamente ✨"), tint: "bg-baddia-yellow" },
            { icon: Bell,     label: "Notificaciones", caption: "Tu lectura diaria, recordatorios",
              onClick: () => go("notifications"), tint: "bg-baddia-hot" },
            { icon: Globe,    label: "Idioma",         caption: "Español · ES",
              onClick: () => toast("Próximamente ✨"), tint: "bg-baddia-lavender" },
          ]}
        />

        {/* ───── Privacidad + Pro ───── */}
        <SectionLabel emoji="🔒" text="privacidad & plan" />
        <RowGroup
          rows={[
            { icon: Shield,   label: "Privacidad y datos", caption: "Tu energía está protegida",
              onClick: () => toast("Tu energía está protegida 🔒"), tint: "bg-baddia-mint" },
            { icon: Sparkles, label: "Baddia Pro",         caption: isPro ? "Estás disfrutando Pro ✨" : "Desbloquea lecturas completas",
              onClick: openPaywall, tint: "bg-baddia-gold", pro: true },
          ]}
        />

        {/* ───── Cerrar sesión ───── */}
        <SectionLabel emoji="👋" text="sesión" />
        <button
          onClick={() => go("welcome")}
          className="w-full rounded-3xl bg-white border-[2.5px] border-baddia-ink p-4 shadow-[5px_6px_0_hsl(260_16%_15%)] flex items-center gap-3 active:translate-y-[2px] active:shadow-[2px_3px_0_hsl(260_16%_15%)] transition-all"
        >
          <span className="w-10 h-10 rounded-2xl border-2 border-baddia-ink bg-baddia-hot/15 flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)]">
            <LogOut size={16} className="text-baddia-hot" />
          </span>
          <span className="flex-1 text-left font-display font-black text-baddia-ink text-[14px]">
            Cerrar sesión
          </span>
          <ChevronRight size={16} className="text-baddia-ink/40" />
        </button>

        {/* ───── Footer: versión (tap 7 veces para eliminar cuenta) ───── */}
        <div className="pt-4 pb-2 text-center">
          <p className="text-[11px] text-baddia-ink/45 font-semibold leading-relaxed px-6">
            Baddia es una app de entretenimiento, inspiración y amor propio.<br />
            Las lecturas son generadas con IA. ✨
          </p>
          <button
            onClick={onVersionTap}
            className="mt-3 text-[10px] text-baddia-ink/30 font-display font-bold tracking-wider hover:text-baddia-ink/60 transition-colors"
          >
            Baddia · v{APP_VERSION}
          </button>
        </div>
      </div>

      {/* ───── Modal eliminar cuenta (oculto, tap 7× versión) ───── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-baddia-ink/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="relative w-full max-w-sm rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[6px_8px_0_hsl(260_16%_15%)] animate-pop-in">
            <div className="absolute -top-3 left-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-hot text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
                <Lock size={10} /> zona peligrosa
              </span>
            </div>
            <p className="font-display font-black text-baddia-ink text-[20px] leading-tight mt-3">
              ¿Eliminar tu cuenta? 💔
            </p>
            <p className="text-[13px] text-baddia-ink/70 font-medium mt-2 leading-snug">
              Esta acción borrará tu perfil, tu historial y tus lecturas guardadas. No se puede deshacer.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 py-3 rounded-full bg-white text-baddia-ink font-display font-black text-[13px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setConfirmDelete(false);
                  toast.success("Cuenta marcada para eliminación 💔");
                  go("welcome");
                }}
                className="flex-1 py-3 rounded-full bg-baddia-hot text-white font-display font-black text-[13px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all inline-flex items-center justify-center gap-1.5"
              >
                <Trash2 size={13} /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <PolaroidUploader
        open={polaroidOpen}
        onClose={() => setPolaroidOpen(false)}
        initial={user.avatar}
        initialCaption={user.avatarCaption}
        defaultCaption={user.name?.toLowerCase() || "mi glow ✧"}
        onSave={(avatar, caption) => {
          setUser({ avatar, avatarCaption: caption });
          toast.success("Postal guardada ✨📷");
        }}
        onRemove={() => {
          setUser({ avatar: undefined, avatarCaption: undefined });
          toast("Foto eliminada");
        }}
      />
    </div>
  );
}




/* ───────────── helpers ───────────── */

function SectionLabel({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="flex items-center gap-2 pt-1 pl-1">
      <span className="text-base">{emoji}</span>
      <p className="font-display font-black text-[12px] uppercase tracking-[0.15em] text-baddia-ink/70">
        {text}
      </p>
      <span className="h-[2px] flex-1 bg-baddia-ink/15 rounded-full" />
    </div>
  );
}

function StatCard({
  chip, chipBg, value, caption, bigEmoji, cardBg,
}: {
  chip: string; chipBg: string; value: string; caption: string; bigEmoji?: string; cardBg: string;
}) {
  return (
    <div className="relative">
      <div className="absolute -top-3 left-3 z-10">
        <span className={`inline-flex items-center gap-1 rounded-full ${chipBg} border-2 border-baddia-ink px-2 py-1 text-[9px] font-display font-bold uppercase tracking-wider shadow-[2px_2px_0_hsl(260_16%_15%)] rotate-1`}>
          {chip}
        </span>
      </div>
      <div className={`rounded-3xl ${cardBg} border-[2.5px] border-baddia-ink p-3 pt-5 shadow-[5px_6px_0_hsl(260_16%_15%)] h-full flex flex-col items-center text-center min-h-[120px] justify-center`}>
        {bigEmoji && <span className="text-[32px] leading-none">{bigEmoji}</span>}
        <p className="font-display font-black text-[22px] text-baddia-ink leading-tight mt-1">
          {value}
        </p>
        <p className="text-[10px] text-baddia-ink/60 font-display font-bold uppercase tracking-wider mt-1">
          {caption}
        </p>
      </div>
    </div>
  );
}

type Row = {
  icon: any;
  label: string;
  caption: string;
  onClick: () => void;
  tint: string;
  pro?: boolean;
};

function RowGroup({ rows }: { rows: Row[] }) {
  return (
    <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden">
      {rows.map(({ icon: Icon, label, caption, onClick, tint, pro }, i) => (
        <button
          key={label}
          onClick={onClick}
          className={`w-full flex items-center gap-3 px-4 py-3.5 active:bg-pink-50/60 transition-colors ${
            i !== rows.length - 1 ? "border-b-2 border-baddia-ink/10" : ""
          }`}
        >
          <span className={`w-10 h-10 rounded-2xl border-2 border-baddia-ink ${tint} flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] shrink-0`}>
            <Icon size={16} className="text-baddia-ink" />
          </span>
          <div className="flex-1 min-w-0 text-left">
            <p className="font-display font-black text-baddia-ink text-[14px] leading-tight">{label}</p>
            <p className="text-[11px] text-baddia-ink/55 font-semibold mt-0.5 leading-tight">{caption}</p>
          </div>
          {pro && (
            <span className="inline-flex items-center gap-1 rounded-full bg-baddia-gold text-baddia-ink border-2 border-baddia-ink px-2 py-0.5 text-[9px] font-display font-black uppercase tracking-wider shadow-[1.5px_1.5px_0_hsl(260_16%_15%)]">
              ✦ Pro
            </span>
          )}
          <ChevronRight size={16} className="text-baddia-ink/40 shrink-0" />
        </button>
      ))}
    </div>
  );
}
