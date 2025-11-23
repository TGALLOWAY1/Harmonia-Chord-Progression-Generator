"use client";

import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";

interface ChordCardProps {
  chordName: string;
  romanNumeral: string;
  isActive: boolean;
}

export default function ChordCard({
  chordName,
  romanNumeral,
  isActive,
}: ChordCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl px-6 py-8 min-w-[140px] w-full aspect-[3/4]",
        "border transition-all duration-300 ease-out",
        isActive 
          ? "bg-stone-50 border-stone-300 shadow-[0_0_30px_-10px_rgba(0,0,0,0.1)] scale-105" 
          : "bg-white border-stone-100 scale-100 hover:border-stone-200"
      )}
    >
      {/* Active indicator glow */}
      {isActive && (
        <motion.div
          layoutId="activeGlow"
          className="absolute inset-0 rounded-2xl bg-stone-200/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center gap-2">
        <span className={cn(
          "text-3xl font-semibold transition-colors duration-300",
          isActive ? "text-stone-800" : "text-stone-600"
        )}>
          {chordName}
        </span>
        <span className="text-sm font-medium text-stone-400 uppercase tracking-wider">
          {romanNumeral}
        </span>
      </div>
    </motion.div>
  );
}
