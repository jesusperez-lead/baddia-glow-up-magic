import { useBaddia } from "@/lib/baddia-state";
import { ArrowLeft, Star, Download, Share2, ChevronRight } from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   PLAY STORE MOCKUPS
   Pantalla que muestra cómo se vería Baddia en la Play Store:
   - Cabecera tipo ficha de app (icono, rating, descargas)
   - Carrusel horizontal de 6 screenshots promo (formato 9:19.5)
   - Cada screenshot: headline marketing + mockup de pantalla
   Pensado para "las girls": copy juguetón, colores vivos, glow.
   ────────────────────────────────────────────────────────────── */

export function PlayStore() {
  const { go } = useBaddia();

  return (
    <div className="relative min-h-full bg-gradient-pearl pb-12">
      {/* AppBar */}
      <header className="sticky top-0 z-20 bg-white/85 backdrop-blur-md border-b-2 border-baddia-ink/10 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => go("profile")}
          className="w-9 h-9 rounded-full bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)]"
          aria-label="Volver"
        >
          <ArrowLeft size={16} className="text-baddia-ink" />
        </button>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.18em] font-display font-bold text-baddia-ink/60">
            Baddia
          </p>
          <h1 className="font-display font-black text-[18px] text-baddia-ink leading-tight truncate">
            Mockups Play Store ✨
          </h1>
        </div>
      </header>

      <div className="px-4 pt-5 space-y-6">
        {/* ───── Ficha estilo Play Store ───── */}
        <section className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-4 shadow-[5px_6px_0_hsl(260_16%_15%)]">
          <div className="flex items-center gap-3">
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-gradient-baddia border-2 border-baddia-ink flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)] relative">
              <span className="font-display font-black text-white text-[32px] leading-none">B</span>
              <span className="absolute -top-1 -right-1 text-baddia-yellow text-base drop-shadow-[0_0_6px_rgba(247,215,116,0.9)]">✦</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-black text-[17px] text-baddia-ink leading-tight truncate">
                Baddia · Tu glow diario
              </p>
              <p className="text-[11px] font-semibold text-baddia-ink/60 mt-0.5 truncate">
                Baddia Studio · Estilo de vida
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] font-display font-bold text-baddia-ink/80">
                <span className="inline-flex items-center gap-0.5">
                  4.9 <Star size={11} className="fill-baddia-ink text-baddia-ink" />
                </span>
                <span className="opacity-50">·</span>
                <span>+100k</span>
                <span className="opacity-50">·</span>
                <span className="inline-flex items-center gap-0.5 rounded-md bg-baddia-soft border border-baddia-ink/30 px-1.5 py-0.5 text-[9px]">
                  12+
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-2 mt-4">
            <button className="rounded-full bg-baddia-ink text-white font-display font-black text-[13px] py-2.5 inline-flex items-center justify-center gap-1.5 shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all">
              <Download size={14} /> Instalar
            </button>
            <button className="w-11 rounded-full bg-white border-2 border-baddia-ink flex items-center justify-center shadow-[3px_3px_0_hsl(260_16%_15%)]" aria-label="Compartir">
              <Share2 size={14} className="text-baddia-ink" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <Stat top="4.9★" bottom="120k reseñas" />
            <Stat top="100k+" bottom="Descargas" />
            <Stat top="Top 10" bottom="Estilo de vida" />
          </div>
        </section>

        {/* ───── Carrusel de screenshots promo ───── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between pl-1 pr-2">
            <p className="font-display font-black text-[12px] uppercase tracking-[0.15em] text-baddia-ink/70">
              ✨ Vista previa
            </p>
            <span className="text-[10px] font-display font-bold text-baddia-ink/50 inline-flex items-center gap-0.5">
              desliza <ChevronRight size={11} />
            </span>
          </div>

          <div className="-mx-4 overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 px-4 pb-2 snap-x snap-mandatory">
              <PromoCard
                idx={1}
                headline="Tu lectura diaria"
                sub="hecha para ti ✨"
                gradient="linear-gradient(160deg, #ffd6e8 0%, #c9b6ff 100%)"
                chipBg="bg-baddia-hot text-white"
                chipText="✨ Daily"
              >
                <MockDaily />
              </PromoCard>

              <PromoCard
                idx={2}
                headline="Crush Energy 💘"
                sub="¿qué tan magnética estás hoy?"
                gradient="linear-gradient(160deg, #ff9bc4 0%, #ff6b9d 100%)"
                chipBg="bg-baddia-bubble text-white"
                chipText="💘 Love"
              >
                <MockLove />
              </PromoCard>

              <PromoCard
                idx={3}
                headline="Lectura de mano"
                sub="con IA ✋ en 1 foto"
                gradient="linear-gradient(160deg, #fff3a0 0%, #ffb88a 100%)"
                chipBg="bg-baddia-yellow text-baddia-ink"
                chipText="✋ Palm"
              >
                <MockPalm />
              </PromoCard>

              <PromoCard
                idx={4}
                headline="Tu aura del día"
                sub="color, vibra y mensaje 💫"
                gradient="linear-gradient(160deg, #c9b6ff 0%, #8b5cf6 100%)"
                chipBg="bg-baddia-lavender text-white"
                chipText="🌈 Aura"
              >
                <MockAura />
              </PromoCard>

              <PromoCard
                idx={5}
                headline="Compatibilidad"
                sub="tú + tu crush = ¿match?"
                gradient="linear-gradient(160deg, #ffb6c8 0%, #ff6b9d 60%, #c45a8a 100%)"
                chipBg="bg-baddia-hot text-white"
                chipText="✨ Compat"
              >
                <MockCompat />
              </PromoCard>

              <PromoCard
                idx={6}
                headline="Widgets cuquis"
                sub="lleva tu glow al home ✨"
                gradient="linear-gradient(160deg, #b8f5d0 0%, #5cd9a8 100%)"
                chipBg="bg-baddia-mint text-baddia-ink"
                chipText="📱 Widgets"
              >
                <MockWidgets />
              </PromoCard>
            </div>
          </div>
        </div>

        {/* ───── Descripción tipo Play Store ───── */}
        <section className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 shadow-[5px_6px_0_hsl(260_16%_15%)]">
          <p className="font-display font-black text-[15px] text-baddia-ink leading-tight">
            Acerca de Baddia
          </p>
          <p className="text-[13px] font-medium text-baddia-ink/75 leading-snug mt-2">
            Tu app diaria de amor propio, glow y energía cósmica. Lecturas, horóscopo,
            lectura de mano con IA, compatibilidad y aura — todo en un solo lugar, hecho
            para ti, bestie 💖
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {["#lecturadiaria","#tarot","#horóscopo","#aurareading","#girls","#amorpropio"].map(t => (
              <span key={t} className="rounded-full bg-baddia-soft border border-baddia-ink/20 px-2 py-1 text-[10px] font-display font-bold text-baddia-ink/70">
                {t}
              </span>
            ))}
          </div>
        </section>

        <p className="text-[11px] text-center text-baddia-ink/55 font-semibold px-6 pt-1 leading-relaxed">
          Estos mockups son una vista previa visual 💖 ideales para Play Store y redes.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────── helpers ─────────────────── */

