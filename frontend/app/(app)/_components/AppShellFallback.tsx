import { PageContainer } from "./PageContainer";

// Shown for the moment the server is checking the session: the rail and a calm empty page, not a spinner.
export function AppShellFallback() {
  return (
    <div className="min-h-screen [--app-gap:1rem] sm:[--app-gap:1.5rem] md:ps-20 md:[--app-gap:clamp(2rem,calc((100vw_-_76rem)_/_2),6rem)]">
      <div aria-hidden="true" className="fixed inset-y-0 start-0 hidden w-20 border-e border-border bg-surface md:block" />
      <PageContainer className="flex flex-col gap-5 pt-12">
        <div className="h-11 w-72 max-w-full animate-pulse rounded-full bg-cream motion-reduce:animate-none" />
        <div className="h-48 animate-pulse rounded-[1.75rem] bg-surface motion-reduce:animate-none lg:me-[22rem]" />
      </PageContainer>
    </div>
  );
}
