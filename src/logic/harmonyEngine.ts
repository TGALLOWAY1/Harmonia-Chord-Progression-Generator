export type Mode =
  | "ionian"
  | "aeolian"
  | "dorian"
  | "mixolydian"
  | "phrygian";

export type Mood =
  | "melancholic"
  | "moody"
  | "dark"
  | "bright"
  | "happy"
  | "optimistic";

export type Depth = 0 | 1 | 2;

export type Degree =
  | "I"
  | "ii"
  | "iii"
  | "IV"
  | "V"
  | "vi"
  | "vii°"
  | "i"
  | "ii°"
  | "III"
  | "iv"
  | "v"
  | "bVI"
  | "bVII"
  | "bII"
  | "bIII"
  | "II";

export type ChordQuality =
  | ""
  | "m"
  | "dim"
  | "maj7"
  | "m7"
  | "7"
  | "sus2"
  | "sus4"
  | "add9"
  | "m(add9)"
  | "maj(add9)";

export type MoodProfile = {
  id: Mood;
  description: string;
  defaultMode: Mode;
  depthMapping: Record<Depth, ChordQuality[]>;
  transitions: Record<Degree, Record<Degree, number>>;
};

export type GeneratedChord = {
  degree: Degree;
  quality: ChordQuality;
};

export function getMoodProfile(mood: Mood): MoodProfile {
  // TODO: implement in later prompt
  throw new Error("getMoodProfile not implemented yet");
}

export function sampleNextDegree(
  current: Degree,
  profile: MoodProfile,
  options?: { temperature?: number }
): Degree {
  // TODO: implement in later prompt
  throw new Error("sampleNextDegree not implemented yet");
}

