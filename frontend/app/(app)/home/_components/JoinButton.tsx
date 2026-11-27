"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { joinCircle } from "@/lib/api/circles";

// Soft, not solid: the page's one strong button is "Save check-in".
export function JoinButton({ circleId, label, joinedLabel }: { circleId: string; label: string; joinedLabel: string }) {
  const [state, setState] = useState<"idle" | "joining" | "joined">("idle");

  async function join() {
    setState("joining");
    try {
      await joinCircle(circleId);
      setState("joined");
    } catch {
      setState("idle");
    }
  }

  if (state === "joined") {
    return (
      <span className="inline-flex min-h-9 items-center gap-1 px-2 text-sm font-semibold text-forest">
        <Check aria-hidden="true" className="size-4" />
        {joinedLabel}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={join}
      disabled={state === "joining"}
      className="min-h-9 rounded-full bg-sage-tint px-4 text-sm font-bold text-ink transition-colors hover:bg-cream disabled:opacity-60"
    >
      {label}
    </button>
  );
}
