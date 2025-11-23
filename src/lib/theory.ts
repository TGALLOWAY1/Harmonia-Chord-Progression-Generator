import { Chord as TonalChord, Scale, Note, Key } from "@tonaljs/tonal";

export type Mood = "happy" | "sad" | "dark" | "hopeful" | "neutral";
export type ScaleMode = "major" | "minor";
export type ComplexityLevel = 0 | 1 | 2 | 3;

// Weights for scale degrees (1-7) based on mood
// Higher number = higher probability of being selected
const MOOD_WEIGHTS: Record<Mood, Record<number, number>> = {
  neutral: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1 },
  sad: { 1: 5, 2: 1, 3: 1, 4: 4, 5: 2, 6: 4, 7: 1 }, // i, iv, VI
  happy: { 1: 1, 2: 1, 3: 5, 4: 2, 5: 4, 6: 3, 7: 5 }, // III, v, VI, VII
  dark: { 1: 5, 2: 4, 3: 1, 4: 3, 5: 3, 6: 1, 7: 1 }, // i, ii°, iv, v
  hopeful: { 1: 2, 2: 1, 3: 3, 4: 2, 5: 2, 6: 5, 7: 4 }, // VI, VII, III
};

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

/**
 * Helper function to select a random item based on weights
 */
function getWeightedRandomIndex(weights: Record<number, number>, maxIndex: number): number {
  const items = Array.from({ length: maxIndex }, (_, i) => i);
  const totalWeight = items.reduce((sum, index) => {
    const degree = index + 1;
    return sum + (weights[degree] || 1);
  }, 0);

  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < items.length; i++) {
    const degree = i + 1;
    const weight = weights[degree] || 1;
    if (random < weight) {
      return i;
    }
    random -= weight;
  }
  
  return items[items.length - 1];
}

/**
 * Modify chord symbol based on complexity level
 */
function getComplexChordSymbol(baseSymbol: string, complexity: ComplexityLevel): string {
  const chord = TonalChord.get(baseSymbol);
  const tonic = chord.tonic;
  const type = chord.type; // "major", "minor", "diminished"
  
  if (!tonic) return baseSymbol;

  // 0: Triads
  if (complexity === 0) {
    // Strip 7ths and extensions
    if (baseSymbol.includes("maj7")) return baseSymbol.replace("maj7", "");
    if (baseSymbol.includes("m7")) return baseSymbol.replace("m7", "m");
    if (baseSymbol.includes("7")) return baseSymbol.replace("7", "");
    // Simple diminished logic
    if (baseSymbol.includes("dim7")) return baseSymbol.replace("dim7", "dim");
    return baseSymbol;
  }

  // 1: Basic 7ths (already default in our logic)
  if (complexity === 1) {
    return baseSymbol;
  }

  // 2: Color Tones (Add9, Sus4)
  if (complexity === 2) {
    const isMajor = baseSymbol.includes("maj7") || (!baseSymbol.includes("m") && !baseSymbol.includes("dim"));
    const isMinor = baseSymbol.includes("m7");
    
    if (Math.random() > 0.5) {
       if (isMajor) return `${tonic}maj9`;
       if (isMinor) return `${tonic}m9`;
    } else {
       if (isMajor) return `${tonic}add9`;
       if (isMinor) return `${tonic}madd9`;
    }
    return baseSymbol;
  }

  // 3: Extensions (9, 11, 13)
  if (complexity === 3) {
    const isMajor = baseSymbol.includes("maj7");
    const isMinor = baseSymbol.includes("m7");
    const isDom = !isMajor && !isMinor && baseSymbol.includes("7"); // Dominant 7

    if (isMajor) return `${tonic}maj13`;
    if (isMinor) return `${tonic}m11`;
    if (isDom) return `${tonic}13`;
    
    // Fallback
    return baseSymbol;
  }

  return baseSymbol;
}

/**
 * Generate a random 4-chord progression dynamically based on key, mood, and complexity
 * @param root Root note (e.g., "C", "F#", "Bb")
 * @param mode Scale mode ("major" or "minor")
 * @param mood The mood to bias the chord selection (default: "neutral")
 * @param complexity Complexity level 0-3 (default: 1)
 */
export function generateProgression(
  root: string = "D", 
  mode: ScaleMode = "minor", 
  mood: Mood = "neutral",
  complexity: ComplexityLevel = 1
): ChordObject[] {
  const progression: ChordObject[] = [];
  const currentWeights = MOOD_WEIGHTS[mood];
  
  // Get scale chords using Tonal.js Key module
  // Start with basic 7ths as base
  const keyChords = mode === "major" 
    ? Key.majorKey(root).chords 
    : Key.minorKey(root).natural.chords;
    
  const grades = mode === "major"
    ? Key.majorKey(root).grades
    : Key.minorKey(root).natural.grades;

  // Select 4 chords from the scale based on mood weights
  for (let i = 0; i < 4; i++) {
    const randomIndex = getWeightedRandomIndex(currentWeights, keyChords.length);
    let chordSymbol = keyChords[randomIndex];
    const romanNumeral = grades[randomIndex];
    
    // Apply complexity logic to modify symbol
    chordSymbol = getComplexChordSymbol(chordSymbol, complexity);
    
    // Get detailed chord info
    const chord = TonalChord.get(chordSymbol);
    const chordNotes = chord.notes || [];
    
    // Apply 'open' voicing strategy
    const voicedNotes = applyVoicing(chordNotes, 'open');
    
    progression.push({
      symbol: chordSymbol,
      notes: voicedNotes,
      roman: romanNumeral,
    });
  }
  
  return progression;
}

export function generateDMinorProgression(mood: Mood = "neutral"): ChordObject[] {
  return generateProgression("D", "minor", mood, 1);
}
