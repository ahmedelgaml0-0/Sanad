import type { ReactNode } from "react";

// The frame every signed-in page sits in. It starts beside the rail instead of centring:
// the gap (--app-gap, set in AppShell) grows with the screen but stops at a little more than the rail's width.
export function PageContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`w-full max-w-6xl ps-(--app-gap) pe-4 sm:pe-6 lg:pe-10 2xl:max-w-7xl ${className}`}>{children}</div>;
}
