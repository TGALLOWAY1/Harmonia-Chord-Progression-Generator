import Timeline from "@/src/components/Timeline";
import Transport from "@/src/components/Transport";
import AudioController from "@/src/components/AudioController";
import MoodControl from "@/src/components/MoodControl";
import ScaleSelector from "@/src/components/ScaleSelector";
import ComplexitySlider from "@/src/components/ComplexitySlider";

export default function Home() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <AudioController />
      
      <main className="container mx-auto px-6 py-16 max-w-6xl">
        <div className="mb-12 text-center flex flex-col items-center gap-6">
          <div>
            <h1 className="text-4xl font-light mb-2 text-foreground">Harmonia</h1>
            <p className="text-text-muted">Generative Chord Progressions</p>
          </div>
          
          <ScaleSelector />
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-12 mb-12 w-full">
          <MoodControl />
          <div className="hidden md:block w-px h-32 bg-stone-100"></div>
          <ComplexitySlider />
        </div>

        <div className="mb-8">
          <Timeline />
        </div>
      </main>

      <Transport />
    </div>
  );
}
