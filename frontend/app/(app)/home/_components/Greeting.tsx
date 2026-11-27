"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun, Sunset } from "lucide-react";
import { useTranslations } from "next-intl";

type Period = "morning" | "afternoon" | "evening" | "night";

const icons = { morning: Sun, afternoon: Sun, evening: Sunset, night: Moon };

function periodOf(hour: number): Period {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

const subscribe = () => () => {};

// The time of day belongs to the reader's clock, which the server doesn't know.
// The server renders nothing visible (null hour); the browser fills in its own hour and fades the greeting in.
export function Greeting({ penName }: { penName: string }) {
  const t = useTranslations("app.greeting");
  const hour = useSyncExternalStore(subscribe, () => new Date().getHours(), () => null);
  const period = hour === null ? null : periodOf(hour);
  const Icon = period ? icons[period] : Sun;

  return (
    <header className="relative flex flex-col gap-1.5">
      <h1
        className={`flex items-center gap-3 font-serif text-3xl leading-tight font-medium transition-opacity duration-500 sm:text-4xl lg:text-[2.6rem] motion-reduce:transition-none ${period ? "opacity-100" : "opacity-0"}`}
      >
        {t(period === "night" ? "evening" : (period ?? "hello"), { name: penName })}
        <Icon aria-hidden="true" className={`size-7 shrink-0 ${period === "night" ? "text-gold" : "fill-sun text-gold-light"}`} strokeWidth={1.5} />
      </h1>
      <p className="text-lg">{t("subtitle")}</p>
    </header>
  );
}
