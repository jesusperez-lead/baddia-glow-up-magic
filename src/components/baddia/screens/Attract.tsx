import { useEffect, useMemo, useRef, useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { toast } from "sonner";
import { ArrowLeft, Heart, Share2, RotateCcw, Sparkles } from "lucide-react";

/* ============================================================
   COMO ATRAER · mazo tarot mágico
   ============================================================ */

type CategoryId = "amor" | "dinero" | "paz" | "confianza" | "suerte" | "glow" | "oportunidades";

interface Category {
  id: CategoryId;
  label: string;
  emoji: string;
  bg: string;           // sticker bg
  frontGradient: string; // css gradient for card front
  aura: string;         // soft aura color
  glyph: string;        // decorative glyph
}

interface AttractCard {
  id: string;
  category: CategoryId;
  intent: string;       // front title (categoría o intención)
  advice: string;       // reverso: consejo práctico
  mantra: string;       // reverso: frase de manifestación
}

const CATEGORIES: Category[] = [
  { id: "amor",         label: "Amor",          emoji: "💗", bg: "bg-baddia-hot text-white",       frontGradient: "linear-gradient(155deg,#FF2E75 0%,#FF7AC8 55%,#C9B6FF 100%)", aura: "rgba(255,46,117,0.35)", glyph: "♡" },
  { id: "dinero",       label: "Dinero",        emoji: "💸", bg: "bg-baddia-yellow text-baddia-ink", frontGradient: "linear-gradient(155deg,#FFD12E 0%,#F7C948 45%,#8B63F7 100%)", aura: "rgba(255,209,46,0.45)", glyph: "✦" },
  { id: "paz",          label: "Paz",           emoji: "🕊️", bg: "bg-baddia-lavender text-white",  frontGradient: "linear-gradient(160deg,#C9B6FF 0%,#A6D8FF 50%,#FFFFFF 100%)", aura: "rgba(201,182,255,0.5)", glyph: "❃" },
  { id: "confianza",    label: "Confianza",     emoji: "💅", bg: "bg-baddia-bubble text-white",     frontGradient: "linear-gradient(155deg,#8B63F7 0%,#FF2E75 60%,#FFD12E 100%)", aura: "rgba(139,99,247,0.4)", glyph: "☾" },
  { id: "suerte",       label: "Suerte",        emoji: "🍀", bg: "bg-baddia-mint text-baddia-ink",  frontGradient: "linear-gradient(155deg,#14C6A4 0%,#B7F400 55%,#FFF6E8 100%)", aura: "rgba(20,198,164,0.4)", glyph: "✧" },
  { id: "glow",         label: "Glow",          emoji: "✨", bg: "bg-baddia-soft text-baddia-ink",  frontGradient: "linear-gradient(155deg,#FFF6E8 0%,#FFD12E 40%,#FF7AC8 100%)", aura: "rgba(255,209,46,0.5)", glyph: "✶" },
  { id: "oportunidades",label: "Oportunidades", emoji: "🌟", bg: "bg-baddia-ink text-white",        frontGradient: "linear-gradient(155deg,#24202B 0%,#8B63F7 55%,#FF2E75 100%)", aura: "rgba(139,99,247,0.5)", glyph: "✷" },
];

const CARDS: AttractCard[] = [
  // AMOR
  { id: "amor-1", category: "amor", intent: "Amor Recíproco", advice: "Deja de perseguir: enfoca tu energía en verte, tratarte y hablarte como quien mereces recibir.", mantra: "El amor que doy vuelve a mí multiplicado por 10." },
  { id: "amor-2", category: "amor", intent: "Amor Propio",   advice: "Un ritual diario de 3 minutos frente al espejo: mírate, sonríe y di 3 cosas que te encantan de ti.", mantra: "Yo soy mi primer gran amor y desde ahí lo atraigo todo." },
  { id: "amor-3", category: "amor", intent: "Corazón Abierto", advice: "Suelta a quien no eligió quedarse. El espacio vacío es donde tu próximo amor bonito respira.", mantra: "Suelto con amor lo que ya no es para mí." },
  { id: "amor-4", category: "amor", intent: "Química Real",  advice: "Habla y actúa como si el amor que quieres ya estuviera en camino. La certeza magnetiza más que la ansiedad.", mantra: "Estoy en frecuencia del amor sano, correspondido y bonito." },

  // DINERO
  { id: "din-1", category: "dinero", intent: "Abundancia Diaria", advice: "Guarda una moneda o billete solo para atraer más. Verlo cada día le recuerda a tu mente que sí hay.", mantra: "El dinero fluye hacia mí con facilidad y en paz." },
  { id: "din-2", category: "dinero", intent: "Mentalidad Rica",   advice: "Deja de decir 'no puedo pagarlo'. Cámbialo por '¿cómo puedo generarlo?' — tu cerebro escucha todo.", mantra: "Soy un imán para el dinero y las oportunidades." },
  { id: "din-3", category: "dinero", intent: "Recibe Sin Culpa",  advice: "Acepta cumplidos, regalos y ayuda con un simple 'gracias'. Bloquear lo pequeño bloquea lo grande.", mantra: "Merezco recibir en abundancia sin culpa ni miedo." },
  { id: "din-4", category: "dinero", intent: "Ingresos Extra",    advice: "Escribe una cifra que quieres recibir este mes y pégala donde la veas al despertar.", mantra: "El dinero me encuentra en formas inesperadas y bonitas." },

  // PAZ
  { id: "paz-1", category: "paz", intent: "Mente Calmada",   advice: "10 respiraciones profundas antes de responder cualquier mensaje que te acelere el pecho.", mantra: "Yo elijo la paz sobre la razón." },
  { id: "paz-2", category: "paz", intent: "Suelta el Control", advice: "Lo que no depende de ti, no es tuyo. Escríbelo, léelo y déjalo ir mentalmente.", mantra: "Confío en que todo se acomoda para mi bien." },
  { id: "paz-3", category: "paz", intent: "Espacios Sagrados", advice: "Limpia un rincón de tu cuarto hoy: energía estancada afuera, aire nuevo adentro.", mantra: "Mi hogar y mi mente están en paz." },
  { id: "paz-4", category: "paz", intent: "Sin Ruido",       advice: "Silencia 3 chats o cuentas que te bajen la vibra. La paz también es curaduría.", mantra: "Elijo aquello que me suma calma." },

  // CONFIANZA
  { id: "conf-1", category: "confianza", intent: "Postura Poderosa", advice: "2 minutos al día parada con la espalda recta y el pecho abierto. Tu cuerpo le enseña seguridad a tu mente.", mantra: "Camino con la energía de quien sabe lo que vale." },
  { id: "conf-2", category: "confianza", intent: "Voz Firme",        advice: "Deja de pedir permiso con 'perdón por...'. Empieza tus frases directo: 'necesito', 'quiero', 'no gracias'.", mantra: "Mi voz importa y ocupa espacio con calma." },
  { id: "conf-3", category: "confianza", intent: "Cero Comparación", advice: "Cada vez que abras redes hoy, envía un cumplido a alguien. La abundancia mental empieza soltando envidia.", mantra: "Su brillo no apaga el mío, lo confirma." },
  { id: "conf-4", category: "confianza", intent: "Yo Primero",       advice: "Elige una cosa que llevas postergando por miedo y hazla hoy en versión mini. Pequeña acción = grande evidencia.", mantra: "Soy capaz, soy suficiente, soy imparable." },

  // SUERTE
  { id: "suerte-1", category: "suerte", intent: "Lucky Girl Energy", advice: "Repite 'todo me sale bien' hoy, aunque no lo sientas. La suerte se entrena como músculo.", mantra: "La suerte me busca y me encuentra cada día." },
  { id: "suerte-2", category: "suerte", intent: "Ojos Abiertos",     advice: "La suerte suele venir disfrazada de coincidencia. Anota 3 señales bonitas que veas hoy.", mantra: "Reconozco las señales y las sigo con fe." },
  { id: "suerte-3", category: "suerte", intent: "Amuleto Personal",  advice: "Elige un objeto pequeño y decláralo tu amuleto. La intención lo carga, no el objeto.", mantra: "Voy protegida, guiada y bendecida." },
  { id: "suerte-4", category: "suerte", intent: "Sí Rotundo",        advice: "Di sí a un plan random esta semana. Las mejores rachas empiezan fuera del guion.", mantra: "Me pasan cosas increíbles todo el tiempo." },

  // GLOW
  { id: "glow-1", category: "glow", intent: "Rutina Ritual",  advice: "5 minutos de skincare como si fueras la protagonista. El glow externo empieza tratándote como diosa.", mantra: "Cuidarme es mi acto de manifestación." },
  { id: "glow-2", category: "glow", intent: "Agua Sagrada",   advice: "Un vaso grande de agua antes del café. Piel, ojos y aura te lo pagan al instante.", mantra: "Cada gota me enciende por dentro." },
  { id: "glow-3", category: "glow", intent: "Luz Interior",   advice: "Sonríe sin motivo 3 veces hoy. El nervio facial engaña al cerebro y sube tu vibra.", mantra: "Brillo desde adentro y todos lo sienten." },
  { id: "glow-4", category: "glow", intent: "Aesthetic Life", advice: "Deja tu cama tendida y una vela cerca antes de salir. Vuelves a un espacio que te trata bonito.", mantra: "Mi vida es cute, aesthetic y en calma." },

  // OPORTUNIDADES
  { id: "op-1", category: "oportunidades", intent: "Puertas Abiertas", advice: "Manda un mensaje a alguien con quien perdiste contacto. Las oportunidades viajan por conversaciones.", mantra: "Se abren puertas correctas en el momento correcto." },
  { id: "op-2", category: "oportunidades", intent: "Sí a lo Nuevo",    advice: "Anota una idea que te dé miedo/emoción. Guárdala visible. La vas a activar antes de fin de mes.", mantra: "Yo atraigo oportunidades alineadas con mi propósito." },
  { id: "op-3", category: "oportunidades", intent: "Networking Cute",  advice: "Comenta con intención en 3 cuentas que admires hoy. Presencia = memoria = oportunidad.", mantra: "Las personas correctas ya me están buscando." },
  { id: "op-4", category: "oportunidades", intent: "Timing Divino",    advice: "Si algo se cerró, no era. Confía en la agenda del universo y suelta el 'y si hubiera'.", mantra: "Todo llega en el tiempo perfecto para mí." },
];

const FAV_KEY = "baddia.attract.favs.v1";

function readFavs(): string[] {
  try { return JSON.parse(localStorage.getItem(FAV_KEY) || "[]"); } catch { return []; }
}
function writeFavs(ids: string[]) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify(ids)); } catch {}
}

