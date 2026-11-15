import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { SESSION_COOKIE } from "@/lib/sessionCookie";
import type { AuthUser } from "@/types/auth";
import { ApiError, apiRequest } from "./client";

// Server-side only: the browser isn't part of this request, so the session cookie is forwarded by hand.
// cache() makes it one /auth/me call per page render, however many components ask.
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const session = (await cookies()).get(SESSION_COOKIE);
  if (!session) return null;

  try {
    const { user } = await apiRequest<{ user: AuthUser }>("/auth/me", {
      headers: { cookie: `${SESSION_COOKIE}=${session.value}` },
    });
    return user;
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
});

// For signed-in pages: a cookie that exists but is expired or revoked ends up here.
export async function requireUser(): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`${routes.signIn}?next=${encodeURIComponent(routes.app)}`);
  return user;
}
