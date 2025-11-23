"use client";

import { useEffect, useRef } from "react";
import * as Tone from "tone";
import { useAppStore } from "@/src/store/useAppStore";

/**
 * Custom hook to manage Tone.js audio engine
 * Handles PolySynth, Reverb, Transport scheduling, and audio context initialization
 */
export function useAudioEngine() {
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);
  const chorusRef = useRef<Tone.Chorus | null>(null);
  const filterRef = useRef<Tone.Filter | null>(null);
  const audioContextInitializedRef = useRef(false);
  const scheduleIdRef = useRef<number | null>(null);
  
  // Ref to track the playback index independently of the React state
  // This decouples the audio lookahead from the visual state update
  const playbackIndexRef = useRef(0);

  const { isPlaying, bpm, progression, setCurrentChordIndex } = useAppStore();

  // Initialize audio context on first user interaction
  useEffect(() => {
    if (audioContextInitializedRef.current) return;

    // Wait for user interaction to start audio context
    const handleFirstInteraction = async () => {
      if (Tone.context.state !== "running") {
        await Tone.start();
        audioContextInitializedRef.current = true;
      }
    };

    // Listen for any user interaction
    const events = ["click", "touchstart", "keydown"];
    const handlers: Array<() => void> = [];

    events.forEach((event) => {
      const handler = () => {
        handleFirstInteraction();
        // Remove all handlers after first interaction
        handlers.forEach((h, i) => {
          document.removeEventListener(events[i], h);
        });
      };
      document.addEventListener(event, handler, { once: true });
      handlers.push(handler);
    });

    return () => {
      // Cleanup event listeners if component unmounts before interaction
      handlers.forEach((handler, i) => {
        document.removeEventListener(events[i], handler);
      });
    };
  }, []);

  // Initialize synth, reverb, and chorus - only once on mount
  useEffect(() => {
    // Only create if not already initialized
    if (synthRef.current || reverbRef.current) return;

    // Create Reverb: Decay 2.5s, Wetness 0.4 (adds space)
    const reverb = new Tone.Reverb({
      decay: 2.5,
      wet: 0.4
    }).toDestination();

    // Create Chorus: Wetness 0.3, Frequency 4hz (adds width)
    const chorus = new Tone.Chorus({
      frequency: 4,
      delay: 2.5,
      depth: 0.5,
      wet: 0.3
    }).connect(reverb);
    
    // Create Filter: Low-pass at 2000Hz (removes harsh highs)
    const filter = new Tone.Filter(2000, "lowpass").connect(chorus);

    // Create PolySynth with FMSynth for softer, dreamier texture
    const synth = new Tone.PolySynth(Tone.FMSynth, {
      volume: -10,
      harmonicity: 3,
      modulationIndex: 3.5,
      oscillator: {
        type: "fatsawtooth",
        count: 3,
        spread: 30
      },
      envelope: {
        attack: 0.1,
        decay: 0.2,
        sustain: 0.8,
        release: 1.5
      },
      modulation: {
        type: "triangle"
      },
      modulationEnvelope: {
        attack: 0.5,
        decay: 0.1,
        sustain: 1,
        release: 0.5
      }
    }).connect(filter);

    // Store in refs
    synthRef.current = synth;
    reverbRef.current = reverb;
    chorusRef.current = chorus;
    filterRef.current = filter;

    // Generate reverb impulse response
    reverb.generate();

    // Cleanup function
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
        synthRef.current = null;
      }
      if (filterRef.current) {
        filterRef.current.dispose();
        filterRef.current = null;
      }
      if (chorusRef.current) {
        chorusRef.current.dispose();
        chorusRef.current = null;
      }
      if (reverbRef.current) {
        reverbRef.current.dispose();
        reverbRef.current = null;
      }
    };
  }, []);

  // Sync BPM
  useEffect(() => {
    if (Tone.Transport.bpm.value !== bpm) {
      Tone.Transport.bpm.value = bpm;
    }
  }, [bpm]);

  // Schedule Transport loop
  useEffect(() => {
    // Clear any existing schedule
    if (scheduleIdRef.current !== null) {
      Tone.Transport.clear(scheduleIdRef.current);
    }

    // Stop transport if not playing
    if (!isPlaying) {
      Tone.Transport.stop();
      // Reset internal index when stopping so we restart from 0
      playbackIndexRef.current = 0;
      return;
    }

    // Schedule loop that triggers every whole note ("1n")
    const scheduleId = Tone.Transport.scheduleRepeat(
      (time) => {
        const synth = synthRef.current;
        if (!synth) return;

        // Get current state from store inside callback to avoid closure issues
        const currentState = useAppStore.getState();
        if (currentState.progression.length === 0) return;

        // Use internal ref index to determine which chord to play
        // This index advances independently of the store state to handle lookahead
        const currentIndex = playbackIndexRef.current;
        const currentChord = currentState.progression[currentIndex];
        
        if (!currentChord || !currentChord.notes || currentChord.notes.length === 0) return;

        // Release previous notes
        synth.releaseAll(time);
        
        // Humanize timing
        const humanizeOffset = (Math.random() * 0.05) - 0.02;
        const triggerTime = time + 0.05 + humanizeOffset;
        
        // Trigger audio
        synth.triggerAttack(currentChord.notes, triggerTime);
        
        // Schedule visual update using Tone.Draw
        // This ensures the React state updates exactly when the audio starts (or close to it),
        // ignoring the lookahead latency of the Transport callback
        Tone.Draw.schedule(() => {
          setCurrentChordIndex(currentIndex);
        }, time);
        
        // Advance internal index for the NEXT loop iteration
        playbackIndexRef.current = (currentIndex + 1) % 4;
      },
      "1n",
      0
    );

    scheduleIdRef.current = scheduleId;

    // Start transport if playing
    if (isPlaying && Tone.context.state === "running") {
      Tone.Transport.start();
    }

    return () => {
      Tone.Transport.clear(scheduleId);
    };
  }, [isPlaying, progression]); // Re-schedule if progression changes

  // Handle Transport start/stop and cleanup
  useEffect(() => {
    if (isPlaying && Tone.context.state === "running") {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
      if (synthRef.current) {
        synthRef.current.releaseAll();
      }
      // Reset ref on pause/stop
      playbackIndexRef.current = 0;
    }
  }, [isPlaying]);

  // Final cleanup
  useEffect(() => {
    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      
      if (scheduleIdRef.current !== null) {
        Tone.Transport.clear(scheduleIdRef.current);
      }
      
      if (synthRef.current) {
        synthRef.current.releaseAll();
        synthRef.current.dispose();
      }
      if (filterRef.current) filterRef.current.dispose();
      if (chorusRef.current) chorusRef.current.dispose();
      if (reverbRef.current) reverbRef.current.dispose();
    };
  }, []);
}
