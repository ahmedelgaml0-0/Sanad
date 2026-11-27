"use client";

import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { FormAlert } from "@/components/ui/FormAlert";
import { MoodFace } from "@/components/ui/MoodFace";
import { useSaveCheckIn } from "@/hooks/checkins/useSaveCheckIn";
import { MOODS, type Mood } from "@/types/checkin";

const NOTE_MAX = 500;

export function CheckInCard() {
  const t = useTranslations("app.checkIn");
  const tErrors = useTranslations("auth.errors");
  const { save, loading, errorKey } = useSaveCheckIn();
  const [mood, setMood] = useState<Mood | null>(null);
  const [note, setNote] = useState("");
  const [needsMood, setNeedsMood] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mood) {
      setNeedsMood(true);
      return;
    }
    if (await save({ mood, note: note.trim() })) setSaved(true);
  }

  return (
    <section aria-labelledby="checkin-title" className="rounded-[1.75rem] bg-surface p-5 shadow-card sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <h2 id="checkin-title" className="text-lg font-bold">
          {t("title")}
        </h2>
        <p className="flex shrink-0 items-center gap-1.5 pt-1 text-xs text-muted">
          <Lock aria-hidden="true" className="size-3.5" />
          {t("privacy")}
        </p>
      </div>

      {saved && mood ? (
        // Once saved, the card shrinks to one line instead of asking the same question all day.
        <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl bg-background px-4 py-3">
          <p className="flex items-center gap-3 text-ink">
            <MoodFace mood={mood} size={30} />
            {t("saved", { mood: t(`moods.${mood}`) })}
          </p>
          <button type="button" onClick={() => setSaved(false)} className="min-h-11 px-2 text-sm font-semibold text-ink underline underline-offset-4 hover:text-primary-solid">
            {t("edit")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-4">
          {/* Real radio inputs: arrow keys, one choice, and screen-reader support come for free. */}
          <fieldset aria-describedby={needsMood ? "mood-error" : undefined}>
            <legend className="sr-only">{t("title")}</legend>
            <div className="grid grid-cols-5 gap-1 sm:flex sm:gap-6">
              {MOODS.map((value) => (
                <label key={value} className="flex cursor-pointer flex-col items-center gap-1.5 text-center text-sm">
                  <input
                    type="radio"
                    name="mood"
                    value={value}
                    checked={mood === value}
                    onChange={() => {
                      setMood(value);
                      setNeedsMood(false);
                    }}
                    className="peer sr-only"
                  />
                  <span className="grid size-12 place-items-center rounded-full ring-2 ring-transparent transition peer-checked:ring-primary-solid peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-solid hover:bg-background">
                    <MoodFace mood={value} />
                  </span>
                  <span className="text-body peer-checked:font-bold peer-checked:text-ink">{t(`moods.${value}`)}</span>
                </label>
              ))}
            </div>
          </fieldset>
          {needsMood && (
            <p id="mood-error" role="alert" className="text-sm text-danger">
              {t("pickMood")}
            </p>
          )}
          {errorKey && <FormAlert>{tErrors(errorKey)}</FormAlert>}

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative flex-1">
              <span className="sr-only">{t("noteLabel")}</span>
              <Lock aria-hidden="true" className="pointer-events-none absolute start-4 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={NOTE_MAX}
                placeholder={t("notePlaceholder")}
                className="h-11 w-full rounded-full border border-border bg-background ps-11 pe-4 text-sm text-ink placeholder:text-muted"
              />
            </label>
            <Button type="submit" loading={loading} loadingLabel={t("saving")}>
              {t("save")}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
