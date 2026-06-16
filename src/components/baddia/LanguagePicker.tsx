import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LANGS = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
] as const;

type LangCode = (typeof LANGS)[number]["code"];

export function LanguagePicker() {
  const [lang, setLang] = useState<LangCode>(() => {
    if (typeof window === "undefined") return "es";
    return (localStorage.getItem("baddia.lang") as LangCode) || "es";
  });
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  const pick = (code: LangCode) => {
    setLang(code);
    try {
      localStorage.setItem("baddia.lang", code);
    } catch {}
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="chip bg-baddia-ink text-white gap-1.5 hover:opacity-90 transition-opacity"
          aria-label="Cambiar idioma"
        >
          <span>{current.code.toUpperCase()}</span>
          <span className="text-sm leading-none">{current.flag}</span>
          <ChevronDown className="w-3 h-3 opacity-80" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="rounded-2xl border-2 border-baddia-ink p-1 min-w-[170px] shadow-[4px_4px_0_hsl(260_16%_15%)]"
      >
        {LANGS.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => pick(l.code)}
            className="rounded-xl font-semibold text-baddia-ink cursor-pointer focus:bg-baddia-bubble/20 flex items-center gap-2"
          >
            <span className="text-base leading-none">{l.flag}</span>
            <span className="flex-1">{l.label}</span>
            {l.code === lang && <Check className="w-4 h-4 text-baddia-hot" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
