import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { LeafDecor } from "@/components/ui/LeafDecor";
import { requireUser } from "@/lib/api/auth.server";
import { getNavBadges } from "@/lib/api/home";
import { DemoBanner } from "./DemoBanner";
import { MobileHeader } from "./MobileHeader";
import { MobileTabBar } from "./MobileTabBar";
import { Sidebar } from "./Sidebar";

export async function AppShell({ children }: { children: ReactNode }) {
  const [user, badges, t] = await Promise.all([requireUser(), getNavBadges(), getTranslations("common")]);

  return (
    // --app-gap: the space between the rail and the content. Phones have no rail, so it's plain page padding there.
    // From md up it is "what centring would give", limited to 2rem..6rem (the rail is 5rem wide).
    <div className="relative isolate flex min-h-screen flex-col overflow-x-clip [--app-gap:1rem] sm:[--app-gap:1.5rem] md:[--app-gap:clamp(2rem,calc((100vw_-_76rem)_/_2),6rem)]">
      <a href="#main" className="sr-only z-50 rounded-full bg-surface px-4 py-2 font-semibold text-ink focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
        {t("skipToContent")}
      </a>

      <Sidebar user={user} badges={badges} />
      <MobileHeader user={user} badges={badges} />

      {/* The rail is fixed, so this padding is the room the page keeps for it. When the sidebar opens (the "peer"),
          the page slides aside just far enough to sit 1.5rem from its edge, so nothing is ever covered.
          translate, not padding: the text doesn't re-wrap, it only moves. */}
      <div className="flex flex-1 flex-col transition-transform duration-200 ease-out peer-hover:translate-x-[calc(11.5rem_-_var(--app-gap))] peer-hover:delay-150 peer-has-focus-visible:translate-x-[calc(11.5rem_-_var(--app-gap))] motion-reduce:transition-none md:ps-20 rtl:peer-hover:-translate-x-[calc(11.5rem_-_var(--app-gap))] rtl:peer-has-focus-visible:-translate-x-[calc(11.5rem_-_var(--app-gap))]">
        {user.isDemo && <DemoBanner />}
        <main id="main" className="flex-1">
          {children}
        </main>
      </div>

      <MobileTabBar badges={badges} />

      {/* Decorative sprigs in the bottom corners, behind everything; wide screens only. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 bottom-0 -z-10 hidden xl:block">
        <LeafDecor variant="left" className="bottom-0 start-16 w-36 opacity-50" />
        <LeafDecor variant="right" flip className="end-0 bottom-0 w-40 opacity-50" />
      </div>
    </div>
  );
}
