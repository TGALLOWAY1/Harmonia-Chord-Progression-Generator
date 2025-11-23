"use client";

import { Play, Pause } from "lucide-react";
import { useAppStore } from "@/src/store/useAppStore";

export default function Transport() {
  const { isPlaying, bpm, togglePlay, setBpm, generateNewProgression } =
    useAppStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 px-6 py-4">
      <div className="container mx-auto max-w-6xl flex items-center justify-between gap-6">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="
            rounded-full px-6 py-3
            border border-stone-300
            bg-white
            flex items-center gap-2
            transition-colors duration-200
            hover:bg-stone-50
            active:bg-stone-100
          "
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-stone-700" />
          ) : (
            <Play className="w-5 h-5 text-stone-700" />
          )}
          <span className="text-stone-700 font-medium">
            {isPlaying ? "Pause" : "Play"}
          </span>
        </button>

        {/* BPM Slider */}
        <div className="flex-1 flex items-center gap-4 max-w-md">
          <label className="text-sm text-stone-600 whitespace-nowrap">
            BPM
          </label>
          <input
            type="range"
            min="60"
            max="180"
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="flex-1 h-2 bg-stone-200 rounded-full appearance-none cursor-pointer
              [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-stone-400
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
              [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-stone-400
              [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer
            "
          />
          <span className="text-sm text-stone-700 font-medium w-12 text-right">
            {bpm}
          </span>
        </div>

        {/* Regenerate Button */}
        <button
          onClick={generateNewProgression}
          className="
            rounded-full px-6 py-3
            border border-stone-300
            bg-white
            transition-colors duration-200
            hover:bg-stone-50
            active:bg-stone-100
          "
        >
          <span className="text-stone-700 font-medium">Regenerate</span>
        </button>
      </div>
    </div>
  );
}

