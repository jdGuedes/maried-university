import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

export function ErrorState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[var(--maried-radius-xl)] border border-[rgba(170,63,58,0.24)] bg-white/40 p-6" role="alert">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-[var(--maried-radius-full)] bg-[rgba(170,63,58,0.10)] text-[var(--maried-color-danger)]">
          <AlertTriangle aria-hidden="true" size={20} />
        </span>
        <div>
          <p className="m-0 font-semibold text-[var(--maried-color-text-primary)]">{title}</p>
          <div className="mt-1 text-sm leading-6 text-[var(--maried-color-text-secondary)]">{children}</div>
        </div>
      </div>
    </div>
  );
}
