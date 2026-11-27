// The shape the backend will return for a story card. Mock data in lib/api/mocks follows it exactly.
export type StoryPreview = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  readMinutes: number;
  author: {
    penName: string;
    avatarUrl: string | null; // null → show initials
  };
  // The condition the author chose to show on this story.
  condition: string;
  reactions: {
    relate: number;
    support: number;
  };
};

// A story in the signed-in home feed. "viewer" is what the signed-in person has already done to it.
export type FeedStory = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  createdAt: string; // ISO date
  author: {
    penName: string;
    avatarUrl: string | null;
  };
  circle: {
    name: string;
    slug: string;
  };
  imageUrl: string | null;
  reactions: {
    relate: number;
    support: number;
  };
  commentCount: number;
  viewer: {
    relates: boolean;
    supports: boolean;
    saved: boolean;
  };
};

export type ReactionKind = "relate" | "support";
