import Link from "next/link";
import { Bell, BookOpen, Bookmark, House, MessageCircle, Search, Settings, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Avatar } from "@/components/ui/Avatar";
import { LogoMark } from "@/components/ui/Logo";
import { routes } from "@/lib/routes";
import type { AuthUser } from "@/types/auth";
import type { NavBadges } from "@/types/nav";
import { railLabel, railRow } from "./navStyles";
import { RailLink } from "./RailLink";
import { SignOutButton } from "./SignOutButton";

const icon = "size-6";

// Desktop and tablet navigation. Collapsed, it's an 80px icon rail that the page always leaves room for.
// It widens on hover (after a short delay, so passing the mouse doesn't trigger it) or keyboard focus,
// and the page slides aside to make room (see AppShell). Pure CSS: no JavaScript needed for the expand.
export async function Sidebar({ user, badges }: { user: AuthUser; badges: NavBadges }) {
  const t = await getTranslations("app.nav");
  const unread = t("unread");

  return (
    <nav
      aria-label={t("label")}
      className="group peer fixed inset-y-0 start-0 z-40 hidden w-20 flex-col gap-6 overflow-x-hidden border-e border-border bg-surface px-4 py-6 transition-[width,box-shadow] duration-200 ease-out hover:w-60 hover:shadow-float hover:delay-150 has-focus-visible:w-60 has-focus-visible:shadow-float motion-reduce:transition-none md:flex"
    >
      <Link href={routes.app} className={`${railRow} hover:bg-cream`}>
        <LogoMark className="h-8 w-7 shrink-0" />
        <span className={`${railLabel} font-serif text-2xl font-medium text-ink`}>Sanad</span>
      </Link>

      <ul className="flex flex-col gap-1.5">
        <li><RailLink href={routes.app} label={t("home")} icon={<House aria-hidden="true" className={icon} strokeWidth={1.75} />} /></li>
        <li><RailLink href={routes.search} label={t("search")} icon={<Search aria-hidden="true" className={icon} strokeWidth={1.75} />} /></li>
        <li><RailLink href={routes.communities} label={t("circles")} icon={<Users aria-hidden="true" className={icon} strokeWidth={1.75} />} /></li>
        <li><RailLink href={routes.stories} label={t("stories")} icon={<BookOpen aria-hidden="true" className={icon} strokeWidth={1.75} />} /></li>
        <li>
          <RailLink
            href={routes.messages}
            label={t("messages")}
            icon={<MessageCircle aria-hidden="true" className={icon} strokeWidth={1.75} />}
            unreadLabel={badges.messages ? unread : undefined}
          />
        </li>
        <li>
          <RailLink
            href={routes.notifications}
            label={t("notifications")}
            icon={<Bell aria-hidden="true" className={icon} strokeWidth={1.75} />}
            unreadLabel={badges.notifications ? unread : undefined}
          />
        </li>
        <li><RailLink href={routes.saved} label={t("saved")} icon={<Bookmark aria-hidden="true" className={icon} strokeWidth={1.75} />} /></li>
      </ul>

      <ul className="mt-auto flex flex-col gap-1.5">
        <li><RailLink href={routes.profile} label={t("profile")} icon={<Avatar name={user.penName} src={user.avatarUrl} size={28} className="text-[10px]" />} /></li>
        <li><RailLink href={routes.settings} label={t("settings")} icon={<Settings aria-hidden="true" className={icon} strokeWidth={1.75} />} /></li>
        <li><SignOutButton label={t("signOut")} loadingLabel={t("signingOut")} /></li>
      </ul>
    </nav>
  );
}
