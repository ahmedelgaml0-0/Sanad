"use client";

import { Bookmark } from "lucide-react";
import { useToggleAction } from "@/hooks/useToggleAction";
import { setSaved } from "@/lib/api/stories";

export function SaveButton({ storyId, initiallySaved, label }: { storyId: string; initiallySaved: boolean; label: string }) {
  const { on, toggle } = useToggleAction(initiallySaved, (next) => setSaved(storyId, next));

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={label}
      onClick={toggle}
      className="grid size-9 place-items-center rounded-full text-olive-ink transition-colors hover:bg-background hover:text-ink aria-pressed:text-forest"
    >
      <Bookmark aria-hidden="true" className={`size-[18px] ${on ? "fill-current" : ""}`} strokeWidth={1.75} />
    </button>
  );
}
