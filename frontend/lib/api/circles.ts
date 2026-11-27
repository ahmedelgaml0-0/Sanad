import { mockDelay } from "./mocks/delay";

// POST /circles/:id/members → joins the circle. Membership is what later decides who can post and chat there.
export async function joinCircle(circleId: string): Promise<void> {
  // Later: apiRequest(`/circles/${circleId}/members`, { method: "POST" });
  void circleId;
  await mockDelay();
}
