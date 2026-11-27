"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/FormAlert";
import { PasswordField } from "@/components/ui/PasswordField";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { routes } from "@/lib/routes";
import { checkNewPassword, PASSWORD_MAX, type AuthErrorKey } from "@/lib/validation/auth";
import { AuthPanel } from "./AuthPanel";
import { ResetLinkInvalid } from "./ResetLinkInvalid";
import { useFocusFirstError } from "./useFocusFirstError";

const linkStyles = "font-semibold text-ink underline underline-offset-4 hover:text-primary-solid";

export function ResetPasswordForm({ token }: { token: string }) {
  const t = useTranslations("auth");
  const { submit, loading, errorKey } = useResetPassword();
  const [password, setPassword] = useState("");
  const [fieldError, setFieldError] = useState<AuthErrorKey | null>(null);
  const [attempt, setAttempt] = useState(0);
  const formRef = useFocusFirstError(attempt);

  // The link can die while the form is open (30 minutes pass, or it's used in another tab).
  if (errorKey === "RESET_TOKEN_INVALID") return <ResetLinkInvalid />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const problem = checkNewPassword(password);
    setFieldError(problem);
    if (problem) {
      setAttempt((n) => n + 1);
      return;
    }
    await submit({ token, password });
  }

  return (
    <AuthPanel alignTop title={t("resetPassword.title")} subtitle={t("resetPassword.subtitle")}>
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {errorKey && <FormAlert>{t(`errors.${errorKey}`)}</FormAlert>}
        <PasswordField
          id="password"
          name="password"
          label={t("resetPassword.label")}
          hint={t("fields.password.hint")}
          error={fieldError ? t(`errors.${fieldError}`) : null}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldError) setFieldError(null);
          }}
          // Tells password managers to offer a strong new password and save it.
          autoComplete="new-password"
          maxLength={PASSWORD_MAX}
          showLabel={t("fields.password.show")}
          hideLabel={t("fields.password.hide")}
          autoFocus
          required
        />
        <Button type="submit" size="lg" className="w-full" loading={loading} loadingLabel={t("resetPassword.submitting")}>
          {t("resetPassword.submit")}
        </Button>
      </form>

      <p className="text-center text-[15px]">
        {t.rich("resetPassword.switch", {
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
