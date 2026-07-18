import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, X, Camera, Trash2, Check, Sparkles, ImagePlus, Pencil, Play, Flame } from "lucide-react";
import { toast } from "sonner";

/* ─────────── Types & storage ─────────── */
export type MyManifest = {
  id: string;
  title: string;
  caption: string;
  photo?: string; // dataURL
  createdAt: string;
  daysCompleted: string[]; // YYYY-MM-DD
};

const KEY = "baddia.myManifests.v1";
export const todayKey = () => new Date().toISOString().slice(0, 10);

export const loadMyManifests = (): MyManifest[] => {
  try {
    const v = localStorage.getItem(KEY);
    if (!v) return [];
    const arr = JSON.parse(v) as any[];
    // backward compat: ensure daysCompleted exists
    return arr.map((m) => ({ ...m, daysCompleted: Array.isArray(m.daysCompleted) ? m.daysCompleted : [] }));
  } catch { return []; }
};
export const saveMyManifests = (list: MyManifest[]) => {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
};

export const markMyManifestDay = (id: string): MyManifest | null => {
  const list = loadMyManifests();
  const idx = list.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  const t = todayKey();
  if (!list[idx].daysCompleted.includes(t)) {
    list[idx] = { ...list[idx], daysCompleted: [...list[idx].daysCompleted, t] };
    saveMyManifests(list);
  }
  return list[idx];
};

/* ─────────── Main section ─────────── */
export function MyManifests({ onRun }: { onRun?: (m: MyManifest) => void }) {
  const [list, setList] = useState<MyManifest[]>(() => loadMyManifests());
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<MyManifest | null>(null);

  useEffect(() => { saveMyManifests(list); }, [list]);

  // Refresh from storage when window regains focus (streak may have been updated by ritual)
  useEffect(() => {
    const refresh = () => setList(loadMyManifests());
    window.addEventListener("focus", refresh);
    window.addEventListener("baddia:myManifests:updated", refresh as any);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("baddia:myManifests:updated", refresh as any);
    };
  }, []);

  const openNew = () => { setEditing(null); setEditorOpen(true); };
  const openEdit = (m: MyManifest) => { setEditing(m); setEditorOpen(true); };
  const remove = (id: string) => setList((l) => l.filter((x) => x.id !== id));

  const upsert = (m: MyManifest) => {
    setList((l) => {
      const idx = l.findIndex((x) => x.id === m.id);
      if (idx === -1) return [m, ...l];
      const cp = [...l]; cp[idx] = m; return cp;
    });
  };

  return (
    <>
      {/* Section header */}
      <div className="flex items-center gap-2 pt-1 pl-1">
        <span className="text-base">💌</span>
        <p className="font-display font-black text-[12px] uppercase tracking-[0.15em] text-baddia-ink/70">
          mis manifestaciones
        </p>
        <span className="h-[2px] flex-1 bg-baddia-ink/15 rounded-full" />
      </div>
      <p className="text-[10.5px] text-baddia-ink/55 font-display font-semibold italic -mt-1 pl-1">
        cada una tiene su propia racha 🔥
      </p>

      {/* Add card + list */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
        {/* + Add */}
        <button
          onClick={openNew}
          className="shrink-0 w-[150px] h-[230px] rounded-[22px] border-[2.5px] border-dashed border-baddia-ink bg-white/80 shadow-[3px_3px_0_hsl(260_16%_15%)] flex flex-col items-center justify-center gap-2 active:translate-y-0.5"
          style={{ transform: "rotate(-2deg)" }}
        >
          <span className="w-11 h-11 rounded-full border-2 border-baddia-ink bg-gradient-to-br from-baddia-hot to-baddia-bubble text-white flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)]">
            <Plus size={22} strokeWidth={3} />
          </span>
          <p className="font-display font-black text-[12px] text-baddia-ink leading-tight text-center px-2">
            Nueva<br/>manifestación
          </p>
          <p className="text-[10px] text-baddia-ink/50 font-display font-bold">foto + frase ✨</p>
        </button>

        {/* Cards */}
        {list.map((m, i) => (
          <PolaroidCard
            key={m.id}
            item={m}
            rot={i % 2 ? 2 : -2}
            onRun={() => onRun?.(m)}
            onEdit={() => openEdit(m)}
            onRemove={() => remove(m.id)}
          />
        ))}
      </div>

      {list.length === 0 && (
        <p className="text-[11.5px] text-baddia-ink/55 font-display font-semibold text-center italic -mt-1">
          crea tu primera tarjeta con foto y frase para manifestar 💗
        </p>
      )}

      {editorOpen && (
        <ManifestEditor
          initial={editing}
          onClose={() => setEditorOpen(false)}
          onSave={(m) => { upsert(m); setEditorOpen(false); toast.success("Manifestación guardada ✨"); }}
        />
      )}
    </>
  );
}

