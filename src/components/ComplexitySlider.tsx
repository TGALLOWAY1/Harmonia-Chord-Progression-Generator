"use client";

import { useAppStore } from "@/src/store/useAppStore";
import { ComplexityLevel } from "@/src/lib/theory";
import { cn } from "@/src/lib/utils";

const COMPLEXITY_LABELS: Record<ComplexityLevel, string> = {
  0: "Simple",   // Triads
  1: "Standard", // 7ths
  2: "Color",    // Add9, Sus
  3: "Jazz",     // 9, 11, 13
};

export default function ComplexitySlider() {
  const { complexity, setComplexity } = useAppStore();

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xs">
      <div className="text-xs font-medium text-stone-500 uppercase tracking-wider">
        Complexity
      </div>
      
      <div className="relative w-full">
        {/* Slider Track */}
        <input
          type="range"
          min="0"
          max="3"
          step="1"
          value={complexity}
          onChange={(e) => setComplexity(Number(e.target.value) as ComplexityLevel)}
          className="
            w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-stone-200
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:bg-stone-700
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:shadow-sm
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:hover:scale-110
          "
        />
        
        {/* Labels below slider */}
        <div className="flex justify-between mt-2 px-1">
          {[0, 1, 2, 3].map((level) => (
            <button
              key={level}
              onClick={() => setComplexity(level as ComplexityLevel)}
              className={cn(
                "text-xs font-medium transition-colors duration-200",
                complexity === level 
                  ? "text-stone-800" 
                  : "text-stone-400 hover:text-stone-600"
              )}
            >
              {COMPLEXITY_LABELS[level as ComplexityLevel]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

