"use client";

import { LogOut } from "lucide-react";
import { useSignOut } from "@/hooks/auth/useSignOut";
import { railLabel, railRow } from "./navStyles";

export function SignOutButton({ label, loadingLabel }: { label: string; loadingLabel: string }) {
  const { signOut, loading } = useSignOut();

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className={`${railRow} text-olive-ink hover:bg-cream hover:text-ink disabled:opacity-60`}
    >
      <LogOut aria-hidden="true" className="size-6 shrink-0 rtl:-scale-x-100" strokeWidth={1.75} />
      <span className={`${railLabel} text-[15px] font-semibold text-ink`}>{loading ? loadingLabel : label}</span>
    </button>
  );
}
