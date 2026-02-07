import { useEffect, useState } from "react";
import { useAuthStore, useAdStore } from "@/lib/store";
import { useLocation } from "wouter";
import { AdCard } from "@/components/ui/ad-card";
import { LogOut, Trophy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuthStore();
  const { ads, balance, goalReached, initializeMonth, clickAd } = useAdStore();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    initializeMonth();
  }, [initializeMonth]);

  useEffect(() => {
    if (goalReached) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5s
      return () => clearTimeout(timer);
    }
  }, [goalReached]);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const completedCount = ads.filter((a) => a.isClicked).length;
  const progress = (completedCount / 15) * 100;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col font-sans relative">
      {showConfetti && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold font-heading">
              A
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-zinc-900 dark:text-white">
              AdClick
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
                Current Balance
              </span>
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xl leading-none">
                <span>€{balance}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700 hidden md:block" />

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 py-1.5 px-3 rounded-full">
                <div className="w-6 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-400">
                  {user?.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden sm:block">
                  {user?.username}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Progress Section */}
        <section className="mb-12">
          <div className="bg-zinc-900 dark:bg-black rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="font-heading text-3xl font-bold mb-2 flex items-center justify-center md:justify-start gap-2">
                  Monthly Goal <Trophy className="w-6 h-6 text-emerald-400" />
                </h2>
                <p className="text-zinc-400 max-w-md">
                  Explore all 15 sponsored products this month to unlock your
                  full reward.
                </p>
              </div>

              <div className="w-full max-w-md">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-emerald-400">
                    {completedCount} / 15 Clicked
                  </span>
                  <span className="text-zinc-500">€30 Potential</span>
                </div>
                <div className="h-4 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 relative"
                  >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                  </motion.div>
                </div>
              </div>
            </div>

            {goalReached && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center justify-center gap-3 text-emerald-300 font-medium"
              >
                <Sparkles className="w-5 h-5 text-emerald-400" />
                🎉 Goal Reached! Come back next month.
              </motion.div>
            )}
          </div>
        </section>

        {/* Ads Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} onClick={clickAd} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 py-8 mt-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <p className="text-sm text-zinc-500 font-medium">
            © 2026 AdClick Rewards. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
