/**
 * Psychoacoustic chord voicing utilities.
 *
 * Responsibilities:
 * - Normalize raw chord spellings into playable voicings with octaves.
 * - Enforce the "Mud Cut" rule: avoid major/minor 2nds below C3 to keep the low end clear.
 * - Keep bass notes within roughly C2–G3 so the progression feels grounded without booming.
 * - Provide simple voice-leading by nudging each chord's average pitch toward the previous chord.
 */
import { Note } from "@tonaljs/tonal";

export type VoicedChord = {
  notes: string[];
};

const DEFAULT_OCTAVE = 4;
const BASS_MIN = Note.midi("C2") ?? 36;
const BASS_MAX = Note.midi("G3") ?? 55;
const MUD_CUTOFF = Note.midi("C3") ?? 48;
const MAX_ITERATIONS = 8;

export function voiceChord(baseNotes: string[], previousVoicing?: VoicedChord): VoicedChord {
  let voicedMidis = normalizeNotes(baseNotes, true);
  if (voicedMidis.length === 0) {
    return { notes: [] };
  }

  voicedMidis = mapRootIntoBass(voicedMidis);
  voicedMidis = enforceMudCut(voicedMidis);

  if (previousVoicing && previousVoicing.notes.length > 0) {
    const previousMidis = normalizeNotes(previousVoicing.notes, false);
    if (previousMidis.length) {
      voicedMidis = alignAverages(voicedMidis, previousMidis);
      voicedMidis = enforceMudCut(voicedMidis);
    }
  }

  const notes = voicedMidis
    .sort((a, b) => a - b)
    .map((midiValue) => Note.fromMidi(midiValue) ?? "C4");

  return { notes };
}

export function describeVoicing(notes: string[]): string {
  if (!notes.length) return "(empty voicing)";
  return notes.join(" ");
}

function normalizeNotes(notes: string[], allowDefaultOctave: boolean): number[] {
  const midis = notes
    .map((note) => {
      const hasOctave = /\d/.test(note);
      const normalized = hasOctave || !allowDefaultOctave ? note : `${note}${DEFAULT_OCTAVE}`;
      return Note.midi(normalized);
    })
    .filter((value): value is number => typeof value === "number");

  return Array.from(new Set(midis)).sort((a, b) => a - b);
}

function mapRootIntoBass(midis: number[]): number[] {
  if (!midis.length) return [];
  const [root] = midis;
  let shift = 0;

  while (root + shift < BASS_MIN) {
    shift += 12;
  }
  while (root + shift > BASS_MAX) {
    shift -= 12;
  }

  return midis.map((value) => value + shift).sort((a, b) => a - b);
}

function enforceMudCut(midis: number[]): number[] {
  const adjusted = [...midis].sort((a, b) => a - b);

  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    let moved = false;
    for (let i = 0; i < adjusted.length - 1; i++) {
      const low = adjusted[i];
      const high = adjusted[i + 1];
      const interval = high - low;
      if (low < MUD_CUTOFF && (interval === 1 || interval === 2)) {
        adjusted[i + 1] = high + 12;
        moved = true;
        break;
      }
    }
    if (!moved) {
      break;
    }
    adjusted.sort((a, b) => a - b);
  }

  return adjusted;
}

function alignAverages(current: number[], previous: number[]): number[] {
  if (!previous.length || !current.length) return current;
  let result = [...current];
  const previousAverage = average(previous);
  let currentAverage = average(result);
  let iterations = 0;

  while (Math.abs(currentAverage - previousAverage) > 6 && iterations < MAX_ITERATIONS) {
    result = result.map((value) =>
      currentAverage > previousAverage ? value - 12 : value + 12
    );
    currentAverage = average(result);
    iterations++;
  }

  return result.sort((a, b) => a - b);
}

function average(values: number[]): number {
  if (!values.length) return 0;
  const sum = values.reduce((acc, value) => acc + value, 0);
  return sum / values.length;
}

// Example: Csus2 low cluster
// voiceChord(["C2", "D2", "G2"]) -> expected ["C2", "G2", "D3"]

// Example: Smooth leading from Dm to G
// const dMinor = voiceChord(["D", "F", "A"]);
// const gMajor = voiceChord(["G", "B", "D"], dMinor);

