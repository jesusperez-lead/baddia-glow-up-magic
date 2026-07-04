import { useEffect, useMemo, useRef, useState } from "react";
import { useBaddia } from "@/lib/baddia-state";
import { Sparkles as SparklesDeco } from "../PhoneFrame";
import { ArrowLeft, Phone, Shield, Check, RotateCcw, Lock } from "lucide-react";
import { toast } from "sonner";

type Step = "enter" | "code" | "success";

const CODE_LEN = 6;
const RESEND_SECS = 30;

export function PhoneVerify() {
  const { user, setUser, go } = useBaddia();
  const [step, setStep] = useState<Step>(user.phoneVerified ? "success" : "enter");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [country, setCountry] = useState("+52");
  const [code, setCode] = useState<string[]>(Array(CODE_LEN).fill(""));
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(0);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const cleanPhone = phone.replace(/\D/g, "");
  const canSend = cleanPhone.length >= 7 && cleanPhone.length <= 15;
  const fullNumber = `${country} ${phone}`.trim();

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const startCountdown = () => setResendIn(RESEND_SECS);

  const sendCode = async () => {
    if (!canSend) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 900));
    setSending(false);
    setStep("code");
    setCode(Array(CODE_LEN).fill(""));
    startCountdown();
    setTimeout(() => inputsRef.current[0]?.focus(), 100);
    toast.success("Código enviado ✨");
  };

  const onCodeChange = (i: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(0, 1);
    setCode((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
    if (v && i < CODE_LEN - 1) inputsRef.current[i + 1]?.focus();
  };

  const onCodeKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[i] && i > 0) inputsRef.current[i - 1]?.focus();
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LEN);
    if (!text) return;
    e.preventDefault();
    const arr = Array(CODE_LEN).fill("");
    text.split("").forEach((c, i) => (arr[i] = c));
    setCode(arr);
    const next = Math.min(text.length, CODE_LEN - 1);
    inputsRef.current[next]?.focus();
  };

  const verify = async () => {
    if (code.join("").length !== CODE_LEN) return;
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 1100));
    setVerifying(false);
    setUser({ phone: fullNumber, phoneVerified: true });
    setStep("success");
  };

  const codeFilled = code.every((c) => c !== "");

  return (
    <div className="relative min-h-full bg-white pb-16 overflow-hidden">
      <div className="blob -top-20 -left-16 w-72 h-72 bg-baddia-bubble/25" />
      <div className="blob top-60 -right-20 w-64 h-64 bg-baddia-soft/30" style={{ animationDelay: "4s" }} />
      <SparklesDeco />

      <header className="relative z-10 px-6 pt-8 pb-2">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => (step === "code" ? setStep("enter") : go("profile"))}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border-2 border-baddia-ink rounded-full shadow-[2px_2px_0_hsl(260_16%_15%)] text-[11px] font-display font-black uppercase tracking-widest text-baddia-ink active:translate-y-0.5 active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all"
          >
            <ArrowLeft size={12} strokeWidth={3} /> Volver
          </button>
          {user.phoneVerified && step !== "success" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-baddia-mint text-white border-2 border-baddia-ink px-2.5 py-1 text-[10px] font-display font-black shadow-[2px_2px_0_hsl(260_16%_15%)]">
              <Check size={11} /> verificado
            </span>
          )}
        </div>

        <span className="inline-block rounded-full bg-baddia-lavender text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-bold shadow-[3px_3px_0_hsl(260_16%_15%)] -rotate-2 mb-3 uppercase tracking-wider">
          <Shield size={10} className="inline -mt-0.5 mr-1" /> verifica tu número
        </span>
        <h1 className="font-display font-bold text-[26px] text-baddia-ink leading-tight">
          {step === "success" ? (
            <>¡Tu glow está <span className="gradient-text">verificado</span>! ✨</>
          ) : (
            <>Protege tu <span className="gradient-text">cuenta</span> 💖</>
          )}
        </h1>
        <p className="text-[14px] text-baddia-ink/70 font-medium mt-1.5">
          {step === "enter" && "Te enviaremos un código mágico por SMS ✨"}
          {step === "code" && <>Escribe el código que enviamos a <b>{fullNumber}</b></>}
          {step === "success" && "Tu número quedó a salvo con Baddia 💌"}
        </p>
      </header>

      <div className="relative z-10 px-5 mt-5 space-y-5">
        {/* STEP 1 — enter phone */}
        {step === "enter" && (
          <div className="relative animate-pop-in">
            <div className="absolute -top-3 left-5 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-hot text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
                <Phone size={11} /> tu número
              </span>
            </div>
            <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-4">
              <div>
                <label className="block text-[11px] font-display font-black text-baddia-ink/70 uppercase tracking-wider mb-1.5 pl-1">
                  Móvil
                </label>
                <div className="grid grid-cols-[90px_1fr] gap-2">
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-pearl px-2 py-3 text-center text-[14px] font-display font-black text-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none focus:bg-white"
                  >
                    <option value="+52">🇲🇽 +52</option>
                    <option value="+34">🇪🇸 +34</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+54">🇦🇷 +54</option>
                    <option value="+57">🇨🇴 +57</option>
                    <option value="+56">🇨🇱 +56</option>
                    <option value="+51">🇵🇪 +51</option>
                  </select>
                  <input
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d\s]/g, "").slice(0, 15))}
                    placeholder="55 1234 5678"
                    className="rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-pearl px-4 py-3 text-[15px] font-display font-bold text-baddia-ink placeholder:text-baddia-ink/30 shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 rounded-2xl bg-baddia-yellow/40 border-2 border-baddia-ink/15 px-3 py-2.5">
                <Lock size={13} className="text-baddia-ink/70 mt-0.5 shrink-0" />
                <p className="text-[11px] text-baddia-ink/75 font-semibold leading-snug">
                  Tu número es privado. Solo lo usamos para recuperar tu cuenta y proteger tu glow 💖
                </p>
              </div>

              <button
                disabled={!canSend || sending}
                onClick={sendCode}
                className="w-full py-3.5 rounded-full bg-baddia-hot text-white font-display font-black text-[14px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:translate-y-0"
              >
                {sending ? "Enviando código…" : <>Enviar código ✨</>}
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 — code */}
        {step === "code" && (
          <div className="relative animate-pop-in">
            <div className="absolute -top-3 left-5 z-10">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-lavender text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
                ✦ código mágico
              </span>
            </div>
            <div className="rounded-3xl bg-white border-[2.5px] border-baddia-ink p-5 pt-7 shadow-[5px_6px_0_hsl(260_16%_15%)] space-y-4">
              <div className="flex justify-between gap-1.5">
                {code.map((c, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    value={c}
                    inputMode="numeric"
                    maxLength={1}
                    onChange={(e) => onCodeChange(i, e.target.value)}
                    onKeyDown={(e) => onCodeKeyDown(i, e)}
                    onPaste={onPaste}
                    className="w-11 h-14 rounded-2xl border-[2.5px] border-baddia-ink bg-baddia-pearl text-center text-[22px] font-display font-black text-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] focus:outline-none focus:bg-white focus:border-baddia-hot"
                  />
                ))}
              </div>

              <p className="text-[11px] text-baddia-ink/60 font-semibold text-center">
                Tip preview: usa cualquier 6 dígitos ✨
              </p>

              <button
                disabled={!codeFilled || verifying}
                onClick={verify}
                className="w-full py-3.5 rounded-full bg-baddia-hot text-white font-display font-black text-[14px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:active:translate-y-0"
              >
                {verifying ? "Verificando…" : <><Check size={14} /> Verificar</>}
              </button>

              <button
                disabled={resendIn > 0}
                onClick={sendCode}
                className="w-full inline-flex items-center justify-center gap-1.5 text-[12px] font-display font-black uppercase tracking-wider text-baddia-ink/70 disabled:opacity-40"
              >
                <RotateCcw size={12} />
                {resendIn > 0 ? `Reenviar en ${resendIn}s` : "Reenviar código"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — success */}
        {step === "success" && <SuccessCelebration phone={user.phone ?? fullNumber} onDone={() => go("profile")} />}
      </div>
    </div>
  );
}

