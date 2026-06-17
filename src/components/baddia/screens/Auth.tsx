import { useEffect, useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Sparkles } from "../PhoneFrame";
import { Logo } from "../Logo";

export function Auth() {
  const { go, user, setUser } = useBaddia();
  const [loading, setLoading] = useState<"google" | "apple" | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Si ya hay sesión, avanza directo
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) go("first-reading");
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const displayName =
          (session.user.user_metadata as any)?.full_name?.split(" ")[0] ||
          (session.user.user_metadata as any)?.name?.split(" ")[0] ||
          user.name;
        setUser({ name: displayName });
        go("first-reading");
      }
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOAuth = async (provider: "google" | "apple") => {
    setError(null);
    setLoading(provider);
    const result = await lovable.auth.signInWithOAuth(provider, {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("No pudimos conectar. Intenta de nuevo ✨");
      setLoading(null);
    }
  };

  return (
    <div className="relative min-h-full flex flex-col overflow-hidden bg-baddia-pearl">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/55" />
      <div className="blob bottom-10 -right-20 w-72 h-72 bg-baddia-soft/60" style={{ animationDelay: "4s" }} />
      <div className="blob bottom-40 left-10 w-48 h-48 bg-baddia-yellow/45" style={{ animationDelay: "8s" }} />
      <Sparkles />

      <div className="relative z-10 flex-1 px-6 pt-12 flex flex-col items-center">
        <div className="relative animate-pop-in">
          <div className="absolute inset-0 rounded-[40%] bg-gradient-glow blur-2xl opacity-70" />
          <div className="relative"><Logo size={72} /></div>
        </div>

        <div className="mt-6 text-center animate-slide-up">
          <div className="inline-block bg-baddia-yellow border-2 border-baddia-ink rounded-full px-3 py-1 text-[11px] font-display font-black italic text-baddia-ink shadow-[2px_2px_0_hsl(260_16%_15%)]">
            ✨ Casi listo
          </div>
          <h1 className="mt-4 font-display font-bold text-[30px] leading-[1.05] text-baddia-ink">
            Guarda tu <span className="gradient-text">glow</span><br />
            para siempre 💖
          </h1>
          <p className="mt-3 text-baddia-ink/70 text-[14px] font-semibold max-w-[280px] mx-auto">
            Inicia sesión para guardar tus lecturas, frases favoritas y desbloquear Baddia Pro.
          </p>
        </div>
      </div>

      <div className="relative z-10 px-6 pb-8 space-y-3 animate-slide-up" style={{ animationDelay: "0.2s" }}>
        {error && (
          <div className="text-center text-[12px] font-bold text-baddia-hot bg-white border-2 border-baddia-hot rounded-2xl py-2 px-3">
            {error}
          </div>
        )}

        <button
          onClick={() => handleOAuth("google")}
          disabled={loading !== null}
          className="btn-sticker w-full py-[16px] rounded-full bg-white text-baddia-ink flex items-center justify-center gap-3 disabled:opacity-60"
        >
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          {loading === "google" ? "Conectando..." : "Continuar con Google"}
        </button>

        <button
          onClick={() => handleOAuth("apple")}
          disabled={loading !== null}
          className="btn-sticker w-full py-[16px] rounded-full bg-baddia-ink text-white flex items-center justify-center gap-3 disabled:opacity-60"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
          {loading === "apple" ? "Conectando..." : "Continuar con Apple"}
        </button>


        <p className="text-[10px] text-center text-baddia-ink/50 pt-1 leading-relaxed px-6">
          Al continuar aceptas los términos y la política de privacidad de Baddia ✨
        </p>
      </div>
    </div>
  );
}
