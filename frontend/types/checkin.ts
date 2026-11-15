// Ordered from lowest to highest; the order is also the order on screen.
export const MOODS = ["veryLow", "low", "okay", "good", "great"] as const;
export type Mood = (typeof MOODS)[number];

export type CheckInInput = {
  mood: Mood;
  note: string;
};
