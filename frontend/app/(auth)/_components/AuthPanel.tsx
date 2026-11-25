import type { ReactNode, Ref } from "react";

type AuthPanelProps = {
  title: ReactNode;
  subtitle: ReactNode;
  children: ReactNode;
  // Lets a page move focus to the heading when its content changes (e.g. a form turning into "check your email").
  headingRef?: Ref<HTMLHeadingElement>;
  // Short panels sit at the top of the row instead of floating mid-height beside the tall illustration (see the auth layout).
  alignTop?: boolean;
};

// The content sits in a tonal panel (slightly darker than the page, no shadow) on every screen size: on phones it's what
// separates the form from the pictures above and below it. Padding and corners just shrink on small screens.
// Inside the panel "muted" text is swapped for the body colour: plain muted grey drops below 4.5:1 contrast on the darker panel.
export function AuthPanel({ title, subtitle, children, headingRef, alignTop = false }: AuthPanelProps) {
  return (
    <div
      data-align-top={alignTop || undefined}
      className="flex flex-col gap-6 rounded-[1.75rem] border border-border bg-panel p-5 [--color-muted:var(--color-body)] sm:p-8 lg:rounded-[2rem] lg:p-10"
    >
      <div className="flex flex-col gap-2">
        {/* Slightly smaller inside the panel so "Join the community" stays on one line. */}
        <h1 ref={headingRef} tabIndex={headingRef ? -1 : undefined} className="font-serif text-4xl leading-tight outline-none sm:text-5xl lg:text-[2.625rem]">
          {title}
        </h1>
        <p className="text-lg">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
