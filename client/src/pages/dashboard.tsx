import { useEffect, useState } from "react";
import { useAuthStore, useAdStore } from "@/lib/store";
import { useLocation } from "wouter";
import { AdCard } from "@/components/ui/ad-card";
import {
  CreditCard,
  LogOut,
  Moon,
  Sparkles,
  Sun,
  Trophy,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuthStore();
  const { ads, balance, goalReached, initializeMonth, clickAd } = useAdStore();
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const userName = user?.username ?? "User";
  const userInitial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    initializeMonth();
  }, [initializeMonth]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedTheme = localStorage.getItem("theme");
    const prefersDark =
      window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
    const shouldUseDark = storedTheme ? storedTheme === "dark" : prefersDark;
    setIsDark(shouldUseDark);
    document.documentElement.classList.toggle("dark", shouldUseDark);
  }, []);

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

  const handleThemeToggle = (checked: boolean) => {
    setIsDark(checked);
    document.documentElement.classList.toggle("dark", checked);
    localStorage.setItem("theme", checked ? "dark" : "light");
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

          <div className="flex items-center gap-6 justify-self-center">
            <div className="flex flex-col items-center text-center">
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider hidden md:block">
                Current Balance
              </span>
              <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider md:hidden">
                Balance
              </span>
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xl leading-none">
                <span>€{balance}</span>
              </div>
            </div>

            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700 hidden md:block" />

            <div className="flex items-center gap-3 justify-self-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 py-1.5 px-3 rounded-full hover:bg-zinc-200/70 dark:hover:bg-zinc-700/70 transition-colors cursor-pointer"
                    aria-label="Open profile menu"
                  >
                    <div className="w-6 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300">
                      {userInitial}
                    </div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hidden sm:block">
                      {userName}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 p-2">
                  <DropdownMenuLabel className="px-2 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-300">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                          {userName}
                        </span>
                        <span className="text-xs text-zinc-500">Profile</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                    className="justify-between"
                  >
                    <div className="flex items-center gap-2">
                      {isDark ? (
                        <Moon className="w-4 h-4" />
                      ) : (
                        <Sun className="w-4 h-4" />
                      )}
                      <span>Dark Mode</span>
                    </div>
                    <Switch
                      checked={isDark}
                      onCheckedChange={handleThemeToggle}
                    />
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setIsPaymentOpen(true)}>
                    <CreditCard className="w-4 h-4" />
                    Payment Method
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                  Explore all sponsored products to unlock your full reward.
                </p>
              </div>

              <div className="w-full max-w-md">
                <div className="flex justify-between text-sm font-medium mb-2">
                  <span className="text-emerald-400">
                    {completedCount} / 15 Clicked
                  </span>
                  <span className="text-zinc-500">2 Potential</span>
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
                🎉 Goal Reached! See you tomorrow.
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

      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent
          className="w-[calc(100%-2rem)] max-w-xl max-h-[85vh] overflow-y-auto"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>Payment Method</DialogTitle>
            <DialogDescription>
              Debit card information and billing address.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Banco Santander Totta Debit
                </div>
                <span className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                  Default
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500">Cardholder</label>
                  <input
                    readOnly
                    value="Steve Lee"
                    className="h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 text-sm text-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500">Card Number</label>
                  <input
                    readOnly
                    value="**** **** **** 1234"
                    className="h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 text-sm text-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500">Expiry</label>
                  <input
                    readOnly
                    value="12/28"
                    className="h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 text-sm text-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500">IBAN</label>
                  <input
                    readOnly
                    value="PT50 0002 0123 1234 5678 9015 4"
                    className="h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 text-sm text-zinc-800 dark:text-zinc-100"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
              <div className="text-sm font-medium">Billing Address</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500">Street</label>
                  <input
                    readOnly
                    value="Rua Augusta 120"
                    className="h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 text-sm text-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500">City</label>
                  <input
                    readOnly
                    value="Lisbon"
                    className="h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 text-sm text-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500">Postal Code</label>
                  <input
                    readOnly
                    value="1100-053"
                    className="h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 text-sm text-zinc-800 dark:text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-zinc-500">Country</label>
                  <input
                    readOnly
                    value="Portugal"
                    className="h-9 w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-3 text-sm text-zinc-800 dark:text-zinc-100"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="cursor-pointer hover:scale-[1.02] focus:border-emerald-500 focus-visible:border-emerald-500 focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              variant="secondary"
              onClick={() => setIsPaymentOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
