import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Avatar } from "@/components/ui/Avatar";
import { routes } from "@/lib/routes";
import type { AuthUser } from "@/types/auth";

// The whole bar is one link to the composer; the real writing happens on its own page.
export async function Composer({ user }: { user: AuthUser }) {
  const t = await getTranslations("app.composer");

  return (
    <Link
      href={routes.newStory}
      className="flex items-center gap-3 rounded-[1.5rem] bg-surface p-3 pe-5 shadow-card transition-shadow hover:shadow-float"
    >
      <Avatar name={user.penName} src={user.avatarUrl} size={36} className="text-xs" />
      <span className="flex-1 truncate text-[15px] text-muted">{t("prompt")}</span>
      <span className="hidden items-center gap-2 border-s border-border ps-4 text-sm font-semibold text-ink sm:flex">
        <ImageIcon aria-hidden="true" className="size-4" strokeWidth={1.75} />
        {t("action")}
      </span>
    </Link>
  );
}
