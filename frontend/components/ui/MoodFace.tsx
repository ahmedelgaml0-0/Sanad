import type { Mood } from "@/types/checkin";

const faces: Record<Mood, { fill: string; mouth: string }> = {
  veryLow: { fill: "fill-mood-very-low", mouth: "M13 28 Q20 22 27 28" },
  low: { fill: "fill-mood-low", mouth: "M13 27 Q20 24 27 27" },
  okay: { fill: "fill-mood-okay", mouth: "M13 26 L27 26" },
  good: { fill: "fill-mood-good", mouth: "M13 25 Q20 29 27 25" },
  great: { fill: "fill-mood-great", mouth: "M12 24 Q20 32 28 24" },
};

// Decorative: the mood's name is always shown next to it as text.
export function MoodFace({ mood, size = 34 }: { mood: Mood; size?: number }) {
  const face = faces[mood];
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" className="stroke-ink">
      <circle cx="20" cy="20" r="18" className={`${face.fill} stroke-none`} />
      <circle cx="14" cy="17" r="2" className="fill-ink stroke-none" />
      <circle cx="26" cy="17" r="2" className="fill-ink stroke-none" />
      <path d={face.mouth} strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
