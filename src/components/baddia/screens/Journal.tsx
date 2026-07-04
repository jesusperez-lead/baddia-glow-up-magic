import { useMemo, useState, useEffect } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import {
  ArrowLeft, BookHeart, Save, Trash2, Lock, ChevronLeft, ChevronRight,
  Sparkles, Feather, Heart, Moon, Star, Shirt, Smile, Flame,
  LockKeyhole, KeyRound, Eye, EyeOff, ShieldCheck, X, Unlock,
} from "lucide-react";
import { toast } from "sonner";

type MoodKey = "glow" | "soft" | "sad" | "fire" | "dreamy" | "chill";
type CategoryKey = "feel" | "quote" | "reading" | "manifest" | "release" | "crush" | "outfit" | "mood";

const MOODS: { key: MoodKey; emoji: string; label: string; bg: string }[] = [
  { key: "glow",   emoji: "✨", label: "glow",    bg: "bg-baddia-yellow" },
  { key: "soft",   emoji: "🌸", label: "soft",    bg: "bg-baddia-bubble" },
  { key: "dreamy", emoji: "🌙", label: "dreamy",  bg: "bg-baddia-lavender text-white" },
  { key: "fire",   emoji: "🔥", label: "fire",    bg: "bg-baddia-hot text-white" },
  { key: "chill",  emoji: "🍃", label: "chill",   bg: "bg-baddia-mint text-white" },
  { key: "sad",    emoji: "🥺", label: "low",     bg: "bg-baddia-soft" },
];

const CATEGORIES: { key: CategoryKey; label: string; emoji: string; prompt: string; icon: any }[] = [
  { key: "feel",     label: "Cómo me siento",  emoji: "💗", prompt: "¿Cómo te sientes hoy, bb?",                    icon: Heart },
  { key: "quote",    label: "Frase del día",   emoji: "💬", prompt: "¿Qué frase te salió y por qué te tocó?",       icon: Feather },
  { key: "reading",  label: "Mi lectura",      emoji: "🔮", prompt: "¿Qué lectura recibiste hoy? Escríbela aquí.",  icon: Sparkles },
  { key: "manifest", label: "Quiero manifestar", emoji: "🌟", prompt: "¿Qué quieres manifestar esta semana?",       icon: Star },
  { key: "release",  label: "Quiero soltar",   emoji: "🕊️", prompt: "¿Qué necesitas soltar hoy para vibrar mejor?", icon: Moon },
  { key: "crush",    label: "Sobre mi crush",  emoji: "💘", prompt: "¿Qué pasó hoy con tu crush? Cuéntalo todo.",   icon: Flame },
  { key: "outfit",   label: "Mi outfit hoy",   emoji: "👗", prompt: "¿Qué outfit usaste? ¿Cómo te hizo sentir?",    icon: Shirt },
  { key: "mood",     label: "Mi mood",         emoji: "🎧", prompt: "Describe tu mood de hoy en 3 palabras ✨",     icon: Smile },
];

interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  category: CategoryKey;
  mood: MoodKey | null;
  text: string;
  createdAt: number;
}

const STORAGE_KEY = "baddia_journal_v1";

function todayISO(d = new Date()) {
  const tz = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return tz.toISOString().slice(0, 10);
}
function prettyDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" });
}

