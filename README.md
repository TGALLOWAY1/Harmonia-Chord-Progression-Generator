# Harmonia

A generative chord progression generator with intelligent harmony, beautiful voicings, and interactive controls. Built with a Scandinavian Minimalism aesthetic.

<img width="1128" height="822" alt="image" src="https://github.com/user-attachments/assets/d16b472d-db67-4e51-bcb8-52cf215a0121" />

## Features

### 🎹 Intelligent Chord Generation
- **Markov Chain Engine**: Uses probabilistic transitions to generate musically coherent progressions
- **Mood-Based Generation**: 5 distinct moods that influence chord selection and modal characteristics:
  - **Melancholic** (sad): Soft minor, plagal cadences
  - **Dark**: Phrygian mode, chromatic tension
  - **Moody** (neutral): Dorian mode, drifting progressions
  - **Optimistic** (hopeful): Lydian mode, uplifting progressions
  - **Happy**: Ionian mode, classic pop cadences

### 🎚️ Complexity Levels
Four levels of harmonic sophistication:
- **Simple** (0): Triads only
- **Standard** (1): 7th chords (maj7, m7, dom7)
- **Color** (2): Add9, Sus2, Sus4 extensions
- **Jazz** (3): Advanced extensions (9, 11, 13)

### 🎵 Interactive Controls
- **Chord Locking**: Lock individual chords to preserve them during regeneration
- **Individual Re-roll**: Regenerate a single chord while keeping others intact
- **Click-to-Play**: Click any chord card to jump playback to that position
- **BPM Control**: Adjustable tempo (60-180 BPM)
- **Scale & Key Selection**: Choose root note and major/minor mode

### 🎨 Rich Chord Display
Each chord card shows:
- **Chord Symbol**: Large, prominent display (e.g., "Dm7")
- **Roman Numeral**: Scale degree notation (e.g., "i", "IV")
- **Voiced Notes**: Actual MIDI notes being played (e.g., "D3  F4  A4  C5")

### 🔊 Audio Playback
- **Real-time Synthesis**: PolySynth with FM synthesis for warm, dreamy textures
- **Effects Chain**: Reverb, chorus, and low-pass filtering
- **Smooth Voice-leading**: Automatic voicing optimization using Mud Cut algorithm
- **Loop Playback**: Seamless 4-chord loop with visual highlighting

### 💾 MIDI Export
- Export progressions as standard MIDI files
- Preserves tempo, chord voicings, and timing
- Compatible with all major DAWs (Ableton, Logic, FL Studio, etc.)

## Tech Stack

- **Framework**: Next.js 16+ (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Music Theory**: Tonal.js for chord analysis and note manipulation
- **Audio Engine**: Tone.js for synthesis and playback
- **MIDI Export**: @tonejs/midi
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TGALLOWAY1/Harmonia-Chord-Progression-Generator.git
cd Harmonia-Chord-Progression-Generator
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
harmonia/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── src/
│   ├── components/        # React components
│   │   ├── ChordCard.tsx  # Individual chord display with controls
│   │   ├── Timeline.tsx  # Progression timeline
│   │   ├── Transport.tsx # Playback controls
│   │   ├── MoodControl.tsx # Mood selector
│   │   ├── ScaleSelector.tsx # Key/scale selector
│   │   └── ComplexitySlider.tsx # Complexity control
│   ├── hooks/
│   │   └── useAudioEngine.ts # Tone.js audio engine
│   ├── lib/
│   │   ├── theory.ts      # Music theory utilities
│   │   ├── midiExport.ts  # MIDI export functionality
│   │   └── utils.ts       # General utilities
│   ├── logic/
│   │   └── harmonyEngine.ts # Markov chain harmony generator
│   ├── audio/
│   │   └── voicing.ts     # Voicing algorithms (Mud Cut)
│   └── store/
│       └── useAppStore.ts # Zustand state management
└── types/                 # TypeScript definitions
```

## Usage

### Generating Progressions

1. **Select Mood**: Choose from 5 moods to influence the harmonic character
2. **Set Complexity**: Adjust the slider to control chord sophistication
3. **Choose Key & Mode**: Select root note and major/minor mode
4. **Regenerate**: Click "Regenerate" to create a new progression

### Interactive Chord Editing

- **Lock a Chord**: Click the lock icon (🔒) on any chord card to preserve it during regeneration
- **Re-roll a Chord**: Click the refresh icon (🔄) to regenerate just that chord
- **Jump to Chord**: Click anywhere on a chord card to start playback from that position

### Playback

- **Play/Pause**: Use the transport controls at the bottom
- **Adjust BPM**: Use the slider to change tempo (60-180 BPM)
- **Visual Feedback**: The active chord is highlighted during playback

### Exporting

- Click "Export MIDI" to download the current progression as a `.mid` file
- The file includes tempo, all chord voicings, and proper timing
- Import into your DAW for further arrangement

## Architecture

### Harmony Engine

The core generation uses a **Markov chain** with mood-specific transition probabilities. Each mood defines:
- Default mode (Ionian, Aeolian, Dorian, etc.)
- Transition probabilities between scale degrees
- Complexity mappings for chord qualities

### Voicing System

Chords are voiced using the **Mud Cut** algorithm, which:
- Optimizes voice-leading between chords
- Maintains smooth transitions
- Applies open voicing strategy by default
- Considers previous chord context

### Audio Engine

Built on Tone.js with:
- **PolySynth**: FM synthesis for warm, organic sounds
- **Effects Chain**: Reverb → Chorus → Low-pass Filter
- **Transport**: Precise timing with lookahead scheduling
- **Humanization**: Subtle timing variations for natural feel

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript strict mode
- Functional components with hooks
- Zustand for state management
- Tailwind CSS for styling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is private and proprietary.

## Acknowledgments

- **Tonal.js** for music theory calculations
- **Tone.js** for audio synthesis
- **Markov Chain** algorithm for harmonic generation
- **Mud Cut** voicing algorithm for smooth voice-leading

---

Built with ❤️ for music makers
