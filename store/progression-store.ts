import { create } from "zustand";
import { Progression, Chord } from "@/types/chord";
import { getChordNotes, getRomanNumeral } from "@/lib/music-theory";
import { generateRandomProgression } from "@/lib/music-theory";

interface ProgressionState {
  currentProgression: Progression | null;
  history: Progression[];
  isPlaying: boolean;
  setProgression: (chordSymbols: string[]) => void;
  generateNew: () => void;
  setIsPlaying: (playing: boolean) => void;
  addToHistory: (progression: Progression) => void;
}

export const useProgressionStore = create<ProgressionState>((set, get) => ({
  currentProgression: null,
  history: [],
  isPlaying: false,
  
  setProgression: (chordSymbols: string[]) => {
    const chords: Chord[] = chordSymbols.map((symbol) => ({
      symbol,
      notes: getChordNotes(symbol),
      romanNumeral: getRomanNumeral(symbol),
    }));

    const progression: Progression = {
      id: `prog-${Date.now()}`,
      chords,
      timestamp: Date.now(),
    };

    set({ currentProgression: progression });
    get().addToHistory(progression);
  },
  
  generateNew: () => {
    const chordSymbols = generateRandomProgression();
    get().setProgression(chordSymbols);
  },
  
  setIsPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
  },
  
  addToHistory: (progression: Progression) => {
    set((state) => ({
      history: [progression, ...state.history].slice(0, 10), // Keep last 10
    }));
  },
}));

