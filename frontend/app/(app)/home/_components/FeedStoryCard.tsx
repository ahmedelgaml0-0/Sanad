import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { getFormatter, getTranslations } from "next-intl/server";
import { Avatar } from "@/components/ui/Avatar";
import { routes } from "@/lib/routes";
import type { FeedStory } from "@/types/story";
import { ReactionButton } from "./ReactionButton";
import { SaveButton } from "./SaveButton";

// Server component: only the buttons that react to taps are client components.
export async function FeedStoryCard({ story, now }: { story: FeedStory; now: Date }) {
  const [t, format] = await Promise.all([getTranslations("app.feed"), getFormatter()]);

  return (
    <article className="flex gap-5 rounded-[1.75rem] bg-surface p-5 shadow-card sm:p-6">
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={story.author.penName} src={story.author.avatarUrl} size={40} />
          <div className="min-w-0">
            <p className="font-bold text-ink">{story.author.penName}</p>
            <p className="truncate text-xs text-muted">
              {t.rich("meta", {
                when: format.relativeTime(new Date(story.createdAt), { now, style: "narrow" }),
                circleName: story.circle.name,
                time: (chunks) => <time dateTime={story.createdAt}>{chunks}</time>,
                circle: (chunks) => (
                  <Link href={routes.community(story.circle.slug)} className="hover:text-ink hover:underline">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg leading-snug font-bold">
            <Link href={routes.story(story.slug)} className="hover:underline hover:underline-offset-4">
              {story.title}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed">{story.excerpt}</p>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          <ReactionButton storyId={story.id} kind="relate" count={story.reactions.relate} initiallyOn={story.viewer.relates} />
          <ReactionButton storyId={story.id} kind="support" count={story.reactions.support} initiallyOn={story.viewer.supports} />
          <div className="ms-auto flex items-center gap-1 sm:ms-2">
            <Link
              href={`${routes.story(story.slug)}#replies`}
              aria-label={t("replies", { count: story.commentCount })}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-semibold text-olive-ink hover:bg-background hover:text-ink"
            >
              <MessageCircle aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
              <span aria-hidden="true">{story.commentCount}</span>
            </Link>
            <SaveButton storyId={story.id} initiallySaved={story.viewer.saved} label={t("save")} />
          </div>
        </div>
      </div>

      {story.imageUrl && (
        <Image
          src={story.imageUrl}
          alt=""
          width={176}
          height={152}
          className="hidden h-38 w-44 shrink-0 self-center rounded-2xl object-cover sm:block"
        />
      )}
    </article>
  );
}
