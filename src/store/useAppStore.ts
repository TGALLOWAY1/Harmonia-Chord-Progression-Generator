import { create } from "zustand";
import { ChordObject, generateProgression, applyVoicing, Mood, ScaleMode, ComplexityLevel } from "@/src/lib/theory";

interface AppState {
  // State
  isPlaying: boolean;
  bpm: number;
  progression: ChordObject[];
  currentChordIndex: number;
  mood: Mood;
  rootNote: string;
  scaleMode: ScaleMode;
  // NOTE: complexity is currently an alias for harmonic Depth (0–2) as defined in the Harmonia v2.1 spec:
  // 0: triads, 1: diatonic 7ths, 2: atmospheric sus/add9.
  complexity: ComplexityLevel;
  lockedChords: boolean[];

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
  toggleChordLock: (index: number) => void;
  setChordLocked: (index: number, value: boolean) => void;
  isChordLocked: (index: number) => boolean;
  regenerateChordAtIndex: (index: number) => void;
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
  lockedChords: [false, false, false, false],

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
    const { mood, rootNote, scaleMode, complexity, progression, lockedChords } = get();
    const newProgression = generateProgression(rootNote, scaleMode, mood, complexity);
    
    // Merge: keep locked chords, use new ones for unlocked positions
    const mergedProgression: ChordObject[] = [];
    for (let i = 0; i < 4; i++) {
      if (lockedChords[i] && progression[i]) {
        // Keep locked chord
        mergedProgression.push(progression[i]);
      } else {
        // Use new chord
        mergedProgression.push(newProgression[i]);
      }
    }
    
    // Re-voice the entire progression sequentially to maintain voice-leading
    const revoicedProgression: ChordObject[] = [];
    let previousNotes: string[] | undefined;
    for (let i = 0; i < mergedProgression.length; i++) {
      const chord = mergedProgression[i];
      // Get the base notes from the chord symbol (without voicing)
      const baseChord = TonalChord.get(chord.symbol);
      const baseNotes = baseChord.notes || [];
      // Re-apply voicing with previous notes for voice-leading
      const voicedNotes = applyVoicing(baseNotes, "open", previousNotes);
      revoicedProgression.push({
        ...chord,
        notes: voicedNotes,
      });
      previousNotes = voicedNotes;
    }
    
    set({
      progression: revoicedProgression,
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

  toggleChordLock: (index: number) => {
    if (index < 0 || index >= 4) return;
    set((state) => {
      const newLocked = [...state.lockedChords];
      newLocked[index] = !newLocked[index];
      return { lockedChords: newLocked };
    });
  },

  setChordLocked: (index: number, value: boolean) => {
    if (index < 0 || index >= 4) return;
    set((state) => {
      const newLocked = [...state.lockedChords];
      newLocked[index] = value;
      return { lockedChords: newLocked };
    });
  },

  isChordLocked: (index: number) => {
    const { lockedChords } = get();
    return index >= 0 && index < 4 ? lockedChords[index] : false;
  },

  regenerateChordAtIndex: (index: number) => {
    if (index < 0 || index >= 4) return;
    const { mood, rootNote, scaleMode, complexity, progression, lockedChords } = get();
    
    // Don't regenerate if locked
    if (lockedChords[index]) return;
    
    // Generate a new full progression (Markov engine will use context)
    const newProgression = generateProgression(rootNote, scaleMode, mood, complexity);
    
    // Only replace the chord at the target index
    const updatedProgression = [...progression];
    updatedProgression[index] = newProgression[index];
    
    // Re-voice the entire progression sequentially to maintain voice-leading
    const revoicedProgression: ChordObject[] = [];
    let previousNotes: string[] | undefined;
    for (let i = 0; i < updatedProgression.length; i++) {
      const chord = updatedProgression[i];
      // Get the base notes from the chord symbol (without voicing)
      const baseChord = TonalChord.get(chord.symbol);
      const baseNotes = baseChord.notes || [];
      // Re-apply voicing with previous notes for voice-leading
      const voicedNotes = applyVoicing(baseNotes, "open", previousNotes);
      revoicedProgression.push({
        ...chord,
        notes: voicedNotes,
      });
      previousNotes = voicedNotes;
    }
    
    set({
      progression: revoicedProgression,
    });
  },
}));