/* ============================================================
   Card component with 3D flip
   ============================================================ */
function TarotCard({
  card,
  cat,
  index,
  flipped,
  onFlip,
  isFav,
  onToggleFav,
  onShare,
  dealDelayMs,
}: {
  card: AttractCard;
  cat: Category;
  index: number;
  flipped: boolean;
  onFlip: () => void;
  isFav: boolean;
  onToggleFav: () => void;
  onShare: () => void;
  dealDelayMs: number;
}) {
  return (
    <div
      className="attract-deal"
      style={{
        animationDelay: `${dealDelayMs}ms`,
        // random small tilt per card (deterministic by index)
        ["--tilt" as any]: `${((index * 37) % 7) - 3}deg`,
      }}
    >
      <div className="[perspective:1400px] w-full">
        <button
          onClick={onFlip}
          className="attract-card-inner relative block w-full aspect-[3/4.6] rounded-[26px] transition-transform duration-[850ms] will-change-transform"
          style={{
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
          aria-label={`Card ${card.intent}`}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 rounded-[26px] border-[2.5px] border-baddia-ink shadow-[6px_8px_0_hsl(260_16%_15%)] overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background: cat.frontGradient,
            }}
          >
            {/* aura */}
            <div
              className="absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl pointer-events-none animate-pulse-slow"
              style={{ background: cat.aura }}
            />
            <div
              className="absolute -bottom-14 -right-10 w-52 h-52 rounded-full blur-3xl pointer-events-none animate-pulse-slow"
              style={{ background: cat.aura, animationDelay: "1.2s" }}
            />
            {/* filigree corners */}
            <span className="absolute top-2 left-3 text-white/80 text-sm font-serif-display">✦</span>
            <span className="absolute top-2 right-3 text-white/80 text-sm font-serif-display">✦</span>
            <span className="absolute bottom-2 left-3 text-white/80 text-sm font-serif-display rotate-180">✦</span>
            <span className="absolute bottom-2 right-3 text-white/80 text-sm font-serif-display rotate-180">✦</span>

            {/* stars orbit */}
            <span className="absolute top-6 right-6 text-white/70 text-xs animate-sparkle-spin">✧</span>
            <span className="absolute bottom-10 left-5 text-white/60 text-[10px] animate-sparkle-spin" style={{ animationDelay: "1s" }}>✧</span>

            <div className="relative z-10 h-full flex flex-col items-center justify-between p-4 text-white text-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/25 backdrop-blur-sm border border-white/40 px-2 py-0.5 text-[9px] font-display font-black uppercase tracking-[0.2em]">
                {cat.emoji} {cat.label}
              </span>

              <div className="flex flex-col items-center gap-3">
                <div className="relative w-20 h-20 rounded-full border-2 border-white/70 flex items-center justify-center animate-float-cute">
                  <div className="absolute inset-1 rounded-full border border-white/40" />
                  <span className="text-4xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]">{cat.emoji}</span>
                </div>
                <p className="font-serif-display italic font-black leading-tight text-[22px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] px-2">
                  {card.intent}
                </p>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-white/80 text-[9px] font-display font-black tracking-[0.35em] uppercase">
                  Cómo atraer
                </span>
                <span className="text-white/70 text-[9px] font-display font-bold tracking-[0.3em] uppercase">
                  Baddia · tap para revelar
                </span>
              </div>
            </div>

            {/* soft shine sweep */}
            <span className="absolute -top-6 -left-16 w-24 h-[220%] rotate-12 bg-white/25 blur-md animate-shimmer pointer-events-none" />
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 rounded-[26px] border-[2.5px] border-baddia-ink shadow-[6px_8px_0_hsl(260_16%_15%)] overflow-hidden bg-white"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div
              className="absolute inset-0 opacity-[0.08] pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(hsl(260 16% 15%) 1px, transparent 1px)",
                backgroundSize: "10px 10px",
              }}
            />
            <div
              className="absolute -top-14 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none"
              style={{ background: cat.aura }}
            />

            <div className="relative z-10 h-full flex flex-col p-4 text-baddia-ink">
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center gap-1 rounded-full border-2 border-baddia-ink px-2 py-0.5 text-[9px] font-display font-black uppercase tracking-widest"
                  style={{ background: cat.frontGradient, color: "#fff" }}
                >
                  {cat.emoji} {cat.label}
                </span>
                <span className="text-baddia-ink/40 text-[9px] font-display font-black tracking-widest uppercase">
                  ✦ carta
                </span>
              </div>

              <p className="font-serif-display italic font-black text-[19px] leading-[1.1] mt-3">
                {card.intent}
              </p>

              <div className="mt-3 flex-1 flex flex-col gap-3 overflow-hidden">
                <div>
                  <span className="text-[8px] font-display font-black tracking-[0.25em] uppercase text-baddia-hot">
                    Consejo
                  </span>
                  <p className="text-[12px] leading-snug font-medium text-baddia-ink/85 mt-1">
                    {card.advice}
                  </p>
                </div>
                <div className="rounded-2xl border-2 border-baddia-ink bg-baddia-yellow/25 p-2.5 shadow-[2px_2px_0_hsl(260_16%_15%)]">
                  <span className="text-[8px] font-display font-black tracking-[0.25em] uppercase text-baddia-ink">
                    Mantra
                  </span>
                  <p className="font-serif-display italic text-[13px] leading-snug text-baddia-ink mt-0.5">
                    "{card.mantra}"
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-3">
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
                  className={`flex-1 inline-flex items-center justify-center gap-1 rounded-full border-2 border-baddia-ink px-2 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[1px] transition ${isFav ? "bg-baddia-hot text-white" : "bg-white text-baddia-ink"}`}
                >
                  <Heart size={11} strokeWidth={3} fill={isFav ? "currentColor" : "none"} /> {isFav ? "Guardada" : "Guardar"}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onShare(); }}
                  className="inline-flex items-center justify-center gap-1 rounded-full border-2 border-baddia-ink bg-white px-2.5 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[1px] transition text-baddia-ink"
                >
                  <Share2 size={11} strokeWidth={3} /> Share
                </button>
              </div>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Share sheet
   ============================================================ */
