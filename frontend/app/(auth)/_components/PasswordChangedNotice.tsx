"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { FormNotice } from "@/components/ui/FormNotice";

// After a reset the person lands on sign-in with ?reset=done; this confirms it worked.
export function PasswordChangedNotice() {
  const t = useTranslations("auth.signIn");
  if (useSearchParams().get("reset") !== "done") return null;
  return <FormNotice>{t("passwordChanged")}</FormNotice>;
}
