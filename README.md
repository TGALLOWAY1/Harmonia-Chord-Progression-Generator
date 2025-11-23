# Harmonia

A minimal chord progression generator for D Minor (Aeolian) with a Scandinavian Minimalism aesthetic.

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Music Theory**: Tonal.js
- **Audio Engine**: Tone.js
- **MIDI Export**: @tonejs/midi

## MVP Constraints

- Scale is locked to D Minor (Aeolian)
- Progressions are strictly 4 chords long
- Visual Aesthetic: Scandinavian Minimalism (soft greys, off-whites, rounded corners, pill-shaped buttons)

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
harmonia/
├── app/              # Next.js App Router pages
├── components/       # React components
├── lib/             # Utility functions (music theory)
├── store/           # Zustand state management
└── types/           # TypeScript type definitions
```

## Features

- Generate random 4-chord progressions in D Minor
- Display chord symbols, roman numerals, and notes
- Clean, minimal Scandinavian design