function ShareSheet({ card, cat, onClose }: { card: AttractCard; cat: Category; onClose: () => void }) {
  const doNativeShare = async () => {
    const text = `${card.intent} · ${cat.label}\n\n"${card.mantra}"\n\n— Baddia ✨`;
    try {
      if ((navigator as any).share) {
        await (navigator as any).share({ title: `Cómo atraer ${cat.label.toLowerCase()}`, text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Copiado al portapapeles ✨");
      }
      onClose();
    } catch {}
  };
  const copy = async () => {
    await navigator.clipboard.writeText(`"${card.mantra}" — Baddia`);
    toast.success("Frase copiada ✨");
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center animate-fade-in" onClick={onClose}>
      <div className="absolute inset-0 bg-baddia-ink/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm mx-3 mb-3 sm:mb-0 rounded-[28px] bg-white border-[2.5px] border-baddia-ink p-5 shadow-[6px_8px_0_hsl(260_16%_15%)] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="rounded-3xl border-2 border-baddia-ink p-5 text-white text-center shadow-[3px_4px_0_hsl(260_16%_15%)]"
          style={{ background: cat.frontGradient }}
        >
          <span className="inline-flex items-center gap-1 rounded-full bg-white/25 border border-white/40 px-2 py-0.5 text-[9px] font-display font-black uppercase tracking-widest">
            {cat.emoji} atraer {cat.label.toLowerCase()}
          </span>
          <p className="font-serif-display italic font-black text-[22px] leading-tight mt-3">
            {card.intent}
          </p>
          <p className="font-serif-display italic text-[14px] leading-snug mt-3 opacity-95">
            "{card.mantra}"
          </p>
          <span className="block text-[9px] font-display font-black uppercase tracking-[0.3em] mt-4 opacity-80">
            baddia.app ✦
          </span>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={copy} className="flex-1 btn-sticker rounded-full py-2.5 bg-white text-baddia-ink text-[11px] uppercase tracking-widest">
            Copiar frase
          </button>
          <button onClick={doNativeShare} className="flex-1 btn-sticker rounded-full py-2.5 bg-baddia-hot text-white text-[11px] uppercase tracking-widest">
            Compartir
          </button>
        </div>
        <button onClick={onClose} className="w-full mt-2 text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink/60">
          cerrar
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Main screen
   ============================================================ */
export function Attract() {
  const { go } = useBaddia();
  const [filter, setFilter] = useState<CategoryId | "all" | "favs">("all");
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [favs, setFavs] = useState<string[]>(() => readFavs());
  const [share, setShare] = useState<{ card: AttractCard; cat: Category } | null>(null);
  const [revealKey, setRevealKey] = useState(0); // to re-trigger deal animation
  const introRef = useRef<HTMLDivElement>(null);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), 1700);
    return () => clearTimeout(t);
  }, []);

  const visible = useMemo(() => {
    if (filter === "all") return CARDS;
    if (filter === "favs") return CARDS.filter((c) => favs.includes(c.id));
    return CARDS.filter((c) => c.category === filter);
  }, [filter, favs]);

  const toggleFav = (id: string) => {
    setFavs((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      writeFavs(next);
      toast.success(prev.includes(id) ? "Quitada de favoritas" : "Guardada en tu mazo ✨");
      return next;
    });
  };

  const flipOne = (id: string) => setFlipped((p) => ({ ...p, [id]: !p[id] }));

  const reshuffle = () => {
    setFlipped({});
    setRevealKey((k) => k + 1);
  };

  return (
    <div className="relative min-h-full pb-10 overflow-hidden" style={{ background: "linear-gradient(180deg,#1B1230 0%,#2E1A47 45%,#3D1E4E 100%)" }}>
      {/* starfield */}
      <StarField />

      {/* header */}
      <header className="relative z-10 px-5 pt-6 pb-3">
        <button
          onClick={() => go("daily")}
          className="inline-flex items-center gap-1.5 mb-3 px-2.5 py-1 bg-white border-2 border-baddia-ink rounded-full shadow-[2px_2px_0_hsl(48_100%_59%)] text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink active:translate-y-0.5 transition-all"
        >
          <ArrowLeft size={12} strokeWidth={3} /> Volver
        </button>

        <span className="inline-block px-3 py-1 bg-baddia-yellow border-[2.5px] border-baddia-ink rounded-full shadow-[3px_3px_0_hsl(335_100%_59%)] text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink -rotate-2">
          🔮 mazo mágico
        </span>

        <h1 className="font-serif-display italic font-black text-[46px] leading-[0.95] tracking-tight text-white mt-3 drop-shadow-[0_4px_20px_rgba(255,122,200,0.35)]">
          Cómo <br />atraer <span className="inline-block animate-sparkle-spin">✦</span>
        </h1>
        <p className="text-[14px] font-medium italic text-white/75 mt-2">
          Un mazo cargado de intención. Toca cualquier carta y revela su mensaje.
        </p>

        {/* filters */}
        <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-1">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>✨ todas</FilterChip>
          <FilterChip active={filter === "favs"} onClick={() => setFilter("favs")}>💗 favoritas</FilterChip>
          {CATEGORIES.map((c) => (
            <FilterChip key={c.id} active={filter === c.id} onClick={() => setFilter(c.id)}>
              {c.emoji} {c.label}
            </FilterChip>
          ))}
        </div>
      </header>

      {/* Intro deck animation */}
      {!introDone && (
        <div ref={introRef} className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none">
          <div className="relative">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-[22px] border-[2.5px] border-baddia-ink shadow-[4px_6px_0_hsl(260_16%_15%)] intro-card"
                style={{
                  width: 130,
                  height: 190,
                  background: CATEGORIES[i % CATEGORIES.length].frontGradient,
                  animationDelay: `${i * 110}ms`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* grid of cards */}
      <div key={revealKey} className="relative z-10 px-5 mt-4">
        {visible.length === 0 ? (
          <div className="text-center text-white/70 py-14">
            <span className="text-4xl block mb-2">🪄</span>
            <p className="font-display font-black text-[13px] uppercase tracking-widest">Aún no guardas cartas</p>
            <p className="text-[12px] font-medium italic mt-1">Toca el corazón en el reverso para guardarlas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            {visible.map((card, i) => {
              const cat = CATEGORIES.find((c) => c.id === card.category)!;
              return (
                <TarotCard
                  key={card.id}
                  card={card}
                  cat={cat}
                  index={i}
                  flipped={!!flipped[card.id]}
                  onFlip={() => flipOne(card.id)}
                  isFav={favs.includes(card.id)}
                  onToggleFav={() => toggleFav(card.id)}
                  onShare={() => setShare({ card, cat })}
                  dealDelayMs={introDone ? i * 55 : 1700 + i * 55}
                />
              );
            })}
          </div>
        )}

        <button
          onClick={reshuffle}
          className="mt-6 mx-auto flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border-[2.5px] border-baddia-ink shadow-[3px_4px_0_hsl(260_16%_15%)] text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink active:translate-y-0.5"
        >
          <RotateCcw size={13} strokeWidth={3} /> Barajar de nuevo
        </button>

        <div className="mt-8 flex items-center justify-center gap-2 text-white/60">
          <Sparkles size={14} />
          <p className="text-[11px] font-display font-black uppercase tracking-[0.3em]">
            manifiesta con calma, recibe con fe
          </p>
          <Sparkles size={14} />
        </div>
      </div>

      {share && <ShareSheet card={share.card} cat={share.cat} onClose={() => setShare(null)} />}

      {/* scoped styles */}
      <style>{`
        .attract-deal {
          opacity: 0;
          transform: translateY(30px) scale(.85) rotate(var(--tilt, 0deg));
          animation: attractDeal .75s cubic-bezier(.34,1.56,.64,1) forwards;
        }
        @keyframes attractDeal {
          0%   { opacity: 0; transform: translateY(-120vh) scale(.6) rotate(-25deg); filter: blur(4px); }
          55%  { opacity: 1; transform: translateY(10px) scale(1.02) rotate(calc(var(--tilt,0deg) + 4deg)); filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(var(--tilt,0deg)); }
        }
        .attract-card-inner:hover {
          transform: translateY(-4px) rotateY(var(--flip,0deg));
        }
        .intro-card {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(-40deg) scale(.7);
          opacity: 0;
          animation: introFan 1.6s cubic-bezier(.34,1.56,.64,1) forwards;
        }
        @keyframes introFan {
          0%   { opacity: 0; transform: translate(-50%,-140%) rotate(-40deg) scale(.6); }
          40%  { opacity: 1; transform: translate(-50%,-50%) rotate(-14deg) scale(1); }
          70%  { opacity: 1; transform: translate(calc(-50% + var(--fan,0px)),-50%) rotate(var(--rot,0deg)) scale(1); }
          100% { opacity: 0; transform: translate(-50%,60vh) rotate(20deg) scale(.9); }
        }
        .intro-card:nth-child(1) { --fan: -120px; --rot: -18deg; }
        .intro-card:nth-child(2) { --fan: -60px;  --rot: -8deg; }
        .intro-card:nth-child(3) { --fan: 0px;    --rot: 0deg; }
        .intro-card:nth-child(4) { --fan: 60px;   --rot: 8deg; }
        .intro-card:nth-child(5) { --fan: 120px;  --rot: 18deg; }
      `}</style>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-1.5 rounded-full border-2 border-baddia-ink text-[10px] font-display font-black uppercase tracking-widest transition ${
        active
          ? "bg-baddia-yellow text-baddia-ink shadow-[3px_3px_0_hsl(335_100%_59%)]"
          : "bg-white/10 text-white backdrop-blur-sm shadow-[2px_2px_0_rgba(0,0,0,0.4)]"
      }`}
    >
      {children}
    </button>
  );
}

function StarField() {
  const stars = useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 4,
      dur: 2 + Math.random() * 3,
    }));
  }, []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            opacity: 0.6,
            animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
            boxShadow: "0 0 6px rgba(255,255,255,0.7)",
          }}
        />
      ))}
      <span className="absolute top-10 left-8 text-baddia-yellow/60 text-2xl animate-sparkle-spin">✦</span>
      <span className="absolute top-32 right-10 text-baddia-bubble/70 text-xl animate-sparkle-spin" style={{ animationDelay: "1.4s" }}>✧</span>
      <span className="absolute bottom-40 left-12 text-baddia-lavender/70 text-2xl animate-sparkle-spin" style={{ animationDelay: "0.8s" }}>✦</span>
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: .2; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.6); }
        }
      `}</style>
    </div>
  );
}
