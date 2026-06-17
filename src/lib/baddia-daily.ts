// Daily vibe — deterministic per user + per day.
// Combines name, birth date, sign, life number, and today's date.

import type { BaddiaUser } from "./baddia-state";
import { QUOTES } from "./baddia-quotes";
import type { Zodiac } from "./baddia-numerology";

export interface DailyColor {
  name: string;
  from: string;
  to: string;
}

export interface DailyVibe {
  glowScore: number;       // 55–98
  glowLabel: string;       // "Glow alto ✨"
  glowMsg: string;         // short blurb under score
  advice: string;          // quote of the day
  color: DailyColor;
  luckyNumber: number;     // 1–33
  moodKeywords: string[];  // 3 keywords
  moodSentence: string;    // "Hoy tu energía está conectada con ..."
}

const COLORS: DailyColor[] = [
  { name: "Rosa cuarzo",   from: "#FFD6E6", to: "#FF7AC8" },
  { name: "Lavanda glow",  from: "#E6DAFF", to: "#8B63F7" },
  { name: "Lima cósmico",  from: "#EAFBA8", to: "#B7F400" },
  { name: "Mint aura",     from: "#C8F5E9", to: "#14C6A4" },
  { name: "Coral baddie",  from: "#FFD0C2", to: "#FF6B6B" },
  { name: "Dorado glow",   from: "#FFF0B8", to: "#FFD12E" },
  { name: "Bubble pink",   from: "#FFE0F0", to: "#FF7AC8" },
  { name: "Violeta luna",  from: "#D9C8FF", to: "#6E47E8" },
  { name: "Crema solar",   from: "#FFF6E8", to: "#FFC371" },
];

const KEYWORDS_BY_SIGN: Record<Zodiac, string[]> = {
  Aries:      ["coraje", "fuego propio", "iniciativa", "magnetismo", "valentía"],
  Tauro:      ["sensualidad", "calma", "abundancia", "placer", "raíces"],
  Géminis:    ["curiosidad", "palabras", "chispa", "juego", "conexión"],
  Cáncer:     ["ternura", "intuición", "hogar", "amor propio", "memoria"],
  Leo:        ["brillo", "confianza", "drama", "creatividad", "corazón"],
  Virgo:      ["enfoque", "claridad", "límites", "detalle", "cuidado"],
  Libra:      ["amor propio", "balance", "belleza", "vínculos", "armonía"],
  Escorpio:   ["poder", "deseo", "verdad", "transformación", "magnetismo"],
  Sagitario:  ["aventura", "fe", "expansión", "libertad", "fuego"],
  Capricornio:["ambición", "estructura", "logro", "paciencia", "poder"],
  Acuario:    ["originalidad", "visión", "libertad", "comunidad", "rebeldía"],
  Piscis:     ["intuición", "magia", "dulzura", "sueños", "compasión"],
};

const GLOW_LABELS: { min: number; label: string; msg: string }[] = [
  { min: 90, label: "Glow máximo 🔥", msg: "Estás en tu era más magnética. Hoy todo te llega." },
  { min: 80, label: "Glow alto ✨",   msg: "Estás magnetizando bonito hoy. Confía en lo que sientes." },
  { min: 70, label: "Glow soft 💖",   msg: "Energía suave y bonita. Hoy se trata de fluir." },
  { min: 60, label: "Glow recarga 🌙", msg: "Día para mimarte y bajar revoluciones." },
  { min: 0,  label: "Glow cocoon 🫧",  msg: "Energía baja: hidrátate, descansa y vuelve más bad." },
];

// Stable hash → seed
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function computeDailyVibe(user: BaddiaUser): DailyVibe {
  const seedStr = `${user.name}|${user.day}-${user.month}-${user.year}|${user.sign}|${user.lifeNumber}|${todayKey()}`;
  const seed = hash(seedStr);

  // Glow score 55–98, bias slightly higher
  const glowScore = 55 + (seed % 44);
  const glowBand = GLOW_LABELS.find((b) => glowScore >= b.min)!;

  const advice = QUOTES[seed % QUOTES.length];
  const color = COLORS[(seed >>> 4) % COLORS.length];

  // Lucky number leans on life number + day rotation
  const luckyPool = [user.lifeNumber, 3, 7, 11, 13, 17, 21, 22, 27, 33];
  const luckyNumber = luckyPool[(seed >>> 8) % luckyPool.length] || 11;

  const baseKw = KEYWORDS_BY_SIGN[user.sign as Zodiac] ?? KEYWORDS_BY_SIGN.Libra;
  // Pick 3 distinct keywords deterministically
  const picks: string[] = [];
  let s = seed;
  while (picks.length < 3) {
    const w = baseKw[s % baseKw.length];
    if (!picks.includes(w)) picks.push(w);
    s = Math.imul(s ^ (s >>> 13), 1274126177) >>> 0;
  }
  const moodSentence = `Hoy tu energía está conectada con ${picks.join(", ")}.`;

  return {
    glowScore,
    glowLabel: glowBand.label,
    glowMsg: glowBand.msg,
    advice,
    color,
    luckyNumber,
    moodKeywords: picks,
    moodSentence,
  };
}
