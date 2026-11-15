import Image from "next/image";
import { getTranslations } from "next-intl/server";
import leaf from "@/public/images/landing/leaf-right.webp";

export async function ThoughtCard() {
  const t = await getTranslations("app");

  return (
    <figure className="relative overflow-hidden rounded-[1.75rem] bg-panel/70 p-6 pe-28">
      <blockquote className="text-[17px] leading-relaxed text-ink">{t("thought")}</blockquote>
      <Image src={leaf} alt="" sizes="96px" className="pointer-events-none absolute end-2 top-1/2 h-auto w-24 -translate-y-1/2 opacity-80" />
    </figure>
  );
}
