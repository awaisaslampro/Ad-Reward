import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MousePointerClick } from "lucide-react";
import { Ad } from "@/lib/store";

interface AdCardProps {
  ad: Ad;
  onClick: (id: string) => void;
}

export function AdCard({ ad, onClick }: AdCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={!ad.isClicked ? { y: -5 } : {}}
      className={`relative group rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 ${
        ad.isClicked ? 'opacity-90' : ''
      }`}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={ad.image}
          alt={ad.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            ad.isClicked ? 'grayscale scale-100' : 'group-hover:scale-110'
          }`}
        />
        
        {/* Price Badge */}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-zinc-900 dark:text-white shadow-sm z-10">
          {ad.price}
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-zinc-900/50 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-medium text-white uppercase tracking-wider z-10">
          {ad.category}
        </div>

        {/* Clicked Overlay */}
        <AnimatePresence>
          {ad.isClicked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-emerald-600/80 backdrop-blur-[2px]"
            >
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="bg-white rounded-full p-4 shadow-2xl"
              >
                <Check className="w-8 h-8 text-emerald-600 stroke-[3px]" />
              </motion.div>
              <motion.span 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-2 text-white font-bold tracking-wide uppercase text-sm"
              >
                Collected
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-5">
        <h3 className="font-heading font-semibold text-lg text-zinc-900 dark:text-white mb-1 truncate">
          {ad.title}
        </h3>
        <p className="text-xs text-zinc-500 mb-4">
          Sponsored Product
        </p>

        <button
          onClick={() => onClick(ad.id)}
          disabled={ad.isClicked}
          className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            ad.isClicked
              ? 'bg-zinc-100 text-zinc-400 cursor-default dark:bg-zinc-800 dark:text-zinc-600'
              : 'bg-zinc-900 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-900/10 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200'
          }`}
        >
          {ad.isClicked ? (
            'Reward Claimed'
          ) : (
            <>
              Click to Earn <MousePointerClick className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
