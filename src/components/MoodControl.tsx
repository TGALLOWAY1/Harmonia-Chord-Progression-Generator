"use client";

import { useAppStore } from "@/src/store/useAppStore";
import { Mood } from "@/src/lib/theory";
import { cn } from "@/src/lib/utils";

const MOODS: Mood[] = ["sad", "dark", "neutral", "hopeful", "happy"];

export default function MoodControl() {
  const { mood, setMood } = useAppStore();

  return (
    <div className="flex flex-col items-center gap-3 mb-8">
      <div className="text-xs font-medium text-stone-500 uppercase tracking-wider">
        Mood
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
    </div>
  );
}

