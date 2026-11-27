import type { FeedStory } from "@/types/story";
import type { CirclePeer, CircleSuggestion } from "@/types/community";
import type { NavBadges } from "@/types/nav";
import { circlePeersMock, homeFeedMock, navBadgesMock, suggestedCirclesMock } from "./mocks/home";

// Personal data: different for every person, so never cached (unlike the landing page's data).
// When the endpoints exist, these call the API server-side with the forwarded session cookie, like getCurrentUser.

export async function getHomeFeed(now: Date): Promise<FeedStory[]> {
  // Later: GET /feed
  return homeFeedMock(now.getTime());
}

export async function getSuggestedCircles(): Promise<CircleSuggestion[]> {
  // Later: GET /circles/suggested
  return suggestedCirclesMock;
}

export async function getCirclePeers(): Promise<CirclePeer[]> {
  // Later: GET /circles/presence
  return circlePeersMock;
}

export async function getNavBadges(): Promise<NavBadges> {
  // Later: GET /me/badges
  return navBadgesMock;
}
