import Link from "next/link";
import { House, MessageCircle, Plus, UserRound, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { routes } from "@/lib/routes";
import type { NavBadges } from "@/types/nav";
import { TabLink } from "./TabLink";

const icon = "size-6";

// Phones only: the main destinations sit where thumbs reach, with sharing a story as the centre action.
export async function MobileTabBar({ badges }: { badges: NavBadges }) {
  const t = await getTranslations("app.nav");

  return (
    <nav
      aria-label={t("label")}
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 items-center border-t border-border bg-surface px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <TabLink href={routes.app} label={t("home")} icon={<House aria-hidden="true" className={icon} strokeWidth={1.75} />} />
      <TabLink href={routes.communities} label={t("circles")} icon={<Users aria-hidden="true" className={icon} strokeWidth={1.75} />} />
      <Link
        href={routes.newStory}
        className="mx-auto grid size-13 place-items-center rounded-full bg-primary-solid text-on-solid shadow-card hover:bg-primary-hover"
      >
        <Plus aria-hidden="true" className={icon} strokeWidth={2.25} />
        <span className="sr-only">{t("share")}</span>
      </Link>
      <TabLink
        href={routes.messages}
        label={t("messages")}
        icon={<MessageCircle aria-hidden="true" className={icon} strokeWidth={1.75} />}
        unreadLabel={badges.messages ? t("unread") : undefined}
      />
      <TabLink href={routes.profile} label={t("profileShort")} icon={<UserRound aria-hidden="true" className={icon} strokeWidth={1.75} />} />
    </nav>
  );
}