function SuccessCelebration({ phone, onDone }: { phone: string; onDone: () => void }) {
  const confetti = useMemo(
    () =>
      Array.from({ length: 40 }).map(() => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.6 + Math.random() * 1.2,
        size: 8 + Math.random() * 14,
        rot: Math.random() * 360,
        color: ["hsl(335 100% 65%)","hsl(325 100% 74%)","hsl(256 90% 68%)","hsl(48 100% 59%)","hsl(169 81% 55%)"][
          Math.floor(Math.random() * 5)
        ],
      })),
    []
  );

  return (
    <div className="relative animate-pop-in">
      {/* confetti burst */}
      <div className="pointer-events-none absolute -inset-6 overflow-hidden rounded-[36px]">
        {confetti.map((c, i) => (
          <span
            key={i}
            className="absolute top-0 block"
            style={{
              left: `${c.left}%`,
              width: c.size * 0.35,
              height: c.size,
              background: c.color,
              borderRadius: 3,
              transform: `rotate(${c.rot}deg)`,
              animation: `verifyFall ${c.duration}s ease-out ${c.delay}s forwards`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      <div className="absolute -top-3 left-5 z-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-baddia-mint text-white border-2 border-baddia-ink px-3 py-1.5 text-[10px] font-display font-black uppercase tracking-widest shadow-[2px_2px_0_hsl(260_16%_15%)] -rotate-2">
          <Check size={11} /> verificado
        </span>
      </div>

      <div className="relative rounded-[28px] border-[2.5px] border-baddia-ink p-5 pt-8 shadow-[5px_6px_0_hsl(260_16%_15%)] overflow-hidden bg-gradient-to-br from-baddia-bubble via-baddia-soft to-baddia-mint/60 text-baddia-ink">
        <div className="relative mx-auto w-24 h-24 mb-3">
          <div className="absolute inset-0 rounded-full bg-white/70 blur-xl animate-pulse-slow" />
          <div
            className="relative w-24 h-24 rounded-full bg-white border-[2.5px] border-baddia-ink flex items-center justify-center shadow-[4px_5px_0_hsl(260_16%_15%)]"
            style={{ animation: "successBeat .9s cubic-bezier(.34,1.56,.64,1) both" }}
          >
            <svg width="44" height="44" viewBox="0 0 44 44">
              <path
                d="M10 23 L19 32 L34 14"
                fill="none"
                stroke="hsl(169 81% 43%)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 60,
                  strokeDashoffset: 60,
                  animation: "checkDraw .6s ease-out .35s forwards",
                }}
              />
            </svg>
          </div>
          <span className="absolute -top-2 -right-2 text-2xl animate-sparkle-spin">✦</span>
          <span className="absolute -bottom-1 -left-2 text-xl animate-sparkle-spin" style={{ animationDelay: ".4s" }}>✧</span>
        </div>

        <p className="text-center font-display font-black text-[22px] leading-tight">
          ¡Todo listo, bestie! 💖
        </p>
        <p className="text-center text-[13px] font-semibold text-baddia-ink/80 mt-1.5">
          Verificamos <b>{phone}</b>. Tu cuenta ahora tiene un glow extra de seguridad ✨
        </p>

        <button
          onClick={onDone}
          className="mt-5 w-full py-3.5 rounded-full bg-baddia-ink text-white font-display font-black text-[14px] border-2 border-baddia-ink shadow-[3px_3px_0_hsl(260_16%_15%)] active:translate-y-[2px] active:shadow-[1px_1px_0_hsl(260_16%_15%)] transition-all inline-flex items-center justify-center gap-2"
        >
          Volver a mi perfil ✨
        </button>
      </div>

      <style>{`
        @keyframes verifyFall {
          0%   { transform: translate3d(0,-10px,0) rotate(0); opacity: 0; }
          15%  { opacity: 1; }
          100% { transform: translate3d(var(--drift, 0), 320px, 0) rotate(540deg); opacity: 0; }
        }
        @keyframes successBeat {
          0%   { transform: scale(.4); }
          60%  { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes checkDraw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
