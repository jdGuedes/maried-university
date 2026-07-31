import type { ReactNode } from "react";
import { WifiOff } from "lucide-react";

export function OfflineState({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[var(--maried-radius-xl)] border border-[rgba(173,107,31,0.24)] bg-white/40 p-6" role="status">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-[var(--maried-radius-full)] bg-[rgba(173,107,31,0.12)] text-[var(--maried-color-warning)]">
          <WifiOff aria-hidden="true" size={20} />
        </span>
        <div>
          <p className="m-0 font-semibold text-[var(--maried-color-text-primary)]">{title}</p>
          <div className="mt-1 text-sm leading-6 text-[var(--maried-color-text-secondary)]">{children}</div>
        </div>
      </div>
    </div>
  );
}