function Stat({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div className="rounded-2xl bg-baddia-soft/60 border border-baddia-ink/10 py-2">
      <p className="font-display font-black text-baddia-ink text-[14px] leading-none">{top}</p>
      <p className="text-[9px] font-display font-bold uppercase tracking-wider text-baddia-ink/55 mt-1">{bottom}</p>
    </div>
  );
}

function PromoCard({
  idx, headline, sub, gradient, chipBg, chipText, children,
}: {
  idx: number; headline: string; sub: string; gradient: string;
  chipBg: string; chipText: string; children: React.ReactNode;
}) {
  return (
    <div
      className="snap-center shrink-0 w-[230px] rounded-[28px] border-[2.5px] border-baddia-ink shadow-[6px_8px_0_hsl(260_16%_15%)] overflow-hidden flex flex-col"
      style={{ background: gradient, aspectRatio: "9/19.5" }}
    >
      {/* Headline marketing */}
      <div className="pt-5 px-4 text-center">
        <span className={`inline-flex items-center gap-1 rounded-full ${chipBg} border-2 border-baddia-ink px-2.5 py-0.5 text-[9px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2 mb-2`}>
          {chipText}
        </span>
        <p className="font-display font-black text-baddia-ink text-[18px] leading-[1.05] drop-shadow-[0_2px_0_rgba(255,255,255,0.5)]">
          {headline}
        </p>
        <p className="text-[10.5px] font-display font-bold text-baddia-ink/75 mt-1 leading-tight">
          {sub}
        </p>
      </div>

      {/* Mockup */}
      <div className="flex-1 mt-3 mx-3 mb-3 rounded-[22px] bg-white border-[2px] border-baddia-ink overflow-hidden shadow-[3px_4px_0_rgba(0,0,0,0.25)]">
        {/* Notch */}
        <div className="relative h-3 bg-white flex items-center justify-center">
          <div className="w-10 h-2 bg-baddia-ink rounded-full" />
        </div>
        <div className="h-[calc(100%-12px)] overflow-hidden">{children}</div>
      </div>

      {/* Footer "page x of 6" */}
      <div className="pb-2 text-center">
        <span className="text-[8px] font-display font-black uppercase tracking-[0.25em] text-baddia-ink/50">
          {idx} / 6
        </span>
      </div>
    </div>
  );
}

