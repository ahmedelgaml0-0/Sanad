import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import { AppShell } from "./_components/AppShell";
import { AppShellFallback } from "./_components/AppShellFallback";

// Signed-in pages are personal: keep them out of search engines.
export const metadata: Metadata = { robots: { index: false, follow: false } };

// Reading the session cookie makes this per-request, so it streams inside Suspense while the static parts don't wait.
export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AppShellFallback />}>
      <AppShell>{children}</AppShell>
    </Suspense>
  );
}
