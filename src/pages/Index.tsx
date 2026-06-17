import { BaddiaProvider, useBaddia } from "@/lib/baddia-state";
import { PhoneFrame } from "@/components/baddia/PhoneFrame";
import { BottomNav } from "@/components/baddia/BottomNav";
import { Paywall } from "@/components/baddia/Paywall";
import { Welcome } from "@/components/baddia/screens/Welcome";
import { Onboarding } from "@/components/baddia/screens/Onboarding";
import { Auth } from "@/components/baddia/screens/Auth";
import { FirstReading } from "@/components/baddia/screens/FirstReading";
import { Daily } from "@/components/baddia/screens/Daily";
import { Zodiac } from "@/components/baddia/screens/Zodiac";
import { Palm } from "@/components/baddia/screens/Palm";
import { Love } from "@/components/baddia/screens/Love";
import { Profile } from "@/components/baddia/screens/Profile";
import { WidgetsShowcase } from "@/components/baddia/screens/WidgetsShowcase";
import { Outfit } from "@/components/baddia/screens/Outfit";
import { Lucky } from "@/components/baddia/screens/Lucky";
import { Tarot } from "@/components/baddia/screens/Tarot";

const MAIN_SCREENS = new Set(["daily", "zodiac", "palm", "love", "profile", "outfit", "lucky", "tarot"]);

function Router() {
  const { screen } = useBaddia();
  let content;
  switch (screen) {
    case "welcome": content = <Welcome />; break;
    case "onboarding": content = <Onboarding />; break;
    case "auth": content = <Auth />; break;
    case "first-reading": content = <FirstReading />; break;
    case "daily": content = <Daily />; break;
    case "zodiac": content = <Zodiac />; break;
    case "palm": content = <Palm />; break;
    case "love": content = <Love />; break;
    case "profile": content = <Profile />; break;
    case "widgets": content = <WidgetsShowcase />; break;
    case "outfit": content = <Outfit />; break;
    case "lucky": content = <Lucky />; break;
    default: content = <Welcome />;
  }
  const showNav = MAIN_SCREENS.has(screen);
  return (
    <PhoneFrame>
      <div key={screen} className="animate-fade-in min-h-full flex flex-col">
        <div className="flex-1">{content}</div>
        {showNav && <BottomNav />}
      </div>
      <Paywall />
    </PhoneFrame>
  );
}

const Index = () => (
  <BaddiaProvider>
    <Router />
  </BaddiaProvider>
);

export default Index;
