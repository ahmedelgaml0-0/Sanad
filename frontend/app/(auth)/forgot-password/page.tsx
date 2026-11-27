import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ForgotPassword } from "../_components/ForgotPassword";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.forgotPassword");
  return { title: t("metaTitle"), robots: { index: false } };
}

// The page itself stays static; the form and its "check your email" state live in one client component.
export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
