"use client";

import { resendVerificationEmail } from "@/lib/api/auth";
import { useApiAction } from "../useApiAction";

export function useResendVerification() {
  const { run, loading, errorKey } = useApiAction(resendVerificationEmail, { settleOnSuccess: true });
  return { resend: run, loading, errorKey };
}
