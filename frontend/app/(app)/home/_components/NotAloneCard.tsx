import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Avatar } from "@/components/ui/Avatar";
import { DirectionalArrow } from "@/components/ui/DirectionalArrow";
import { routes } from "@/lib/routes";
import type { CirclePeer } from "@/types/community";
import sprout from "@/public/images/landing/leaf-left.webp";

export async function NotAloneCard({ peers }: { peers: CirclePeer[] }) {
  const t = await getTranslations("app.notAlone");

  return (
    <section aria-labelledby="not-alone-title" className="flex items-center gap-5 rounded-[1.75rem] bg-sage-tint p-6">
      <Image src={sprout} alt="" sizes="64px" className="h-auto w-16 shrink-0 opacity-90" />
      <div className="flex flex-col gap-2 border-s border-border ps-5">
        <h2 id="not-alone-title" className="text-lg font-bold">
          {t("title")}
        </h2>
        <p className="text-sm leading-relaxed">{t("text")}</p>
        <div className="mt-1 flex items-center gap-3">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {peers.map((peer) => (
              <Avatar key={peer.penName} name={peer.penName} src={peer.avatarUrl} size={32} className="text-[10px] ring-2 ring-sage-tint" />
            ))}
          </div>
          <Link href={routes.communities} className="grid size-9 place-items-center rounded-full bg-surface text-ink hover:bg-background">
            <DirectionalArrow />
            <span className="sr-only">{t("cta")}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
