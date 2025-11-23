import { create } from "zustand";
import { ChordObject, generateProgression, Mood, ScaleMode, ComplexityLevel } from "@/src/lib/theory";

interface AppState {
  // State
  isPlaying: boolean;
  bpm: number;
  progression: ChordObject[];
  currentChordIndex: number;
  mood: Mood;
  rootNote: string;
  scaleMode: ScaleMode;
  complexity: ComplexityLevel;

  // Actions
  togglePlay: () => void;
  setBpm: (bpm: number) => void;
  setMood: (mood: Mood) => void;
  setRootNote: (root: string) => void;
  setScaleMode: (mode: ScaleMode) => void;
  setComplexity: (complexity: ComplexityLevel) => void;
  generateNewProgression: () => void;
  setCurrentChordIndex: (index: number) => void;
  nextChord: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  isPlaying: false,
  bpm: 120,
  progression: [],
  currentChordIndex: 0,
  mood: "neutral",
  rootNote: "D",
  scaleMode: "minor",
  complexity: 1, // Default to Standard (7ths)

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

  setMood: (mood: Mood) => {
    set({ mood });
    get().generateNewProgression();
  },

  setRootNote: (root: string) => {
    set({ rootNote: root });
    get().generateNewProgression();
  },

  setScaleMode: (mode: ScaleMode) => {
    set({ scaleMode: mode });
    get().generateNewProgression();
  },

  setComplexity: (complexity: ComplexityLevel) => {
    set({ complexity });
    get().generateNewProgression();
  },

  generateNewProgression: () => {
    const { mood, rootNote, scaleMode, complexity } = get();
    const newProgression = generateProgression(rootNote, scaleMode, mood, complexity);
    set({
      progression: newProgression,
      currentChordIndex: 0,
    });
  },

  setCurrentChordIndex: (index: number) => {
    set({ currentChordIndex: index });
  },

  nextChord: () => {
    set((state) => ({
      currentChordIndex: (state.currentChordIndex + 1) % 4,
    }));
  },
}));
