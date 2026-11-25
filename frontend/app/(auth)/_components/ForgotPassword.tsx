"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { MailCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/FormAlert";
import { TextField } from "@/components/ui/TextField";
import { useRequestPasswordReset } from "@/hooks/auth/useRequestPasswordReset";
import { routes } from "@/lib/routes";
import { checkEmail, type AuthErrorKey } from "@/lib/validation/auth";
import { AuthPanel } from "./AuthPanel";
import { useFocusFirstError } from "./useFocusFirstError";

// Matches the backend's rate limit spirit: one resend a minute is plenty, and stops accidental double-sends.
const RESEND_SECONDS = 60;

const linkStyles = "font-semibold text-ink underline underline-offset-4 hover:text-primary-solid";

export function ForgotPassword() {
  const t = useTranslations("auth");
  const { send, loading, errorKey } = useRequestPasswordReset();
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<AuthErrorKey | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [resent, setResent] = useState(false);
  const formRef = useFocusFirstError(attempt);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // The countdown only ticks while there's something to count; the effect cleans its timer up each second.
  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // When the form turns into "check your email", screen readers and keyboard users start from the new heading.
  useEffect(() => {
    if (sentTo) headingRef.current?.focus();
  }, [sentTo]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem = checkEmail(email);
    setFieldError(problem);
    if (problem) {
      setAttempt((n) => n + 1);
      return;
    }
    const address = email.trim();
    if ((await send({ email: address })) !== null) {
      setSentTo(address);
      setCooldown(RESEND_SECONDS);
    }
  }

  async function resend() {
    if (!sentTo) return;
    setResent(false);
    if ((await send({ email: sentTo })) !== null) {
      setResent(true);
      setCooldown(RESEND_SECONDS);
    }
  }

  function startOver() {
    setSentTo(null);
    setResent(false);
    setCooldown(0);
  }

  if (sentTo) {
    return (
      <AuthPanel
        alignTop
        headingRef={headingRef}
        title={
          <span className="flex flex-col gap-5">
            <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-surface text-forest">
              <MailCheck className="size-7" strokeWidth={1.5} />
            </span>
            {t("forgotPassword.sent.title")}
          </span>
        }
        subtitle={t.rich("forgotPassword.sent.subtitle", {
          email: (chunks) => <strong className="font-bold text-ink wrap-anywhere">{chunks}</strong>,
          address: sentTo,
        })}
      >
        <p className="text-[15px]">{t("forgotPassword.sent.spam")}</p>

        {errorKey && <FormAlert>{t(`errors.${errorKey}`)}</FormAlert>}
        {/* role="status": announced politely, without interrupting like an alert would. Always present (only hidden
            visually when empty), because screen readers only announce changes to a live region that already exists. */}
        <p role="status" className={resent ? "text-sm font-semibold text-forest" : "sr-only"}>
          {resent ? t("forgotPassword.sent.resent") : ""}
        </p>

        <div className="flex flex-col gap-3">
          <Link href={routes.signIn} className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary-solid px-7 font-semibold text-on-solid transition-colors hover:bg-primary-hover">
            {t("forgotPassword.sent.back")}
          </Link>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={resend}
            disabled={cooldown > 0}
            loading={loading}
            loadingLabel={t("forgotPassword.sent.resending")}
          >
            {cooldown > 0 ? t("forgotPassword.sent.resendIn", { seconds: cooldown }) : t("forgotPassword.sent.resend")}
          </Button>
        </div>

        <p className="text-center text-[15px]">
          <button type="button" onClick={startOver} className={`min-h-11 ${linkStyles}`}>
            {t("forgotPassword.sent.differentEmail")}
          </button>
        </p>
      </AuthPanel>
    );
  }

  return (
    <AuthPanel alignTop title={t("forgotPassword.title")} subtitle={t("forgotPassword.subtitle")}>
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {errorKey && <FormAlert>{t(`errors.${errorKey}`)}</FormAlert>}
        <TextField
          id="email"
          name="email"
          type="email"
          label={t("fields.email.label")}
          placeholder={t("fields.email.placeholder")}
          error={fieldError ? t(`errors.${fieldError}`) : null}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldError) setFieldError(null);
          }}
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          autoFocus
          required
        />
        <Button type="submit" size="lg" className="w-full" loading={loading} loadingLabel={t("forgotPassword.submitting")}>
          {t("forgotPassword.submit")}
        </Button>
      </form>

      <p className="text-center text-[15px]">
        {t.rich("forgotPassword.switch", {
          link: (chunks) => (
            <Link href={routes.signIn} className={linkStyles}>
              {chunks}
            </Link>
          ),
        })}
      </p>
    </AuthPanel>
  );
}
