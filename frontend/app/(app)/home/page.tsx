import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { DirectionalArrow } from "@/components/ui/DirectionalArrow";
import { LeafDecor } from "@/components/ui/LeafDecor";
import { requireUser } from "@/lib/api/auth.server";
import { getCirclePeers, getHomeFeed, getSuggestedCircles } from "@/lib/api/home";
import { routes } from "@/lib/routes";
import { PageContainer } from "../_components/PageContainer";
import { CheckInCard } from "./_components/CheckInCard";
import { Composer } from "./_components/Composer";
import { DiscoverCircles } from "./_components/DiscoverCircles";
import { FeedStoryCard } from "./_components/FeedStoryCard";
import { Greeting } from "./_components/Greeting";
import { NotAloneCard } from "./_components/NotAloneCard";
import { ThoughtCard } from "./_components/ThoughtCard";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("app");
  return { title: t("metaTitle") };
}

export default async function HomePage() {
  // The session is read first; that makes this page per-request, so "now" is the request's time, not build time.
  const user = await requireUser();
  const now = new Date();
  const [feed, circles, peers, t] = await Promise.all([
    getHomeFeed(now),
    getSuggestedCircles(),
    getCirclePeers(),
    getTranslations("app"),
  ]);

  return (
    <PageContainer className="grid gap-8 pt-6 pb-28 md:pt-12 md:pb-14 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex min-w-0 flex-col gap-5">
        <div className="relative">
          <Greeting penName={user.penName} />
          <LeafDecor variant="right" className="-top-10 end-6 -z-10 w-28 opacity-40" />
        </div>
        <CheckInCard />
        <Composer user={user} />

        <section aria-labelledby="feed-title" className="flex flex-col gap-4 pt-3">
          <div className="flex items-baseline justify-between gap-4 px-1">
            <h2 id="feed-title" className="text-xl font-bold">
              {t("feed.title")}
            </h2>
            <Link href={routes.stories} className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-primary-solid">
              {t("feed.seeAll")}
              <DirectionalArrow />
            </Link>
          </div>
          {feed.length > 0 ? (
            <ul className="flex flex-col gap-4">
              {feed.map((story) => (
                <li key={story.id}>
                  <FeedStoryCard story={story} now={now} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-[1.75rem] bg-surface p-6 text-center shadow-card">{t("feed.empty")}</p>
          )}
        </section>
        <p className="pt-2 text-center text-xs text-muted italic lg:hidden">{t("disclaimer")}</p>
      </div>

      <aside className="hidden flex-col gap-5 lg:flex">
        <ThoughtCard />
        <NotAloneCard peers={peers} />
        <DiscoverCircles circles={circles} />
        <p className="px-1 text-xs text-muted italic">{t("disclaimer")}</p>
      </aside>
    </PageContainer>
  );
}
