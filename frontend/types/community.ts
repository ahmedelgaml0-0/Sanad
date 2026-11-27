// The shape the backend will return for a community (circle) card.
export type CommunityPreview = {
  id: string;
  slug: string;
  name: string;
  description: string;
  memberCount: number;
  onlineCount: number;
  illustrationUrl: string;
};

// A circle the signed-in person hasn't joined yet.
export type CircleSuggestion = Pick<CommunityPreview, "id" | "slug" | "name" | "memberCount" | "illustrationUrl">;

// A few people from your circles, shown on the "You're not alone" card.
export type CirclePeer = {
  penName: string;
  avatarUrl: string | null;
};
