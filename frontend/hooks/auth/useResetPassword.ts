"use client";

import { useRouter } from "next/navigation";
import { resetPassword } from "@/lib/api/auth";
import { routes } from "@/lib/routes";
import type { ResetPasswordInput } from "@/types/auth";
import { useApiAction } from "../useApiAction";

export function useResetPassword() {
  const router = useRouter();
  const { run, loading, errorKey } = useApiAction(resetPassword);

  async function submit(input: ResetPasswordInput) {
    // resetPassword answers 204 (undefined); useApiAction returns null only on failure.
    if ((await run(input)) !== null) router.replace(`${routes.signIn}?reset=done`);
  }

  return { submit, loading, errorKey };
}
