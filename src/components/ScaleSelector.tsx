"use client";

import { useAppStore } from "@/src/store/useAppStore";
import { ScaleMode } from "@/src/lib/theory";

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const MODES: ScaleMode[] = ["major", "minor"];

export default function ScaleSelector() {
  const { rootNote, scaleMode, setRootNote, setScaleMode } = useAppStore();

  return (
    <div className="flex items-center gap-4 bg-stone-50/50 px-4 py-2 rounded-xl border border-stone-100 backdrop-blur-sm">
      {/* Root Note Selector */}
      <div className="relative">
        <select
          value={rootNote}
          onChange={(e) => setRootNote(e.target.value)}
          className="
            appearance-none
            bg-transparent
            text-stone-600 font-medium
            px-3 py-1.5 rounded-lg
            cursor-pointer
            hover:bg-stone-100
            transition-colors duration-200
            outline-none focus:ring-2 focus:ring-stone-200
            text-center
            w-16
          "
        >
          {NOTES.map((note) => (
            <option key={note} value={note}>
              {note}
            </option>
          ))}
        </select>
        {/* Custom caret or styling can be added here if needed */}
      </div>

      <span className="text-stone-300">|</span>

      {/* Scale Mode Selector */}
      <div className="relative">
        <select
          value={scaleMode}
          onChange={(e) => setScaleMode(e.target.value as ScaleMode)}
          className="
            appearance-none
            bg-transparent
            text-stone-600 font-medium
            px-3 py-1.5 rounded-lg
            cursor-pointer
            hover:bg-stone-100
            transition-colors duration-200
            outline-none focus:ring-2 focus:ring-stone-200
            capitalize
            w-24
            text-center
          "
        >
          {MODES.map((mode) => (
            <option key={mode} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

