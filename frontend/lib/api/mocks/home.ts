import type { FeedStory } from "@/types/story";
import type { CirclePeer, CircleSuggestion } from "@/types/community";
import type { NavBadges } from "@/types/nav";

// Stand-in data until the feed, circles and presence endpoints exist. Delete this file once they do.
const hoursAgo = (now: number, hours: number) => new Date(now - hours * 3_600_000).toISOString();

export function homeFeedMock(now: number): FeedStory[] {
  return [
    {
      id: "f1",
      slug: "a-small-victory-today",
      title: "A small victory today",
      excerpt: "Today I went for a short walk after a difficult week. It wasn’t easy, but I did it. I’m proud of myself. Sending warmth to anyone having a tough day.",
      createdAt: hoursAgo(now, 2),
      author: { penName: "Maya", avatarUrl: "/images/landing/avatar-1.webp" },
      circle: { name: "Crohn’s & IBD", slug: "crohns-ibd" },
      imageUrl: "/images/app/story-mountains.webp",
      reactions: { relate: 24, support: 18 },
      commentCount: 8,
      viewer: { relates: false, supports: false, saved: false },
    },
    {
      id: "f2",
      slug: "little-things-that-helped-my-energy",
      title: "Little things that helped my energy",
      excerpt: "I wanted to share a few things that have made a real difference for me. These might not work for everyone, but they’re worth a try.",
      createdAt: hoursAgo(now, 5),
      author: { penName: "Omar", avatarUrl: "/images/landing/avatar-2.webp" },
      circle: { name: "Chronic Fatigue", slug: "chronic-fatigue" },
      imageUrl: null,
      reactions: { relate: 31, support: 12 },
      commentCount: 5,
      viewer: { relates: true, supports: false, saved: false },
    },
    {
      id: "f3",
      slug: "learning-to-give-myself-a-little-grace",
      title: "Learning to give myself a little grace",
      excerpt: "Rest used to feel like giving up. Slowly I’m learning it’s part of looking after myself, and that some days, enough is just enough.",
      createdAt: hoursAgo(now, 6),
      author: { penName: "Lina", avatarUrl: "/images/landing/avatar-3.webp" },
      circle: { name: "Mental Wellbeing", slug: "mental-wellbeing" },
      imageUrl: null,
      reactions: { relate: 17, support: 22 },
      commentCount: 0,
      viewer: { relates: false, supports: false, saved: true },
    },
  ];
}

export const suggestedCirclesMock: CircleSuggestion[] = [
  { id: "c1", slug: "chronic-pain", name: "Chronic Pain", memberCount: 1800, illustrationUrl: "/images/landing/community-chronic-pain.webp" },
  { id: "c4", slug: "autoimmune-support", name: "Autoimmune Support", memberCount: 1500, illustrationUrl: "/images/landing/community-wellbeing.webp" },
  { id: "c5", slug: "nutrition-lifestyle", name: "Nutrition & Lifestyle", memberCount: 1200, illustrationUrl: "/images/landing/community-crohns.webp" },
];

export const circlePeersMock: CirclePeer[] = [
  { penName: "Maya", avatarUrl: "/images/landing/avatar-1.webp" },
  { penName: "Omar", avatarUrl: "/images/landing/avatar-2.webp" },
  { penName: "Lina", avatarUrl: "/images/landing/avatar-3.webp" },
];

export const navBadgesMock: NavBadges = { messages: true, notifications: true };
