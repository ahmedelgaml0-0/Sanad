import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { VerifyEmail } from "../_components/VerifyEmail";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.verifyEmail");
  // The URL holds a secret token: never send it to another site in the Referer header.
  return { title: t("metaTitle"), robots: { index: false }, referrer: "no-referrer" };
}

// Reading ?token makes this part per-request; Suspense keeps the rest of the page static.
export default function VerifyEmailPage({ searchParams }: PageProps<"/verify-email">) {
  return (
    <Suspense fallback={null}>
      <VerifyEmailGate searchParams={searchParams} />
    </Suspense>
  );
}

async function VerifyEmailGate({ searchParams }: { searchParams: PageProps<"/verify-email">["searchParams"] }) {
  const { token } = await searchParams;
  return <VerifyEmail token={typeof token === "string" && token ? token : null} />;
}
