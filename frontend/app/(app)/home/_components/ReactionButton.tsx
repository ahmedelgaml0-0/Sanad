"use client";

import { HandHeart, Leaf } from "lucide-react";
import { useTranslations } from "next-intl";
import { useToggleAction } from "@/hooks/useToggleAction";
import { setReaction } from "@/lib/api/stories";
import type { ReactionKind } from "@/types/story";

const looks = {
  relate: { Icon: Leaf, message: "relateCount", on: "bg-sage text-on-solid" },
  support: { Icon: HandHeart, message: "supportCount", on: "bg-peach text-peach-ink" },
} as const;

type ReactionButtonProps = {
  storyId: string;
  kind: ReactionKind;
  count: number;
  initiallyOn: boolean;
};

export function ReactionButton({ storyId, kind, count, initiallyOn }: ReactionButtonProps) {
  const t = useTranslations("app.feed");
  const { on, toggle } = useToggleAction(initiallyOn, (next) => setReaction(storyId, kind, next));
  const { Icon, message, on: onStyle } = looks[kind];
  // The server's count already includes this person's reaction if they had one.
  const shown = count + (on ? 1 : 0) - (initiallyOn ? 1 : 0);

  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={toggle}
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-colors ${on ? onStyle : "bg-background text-body hover:bg-cream hover:text-ink"}`}
    >
      <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
      {t(message, { count: shown })}
    </button>
  );
}
