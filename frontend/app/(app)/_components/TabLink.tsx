"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useIsActive } from "./useIsActive";

type TabLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
  unreadLabel?: string;
};

export function TabLink({ href, label, icon, unreadLabel }: TabLinkProps) {
  const active = useIsActive(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-12 flex-col items-center justify-center gap-1 text-[11px] font-semibold ${active ? "text-forest" : "text-muted"}`}
    >
      <span className="relative">
        {icon}
        {unreadLabel && <span aria-hidden="true" className="absolute -end-1 -top-0.5 size-2.5 rounded-full bg-notify ring-2 ring-surface" />}
      </span>
      {label}
      {unreadLabel && <span className="sr-only">, {unreadLabel}</span>}
    </Link>
  );
}