/* ─────────── Polaroid card ─────────── */
function PolaroidCard({ item, rot, onRun, onEdit, onRemove }: {
  item: MyManifest;
  rot: number;
  onRun: () => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const streak = item.daysCompleted.length;
  const completedToday = item.daysCompleted.includes(todayKey());

  return (
    <div
      className="relative shrink-0 w-[160px] rounded-[20px] border-[2.5px] border-baddia-ink bg-white p-2 pb-3 shadow-[4px_5px_0_hsl(260_16%_15%_/_0.9)]"
      style={{ transform: `rotate(${rot}deg)` }}
    >
      {/* tape */}
      <span className="absolute -top-2 left-6 w-12 h-4 bg-baddia-yellow/80 border border-baddia-ink/10 -rotate-6 shadow-sm" />
      <span className="absolute -top-2 right-5 w-10 h-4 bg-baddia-bubble/80 border border-baddia-ink/10 rotate-6 shadow-sm" />

      {/* streak chip */}
      {streak > 0 && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-10 inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full border-2 border-baddia-ink bg-baddia-yellow shadow-[1.5px_1.5px_0_hsl(260_16%_15%)] font-display font-black text-[10px] text-baddia-ink">
          <Flame size={9} strokeWidth={3} /> {streak}
        </span>
      )}

      {/* photo → runs ritual */}
      <button
        onClick={onRun}
        className="relative block w-full aspect-square rounded-[14px] overflow-hidden border-2 border-baddia-ink bg-gradient-to-br from-pink-100 via-white to-purple-100 active:scale-[0.98]"
      >
        {item.photo ? (
          <>
            <img src={item.photo} alt={item.title} className="w-full h-full object-cover" style={{ filter: "saturate(1.1) contrast(1.02)" }} />
            <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent to-baddia-yellow/20 mix-blend-screen" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-baddia-ink/50">
            <Camera size={26} />
            <span className="text-[10px] font-display font-black uppercase tracking-widest mt-1">sin foto</span>
          </div>
        )}
        {/* play overlay */}
        <span className="absolute inset-0 flex items-center justify-center bg-baddia-ink/0 hover:bg-baddia-ink/10 transition">
          <span className="w-9 h-9 rounded-full border-2 border-baddia-ink bg-white/90 shadow-[2px_2px_0_hsl(260_16%_15%)] flex items-center justify-center">
            <Play size={14} strokeWidth={3} className="text-baddia-ink translate-x-0.5" />
          </span>
        </span>
      </button>

      {/* caption */}
      <p
        className="mt-2 text-baddia-ink text-[13px] text-center leading-tight truncate"
        style={{ fontFamily: "'Caveat', 'Fraunces', cursive", fontWeight: 700 }}
        title={item.caption}
      >
        {item.caption || "✧ mi intención ✧"}
      </p>
      <p className="mt-0.5 text-[9.5px] text-baddia-ink/55 font-display font-black uppercase tracking-widest text-center truncate px-1">
        {completedToday ? "hoy ✓ · " : ""}{item.title || "manifestación"}
      </p>

      {/* actions */}
      <div className="mt-1.5 flex justify-center gap-1.5">
        <button
          onClick={onRun}
          className="h-7 px-2.5 rounded-full border-2 border-baddia-ink bg-gradient-to-r from-baddia-hot to-baddia-bubble text-white shadow-[1.5px_1.5px_0_hsl(260_16%_15%)] flex items-center justify-center gap-1 active:translate-y-0.5 font-display font-black text-[9px] uppercase tracking-wider"
          aria-label="Manifestar"
        >
          <Sparkles size={10} /> Manifestar
        </button>
        <button
          onClick={onEdit}
          className="w-7 h-7 rounded-full border-2 border-baddia-ink bg-white shadow-[1.5px_1.5px_0_hsl(260_16%_15%)] flex items-center justify-center active:translate-y-0.5"
          aria-label="Editar"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={onRemove}
          className="w-7 h-7 rounded-full border-2 border-baddia-ink bg-baddia-hot text-white shadow-[1.5px_1.5px_0_hsl(260_16%_15%)] flex items-center justify-center active:translate-y-0.5"
          aria-label="Eliminar"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

/* ─────────── Editor sheet ─────────── */
function ManifestEditor({ initial, onClose, onSave }: {
  initial: MyManifest | null;
  onClose: () => void;
  onSave: (m: MyManifest) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [caption, setCaption] = useState(initial?.caption ?? "");
  const [photo, setPhoto] = useState<string | undefined>(initial?.photo);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f?: File | null) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { toast.error("Solo imágenes ✨"); return; }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(f);
  };

  const commit = () => {
    if (!caption.trim() && !title.trim()) { toast.error("Escribe una frase para manifestar"); return; }
    const m: MyManifest = {
      id: initial?.id ?? `m_${Date.now()}`,
      title: title.trim().slice(0, 40) || "Mi manifestación",
      caption: caption.trim().slice(0, 140),
      photo,
      createdAt: initial?.createdAt ?? new Date().toISOString(),
      daysCompleted: initial?.daysCompleted ?? [],
    };
    onSave(m);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-baddia-ink/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] bg-gradient-to-br from-baddia-pearl via-white to-baddia-bubble/40 border-t-[2.5px] sm:border-[2.5px] border-baddia-ink shadow-[0_-8px_40px_rgba(0,0,0,0.35)] p-5 pb-6 animate-slide-up max-h-[92vh] overflow-y-auto scrollbar-hide"
      >
        <div className="mx-auto w-12 h-1.5 rounded-full bg-baddia-ink/25 mb-3 sm:hidden" />

        {/* header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="inline-block rounded-full bg-baddia-ink text-white px-2.5 py-1 text-[9px] font-display font-black uppercase tracking-[0.15em] -rotate-2 shadow-[2px_2px_0_hsl(260_16%_15%_/_0.15)]">
              💌 tu manifestación
            </span>
            <h2 className="font-display font-black text-baddia-ink text-[20px] leading-tight mt-1.5">
              {initial ? "Editar" : "Nueva"} <span className="gradient-text">manifestación</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border-2 border-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)] flex items-center justify-center active:translate-y-[1px]"
            aria-label="Cerrar"
          >
            <X size={16} className="text-baddia-ink" />
          </button>
        </div>

        {/* Live preview polaroid */}
        <div className="flex justify-center py-2">
          <div
            className="relative bg-white p-3 pb-10 border border-baddia-ink/10 shadow-[6px_10px_0_hsl(260_16%_15%_/_0.25)]"
            style={{ transform: "rotate(-3deg)", width: 220 }}
          >
            <span className="absolute -top-3 left-6 w-14 h-5 bg-baddia-yellow/80 border border-baddia-ink/10 rotate-[-8deg] shadow-sm" />
            <div className="relative w-[196px] h-[196px] bg-gradient-to-br from-pink-100 via-white to-purple-100 overflow-hidden border border-baddia-ink/10">
              {photo ? (
                <>
                  <img src={photo} alt="preview" className="w-full h-full object-cover" style={{ filter: "saturate(1.1) contrast(1.02)" }} />
                  <span className="pointer-events-none absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.25)]" />
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent to-baddia-yellow/20 mix-blend-screen" />
                </>
              ) : (
                <button onClick={() => fileRef.current?.click()} className="w-full h-full flex flex-col items-center justify-center text-baddia-ink/40 gap-2">
                  <ImagePlus size={34} />
                  <span className="text-[10px] font-display font-black uppercase tracking-widest">subir foto</span>
                </button>
              )}
            </div>
            <div className="absolute bottom-2 left-3 right-3 text-center">
              <p
                className="text-baddia-ink text-[13px] leading-none truncate"
                style={{ fontFamily: "'Caveat', 'Fraunces', cursive", fontWeight: 700 }}
              >
                {caption || "✧ tu frase ✧"}
              </p>
            </div>
          </div>
        </div>

        {/* Upload / change photo */}
        <div className="flex gap-2 mt-1">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-white text-baddia-ink border-2 border-baddia-ink px-3 py-2.5 text-[12px] font-display font-black shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px]"
          >
            <Camera size={13} /> {photo ? "Cambiar foto" : "Subir foto"}
          </button>
          {photo && (
            <button
              onClick={() => setPhoto(undefined)}
              className="w-11 h-11 rounded-full bg-white text-baddia-hot border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] flex items-center justify-center active:translate-y-[2px]"
              aria-label="Quitar foto"
            >
              <Trash2 size={14} />
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>

        {/* Title */}
        <p className="mt-4 mb-1.5 pl-1 font-display font-black text-[10px] uppercase tracking-[0.18em] text-baddia-ink/60">
          <Sparkles size={10} className="inline -mt-0.5 mr-1" /> título corto
        </p>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, 40))}
          placeholder="Ej: mi nuevo trabajo, glow del verano…"
          className="w-full rounded-2xl border-[2.5px] border-baddia-ink bg-white px-4 py-2.5 text-[13.5px] font-display font-bold text-baddia-ink placeholder:text-baddia-ink/30 shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none"
        />
        <div className="flex justify-end mt-0.5 pr-1">
          <span className="text-[10px] text-baddia-ink/40 font-display font-bold">{title.length}/40</span>
        </div>

        {/* Caption */}
        <p className="mt-2 mb-1.5 pl-1 font-display font-black text-[10px] uppercase tracking-[0.18em] text-baddia-ink/60">
          ✍️ pie de página · tu frase
        </p>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value.slice(0, 140))}
          rows={3}
          placeholder="Escribe la frase que quieres manifestar…"
          className="w-full rounded-2xl border-[2.5px] border-baddia-ink bg-white px-4 py-3 text-[14px] font-display font-bold text-baddia-ink placeholder:text-baddia-ink/30 shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none resize-none"
        />
        <div className="flex justify-end mt-0.5 pr-1">
          <span className="text-[10px] text-baddia-ink/40 font-display font-bold">{caption.length}/140</span>
        </div>

        {/* Save */}
        <button
          onClick={commit}
          className="mt-4 w-full py-3 rounded-full bg-gradient-to-r from-baddia-hot via-baddia-bubble to-baddia-lavender text-white font-display font-black text-[14px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] inline-flex items-center justify-center gap-1.5"
        >
          <Check size={15} /> Guardar manifestación
        </button>
      </div>
    </div>,
    document.body
  );
}
