"use client";

import { verifyEmail } from "@/lib/api/auth";
import { useApiAction } from "../useApiAction";

// Stays on the page afterwards (it turns into "Email confirmed"), so loading settles after success.
export function useVerifyEmail() {
  const { run, loading, errorKey } = useApiAction(verifyEmail, { settleOnSuccess: true });
  return { confirm: run, loading, errorKey };
}
