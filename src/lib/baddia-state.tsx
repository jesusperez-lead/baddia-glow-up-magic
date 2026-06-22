import { createContext, useContext, useState, ReactNode } from "react";

export type Screen =
  | "welcome"
  | "onboarding"
  | "auth"
  | "first-reading"
  | "daily"
  | "zodiac"
  | "palm"
  | "love"
  | "profile"
  | "widgets"
  | "outfit"
  | "lucky"
  | "tarot"
  | "astral"
  | "compat"
  | "aura"
  | "account"
  | "delete-account"
  | "playstore";

export type Interest =
  | "Amor" | "Dinero" | "Suerte" | "Crush Energy"
  | "Horóscopo" | "Lectura de mano" | "Tarot" | "Aura" | "Amor propio";

export interface BaddiaUser {
  name: string;
  day: string;
  month: string;
  year: string;
  interests: Interest[];
  plan: "Free" | "Pro" | "Pro Anual" | "Baddia Girls";
  sign: string;
  lifeNumber: number;
  savedQuotes: string[];
}

interface Ctx {
  screen: Screen;
  go: (s: Screen) => void;
  user: BaddiaUser;
  setUser: (u: Partial<BaddiaUser>) => void;
  paywallOpen: boolean;
  openPaywall: () => void;
  closePaywall: () => void;
}

const defaultUser: BaddiaUser = {
  name: "Sofi",
  day: "12",
  month: "10",
  year: "2002",
  interests: ["Amor", "Crush Energy", "Amor propio"],
  plan: "Pro Anual",
  sign: "Libra",
  lifeNumber: 11,
  savedQuotes: [],
};

const BaddiaCtx = createContext<Ctx | null>(null);

export function BaddiaProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [user, setUserState] = useState<BaddiaUser>(defaultUser);
  const [paywallOpen, setPaywallOpen] = useState(false);

  const setUser = (u: Partial<BaddiaUser>) => setUserState((p) => ({ ...p, ...u }));

  return (
    <BaddiaCtx.Provider
      value={{
        screen,
        go: setScreen,
        user,
        setUser,
        paywallOpen,
        openPaywall: () => setPaywallOpen(true),
        closePaywall: () => setPaywallOpen(false),
      }}
    >
      {children}
    </BaddiaCtx.Provider>
  );
}

export function useBaddia() {
  const ctx = useContext(BaddiaCtx);
  if (!ctx) throw new Error("useBaddia must be inside BaddiaProvider");
  return ctx;
}
