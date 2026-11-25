import { Suspense } from "react";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { verifyResetToken } from "@/lib/api/auth";
import { AuthPanel } from "../_components/AuthPanel";
import { ResetLinkInvalid } from "../_components/ResetLinkInvalid";
import { ResetPasswordForm } from "../_components/ResetPasswordForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.resetPassword");
  return {
    title: t("metaTitle"),
    robots: { index: false },
    // The URL holds a secret token; never send it to another site in the Referer header.
    referrer: "no-referrer",
  };
}

// The link is checked on the server before anything renders, so a dead link shows "expired" straight away
// instead of after the new password is typed. Reading ?token makes this part per-request, hence Suspense.
export default function ResetPasswordPage({ searchParams }: PageProps<"/reset-password">) {
  return (
    <Suspense fallback={<CheckingLink />}>
      <ResetPasswordGate searchParams={searchParams} />
    </Suspense>
  );
}

async function ResetPasswordGate({ searchParams }: { searchParams: PageProps<"/reset-password">["searchParams"] }) {
  const { token } = await searchParams;
  if (typeof token !== "string" || !token) return <ResetLinkInvalid />;

  const { valid } = await verifyResetToken(token);
  return valid ? <ResetPasswordForm token={token} /> : <ResetLinkInvalid />;
}

function CheckingLink() {
  const t = useTranslations("auth.resetPassword");
  return (
    <AuthPanel alignTop title={t("title")} subtitle={t("checking")}>
      <div aria-hidden="true" className="h-12 animate-pulse rounded-xl bg-surface motion-reduce:animate-none" />
    </AuthPanel>
  );
}
