import { create } from "zustand";
import { ChordObject, generateDMinorProgression } from "@/src/lib/theory";

interface AppState {
  // State
  isPlaying: boolean;
  bpm: number;
  progression: ChordObject[];
  currentChordIndex: number;

  // Actions
  togglePlay: () => void;
  setBpm: (bpm: number) => void;
  generateNewProgression: () => void;
  nextChord: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  isPlaying: false,
  bpm: 120,
  progression: [],
  currentChordIndex: 0,

  // Actions
  togglePlay: () => {
    set((state) => {
      const nextIsPlaying = !state.isPlaying;
      return {
        isPlaying: nextIsPlaying,
        // If starting playback, reset to the first chord (index 0)
        currentChordIndex: nextIsPlaying ? 0 : state.currentChordIndex,
      };
    });
  },

  setBpm: (bpm: number) => {
    set({ bpm });
  },

  generateNewProgression: () => {
    const newProgression = generateDMinorProgression();
    set({
      progression: newProgression,
      currentChordIndex: 0, // Reset to first chord when generating new progression
    });
  },

  nextChord: () => {
    set((state) => ({
      currentChordIndex: (state.currentChordIndex + 1) % 4, // Loop back to 0 after 3
    }));
  },
}));

