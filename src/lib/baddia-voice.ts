import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

/** Cache TTS mp3 blobs by text so we don't re-generate the same guide phrase. */
const cache = new Map<string, Promise<string>>();

async function fetchAudioUrl(text: string): Promise<string> {
  const cached = cache.get(text);
  if (cached) return cached;
  const p = (async () => {
    const { data, error } = await supabase.functions.invoke("manifest-tts", {
      body: { text },
    });
    if (error) throw error;
    // supabase-js decodes body based on content-type. For audio/mpeg it returns a Blob.
    const blob =
      data instanceof Blob
        ? data
        : data instanceof ArrayBuffer
          ? new Blob([data], { type: "audio/mpeg" })
          : null;
    if (!blob) throw new Error("Invalid TTS payload");
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
