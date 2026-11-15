import type { ReactionKind } from "@/types/story";
import { mockDelay } from "./mocks/delay";

// PUT adds the reaction, DELETE removes it: the same request twice changes nothing (idempotent).
export async function setReaction(storyId: string, kind: ReactionKind, on: boolean): Promise<void> {
  // Later: apiRequest(`/stories/${storyId}/reactions/${kind}`, { method: on ? "PUT" : "DELETE" });
  void [storyId, kind, on];
  await mockDelay(150);
}

export async function setSaved(storyId: string, on: boolean): Promise<void> {
  // Later: apiRequest(`/stories/${storyId}/save`, { method: on ? "PUT" : "DELETE" });
  void [storyId, on];
  await mockDelay(150);
}