/* ─────────────────── MOCKUPS por feature ─────────────────── */

function MockDaily() {
  return (
    <div className="h-full p-2.5 bg-gradient-to-b from-baddia-soft/40 to-white">
      <p className="text-[7px] font-display font-black uppercase tracking-widest text-baddia-ink/50">
        ✨ hoy · jue 19
      </p>
      <p className="font-display font-black text-baddia-ink text-[11px] leading-tight mt-1">
        Hola, Sofi ✨
      </p>
      <div className="mt-1.5 rounded-xl bg-gradient-baddia text-white p-2 shadow-[2px_2px_0_hsl(260_16%_15%)]">
        <p className="text-[7px] font-display font-black uppercase tracking-wider opacity-80">glow score</p>
        <p className="font-display font-black text-[20px] leading-none mt-0.5">87</p>
      </div>
      <div className="mt-1.5 rounded-xl bg-white border border-baddia-ink/20 p-2">
        <p className="text-[7px] font-display font-black uppercase tracking-wider text-baddia-hot">frase</p>
        <p className="font-display font-black text-baddia-ink text-[8.5px] leading-tight mt-0.5">
          "No bajes tu energía para encajar."
        </p>
      </div>
      <div className="grid grid-cols-2 gap-1 mt-1.5">
        <MiniChip bg="bg-baddia-yellow" label="🍀 #7" />
        <MiniChip bg="bg-baddia-bubble text-white" label="🎨 rosa" />
        <MiniChip bg="bg-baddia-mint" label="🌙 crec." />
        <MiniChip bg="bg-baddia-lavender text-white" label="♎ libra" />
      </div>
    </div>
  );
}

function MockLove() {
  return (
    <div className="h-full p-2.5 bg-gradient-to-b from-pink-50 to-white text-center">
      <p className="text-[7px] font-display font-black uppercase tracking-widest text-baddia-hot">crush energy</p>
      <div className="mt-2 mx-auto w-14 h-14 rounded-full border-[3px] border-baddia-ink bg-gradient-hot flex items-center justify-center shadow-[2px_2px_0_hsl(260_16%_15%)]">
        <span className="text-2xl">💘</span>
      </div>
      <p className="font-display font-black text-baddia-ink text-[18px] leading-none mt-2">92%</p>
      <p className="text-[8px] font-display font-bold text-baddia-ink/70 mt-0.5">magnética 🔥</p>
      <div className="mt-2 rounded-xl bg-white border border-baddia-ink/20 p-1.5 text-left">
        <p className="text-[8px] font-display font-bold text-baddia-ink leading-tight">
          Hoy no persigas — atrae. Tu vibra habla antes que tú ✨
        </p>
      </div>
      <button className="mt-2 w-full rounded-full bg-baddia-ink text-white text-[8px] font-display font-black py-1.5">
        Ver lectura completa
      </button>
    </div>
  );
}

function MockPalm() {
  return (
    <div className="h-full p-2.5 bg-gradient-to-b from-baddia-yellow/30 to-white">
      <p className="text-[7px] font-display font-black uppercase tracking-widest text-baddia-ink/50">
        ✋ lectura de mano
      </p>
      <div className="mt-1.5 mx-auto w-16 h-20 rounded-xl border-2 border-dashed border-baddia-ink/50 bg-baddia-soft/40 flex items-center justify-center">
        <span className="text-3xl">🖐️</span>
      </div>
      <div className="mt-2 space-y-1">
        <PalmLine color="bg-baddia-hot" label="línea de la vida" v="larga" />
        <PalmLine color="bg-baddia-bubble" label="línea del corazón" v="profunda" />
        <PalmLine color="bg-baddia-lavender" label="línea de la cabeza" v="curva" />
      </div>
      <p className="text-[8px] font-display font-bold text-baddia-ink/70 mt-2 leading-tight text-center">
        "Tu mano dice: intuición altísima esta semana 💫"
      </p>
    </div>
  );
}

function MockAura() {
  return (
    <div className="h-full p-2.5 bg-gradient-to-b from-purple-100 to-white text-center">
      <p className="text-[7px] font-display font-black uppercase tracking-widest text-baddia-lavender">tu aura hoy</p>
      <div className="relative mt-2 mx-auto w-16 h-16">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-baddia-lavender via-baddia-bubble to-baddia-hot blur-md opacity-80" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-baddia-lavender to-baddia-bubble border-2 border-white shadow-[0_0_12px_rgba(155,114,207,0.6)]" />
      </div>
      <p className="font-display font-black text-baddia-ink text-[14px] mt-2 leading-none">Violeta</p>
      <p className="text-[8px] font-display font-bold text-baddia-ink/70 mt-0.5">creativa · intuitiva</p>
      <div className="mt-2 rounded-xl bg-baddia-lavender/15 border border-baddia-ink/20 p-1.5 text-left">
        <p className="text-[8px] font-display font-bold text-baddia-ink leading-tight">
          ✨ Día para crear, escribir o soñar despierta.
        </p>
      </div>
    </div>
  );
}

