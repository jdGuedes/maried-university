import type { ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

export function SuccessState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[var(--maried-radius-xl)] border border-[rgba(47,125,87,0.22)] bg-white/40 p-6" role="status">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-[var(--maried-radius-full)] bg-[rgba(47,125,87,0.10)] text-[var(--maried-color-success)]">
          <CheckCircle2 aria-hidden="true" size={20} />
        </span>
        <div>
          <p className="m-0 font-semibold text-[var(--maried-color-text-primary)]">{title}</p>
          <div className="mt-1 text-sm leading-6 text-[var(--maried-color-text-secondary)]">{children}</div>
        </div>
      </div>
    </div>
  );
}
