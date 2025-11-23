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
  const audioContextInitializedRef = useRef(false);
  const scheduleIdRef = useRef<number | null>(null);

  const { isPlaying, bpm, progression, currentChordIndex, nextChord } = useAppStore();

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

  // Initialize synth and reverb - only once on mount
  useEffect(() => {
    // Only create if not already initialized
    if (synthRef.current || reverbRef.current) return;

    // Create reverb
    const reverb = new Tone.Reverb(0.5).toDestination();

    // Create PolySynth with AMSynth
    const synth = new Tone.PolySynth(Tone.AMSynth, {
      volume: -10, // Low volume to avoid jarring sounds
      oscillator: {
        type: "triangle",
      },
    }).connect(reverb);

    // Store in refs so they persist between renders
    synthRef.current = synth;
    reverbRef.current = reverb;

    // Generate reverb impulse response
    reverb.generate();

    // Cleanup function - dispose synth and reverb on unmount
    return () => {
      if (synthRef.current) {
        synthRef.current.dispose();
        synthRef.current = null;
      }
      if (reverbRef.current) {
        reverbRef.current.dispose();
        reverbRef.current = null;
      }
    };
  }, []);

  // Sync BPM with Transport
  useEffect(() => {
    if (Tone.Transport.bpm.value !== bpm) {
      Tone.Transport.bpm.value = bpm;
    }
  }, [bpm]);

  // Schedule Transport loop and sync playback state
  useEffect(() => {
    // Clear any existing schedule
    if (scheduleIdRef.current !== null) {
      Tone.Transport.clear(scheduleIdRef.current);
    }

    // Stop transport if not playing
    if (!isPlaying) {
      Tone.Transport.stop();
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

        // Get current chord based on currentChordIndex from store
        const currentChord = currentState.progression[currentState.currentChordIndex];
        if (!currentChord || !currentChord.notes || currentChord.notes.length === 0) return;

        // Release any currently playing notes
        synth.releaseAll(time);
        
        // Trigger all notes of the current chord
        synth.triggerAttack(currentChord.notes, time);
        
        // Advance to next chord for the next iteration
        currentState.nextChord();
      },
      "1n", // Repeat every whole note
      0 // Start immediately
    );

    scheduleIdRef.current = scheduleId;

    // Start transport if playing
    if (isPlaying && Tone.context.state === "running") {
      Tone.Transport.start();
    }

    return () => {
      Tone.Transport.clear(scheduleId);
    };
  }, [isPlaying, progression]);

  // Handle Transport start/stop based on isPlaying and audio context state
  useEffect(() => {
    if (isPlaying && Tone.context.state === "running") {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
      // Immediately release all notes when stopping/pausing
      if (synthRef.current) {
        synthRef.current.releaseAll();
      }
    }
  }, [isPlaying]);

  // Cleanup on unmount - ensure everything is stopped and disposed
  useEffect(() => {
    return () => {
      // Stop and cancel Transport
      Tone.Transport.stop();
      Tone.Transport.cancel();
      
      // Clear any scheduled events
      if (scheduleIdRef.current !== null) {
        Tone.Transport.clear(scheduleIdRef.current);
        scheduleIdRef.current = null;
      }
      
      // Release all notes and dispose synth
      if (synthRef.current) {
        synthRef.current.releaseAll();
        synthRef.current.dispose();
        synthRef.current = null;
      }
      
      // Dispose reverb
      if (reverbRef.current) {
        reverbRef.current.dispose();
        reverbRef.current = null;
      }
    };
  }, []);
}