export function Journal() {
  const { go, user, openPaywall } = useBaddia();
  const isPro = user.plan !== "Free";

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(todayISO());
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [mood, setMood] = useState<MoodKey | null>(null);
  const [text, setText] = useState("");

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch {}
  }, [entries]);

  const category = CATEGORIES[categoryIdx];

  const dayEntries = useMemo(
    () => entries.filter((e) => e.date === selectedDate).sort((a, b) => b.createdAt - a.createdAt),
    [entries, selectedDate],
  );

  const save = () => {
    if (!text.trim()) {
      toast("Escribe algo primero, bb ✨");
      return;
    }
    const entry: JournalEntry = {
      id: crypto.randomUUID(),
      date: selectedDate,
      category: category.key,
      mood,
      text: text.trim(),
      createdAt: Date.now(),
    };
    setEntries((p) => [entry, ...p]);
    setText("");
    setMood(null);
    toast.success("Guardado en tu diario 💗");
  };

  const remove = (id: string) => {
    setEntries((p) => p.filter((e) => e.id !== id));
    toast.success("Entrada eliminada");
  };

  const shiftDay = (dir: -1 | 1) => {
    const d = new Date(selectedDate + "T00:00:00");
    d.setDate(d.getDate() + dir);
    setSelectedDate(todayISO(d));
  };

  // ─── Paywall gate ───
  if (!isPro) {
    return (
      <div className="relative min-h-full bg-[#fdf7ee] pb-16 overflow-hidden">
        <PaperBackground />
        <SparklesDeco />
        <header className="relative z-10 px-5 pt-6 pb-3 flex items-center gap-3">
          <BackBtn onClick={() => go("daily")} />
          <h1 className="font-display font-black text-[22px] text-baddia-ink leading-tight">
            Baddia <span className="gradient-text">Journal</span>
          </h1>
        </header>
        <div className="relative z-10 px-5 mt-6">
          <div className="rounded-3xl bg-white/80 backdrop-blur border-[2.5px] border-baddia-ink p-6 shadow-[6px_7px_0_hsl(260_16%_15%)] text-center">
            <div className="mx-auto w-20 h-20 rounded-full border-2 border-baddia-ink bg-baddia-yellow flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] mb-3 -rotate-6">
              <BookHeart size={32} className="text-baddia-ink" />
            </div>
            <p className="font-display font-black text-[20px] text-baddia-ink leading-tight">
              Tu diario privado ✨
            </p>
            <p className="text-[13px] text-baddia-ink/70 font-medium mt-2 leading-snug">
              Escribe cómo te sientes, tus lecturas, tu crush, lo que quieres manifestar y soltar.
              Solo tú y tu glow.
            </p>
            <button
              onClick={openPaywall}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-baddia-ink text-white text-[13px] font-display font-black border-2 border-baddia-ink shadow-[3px_3px_0_hsl(48_100%_59%)] active:translate-y-[1px] transition-all"
            >
              <Lock size={14} /> Desbloquear con Baddia Pro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full bg-[#fdf7ee] pb-20 overflow-hidden">
      <PaperBackground />
      <SparklesDeco />

      {/* App bar */}
      <header className="relative z-10 px-5 pt-6 pb-2 flex items-center gap-3">
        <BackBtn onClick={() => go("daily")} />
        <div className="flex-1 min-w-0">
          <span className="inline-block rounded-full bg-baddia-hot text-white border-2 border-baddia-ink px-2.5 py-1 text-[10px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2 mb-1 uppercase tracking-wider">
            ✦ diario privado
          </span>
          <h1 className="font-display font-black text-[22px] text-baddia-ink leading-tight">
            Baddia <span className="gradient-text">Journal</span> 📓
          </h1>
        </div>
      </header>

      {/* Date navigator */}
      <div className="relative z-10 px-5 mt-3">
        <div className="flex items-center justify-between rounded-full bg-white border-[2.5px] border-baddia-ink px-2 py-1.5 shadow-[4px_4px_0_hsl(260_16%_15%)]">
          <button
            onClick={() => shiftDay(-1)}
            className="w-8 h-8 rounded-full bg-baddia-yellow border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[1px]"
            aria-label="Día anterior"
          >
            <ChevronLeft size={14} className="text-baddia-ink" />
          </button>
          <p className="font-display font-black text-[12px] text-baddia-ink uppercase tracking-wider text-center">
            {selectedDate === todayISO() ? "hoy · " : ""}{prettyDate(selectedDate)}
          </p>
          <button
            onClick={() => shiftDay(1)}
            disabled={selectedDate >= todayISO()}
            className="w-8 h-8 rounded-full bg-baddia-bubble border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)] active:translate-y-[1px] disabled:opacity-40"
            aria-label="Día siguiente"
          >
            <ChevronRight size={14} className="text-baddia-ink" />
          </button>
        </div>
      </div>

      {/* Category selector */}
      <div className="relative z-10 mt-4">
        <div className="px-5 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 pb-1 w-max">
            {CATEGORIES.map((c, i) => {
              const active = i === categoryIdx;
              return (
                <button
                  key={c.key}
                  onClick={() => setCategoryIdx(i)}
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[12px] font-display font-black border-2 border-baddia-ink transition-all ${
                    active
                      ? "bg-baddia-ink text-white shadow-[3px_3px_0_hsl(260_16%_15%/0.4)] -translate-y-[1px]"
                      : "bg-white text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%/0.55)]"
                  }`}
                >
                  <span className="text-[13px] leading-none">{c.emoji}</span>{c.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Journal paper card */}
      <div className="relative z-10 px-5 mt-4">
        <div className="relative">
          {/* washi tape */}
          <span className="absolute -top-3 left-8 w-16 h-5 bg-baddia-bubble/80 border border-baddia-ink/20 rotate-[-6deg] shadow-sm z-10" />
          <span className="absolute -top-3 right-10 w-14 h-5 bg-baddia-yellow/90 border border-baddia-ink/20 rotate-[8deg] shadow-sm z-10" />

          <div
            className="rounded-[22px] border-[2.5px] border-baddia-ink shadow-[6px_7px_0_hsl(260_16%_15%)] p-5 pt-6"
            style={{
              background:
                "repeating-linear-gradient(to bottom, #fffdf7 0px, #fffdf7 27px, hsl(335 60% 85% / 0.35) 28px)",
            }}
          >
            <p className="font-display font-black text-[16px] text-baddia-ink leading-snug flex items-start gap-2">
              <span className="text-lg">{category.emoji}</span>
              <span>{category.prompt}</span>
            </p>

            {/* mood picker */}
            <div className="mt-3">
              <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/60 mb-1.5">
                mood
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MOODS.map((m) => {
                  const active = mood === m.key;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setMood(active ? null : m.key)}
                      className={`inline-flex items-center gap-1 rounded-full border-2 border-baddia-ink px-2.5 py-1 text-[11px] font-display font-black transition-all ${
                        active
                          ? `${m.bg} shadow-[2px_2px_0_hsl(260_16%_15%)] -translate-y-[1px]`
                          : "bg-white text-baddia-ink shadow-[1.5px_1.5px_0_hsl(260_16%_15%/0.55)]"
                      }`}
                    >
                      <span>{m.emoji}</span>{m.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* textarea */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe aquí, bb… nadie más lo verá 💌"
              rows={6}
              className="mt-3 w-full resize-none bg-transparent font-serif italic text-[15px] text-baddia-ink placeholder:text-baddia-ink/40 focus:outline-none leading-[28px]"
              style={{ lineHeight: "28px" }}
            />

            {/* footer signature */}
            <div className="mt-1 flex items-center justify-between">
              <p className="font-display italic text-[11px] text-baddia-ink/50">
                — con amor, {user.name.toLowerCase()} ♡
              </p>
              <button
                onClick={save}
                className="inline-flex items-center gap-1.5 rounded-full bg-baddia-ink text-white border-2 border-baddia-ink px-4 py-2 text-[12px] font-display font-black shadow-[3px_3px_0_hsl(48_100%_59%)] active:translate-y-[1px] transition-all"
              >
                <Save size={13} /> Guardar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Past entries this day */}
      <div className="relative z-10 px-5 mt-6">
        <p className="font-display font-black text-[13px] text-baddia-ink uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="text-base">📖</span>
          {selectedDate === todayISO() ? "hoy escribiste" : "ese día escribiste"}
          <span className="text-baddia-ink/50">· {dayEntries.length}</span>
        </p>

        {dayEntries.length === 0 ? (
          <div className="rounded-3xl bg-white/70 backdrop-blur border-2 border-dashed border-baddia-ink/40 p-5 text-center">
            <p className="text-[12px] font-medium text-baddia-ink/60 italic">
              Aún no hay páginas de este día. Empieza a escribir ✨
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dayEntries.map((e) => {
              const cat = CATEGORIES.find((c) => c.key === e.category)!;
              const mo = e.mood ? MOODS.find((m) => m.key === e.mood) : null;
              return (
                <div key={e.id} className="relative">
                  <span className="absolute -top-2.5 left-4 z-10 inline-flex items-center gap-1 rounded-full bg-baddia-lavender text-white border-2 border-baddia-ink px-2 py-0.5 text-[9px] font-display font-black uppercase tracking-wider shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
                    {cat.emoji} {cat.label}
                  </span>
                  <div
                    className="rounded-2xl border-[2.5px] border-baddia-ink p-4 pt-5 shadow-[4px_5px_0_hsl(260_16%_15%)]"
                    style={{ background: "#fffdf7" }}
                  >
                    <p className="font-serif italic text-[14px] text-baddia-ink leading-relaxed whitespace-pre-wrap">
                      {e.text}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {mo && (
                          <span className={`inline-flex items-center gap-1 rounded-full ${mo.bg} border-2 border-baddia-ink px-2 py-0.5 text-[10px] font-display font-black`}>
                            {mo.emoji} {mo.label}
                          </span>
                        )}
                        <span className="text-[10px] text-baddia-ink/50 font-display font-bold uppercase tracking-wider">
                          {new Date(e.createdAt).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <button
                        onClick={() => remove(e.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white text-baddia-hot border-2 border-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%/0.55)] active:translate-y-[1px]"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Volver"
      className="w-10 h-10 rounded-2xl bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
    >
      <ArrowLeft size={16} className="text-baddia-ink" />
    </button>
  );
}

function PaperBackground() {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(hsl(260 16% 15% / 0.08) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="blob -top-16 -left-16 w-64 h-64 bg-baddia-bubble/30" />
      <div className="blob top-72 -right-14 w-56 h-56 bg-baddia-yellow/40" style={{ animationDelay: "3s" }} />
    </>
  );
}
