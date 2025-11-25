import { Chord as TonalChord, Interval, Note } from "@tonaljs/tonal";
import {
  generateProgression as generateHarmonyProgression,
  Mode as HarmonyMode,
  Mood as HarmonyMood,
  Depth as HarmonyDepth,
  Degree,
  GeneratedChord,
} from "@/src/logic/harmonyEngine";

export type Mood = "happy" | "sad" | "dark" | "hopeful" | "neutral";
export type ScaleMode = "major" | "minor";
export type ComplexityLevel = 0 | 1 | 2 | 3;

export type ChordObject = {
  symbol: string;
  notes: string[];
  roman: string;
};

export type VoicingStrategy = 'closed' | 'open' | 'drop2';

/**
 * Apply voicing strategy to a set of notes
 * 'open' (default): Keeps root, moves 3rd up an octave, keeps/moves 5th
 */
export function applyVoicing(notes: string[], strategy: VoicingStrategy = 'open'): string[] {
  if (notes.length < 3) return notes;
  
  const pitchClasses = notes.map(n => Note.get(n).pc); // "C", "E", "G"
  
  if (strategy === 'closed') {
    // Simple closed voicing: Root at C3, others immediately above
    return pitchClasses.map((pc, i) => {
      // Start at octave 3
      let octave = 3;
      // If pitch class is 'lower' than root, bump octave
      if (i > 0) {
        const interval = Note.distance(pitchClasses[0] + octave, pc + octave);
        if (interval.startsWith("-")) octave++;
      }
      return pc + octave;
    });
  }
  
  if (strategy === 'open') {
    const root = pitchClasses[0] + "3"; // Anchor root at octave 3
    const voicedNotes = [root];
    
    for (let i = 1; i < pitchClasses.length; i++) {
      const pc = pitchClasses[i];
      let octave = 3;
      
      // Calculate base interval from root
      if (i === 1) {
        // Move 3rd up one octave
        const baseNote = pc + "3";
        if (Note.distance(root, baseNote).startsWith("-")) {
           octave = 5;
        } else {
           octave = 4;
        }
      } else {
        // 5th and 7th
         const baseNote = pc + "3";
         if (Note.distance(root, baseNote).startsWith("-")) {
            octave = 4;
         } else {
            octave = 3;
         }
      }
      
      voicedNotes.push(pc + octave);
    }
    
    return voicedNotes.sort((a, b) => Note.midi(a)! - Note.midi(b)!);
  }
  
  return notes; // Fallback
}

const SCALE_MODE_TO_ENGINE_MODE: Record<ScaleMode, HarmonyMode> = {
  major: "ionian",
  minor: "aeolian",
};

const MOOD_TO_ENGINE_MOOD: Record<Mood, HarmonyMood> = {
  happy: "happy",
  sad: "melancholic",
  dark: "dark",
  hopeful: "optimistic",
  neutral: "moody",
};

const QUALITY_SYMBOL_MAP: Record<string, string> = {
  "": "",
  m: "m",
  dim: "dim",
  maj7: "maj7",
  m7: "m7",
  "7": "7",
  sus2: "sus2",
  sus4: "sus4",
  add9: "add9",
  "m(add9)": "madd9",
  "maj(add9)": "maj9",
};

const MODE_DEGREE_OFFSETS: Record<HarmonyMode, number[]> = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
};

const ROMAN_INDEX: Record<string, number> = {
  I: 0,
  II: 1,
  III: 2,
  IV: 3,
  V: 4,
  VI: 5,
  VII: 6,
};

/**
 * Generate a random 4-chord progression dynamically based on key, mood, and complexity
 * @param root Root note (e.g., "C", "F#", "Bb")
 * @param mode Scale mode ("major" or "minor")
 * @param mood The mood to bias the chord selection (default: "neutral")
 * @param complexity Complexity level 0-3 (default: 1)
 * @param depthOverride Optional explicit harmonic depth to forward to the harmony engine
 */
export function generateProgression(
  root: string = "D", 
  mode: ScaleMode = "minor", 
  mood: Mood = "neutral",
  complexity: ComplexityLevel = 1,
  depthOverride?: HarmonyDepth
): ChordObject[] {
  const harmonyMode = mapScaleMode(mode);
  const harmonyMood = mapMood(mood);
  const depth = depthOverride ?? mapComplexityToDepth(complexity);

  const generated = generateHarmonyProgression({
    rootKey: root,
    mode: harmonyMode,
    mood: harmonyMood,
    depth,
    numChords: 4,
  });

  return generated.map((generatedChord) =>
    buildChordObject(root, harmonyMode, generatedChord)
  );
}

export function generateDMinorProgression(mood: Mood = "neutral"): ChordObject[] {
  return generateProgression("D", "minor", mood, 1, 1);
}

function buildChordObject(
  root: string,
  harmonyMode: HarmonyMode,
  generatedChord: GeneratedChord
): ChordObject {
  const chordSymbol = convertToChordSymbol(root, harmonyMode, generatedChord);
  const chord = TonalChord.get(chordSymbol);
  const chordNotes = chord.notes || [];
  const voicedNotes = applyVoicing(chordNotes, "open");

  return {
    symbol: chordSymbol,
    notes: voicedNotes,
    roman: generatedChord.degree,
  };
}

function convertToChordSymbol(
  root: string,
  mode: HarmonyMode,
  generatedChord: GeneratedChord
): string {
  const degreeRoot = getDegreeRoot(root, mode, generatedChord.degree);
  const mappedQuality = QUALITY_SYMBOL_MAP[generatedChord.quality] ?? "";
  return `${degreeRoot}${mappedQuality}`;
}

function getDegreeRoot(root: string, mode: HarmonyMode, degree: Degree): string {
  const semitoneOffset = getDegreeOffset(mode, degree);
  const interval = Interval.fromSemitones(semitoneOffset);
  if (!interval) return root;
  const transposed = Note.transpose(root, interval);
  return transposed ?? root;
}

function getDegreeOffset(mode: HarmonyMode, degree: Degree): number {
  const flats = (degree.match(/b/g) ?? []).length;
  const sharps = (degree.match(/#/g) ?? []).length;
  const normalizedNumeral = degree.replace(/[b#°]/g, "").toUpperCase();
  const index = ROMAN_INDEX[normalizedNumeral] ?? 0;
  const offsets = MODE_DEGREE_OFFSETS[mode] ?? MODE_DEGREE_OFFSETS.ionian;
  const base = offsets[index] ?? 0;
  const offset = (base - flats + sharps) % 12;
  return offset < 0 ? offset + 12 : offset;
}

function mapScaleMode(mode: ScaleMode): HarmonyMode {
  return SCALE_MODE_TO_ENGINE_MODE[mode] ?? "aeolian";
}

function mapMood(mood: Mood): HarmonyMood {
  return MOOD_TO_ENGINE_MOOD[mood] ?? "moody";
}

function mapComplexityToDepth(complexity: ComplexityLevel): HarmonyDepth {
  // Backstop bridge for call sites that still pass complexity.
  if (complexity <= 0) return 0;
  if (complexity === 1) return 1;
  return 2;
}
