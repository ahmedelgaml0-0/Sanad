"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { railLabel, railRow } from "./navStyles";
import { useIsActive } from "./useIsActive";

type RailLinkProps = {
  href: string;
  label: string;
  icon: ReactNode;
  unreadLabel?: string;
};

export function RailLink({ href, label, icon, unreadLabel }: RailLinkProps) {
  const active = useIsActive(href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`${railRow} ${active ? "bg-sage-tint text-ink" : "text-olive-ink hover:bg-cream hover:text-ink"}`}
    >
      <span className="relative grid size-6 shrink-0 place-items-center">
        {icon}
        {unreadLabel && <span aria-hidden="true" className="absolute -end-0.5 -top-0.5 size-2.5 rounded-full bg-notify ring-2 ring-surface" />}
      </span>
      <span className={`${railLabel} text-[15px] font-semibold text-ink`}>
        {label}
        {unreadLabel && <span className="sr-only">, {unreadLabel}</span>}
      </span>
    </Link>
  );
}
