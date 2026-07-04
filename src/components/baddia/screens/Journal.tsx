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
const LOCK_KEY = "baddia_journal_lock_v1";

interface LockConfig { hash: string; salt: string; hint: string; }

function hashPw(pw: string, salt: string) {
  const s = salt + "|" + pw;
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(16);
}
function makeSalt() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

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

  // Lock state
  const [lock, setLockState] = useState<LockConfig | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [attemptPw, setAttemptPw] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showAttemptPw, setShowAttemptPw] = useState(false);
  const [showHint, setShowHint] = useState(false);
  // Setup / manage modals
  const [setupMode, setSetupMode] = useState<null | "create" | "manage" | "change" | "remove">(null);
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [hintDraft, setHintDraft] = useState("");
  const [currentPwDraft, setCurrentPwDraft] = useState("");
  const [showPw1, setShowPw1] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch {}
    try {
      const rawLock = localStorage.getItem(LOCK_KEY);
      if (rawLock) setLockState(JSON.parse(rawLock));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries)); } catch {}
  }, [entries]);

  const persistLock = (l: LockConfig | null) => {
    setLockState(l);
    try {
      if (l) localStorage.setItem(LOCK_KEY, JSON.stringify(l));
      else localStorage.removeItem(LOCK_KEY);
    } catch {}
  };

  const resetSetup = () => {
    setSetupMode(null);
    setPw1(""); setPw2(""); setHintDraft(""); setCurrentPwDraft(""); setShowPw1(false);
  };

  const submitCreate = () => {
    if (pw1.length < 4) { toast("Mínimo 4 caracteres ✨"); return; }
    if (pw1 !== pw2) { toast("Las contraseñas no coinciden 💔"); return; }
    if (!hintDraft.trim()) { toast("Escribe una palabra de pista 🗝️"); return; }
    const salt = makeSalt();
    persistLock({ hash: hashPw(pw1, salt), salt, hint: hintDraft.trim() });
    setUnlocked(true);
    resetSetup();
    toast.success("Tu diario ahora está protegido 🔒💗");
  };

  const submitChange = () => {
    if (!lock) return;
    if (hashPw(currentPwDraft, lock.salt) !== lock.hash) { toast("Contraseña actual incorrecta"); return; }
    if (pw1.length < 4) { toast("Mínimo 4 caracteres ✨"); return; }
    if (pw1 !== pw2) { toast("Las contraseñas no coinciden 💔"); return; }
    if (!hintDraft.trim()) { toast("Escribe una palabra de pista 🗝️"); return; }
    const salt = makeSalt();
    persistLock({ hash: hashPw(pw1, salt), salt, hint: hintDraft.trim() });
    resetSetup();
    toast.success("Contraseña actualizada ✨");
  };

  const submitRemove = () => {
    if (!lock) return;
    if (hashPw(currentPwDraft, lock.salt) !== lock.hash) { toast("Contraseña incorrecta"); return; }
    persistLock(null);
    setUnlocked(false);
    resetSetup();
    toast.success("Contraseña eliminada 💗");
  };

  const tryUnlock = () => {
    if (!lock) return;
    if (hashPw(attemptPw, lock.salt) === lock.hash) {
      setUnlocked(true);
      setAttemptPw("");
      setAttempts(0);
      setShowHint(false);
      toast.success("Diario desbloqueado 💗");
    } else {
      const n = attempts + 1;
      setAttempts(n);
      setAttemptPw("");
      if (n >= 3) { setShowHint(true); toast("Aquí está tu pista 🗝️"); }
      else toast(`Contraseña incorrecta · ${3 - n} intento${3 - n === 1 ? "" : "s"}`);
    }
  };

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


  // ─── Lock gate (when diary has password and not unlocked) ───
  if (lock && !unlocked) {
    return (
      <div className="relative min-h-full bg-[#fdf7ee] pb-16 overflow-hidden">
        <PaperBackground />
        <SparklesDeco />
        <header className="relative z-10 px-5 pt-6 pb-2 flex items-center gap-3">
          <BackBtn onClick={() => go("daily")} />
          <h1 className="font-display font-black text-[22px] text-baddia-ink leading-tight">
            Baddia <span className="gradient-text">Journal</span> 🔒
          </h1>
        </header>

        <div className="relative z-10 px-5 mt-8">
          <div className="rounded-[26px] bg-white/90 backdrop-blur border-[2.5px] border-baddia-ink p-6 shadow-[6px_7px_0_hsl(260_16%_15%)] text-center">
            <div className="mx-auto w-20 h-20 rounded-full border-2 border-baddia-ink bg-baddia-lavender text-white flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] mb-3 -rotate-6 animate-float-cute">
              <LockKeyhole size={32} />
            </div>
            <p className="font-display font-black text-[20px] text-baddia-ink leading-tight">
              Tu diario está cerradito ✨
            </p>
            <p className="text-[13px] text-baddia-ink/70 font-medium mt-1 leading-snug">
              Escribe tu contraseña, bb 💗
            </p>

            <div className="mt-5 relative">
              <input
                type={showAttemptPw ? "text" : "password"}
                inputMode="text"
                autoFocus
                value={attemptPw}
                onChange={(e) => setAttemptPw(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") tryUnlock(); }}
                placeholder="Contraseña"
                className="w-full text-center font-display font-black tracking-[0.35em] text-[18px] text-baddia-ink bg-[#fffdf7] border-[2.5px] border-baddia-ink rounded-2xl px-4 py-3 pr-12 shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none placeholder:tracking-normal placeholder:font-medium placeholder:text-baddia-ink/40"
              />
              <button
                type="button"
                onClick={() => setShowAttemptPw((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-baddia-ink/60"
                aria-label="Mostrar contraseña"
              >
                {showAttemptPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              onClick={tryUnlock}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-baddia-ink text-white text-[13px] font-display font-black border-2 border-baddia-ink shadow-[3px_3px_0_hsl(335_85%_58%)] active:translate-y-[1px] transition-all"
            >
              <Unlock size={14} /> Abrir mi diario
            </button>

            {attempts > 0 && !showHint && (
              <p className="mt-3 text-[11px] font-display font-bold text-baddia-hot">
                {attempts}/3 intento{attempts === 1 ? "" : "s"} · te quedan {3 - attempts}
              </p>
            )}

            {showHint && (
              <div className="mt-4 rounded-2xl border-2 border-dashed border-baddia-ink/50 bg-baddia-yellow/40 p-3 text-left">
                <p className="text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/70 flex items-center gap-1">
                  <KeyRound size={12} /> tu palabra de pista
                </p>
                <p className="mt-1 font-serif italic text-[15px] text-baddia-ink break-words">
                  “{lock.hint}”
                </p>
              </div>
            )}
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
        <button
          onClick={() => setSetupMode(lock ? "manage" : "create")}
          aria-label={lock ? "Gestionar contraseña" : "Poner contraseña"}
          className={`w-11 h-11 rounded-2xl border-2 border-baddia-ink flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all ${
            lock ? "bg-baddia-mint text-white" : "bg-white text-baddia-ink"
          }`}
        >
          {lock ? <ShieldCheck size={18} /> : <LockKeyhole size={18} />}
        </button>
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

      {/* ── Setup / manage password modal ── */}
      {setupMode && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-baddia-ink/40 backdrop-blur-sm p-4" onClick={resetSetup}>
          <div
            className="relative w-full max-w-sm rounded-[26px] bg-[#fffdf7] border-[2.5px] border-baddia-ink p-5 shadow-[6px_7px_0_hsl(260_16%_15%)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={resetSetup}
              aria-label="Cerrar"
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)]"
            >
              <X size={14} className="text-baddia-ink" />
            </button>

            {setupMode === "manage" && (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-baddia-mint text-white border-2 border-baddia-ink flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-6">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <p className="font-display font-black text-[17px] text-baddia-ink leading-tight">Tu diario está protegido</p>
                    <p className="text-[12px] text-baddia-ink/60 font-medium">¿Qué quieres hacer, bb?</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <button
                    onClick={() => { setUnlocked(false); resetSetup(); toast("Diario cerradito 🔒"); }}
                    className="w-full inline-flex items-center gap-2 justify-center py-3 rounded-full bg-baddia-lavender text-white border-2 border-baddia-ink text-[13px] font-display font-black shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[1px]"
                  >
                    <Lock size={14} /> Bloquear ahora
                  </button>
                  <button
                    onClick={() => setSetupMode("change")}
                    className="w-full inline-flex items-center gap-2 justify-center py-3 rounded-full bg-white text-baddia-ink border-2 border-baddia-ink text-[13px] font-display font-black shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[1px]"
                  >
                    <KeyRound size={14} /> Cambiar contraseña
                  </button>
                  <button
                    onClick={() => setSetupMode("remove")}
                    className="w-full inline-flex items-center gap-2 justify-center py-3 rounded-full bg-baddia-hot text-white border-2 border-baddia-ink text-[13px] font-display font-black shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[1px]"
                  >
                    <Trash2 size={14} /> Quitar contraseña
                  </button>
                </div>
              </>
            )}

            {setupMode === "create" && (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-baddia-yellow text-baddia-ink border-2 border-baddia-ink flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-6">
                    <LockKeyhole size={22} />
                  </div>
                  <div>
                    <p className="font-display font-black text-[17px] text-baddia-ink leading-tight">Protege tu diario ✨</p>
                    <p className="text-[12px] text-baddia-ink/60 font-medium">Solo tú vas a poder abrirlo, bb 💗</p>
                  </div>
                </div>
                <PwFields
                  pw1={pw1} setPw1={setPw1}
                  pw2={pw2} setPw2={setPw2}
                  hintDraft={hintDraft} setHintDraft={setHintDraft}
                  showPw1={showPw1} setShowPw1={setShowPw1}
                />
                <button
                  onClick={submitCreate}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-baddia-ink text-white text-[13px] font-display font-black border-2 border-baddia-ink shadow-[3px_3px_0_hsl(48_100%_59%)] active:translate-y-[1px]"
                >
                  <ShieldCheck size={14} /> Poner contraseña
                </button>
              </>
            )}

            {setupMode === "change" && (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-baddia-bubble text-baddia-ink border-2 border-baddia-ink flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-6">
                    <KeyRound size={22} />
                  </div>
                  <p className="font-display font-black text-[17px] text-baddia-ink leading-tight">Cambiar contraseña</p>
                </div>
                <label className="block text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/70 mb-1">Contraseña actual</label>
                <input
                  type="password"
                  value={currentPwDraft}
                  onChange={(e) => setCurrentPwDraft(e.target.value)}
                  className="w-full bg-white border-2 border-baddia-ink rounded-xl px-3 py-2 text-[14px] font-display font-bold text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] focus:outline-none mb-3"
                  placeholder="•••••"
                />
                <PwFields
                  pw1={pw1} setPw1={setPw1}
                  pw2={pw2} setPw2={setPw2}
                  hintDraft={hintDraft} setHintDraft={setHintDraft}
                  showPw1={showPw1} setShowPw1={setShowPw1}
                  labelNew="Nueva contraseña"
                />
                <button
                  onClick={submitChange}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-baddia-ink text-white text-[13px] font-display font-black border-2 border-baddia-ink shadow-[3px_3px_0_hsl(48_100%_59%)] active:translate-y-[1px]"
                >
                  <ShieldCheck size={14} /> Guardar cambios
                </button>
              </>
            )}

            {setupMode === "remove" && (
              <>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-baddia-hot text-white border-2 border-baddia-ink flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-6">
                    <Trash2 size={22} />
                  </div>
                  <div>
                    <p className="font-display font-black text-[17px] text-baddia-ink leading-tight">Quitar contraseña</p>
                    <p className="text-[12px] text-baddia-ink/60 font-medium">Tu diario quedará abiertito ✨</p>
                  </div>
                </div>
                <label className="block text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/70 mb-1">Confirma tu contraseña</label>
                <input
                  type="password"
                  value={currentPwDraft}
                  onChange={(e) => setCurrentPwDraft(e.target.value)}
                  className="w-full bg-white border-2 border-baddia-ink rounded-xl px-3 py-2 text-[14px] font-display font-bold text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] focus:outline-none"
                  placeholder="•••••"
                />
                <button
                  onClick={submitRemove}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 py-3 rounded-full bg-baddia-hot text-white text-[13px] font-display font-black border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[1px]"
                >
                  <Trash2 size={14} /> Quitar contraseña
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PwFields({
  pw1, setPw1, pw2, setPw2, hintDraft, setHintDraft, showPw1, setShowPw1, labelNew = "Contraseña",
}: {
  pw1: string; setPw1: (v: string) => void;
  pw2: string; setPw2: (v: string) => void;
  hintDraft: string; setHintDraft: (v: string) => void;
  showPw1: boolean; setShowPw1: (v: boolean) => void;
  labelNew?: string;
}) {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/70 mb-1">{labelNew}</label>
        <div className="relative">
          <input
            type={showPw1 ? "text" : "password"}
            value={pw1}
            onChange={(e) => setPw1(e.target.value)}
            className="w-full bg-white border-2 border-baddia-ink rounded-xl px-3 py-2 pr-10 text-[14px] font-display font-bold text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] focus:outline-none"
            placeholder="Mínimo 4 caracteres"
          />
          <button type="button" onClick={() => setShowPw1(!showPw1)} className="absolute right-2 top-1/2 -translate-y-1/2 text-baddia-ink/60 w-7 h-7 flex items-center justify-center" aria-label="Mostrar">
            {showPw1 ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/70 mb-1">Confirmar</label>
        <input
          type={showPw1 ? "text" : "password"}
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          className="w-full bg-white border-2 border-baddia-ink rounded-xl px-3 py-2 text-[14px] font-display font-bold text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] focus:outline-none"
          placeholder="Otra vez, bb ✨"
        />
      </div>
      <div>
        <label className="block text-[10px] font-display font-black uppercase tracking-widest text-baddia-ink/70 mb-1 flex items-center gap-1">
          <KeyRound size={11} /> Palabra de pista
        </label>
        <input
          type="text"
          value={hintDraft}
          onChange={(e) => setHintDraft(e.target.value.slice(0, 40))}
          className="w-full bg-baddia-yellow/30 border-2 border-baddia-ink rounded-xl px-3 py-2 text-[14px] font-serif italic text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] focus:outline-none"
          placeholder="ej: mi primer amor 💌"
        />
        <p className="mt-1 text-[10px] text-baddia-ink/50 font-medium">Te la mostramos si fallas 3 veces.</p>
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
