"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MailCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { FormAlert } from "@/components/ui/FormAlert";
import { useVerifyEmail } from "@/hooks/auth/useVerifyEmail";
import { routes } from "@/lib/routes";
import { AuthPanel } from "./AuthPanel";

// A button, not an automatic check on page load: some email apps open every link to scan it, and an automatic
// check would let that scanner confirm an account its owner never created. Only a person presses a button.
export function VerifyEmail({ token }: { token: string | null }) {
  const t = useTranslations("auth.verifyEmail");
  const tErrors = useTranslations("auth.errors");
  const { confirm, loading, errorKey } = useVerifyEmail();
  const [confirmed, setConfirmed] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // When the panel changes, keyboard and screen-reader users start from its new heading.
  useEffect(() => {
    if (confirmed || errorKey === "VERIFY_TOKEN_INVALID") headingRef.current?.focus();
  }, [confirmed, errorKey]);

  if (confirmed) {
    return (
      <AuthPanel
        alignTop
        headingRef={headingRef}
        title={
          <span className="flex flex-col gap-5">
            <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-surface text-forest">
              <MailCheck className="size-7" strokeWidth={1.5} />
            </span>
            {t("done.title")}
          </span>
        }
        subtitle={t("done.subtitle")}
      >
        <Link href={routes.app} className={`${buttonStyles("primary", "lg")} w-full`}>
          {t("done.cta")}
        </Link>
      </AuthPanel>
    );
  }

  if (!token || errorKey === "VERIFY_TOKEN_INVALID") {
    return (
      <AuthPanel alignTop headingRef={headingRef} title={t("invalid.title")} subtitle={t("invalid.subtitle")}>
        <Link href={routes.app} className={`${buttonStyles("primary", "lg")} w-full`}>
          {t("invalid.cta")}
        </Link>
      </AuthPanel>
    );
  }

  return (
    <AuthPanel alignTop title={t("title")} subtitle={t("subtitle")}>
      {errorKey && <FormAlert>{tErrors(errorKey)}</FormAlert>}
      <Button
        type="button"
        size="lg"
        className="w-full"
        loading={loading}
        loadingLabel={t("submitting")}
        onClick={async () => {
          if (await confirm(token)) setConfirmed(true);
        }}
      >
        {t("submit")}
      </Button>
    </AuthPanel>
  );
}
