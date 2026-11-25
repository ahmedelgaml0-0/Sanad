"use client";

import { requestPasswordReset } from "@/lib/api/auth";
import { useApiAction } from "../useApiAction";

// Used for the first send and for "send it again", so the page stays put and loading must settle after success.
export function useRequestPasswordReset() {
  const { run, loading, errorKey } = useApiAction(requestPasswordReset, { settleOnSuccess: true });
  return { send: run, loading, errorKey };
}
