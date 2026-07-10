import { useCallback, useEffect, useRef } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
const TTS_URL = `${SUPABASE_URL}/functions/v1/manifest-tts`;

/** Cache TTS mp3 object URLs by text so we don't re-generate the same guide phrase. */
const cache = new Map<string, Promise<string>>();

async function fetchAudioUrl(text: string): Promise<string> {
  const cached = cache.get(text);
  if (cached) return cached;
  const p = (async () => {
    const res = await fetch(TTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(`TTS ${res.status}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  })();
  cache.set(text, p);
  p.catch(() => cache.delete(text));
  return p;
}

export function useBaddiaVoice() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.src = "";
    }
    audioRef.current = null;
  }, []);

  useEffect(() => stop, [stop]);

  const speak = useCallback(
    (text: string) =>
      new Promise<void>(async (resolve) => {
        stop();
        try {
          const url = await fetchAudioUrl(text);
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => resolve();
          audio.onerror = () => resolve();
          await audio.play().catch(() => resolve());
        } catch {
          // fallback timing: approximate speaking rate ~13 chars/sec
          const ms = Math.min(Math.max(text.length * 70, 1200), 12000);
          setTimeout(() => resolve(), ms);
        }
      }),
    [stop]
  );

  return { speak, stop };
}
