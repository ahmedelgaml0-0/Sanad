"use client";

import { saveCheckIn } from "@/lib/api/checkins";
import { useApiAction } from "../useApiAction";

export function useSaveCheckIn() {
  const { run, loading, errorKey } = useApiAction(saveCheckIn);
  return { save: run, loading, errorKey };
}
