import type { CheckInInput } from "@/types/checkin";
import { mockDelay } from "./mocks/delay";

// POST /check-ins → saves today's mood and private note (one per day; saving again replaces it).
export async function saveCheckIn(input: CheckInInput): Promise<{ saved: true }> {
  // Later: return apiRequest("/check-ins", { method: "POST", body: JSON.stringify(input) });
  void input;
  await mockDelay();
  return { saved: true };
}
