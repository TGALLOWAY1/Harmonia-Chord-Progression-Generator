import Timeline from "@/src/components/Timeline";
import Transport from "@/src/components/Transport";
import AudioController from "@/src/components/AudioController";

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <AudioController />
      
      <main className="container mx-auto px-6 py-16 max-w-6xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-light mb-2 text-foreground">Harmonia</h1>
          <p className="text-text-muted">D Minor (Aeolian) Chord Progressions</p>
        </div>

        <div className="mb-8">
          <Timeline />
        </div>
      </main>

      <Transport />
    </div>
  );
}
