import { Chord as TonalChord, Scale } from "@tonaljs/tonal";

const SCALE_NOTES = Scale.get("D aeolian").notes; // D, E, F, G, A, Bb, C

// Roman numerals for D minor (Aeolian) with corresponding chord symbols
const CHORD_MAP: Array<{ symbol: string; romanNumeral: string }> = [
  { symbol: "Dm", romanNumeral: "i" },
  { symbol: "Edim", romanNumeral: "ii°" },
  { symbol: "F", romanNumeral: "III" },
  { symbol: "Gm", romanNumeral: "iv" },
  { symbol: "Am", romanNumeral: "v" },
  { symbol: "Bb", romanNumeral: "VI" },
  { symbol: "C", romanNumeral: "VII" },
];

/**
 * Get all available chords in D minor (Aeolian)
 */
export function getAvailableChords(): Array<{ symbol: string; romanNumeral: string }> {
  return CHORD_MAP;
}

/**
 * Get chord notes from a chord symbol
 */
export function getChordNotes(chordSymbol: string): string[] {
  try {
    const chord = TonalChord.get(chordSymbol);
    return chord.notes || [];
  } catch {
    return [];
  }
}

/**
 * Get roman numeral for a chord symbol
 */
export function getRomanNumeral(chordSymbol: string): string {
  const chords = getAvailableChords();
  const chord = chords.find((c) => c.symbol === chordSymbol);
  return chord?.romanNumeral || "";
}

/**
 * Generate a random 4-chord progression in D minor
 */
export function generateRandomProgression(): string[] {
  const chords = getAvailableChords();
  const progression: string[] = [];
  
  // Randomly select 4 chords
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * chords.length);
    progression.push(chords[randomIndex].symbol);
  }
  
  return progression;
}

