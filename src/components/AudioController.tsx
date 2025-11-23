"use client";

import { useAudioEngine } from "@/src/hooks/useAudioEngine";

/**
 * Headless component to handle audio engine logic
 * Must be rendered in the component tree to activate Tone.js
 */
export default function AudioController() {
  useAudioEngine();
  return null;
}

