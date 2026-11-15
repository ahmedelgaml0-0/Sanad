"use client";

import { usePathname } from "next/navigation";

// A nav item stays highlighted on its sub-pages too (/messages/123 keeps "Messages" active).
export function useIsActive(href: string): boolean {
  const pathname = usePathname();
  return pathname === href || pathname.startsWith(`${href}/`);
}
