import { getTranslations } from "next-intl/server";
import { ResendVerificationButton } from "./ResendVerificationButton";

// Calm, not blocking: people can look around first. Posting and chatting will require a confirmed email.
export async function VerifyEmailBanner({ email }: { email: string }) {
  const t = await getTranslations("app.verifyBanner");

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 bg-peach px-4 py-2.5 text-center text-sm text-peach-ink">
      <p>
        {t.rich("text", {
          address: email,
          email: (chunks) => <strong className="font-bold wrap-anywhere">{chunks}</strong>,
        })}
      </p>
      <ResendVerificationButton />
    </div>
  );
}
