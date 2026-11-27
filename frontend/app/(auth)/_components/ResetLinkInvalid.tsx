import Link from "next/link";
import { useTranslations } from "next-intl";
import { buttonStyles } from "@/components/ui/buttonStyles";
import { routes } from "@/lib/routes";
import { AuthPanel } from "./AuthPanel";

// Shown when the page opens with a dead link, and when a link dies while the form is open.
// Works on the server and in the browser (next-intl's useTranslations runs in both).
export function ResetLinkInvalid() {
  const t = useTranslations("auth.resetPassword.invalid");

  return (
    <AuthPanel alignTop title={t("title")} subtitle={t("subtitle")}>
      <div className="flex flex-col gap-3">
        <Link href={routes.forgotPassword} className={`${buttonStyles("primary", "lg")} w-full`}>
          {t("cta")}
        </Link>
        <Link href={routes.signIn} className={`${buttonStyles("secondary", "lg")} w-full`}>
          {t("back")}
        </Link>
      </div>
    </AuthPanel>
  );
}
