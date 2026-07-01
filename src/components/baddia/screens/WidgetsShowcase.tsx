import { useBaddia } from "@/lib/baddia-state";
import { ArrowLeft, Sparkles, Moon, Heart, Flame, Hand, Star, Calendar, Users, Music, Bell, Lock, Wand2 } from "lucide-react";
import { computeDailyVibe } from "@/lib/baddia-daily";
import { ZODIAC_EMOJI, type Zodiac } from "@/lib/baddia-numerology";

export function WidgetsShowcase() {
  const { go, user } = useBaddia();
  const vibe = computeDailyVibe(user);
  const glyph = ZODIAC_EMOJI[user.sign as Zodiac] ?? "✦";
  const shortQuote = vibe.advice.length > 42 ? vibe.advice.slice(0, 40).trim() + "…" : vibe.advice;

  return (
    <div className="relative min-h-full bg-gradient-pearl pb-10">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b-2 border-baddia-ink/10 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => go("profile")}
          className="w-9 h-9 rounded-full bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)]"
        >
          <ArrowLeft size={16} className="text-baddia-ink" />
        </button>
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] font-display font-bold text-baddia-ink/60">
            Baddia
          </p>
          <h1 className="font-display font-black text-[18px] text-baddia-ink leading-tight">
            Widgets para tu iPhone ✨
          </h1>
        </div>
      </header>

      <div className="px-4 pt-5 space-y-7">
        <p className="text-[13px] text-baddia-ink/70 font-semibold leading-snug px-1">
          Lleva tu glow fuera de la app. Así se verían los widgets de Baddia en tu home y lock screen.
        </p>

        {/* ───── LOCK SCREEN MOCKUP ───── */}
        <Section emoji="🔒" label="Lock screen">
          <PhoneCanvas wallpaper="lock">
            {/* time */}
            <div className="pt-12 text-center text-white px-4">
              <p className="font-semibold text-[11px] opacity-90 tracking-wide">jueves 16 de junio</p>
              <p className="font-display font-black text-[64px] leading-none mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] tracking-tight">
                09:24
              </p>
            </div>

            {/* lock-screen widgets row */}
            <div className="px-4 mt-3 grid grid-cols-3 gap-1.5">
              <LockChip icon="✨" label="Glow" value="87" />
              <LockChip icon="🌙" label="Luna" value="Crec." />
              <LockChip icon="💘" label="Crush" value="Alta" />
            </div>

            {/* notifications */}
            <div className="absolute bottom-16 left-0 right-0 px-2.5 space-y-1.5">
              <IOSNotification
                app="Baddia"
                title="Tu lectura está lista ✨"
                body="Hoy magnetizas más de lo que crees."
                time="ahora"
              />
              <IOSNotification
                app="Baddia"
                title="🌙 La luna te dice algo"
                body="No bajes tu energía para encajar."
                time="5m"
              />
              <IOSNotification
                app="Baddia · Girls"
                title="Sofi compartió su glow 💖"
                body="Compatibilidad de hoy: 92%."
                time="12m"
              />
            </div>
          </PhoneCanvas>
        </Section>

        {/* ───── HOME SCREEN MOCKUP ───── */}
        </Section>

        {/* ───── LOCK SCREEN iOS 16+ ───── */}
        <Section emoji="🔓" label="Lock Screen · iOS 16+">
          <p className="text-[12px] text-baddia-ink/70 font-semibold leading-snug px-1 -mt-1">
            Widgets nuevos que viven arriba y debajo de tu hora. Todo se actualiza con tu lectura del día.
          </p>

          <PhoneCanvas wallpaper="lock">
            {/* Inline widget — arriba del reloj */}
            <div className="pt-11 px-6">
              <div className="mx-auto w-fit max-w-full flex items-center gap-1.5 rounded-full bg-white/18 backdrop-blur-md border border-white/25 px-3 py-1 text-white text-[10.5px] font-display font-bold tracking-tight shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
                <span className="text-[11px] leading-none">✨</span>
                <span className="truncate">
                  Hoy: {vibe.color.name} · Nº {vibe.luckyNumber}
                </span>
              </div>
            </div>

            {/* Fecha + hora */}
            <div className="mt-1.5 text-center text-white px-4">
              <p className="font-semibold text-[11px] opacity-90 tracking-wide">jueves 16 de junio</p>
              <p className="font-display font-black text-[60px] leading-none mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] tracking-tight">
                09:24
              </p>
            </div>

            {/* Row de widgets bajo el reloj: circular + rectangular + circular */}
            <div className="px-5 mt-3 flex items-center justify-center gap-2">
              {/* Circular · glifo signo */}
              <div className="w-11 h-11 rounded-full bg-white/18 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                <span className="font-display font-black text-[20px] leading-none">{glyph}</span>
              </div>

              {/* Rectangular · mini frase */}
              <div className="flex-1 max-w-[180px] h-11 rounded-2xl bg-white/18 backdrop-blur-md border border-white/25 px-2.5 py-1 text-white shadow-[0_2px_8px_rgba(0,0,0,0.25)] flex flex-col justify-center min-w-0">
                <p className="text-[7px] font-display font-black uppercase tracking-widest opacity-80 leading-none">
                  ✦ baddia
                </p>
                <p className="font-display font-bold italic text-[10px] leading-tight mt-0.5 truncate">
                  "Deja que tu energía hable ✨"
                </p>
              </div>

              {/* Circular · glow score */}
              <div className="w-11 h-11 rounded-full bg-white/18 backdrop-blur-md border border-white/25 flex flex-col items-center justify-center text-white shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
                <span className="text-[6px] font-display font-black uppercase tracking-widest opacity-80 leading-none">Glow</span>
                <span className="font-display font-black text-[13px] leading-none mt-0.5">{vibe.glowScore}</span>
              </div>
            </div>

            {/* Ritual card estilo Live Activity */}
            <div className="absolute bottom-14 left-3 right-3">
              <div className="rounded-2xl bg-white/92 backdrop-blur-xl px-3 py-2.5 shadow-[0_6px_18px_rgba(0,0,0,0.25)]">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-4 h-4 rounded-md bg-gradient-hot flex items-center justify-center text-[8px] shrink-0">
                      <Wand2 size={9} className="text-white" strokeWidth={3} />
                    </div>
                    <p className="text-[8px] font-display font-black text-baddia-ink uppercase tracking-wider truncate">
                      Baddia · Ritual de hoy
                    </p>
                  </div>
                  <p className="text-[8px] text-baddia-ink/55 font-semibold shrink-0">ahora</p>
                </div>
                <div className="flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display font-black text-[11px] text-baddia-ink leading-tight">
                      Tu manifestación te espera ✨
                    </p>
                    <p className="text-[9px] text-baddia-ink/65 font-semibold leading-snug mt-0.5">
                      3 min · no rompas tu racha
                    </p>
                  </div>
                  <button className="shrink-0 rounded-full bg-baddia-ink text-white text-[9px] font-display font-black uppercase tracking-wider px-2.5 py-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.2)]">
                    Manifestar
                  </button>
                </div>
              </div>
            </div>
          </PhoneCanvas>

          {/* Leyenda de los 4 widgets */}
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <LockLegend chip="Inline" title="Vibe del día" desc="Color energético + número de la suerte." />
            <LockLegend chip="Circular" title="Tu signo" desc="Glifo grande, listo a un vistazo." />
            <LockLegend chip="Rectangular" title="Mini frase" desc="Un mantra corto arriba de tus apps." />
            <LockLegend chip="Live Activity" title="Ritual hoy" desc='Botón "Manifestar" en el lock.' />
          </div>
        </Section>

        {/* ───── HIDE ORIGINAL DUPLICATE ───── */}
        <div className="hidden">
          {/* placeholder to preserve indent for next section */}
        </div>
        {/* fallthrough */}
        <Section emoji="📱" label="Home screen">

          <PhoneCanvas wallpaper="home">
            <div className="pt-12 px-3 grid grid-cols-4 gap-2">
              {/* Large widget — Frase del día (2x2) */}
              <WidgetLarge>
                <div className="h-full flex flex-col justify-between min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[8px] font-display font-black uppercase tracking-wider text-baddia-hot">
                      💬 Frase
                    </span>
                    <span className="text-baddia-yellow text-sm leading-none">✦</span>
                  </div>
                  <p className="font-display font-black text-[12px] leading-[1.15] text-baddia-ink break-words">
                    "Tu trabajo no es tu personalidad."
                  </p>
                  <p className="text-[7px] font-display font-bold uppercase tracking-[0.2em] text-baddia-ink/50">
                    baddia
                  </p>
                </div>
              </WidgetLarge>

              {/* Small — Glow ring */}
              <WidgetSmall bg="bg-gradient-to-br from-baddia-yellow to-baddia-hot text-baddia-ink">
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-[7px] font-display font-black uppercase tracking-widest opacity-80">
                    Glow
                  </p>
                  <p className="font-display font-black text-[24px] leading-none mt-0.5">87</p>
                  <p className="text-[7px] font-display font-bold mt-0.5 opacity-80">/100 ✨</p>
                </div>
              </WidgetSmall>

              {/* Small — Color */}
              <WidgetSmall bg="bg-white">
                <div className="h-full flex flex-col min-w-0">
                  <p className="text-[7px] font-display font-black uppercase tracking-widest text-baddia-ink/60 truncate">
                    🎨 Color
                  </p>
                  <div
                    className="flex-1 my-1 rounded-lg border border-baddia-ink/30"
                    style={{ background: "linear-gradient(135deg,#FFD6E0,#FF9BAF)" }}
                  />
                  <p className="font-display font-black text-[9px] text-baddia-ink leading-tight truncate">
                    Rosa cuarzo
                  </p>
                </div>
              </WidgetSmall>

              {/* Medium — Luna (2x1) */}
              <WidgetMedium bg="gradient-bg-baddia text-white">
                <div className="flex items-center gap-2 h-full min-w-0">
                  <div className="relative w-10 h-10 shrink-0">
                    <div className="absolute inset-0 rounded-full bg-baddia-yellow" />
                    <div className="absolute inset-0 rounded-full bg-baddia-ink/80" style={{ clipPath: "inset(0 0 0 50%)" }} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[7px] font-display font-black uppercase tracking-widest opacity-80 truncate">🌙 Luna</p>
                    <p className="font-display font-black text-[12px] leading-tight truncate">Creciente</p>
                    <p className="text-[8px] font-semibold opacity-85 leading-tight truncate">Día de manifestar</p>
                  </div>
                </div>
              </WidgetMedium>

              {/* Small — Lucky number */}
              <WidgetSmall bg="bg-baddia-lime text-baddia-ink">
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-[7px] font-display font-black uppercase tracking-widest">Lucky</p>
                  <p className="font-display font-black text-[28px] leading-none mt-0.5">7</p>
                  <p className="text-[8px] font-display font-bold mt-0.5">🍀</p>
                </div>
              </WidgetSmall>

              {/* Small — Horóscopo */}
              <WidgetSmall bg="bg-baddia-soft text-baddia-ink">
                <div className="h-full flex flex-col justify-between min-w-0">
                  <p className="text-[7px] font-display font-black uppercase tracking-widest opacity-70 truncate">♎ Libra</p>
                  <p className="font-display font-black text-[9.5px] leading-tight break-words">Día de equilibrio y amor propio.</p>
                  <p className="text-[7px] font-bold opacity-70">⭐⭐⭐⭐</p>
                </div>
              </WidgetSmall>

              {/* Medium — Crush Energy (2x1) */}
              <WidgetMedium bg="bg-white">
                <div className="flex items-center gap-2 h-full min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gradient-hot border-2 border-baddia-ink flex items-center justify-center text-lg shrink-0">
                    💘
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[7px] font-display font-black uppercase tracking-widest text-baddia-ink/60 truncate">
                      Crush Energy
                    </p>
                    <p className="font-display font-black text-[12px] text-baddia-ink leading-tight truncate">Magnética 92%</p>
                    <p className="text-[8px] font-semibold text-baddia-ink/65 leading-tight truncate">No persigas, atrae.</p>
                  </div>
                </div>
              </WidgetMedium>
            </div>

            {/* iOS Dock */}
            <div className="absolute bottom-3 left-3 right-3 rounded-3xl bg-white/25 backdrop-blur-xl border border-white/30 p-2 flex items-center justify-around">
              {[
                { emoji: "✨", color: "bg-gradient-hot" },
                { emoji: "💬", color: "bg-baddia-mint" },
                { emoji: "📷", color: "bg-baddia-ink" },
                { emoji: "🎵", color: "bg-baddia-bubble" },
              ].map((d, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-xl ${d.color} flex items-center justify-center text-base shadow-md`}
                >
                  {d.emoji}
                </div>
              ))}
            </div>
          </PhoneCanvas>
        </Section>

        {/* ───── MORE WIDGETS GALLERY ───── */}
        <Section emoji="🪄" label="Más widgets que puedes tener">
          <div className="grid grid-cols-2 gap-3">
            <WidgetIdea
              icon={<Sparkles size={16} />}
              chip="bg-baddia-yellow"
              title="Consejo del día"
              desc="Una frase amorosa que te recuerda quién eres."
            />
            <WidgetIdea
              icon={<Moon size={16} />}
              chip="bg-baddia-lavender text-white"
              title="Ciclo lunar"
              desc="Fase + ritual sugerido para hoy."
            />
            <WidgetIdea
              icon={<Star size={16} />}
              chip="bg-baddia-bubble text-white"
              title="Horóscopo express"
              desc="Tu signo y el mood del día en 1 línea."
            />
            <WidgetIdea
              icon={<Heart size={16} />}
              chip="bg-baddia-hot text-white"
              title="Crush Energy"
              desc="Qué tan magnética estás hoy."
            />
            <WidgetIdea
              icon={<Flame size={16} />}
              chip="bg-gradient-hot text-white"
              title="Aura Check"
              desc="Tu color de aura del momento."
            />
            <WidgetIdea
              icon={<Hand size={16} />}
              chip="bg-baddia-mint text-white"
              title="Palm reminder"
              desc="Re-escanea tu mano cada luna nueva."
            />
            <WidgetIdea
              icon={<Calendar size={16} />}
              chip="bg-baddia-lime"
              title="Mi semana mágica"
              desc="Días fuego, días calma, días manifest."
            />
            <WidgetIdea
              icon={<Music size={16} />}
              chip="bg-baddia-ink text-white"
              title="Soundtrack del día"
              desc="Canción para tu mood actual."
            />
            <WidgetIdea
              icon={<Bell size={16} />}
              chip="bg-baddia-soft"
              title="Recordatorio amor propio"
              desc="Pings suaves: agua, respira, brilla."
            />
            <WidgetIdea
              icon={<Lock size={16} />}
              chip="bg-baddia-gold"
              title="Pro · Reporte mensual"
              desc="Tu glow promedio + insights del mes."
            />
          </div>
        </Section>

        {/* ───── GIRLS WIDGETS ───── */}
        <Section emoji="👯‍♀️" label="Para Baddia Girls">
          <div className="rounded-3xl border-[2.5px] border-baddia-ink bg-gradient-to-br from-pink-100 via-baddia-soft to-baddia-bubble/40 p-4 shadow-[5px_6px_0_hsl(260_16%_15%)]">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-hot text-white px-3 py-1 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-1">
                <Users size={11} /> Girls
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <WidgetIdea
                icon={<Users size={16} />}
                chip="bg-baddia-hot text-white"
                title="Vibra del grupo"
                desc="Energía promedio de tus amigas hoy."
              />
              <WidgetIdea
                icon={<Heart size={16} />}
                chip="bg-baddia-bubble text-white"
                title="Compatibilidad ✨"
                desc="Match diario entre tú y tus amigas."
              />
              <WidgetIdea
                icon={<Sparkles size={16} />}
                chip="bg-baddia-yellow"
                title="Frase para enviar"
                desc="Cita lista para mandar al chat de amigas."
              />
              <WidgetIdea
                icon={<Moon size={16} />}
                chip="bg-baddia-lavender text-white"
                title="Luna compartida"
                desc="Ritual del mes para hacer juntas."
              />
            </div>
          </div>
        </Section>

        <p className="text-[11px] text-center text-baddia-ink/55 font-semibold px-6 pt-2 leading-relaxed">
          Estos widgets son mockups visuales 💖 los reales llegan con la app nativa.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────── helpers ─────────────────────── */

function Section({ emoji, label, children }: { emoji: string; label: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 pl-1">
        <span className="text-base">{emoji}</span>
        <p className="font-display font-black text-[12px] uppercase tracking-[0.15em] text-baddia-ink/70">
          {label}
        </p>
        <span className="h-[2px] flex-1 bg-baddia-ink/15 rounded-full" />
      </div>
      {children}
    </section>
  );
}

function PhoneCanvas({ children, wallpaper }: { children: React.ReactNode; wallpaper: "lock" | "home" }) {
  const bg =
    wallpaper === "lock"
      ? "linear-gradient(160deg, #2a1a4a 0%, #6b3a8a 40%, #c45a8a 80%, #ffb88a 100%)"
      : "linear-gradient(160deg, #ffd6e8 0%, #c9b6ff 50%, #ffd6e8 100%)";

  return (
    <div
      className="relative mx-auto rounded-[38px] overflow-hidden border-[3px] border-baddia-ink shadow-[6px_8px_0_hsl(260_16%_15%)]"
      style={{ background: bg, aspectRatio: "9/19", maxWidth: "340px" }}
    >
      {/* dynamic island */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-baddia-ink rounded-full z-10" />
      {/* status bar — split around dynamic island */}
      <div className="absolute top-3 left-0 right-0 px-6 flex items-center justify-between text-white text-[11px] font-bold z-20 pointer-events-none">
        <span className="tracking-tight">9:24</span>
        <span className="flex items-center gap-1.5 opacity-90 text-[10px]">
          <span>5G</span>
          <span>▮▮▮</span>
        </span>
      </div>
      {children}
    </div>
  );
}

function LockChip({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 px-2 py-1.5 text-white text-center">
      <p className="text-[13px] leading-none">{icon}</p>
      <p className="text-[7.5px] font-display font-black uppercase tracking-wider opacity-80 mt-0.5 truncate">{label}</p>
      <p className="font-display font-black text-[10px] leading-tight truncate">{value}</p>
    </div>
  );
}

function IOSNotification({ app, title, body, time }: { app: string; title: string; body: string; time: string }) {
  return (
    <div className="rounded-2xl bg-white/90 backdrop-blur-xl px-2.5 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] min-w-0">
      <div className="flex items-center justify-between gap-2 mb-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-3.5 h-3.5 rounded-md bg-gradient-hot flex items-center justify-center text-[7px] shrink-0">✨</div>
          <p className="text-[8px] font-bold text-baddia-ink uppercase tracking-wide truncate">{app}</p>
        </div>
        <p className="text-[8px] text-baddia-ink/60 font-semibold shrink-0">{time}</p>
      </div>
      <p className="font-display font-black text-[10px] text-baddia-ink leading-tight truncate">{title}</p>
      <p className="text-[9px] text-baddia-ink/70 font-medium leading-snug mt-0.5 line-clamp-2">{body}</p>
    </div>
  );
}

function WidgetLarge({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-2 row-span-2 aspect-square rounded-[20px] bg-white p-3 shadow-[0_4px_10px_rgba(0,0,0,0.18)]">
      {children}
    </div>
  );
}

function WidgetMedium({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <div className={`col-span-2 rounded-[20px] ${bg} p-3 shadow-[0_4px_10px_rgba(0,0,0,0.18)]`} style={{ aspectRatio: "2/1" }}>
      {children}
    </div>
  );
}

function WidgetSmall({ children, bg }: { children: React.ReactNode; bg: string }) {
  return (
    <div className={`aspect-square rounded-[18px] ${bg} p-2.5 shadow-[0_4px_10px_rgba(0,0,0,0.18)]`}>
      {children}
    </div>
  );
}

function WidgetIdea({
  icon, chip, title, desc,
}: { icon: React.ReactNode; chip: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-white border-[2.5px] border-baddia-ink p-3 shadow-[3px_4px_0_hsl(260_16%_15%)]">
      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-xl border-2 border-baddia-ink ${chip} shadow-[2px_2px_0_hsl(260_16%_15%)] mb-2`}>
        {icon}
      </span>
      <p className="font-display font-black text-[13px] text-baddia-ink leading-tight">{title}</p>
      <p className="text-[10.5px] font-semibold text-baddia-ink/65 leading-snug mt-1">{desc}</p>
    </div>
  );
}
