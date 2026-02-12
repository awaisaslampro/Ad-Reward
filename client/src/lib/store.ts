import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addMonths, isSameMonth, startOfMonth } from "date-fns";
////////////////////////////////////////////
import tech11 from "../assets/images/product_tech_1_1.jpg";
import tech12 from "../assets/images/product_tech_1_2.jpg";
import tech13 from "../assets/images/product_tech_1_3.jpg";
import tech14 from "../assets/images/product_tech_1_4.jpg";
import tech15 from "../assets/images/product_tech_1_5.jpg";
import tech16 from "../assets/images/product_tech_1_6.jpg";
import tech17 from "../assets/images/product_tech_1_7.jpg";
import tech18 from "../assets/images/product_tech_1_8.jpg";

import home11 from "../assets/images/product_home_1_1.jpg";
import home12 from "../assets/images/product_home_1_2.jpg";
import home13 from "../assets/images/product_home_1_3.jpg";
import home14 from "../assets/images/product_home_1_4.jpg";
import home15 from "../assets/images/product_home_1_5.jpg";
import home16 from "../assets/images/product_home_1_6.jpg";
import home17 from "../assets/images/product_home_1_7.jpg";

// --- Auth Store ---

interface User {
  username: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (username) => set({ user: { username }, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "adclick-auth-storage",
    },
  ),
);

// --- Ad Store ---

export interface Ad {
  id: string;
  title: string;
  price: string;
  image: string;
  isClicked: boolean;
  category: "Tech" | "Home";
}

interface AdState {
  ads: Ad[];
  balance: number;
  lastGenerated: number; // Timestamp
  lastDailyResetKey: string;
  dailyClickCount: number;
  rewardDayCount: number;
  goalReached: boolean;
  initializeMonth: () => void;
  clickAd: (id: string) => void;
  resetForDemo: () => void; // Optional helper
}

// Fixed product data to map to our 15 images
const PRODUCT_DATA = [
  // Tech (8 images)
  { title: "Quantum Headset X", price: " 299", category: "Tech" },
  { title: "Smart Lens Pro", price: " 149", category: "Tech" },
  { title: "Nebula Drone", price: " 899", category: "Tech" },
  { title: "CyberWatch 5", price: " 349", category: "Tech" },
  { title: "Sonic Budz", price: " 129", category: "Tech" },
  { title: "HyperDeck Dock", price: " 199", category: "Tech" },
  { title: "StreamCam Ultra", price: " 179", category: "Tech" },
  { title: "NanoCharge Pad", price: " 49", category: "Tech" },
  // Home (7 images)
  { title: "Lumina Lamp", price: " 89", category: "Home" },
  { title: "Zen Diffuser", price: " 45", category: "Home" },
  { title: "Aero Vase", price: " 65", category: "Home" },
  { title: "Moda Chair", price: " 249", category: "Home" },
  { title: "Pure Air Mini", price: " 120", category: "Home" },
  { title: "Ceramic Set", price: " 75", category: "Home" },
  { title: "Botanical Frame", price: " 35", category: "Home" },
] as const;

// Image paths

const TECH_IMAGES = [
  tech11,
  tech12,
  tech13,
  tech14,
  tech15,
  tech16,
  tech17,
  tech18,
];

const HOME_IMAGES = [home11, home12, home13, home14, home15, home16, home17];

const getPortugalDayKey = (timestamp: number): string => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date(timestamp));
};

const generateAds = (): Ad[] => {
  // We have exactly 15 products and 15 images (8 tech + 7 home = 15).
  // Perfect match.
  const ads: Ad[] = [];

  // Add Tech
  for (let i = 0; i < 8; i++) {
    ads.push({
      id: `tech-${i}`,
      title: PRODUCT_DATA[i].title,
      price: PRODUCT_DATA[i].price,
      image: TECH_IMAGES[i],
      category: "Tech",
      isClicked: false,
    });
  }

  // Add Home
  for (let i = 0; i < 7; i++) {
    ads.push({
      id: `home-${i}`,
      title: PRODUCT_DATA[i + 8].title,
      price: PRODUCT_DATA[i + 8].price,
      image: HOME_IMAGES[i],
      category: "Home",
      isClicked: false,
    });
  }

  // Shuffle strictly for display variety, but keeping the set fixed
  return ads.sort(() => Math.random() - 0.5);
};

export const useAdStore = create<AdState>()(
  persist(
    (set, get) => ({
      ads: [],
      balance: 0,
      lastGenerated: 0,
      lastDailyResetKey: "",
      dailyClickCount: 0,
      rewardDayCount: 0,
      goalReached: false,

      initializeMonth: () => {
        const now = Date.now();
        const { lastGenerated, ads } = get();

        // Check if needs reset (first run OR new month)
        const needsReset =
          lastGenerated === 0 ||
          !isSameMonth(new Date(lastGenerated), new Date(now));

        if (needsReset || ads.length === 0) {
          const todayKey = getPortugalDayKey(now);
          set({
            ads: generateAds(),
            lastGenerated: now,
            lastDailyResetKey: todayKey,
            dailyClickCount: 0,
            goalReached: false,
          });
        }
      },

      clickAd: (id) => {
        const now = Date.now();
        const {
          ads,
          balance,
          lastDailyResetKey,
          dailyClickCount,
          rewardDayCount,
        } = get();
        const todayKey = getPortugalDayKey(now);

        // Reset daily clicks and isClicked flags once per day
        if (lastDailyResetKey === "" || lastDailyResetKey !== todayKey) {
          const resetAds = ads.map((ad) => ({ ...ad, isClicked: false }));
          const shouldResetCycle = rewardDayCount >= 15;
          set({
            ads: resetAds,
            lastDailyResetKey: todayKey,
            dailyClickCount: 0,
            balance: shouldResetCycle ? 0 : balance,
            rewardDayCount: shouldResetCycle ? 0 : rewardDayCount,
            goalReached: false,
          });
        }

        const {
          ads: currentAds,
          dailyClickCount: currentDailyCount,
          rewardDayCount: currentRewardDayCount,
        } = get();
        if (currentDailyCount >= 15) return;

        const adIndex = currentAds.findIndex((a) => a.id === id);

        if (adIndex === -1 || currentAds[adIndex].isClicked) return;

        const newAds = [...currentAds];
        newAds[adIndex].isClicked = true;

        // Count total clicked
        const clickedCount = newAds.filter((a) => a.isClicked).length;
        const totalAds = newAds.length;

        // Daily click count (max 15 per day)
        const nextDailyCount = currentDailyCount + 1;

        // Reward: €2 when 15 clicks are completed in a day
        let newBalance = balance;
        let nextRewardDayCount = currentRewardDayCount;
        if (nextDailyCount === 15) {
          newBalance += 2;
          nextRewardDayCount += 1;
        }

        // Check if all clicked
        const isGoalReached = clickedCount === totalAds;

        set({
          ads: newAds,
          balance: newBalance,
          dailyClickCount: nextDailyCount,
          rewardDayCount: nextRewardDayCount,
          goalReached: isGoalReached,
        });
      },
      resetForDemo: () => {
        const now = Date.now();
        set({
          ads: generateAds(),
          balance: 0,
          lastGenerated: now,
          lastDailyResetKey: getPortugalDayKey(now),
          dailyClickCount: 0,
          rewardDayCount: 0,
          goalReached: false,
        });
      },
    }),
    {
      name: "adclick-data-storage",
    },
  ),
);
