import Link from "next/link";
import { Bell } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Avatar } from "@/components/ui/Avatar";
import { Logo } from "@/components/ui/Logo";
import { routes } from "@/lib/routes";
import type { AuthUser } from "@/types/auth";
import type { NavBadges } from "@/types/nav";

// Phones only: there's no rail, so the logo, notifications and profile live in a slim header.
export async function MobileHeader({ user, badges }: { user: AuthUser; badges: NavBadges }) {
  const t = await getTranslations("app.nav");

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-background/90 px-4 py-2 backdrop-blur md:hidden">
      <Logo href={routes.app} className="h-7 w-auto" />
      <div className="flex items-center gap-1">
        <Link href={routes.notifications} className="relative grid size-11 place-items-center rounded-full text-olive-ink hover:text-ink">
          <Bell aria-hidden="true" className="size-6" strokeWidth={1.75} />
          {badges.notifications && <span aria-hidden="true" className="absolute end-2.5 top-2.5 size-2.5 rounded-full bg-notify ring-2 ring-background" />}
          <span className="sr-only">
            {t("notifications")}
            {badges.notifications && `, ${t("unread")}`}
          </span>
        </Link>
        <Link href={routes.profile} className="grid size-11 place-items-center rounded-full">
          <Avatar name={user.penName} src={user.avatarUrl} size={34} className="text-xs" />
          <span className="sr-only">{t("profile")}</span>
        </Link>
      </div>
    </header>
  );
}
