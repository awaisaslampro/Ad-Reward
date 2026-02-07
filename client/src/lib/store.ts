import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addMonths, isSameMonth, startOfMonth } from "date-fns";

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
  goalReached: boolean;
  initializeMonth: () => void;
  clickAd: (id: string) => void;
  resetForDemo: () => void; // Optional helper
}

// Fixed product data to map to our 15 images
const PRODUCT_DATA = [
  // Tech (8 images)
  { title: "Quantum Headset X", price: "€299", category: "Tech" },
  { title: "Smart Lens Pro", price: "€149", category: "Tech" },
  { title: "Nebula Drone", price: "€899", category: "Tech" },
  { title: "CyberWatch 5", price: "€349", category: "Tech" },
  { title: "Sonic Budz", price: "€129", category: "Tech" },
  { title: "HyperDeck Dock", price: "€199", category: "Tech" },
  { title: "StreamCam Ultra", price: "€179", category: "Tech" },
  { title: "NanoCharge Pad", price: "€49", category: "Tech" },
  // Home (7 images)
  { title: "Lumina Lamp", price: "€89", category: "Home" },
  { title: "Zen Diffuser", price: "€45", category: "Home" },
  { title: "Aero Vase", price: "€65", category: "Home" },
  { title: "Moda Chair", price: "€249", category: "Home" },
  { title: "Pure Air Mini", price: "€120", category: "Home" },
  { title: "Ceramic Set", price: "€75", category: "Home" },
  { title: "Botanical Frame", price: "€35", category: "Home" },
] as const;

// Image paths
const TECH_IMAGES = [
  "/src/assets/images/product_tech_1_1.jpg",
  "/src/assets/images/product_tech_1_2.jpg",
  "/src/assets/images/product_tech_1_3.jpg",
  "/src/assets/images/product_tech_1_4.jpg",
  "/src/assets/images/product_tech_1_5.jpg",
  "/src/assets/images/product_tech_1_6.jpg",
  "/src/assets/images/product_tech_1_7.jpg",
  "/src/assets/images/product_tech_1_8.jpg",
];

const HOME_IMAGES = [
  "/src/assets/images/product_home_1_1.jpg",
  "/src/assets/images/product_home_1_2.jpg",
  "/src/assets/images/product_home_1_3.jpg",
  "/src/assets/images/product_home_1_4.jpg",
  "/src/assets/images/product_home_1_5.jpg",
  "/src/assets/images/product_home_1_6.jpg",
  "/src/assets/images/product_home_1_7.jpg",
];

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
      goalReached: false,

      initializeMonth: () => {
        const now = Date.now();
        const { lastGenerated, ads } = get();

        // Check if needs reset (first run OR new month)
        const needsReset =
          lastGenerated === 0 ||
          !isSameMonth(new Date(lastGenerated), new Date(now));

        if (needsReset || ads.length === 0) {
          set({
            ads: generateAds(),
            balance: 0,
            lastGenerated: now,
            goalReached: false,
          });
        }
      },

      clickAd: (id) => {
        const { ads, balance } = get();
        const adIndex = ads.findIndex((a) => a.id === id);

        if (adIndex === -1 || ads[adIndex].isClicked) return;

        const newAds = [...ads];
        newAds[adIndex].isClicked = true;

        // Count total clicked
        const clickedCount = newAds.filter((a) => a.isClicked).length;
        const totalAds = newAds.length;

        // Calculate balance: €2 per click
        let newBalance = balance + 2;

        // Check if all clicked
        const isGoalReached = clickedCount === totalAds;

        set({
          ads: newAds,
          balance: newBalance,
          goalReached: isGoalReached,
        });
      },

      resetForDemo: () => {
        set({
          ads: generateAds(),
          balance: 0,
          lastGenerated: Date.now(),
          goalReached: false,
        });
      },
    }),
    {
      name: "adclick-data-storage",
    },
  ),
);
