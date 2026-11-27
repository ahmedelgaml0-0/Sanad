"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useResendVerification } from "@/hooks/auth/useResendVerification";

// Matches the backend's one-email-a-minute rule, so the button never promises an email that won't be sent.
const RESEND_SECONDS = 60;

export function ResendVerificationButton() {
  const t = useTranslations("app.verifyBanner");
  const tErrors = useTranslations("auth.errors");
  const { resend, loading, errorKey } = useResendVerification();
  const [cooldown, setCooldown] = useState(0);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleClick() {
    setSent(false);
    if ((await resend()) !== null) {
      setSent(true);
      setCooldown(RESEND_SECONDS);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading || cooldown > 0}
        className="inline-flex min-h-9 items-center font-bold underline underline-offset-4 hover:text-primary-solid disabled:cursor-default disabled:no-underline disabled:opacity-70"
      >
        {loading ? t("sending") : cooldown > 0 ? t("resendIn", { seconds: cooldown }) : t("resend")}
      </button>
      {/* Always present, only filled in when something happens: screen readers announce changes to a live region. */}
      <span role="status" className={sent || errorKey ? "font-semibold" : "sr-only"}>
        {errorKey ? tErrors(errorKey) : sent ? t("sent") : ""}
      </span>
    </>
  );
}
