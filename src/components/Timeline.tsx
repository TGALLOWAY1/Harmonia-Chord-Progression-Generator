"use client";

import { useAppStore } from "@/src/store/useAppStore";
import ChordCard from "./ChordCard";
import { AnimatePresence, motion } from "framer-motion";

export default function Timeline() {
  const { progression, currentChordIndex, isPlaying, isChordLocked } = useAppStore();

  // Ensure we always show 4 cards, even if progression is empty
  const displayProgression = progression.length > 0 
    ? progression 
    : Array(4).fill(null);

  return (
    <div className="w-full overflow-x-auto md:overflow-visible pb-8 -mb-8 no-scrollbar">
      <div className="flex gap-4 md:justify-center min-w-max md:min-w-0 px-4 md:px-0">
        <AnimatePresence mode="wait">
          {displayProgression.map((chord, index) => {
            // Unique key to force re-render and animate on change
            const key = chord 
              ? `${index}-${chord.symbol}-${chord.roman}` // Include roman to ensure uniqueness if symbol is same
              : `empty-${index}`;
            
            return (
              <motion.div
                key={key}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.4, 
                  delay: index * 0.1, // Staggered delay based on index
                  ease: [0.2, 0, 0.2, 1] // Custom ease
                }}
                className="flex-1 min-w-[160px] md:min-w-0"
              >
                {chord ? (
                  <ChordCard
                    chordName={chord.symbol}
                    romanNumeral={chord.roman}
                    notes={chord.notes}
                    isActive={isPlaying && currentChordIndex === index}
                    index={index}
                    isLocked={isChordLocked(index)}
                  />
                ) : (
                  <div
                    className="flex flex-col items-center justify-center rounded-2xl px-6 py-8 w-full aspect-[3/4] bg-stone-50/50 border border-dashed border-stone-200"
                  >
                    <div className="text-stone-300 text-sm font-medium">—</div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
