"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/src/store/useAppStore";
import { Mood } from "@/src/lib/theory";
import { cn } from "@/src/lib/utils";

const MOODS: Mood[] = ["sad", "dark", "neutral", "hopeful", "happy"];

const MOOD_INFO: Record<Mood, { label: string; description: string }> = {
  sad: { label: "Melancholic", description: "soft minor, plagal" },
  dark: { label: "Dark", description: "phrygian, tension" },
  neutral: { label: "Moody", description: "dorian, drifting" },
  hopeful: { label: "Optimistic", description: "lydian, lift" },
  happy: { label: "Happy", description: "ionian, pop" },
};

export default function MoodControl() {
  const { mood, setMood } = useAppStore();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3 mb-8">
      <div className="flex items-center gap-1.5">
        <div className="text-xs font-medium text-stone-500 uppercase tracking-wider">
          Mood
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-stone-400 hover:text-stone-600 transition-colors"
          aria-label={showInfo ? "Hide mood descriptions" : "Show mood descriptions"}
        >
          <ChevronDown
            className={cn(
              "w-3 h-3 transition-transform duration-200",
              showInfo && "rotate-180"
            )}
          />
        </button>
      </div>
      <div className="relative flex p-1 bg-stone-100 rounded-full">
        {MOODS.map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            className={cn(
              "relative z-10 px-6 py-2 text-sm font-medium rounded-full capitalize transition-all duration-200",
              mood === m
                ? "text-stone-800 bg-white shadow-sm"
                : "text-stone-500 hover:text-stone-700"
            )}
          >
            {m}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="text-xs text-stone-600 mt-1 space-y-1 text-center">
              {MOODS.map((m) => (
                <div key={m}>
                  <strong>{MOOD_INFO[m].label}:</strong> {MOOD_INFO[m].description}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

