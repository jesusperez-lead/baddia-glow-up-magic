## Manifestemos Juntas — Módulo guiado por audio

### Alcance
Refactor del módulo Manifest para agregar una experiencia diaria guiada por voz de Baddia, con contador, racha, historial y bottom sheet inteligente de recordatorio. Se mantiene lo bueno que ya tenemos (racha, categorías, celebración, share) y se reemplaza el flujo actual "escribir → crear → ritual" por el flujo pedido.

### Flujo (5 pantallas dentro del módulo)

1. **Home** ("Manifestemos juntas ✨")
   - Card con **frase del día** (rotativa por fecha del listado existente `AFFIRMATIONS` + `INTENTIONS`).
   - Aura animada (glow rosa/lila pulsando) detrás de la card.
   - Racha actual con mensaje motivacional según los `MILESTONES` existentes.
   - CTA principal: "Empezar manifestación".
   - Secundario: "Cambiar frase" (Pro; free ve candado y `openPaywall`).
   - Toggle audio 🔊/🔇 (persistido en localStorage).

2. **Guía inicial** (audio + texto sincronizado)
   - Texto que se va revelando línea a línea mientras habla Baddia:
     "Vamos a manifestar hoy. Respira profundo… Suelta un poquito la tensión… y repite conmigo esta frase: [frase]."
   - Al terminar audio → transición a contador.
   - Si audio falla o está muteado → mismo texto con auto-avance por tiempo.

3. **Contador** (30s por defecto; chips 30s / 1min / 3min)
   - Número gigante al centro + círculo de progreso SVG con glow.
   - Fondo con degradado que "respira" (scale/opacity).
   - Sparkles flotando alrededor.
   - Botones: Pausar / Cancelar / 🔊 audio.
   - Texto: "Repite tu frase en tu mente…".

4. **Celebración**
   - Confetti sutil + corazón brillante + check.
   - "Manifestación completada ✨" · "Volviste a elegirte hoy."
   - Muestra nueva racha y milestone si aplica.
   - Audio final: "Ya terminamos por hoy. Lo hiciste muy bien…".
   - Botón "Compartir" (usa el share existente) + "Volver".
   - Al aparecer, dispara la lógica de recordatorio (paso 5).

5. **Bottom sheet de recordatorio** (`showModalBottomSheet` style)
   - Solo si NO hay `reminder_time` guardado.
   - Título "¿Quieres manifestar mañana conmigo?" + texto.
   - Botones: "Sí, mañana a esta hora" · "Elegir otra hora" · "Ahora no".
   - "Elegir otra hora" abre el `TimePickerSheet` que ya existe en el proyecto.
   - Si ya hay recordatorio → banner sutil: "Te recordaremos mañana a las HH:MM ✨".

### Audio (TTS por Lovable AI)
- Edge function `manifest-tts`: recibe `{ text, voice? }`, llama a `openai/gpt-4o-mini-tts` con `stream_format:"sse"` y `response_format:"mp3"`. Devuelve MP3 stream directamente (no PCM porque el flujo es simple: play, esperar, avanzar — mp3 al `<audio>` es más robusto).
- Cliente: hook `useBaddiaVoice()` → `speak(text): Promise<void>` que resuelve al terminar `onended`. Cache en memoria por `text` para no re-pedir la misma frase.
- Preferencia audio persistida en `baddia.manifest.audio` (ya existe).
- Voz: `alloy` con `instructions: "Habla en español, cálida, suave y cercana, como amiga que abraza — pausas cortas después de cada frase."`.
- Fallback: si edge function falla → seguir flujo con timings de texto (2.5s por línea).

### Persistencia (localStorage, sigue arquitectura existente)
Clave `baddia.manifest.v1` extendida:
```
{
  category, intention, createdAt,
  daysCompleted: string[],        // YYYY-MM-DD, dedupe por día
  audio_enabled: boolean,
  reminder_time: "HH:MM" | null,
  reminder_enabled: boolean,
  last_phrase_id: string,
  history: [{ phrase, completed_at, duration_seconds, streak_after }]
}
```
- Racha: `daysCompleted.length`. No se duplica si ya completó hoy.
- Historial capado a últimas 60 entradas.

### Recordatorio / notificaciones
- Web Notifications API (mismo patrón que ya usa `Notifications.tsx`).
- Al confirmar "Sí, mañana a esta hora" → guarda `reminder_time` = hora actual; si `Notification.permission !== 'granted'` → `Notification.requestPermission()`.
- Si permiso denegado → bottom sheet secundario: "No pudimos activar el recordatorio…" con "Ir a ajustes" (abre pantalla Notifications) / "Ahora no".
- Un `setTimeout` global (montado en Home del módulo) programa la próxima notificación local para la hora guardada; el título/mensaje viene del copy pedido y al click navega a Manifest.
- Para "elegir otra hora" se reusa `TimePickerSheet` existente.

### Animaciones (todo CSS + keyframes ligeros, sin librerías nuevas)
- Aura pulse (ya tenemos `animate-breathe`).
- Sparkle spin + float (ya existen).
- Confetti: 24 span emojis cayendo (reusar patrón de `GlitterWelcome`).
- Círculo de progreso: SVG con `stroke-dashoffset` interpolado por `requestAnimationFrame`.
- Fondo respirando: gradiente con `background-position` en loop de 8s.
- Micro-interacción al guardar recordatorio: card haciendo `scale(1)→1.04→1` + ✨ pop.

### Estados manejados
`idle | guiding | countdown-running | countdown-paused | completed | reminder-asking | reminder-saved | permission-denied | audio-loading | audio-error`

### Archivos
- **Editado**: `src/components/baddia/screens/Manifest.tsx` — reescrito el flujo principal manteniendo `AFFIRMATIONS`, categorías, milestones, share sheet.
- **Nuevo**: `src/lib/baddia-voice.ts` — hook `useBaddiaVoice` (TTS + cache + mute).
- **Nuevo**: `src/components/baddia/manifest/` — `GuideStep.tsx`, `CountdownStep.tsx`, `CelebrationStep.tsx`, `ReminderSheet.tsx`.
- **Nuevo**: `supabase/functions/manifest-tts/index.ts` — edge function TTS.
- **Config**: agregar `manifest-tts` a `supabase/config.toml` con `verify_jwt = false` (público como los otros edge functions del proyecto).

### Fuera de alcance (por ahora)
- Sync remoto a base de datos (queda en localStorage como el resto del módulo).
- Notificaciones push nativas (solo Web Notification API en foreground/background del navegador).
- Configuración de duraciones custom más allá de 30s / 1min / 3min.

¿Le doy build tal cual, o cambiamos algo antes (por ejemplo dejar 30s fija sin chips, o saltar la edge function y usar la Web Speech API del navegador para TTS gratis pero con voz robótica)?