function MockCompat() {
  return (
    <div className="h-full p-2.5 bg-gradient-to-b from-pink-50 to-white">
      <p className="text-[7px] font-display font-black uppercase tracking-widest text-baddia-hot text-center">
        compatibilidad
      </p>
      <div className="mt-2 flex items-center justify-center gap-1.5">
        <div className="w-10 h-10 rounded-full bg-baddia-bubble border-2 border-baddia-ink flex items-center justify-center font-display font-black text-white text-sm">S</div>
        <span className="text-baddia-hot text-lg">💞</span>
        <div className="w-10 h-10 rounded-full bg-baddia-lavender border-2 border-baddia-ink flex items-center justify-center font-display font-black text-white text-sm">M</div>
      </div>
      <p className="text-center font-display font-black text-baddia-ink text-[22px] mt-1 leading-none">88%</p>
      <p className="text-[8px] text-center font-display font-bold text-baddia-ink/70">match cósmico</p>
      <div className="mt-2 space-y-1">
        <Bar label="Energía" v={92} />
        <Bar label="Comunicación" v={78} />
        <Bar label="Pasión" v={95} />
      </div>
    </div>
  );
}

function MockWidgets() {
  return (
    <div
      className="h-full p-2"
      style={{ background: "linear-gradient(160deg,#ffd6e8 0%,#c9b6ff 100%)" }}
    >
      <div className="grid grid-cols-2 gap-1.5">
        <div className="aspect-square rounded-lg bg-white p-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
          <p className="text-[6px] font-display font-black uppercase text-baddia-ink/60">glow</p>
          <p className="font-display font-black text-baddia-ink text-[16px] leading-none mt-1">87</p>
          <p className="text-[6px] font-display font-bold text-baddia-ink/50 mt-0.5">/100 ✨</p>
        </div>
        <div className="aspect-square rounded-lg bg-gradient-baddia text-white p-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
          <p className="text-[6px] font-display font-black uppercase opacity-80">luna</p>
          <p className="font-display font-black text-[10px] leading-tight mt-1">Crec.</p>
          <p className="text-[6px] font-bold opacity-80">manifest ✨</p>
        </div>
        <div className="aspect-square rounded-lg bg-baddia-yellow p-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
          <p className="text-[6px] font-display font-black uppercase text-baddia-ink/60">lucky</p>
          <p className="font-display font-black text-baddia-ink text-[16px] leading-none mt-1">7</p>
          <p className="text-[6px] font-bold text-baddia-ink/60">🍀</p>
        </div>
        <div className="aspect-square rounded-lg bg-white p-1.5 shadow-[0_2px_4px_rgba(0,0,0,0.15)]">
          <p className="text-[6px] font-display font-black uppercase text-baddia-ink/60">♎ libra</p>
          <p className="font-display font-black text-baddia-ink text-[7px] leading-tight mt-1">Día de equilibrio.</p>
          <p className="text-[6px] text-baddia-ink/50">⭐⭐⭐⭐</p>
        </div>
      </div>
      <div className="mt-1.5 rounded-lg bg-white/40 backdrop-blur-md border border-white/40 p-1 flex justify-around">
        {["✨","💬","📷","🎵"].map((e,i)=>(
          <div key={i} className="w-4 h-4 rounded-md bg-white/60 flex items-center justify-center text-[8px]">{e}</div>
        ))}
      </div>
    </div>
  );
}

function MiniChip({ bg, label }: { bg: string; label: string }) {
  return (
    <div className={`rounded-md ${bg} border border-baddia-ink/30 px-1.5 py-1 text-[7px] font-display font-black text-baddia-ink text-center leading-none`}>
      {label}
    </div>
  );
}

function PalmLine({ color, label, v }: { color: string; label: string; v: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color} border border-baddia-ink/40 shrink-0`} />
      <p className="text-[7px] font-display font-bold text-baddia-ink/75 flex-1 truncate">{label}</p>
      <p className="text-[7px] font-display font-black text-baddia-ink">{v}</p>
    </div>
  );
}

function Bar({ label, v }: { label: string; v: number }) {
  return (
    <div>
      <div className="flex justify-between text-[7px] font-display font-bold text-baddia-ink/70">
        <span>{label}</span><span>{v}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-baddia-soft border border-baddia-ink/20 overflow-hidden mt-0.5">
        <div className="h-full bg-gradient-hot" style={{ width: `${v}%` }} />
      </div>
    </div>
  );
}
