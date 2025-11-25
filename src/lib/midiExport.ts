import { Midi } from "@tonejs/midi";
import { Note } from "@tonaljs/tonal";
import type { ChordObject } from "@/src/lib/theory";

/**
 * MIDI export assumptions & roadmap
 * ---------------------------------
 * - Timing: Hard-coded 4/4 time signature. Each chord consumes exactly one bar (4 beats).
 * - Structure: Single track containing simultaneous note-on events per chord.
 * - Tempo: Pulled from the UI store and embedded in the MIDI header; DAWs may override.
 *
 * Potential extensions:
 * - Support alternate meters (e.g., 3/4) or per-chord rhythm patterns.
 * - Emit multiple tracks (e.g., bass + pads) or velocity dynamics.
 * - Encode swing, articulations, or per-note durations for strum-like playback.
 * - Include metadata markers (Roman numeral, chord symbol) for DAW timelines.
 */
export function progressionToMidi(
  progression: ChordObject[],
  bpm: number
): Blob {
  const midi = new Midi();
  midi.header.setTempo(bpm);

  const track = midi.addTrack();
  const beatsPerBar = 4; // 4/4 time signature assumption

  progression.forEach((chord, index) => {
    const startBeat = index * beatsPerBar;

    chord.notes.forEach((noteName) => {
      const midiNumber = Note.midi(noteName);
      if (typeof midiNumber !== "number") {
        return;
      }

      track.addNote({
        midi: midiNumber,
        time: startBeat,
        duration: beatsPerBar,
      });
    });

    if (process.env.NODE_ENV === "development") {
      const midiNumbers = chord.notes
        .map((noteName) => Note.midi(noteName))
        .filter((value): value is number => typeof value === "number");
      console.log("[Harmonia][MIDI Export]", {
        symbol: chord.symbol,
        notes: chord.notes,
        midiNumbers,
        startBeat,
        durationBeats: beatsPerBar,
      });
    }
  });

  const bytes = midi.toArray();
  return new Blob([bytes], { type: "audio/midi" });
}

