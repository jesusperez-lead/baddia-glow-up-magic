// Numerology + zodiac helpers for Baddia.
// Inputs are strings (form fields) — we sanitize internally.

export type Zodiac =
  | "Aries" | "Tauro" | "Géminis" | "Cáncer" | "Leo" | "Virgo"
  | "Libra" | "Escorpio" | "Sagitario" | "Capricornio" | "Acuario" | "Piscis";

const ZODIAC_RANGES: { sign: Zodiac; from: [number, number]; to: [number, number] }[] = [
  { sign: "Capricornio", from: [12, 22], to: [1, 19] },
  { sign: "Acuario",     from: [1, 20],  to: [2, 18] },
  { sign: "Piscis",      from: [2, 19],  to: [3, 20] },
  { sign: "Aries",       from: [3, 21],  to: [4, 19] },
  { sign: "Tauro",       from: [4, 20],  to: [5, 20] },
  { sign: "Géminis",     from: [5, 21],  to: [6, 20] },
  { sign: "Cáncer",      from: [6, 21],  to: [7, 22] },
  { sign: "Leo",         from: [7, 23],  to: [8, 22] },
  { sign: "Virgo",       from: [8, 23],  to: [9, 22] },
  { sign: "Libra",       from: [9, 23],  to: [10, 22] },
  { sign: "Escorpio",    from: [10, 23], to: [11, 21] },
  { sign: "Sagitario",   from: [11, 22], to: [12, 21] },
];

export function computeZodiac(day: string | number, month: string | number): Zodiac {
  const d = Number(day);
  const m = Number(month);
  if (!d || !m) return "Libra";
  for (const r of ZODIAC_RANGES) {
    const [fm, fd] = r.from;
    const [tm, td] = r.to;
    if (fm === tm) {
      if (m === fm && d >= fd && d <= td) return r.sign;
    } else {
      if ((m === fm && d >= fd) || (m === tm && d <= td)) return r.sign;
    }
  }
  return "Libra";
}

export const ZODIAC_EMOJI: Record<Zodiac, string> = {
  Aries: "♈", Tauro: "♉", Géminis: "♊", Cáncer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Escorpio: "♏",
  Sagitario: "♐", Capricornio: "♑", Acuario: "♒", Piscis: "♓",
};

function reduceDigits(n: number, keepMaster = true): number {
  while (n > 9) {
    if (keepMaster && (n === 11 || n === 22 || n === 33)) return n;
    n = String(n).split("").reduce((s, c) => s + Number(c), 0);
  }
  return n;
}

export function computeLifeNumber(
  day: string | number,
  month: string | number,
  year: string | number
): number {
  const sum = `${day}${month}${year}`
    .split("")
    .filter((c) => /\d/.test(c))
    .reduce((s, c) => s + Number(c), 0);
  if (!sum) return 1;
  return reduceDigits(sum);
}
