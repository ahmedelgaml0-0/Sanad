import { CircleCheck } from "lucide-react";
import type { ReactNode } from "react";

// The calm counterpart of FormAlert: good news. role="status" is announced without interrupting.
export function FormNotice({ children }: { children: ReactNode }) {
  return (
    <div role="status" className="flex items-start gap-3 rounded-2xl border border-primary-solid/25 bg-sage-tint px-4 py-3 text-sm text-forest">
      <CircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div>{children}</div>
    </div>
  );
}
