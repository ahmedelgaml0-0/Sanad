// One place for app paths, so a renamed route is a one-line change.
export const routes = {
  home: "/",
  signIn: "/sign-in",
  signUp: "/sign-up",
  forgotPassword: "/forgot-password",
  // The link in the reset email points here; the backend builds it, so the two paths must match.
  resetPassword: "/reset-password",
  // First Google sign-up only; the backend redirects here and must use the same path.
  choosePenName: "/choose-pen-name",
  // Where people land after signing in (the signed-in app home).
  app: "/home",
  demo: "/demo",
  stories: "/stories",
  story: (slug: string) => `/stories/${slug}`,
  // Labelled "Circles" in the app; the path is renamed together with the landing copy later.
  communities: "/communities",
  community: (slug: string) => `/communities/${slug}`,
  newStory: "/stories/new",
  search: "/search",
  messages: "/messages",
  notifications: "/notifications",
  saved: "/saved",
  profile: "/profile",
  settings: "/settings",
  about: "/about",
  terms: "/terms",
  guidelines: "/guidelines",
  privacy: "/privacy",
  contact: "/contact",
} as const;
