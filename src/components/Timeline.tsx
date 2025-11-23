"use client";

import { useAppStore } from "@/src/store/useAppStore";
import ChordCard from "./ChordCard";

export default function Timeline() {
  const { progression, currentChordIndex, isPlaying } = useAppStore();

  // Ensure we always show 4 cards, even if progression is empty
  const displayProgression = progression.length > 0 
    ? progression 
    : Array(4).fill(null);

  return (
    <div className="flex gap-4 w-full">
      {displayProgression.map((chord, index) => {
        if (!chord) {
          // Empty placeholder card
          return (
            <div
              key={index}
              className="flex-1 rounded-2xl px-6 py-8 bg-stone-50 border border-stone-100 flex items-center justify-center"
            >
              <div className="text-stone-400 text-sm">—</div>
            </div>
          );
        }

        return (
          <div key={index} className="flex-1">
            <ChordCard
              chordName={chord.symbol}
              romanNumeral={chord.roman}
              isActive={isPlaying && currentChordIndex === index}
            />
          </div>
        );
      })}
    </div>
  );
}

