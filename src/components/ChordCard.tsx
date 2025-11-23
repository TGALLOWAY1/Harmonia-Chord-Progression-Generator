"use client";

interface ChordCardProps {
  chordName: string;
  romanNumeral: string;
  isActive: boolean;
}

export default function ChordCard({
  chordName,
  romanNumeral,
  isActive,
}: ChordCardProps) {
  return (
    <div
      className={`
        rounded-2xl px-6 py-8
        flex flex-col items-center justify-center
        transition-colors duration-200
        ${isActive 
          ? "bg-stone-200 border border-stone-300" 
          : "bg-stone-50 border border-stone-100"
        }
      `}
    >
      <div className="text-3xl font-medium text-stone-700 mb-2">
        {chordName}
      </div>
      <div className="text-sm text-stone-500">
        {romanNumeral}
      </div>
    </div>
  );
}

