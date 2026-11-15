"use client";

import { useRef, useState } from "react";

// Optimistic toggle: flip on screen at once, send in the background, flip back only if the request fails.
export function useToggleAction(initial: boolean, action: (next: boolean) => Promise<unknown>) {
  const [on, setOn] = useState(initial);
  const pending = useRef(false);

  async function toggle() {
    // Ignore taps while a request is in flight, so fast double-taps can't race each other.
    if (pending.current) return;
    const next = !on;
    setOn(next);
    pending.current = true;
    try {
      await action(next);
    } catch {
      setOn(!next);
    } finally {
      pending.current = false;
    }
  }

  return { on, toggle };
}
