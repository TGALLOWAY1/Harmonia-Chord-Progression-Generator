"use client";

import { motion } from "framer-motion";
import { Lock, Unlock, RefreshCcw } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useAppStore } from "@/src/store/useAppStore";
import { playFromIndex } from "@/src/hooks/useAudioEngine";

interface ChordCardProps {
  chordName: string;
  romanNumeral: string;
  notes?: string[];
  isActive: boolean;
  index: number;
  isLocked: boolean;
}

export default function ChordCard({
  chordName,
  romanNumeral,
  notes = [],
  isActive,
  index,
  isLocked,
}: ChordCardProps) {
  const toggleChordLock = useAppStore((state) => state.toggleChordLock);
  const regenerateChordAtIndex = useAppStore((state) => state.regenerateChordAtIndex);

  const handleLockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleChordLock(index);
  };

  const handleRerollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    regenerateChordAtIndex(index);
  };

  const handleCardClick = () => {
    playFromIndex(index);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      onClick={handleCardClick}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-2xl px-6 py-8 min-w-[140px] w-full aspect-[3/4]",
        "border transition-all duration-300 ease-out cursor-pointer",
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

      {/* Action icons - top right */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5">
        {/* Lock/Unlock icon */}
        <button
          onClick={handleLockClick}
          className={cn(
            "p-1 rounded transition-all duration-200",
            "opacity-50 hover:opacity-100",
            "hover:bg-stone-100 active:bg-stone-200",
            isLocked && "opacity-100"
          )}
          aria-label={isLocked ? "Unlock chord" : "Lock chord"}
        >
          {isLocked ? (
            <Lock className="w-3.5 h-3.5 text-stone-700" />
          ) : (
            <Unlock className="w-3.5 h-3.5 text-stone-500" />
          )}
        </button>
        {/* Re-roll icon */}
        <button
          onClick={handleRerollClick}
          className={cn(
            "p-1 rounded transition-all duration-200",
            "opacity-50 hover:opacity-100",
            "hover:bg-stone-100 active:bg-stone-200",
            isLocked && "opacity-30 cursor-not-allowed"
          )}
          disabled={isLocked}
          aria-label="Regenerate this chord"
        >
          <RefreshCcw className="w-3.5 h-3.5 text-stone-500" />
        </button>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-1.5">
        {/* Chord symbol - large primary */}
        <span className={cn(
          "text-3xl font-semibold transition-colors duration-300",
          isActive ? "text-stone-800" : "text-stone-600"
        )}>
          {chordName}
        </span>
        {/* Roman numeral - small secondary */}
        <span className="text-sm font-medium text-stone-400 uppercase tracking-wider">
          {romanNumeral}
        </span>
        {/* Played notes - bottom */}
        {notes.length > 0 && (
          <span className="text-xs font-mono text-stone-500 mt-0.5">
            {notes.join("  ")}
          </span>
        )}
      </div>
    </motion.div>
  );
}
