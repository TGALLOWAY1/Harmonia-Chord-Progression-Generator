import { Chord as TonalChord, Scale, Note } from "@tonaljs/tonal";

// D Minor (Aeolian) scale notes
const SCALE_NOTES = Scale.get("D aeolian").notes; // D, E, F, G, A, Bb, C

// Roman numerals for D minor (Aeolian) with corresponding chord symbols
// Using 7th chords for richer harmony
const CHORD_MAP: Array<{ symbol: string; roman: string }> = [
  { symbol: "Dm7", roman: "i7" },
  { symbol: "Edim7", roman: "ii°7" },
  { symbol: "Fmaj7", roman: "III7" },
  { symbol: "Gm7", roman: "iv7" },
  { symbol: "Am7", roman: "v7" },
  { symbol: "Bbmaj7", roman: "VI7" },
  { symbol: "C7", roman: "VII7" },
];

export type ChordObject = {
  symbol: string;
  notes: string[];
  roman: string;
};

/**
 * Generate a random 4-chord progression in D Minor (Aeolian)
 * Returns an array of chord objects with symbol, notes (with octaves), and roman numeral
 */
export function generateDMinorProgression(): ChordObject[] {
  const progression: ChordObject[] = [];
  
  // Randomly select 4 chords from the D Minor scale
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * CHORD_MAP.length);
    const chordData = CHORD_MAP[randomIndex];
    
    // Get chord notes using Tonal.js
    const chord = TonalChord.get(chordData.symbol);
    const chordNotes = chord.notes || [];
    
    // Add octave numbers to notes (starting from D3)
    // Map each note to a specific octave for better voicing
    const notesWithOctaves = chordNotes.map((note, index) => {
      // Determine octave based on note position in chord
      // Root and third in octave 3, fifth and seventh in octave 4
      let octave = index < 2 ? 3 : 4;
      
      // Use Tonal.js Note to properly format the note with octave
      const noteObj = Note.get(note);
      if (!noteObj.name) {
        // Fallback if note parsing fails
        return `${note}${octave}`;
      }
      
      return `${noteObj.name}${octave}`;
    });
    
    progression.push({
      symbol: chordData.symbol,
      notes: notesWithOctaves,
      roman: chordData.roman,
    });
  }
  
  return progression;
}

