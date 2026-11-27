"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/api/auth";
import { routes } from "@/lib/routes";
import { useApiAction } from "../useApiAction";

export function useSignOut() {
  const router = useRouter();
  const { run, loading } = useApiAction(signOut);

  async function signOutNow() {
    await run();
    // replace: Back shouldn't return to a signed-in page. refresh: drop the server-rendered pages cached for this person.
    router.replace(routes.signIn);
    router.refresh();
  }

  return { signOut: signOutNow, loading };
}
