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
  initializeMonth: () => Promise<void>;
  resetDailyIfNeeded: () => void;
  clickAd: (id: string) => void;
  resetForDemo: () => Promise<void>; // Optional helper
}

// Expanded product data for variety (30+ entries, pick 15 random products)
const PRODUCT_DATA = [
  // Tech products (16 for variety)
  { title: "Quantum Headset X", price: "€299", category: "Tech" },
  { title: "Smart Lens Pro", price: "€149", category: "Tech" },
  { title: "Nebula Drone Pro", price: "€899", category: "Tech" },
  { title: "CyberWatch 5 Ultra", price: "€349", category: "Tech" },
  { title: "Sonic Budz Max", price: "€129", category: "Tech" },
  { title: "HyperDeck Dock Pro", price: "€199", category: "Tech" },
  { title: "StreamCam Ultra HD", price: "€179", category: "Tech" },
  { title: "NanoCharge Pad Fast", price: "€49", category: "Tech" },
  { title: "PixelPhone 14", price: "€999", category: "Tech" },
  { title: "Nova Laptop Air", price: "€1299", category: "Tech" },
  { title: "Echo Speaker Pro", price: "€89", category: "Tech" },
  { title: "FitTrack Band", price: "€79", category: "Tech" },
  { title: "VR Horizon 2", price: "€499", category: "Tech" },
  { title: "Bolt Charger", price: "€29", category: "Tech" },
  { title: "Cloud Mouse Pro", price: "€69", category: "Tech" },
  { title: "Aura Keyboard", price: "€159", category: "Tech" },
  // Home products (16 for variety)
  { title: "Lumina Lamp Pro", price: "€89", category: "Home" },
  { title: "Zen Diffuser Ultra", price: "€45", category: "Home" },
  { title: "Aero Vase Crystal", price: "€65", category: "Home" },
  { title: "Moda Chair Lux", price: "€249", category: "Home" },
  { title: "Pure Air Mini Pro", price: "€120", category: "Home" },
  { title: "Ceramic Set Premium", price: "€75", category: "Home" },
  { title: "Botanical Frame Gold", price: "€35", category: "Home" },
  { title: "Velvet Sofa Mini", price: "€399", category: "Home" },
  { title: "Ocean Rug", price: "€189", category: "Home" },
  { title: "Silk Bedding Set", price: "€279", category: "Home" },
  { title: "Marble Table", price: "€599", category: "Home" },
  { title: "Wooden Shelf Unit", price: "€129", category: "Home" },
  { title: "Crystal Decanter", price: "€99", category: "Home" },
  { title: "Bamboo Basket", price: "€39", category: "Home" },
  { title: "Wall Art Set", price: "€69", category: "Home" },
  { title: "Cozy Blanket", price: "€59", category: "Home" },
] as const;

const NUM_TECH_ADS = 8;
const NUM_HOME_ADS = 7;

// Image paths

// Expanded image pools (duplicate existing for variety, 16 each)
const TECH_IMAGES_POOL = [
  tech11,
  tech12,
  tech13,
  tech14,
  tech15,
  tech16,
  tech17,
  tech18,
  tech11,
  tech12,
  tech13,
  tech14,
  tech15,
  tech16,
  tech17,
  tech18, // duplicates for more random options
];

const HOME_IMAGES_POOL = [
  home11,
  home12,
  home13,
  home14,
  home15,
  home16,
  home17,
  home11,
  home12,
  home13,
  home14,
  home15,
  home16,
  home17, // duplicates
  home11,
  home12, // extra for pool size
];

const getPortugalDayKey = (timestamp: number): string => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Lisbon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(new Date(timestamp));
};

// Fake API simulation
const fetchRandomAds = async (): Promise<Ad[]> => {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, 300 + Math.random() * 400),
  );

  const ads: Ad[] = [];
  let techId = 0;
  let homeId = 0;

  // Select random Tech products (always 8)
  const techProducts = PRODUCT_DATA.filter((p) => p.category === "Tech");
  for (let i = 0; i < NUM_TECH_ADS; i++) {
    const randomTechProduct =
      techProducts[Math.floor(Math.random() * techProducts.length)];
    const randomTechImage =
      TECH_IMAGES_POOL[Math.floor(Math.random() * TECH_IMAGES_POOL.length)];
    ads.push({
      id: `tech-${techId++}`,
      title: randomTechProduct.title,
      price: randomTechProduct.price,
      image: randomTechImage,
      category: "Tech",
      isClicked: false,
    });
  }

  // Select random Home products (always 7)
  const homeProducts = PRODUCT_DATA.filter((p) => p.category === "Home");
  for (let i = 0; i < NUM_HOME_ADS; i++) {
    const randomHomeProduct =
      homeProducts[Math.floor(Math.random() * homeProducts.length)];
    const randomHomeImage =
      HOME_IMAGES_POOL[Math.floor(Math.random() * HOME_IMAGES_POOL.length)];
    ads.push({
      id: `home-${homeId++}`,
      title: randomHomeProduct.title,
      price: randomHomeProduct.price,
      image: randomHomeImage,
      category: "Home",
      isClicked: false,
    });
  }

  // Final shuffle for display order
  return ads.sort(() => Math.random() - 0.5);
};

const generateAds = async (): Promise<Ad[]> => fetchRandomAds();

export const useAdStore = create<AdState>()(
  persist(
    (set, get) => {
      const resetDailyIfNeeded = () => {
        const now = Date.now();
        const { ads, balance, lastDailyResetKey, rewardDayCount } = get();
        const todayKey = getPortugalDayKey(now);

        if (lastDailyResetKey === "") {
          set({ lastDailyResetKey: todayKey });
          return;
        }

        if (lastDailyResetKey !== todayKey) {
          // Daily reset: unclick existing ads (keep same set for day)
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
      };

      return {
        ads: [],
        balance: 0,
        lastGenerated: 0,
        lastDailyResetKey: "",
        dailyClickCount: 0,
        rewardDayCount: 0,
        goalReached: false,

        initializeMonth: async () => {
          const now = Date.now();
          const todayKey = getPortugalDayKey(now);
          const { lastGenerated, ads } = get();

          const needsReset =
            lastGenerated === 0 ||
            !isSameMonth(new Date(lastGenerated), new Date(now)) ||
            ads.length === 0;

          if (needsReset) {
            const freshAds = await generateAds();
            set({
              ads: freshAds,
              lastGenerated: now,
              lastDailyResetKey: todayKey,
              dailyClickCount: 0,
              goalReached: false,
            });
          }
        },

        resetDailyIfNeeded,

        clickAd: (id) => {
          resetDailyIfNeeded();

          const {
            ads: currentAds,
            balance,
            dailyClickCount: currentDailyCount,
            rewardDayCount: currentRewardDayCount,
            goalReached: currentGoalReached,
          } = get();
          if (currentGoalReached) return;
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
        resetForDemo: async () => {
          const now = Date.now();
          const freshAds = await generateAds();
          set({
            ads: freshAds,
            balance: 0,
            lastGenerated: now,
            lastDailyResetKey: getPortugalDayKey(now),
            dailyClickCount: 0,
            rewardDayCount: 0,
            goalReached: false,
          });
        },
      };
    },
    {
      name: "adclick-data-storage",
    },
  ),
);
