import Image from "next/image";
import Link from "next/link";
import { getFormatter, getTranslations } from "next-intl/server";
import { DirectionalArrow } from "@/components/ui/DirectionalArrow";
import { routes } from "@/lib/routes";
import type { CircleSuggestion } from "@/types/community";
import { JoinButton } from "./JoinButton";

export async function DiscoverCircles({ circles }: { circles: CircleSuggestion[] }) {
  const [t, format] = await Promise.all([getTranslations("app.discover"), getFormatter()]);

  return (
    <section aria-labelledby="discover-title" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-4 px-1">
        <h2 id="discover-title" className="text-xl font-bold">
          {t("title")}
        </h2>
        <Link href={routes.communities} className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-primary-solid">
          {t("seeAll")}
          <DirectionalArrow />
        </Link>
      </div>
      <ul className="divide-y divide-border rounded-[1.75rem] bg-surface px-5 shadow-card">
        {circles.map((circle) => (
          <li key={circle.id} className="flex items-center gap-4 py-4">
            <span className="size-12 shrink-0 overflow-hidden rounded-full bg-sage-tint">
              <Image src={circle.illustrationUrl} alt="" width={48} height={62} className="size-full object-cover object-top" />
            </span>
            <div className="min-w-0 flex-1">
              <Link href={routes.community(circle.slug)} className="font-bold text-ink hover:underline">
                {circle.name}
              </Link>
              <p className="text-sm text-muted">
                {t("members", { count: circle.memberCount, formatted: format.number(circle.memberCount, { notation: "compact" }) })}
              </p>
            </div>
            <JoinButton circleId={circle.id} label={t("join")} joinedLabel={t("joined")} />
          </li>
        ))}
      </ul>
    </section>
  );
}
