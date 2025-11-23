export type Chord = {
  symbol: string;
  notes: string[];
  romanNumeral: string;
};

export type Progression = {
  id: string;
  chords: Chord[];
  timestamp: number;
};

